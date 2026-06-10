import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANTE: Mude '192.168.X.X' para o IP real da sua máquina na rede
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

export interface Mission {
  sampleId?: number;
  proteinName?: string;
  captureDate?: string;
  temperature?: number;
  gravityLevel?: number;
  mechanicalVibration?: number;
  status?: string;
  imageUrl?: string;
  expeditionEfficiencyScore?: number;
  recommendedAction?: string;
  classification?: string;
  confidence?: number;
  predictionDate?: string;
}

interface AppContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  missions: Mission[];
  fetchMissions: () => Promise<void>;
  loadingMissions: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MOCK_MISSIONS: Mission[] = [
  { 
    sampleId: 101, 
    proteinName: 'Insulina Variante B', 
    temperature: 20.0, 
    gravityLevel: 0.8,
    mechanicalVibration: 1.2,
    status: 'Em Órbita', 
    captureDate: new Date().toISOString() 
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loadingMissions, setLoadingMissions] = useState<boolean>(false);

  useEffect(() => {
    loadStoredTheme();
    fetchMissions();
  }, []);

  const loadStoredTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('@spatial_theme');
      if (storedTheme !== null) setIsDarkMode(storedTheme === 'dark');
    } catch (error) {
      console.error('Erro ao carregar tema local:', error);
    }
  };

  const toggleTheme = useCallback(async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('@spatial_theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error(error);
    }
  }, [isDarkMode]);

  const fetchMissions = useCallback(async () => {
    setLoadingMissions(true);
    try {
      const response = await fetch(`${API_URL}/samples/ids`);

      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);
      
      if (response.ok) {
        const data: Mission[] = await response.json();
        setMissions(data);
      } else {
        throw new Error("Erro na API.");
      }
    } catch (error) {
      console.error('Erro na conexão:', error);
      setMissions(MOCK_MISSIONS);
    } finally {
      setLoadingMissions(false);
    }
  }, []);

  return (
    <AppContext.Provider value={{ isDarkMode, toggleTheme, missions, fetchMissions, loadingMissions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de um AppProvider');
  return context;
};