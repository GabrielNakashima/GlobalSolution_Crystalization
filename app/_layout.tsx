import React from 'react';
import { Tabs } from 'expo-router';
import { AppProvider, useApp } from '../src/context/AppContext';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

function TabLayout() {
  const { isDarkMode } = useApp();

  const themeColors = {
    bg: isDarkMode ? '#0B0E14' : '#F4F6F9',
    text: isDarkMode ? '#FFFFFF' : '#0B0E14',
    tabBg: isDarkMode ? '#131A26' : '#FFFFFF',
    active: '#4CC9F0', // Azul Ciano espacial
    inactive: '#8892B0',
  };

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          tabBarStyle: { 
            backgroundColor: themeColors.tabBg, 
            borderTopWidth: 0, 
            height: 70, // Aumentado para acomodar ícone + texto confortavelmente
            paddingBottom: 10,
            paddingTop: 5,
          },
          tabBarActiveTintColor: themeColors.active,
          tabBarInactiveTintColor: themeColors.inactive,
          headerStyle: { backgroundColor: themeColors.tabBg },
          headerTintColor: themeColors.text,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Mapeamento',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "planet" : "planet-outline"} size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Análises',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "bar-chart" : "bar-chart-outline"} size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="ai-prediction"
          options={{
            title: 'Predição via IA',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: 'Configurações',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "settings" : "settings-outline"} size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <TabLayout />
    </AppProvider>
  );
}