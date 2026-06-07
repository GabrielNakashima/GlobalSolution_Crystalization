import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { useApp, API_URL } from '../src/context/AppContext';
import { LineChart, ProgressChart } from 'react-native-chart-kit';

interface ChartDataPayload {
  labels: string[];
  temperatures: number[];
  purityRates: number[];
  purityLabels: string[];
}

export default function AnalyticsDashboard() {
  const { isDarkMode } = useApp();
  const screenWidth = Dimensions.get('window').width - 40;
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

  const chartConfig = {
    backgroundColor: isDarkMode ? '#131A26' : '#FFFFFF',
    backgroundGradientFrom: isDarkMode ? '#131A26' : '#FFFFFF',
    backgroundGradientTo: isDarkMode ? '#131A26' : '#FFFFFF',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(76, 201, 240, ${opacity})`,
    labelColor: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(11, 14, 20, ${opacity})`,
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: isDarkMode ? '#0B0E14' : '#F4F6F9', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: isDarkMode ? '#FFFFFF' : '#0B0E14', marginBottom: 20 },
    chartContainer: { backgroundColor: isDarkMode ? '#131A26' : '#FFFFFF', padding: 15, borderRadius: 12, marginBottom: 20 },
    chartTitle: { fontSize: 16, fontWeight: 'bold', color: isDarkMode ? '#FFF' : '#000', marginBottom: 10 }
  });

  if (loadingCharts) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4CC9F0" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Análise de Dados Orbitais</Text>
      {chartData ? (
        <>
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Estabilidade Térmica da Câmara (°C / h)</Text>
            <LineChart
              data={{
                labels: chartData.labels,
                datasets: [{ data: chartData.temperatures }]
              }}
              width={screenWidth}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={{ borderRadius: 12 }}
            />
          </View>
        </>
      ) : (
        <Text style={{ color: '#8892B0', textAlign: 'center', marginTop: 40 }}>Sem telemetria gravada.</Text>
      )}
    </ScrollView>
  );
}