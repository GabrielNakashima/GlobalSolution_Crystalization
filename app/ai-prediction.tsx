import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useApp } from '../src/context/AppContext';
import { useRouter } from 'expo-router';

export default function NewMissionForm() {
  const { isDarkMode, addMission } = useApp();
  const router = useRouter();

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
        { text: 'OK', onPress: () => router.push('/') }
      ]);
      setMolecule(''); setConcentration(''); setPh(''); setTemperature('');
    } else {
      Alert.alert('Erro', 'Ocorreu uma falha ao registrar na API SOA.');
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: isDarkMode ? '#0B0E14' : '#F4F6F9', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#0B0E14', marginBottom: 20 },
    label: { color: isDarkMode ? '#8892B0' : '#4A5568', marginBottom: 5, fontSize: 14, fontWeight: '600' },
    input: {
      backgroundColor: isDarkMode ? '#131A26' : '#FFFFFF',
      color: isDarkMode ? '#FFF' : '#000',
      padding: 12,
      borderRadius: 8,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: isDarkMode ? '#232D3F' : '#CBD5E1'
    },
    button: { backgroundColor: '#4CC9F0', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, flexDirection: 'row', justifyContent: 'center' },
    buttonText: { color: '#0B0E14', fontWeight: 'bold', fontSize: 16 }
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Solicitar Análise de Payload</Text>

      <Text style={styles.label}>Nome da Proteína / Alvo Terapêutico</Text>
      <TextInput style={styles.input} placeholder="Ex: Insulin Variant B" placeholderTextColor="#566275" value={molecule} onChangeText={setMolecule} />

      <Text style={styles.label}>Concentração Alvo (mg/ml)</Text>
      <TextInput style={styles.input} placeholder="Ex: 12.5" keyboardType="numeric" placeholderTextColor="#566275" value={concentration} onChangeText={setConcentration} />

      <Text style={styles.label}>Potencial Hidrogeniônico (pH)</Text>
      <TextInput style={styles.input} placeholder="Ex: 7.2" keyboardType="numeric" placeholderTextColor="#566275" value={ph} onChangeText={setPh} />

      <Text style={styles.label}>Temperatura Ideal do Reator (°C)</Text>
      <TextInput style={styles.input} placeholder="Ex: 20.0" keyboardType="numeric" placeholderTextColor="#566275" value={temperature} onChangeText={setTemperature} />

      <TouchableOpacity style={styles.button} onPress={handleSubmission} disabled={sending}>
        {sending && <ActivityIndicator color="#0B0E14" style={{ marginRight: 10 }} />}
        <Text style={styles.buttonText}>{sending ? 'Gravando...' : 'Enviar para Validação da IA'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}