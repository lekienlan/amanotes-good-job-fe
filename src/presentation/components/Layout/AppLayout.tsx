import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Container,
  Avatar,
  Menu,
  Divider,
  IconButton,
  CircularProgress
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useProtectedAuth, useSyncUsers, useCurrentUser } from 'domain/usecases';
import { APP_CONFIG } from 'shared/constants/app';
import { getDisplayName } from 'shared/utils/userHelpers';
import { UserItem } from 'presentation/components/User';
import { COLORS, SPACING, FONT_SIZE } from 'presentation/theme/designSystem';

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, redirectTo } = useProtectedAuth();
  const { currentUser } = useCurrentUser();
  const { users, refetchUsers } = useSyncUsers();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    refetchUsers();
  }, [refetchUsers]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const currentTab = location.pathname;

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100dvw'
      }}
    >
      <Box
        position="sticky"
        sx={{
          top: 0,
          zIndex: 100,
          bgcolor: COLORS.BACKGROUND.PRIMARY,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2
        }}
      >
        <Typography
          variant="h6"
          sx={{ mr: 2, fontWeight: 600, fontSize: FONT_SIZE.LARGE }}
        >
          {APP_CONFIG.APP_NAME}
        </Typography>

        {currentUser && (
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': { opacity: 0.7, outline: 'none' },
              '& .Mui-selected': { opacity: 1 }
            }}
          >
            <Tab label="Feed" value="/" />
            <Tab label="Rewards" value="/rewards" />
            {(currentUser.role === 'ADMIN' || currentUser.role === 'HR') && (
              <Tab label="Admin" value="/admin" />
            )}
          </Tabs>
        )}

        <Box>
          {currentUser && (
            <>
              <IconButton
                onClick={handleClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: open ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <Avatar
                  src={currentUser.avatar}
                  alt={getDisplayName(currentUser)}
                  sx={{ width: 32, height: 32 }}
                />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {getDisplayName(currentUser)}
                </Typography>
                <KeyboardArrowDownIcon
                  sx={{
                    transition: 'transform 0.2s',
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 280,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {getDisplayName(currentUser)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    Balance: {currentUser.points_balance || 0} pts
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block' }}
                  >
                    Budget: {currentUser.giving_budget || 0}/200
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ px: 1, pb: 1 }}>
                  {users.map((user) => (
                    <Box key={user.id} sx={{ borderRadius: 1, mx: 0.5 }}>
                      <UserItem user={user} avatarSize={28} />
                    </Box>
                  ))}
                </Box>
              </Menu>
            </>
          )}
        </Box>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: SPACING.LARGE,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};
