import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { createAppTheme } from './theme';
import { FinanceProvider } from './contexts/FinanceContext';

// Componentes
import Login from './components/Login';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import OverviewPage from './components/Dashboard/OverviewPage';
import Dashboard from './components/Dashboard';
import GestaoFinanceira from './components/GestaoFinanceira';
import Indicacoes from './components/Indicacoes';
import Settings from './components/Settings';
import Protecao from './components/Protecao';
import GrupoTelegram from './components/GrupoTelegram';
import CorretoraAfiliado from './components/CorretoraAfiliado';
import InstitucionalAulas from './components/InstitucionalAulas';

// Configuração de armazenamento
const USER_STORAGE_KEY = 'forex_user';
const THEME_STORAGE_KEY = 'forex_theme_mode';

function App() {
  const [user, setUser] = useState(null);
  const [themeMode, setThemeMode] = useState('light');

  // Criar tema responsivo
  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  // Alternar tema
  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localStorage.setItem(THEME_STORAGE_KEY, newMode);
  };

  // Carregar configurações do localStorage
  useEffect(() => {
    // Carregar tema
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      setThemeMode(savedTheme);
    }

    // Carregar usuário
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return parsedUser;
      }
      return null;
    } catch (error) {
      // console.warn('Erro ao carregar usuário do localStorage:', error);
      return null;
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Componente de alternância de tema
  const ThemeToggle = () => (
          <Box
            sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1300,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '50%',
        boxShadow: theme.shadows[4],
        border: `1px solid ${theme.palette.divider}`,
            }}
          >
      <Tooltip title={`Alternar para tema ${themeMode === 'light' ? 'escuro' : 'claro'}`}>
        <IconButton onClick={toggleTheme} size="large">
          {themeMode === 'light' ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Tooltip>
          </Box>
    );

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <FinanceProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            {/* Alternador de tema */}
            <ThemeToggle />
            
            <Routes>
              {/* Rota de login */}
              <Route 
                path="/login" 
                element={
                  user ? (
                    <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
                  )
                } 
              />
              
              {/* Rotas protegidas */}
              <Route 
                path="/dashboard/*" 
                element={
                  user ? (
                    <DashboardLayout user={user} onLogout={handleLogout}>
                      <Routes>
                        <Route index element={<OverviewPage />} />
                        <Route path="trading" element={<Dashboard />} />
                        <Route path="financeiro" element={<GestaoFinanceira />} />
                        <Route path="indicacoes" element={<Indicacoes />} />
                        <Route path="protecao" element={<Protecao />} />
                        <Route path="telegram" element={<GrupoTelegram />} />
                        <Route path="corretora" element={<CorretoraAfiliado />} />
                        <Route path="aulas" element={<InstitucionalAulas />} />
                        <Route path="configuracoes" element={<Settings user={user} />} />
                      </Routes>
                    </DashboardLayout>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              
              {/* Rota raiz */}
              <Route 
                path="/" 
                element={
                  user ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                } 
              />
              
              {/* Rota 404 */}
              <Route 
                path="*" 
                element={
                  <Navigate to={user ? "/dashboard" : "/login"} replace />
                } 
              />
            </Routes>
          </Box>
        </Router>
        </FinanceProvider>
      </ThemeProvider>
  );
}

export default App;
