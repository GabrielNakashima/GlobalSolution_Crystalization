import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, Text, TextInput, TouchableOpacity, Alert, 
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, View 
} from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { colors } from '../../src/constants/theme';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NewMissionForm() {
  const { isDarkMode, addMission } = useApp();
  const router = useRouter();
  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);

  const [molecule, setMolecule] = useState('');
  const [concentration, setConcentration] = useState('');
  const [ph, setPh] = useState('');
  const [temperature, setTemperature] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmission = async () => {
    if (!molecule || !concentration || !ph || !temperature) {
      Alert.alert('Erro', 'Todos os parâmetros moleculares são obrigatórios.');
      return;
    }

    const phValue = parseFloat(ph);
    const concValue = parseFloat(concentration);
    const tempValue = parseFloat(temperature);

    if (isNaN(phValue) || phValue < 0 || phValue > 14) {
      Alert.alert('Erro de Validação', 'O pH deve ser um valor numérico válido entre 0 e 14.');
      return;
    }

    if (isNaN(concValue) || isNaN(tempValue)) {
      Alert.alert('Erro de Validação', 'A concentração e a temperatura devem conter apenas valores numéricos.');
      return;
    }

    setSending(true);
    const success = await addMission({ molecule, concentration, ph, temperature });
    setSending(false);

    if (success) {
      Alert.alert('Sucesso', 'Salvo no Banco de Dados! A IA iniciou o processamento do Diagrama de Fases.', [
        { text: 'Acompanhar Missão', onPress: () => router.push('/') }
      ]);
      setMolecule(''); setConcentration(''); setPh(''); setTemperature('');
    } else {
      Alert.alert('Erro', 'Ocorreu uma falha ao registrar na API SOA.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Solicitar Análise</Text>
        <Text style={styles.subtitle}>Insira os dados do payload para o motor de inferência orbital.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome da Proteína / Alvo</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex.: Insulin Variant B" 
            placeholderTextColor={styles.subtitle.color} 
            value={molecule} 
            onChangeText={setMolecule} 
            editable={!sending}
          />

          <Text style={styles.label}>Concentração Alvo (mg/ml)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex.: 12.5" 
            keyboardType="decimal-pad" 
            placeholderTextColor={styles.subtitle.color} 
            value={concentration} 
            onChangeText={setConcentration} 
            editable={!sending}
          />

          <Text style={styles.label}>Potencial Hidrogeniônico (pH)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex.: 7.2" 
            keyboardType="decimal-pad" 
            placeholderTextColor={styles.subtitle.color} 
            value={ph} 
            onChangeText={setPh} 
            editable={!sending}
          />

          <Text style={styles.label}>Temperatura Ideal do Reator (°C)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex.: 20.0" 
            keyboardType="decimal-pad" 
            placeholderTextColor={styles.subtitle.color} 
            value={temperature} 
            onChangeText={setTemperature} 
            editable={!sending}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, sending && styles.buttonDisabled]} 
          onPress={handleSubmission} 
          disabled={sending}
          activeOpacity={0.8}
        >
          {sending ? (
            <ActivityIndicator color={styles.buttonText.color} style={styles.buttonIcon} />
          ) : (
            <Ionicons name="hardware-chip" size={20} color={styles.buttonText.color} style={styles.buttonIcon} />
          )}
          <Text style={styles.buttonText}>
            {sending ? 'Validando e Gravando...' : 'Iniciar Análise da IA'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDarkMode: boolean) => {
  const theme = isDarkMode ? colors.dark : colors.light;
  return StyleSheet.create({
    keyboardContainer: { 
      flex: 1,
      backgroundColor: theme.background,
    },
    container: { 
      flex: 1, 
    },
    scrollContent: {
      padding: 24,
      paddingBottom: 40
    },
    title: { 
      fontSize: 28, 
      fontWeight: '800', 
      color: theme.text, 
      marginBottom: 8,
      letterSpacing: -0.5
    },
    subtitle: {
      fontSize: 15,
      color: theme.textSecondary,
      marginBottom: 32,
      lineHeight: 22
    },
    formGroup: {
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 16,
      marginBottom: 24,
      shadowColor: isDarkMode ? '#000' : '#CBD5E1', 
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.1, 
      shadowRadius: 10, 
      elevation: 3,
      borderWidth: isDarkMode ? 1 : 0,
      borderColor: theme.border
    },
    label: { 
      color: theme.textSecondary, 
      marginBottom: 8, 
      fontSize: 13, 
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5
    },
    input: {
      backgroundColor: theme.background,
      color: theme.text,
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
      fontSize: 16,
      fontWeight: '500'
    },
    button: { 
      backgroundColor: theme.primary, 
      padding: 18, 
      borderRadius: 12, 
      alignItems: 'center', 
      flexDirection: 'row', 
      justifyContent: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonIcon: {
      marginRight: 10
    },
    buttonText: { 
      color: theme.background, 
      fontWeight: '800', 
      fontSize: 16,
      letterSpacing: 0.5
    }
  });
};