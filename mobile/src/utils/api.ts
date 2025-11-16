import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export const getAuthHeaders = async () => {
  const token = await SecureStore.getItemAsync('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: 'Request failed',
    }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
};

