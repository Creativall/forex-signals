import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  TrendingUp,
  Security,
  Speed,
  Analytics,
  AutoGraph,
} from '@mui/icons-material';
import { TITLE_STYLES } from '../theme';
import { apiCall } from '../config/api';

const Login = ({ onLogin }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        data: formData
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Componente de feature card
  const FeatureCard = ({ icon, title, description }) => (
    <Card
      sx={{
        height: '100%',
        background: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Box
          sx={{
            mb: 2,
            color: theme.palette.primary.main,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e8f0fe 100%)'
          : 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorativo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.palette.gemini?.gradient || theme.palette.primary.main,
          opacity: 0.03,
          pointerEvents: 'none',
        }}
      />
      
      {/* Formas geométricas decorativas */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: theme.palette.primary.main,
          opacity: 0.1,
          filter: 'blur(40px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: theme.palette.secondary.main,
          opacity: 0.1,
          filter: 'blur(30px)',
        }}
      />

      <Container maxWidth="lg" sx={{ flex: 1, py: 4, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} sx={{ minHeight: '100vh' }} alignItems="center">
          {/* Seção Hero */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 4, md: 0 } }}>
              {/* Título principal */}
              <Typography sx={TITLE_STYLES.hero}>
                AskPay
              </Typography>
              
              {/* Subtítulo */}
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  color: 'text.secondary',
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                Forex Signals - Plataforma inteligente para análise e gestão de sinais de forex
              </Typography>
              
              {/* Descrição */}
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: 'text.secondary',
                  fontSize: '1.125rem',
                  lineHeight: 1.7,
                  maxWidth: 500,
                }}
              >
                Transforme seus investimentos com nossa tecnologia avançada de análise de mercado, 
                gestão de risco inteligente e sinais precisos em tempo real.
              </Typography>

              {/* Tags de recursos */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                <Chip
                  icon={<TrendingUp />}
                  label="Sinais em Tempo Real"
                  variant="outlined"
                  sx={{ borderRadius: 3 }}
                />
                <Chip
                  icon={<Security />}
                  label="Gestão de Risco"
                  variant="outlined"
                  sx={{ borderRadius: 3 }}
                />
                <Chip
                  icon={<Analytics />}
                  label="Análise Avançada"
                  variant="outlined"
                  sx={{ borderRadius: 3 }}
                />
              </Box>

              {/* Cards de recursos - apenas desktop */}
              {!isMobile && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid size={{ xs: 6 }}>
                    <FeatureCard
                      icon={<Speed sx={{ fontSize: 40 }} />}
                      title="Velocidade"
                      description="Sinais instantâneos com latência ultra baixa"
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <FeatureCard
                      icon={<AutoGraph sx={{ fontSize: 40 }} />}
                      title="Precisão"
                      description="IA avançada para análise de mercado"
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
          </Grid>

          {/* Seção de Login */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  maxWidth: 400,
                  width: '100%',
                  borderRadius: 4,
                  background: theme.palette.mode === 'light' 
                    ? 'rgba(255, 255, 255, 0.95)'
                    : 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: theme.shadows[8],
                }}
              >
                {/* Cabeçalho do formulário */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    Entrar
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Acesse sua conta para continuar
                  </Typography>
                </Box>

                {/* Formulário */}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  {error && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    name="password"
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: 'none',
                      background: theme.palette.gemini?.gradient || theme.palette.primary.main,
                      '&:hover': {
                        background: theme.palette.gemini?.gradient || theme.palette.primary.main,
                        filter: 'brightness(1.1)',
                      },
                    }}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>

                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      ou
                    </Typography>
                  </Divider>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center' }}
                  >
                    Não tem uma conta?{' '}
                    <Button
                      variant="text"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        p: 0,
                        minWidth: 'auto',
                      }}
                    >
                      Registre-se
                    </Button>
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Rodapé */}
      <Box
        sx={{
          py: 2,
          textAlign: 'center',
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2024 AskPay - Forex Signals. Todos os direitos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;