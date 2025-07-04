import { createTheme } from '@mui/material/styles';

// Função para criar tema baseado no modo (light/dark) inspirado no Gemini
export const createAppTheme = (mode = 'light') => {
  const isLight = mode === 'light';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#4285f4', // Google Blue
        light: '#8ab4f8',
        dark: '#1a73e8',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#ea4335', // Google Red
        light: '#ff6659',
        dark: '#d33b2c',
        contrastText: '#ffffff',
      },
      error: {
        main: '#ea4335',
        light: '#ff6659',
        dark: '#d33b2c',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#fbbc04', // Google Yellow
        light: '#fdd663',
        dark: '#f9ab00',
        contrastText: '#000000',
      },
      info: {
        main: '#4285f4',
        light: '#70a7ff',
        dark: '#1a73e8',
        contrastText: '#ffffff',
      },
      success: {
        main: '#34a853', // Google Green
        light: '#81c995',
        dark: '#137333',
        contrastText: '#ffffff',
      },
      background: {
        default: isLight ? '#fafafa' : '#0d1117',
        paper: isLight ? '#ffffff' : '#161b22',
      },
      text: {
        primary: isLight ? '#1f1f1f' : '#f8f9fa',
        secondary: isLight ? '#5f6368' : '#9aa0a6',
        disabled: isLight ? '#80868b' : '#6e7681',
      },
      divider: isLight ? '#e8eaed' : '#30363d',
      grey: {
        50: isLight ? '#fafafa' : '#0d1117',
        100: isLight ? '#f8f9fa' : '#161b22',
        200: isLight ? '#e8eaed' : '#21262d',
        300: isLight ? '#dadce0' : '#30363d',
        400: isLight ? '#bdc1c6' : '#656d76',
        500: isLight ? '#9aa0a6' : '#8b949e',
        600: isLight ? '#80868b' : '#b1bac4',
        700: isLight ? '#5f6368' : '#c9d1d9',
        800: isLight ? '#3c4043' : '#f0f6fc',
        900: isLight ? '#1f1f1f' : '#ffffff',
      },
      // Cores personalizadas do Gemini
      gemini: {
        gradient: isLight 
          ? 'linear-gradient(135deg, #4285f4 0%, #ea4335 25%, #fbbc04 50%, #34a853 75%, #9c27b0 100%)'
          : 'linear-gradient(135deg, #8ab4f8 0%, #f28b82 25%, #fdd663 50%, #81c995 75%, #c58af9 100%)',
        blue: '#4285f4',
        red: '#ea4335',
        yellow: '#fbbc04',
        green: '#34a853',
        purple: '#9c27b0',
        surface: isLight ? '#f8f9fa' : '#161b22',
        surfaceVariant: isLight ? '#e8eaed' : '#30363d',
      },
    },
    typography: {
      fontFamily: [
        'Google Sans',
        'Product Sans',
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '3.5rem',
        fontWeight: 400,
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        color: isLight ? '#1f1f1f' : '#f8f9fa',
        '@media (max-width:600px)': {
          fontSize: '2.5rem',
        },
      },
      h2: {
        fontSize: '2.75rem',
        fontWeight: 400,
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
        color: isLight ? '#1f1f1f' : '#f8f9fa',
        '@media (max-width:600px)': {
          fontSize: '2rem',
        },
      },
      h3: {
        fontSize: '2.25rem',
        fontWeight: 400,
        lineHeight: 1.3,
        color: isLight ? '#1f1f1f' : '#f8f9fa',
        '@media (max-width:600px)': {
          fontSize: '1.75rem',
        },
      },
      h4: {
        fontSize: '1.75rem',
        fontWeight: 500,
        lineHeight: 1.4,
        color: isLight ? '#1f1f1f' : '#f8f9fa',
      },
      h5: {
        fontSize: '1.5rem',
        fontWeight: 500,
        lineHeight: 1.5,
        color: isLight ? '#1f1f1f' : '#f8f9fa',
      },
      h6: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.5,
        color: isLight ? '#1f1f1f' : '#f8f9fa',
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.6,
        color: isLight ? '#5f6368' : '#9aa0a6',
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
        letterSpacing: '0.02em',
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 1.5,
        color: isLight ? '#80868b' : '#6e7681',
      },
      subtitle1: {
        fontSize: '1.125rem',
        fontWeight: 400,
        lineHeight: 1.6,
        color: isLight ? '#5f6368' : '#9aa0a6',
      },
      subtitle2: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
        color: isLight ? '#5f6368' : '#9aa0a6',
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: isLight ? [
      'none',
      '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
      '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)',
      '0px 10px 20px rgba(0, 0, 0, 0.19), 0px 6px 6px rgba(0, 0, 0, 0.23)',
      '0px 14px 28px rgba(0, 0, 0, 0.25), 0px 10px 10px rgba(0, 0, 0, 0.22)',
      '0px 19px 38px rgba(0, 0, 0, 0.30), 0px 15px 12px rgba(0, 0, 0, 0.22)',
      '0px 24px 48px rgba(0, 0, 0, 0.35), 0px 19px 19px rgba(0, 0, 0, 0.22)',
      '0px 30px 60px rgba(0, 0, 0, 0.35), 0px 24px 24px rgba(0, 0, 0, 0.22)',
      '0px 36px 72px rgba(0, 0, 0, 0.35), 0px 30px 30px rgba(0, 0, 0, 0.22)',
      '0px 42px 84px rgba(0, 0, 0, 0.35), 0px 36px 36px rgba(0, 0, 0, 0.22)',
      '0px 48px 96px rgba(0, 0, 0, 0.35), 0px 42px 42px rgba(0, 0, 0, 0.22)',
      '0px 54px 108px rgba(0, 0, 0, 0.35), 0px 48px 48px rgba(0, 0, 0, 0.22)',
      '0px 60px 120px rgba(0, 0, 0, 0.35), 0px 54px 54px rgba(0, 0, 0, 0.22)',
      '0px 66px 132px rgba(0, 0, 0, 0.35), 0px 60px 60px rgba(0, 0, 0, 0.22)',
      '0px 72px 144px rgba(0, 0, 0, 0.35), 0px 66px 66px rgba(0, 0, 0, 0.22)',
      '0px 78px 156px rgba(0, 0, 0, 0.35), 0px 72px 72px rgba(0, 0, 0, 0.22)',
      '0px 84px 168px rgba(0, 0, 0, 0.35), 0px 78px 78px rgba(0, 0, 0, 0.22)',
      '0px 90px 180px rgba(0, 0, 0, 0.35), 0px 84px 84px rgba(0, 0, 0, 0.22)',
      '0px 96px 192px rgba(0, 0, 0, 0.35), 0px 90px 90px rgba(0, 0, 0, 0.22)',
      '0px 102px 204px rgba(0, 0, 0, 0.35), 0px 96px 96px rgba(0, 0, 0, 0.22)',
      '0px 108px 216px rgba(0, 0, 0, 0.35), 0px 102px 102px rgba(0, 0, 0, 0.22)',
      '0px 114px 228px rgba(0, 0, 0, 0.35), 0px 108px 108px rgba(0, 0, 0, 0.22)',
      '0px 120px 240px rgba(0, 0, 0, 0.35), 0px 114px 114px rgba(0, 0, 0, 0.22)',
      '0px 126px 252px rgba(0, 0, 0, 0.35), 0px 120px 120px rgba(0, 0, 0, 0.22)',
      '0px 132px 264px rgba(0, 0, 0, 0.35), 0px 126px 126px rgba(0, 0, 0, 0.22)',
    ] : [
      'none',
      '0px 1px 3px rgba(255, 255, 255, 0.12), 0px 1px 2px rgba(255, 255, 255, 0.24)',
      '0px 3px 6px rgba(255, 255, 255, 0.16), 0px 3px 6px rgba(255, 255, 255, 0.23)',
      '0px 10px 20px rgba(255, 255, 255, 0.19), 0px 6px 6px rgba(255, 255, 255, 0.23)',
      '0px 14px 28px rgba(255, 255, 255, 0.25), 0px 10px 10px rgba(255, 255, 255, 0.22)',
      '0px 19px 38px rgba(255, 255, 255, 0.30), 0px 15px 12px rgba(255, 255, 255, 0.22)',
      '0px 24px 48px rgba(255, 255, 255, 0.35), 0px 19px 19px rgba(255, 255, 255, 0.22)',
      '0px 30px 60px rgba(255, 255, 255, 0.35), 0px 24px 24px rgba(255, 255, 255, 0.22)',
      '0px 36px 72px rgba(255, 255, 255, 0.35), 0px 30px 30px rgba(255, 255, 255, 0.22)',
      '0px 42px 84px rgba(255, 255, 255, 0.35), 0px 36px 36px rgba(255, 255, 255, 0.22)',
      '0px 48px 96px rgba(255, 255, 255, 0.35), 0px 42px 42px rgba(255, 255, 255, 0.22)',
      '0px 54px 108px rgba(255, 255, 255, 0.35), 0px 48px 48px rgba(255, 255, 255, 0.22)',
      '0px 60px 120px rgba(255, 255, 255, 0.35), 0px 54px 54px rgba(255, 255, 255, 0.22)',
      '0px 66px 132px rgba(255, 255, 255, 0.35), 0px 60px 60px rgba(255, 255, 255, 0.22)',
      '0px 72px 144px rgba(255, 255, 255, 0.35), 0px 66px 66px rgba(255, 255, 255, 0.22)',
      '0px 78px 156px rgba(255, 255, 255, 0.35), 0px 72px 72px rgba(255, 255, 255, 0.22)',
      '0px 84px 168px rgba(255, 255, 255, 0.35), 0px 78px 78px rgba(255, 255, 255, 0.22)',
      '0px 90px 180px rgba(255, 255, 255, 0.35), 0px 84px 84px rgba(255, 255, 255, 0.22)',
      '0px 96px 192px rgba(255, 255, 255, 0.35), 0px 90px 90px rgba(255, 255, 255, 0.22)',
      '0px 102px 204px rgba(255, 255, 255, 0.35), 0px 96px 96px rgba(255, 255, 255, 0.22)',
      '0px 108px 216px rgba(255, 255, 255, 0.35), 0px 102px 102px rgba(255, 255, 255, 0.22)',
      '0px 114px 228px rgba(255, 255, 255, 0.35), 0px 108px 108px rgba(255, 255, 255, 0.22)',
      '0px 120px 240px rgba(255, 255, 255, 0.35), 0px 114px 114px rgba(255, 255, 255, 0.22)',
      '0px 126px 252px rgba(255, 255, 255, 0.35), 0px 120px 120px rgba(255, 255, 255, 0.22)',
      '0px 132px 264px rgba(255, 255, 255, 0.35), 0px 126px 126px rgba(255, 255, 255, 0.22)',
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            textTransform: 'none',
            fontWeight: 500,
            padding: '12px 24px',
            fontSize: '0.875rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            },
          },
          contained: {
            background: isLight 
              ? 'linear-gradient(135deg, #4285f4 0%, #1a73e8 100%)'
              : 'linear-gradient(135deg, #8ab4f8 0%, #4285f4 100%)',
            '&:hover': {
              background: isLight 
                ? 'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)'
                : 'linear-gradient(135deg, #4285f4 0%, #1a73e8 100%)',
            },
          },
          outlined: {
            borderColor: isLight ? '#dadce0' : '#30363d',
            '&:hover': {
              borderColor: isLight ? '#4285f4' : '#8ab4f8',
              backgroundColor: isLight ? 'rgba(66, 133, 244, 0.04)' : 'rgba(138, 180, 248, 0.04)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: isLight ? '1px solid #e8eaed' : '1px solid #30363d',
            boxShadow: isLight 
              ? '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)'
              : '0px 1px 3px rgba(255, 255, 255, 0.12), 0px 1px 2px rgba(255, 255, 255, 0.24)',
            '&:hover': {
              boxShadow: isLight 
                ? '0px 4px 8px rgba(0, 0, 0, 0.16), 0px 2px 4px rgba(0, 0, 0, 0.08)'
                : '0px 4px 8px rgba(255, 255, 255, 0.16), 0px 2px 4px rgba(255, 255, 255, 0.08)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              '& fieldset': {
                borderColor: isLight ? '#dadce0' : '#30363d',
              },
              '&:hover fieldset': {
                borderColor: isLight ? '#4285f4' : '#8ab4f8',
              },
              '&.Mui-focused fieldset': {
                borderColor: isLight ? '#4285f4' : '#8ab4f8',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            fontWeight: 500,
          },
        },
      },
    },
  });
};

// Estilos de título inspirados no Gemini
export const TITLE_STYLES = {
  hero: {
    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
    fontWeight: 400,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #4285f4 0%, #ea4335 25%, #fbbc04 50%, #34a853 75%, #9c27b0 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    textAlign: 'center',
    mb: 3,
  },
  pageTitle: {
    variant: 'h3',
    sx: {
      fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      mb: 1,
    },
  },
  pageSubtitle: {
    variant: 'body1',
    sx: {
      fontSize: { xs: '1rem', sm: '1.125rem' },
      fontWeight: 400,
      lineHeight: 1.6,
      color: 'text.secondary',
      mb: 2,
    },
  },
  sectionTitle: {
    variant: 'h4',
    sx: {
      fontSize: { xs: '1.5rem', sm: '1.75rem' },
      fontWeight: 500,
      lineHeight: 1.4,
      mb: 1,
    },
  },
  cardTitle: {
    variant: 'h5',
    sx: {
      fontSize: { xs: '1.25rem', sm: '1.5rem' },
      fontWeight: 500,
      lineHeight: 1.4,
      mb: 1,
    },
  },
  section: {
    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
    fontWeight: 400,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    mb: 2,
  },
  card: {
    fontSize: { xs: '1.25rem', sm: '1.5rem' },
    fontWeight: 500,
    lineHeight: 1.4,
    mb: 1,
  },
};

// Função para obter cores temáticas
export const getThemedColor = (theme, colorKey) => {
  const colors = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main,
    text: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    background: theme.palette.background.default,
    surface: theme.palette.background.paper,
    divider: theme.palette.divider,
  };
  
  return colors[colorKey] || theme.palette.primary.main;
};

export default createAppTheme; 