import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useProtectedAuth } from 'domain/usecases';
import { APP_CONFIG } from 'shared/constants/app';
import { COLORS, SPACING } from 'presentation/theme/designSystem';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { redirectToGoogleLogin, exchangeCodeForTokens } = useProtectedAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const code = searchParams.get('code');

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setLoading(true);
        setError(null);
      }
    });
    const run = async () => {
      try {
        await exchangeCodeForTokens(code);
        if (!cancelled) setTimeout(() => navigate('/', { replace: true }), 0);
      } catch {
        if (!cancelled) setError('Sign-in failed. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [code, exchangeCodeForTokens, navigate]);

  if (code) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: SPACING.MD
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {error && (
              <Typography color="error" sx={{ textAlign: 'center' }}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={() => navigate('/login', { replace: true })}
            >
              Back to login
            </Button>
          </>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: SPACING.XL,
        bgcolor: COLORS.BACKGROUND.PRIMARY
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, color: COLORS.TEXT.PRIMARY }}
      >
        {APP_CONFIG.APP_NAME}
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={redirectToGoogleLogin}
        sx={{
          bgcolor: COLORS.PRIMARY.MAIN,
          '&:hover': { bgcolor: COLORS.PRIMARY.DARK }
        }}
      >
        Sign in with Google
      </Button>
    </Box>
  );
};
