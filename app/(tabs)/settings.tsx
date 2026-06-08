import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity } from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { useAuth } from '../../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useApp();
  const { logout } = useAuth();
  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferências</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aparência do Sistema</Text>
        
        <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={toggleTheme}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#1A202C' : '#E6F4FE' }]}>
              <Ionicons name={isDarkMode ? "moon" : "sunny"} size={18} color={isDarkMode ? "#A0AEC0" : "#4CC9F0"} />
            </View>
            <View>
              <Text style={styles.rowTitle}>Modo Escuro</Text>
              <Text style={styles.rowSubtitle}>Ativa a interface de baixa luz</Text>
            </View>
          </View>
          <Switch 
            trackColor={{ false: '#CBD5E1', true: '#4CC9F0' }} 
            thumbColor={'#FFFFFF'} 
            ios_backgroundColor="#CBD5E1"
            onValueChange={toggleTheme} 
            value={isDarkMode} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sessão</Text>
        
        <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={logout}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconContainer, { backgroundColor: '#E6394620' }]}>
              <Ionicons name="log-out-outline" size={18} color="#E63946" />
            </View>
            <View>
              <Text style={[styles.rowTitle, { color: '#E63946' }]}>Encerrar Sessão</Text>
              <Text style={styles.rowSubtitle}>Desconectar do painel de controle</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: isDarkMode ? '#0B0E14' : '#F4F6F9', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: isDarkMode ? '#FFFFFF' : '#1A202C', marginBottom: 32, letterSpacing: -0.5 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#8892B0', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDarkMode ? '#131A26' : '#FFFFFF', padding: 16, borderRadius: 16, shadowColor: isDarkMode ? '#000' : '#CBD5E1', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2, borderWidth: isDarkMode ? 1 : 0, borderColor: '#232D3F' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  rowTitle: { color: isDarkMode ? '#FFFFFF' : '#1A202C', fontSize: 16, fontWeight: '600' },
  rowSubtitle: { color: isDarkMode ? '#8892B0' : '#718096', fontSize: 13, marginTop: 2 }
});