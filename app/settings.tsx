import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { useApp } from '../src/context/AppContext';

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useApp();

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: isDarkMode ? '#0B0E14' : '#F4F6F9', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#0B0E14', marginBottom: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDarkMode ? '#131A26' : '#FFFFFF', padding: 15, borderRadius: 12 }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <View style={styles.row}>
        <Text style={{ color: isDarkMode ? '#FFF' : '#000', fontSize: 16 }}>Alternar entre dark e light mode</Text>
        <Switch trackColor={{ false: '#767577', true: '#4CC9F0' }} thumbColor={isDarkMode ? '#FFF' : '#f4f3f4'} onValueChange={toggleTheme} value={isDarkMode} />
      </View>
    </View>
  );
}