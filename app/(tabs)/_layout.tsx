import React, { useMemo } from 'react';
import { Tabs } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ViewStyle, Platform } from 'react-native';

export default function TabLayout() {
  const { isDarkMode } = useApp();

  const themeColors = useMemo(() => ({
    bg: isDarkMode ? '#0B0E14' : '#F4F6F9',
    text: isDarkMode ? '#FFFFFF' : '#0B0E14',
    tabBg: isDarkMode ? '#131A26' : '#FFFFFF',
    active: '#4CC9F0', 
    inactive: '#8892B0',
    border: isDarkMode ? '#232D3F' : '#E2E8F0',
  }), [isDarkMode]);

  const tabBarStyle: ViewStyle = {
    backgroundColor: themeColors.tabBg,
    borderTopWidth: 1,
    borderTopColor: themeColors.border,
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
          tabBarActiveTintColor: themeColors.active,
          tabBarInactiveTintColor: themeColors.inactive,
          headerStyle: { 
            backgroundColor: themeColors.tabBg,
            shadowOpacity: 0, 
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border,
          },
          headerTintColor: themeColors.text,
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Mapeamento',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "planet" : "planet-outline"} size={size + 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Análises',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "bar-chart" : "bar-chart-outline"} size={size + 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="ai-prediction"
          options={{
            title: 'Predição via IA',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "hardware-chip" : "hardware-chip-outline"} size={size + 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Configurações',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "settings" : "settings-outline"} size={size + 2} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}