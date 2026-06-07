import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const API_URL = 'http://API_SOA:8080/api'; 

export interface Mission {
  id: string;
  molecule: string;
  concentration: string;
  ph: string;
  temperature: string;
  status: 'Em Análise' | 'Aprovado' | 'Em Órbita' | 'Finalizado';
  date: string;
}

interface AppContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  missions: Mission[];
  fetchMissions: () => Promise<void>;
  addMission: (mission: Omit<Mission, 'id' | 'status' | 'date'>) => Promise<boolean>;
  loadingMissions: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('@spatial_theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMissions = async () => {
    setLoadingMissions(true);
    try {
      const response = await fetch(`${API_URL}/missions`);
      if (response.ok) {
        const data = await response.json();
        setMissions(data);
      } else {
        console.error('Erro ao buscar missões da API');
      }
    } catch (error) {
      console.error('Erro de conexão com o servidor SOA:', error);
    } finally {
      setLoadingMissions(false);
    }
  };

  const addMission = async (newMissionData: Omit<Mission, 'id' | 'status' | 'date'>): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/missions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMissionData),
      });

      if (response.ok) {
        await fetchMissions();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao enviar missão para a API:', error);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{ isDarkMode, toggleTheme, missions, fetchMissions, addMission, loadingMissions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de um AppProvider');
  return context;
};