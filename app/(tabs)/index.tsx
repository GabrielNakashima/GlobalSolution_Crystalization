import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { useApp, API_URL } from '../../src/context/AppContext';
import { colors } from '../../src/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

type ClassificationType = 'Clear' | 'Crystals' | 'Precipitate' | 'Other';

interface LatestImageAnalysis {
  proteinName: string;
  temperature: Double;
  gravityLevel: Double;
  status: string;
  recommendedAction: string;
}

export default function DashboardTelemetry() {
  const { isDarkMode, fetchMissions } = useApp();
  const theme = isDarkMode ? colors.dark : colors.light;
  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);

  const [latestAnalysis, setLatestAnalysis] = useState<LatestImageAnalysis | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fetchLatestImageAnalysis = useCallback(async () => {
    setLoadingImage(true);
    try {
      const response = await fetch(`${API_URL}/samples/1235`);
      
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
      case 'Clear': return { backgroundColor: theme.primary + '15', color: theme.primary, label: 'Clear (Sem Nucleação)' };
      case 'Precipitate': return { backgroundColor: theme.error + '15', color: theme.error, label: 'Precipitate (Amorfo)' };
      case 'Other': return { backgroundColor: '#8D99AE15', color: '#8D99AE', label: 'Other (Artefato / Ruído)' };
      default: return { backgroundColor: theme.textSecondary + '15', color: theme.textSecondary, label: 'Não Identificado' };
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
      }
    >
      <Text style={styles.title}>Mapeamento Orbital</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardSubtitle}>ÚLTIMA ANÁLISE</Text>
            <Text style={styles.timestamp}>STATUS: {(latestAnalysis?.status)}</Text>
            <Text style={styles.timestamp}>PROTEIN: {(latestAnalysis?.proteinName)}</Text>
            <Text style={styles.timestamp}>ACTION: {(latestAnalysis?.recommendedAction)}</Text>
            <Text style={styles.timestamp}>GRAVITY: {(latestAnalysis?.gravityLevel)}</Text>
            <Text style={styles.timestamp}>TEMPERATURE:{(latestAnalysis?.temperature)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (isDarkMode: boolean) => {
  const theme = isDarkMode ? colors.dark : colors.light;
  return StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: theme.background, 
      padding: 20 
    },
    title: { 
      fontSize: 28, 
      fontWeight: '800', 
      color: theme.text, 
      marginBottom: 24,
      letterSpacing: -0.5
    },
    card: { 
      backgroundColor: theme.card, 
      padding: 20, 
      borderRadius: 16, 
      marginBottom: 20, 
      shadowColor: isDarkMode ? '#000' : '#CBD5E1', 
      shadowOffset: { width: 0, height: 4 }, 
      shadowOpacity: 0.15, 
      shadowRadius: 12, 
      elevation: 4,
      borderWidth: isDarkMode ? 1 : 0,
      borderColor: theme.border
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    cardSubtitle: { 
      fontSize: 12, 
      color: theme.textSecondary, 
      fontWeight: '700', 
      letterSpacing: 1.2 
    },
    timestamp: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    loadingContainer: {
      paddingVertical: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginTop: 12,
      color: theme.textSecondary,
      fontSize: 14,
      fontWeight: '500'
    },
    imageWrapper: { 
      width: '100%', 
      height: 220, 
      borderRadius: 12, 
      backgroundColor: theme.background, 
      overflow: 'hidden',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
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
      color: theme.textSecondary,
      fontWeight: '500' 
    },
    resultContainer: {
      backgroundColor: theme.background,
      padding: 16,
      borderRadius: 12,
    },
    resultLabel: { 
      color: theme.text, 
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
      color: theme.textSecondary,
      fontSize: 14,
      marginRight: 6
    },
    confidenceValue: { 
      color: theme.primary, 
      fontWeight: '800',
      fontSize: 15
    },
    detailsText: { 
      fontSize: 14, 
      color: theme.textSecondary, 
      lineHeight: 20,
      marginTop: 4
    },
    emptyStateContainer: {
      paddingVertical: 40,
      alignItems: 'center'
    },
    emptyStateText: { 
      color: theme.textSecondary, 
      textAlign: 'center',
      fontSize: 15,
      fontWeight: '500'
    }
  });
};