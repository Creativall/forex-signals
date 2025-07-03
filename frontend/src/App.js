import React, { useState, createContext, useContext, useEffect } from 'react';
import { ThemeProvider, CssBaseline, GlobalStyles, Box, CircularProgress } from '@mui/material';
import { createAppTheme } from './theme';
import { FinanceProvider } from './contexts/FinanceContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// Contexto do tema
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro do ThemeProvider');
  }
  return context;
};

// Chave para localStorage
const USER_STORAGE_KEY = 'forex_signals_user';

// Estilos globais dinâmicos baseados no tema
const createGlobalStyles = (mode) => {
  const isDark = mode === 'dark';
  
  return {
    '*': {
      boxSizing: 'border-box',
    },
    html: {
      height: '100%',
    },
    body: {
      height: '100%',
      margin: 0,
      padding: 0,
      fontFamily: 'Google Sans, Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
      backgroundColor: isDark ? '#121212' : '#f8f9fa',
      color: isDark ? '#e8eaed' : '#202124',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    },
    '#root': {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    // Custom scrollbar for webkit browsers
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '::-webkit-scrollbar-thumb': {
      background: isDark ? '#3c4043' : '#dadce0',
      borderRadius: '4px',
      '&:hover': {
        background: isDark ? '#484f58' : '#bdc1c6',
      },
    },
    // Smooth transitions for interactive elements
    'button, input, select, textarea': {
      transition: 'all 0.2s ease-in-out',
    },
    // Remove default button styles
    'button': {
      border: 'none',
      outline: 'none',
      cursor: 'pointer',
    },
    // Modern focus styles
    '*:focus-visible': {
      outline: '2px solid #1a73e8',
      outlineOffset: '2px',
      borderRadius: '4px',
    },
    // Loading animation keyframes
    '@keyframes fadeIn': {
      from: { opacity: 0, transform: 'translateY(10px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    '@keyframes slideIn': {
      from: { transform: 'translateX(-100%)' },
      to: { transform: 'translateX(0)' },
    },
    '@keyframes pulse': {
      '0%, 100%': { transform: 'scale(1)' },
      '50%': { transform: 'scale(1.05)' },
    },
    '@keyframes shimmer': {
      '0%': { backgroundPosition: '-200px 0' },
      '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
    },
    // Animation classes
    '.fade-in': {
      animation: 'fadeIn 0.3s ease-out',
    },
    '.slide-in': {
      animation: 'slideIn 0.3s ease-out',
    },
    '.pulse': {
      animation: 'pulse 0.6s ease-in-out',
    },
    // Utility classes
    '.flex-center': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    '.card-hover': {
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: isDark 
          ? '0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px rgba(0,0,0,0.3)'
          : '0px 4px 8px 3px rgba(60,64,67,0.15), 0px 1px 3px rgba(60,64,67,0.3)',
      },
    },
    // Theme transition for all elements
    '*, *::before, *::after': {
      transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease',
    },
  };
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de loading para verificar sessão
  const [themeMode, setThemeMode] = useState(() => {
    // Recuperar preferência salva no localStorage
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme || 'light';
  });

  // Funções para gerenciar localStorage
  const saveUserToStorage = (userData) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      // console.warn('Erro ao salvar usuário no localStorage:', error);
    }
  };

  const loadUserFromStorage = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        return parsedUser;
      }
      return null;
    } catch (error) {
      // console.warn('Erro ao carregar usuário do localStorage:', error);
      return null;
    }
  };

  const removeUserFromStorage = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    } catch (error) {
      // console.warn('Erro ao remover usuário do localStorage:', error);
    }
  };

  // Carregar usuário do localStorage na inicialização
  useEffect(() => {
    const savedUser = loadUserFromStorage();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false); // Finalizar loading após verificar sessão
  }, []);

  // Salvar preferência no localStorage quando o tema mudar
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    saveUserToStorage(userData); // Persistir no localStorage
    
    // Salvar token separadamente para a nova configuração da API
    if (userData.token) {
      localStorage.setItem('authToken', userData.token);
    }
  };

  const handleLogout = () => {
    setUser(null);
    removeUserFromStorage(); // Remover do localStorage
    
    // Remover token da nova configuração da API
    localStorage.removeItem('authToken');
  };

  const theme = createAppTheme(themeMode);
  const globalStyles = createGlobalStyles(themeMode);

  const themeContextValue = {
    mode: themeMode,
    toggleTheme,
    isDark: themeMode === 'dark',
    isLight: themeMode === 'light',
  };

  // Mostrar loading enquanto verifica a sessão
  if (isLoading) {
    return (
      <ThemeContext.Provider value={themeContextValue}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles styles={globalStyles} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
              backgroundColor: 'background.default',
            }}
          >
            <CircularProgress size={60} thickness={4} />
          </Box>
        </ThemeProvider>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        <FinanceProvider>
          <div className="fade-in">
            {user ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Login onLogin={handleLogin} />
            )}
          </div>
        </FinanceProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
export { ThemeContext };
