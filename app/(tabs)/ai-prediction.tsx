import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Modal, View } from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { useRouter } from 'expo-router';

export default function NewMissionForm() {
  const { isDarkMode } = useApp();
  const router = useRouter();

  const [molecule, setMolecule] = useState('');
  const [concentration, setConcentration] = useState('');
  const [ph, setPh] = useState('');
  const [temperature, setTemperature] = useState('');
  const [sending, setSending] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmission = async () => {
    if (!molecule || !concentration || !ph || !temperature) {
      alert('Todos os parâmetros moleculares são obrigatórios.');
      return;
    }

    const phValue = parseFloat(ph);
    const concValue = parseFloat(concentration);
    const tempValue = parseFloat(temperature);

    if (isNaN(phValue) || phValue < 0 || phValue > 14) {
      alert('O pH deve ser um valor numérico válido entre 0 e 14.');
      return;
    }

    if (isNaN(concValue) || isNaN(tempValue)) {
      alert('A concentração e a temperatura devem conter apenas valores numéricos.');
      return;
    }

    setSending(true);

    setTimeout(() => {
      setSending(false);
      setModalVisible(true);
      setMolecule(''); setConcentration(''); setPh(''); setTemperature('');
    }, 2000);
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
    buttonText: { color: '#0B0E14', fontWeight: 'bold', fontSize: 16 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { width: '80%', backgroundColor: isDarkMode ? '#131A26' : '#FFF', padding: 20, borderRadius: 10, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: isDarkMode ? '#FFF' : '#000', marginBottom: 10 },
    modalText: { color: isDarkMode ? '#CCC' : '#666', marginBottom: 20, textAlign: 'center' },
    modalButton: { backgroundColor: '#4CC9F0', padding: 10, paddingHorizontal: 20, borderRadius: 5 }
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Solicitar Análise de Payload</Text>

      <Text style={styles.label}>Nome da Proteína / Alvo Terapêutico</Text>
      <TextInput style={styles.input} placeholder="Ex: Insulin Variant B" placeholderTextColor={isDarkMode ? "#566275" : "#A0AEC0"} value={molecule} onChangeText={setMolecule} />

      <Text style={styles.label}>Concentração Alvo (mg/ml)</Text>
      <TextInput style={styles.input} placeholder="Ex: 12.5" keyboardType="numeric" placeholderTextColor={isDarkMode ? "#566275" : "#A0AEC0"} value={concentration} onChangeText={setConcentration} />

      <Text style={styles.label}>Potencial Hidrogeniônico (pH)</Text>
      <TextInput style={styles.input} placeholder="Ex: 7.2" keyboardType="numeric" placeholderTextColor={isDarkMode ? "#566275" : "#A0AEC0"} value={ph} onChangeText={setPh} />

      <Text style={styles.label}>Temperatura Ideal do Reator (°C)</Text>
      <TextInput style={styles.input} placeholder="Ex: 20.0" keyboardType="numeric" placeholderTextColor={isDarkMode ? "#566275" : "#A0AEC0"} value={temperature} onChangeText={setTemperature} />

      <TouchableOpacity style={styles.button} onPress={handleSubmission} disabled={sending}>
        {sending && <ActivityIndicator color="#0B0E14" style={{ marginRight: 10 }} />}
        <Text style={styles.buttonText}>{sending ? 'Validando IA Preditiva...' : 'Enviar para Validação da IA'}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Validação Concluída pela IA</Text>
            <Text style={styles.modalText}>
              Status: Estável para Órbita{'\n'}
              Confiança: 94%{'\n\n'}
              O diagrama de fases foi processado com sucesso.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => { setModalVisible(false); router.push('/'); }}>
              <Text style={{ fontWeight: 'bold' }}>Finalizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}