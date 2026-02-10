import axios, { type InternalAxiosRequestConfig } from 'axios';
import { APP_CONFIG } from 'shared/constants/app';
import { useAuthStore } from 'data/store';

/**
 * Shared axios instance for API calls. Attaches JWT from auth store when present.
 */
export const apiClient = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
