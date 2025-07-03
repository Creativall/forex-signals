import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  useTheme,
  Stack,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  Calculate,
  AccountBalance,
  Analytics,
  DarkMode,
  LightMode,
  Telegram,
  Business,
  School,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useTheme as useAppTheme } from '../../App';

const GoogleLogo = ({ size = 'small' }) => (
  <Typography
    variant="h6"
    sx={{
      fontFamily: 'Product Sans, Google Sans, Roboto, sans-serif',
      fontWeight: 400,
      display: 'flex',
      alignItems: 'center',
      gap: 0.2,
      fontSize: size === 'small' ? '20px' : '24px',
    }}
  >
    <Box component="span" sx={{ color: '#4285f4' }}>G</Box>
    <Box component="span" sx={{ color: '#ea4335' }}>o</Box>
    <Box component="span" sx={{ color: '#fbbc05' }}>o</Box>
    <Box component="span" sx={{ color: '#4285f4' }}>g</Box>
    <Box component="span" sx={{ color: '#34a853' }}>l</Box>
    <Box component="span" sx={{ color: '#ea4335' }}>e</Box>
  </Typography>
);

const Sidebar = ({ activeTab, onTabChange, onClose, isMobile }) => {
  const theme = useTheme();
  const appTheme = useAppTheme();

  const menuItems = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: <DashboardIcon />,
      description: 'Dashboard principal',
    },
    {
      id: 'signals',
      label: 'Recomendações',
      icon: <TrendingUp />,
      description: 'Recomendações Forex em tempo real',
    },
    {
      id: 'martingale',
      label: 'Proteção',
      icon: <Calculate />,
      description: 'Calculadora de Proteção',
    },
    {
      id: 'finance',
      label: 'Gestão Financeira',
      icon: <AccountBalance />,
      description: 'Controle de transações',
    },
    {
      id: 'telegram',
      label: 'Grupo Telegram',
      icon: <Telegram />,
      description: 'Acesse nossa comunidade',
    },
    {
      id: 'corretora',
      label: 'Bolsa de Valores',
      icon: <Business />,
      description: 'Abra sua conta com benefícios',
    },
    {
      id: 'institucional',
      label: 'Institucional',
      icon: <School />,
      description: 'Aulas e conteúdo educativo',
    },
  ];

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 100%)`,
        }}
      >
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={2} 
          sx={{ 
            width: '100%',
            justifyContent: { xs: 'center', lg: 'flex-start' }
          }}
        >
          <Box
            component="img"
            src="/logo-askpay.webp"
            alt="AskPay Logo"
            sx={{
              height: { xs: 28, sm: 32 },
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </Stack>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: { xs: 1, sm: 2 } }}>
        <List sx={{ px: { xs: 1, sm: 2 } }}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <ListItem 
                key={item.id} 
                disablePadding 
                sx={{ mb: { xs: 0.25, sm: 0.5 } }}
              >
                <ListItemButton
                  onClick={() => handleTabClick(item.id)}
                  sx={{
                    borderRadius: 2,
                    py: { xs: 1, sm: 1.5 },
                    px: { xs: 1, sm: 2 },
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    background: isActive 
                      ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
                      : 'transparent',
                    border: isActive 
                      ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                      : '1px solid transparent',
                    '&:hover': {
                      background: isActive
                        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
                        : alpha(theme.palette.action.hover, 0.8),
                      transform: { xs: 'none', lg: 'translateX(4px)' },
                    },
                    '&::before': isActive ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      borderRadius: '0 2px 2px 0',
                    } : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive 
                        ? theme.palette.primary.main 
                        : theme.palette.text.secondary,
                      minWidth: { xs: 40, sm: 40 },
                      transition: 'color 0.2s ease',
                      justifyContent: 'flex-start',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    sx={{ 
                      m: 0,
                      opacity: 1,
                      transition: 'all 0.2s ease',
                    }}
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isActive ? 600 : 500,
                          color: isActive 
                            ? theme.palette.primary.main 
                            : theme.palette.text.primary,
                          transition: 'all 0.2s ease',
                          fontSize: { xs: '0.875rem', sm: '0.875rem' },
                          lineHeight: 1.2,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                    secondary={!isMobile && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: '0.7rem',
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          mt: 0.25
                        }}
                      >
                        {item.description}
                      </Typography>
                    )}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Theme Toggle */}
      <Box 
        sx={{ 
          p: 2, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.5)} 0%, transparent 100%)`,
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={appTheme.isDark}
              onChange={appTheme.toggleTheme}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: theme.palette.primary.main,
                  '& + .MuiSwitch-track': {
                    backgroundColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          }
          label={
            <Stack direction="row" alignItems="center" spacing={1}>
              {appTheme.isDark ? (
                <DarkMode sx={{ color: '#90CAF9', fontSize: 20 }} />
              ) : (
                <LightMode sx={{ color: '#FFA726', fontSize: 20 }} />
              )}
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '0.875rem' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {appTheme.isDark ? 'Modo Escuro' : 'Modo Claro'}
              </Typography>
            </Stack>
          }
          sx={{
            m: 0,
            width: '100%',
            justifyContent: 'space-between',
            '& .MuiFormControlLabel-label': {
              flex: 1,
              color: theme.palette.text.primary,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Sidebar; 