import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useProtectedAuth } from 'domain/usecases';
import { APP_CONFIG } from 'shared/constants/app';
import { COLORS, SPACING } from 'presentation/theme/designSystem';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { loginWithPassword } = useProtectedAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await loginWithPassword(userName, password);
      navigate('/', { replace: true });
    } catch {
      // Reason: surface a simple, user-friendly error regardless of backend details.
      setError('Invalid username or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100dvw',
        bgcolor: COLORS.BACKGROUND.PRIMARY,
        px: SPACING.LG
      }}
    >
      <Box
        sx={{
          width: '100%',
          borderRadius: 3,
          p: SPACING.XL,
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING.LG
        }}
      >
        <Box sx={{ textAlign: 'center', mb: SPACING.MD }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: COLORS.TEXT.PRIMARY, mb: 0.5 }}
          >
            {APP_CONFIG.APP_NAME}
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.TEXT.SECONDARY }}>
            Sign in with your username and password
          </Typography>
        </Box>

        {error && (
          <Typography
            variant="body2"
            sx={{ color: 'error.main', textAlign: 'center' }}
          >
            {error}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: SPACING.MD }}
        >
          <TextField
            label="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            autoComplete="username"
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting || !userName || !password}
            sx={{
              mt: SPACING.SM,
              bgcolor: COLORS.PRIMARY.MAIN,
              '&:hover': { bgcolor: COLORS.PRIMARY.DARK }
            }}
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
