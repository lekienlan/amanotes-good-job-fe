import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,
  Box,
  MenuItem,
  Tabs,
  Tab,
  Container,
  Avatar,
  Menu,
  Divider,
  IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuthStore, useUsersStore } from 'data/store';
import { useUsersRepository } from 'data/repositories';
import { APP_CONFIG } from 'shared/constants/app';
import { getDisplayName } from 'shared/utils/userHelpers';
import { COLORS, SPACING, FONT_SIZE } from 'presentation/theme/designSystem';

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, login, loadCurrentUser } = useAuthStore();
  const { users, setUsers } = useUsersStore();
  const { getAllUsers } = useUsersRepository();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Load users on mount
  useEffect(() => {
    getAllUsers().then((loadedUsers) => {
      setUsers(loadedUsers);
      loadCurrentUser(loadedUsers);
    });
  }, [getAllUsers, setUsers, loadCurrentUser]);

  const handleUserChange = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      login(user);
      setAnchorEl(null);
    }
  };

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
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      py: 0.5,
                      display: 'block',
                      color: 'text.secondary',
                      fontWeight: 600
                    }}
                  >
                    Switch User
                  </Typography>
                  {users.map((user) => (
                    <MenuItem
                      key={user.id}
                      onClick={() => handleUserChange(user.id ?? '')}
                      selected={user.id === currentUser.id}
                      sx={{
                        borderRadius: 1,
                        mx: 0.5,
                        display: 'flex',
                        gap: 1.5
                      }}
                    >
                      <Avatar
                        src={user.avatar}
                        alt={getDisplayName(user)}
                        sx={{ width: 28, height: 28 }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {getDisplayName(user)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary' }}
                        >
                          {user.role}
                        </Typography>
                      </Box>
                    </MenuItem>
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
