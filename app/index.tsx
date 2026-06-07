import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { useApp, API_URL } from '../src/context/AppContext';

type ClassificationType = 'Clear' | 'Crystals' | 'Precipitate' | 'Other';

interface LatestImageAnalysis {
  imageUrl: string;
  classification: ClassificationType;
  confidence: number;
  timestamp: string;
  details: string;
}

export default function DashboardTelemetry() {
  const { isDarkMode, missions, fetchMissions, loadingMissions } = useApp();
  const [issLocation, setIssLocation] = useState<{ lat: string; lon: string } | null>(null);
  const [loadingIss, setLoadingIss] = useState(true);
  const [latestAnalysis, setLatestAnalysis] = useState<LatestImageAnalysis | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAllData = async () => {
    fetchIssLocation();
    await fetchLatestImageAnalysis();
    await fetchMissions();
  };

  useEffect(() => {
    loadAllData();
    const interval = setInterval(fetchIssLocation, 10000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const fetchIssLocation = async () => {
    try {
      const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      const data = await response.json();
      setIssLocation({
        lat: Number(data.latitude).toFixed(4),
        lon: Number(data.longitude).toFixed(4),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingIss(false);
    }
  };

  const fetchLatestImageAnalysis = async () => {
    setLoadingImage(true);
    try {
      const response = await fetch(`${API_URL}/images/latest`);
      if (response.ok) {
        const data = await response.json();
        setLatestAnalysis(data);
      }
    } catch (error) {
      console.error('Erro ao ler imagens do banco:', error);
    } finally {
      setLoadingImage(false);
    }
  };

  const getClassificationStyle = (type: ClassificationType) => {
    switch (type) {
      case 'Crystals': return { color: '#2A9D8F', label: 'Crystals (Estrutura Ordenada)' };
      case 'Clear': return { color: '#4CC9F0', label: 'Clear (Sem Nucleação)' };
      case 'Precipitate': return { color: '#E63946', label: 'Precipitate (Precipitado Amorfo)' };
      case 'Other': return { color: '#8D99AE', label: 'Other (Artefato / Ruído)' };
      default: return { color: '#8892B0', label: 'Não Identificado' };
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: isDarkMode ? '#0B0E14' : '#F4F6F9', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#0B0E14', marginBottom: 20 },
    card: { backgroundColor: isDarkMode ? '#131A26' : '#FFFFFF', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 3 },
    cardTitle: { fontSize: 12, color: '#8892B0', fontWeight: '700', marginBottom: 8, letterSpacing: 1 },
    cardValue: { fontSize: 20, fontWeight: 'bold', color: '#4CC9F0' },
    statusContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    statusBox: { alignItems: 'center', flex: 1 },
    statusNum: { fontSize: 24, fontWeight: 'bold', color: isDarkMode ? '#FFF' : '#000' },
    imageContainer: { width: '100%', height: 200, borderRadius: 8, marginTop: 10, marginBottom: 12, backgroundColor: '#000', overflow: 'hidden' },
    microscopeImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start', marginTop: 5, marginBottom: 8 },
    badgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
    detailsText: { fontSize: 13, color: isDarkMode ? '#A0AEC0' : '#4A5568', fontStyle: 'italic' }
  });

  const badgeConfig = latestAnalysis ? getClassificationStyle(latestAnalysis.classification) : null;

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Text style={styles.title}>Painel de Controle Orbital</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>ÚLTIMA ANÁLISE DE IMAGEM (MICROSCOPIA LEO)</Text>
        {loadingImage ? (
          <ActivityIndicator color="#4CC9F0" style={{ marginVertical: 40 }} />
        ) : latestAnalysis ? (
          <View>
            <View style={styles.imageContainer}>
              <Image source={{ uri: latestAnalysis.imageUrl }} style={styles.microscopeImage} />
            </View>
            <Text style={{ color: isDarkMode ? '#FFF' : '#000', fontWeight: '600' }}>Resultado do Classificador:</Text>
            <View style={[styles.badge, { backgroundColor: badgeConfig?.color }]}>
              <Text style={styles.badgeText}>{badgeConfig?.label}</Text>
            </View>
            <Text style={{ color: isDarkMode ? '#FFF' : '#000', marginBottom: 5 }}>
              Confiança do Modelo: <Text style={{ color: '#4CC9F0', fontWeight: 'bold' }}>{latestAnalysis.confidence}%</Text>
            </Text>
            <Text style={styles.detailsText}>{latestAnalysis.details}</Text>
          </View>
        ) : (
          <Text style={{ color: '#8892B0' }}>Nenhuma imagem processada no banco.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>RASTREAMENTO DO LABORATÓRIO (ISS)</Text>
        {loadingIss ? <ActivityIndicator color="#4CC9F0" /> : <Text style={styles.cardValue}>Lat: {issLocation?.lat}° | Lon: {issLocation?.lon}°</Text>}
      </View>
    </ScrollView>
  );
}