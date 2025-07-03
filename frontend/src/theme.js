import { createTheme } from '@mui/material/styles';

// Função para criar tema baseado no modo (light/dark)
export const createAppTheme = (mode = 'light') => {
  const isLight = mode === 'light';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#1a73e8',
        light: '#4285f4',
        dark: '#1557b0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#34a853',
        light: '#46d160',
        dark: '#0d8043',
        contrastText: '#ffffff',
      },
      error: {
        main: '#ea4335',
        light: '#ff7961',
        dark: '#ba000d',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#fbbc05',
        light: '#ffce3d',
        dark: '#f57f17',
        contrastText: isLight ? '#000000' : '#ffffff',
      },
      info: {
        main: '#4285f4',
        light: '#6fa8f5',
        dark: '#1a73e8',
        contrastText: '#ffffff',
      },
      success: {
        main: '#34a853',
        light: '#71c7a8',
        dark: '#0d8043',
        contrastText: '#ffffff',
      },
      background: {
        default: isLight ? '#ffffff' : '#121212',
        paper: isLight ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: isLight ? '#202124' : '#e8eaed',
        secondary: isLight ? '#5f6368' : '#9aa0a6',
        disabled: isLight ? '#80868b' : '#5f6368',
      },
      divider: isLight ? '#e8eaed' : '#3c4043',
      grey: {
        50: isLight ? '#fafafa' : '#0d1117',
        100: isLight ? '#f5f5f5' : '#161b22',
        200: isLight ? '#eeeeee' : '#21262d',
        300: isLight ? '#e0e0e0' : '#30363d',
        400: isLight ? '#bdbdbd' : '#484f58',
        500: isLight ? '#9e9e9e' : '#656d76',
        600: isLight ? '#757575' : '#8b949e',
        700: isLight ? '#616161' : '#b1bac4',
        800: isLight ? '#424242' : '#c9d1d9',
        900: isLight ? '#212121' : '#f0f6fc',
      },
      // Cores personalizadas responsivas ao tema
      custom: {
        googleBlue: '#4285f4',
        googleRed: '#ea4335',
        googleYellow: '#fbbc05',
        googleGreen: '#34a853',
        accent: isLight ? '#1a73e8' : '#8ab4f8',
        neutral: isLight ? '#5f6368' : '#9aa0a6',
        surface: isLight ? '#f8f9fa' : '#202124',
        surfaceVariant: isLight ? '#e8eaed' : '#3c4043',
      },
    },
    typography: {
      fontFamily: [
        'Google Sans Display',
        'Google Sans',
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 400,
        lineHeight: 1.2,
        color: isLight ? '#202124' : '#e8eaed',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 400,
        lineHeight: 1.3,
        color: isLight ? '#202124' : '#e8eaed',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 400,
        lineHeight: 1.4,
        color: isLight ? '#202124' : '#e8eaed',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 400,
        lineHeight: 1.4,
        color: isLight ? '#202124' : '#e8eaed',
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.5,
        color: isLight ? '#202124' : '#e8eaed',
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
        color: isLight ? '#202124' : '#e8eaed',
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.6,
        color: isLight ? '#202124' : '#e8eaed',
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.6,
        color: isLight ? '#5f6368' : '#9aa0a6',
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'none',
        lineHeight: 1.75,
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 1.5,
        color: isLight ? '#5f6368' : '#9aa0a6',
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: isLight ? [
      'none',
      '0px 1px 2px 0px rgba(60,64,67,0.3), 0px 1px 3px 1px rgba(60,64,67,0.15)',
      '0px 1px 2px 0px rgba(60,64,67,0.3), 0px 2px 6px 2px rgba(60,64,67,0.15)',
      '0px 4px 8px 3px rgba(60,64,67,0.15), 0px 1px 3px rgba(60,64,67,0.3)',
      '0px 6px 10px 4px rgba(60,64,67,0.15), 0px 2px 3px rgba(60,64,67,0.3)',
      '0px 8px 12px 6px rgba(60,64,67,0.15), 0px 4px 4px rgba(60,64,67,0.3)',
      '0px 12px 17px 2px rgba(60,64,67,0.14), 0px 5px 22px 4px rgba(60,64,67,0.12)',
      '0px 16px 24px 2px rgba(60,64,67,0.14), 0px 6px 30px 5px rgba(60,64,67,0.12)',
      '0px 24px 38px 3px rgba(60,64,67,0.14), 0px 9px 46px 8px rgba(60,64,67,0.12)',
      '0px 11px 15px -7px rgba(60,64,67,0.2), 0px 24px 38px 3px rgba(60,64,67,0.14)',
      '0px 13px 19px -4px rgba(60,64,67,0.2), 0px 24px 38px 3px rgba(60,64,67,0.14)',
      '0px 24px 38px 3px rgba(60,64,67,0.14), 0px 9px 46px 8px rgba(60,64,67,0.12)',
      '0px 24px 38px 3px rgba(60,64,67,0.14), 0px 9px 46px 8px rgba(60,64,67,0.12)',
      '0px 24px 38px 3px rgba(60,64,67,0.14), 0px 9px 46px 8px rgba(60,64,67,0.12)',
      '0px 24px 38px 3px rgba(60,64,67,0.14), 0px 9px 46px 8px rgba(60,64,67,0.12)',
      '0px 24px 38px 3px rgba(60,64,67,0.14), 0px 9px 46px 8px rgba(60,64,67,0.12)',
      '0px 24px 38px 3px rgba(60,64,67,0.14), 0px 9px 46px 8px rgba(60,64,67,0.12)',
      '0px 24px 38px 3px rgba(60,64,67,0.14), 0px 9px 46px 8px rgba(60,64,67,0.12)',
      '0px 24px 38px 3px rgba(60,64,67,0.14), 0px 9px 46px 8px rgba(60,64,67,0.12)',
      '0px 24px 38px 3px rgba(60,64,67,0.14), 0px 9px 46px 8px rgba(60,64,67,0.12)',
      '0px 24px 38px 3px rgba(60,64,67,0.14), 0px 9px 46px 8px rgba(60,64,67,0.12)',
      '0px 24px 38px 3px rgba(60,64,67,0.14), 0px 9px 46px 8px rgba(60,64,67,0.12)',
      '0px 24px 38px 3px rgba(60,64,67,0.14), 0px 9px 46px 8px rgba(60,64,67,0.12)',
      '0px 24px 38px 3px rgba(60,64,67,0.14), 0px 9px 46px 8px rgba(60,64,67,0.12)',
      '0px 24px 38px 3px rgba(60,64,67,0.14), 0px 9px 46px 8px rgba(60,64,67,0.12)',
    ] : [
      'none',
      '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
      '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15)',
      '0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px rgba(0,0,0,0.3)',
      '0px 6px 10px 4px rgba(0,0,0,0.15), 0px 2px 3px rgba(0,0,0,0.3)',
      '0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px rgba(0,0,0,0.3)',
      '0px 12px 17px 2px rgba(0,0,0,0.14), 0px 5px 22px 4px rgba(0,0,0,0.12)',
      '0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)',
      '0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
      '0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14)',
      '0px 13px 19px -4px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14)',
      '0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
      '0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
      '0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
      '0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
      '0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
      '0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
      '0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
      '0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
      '0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
      '0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
      '0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
      '0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 24,
            padding: '8px 24px',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isLight 
                ? '0px 1px 2px 0px rgba(60,64,67,0.3), 0px 1px 3px 1px rgba(60,64,67,0.15)'
                : '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: isLight 
                ? '0px 1px 2px 0px rgba(60,64,67,0.3), 0px 2px 6px 2px rgba(60,64,67,0.15)'
                : '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15)',
            },
          },
          outlined: {
            borderColor: isLight ? '#dadce0' : '#3c4043',
            color: '#1a73e8',
            '&:hover': {
              backgroundColor: 'rgba(26,115,232,0.04)',
              borderColor: '#1a73e8',
            },
          },
          text: {
            color: '#1a73e8',
            '&:hover': {
              backgroundColor: 'rgba(26,115,232,0.04)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: isLight ? 'transparent' : 'rgba(255,255,255,0.05)',
              '& fieldset': {
                borderColor: isLight ? '#dadce0' : '#3c4043',
              },
              '&:hover fieldset': {
                borderColor: '#1a73e8',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1a73e8',
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${isLight ? '#e8eaed' : '#3c4043'}`,
            boxShadow: isLight 
              ? '0px 1px 2px 0px rgba(60,64,67,0.3), 0px 1px 3px 1px rgba(60,64,67,0.15)'
              : '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
            backgroundColor: isLight ? '#ffffff' : '#1e1e1e',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isLight ? '#ffffff' : '#1e1e1e',
          },
          elevation1: {
            boxShadow: isLight 
              ? '0px 1px 2px 0px rgba(60,64,67,0.3), 0px 1px 3px 1px rgba(60,64,67,0.15)'
              : '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? '#ffffff' : '#1e1e1e',
            color: isLight ? '#202124' : '#e8eaed',
            boxShadow: isLight 
              ? '0px 1px 2px 0px rgba(60,64,67,0.3), 0px 1px 3px 1px rgba(60,64,67,0.15)'
              : '0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
            borderBottom: `1px solid ${isLight ? '#e8eaed' : '#3c4043'}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: 'none',
            backgroundColor: isLight ? '#ffffff' : '#1e1e1e',
            boxShadow: isLight 
              ? '0px 8px 12px 6px rgba(60,64,67,0.15), 0px 4px 4px rgba(60,64,67,0.3)'
              : '0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            margin: '0 12px',
            borderRadius: 8,
            '&.Mui-selected': {
              backgroundColor: isLight ? '#e8f0fe' : 'rgba(26,115,232,0.12)',
              color: '#1a73e8',
              '&:hover': {
                backgroundColor: isLight ? '#e8f0fe' : 'rgba(26,115,232,0.16)',
              },
              '& .MuiListItemIcon-root': {
                color: '#1a73e8',
              },
            },
            '&:hover': {
              backgroundColor: isLight ? 'rgba(32,33,36,0.04)' : 'rgba(255,255,255,0.04)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: isLight ? 'rgba(32,33,36,0.08)' : 'rgba(255,255,255,0.08)',
            color: isLight ? '#202124' : '#e8eaed',
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: isLight ? undefined : 'rgba(255,255,255,0.05)',
          },
        },
      },
    },
  });
};

// Tema padrão (modo claro)
const theme = createAppTheme('light');

// Funções utilitárias para cores responsivas ao tema
export const getThemedColor = (theme, colorKey) => {
  const colors = {
    // Cores primárias do Google
    googleBlue: '#4285f4',
    googleRed: '#ea4335',
    googleYellow: '#fbbc05',
    googleGreen: '#34a853',
    googlePurple: '#673ab7',
    
    // Cores de estado
    success: theme.palette.mode === 'light' ? '#34a853' : '#81c995',
    warning: theme.palette.mode === 'light' ? '#fbbc05' : '#fdd663',
    error: theme.palette.mode === 'light' ? '#ea4335' : '#f28b82',
    info: theme.palette.mode === 'light' ? '#4285f4' : '#8ab4f8',
    
    // Cores de texto
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    
    // Cores neutras responsivas
    neutral: theme.palette.mode === 'light' ? '#5f6368' : '#9aa0a6',
    surface: theme.palette.mode === 'light' ? '#f8f9fa' : '#202124',
    accent: theme.palette.mode === 'light' ? '#1a73e8' : '#8ab4f8',
  };
  
  return colors[colorKey] || colorKey;
};

// Estilos padrão para títulos e subtítulos da aplicação
export const TITLE_STYLES = {
  // Título principal das páginas
  pageTitle: {
    variant: 'h3',
    sx: {
      fontWeight: 700,
      mb: 1,
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      fontSize: { sm: '2rem', lg: '3rem' },
    }
  },
  
  // Subtítulo das páginas
  pageSubtitle: {
    variant: 'h6',
    color: 'text.secondary',
    sx: {
      fontWeight: 400,
      fontSize: { sm: '1rem', lg: '1.25rem' },
    }
  },
  
  // Título de seções
  sectionTitle: {
    variant: 'h5',
    sx: {
      fontWeight: 600,
      fontSize: { sm: '1.25rem', lg: '1.5rem' },
      color: 'text.primary'
    }
  },
  
  // Título de cards/componentes
  cardTitle: {
    variant: 'h6',
    sx: {
      fontWeight: 600,
      fontSize: { sm: '1rem', lg: '1.25rem' },
      color: 'text.primary'
    }
  }
};

export default theme; 