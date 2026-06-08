import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ActivityIndicator, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useApp } from '../src/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const { isDarkMode } = useApp();
  const { login } = useAuth();
  const router = useRouter();
  
  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos para continuar.');
      return;
    }

    setIsAuthenticating(true);
    
    const success = await login(email.trim(), password);
    
    setIsAuthenticating(false);

    if (success) {
      // Redireciona corretamente para a rota principal
      router.replace('/');
    } else {
      Alert.alert('Acesso Negado', 'Credenciais inválidas. Verifique os dados e tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Ionicons name="planet" size={64} color="#4CC9F0" style={styles.logoIcon} />
          <Text style={styles.title}>Acesso Restrito</Text>
          <Text style={styles.subtitle}>Painel de Controle de Cristalização</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Correio Eletrônico</Text>
          <TextInput 
            style={styles.input} 
            placeholder="admin@spacelab.com" 
            placeholderTextColor="#8892B0" 
            keyboardType="email-address"
            autoCapitalize="none"
            value={email} 
            onChangeText={setEmail} 
            editable={!isAuthenticating}
          />

          <Text style={styles.label}>Chave de Acesso</Text>
          <TextInput 
            style={styles.input} 
            placeholder="••••••••" 
            placeholderTextColor="#8892B0" 
            secureTextEntry
            value={password} 
            onChangeText={setPassword} 
            editable={!isAuthenticating}
          />

          <TouchableOpacity 
            style={[styles.button, isAuthenticating && styles.buttonDisabled]} 
            onPress={handleLogin} 
            disabled={isAuthenticating}
            activeOpacity={0.8}
          >
            {isAuthenticating ? (
              <ActivityIndicator color="#0B0E14" />
            ) : (
              <Text style={styles.buttonText}>Autenticar Sessão</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: isDarkMode ? '#0B0E14' : '#F4F6F9', 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoIcon: {
    marginBottom: 16,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: isDarkMode ? '#FFFFFF' : '#1A202C', 
    letterSpacing: -0.5,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 15,
    color: '#8892B0',
    fontWeight: '500'
  },
  formContainer: {
    backgroundColor: isDarkMode ? '#131A26' : '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    shadowColor: isDarkMode ? '#000' : '#CBD5E1', 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 16, 
    elevation: 5,
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: '#232D3F'
  },
  label: { 
    color: isDarkMode ? '#A0AEC0' : '#4A5568', 
    marginBottom: 8, 
    fontSize: 13, 
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  input: {
    backgroundColor: isDarkMode ? '#0B0E14' : '#F8FAFC',
    color: isDarkMode ? '#FFF' : '#1A202C',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: isDarkMode ? '#232D3F' : '#E2E8F0',
    fontSize: 16,
    fontWeight: '500'
  },
  button: { 
    backgroundColor: '#4CC9F0', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#4CC9F0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: { 
    color: '#0B0E14', 
    fontWeight: '800', 
    fontSize: 16,
    letterSpacing: 0.5
  }
});