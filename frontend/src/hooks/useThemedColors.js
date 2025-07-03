import { useTheme } from '@mui/material/styles';

export const useThemedColors = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return {
    // Cores primárias do Google
    googleBlue: '#4285f4',
    googleRed: '#ea4335',
    googleYellow: '#fbbc05',
    googleGreen: '#34a853',
    googlePurple: '#673ab7',
    
    // Cores de estado responsivas
    success: isDark ? '#81c995' : '#34a853',
    warning: isDark ? '#fdd663' : '#fbbc05',
    error: isDark ? '#f28b82' : '#ea4335',
    info: isDark ? '#8ab4f8' : '#4285f4',
    
    // Cores de texto
    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
    textDisabled: isDark ? '#5f6368' : '#80868b',
    
    // Cores neutras responsivas
    neutral: isDark ? '#9aa0a6' : '#5f6368',
    surface: isDark ? '#202124' : '#f8f9fa',
    accent: isDark ? '#8ab4f8' : '#1a73e8',
    
    // Cores de background
    background: theme.palette.background.default,
    paper: theme.palette.background.paper,
    
    // Cores dos chips e indicadores
    getTimeframeColor: (timeframe) => {
      const colors = {
        '1m': isDark ? '#f28b82' : '#ea4335',
        '5m': isDark ? '#fdd663' : '#fbbc05',
        '10m': isDark ? '#8ab4f8' : '#4285f4',
        '15m': isDark ? '#81c995' : '#34a853',
        '30m': isDark ? '#c58af9' : '#673ab7',
        all: theme.palette.text.secondary
      };
      return colors[timeframe] || theme.palette.text.secondary;
    },
    
    // Cores para status de trading
    getStatusColor: (status) => {
      switch (status) {
        case 'win':
          return isDark ? '#81c995' : '#34a853';
        case 'loss':
          return isDark ? '#f28b82' : '#ea4335';
        case 'active':
          return isDark ? '#8ab4f8' : '#4285f4';
        default:
          return theme.palette.text.secondary;
      }
    },
    
    // Cores para indicadores de performance
    getPerformanceColor: (value, thresholds = { good: 70, average: 50 }) => {
      if (value >= thresholds.good) return isDark ? '#81c995' : '#34a853';
      if (value >= thresholds.average) return isDark ? '#fdd663' : '#fbbc05';
      return isDark ? '#f28b82' : '#ea4335';
    },
    
    // Cores para direção de trading
    getDirectionColor: (direction) => {
      return direction === 'COMPRA' 
        ? (isDark ? '#81c995' : '#34a853')
        : (isDark ? '#f28b82' : '#ea4335');
    },
    
    // Cores para nível de confiança
    getConfidenceColor: (confidence) => {
      const colors = {
        'Alta': isDark ? '#81c995' : '#34a853',
        'Média': isDark ? '#fdd663' : '#fbbc05',
        'Baixa': isDark ? '#f28b82' : '#ea4335'
      };
      return colors[confidence] || theme.palette.text.secondary;
    },
    
    // Cores para gráficos e dados
    chartColors: {
      primary: isDark ? '#8ab4f8' : '#4285f4',
      secondary: isDark ? '#81c995' : '#34a853',
      tertiary: isDark ? '#fdd663' : '#fbbc05',
      quaternary: isDark ? '#f28b82' : '#ea4335',
      quinary: isDark ? '#c58af9' : '#673ab7'
    }
  };
};

export default useThemedColors; 