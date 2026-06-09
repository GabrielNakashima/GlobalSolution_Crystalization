import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity } from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useApp();
  const { logout } = useAuth();
  const theme = isDarkMode ? colors.dark : colors.light;
  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferências</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aparência do Sistema</Text>
        
        <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={toggleTheme}>
          <View style={styles.rowLeft}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#1A202C' : '#E6F4FE' }]}>
              <Ionicons name={isDarkMode ? "moon" : "sunny"} size={18} color={isDarkMode ? "#A0AEC0" : theme.primary} />
            </View>
            <View>
              <Text style={styles.rowTitle}>Modo Escuro</Text>
              <Text style={styles.rowSubtitle}>Ativa a interface de baixa luz</Text>
            </View>
          </View>
          <Switch 
            trackColor={{ false: '#CBD5E1', true: theme.primary }} 
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
            <View style={[styles.iconContainer, { backgroundColor: theme.error + '20' }]}>
              <Ionicons name="log-out-outline" size={18} color={theme.error} />
            </View>
            <View>
              <Text style={[styles.rowTitle, { color: theme.error }]}>Encerrar Sessão</Text>
              <Text style={styles.rowSubtitle}>Desconectar do painel de controle</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (isDarkMode: boolean) => {
  const theme = isDarkMode ? colors.dark : colors.light;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, padding: 24 },
    title: { fontSize: 28, fontWeight: '800', color: theme.text, marginBottom: 32, letterSpacing: -0.5 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 13, fontWeight: '700', color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.card, padding: 16, borderRadius: 16, shadowColor: isDarkMode ? '#000' : '#CBD5E1', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2, borderWidth: isDarkMode ? 1 : 0, borderColor: theme.border },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    rowTitle: { color: theme.text, fontSize: 16, fontWeight: '600' },
    rowSubtitle: { color: theme.textSecondary, fontSize: 13, marginTop: 2 }
  });
};