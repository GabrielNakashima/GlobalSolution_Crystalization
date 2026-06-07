import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, RefreshControl } from 'react-native';
// Voltamos a importar a API_URL que aponta para o seu servidor online
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
  const { isDarkMode, fetchMissions } = useApp();

  const [latestAnalysis, setLatestAnalysis] = useState<LatestImageAnalysis | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLatestImageAnalysis = useCallback(async () => {
    setLoadingImage(true);
    try {
      const response = await fetch(`${API_URL}/images/latest`);
      
      if (response.ok) {
        const data = await response.json();
        setLatestAnalysis(data);
      } else {
        console.warn('API online, mas retornou status:', response.status);
      }
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
    } finally {
      setLoadingImage(false);
    }
  }, []);

  const loadAllData = useCallback(async () => {
    await fetchLatestImageAnalysis();
    if (fetchMissions) await fetchMissions();
  }, [fetchLatestImageAnalysis, fetchMissions]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
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
    card: { backgroundColor: isDarkMode ? '#131A26' : '#FFFFFF', padding: 20, borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    cardTitle: { fontSize: 12, color: '#8892B0', fontWeight: '700', marginBottom: 8, letterSpacing: 1 },
    imageContainer: { width: '100%', height: 200, borderRadius: 8, marginTop: 10, marginBottom: 12, backgroundColor: isDarkMode ? '#232D3F' : '#E2E8F0', overflow: 'hidden' },
    microscopeImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start', marginTop: 5, marginBottom: 8 },
    badgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
    detailsText: { fontSize: 13, color: isDarkMode ? '#A0AEC0' : '#4A5568', fontStyle: 'italic' }
  });

  const badgeConfig = latestAnalysis ? getClassificationStyle(latestAnalysis.classification) : null;

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CC9F0" />}
    >
      <Text style={styles.title}>Mapeamento</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>ÚLTIMA ANÁLISE DE IMAGEM</Text>
        
        {loadingImage ? (
          <ActivityIndicator color="#4CC9F0" size="large" style={{ marginVertical: 40 }} />
        ) : latestAnalysis ? (
          <View>
            <View style={styles.imageContainer}>
              {latestAnalysis.imageUrl ? (
                <Image source={{ uri: latestAnalysis.imageUrl }} style={styles.microscopeImage} />
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#8892B0' }}>Imagem indisponível</Text>
                </View>
              )}
            </View>
            
            <Text style={{ color: isDarkMode ? '#FFF' : '#000', fontWeight: '600' }}>Resultado do Classificador:</Text>
            
            {badgeConfig && (
              <View style={[styles.badge, { backgroundColor: badgeConfig.color }]}>
                <Text style={styles.badgeText}>{badgeConfig.label}</Text>
              </View>
            )}
            
            <Text style={{ color: isDarkMode ? '#FFF' : '#000', marginBottom: 5 }}>
              Confiança do Modelo: <Text style={{ color: '#4CC9F0', fontWeight: 'bold' }}>{latestAnalysis.confidence}%</Text>
            </Text>
            
            <Text style={styles.detailsText}>{latestAnalysis.details}</Text>
          </View>
        ) : (
          <Text style={{ color: '#8892B0', marginTop: 10 }}>Nenhuma imagem processada no banco.</Text>
        )}
      </View>
      
    </ScrollView>
  );
}