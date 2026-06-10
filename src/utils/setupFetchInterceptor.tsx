import { Alert } from 'react-native';

const originalFetch = globalThis.fetch;

export function setupFetchInterceptor() {
  globalThis.fetch = async (input, init = {}) => {
    const headers = new Headers(init.headers || {});
    
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    const response = await originalFetch(input, {
      ...init,
      headers,
    });

    if (response.status === 401) {
      Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.');
    }

    return response;
  };
}