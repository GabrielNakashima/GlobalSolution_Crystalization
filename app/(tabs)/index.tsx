import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { useApp, API_URL } from '../../src/context/AppContext';

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
  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);

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

  const getClassificationBadge = (type: ClassificationType) => {
    switch (type) {
      case 'Crystals': return { backgroundColor: '#2A9D8F15', color: '#2A9D8F', label: 'Crystals (Estrutura Ordenada)' };
      case 'Clear': return { backgroundColor: '#4CC9F015', color: '#4CC9F0', label: 'Clear (Sem Nucleação)' };
      case 'Precipitate': return { backgroundColor: '#E6394615', color: '#E63946', label: 'Precipitate (Amorfo)' };
      case 'Other': return { backgroundColor: '#8D99AE15', color: '#8D99AE', label: 'Other (Artefato / Ruído)' };
      default: return { backgroundColor: '#8892B015', color: '#8892B0', label: 'Não Identificado' };
    }
  };

  const badgeConfig = latestAnalysis ? getClassificationBadge(latestAnalysis.classification) : null;

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CC9F0" />
      }
    >
      <Text style={styles.title}>Mapeamento Orbital</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardSubtitle}>ÚLTIMA ANÁLISE DE IMAGEM</Text>
          {latestAnalysis?.timestamp && (
            <Text style={styles.timestamp}>{new Date(latestAnalysis.timestamp).toLocaleTimeString()}</Text>
          )}
        </View>
        
        {loadingImage ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#4CC9F0" size="large" />
            <Text style={styles.loadingText}>Processando imagem...</Text>
          </View>
        ) : latestAnalysis ? (
          <View>
            <View style={styles.imageWrapper}>
              {latestAnalysis.imageUrl ? (
                <Image source={{ uri: latestAnalysis.imageUrl }} style={styles.microscopeImage} />
              ) : (
                <View style={styles.imageFallback}>
                  <Text style={styles.fallbackText}>Imagem indisponível</Text>
                </View>
              )}
            </View>
            
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Resultado do Classificador:</Text>
              
              {badgeConfig && (
                <View style={[styles.badge, { backgroundColor: badgeConfig.backgroundColor }]}>
                  <Text style={[styles.badgeText, { color: badgeConfig.color }]}>{badgeConfig.label}</Text>
                </View>
              )}
              
              <View style={styles.confidenceRow}>
                <Text style={styles.confidenceLabel}>Confiança do Modelo:</Text>
                <Text style={styles.confidenceValue}>{latestAnalysis.confidence}%</Text>
              </View>
              
              <Text style={styles.detailsText}>{latestAnalysis.details}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>Nenhuma imagem processada no banco de dados.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: isDarkMode ? '#0B0E14' : '#F4F6F9', 
    padding: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: isDarkMode ? '#FFFFFF' : '#1A202C', 
    marginBottom: 24,
    letterSpacing: -0.5
  },
  card: { 
    backgroundColor: isDarkMode ? '#131A26' : '#FFFFFF', 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 20, 
    shadowColor: isDarkMode ? '#000' : '#CBD5E1', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 12, 
    elevation: 4,
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: '#232D3F'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardSubtitle: { 
    fontSize: 12, 
    color: '#8892B0', 
    fontWeight: '700', 
    letterSpacing: 1.2 
  },
  timestamp: {
    fontSize: 12,
    color: '#8892B0',
    fontWeight: '500',
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#8892B0',
    fontSize: 14,
    fontWeight: '500'
  },
  imageWrapper: { 
    width: '100%', 
    height: 220, 
    borderRadius: 12, 
    backgroundColor: isDarkMode ? '#0B0E14' : '#E2E8F0', 
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: isDarkMode ? '#232D3F' : '#E2E8F0',
  },
  microscopeImage: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover' 
  },
  imageFallback: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  fallbackText: { 
    color: '#8892B0',
    fontWeight: '500' 
  },
  resultContainer: {
    backgroundColor: isDarkMode ? '#0B0E14' : '#F8FAFC',
    padding: 16,
    borderRadius: 12,
  },
  resultLabel: { 
    color: isDarkMode ? '#E2E8F0' : '#4A5568', 
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8
  },
  badge: { 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 8, 
    alignSelf: 'flex-start', 
    marginBottom: 12 
  },
  badgeText: { 
    fontWeight: '700', 
    fontSize: 13 
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  confidenceLabel: { 
    color: isDarkMode ? '#A0AEC0' : '#4A5568',
    fontSize: 14,
    marginRight: 6
  },
  confidenceValue: { 
    color: '#4CC9F0', 
    fontWeight: '800',
    fontSize: 15
  },
  detailsText: { 
    fontSize: 14, 
    color: isDarkMode ? '#8892B0' : '#718096', 
    lineHeight: 20,
    marginTop: 4
  },
  emptyStateContainer: {
    paddingVertical: 40,
    alignItems: 'center'
  },
  emptyStateText: { 
    color: '#8892B0', 
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500'
  }
});