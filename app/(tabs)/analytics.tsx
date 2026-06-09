import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useApp, API_URL } from '../../src/context/AppContext';
import { colors } from '../../src/constants/theme';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

interface ChartDataPayload {
  labels: string[];
  temperatures: number[];
  purityRates: number[];
  purityLabels: string[];
}

export default function AnalyticsDashboard() {
  const { width } = useWindowDimensions();
  const screenWidth = width - 48;
  
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? colors.dark : colors.light;
  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);
  
  const [chartData, setChartData] = useState<ChartDataPayload | null>(null);
  const [loadingCharts, setLoadingCharts] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchTelemetryMetrics();
  }, []);

  const fetchTelemetryMetrics = async () => {
    setLoadingCharts(true);
    setHasError(false);
    try {
      const response = await fetch(`${API_URL}/analytics/telemetry`);
      if (response.ok) {
        const data = await response.json();
        setChartData(data);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error('Erro ao ler métricas do banco:', error);
      setHasError(true);
    } finally {
      setLoadingCharts(false);
    }
  };

  const chartConfig = useMemo(() => ({
    backgroundColor: theme.card,
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(76, 201, 240, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${isDarkMode ? '160, 174, 192' : '74, 85, 104'}, ${opacity})`,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: theme.primary
    },
    fillShadowGradientFrom: theme.primary,
    fillShadowGradientTo: theme.card,
    fillShadowGradientFromOpacity: 0.2,
    fillShadowGradientToOpacity: 0,
  }), [isDarkMode, theme]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Telemetria</Text>
      
      {loadingCharts ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Coletando dados...</Text>
        </View>
      ) : hasError ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.error} />
          <Text style={[styles.emptyText, { color: theme.error }]}>Falha na conexão com o reator.</Text>
          <TouchableOpacity style={{ marginTop: 12, padding: 8 }} onPress={fetchTelemetryMetrics}>
            <Text style={{ color: theme.primary, fontWeight: '700' }}>TENTAR NOVAMENTE</Text>
          </TouchableOpacity>
        </View>
      ) : chartData ? (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="thermometer-outline" size={20} color={theme.primary} style={styles.icon} />
            <Text style={styles.cardTitle}>Estabilidade Térmica da Câmara (°C / h)</Text>
          </View>
          
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: [{ data: chartData.temperatures }]
            }}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chartStyle}
            withVerticalLines={false}
            withOuterLines={false}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cloud-offline-outline" size={48} color={theme.textSecondary} />
          <Text style={styles.emptyText}>Sem telemetria orbital gravada.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const getStyles = (isDarkMode: boolean) => {
  const theme = isDarkMode ? colors.dark : colors.light;
  return StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: theme.background, 
      padding: 24 
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 100
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
      paddingBottom: 24,
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
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20
    },
    icon: {
      marginRight: 8
    },
    cardTitle: { 
      fontSize: 15, 
      fontWeight: '700', 
      color: theme.text,
    },
    chartStyle: { 
      borderRadius: 12,
      marginLeft: -10
    },
    loadingText: {
      color: theme.textSecondary,
      marginTop: 16,
      fontSize: 15,
      fontWeight: '500'
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 80
    },
    emptyText: { 
      color: theme.textSecondary, 
      textAlign: 'center', 
      marginTop: 16,
      fontSize: 16,
      fontWeight: '500'
    }
  });
};