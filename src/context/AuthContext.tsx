import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
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

// Credenciais mockadas (hardcoded)
const MOCK_CREDENTIALS = {
  email: 'backyardigans@gmail.com',
  password: '123456'
};

// Dados do usuário que serão armazenados na sessão
const MOCK_USER_DATA: User = {
  id: 'usr_001_alpha',
  name: 'Lead Researcher',
  email: 'admin@spacelab.com',
  role: 'Administrator'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        // Recupera a sessão de forma segura utilizando o SecureStore da Expo
        const session = await SecureStore.getItemAsync('user_session');
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
    // Validação contra os dados fixos definidos no código
    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      try {
        // Salva os dados do usuário (sem a senha) no armazenamento seguro
        await SecureStore.setItemAsync('user_session', JSON.stringify(MOCK_USER_DATA));
        setUser(MOCK_USER_DATA);
        return true;
      } catch (error) {
        console.error('Falha ao salvar a sessão:', error);
        return false;
      }
    }
    
    // Retorna falso caso as credenciais não batam com o Mock
    return false;
  };

  const logout = async () => {
    try {
      // Limpa a sessão do dispositivo e o estado da aplicação
      await SecureStore.deleteItemAsync('user_session');
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

// Hook customizado para facilitar o acesso ao contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};