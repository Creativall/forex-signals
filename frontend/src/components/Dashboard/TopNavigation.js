import React, { useState } from 'react';
import {
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Stack,
  Badge,
  Divider,
  ListItemIcon,
  ListItemText,
  Button,
  Chip,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Settings,
  Logout,
  AccountCircle,
  Help,
  FeedbackOutlined,
} from '@mui/icons-material';

import BalanceDisplay from '../ui/BalanceDisplay';

const TopNavigation = ({ 
  user, 
  onLogout, 
  onMenuToggle, 
  notifications = [], 
  onMarkNotificationsRead,
  isMobile 
}) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState(null);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationMenuAnchor(event.currentTarget);
    if (onMarkNotificationsRead) {
      onMarkNotificationsRead();
    }
  };

  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    onLogout();
  };

  return (
    <Toolbar 
      sx={{ 
        px: { xs: 2, md: 3 },
        minHeight: { xs: 56, sm: 64 },
        justifyContent: 'space-between',
      }}
    >
      {/* Left Section */}
      <Stack direction="row" alignItems="center" spacing={2}>
        {/* Menu Toggle (Mobile) */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="abrir menu"
            edge="start"
            onClick={onMenuToggle}
            sx={{ 
              mr: 1,
              color: theme.palette.text.primary,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}


      </Stack>

      {/* Right Section */}
      <Stack direction="row" alignItems="center" spacing={1}>
        {/* Balance Display */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 1 }}>
          <BalanceDisplay 
            variant="chip" 
            size="small"
          />
        </Box>



        {/* Notifications */}
        <IconButton
          size="medium"
          aria-label={`${unreadNotifications} notificações`}
          onClick={handleNotificationMenuOpen}
          sx={{ 
            color: theme.palette.text.primary,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            }
          }}
        >
          <Badge badgeContent={unreadNotifications} color="primary">
            <Notifications />
          </Badge>
        </IconButton>

        {/* Help */}
        <IconButton
          size="medium"
          aria-label="ajuda"
          sx={{ 
            color: theme.palette.text.primary,
            display: { xs: 'none', md: 'flex' },
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            }
          }}
        >
          <Help />
        </IconButton>

        {/* User Menu */}
        <Box sx={{ ml: 1 }}>
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1.5}
            onClick={handleUserMenuOpen}
            sx={{ 
              cursor: 'pointer',
              py: 0.5,
              px: 1,
              borderRadius: 3,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            <Avatar
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                bgcolor: theme.palette.primary.main,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: 600,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            
            {!isTablet && (
              <Box sx={{ textAlign: 'left' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                  }}
                >
                  {user?.name || 'Usuário'}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem',
                  }}
                >
                  {user?.email || 'usuario@email.com'}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 240,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
            backdropFilter: 'blur(20px)',
            '& .MuiMenuItem-root': {
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              }
            }
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {user?.name || 'Usuário'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email || 'usuario@email.com'}
          </Typography>
          <Chip 
            label="Pro" 
            size="small" 
            color="primary" 
            sx={{ mt: 1, fontSize: '0.7rem' }}
          />
        </Box>

        <MenuItem>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Meu Perfil" />
        </MenuItem>
        
        <MenuItem>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Configurações" />
        </MenuItem>

        <Divider sx={{ my: 1 }} />
        
        <MenuItem>
          <ListItemIcon>
            <Help />
          </ListItemIcon>
          <ListItemText primary="Ajuda e Suporte" />
        </MenuItem>
        
        <MenuItem>
          <ListItemIcon>
            <FeedbackOutlined />
          </ListItemIcon>
          <ListItemText primary="Enviar Feedback" />
        </MenuItem>

        <Divider sx={{ my: 1 }} />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationMenuAnchor}
        open={Boolean(notificationMenuAnchor)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            minWidth: 320,
            maxWidth: 400,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
            backdropFilter: 'blur(20px)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Notificações
            </Typography>
            {unreadNotifications > 0 && (
              <Chip 
                label={`${unreadNotifications} novas`} 
                size="small" 
                color="primary"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Stack>
        </Box>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          notifications.slice(0, 5).map((notification, index) => (
            <MenuItem 
              key={index}
              sx={{ 
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                alignItems: 'flex-start',
                py: 1.5,
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                  {notification.title || 'Nova notificação'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {notification.message || 'Você tem uma nova notificação'}
                </Typography>
                <Typography variant="caption" color="primary.main" sx={{ fontSize: '0.7rem' }}>
                  {notification.time || 'Há poucos minutos'}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Notifications sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Nenhuma notificação
            </Typography>
          </Box>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Button 
              fullWidth 
              variant="text" 
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Ver todas as notificações
            </Button>
          </Box>
        )}
      </Menu>
    </Toolbar>
  );
};

export default TopNavigation; 