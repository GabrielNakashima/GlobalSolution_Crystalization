import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const MOCK_CREDENTIALS = {
  email: 'admin@crystal.com',
  password: '123456'
};

const MOCK_USER_DATA: User = {
  id: 'usr_001_alpha',
  name: 'Pesquisador Científico',
  email: 'admin@crystal.com',
  role: 'Administrator'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper para lidar com a diferença entre Web (Navegador) e Mobile (Celular)
const setStorageItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getStorageItem = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const deleteStorageItem = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await getStorageItem('user_session');
        if (session) {
          setUser(JSON.parse(session));
        }
      } catch (error) {
        console.error('Erro ao carregar sessão persistida:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      try {
        const userData: User = { ...MOCK_USER_DATA };
        await setStorageItem('user_session', JSON.stringify(userData));
        setUser(userData);
        return true;
      } catch (error) {
        console.error('Falha ao salvar a sessão:', error);
        return false;
      }
    }
    return false;
  };

  const logout = async () => {
    try {
      await deleteStorageItem('user_session');
      setUser(null);
    } catch (error) {
      console.error('Erro ao encerrar a sessão:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};