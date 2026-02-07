import axios, { type InternalAxiosRequestConfig } from 'axios';
import { APP_CONFIG } from 'shared/constants/app';
import { STORAGE_KEYS } from 'shared/utils/localStorage';

/**
 * Shared axios instance for API calls. Attaches JWT from storage when present.
 */
export const apiClient = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
