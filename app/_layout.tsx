import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AppProvider, useApp } from '../src/context/AppContext';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { colors } from '../src/constants/theme';
import { ActivityIndicator, View } from 'react-native';

import { setupFetchInterceptor } from '../src/utils/setupFetchInterceptor';
setupFetchInterceptor();

function RootNavigation() {
  const { user, isLoading } = useAuth();
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? colors.dark : colors.light;
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (!user && inAuthGroup) {
      router.replace('/login');
    } else if (user && segments[0] !== '(tabs)') {
      router.replace('/'); 
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <RootNavigation />
      </AppProvider>
    </AuthProvider>
  );
}