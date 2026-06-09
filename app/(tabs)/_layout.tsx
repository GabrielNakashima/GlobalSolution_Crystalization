import React, { useMemo } from 'react';
import { Tabs } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { colors } from '../../src/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ViewStyle, Platform } from 'react-native';

export default function TabLayout() {
  const { isDarkMode } = useApp();

  const theme = useMemo(() => (isDarkMode ? colors.dark : colors.light), [isDarkMode]);

  const tabBarStyle: ViewStyle = {
    backgroundColor: theme.card,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    height: Platform.OS === 'ios' ? 85 : 70,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  };

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          tabBarStyle,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          headerStyle: { 
            backgroundColor: theme.card,
            shadowOpacity: 0, 
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
          },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Mapeamento', tabBarIcon: ({ color, size, focused }) => ( <Ionicons name={focused ? "planet" : "planet-outline"} size={size + 2} color={color} /> ) }} />
        <Tabs.Screen name="analytics" options={{ title: 'Análises', tabBarIcon: ({ color, size, focused }) => ( <Ionicons name={focused ? "bar-chart" : "bar-chart-outline"} size={size + 2} color={color} /> ) }} />
        <Tabs.Screen name="ai-prediction" options={{ title: 'Predição via IA', tabBarIcon: ({ color, size, focused }) => ( <Ionicons name={focused ? "hardware-chip" : "hardware-chip-outline"} size={size + 2} color={color} /> ) }} />
        <Tabs.Screen name="settings" options={{ title: 'Configurações', tabBarIcon: ({ color, size, focused }) => ( <Ionicons name={focused ? "settings" : "settings-outline"} size={size + 2} color={color} /> ) }} />
      </Tabs>
    </>
  );
}