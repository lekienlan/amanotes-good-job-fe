import { useCallback } from 'react';
import type { User } from 'domain/models';
import { apiClient } from 'data/api/axios';
import { useAuthStore } from 'data/store';

const AUTH_LOGIN_PATH = '/api/v1/auth/login';
const AUTH_ME_PATH = '/api/v1/auth/me';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse extends TokenResponse {
  user: User;
}

export const useAuthRepository = () => {
  const setTokens = useAuthStore((s) => s.setTokens);
  const logout = useAuthStore((s) => s.logout);

  const loginWithCredentials = useCallback(
    async (user_name: string, password: string): Promise<LoginResponse> => {
      const res = await apiClient.post<LoginResponse | { data: LoginResponse }>(
        AUTH_LOGIN_PATH,
        { user_name, password }
      );
      const body = res.data;
      const data =
        body && typeof body === 'object' && 'data' in body
          ? (body as { data: LoginResponse }).data
          : (body as LoginResponse);

      if (data?.accessToken && data?.refreshToken) {
        setTokens(data.accessToken, data.refreshToken);
        return data;
      }

      throw new Error('Invalid login response');
    },
    [setTokens]
  );

  const fetchCurrentUser = useCallback(async (): Promise<User | null> => {
    const res = await apiClient.get<{ data?: User } | User>(AUTH_ME_PATH);
    const body = res.data;
    if (!body) return null;
    if (typeof body === 'object' && 'data' in body && body.data) {
      return body.data;
    }
    return body as User;
  }, []);

  return {
    loginWithCredentials,
    fetchCurrentUser,
    logout
  };
};
