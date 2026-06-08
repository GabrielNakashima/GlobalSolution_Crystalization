import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { useApp, API_URL } from '../../src/context/AppContext';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

interface ChartDataPayload {
  labels: string[];
  temperatures: number[];
  purityRates: number[];
  purityLabels: string[];
}

export default function AnalyticsDashboard() {
  const { isDarkMode } = useApp();
  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);
  const screenWidth = Dimensions.get('window').width - 48;
  
  const [chartData, setChartData] = useState<ChartDataPayload | null>(null);
  const [loadingCharts, setLoadingCharts] = useState(true);

  useEffect(() => {
    fetchTelemetryMetrics();
  }, []);

  const fetchTelemetryMetrics = async () => {
    try {
      const response = await fetch(`${API_URL}/analytics/telemetry`);
      if (response.ok) {
        const data = await response.json();
        setChartData(data);
      }
    } catch (error) {
      console.error('Erro ao ler métricas do banco:', error);
    } finally {
      setLoadingCharts(false);
    }
  };

  const chartConfig = useMemo(() => ({
    backgroundColor: isDarkMode ? '#131A26' : '#FFFFFF',
    backgroundGradientFrom: isDarkMode ? '#131A26' : '#FFFFFF',
    backgroundGradientTo: isDarkMode ? '#131A26' : '#FFFFFF',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(76, 201, 240, ${opacity})`,
    labelColor: (opacity = 1) => isDarkMode ? `rgba(160, 174, 192, ${opacity})` : `rgba(74, 85, 104, ${opacity})`,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#4CC9F0"
    },
    fillShadowGradientFrom: '#4CC9F0',
    fillShadowGradientTo: isDarkMode ? '#131A26' : '#FFFFFF',
    fillShadowGradientFromOpacity: 0.2,
    fillShadowGradientToOpacity: 0,
  }), [isDarkMode]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Telemetria</Text>
      
      {loadingCharts ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4CC9F0" />
          <Text style={styles.loadingText}>Coletando dados...</Text>
        </View>
      ) : chartData ? (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="thermometer-outline" size={20} color="#4CC9F0" style={styles.icon} />
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
          <Ionicons name="cloud-offline-outline" size={48} color="#8892B0" />
          <Text style={styles.emptyText}>Sem telemetria orbital gravada.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: isDarkMode ? '#0B0E14' : '#F4F6F9', 
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
    color: isDarkMode ? '#FFFFFF' : '#1A202C', 
    marginBottom: 24,
    letterSpacing: -0.5
  },
  card: { 
    backgroundColor: isDarkMode ? '#131A26' : '#FFFFFF', 
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
    borderColor: '#232D3F'
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
    color: isDarkMode ? '#E2E8F0' : '#2D3748',
  },
  chartStyle: { 
    borderRadius: 12,
    marginLeft: -10
  },
  loadingText: {
    color: '#8892B0',
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
    color: '#8892B0', 
    textAlign: 'center', 
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500'
  }
});