import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const originalFetch = globalThis.fetch;

export function setupFetchInterceptor() {
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const headers = new Headers(init?.headers || {});
    
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const session = await SecureStore.getItemAsync('user_session');
      if (session) {
        const parsedSession = JSON.parse(session);
        if (parsedSession.token) {
          headers.set('Authorization', `Bearer ${parsedSession.token}`);
        }
      }
    } catch (error) {
      console.error('Erro ao ler credenciais no interceptor:', error);
    }

    const updatedInit: RequestInit = {
      ...init,
      headers,
    };

    try {
      const response = await originalFetch(input, updatedInit);

      if (response.status === 401) {
        Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.');
      }

      return response;
    } catch (error) {
      console.error('Erro global de rede capturado:', error);
      throw error;
    }
  };
}