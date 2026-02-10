import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Role } from 'domain/models';
import { useAuthStore } from 'data/store';
import { useAuthRepository, useCoreValuesRepository } from 'data/repositories';

/**
 * Auth usecase: guard protected routes (token + /me + role for /admin),
 * and expose login actions for the login page. Returns loading, redirectTo,
 * and redirectToGoogleLogin / exchangeCodeForTokens.
 */
export const useProtectedAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, accessToken, login } = useAuthStore();
  const { fetchCurrentUser, loginWithCredentials } = useAuthRepository();
  const { ensureCoreValuesLoaded } = useCoreValuesRepository();

  const [loading, setLoading] = useState(false);

  const pathname = location.pathname;
  const requiredRole = pathname === '/admin' ? ('ADMIN' as const) : undefined;

  const loginWithPassword = useCallback(
    async (user_name: string, password: string) => {
      const { user } = await loginWithCredentials(user_name, password);
      login(user);
      await ensureCoreValuesLoaded();
    },
    [loginWithCredentials, login, ensureCoreValuesLoaded]
  );

  useEffect(() => {
    if (!accessToken) return;
    const run = async () => {
      setLoading(true);
      try {
        const user = await fetchCurrentUser();
        console.log('user', user);
        if (user) {
          login(user);
          await ensureCoreValuesLoaded();
        } else {
          navigate('/login', { replace: true });
        }
      } catch {
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [fetchCurrentUser, login, navigate, accessToken, ensureCoreValuesLoaded]);

  if (!accessToken) {
    return {
      loading: false,
      redirectTo: '/login',
      loginWithPassword
    };
  }

  if (loading || (accessToken && !currentUser)) {
    return {
      loading: true,
      redirectTo: null,
      loginWithPassword
    };
  }

  if (isAuthenticated && currentUser) {
    const role = currentUser.role;
    const roleOk =
      !requiredRole ||
      role === requiredRole ||
      (role as Role | undefined) === 'ADMIN';
    if (!roleOk) {
      return {
        loading: false,
        redirectTo: '/' as const,
        loginWithPassword
      };
    }
    return {
      loading: false,
      redirectTo: null,
      loginWithPassword
    };
  }

  return {
    loading: false,
    redirectTo: '/login' as const,
    loginWithPassword
  };
};
