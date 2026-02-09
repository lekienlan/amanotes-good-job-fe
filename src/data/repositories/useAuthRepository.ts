import { useCallback } from 'react';
import type { User } from 'domain/models';
import { apiClient } from 'data/api/axios';
import { useAuthStore } from 'data/store';
import { APP_CONFIG } from 'shared/constants/app';

const AUTH_GOOGLE_URL = `${APP_CONFIG.API_BASE_URL}/api/v1/auth/google`;
const AUTH_TOKEN_PATH = '/api/v1/auth/token';
const AUTH_ME_PATH = '/api/v1/auth/me';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const useAuthRepository = () => {
  const setTokens = useAuthStore((s) => s.setTokens);
  const logout = useAuthStore((s) => s.logout);

  const redirectToGoogleLogin = useCallback(() => {
    window.location.href = AUTH_GOOGLE_URL;
  }, []);

  const exchangeCodeForTokens = useCallback(
    async (code: string): Promise<void> => {
      const res = await apiClient.post<TokenResponse | { data: TokenResponse }>(
        AUTH_TOKEN_PATH,
        { code }
      );
      const body = res.data;
      const tokens =
        body && typeof body === 'object' && 'data' in body
          ? (body as { data: TokenResponse }).data
          : (body as TokenResponse);
      if (tokens?.accessToken && tokens?.refreshToken) {
        setTokens(tokens.accessToken, tokens.refreshToken);
      } else {
        throw new Error('Invalid token response');
      }
    },
    [setTokens]
  );

  const fetchCurrentUser = useCallback(async (): Promise<User | null> => {
    const res = await apiClient.get<{ data?: User } | User>(AUTH_ME_PATH);
    console.log('get me');
    const body = res.data;
    if (!body) return null;
    if (typeof body === 'object' && 'data' in body && body.data) {
      return body.data;
    }
    return body as User;
  }, []);

  return {
    redirectToGoogleLogin,
    exchangeCodeForTokens,
    fetchCurrentUser,
    logout
  };
};
