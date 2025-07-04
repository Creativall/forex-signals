import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  AccountBalance,
  Security,
  Telegram,
  Business,
  School,
  Settings,
  Insights,
} from '@mui/icons-material';
import { Speed } from '@mui/icons-material';

const Sidebar = ({ activeTab, onTabChange, onClose, isMobile }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Logo do Google (placeholder)
  const AskPayLogo = () => (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 2px 8px rgba(0,0,0,0.3)' 
          : '0 2px 8px rgba(0,0,0,0.1)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        overflow: 'hidden',
      }}
    >
      <img
        src="/logo-askpay.webp"
        alt="AskPay Logo"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </Box>
  );

  const menuItems = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: <DashboardIcon />,
      path: '/dashboard',
      description: 'Dashboard principal',
    },
    {
      id: 'trading',
      label: 'Trading',
      icon: <TrendingUp />,
      path: '/dashboard/trading',
      description: 'Controle de operações',
      badge: 'Pro',
    },
    {
      id: 'financeiro',
      label: 'Gestão Financeira',
      icon: <AccountBalance />,
      path: '/dashboard/financeiro',
      description: 'Controle financeiro',
    },
    {
      id: 'indicacoes',
      label: 'Indicações',
      icon: <Insights />,
      path: '/dashboard/indicacoes',
      description: 'Sinais de trading',
      badge: 'Novo',
    },
    {
      id: 'protecao',
      label: 'Proteção',
      icon: <Security />,
      path: '/dashboard/protecao',
      description: 'Gestão de risco',
    },
    {
      id: 'telegram',
      label: 'Grupo Telegram',
      icon: <Telegram />,
      path: '/dashboard/telegram',
      description: 'Comunidade',
    },
    {
      id: 'corretora',
      label: 'Corretora Afiliado',
      icon: <Business />,
      path: '/dashboard/corretora',
      description: 'Parcerias',
    },
    {
      id: 'aulas',
      label: 'Aulas Institucionais',
      icon: <School />,
      path: '/dashboard/aulas',
      description: 'Educação',
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: <Settings />,
      path: '/dashboard/configuracoes',
      description: 'Ajustes da conta',
    },
  ];

  const handleNavigation = (item) => {
    navigate(item.path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, rgba(22, 27, 34, 0.95) 0%, rgba(13, 17, 23, 0.9) 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 249, 250, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo e título */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <AskPayLogo />
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: theme.palette.gemini?.gradient || theme.palette.primary.main,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontSize: '1.25rem',
            }}
          >
            AskPay
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            Forex Signals
          </Typography>
        </Box>
      </Box>

      {/* Menu de navegação */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item)}
                sx={{
                  borderRadius: 3,
                  px: 2,
                  py: 1.5,
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  ...(isActive(item.path) && {
                    background: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      background: theme.palette.primary.main,
                      borderRadius: '0 2px 2px 0',
                    },
                  }),
                  '&:hover': {
                    background: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.primary.main, 0.04),
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive(item.path) 
                      ? theme.palette.primary.main 
                      : 'text.secondary',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isActive(item.path) ? 600 : 500,
                          color: isActive(item.path) 
                            ? theme.palette.primary.main 
                            : 'text.primary',
                        }}
                      >
                        {item.label}
                      </Typography>
                      {item.badge && (
                        <Chip
                          label={item.badge}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            borderRadius: 2,
                            background: item.badge === 'Pro' 
                              ? theme.palette.warning.main
                              : theme.palette.success.main,
                            color: 'white',
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        mt: 0.5,
                      }}
                    >
                      {item.description}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Seção de recursos */}
      <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.1)
              : alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Speed sx={{ fontSize: 20, color: theme.palette.primary.main }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: theme.palette.primary.main }}
            >
              IA Avançada
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', lineHeight: 1.4 }}
          >
            Análise de mercado em tempo real com precisão de 94%
          </Typography>
        </Box>
      </Box>

      {/* Rodapé */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: '0.7rem',
          }}
        >
          © 2024 AskPay - Forex Signals v2.0
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar; 