import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Role } from 'domain/models';
import { useAuthStore } from 'data/store';
import { useAuthRepository } from 'data/repositories';

/**
 * Auth usecase: guard protected routes (token + /me + role for /admin),
 * and expose login actions for the login page. Returns loading, redirectTo,
 * and redirectToGoogleLogin / exchangeCodeForTokens.
 */
export const useProtectedAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, accessToken, login } = useAuthStore();
  const { fetchCurrentUser, redirectToGoogleLogin, exchangeCodeForTokens } =
    useAuthRepository();

  const [loading, setLoading] = useState(false);

  const pathname = location.pathname;
  const requiredRole = pathname === '/admin' ? ('ADMIN' as const) : undefined;

  useEffect(() => {
    if (!accessToken) return;
    const run = async () => {
      setLoading(true);
      try {
        const user = await fetchCurrentUser();
        console.log('user', user);
        if (user) {
          login(user);
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
  }, [fetchCurrentUser, login, navigate, accessToken]);

  if (!accessToken) {
    return {
      loading: false,
      redirectTo: '/login',
      redirectToGoogleLogin,
      exchangeCodeForTokens
    };
  }

  if (loading || (accessToken && !currentUser)) {
    return {
      loading: true,
      redirectTo: null,
      redirectToGoogleLogin,
      exchangeCodeForTokens
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
        redirectToGoogleLogin,
        exchangeCodeForTokens
      };
    }
    return {
      loading: false,
      redirectTo: null,
      redirectToGoogleLogin,
      exchangeCodeForTokens
    };
  }

  return {
    loading: false,
    redirectTo: '/login' as const,
    redirectToGoogleLogin,
    exchangeCodeForTokens
  };
};
