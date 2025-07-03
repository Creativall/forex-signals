import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  Link,
  Alert,
  Fade,
  Slide,
  Avatar,
  useTheme,
  useMediaQuery,
  alpha,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowForward,
  Security,
  TrendingUp,
  AccountCircle,
  Person,
  Phone,
} from '@mui/icons-material';
import { apiCall } from '../config/api';

const Login = ({ onLogin }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estados
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginMode, setLoginMode] = useState('login'); // 'login' ou 'register'

  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};
    
    // Validações para cadastro
    if (loginMode === 'register') {
      if (!formData.name.trim()) {
        newErrors.name = 'Nome é obrigatório';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Telefone é obrigatório';
      } else if (!/^[\d\s\-()+ ]{8,}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Telefone inválido';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }
    }
    
    // Validações comuns
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else {
      // Validação de senha: alfanumérica com mínimo 8 caracteres e um especial
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Senha deve ter pelo menos 8 caracteres, incluindo letras, números e um caractere especial (@$!%*?&)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (loginMode === 'register') {
        // API call para cadastro
        const response = await apiCall('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Limpar todos os erros primeiro
          setErrors({});
          
          // Resetar formulário completamente
          setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            rememberMe: false,
          });
          
          // Voltar para tela de login
          setLoginMode('login');
          
          // Mostrar mensagem de sucesso
          setTimeout(() => {
            setErrors({ success: 'Cadastro realizado com sucesso! Faça login para continuar.' });
          }, 100);
          
        } else {
          setErrors({ general: data.error || 'Erro ao realizar cadastro' });
        }
      } else {
        // Fazer chamada real para API de login
        const response = await apiCall('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Login bem-sucedido - usar dados reais da API
          if (onLogin) {
            onLogin({
              email: data.user.email,
              name: data.user.name, // Usar nome real retornado pela API
              id: data.user.id,
              verified: data.user.verified,
              token: data.token,
              avatar: null,
              rememberMe: formData.rememberMe,
            });
          }
        } else {
          setErrors({ general: data.error || 'Email ou senha inválidos' });
        }
      }
    } catch (error) {
      setErrors({ general: loginMode === 'register' ? 'Erro ao realizar cadastro. Tente novamente.' : 'Erro ao fazer login. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.1)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.05)} 25%,
          ${alpha(theme.palette.primary.light, 0.08)} 50%,
          ${alpha(theme.palette.secondary.light, 0.03)} 75%,
          ${alpha(theme.palette.background.default, 0.95)} 100%)`,
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
          background: `
            radial-gradient(circle at 20% 20%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, ${alpha(theme.palette.info.main, 0.05)} 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            py: 4,
          }}
        >
          {/* Container principal */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              maxWidth: 1200,
              mx: 'auto',
            }}
          >
            {/* Seção da esquerda - Informações */}
            {!isMobile && (
              <Slide direction="right" in timeout={800}>
                <Box sx={{ flex: 1, pr: 4 }}>
                  <Stack spacing={4}>
                    {/* Logo/Título */}
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'transparent',
                          }}
                          src="/icons/favicon.ico"
                          alt="Favicon"
                        />
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                          }}
                        >
                          Ask Pay
                        </Typography>
                      </Stack>
                      
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: 'text.primary',
                        }}
                      >
                        Gerencie seus investimentos com inteligência
                      </Typography>
                      
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.7,
                          maxWidth: 500,
                        }}
                      >
                        Plataforma completa para análise de recomendações forex, gestão financeira
                        e estratégias de trading. Tome decisões mais inteligentes com 
                        ferramentas profissionais.
                      </Typography>
                    </Box>

                    {/* Features */}
                    <Stack spacing={3}>
                      {[
                        {
                          icon: <TrendingUp />,
                          title: 'Recomendações em Tempo Real',
                          description: 'Análises minunciosas e precisas em tempo real'
                        },
                        {
                          icon: <Security />,
                          title: 'Gestão de Capital',
                          description: 'Ferramentas avançadas para controle de risco'
                        },
                        {
                          icon: <AccountCircle />,
                          title: 'Dashboard Inteligente',
                          description: 'Interface intuitiva e relatórios personalizados'
                        }
                      ].map((feature, index) => (
                        <Fade in timeout={1000 + index * 200} key={index}>
                          <Stack direction="row" spacing={3} alignItems="center">
                            <Avatar
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: 'primary.main',
                                width: 48,
                                height: 48,
                              }}
                            >
                              {feature.icon}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="600" mb={0.5}>
                                {feature.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {feature.description}
                              </Typography>
                            </Box>
                          </Stack>
                        </Fade>
                      ))}
                    </Stack>
                  </Stack>
                </Box>
              </Slide>
            )}

            {/* Seção da direita - Formulário */}
            <Slide direction="left" in timeout={600}>
              <Box sx={{ flex: isMobile ? 1 : 0.6, maxWidth: 480 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 4, sm: 5 },
                    borderRadius: 4,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: `linear-gradient(135deg, 
                      ${alpha(theme.palette.background.paper, 0.95)} 0%, 
                      ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
                    backdropFilter: 'blur(20px)',
                    boxShadow: `
                      0 24px 48px ${alpha(theme.palette.common.black, 0.12)},
                      0 12px 24px ${alpha(theme.palette.common.black, 0.08)}
                    `,
                  }}
                >
                  <Stack spacing={4}>
                    {/* Header do formulário */}
                    <Box textAlign="center">
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <img
                          src="/logo-askpay.webp"
                          alt="AskPay Logo"
                          style={{
                            height: '48px',
                            width: 'auto',
                            maxWidth: '150px',
                            objectFit: 'contain',
                          }}
                        />
                      </Box>
                      
                      <Typography variant="h4" fontWeight="700" mb={1}>
                        {loginMode === 'login' ? 'Entrar' : 'Criar Conta'}
                      </Typography>
                      
                      <Typography variant="body1" color="text.secondary">
                        {loginMode === 'login' 
                          ? 'Acesse sua conta para continuar'
                          : 'Cadastre-se para começar a usar'
                        }
                      </Typography>
                    </Box>

                    {/* Erro geral */}
                    {errors.general && (
                      <Fade in>
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                          {errors.general}
                        </Alert>
                      </Fade>
                    )}

                    {/* Sucesso */}
                    {errors.success && (
                      <Fade in>
                        <Alert severity="success" sx={{ borderRadius: 2 }}>
                          {errors.success}
                        </Alert>
                      </Fade>
                    )}

                    {/* Formulário */}
                    <Box component="form" onSubmit={handleSubmit}>
                      <Stack spacing={3}>
                        {/* Nome */}
                        {loginMode === 'register' && (
                          <TextField
                            fullWidth
                            label="Nome"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange('name')}
                            error={!!errors.name}
                            helperText={errors.name}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Person color="action" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`,
                                },
                                '&.Mui-focused': {
                                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                              },
                            }}
                          />
                        )}

                        {/* Email */}
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange('email')}
                          error={!!errors.email}
                          helperText={errors.email}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email color="action" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`,
                              },
                              '&.Mui-focused': {
                                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                              },
                            },
                          }}
                        />

                        {/* Telefone */}
                        {loginMode === 'register' && (
                          <TextField
                            fullWidth
                            label="Telefone"
                            type="text"
                            value={formData.phone}
                            onChange={handleInputChange('phone')}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Phone color="action" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`,
                                },
                                '&.Mui-focused': {
                                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                              },
                            }}
                          />
                        )}

                        {/* Senha */}
                        <TextField
                          fullWidth
                          label="Senha"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleInputChange('password')}
                          error={!!errors.password}
                          helperText={errors.password || (loginMode === 'register' ? 'Mínimo 8 caracteres com letras, números e um caractere especial' : '')}
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
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`,
                              },
                              '&.Mui-focused': {
                                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                              },
                            },
                          }}
                        />

                        {/* Confirmação de senha */}
                        {loginMode === 'register' && (
                          <TextField
                            fullWidth
                            label="Confirmação de Senha"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleInputChange('confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword || 'Digite a senha novamente para confirmar'}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Lock color="action" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                  >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)}`,
                                },
                                '&.Mui-focused': {
                                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                              },
                            }}
                          />
                        )}

                        {/* Opções - apenas no modo login */}
                        {loginMode === 'login' && (
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.rememberMe}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    rememberMe: e.target.checked
                                  }))}
                                  color="primary"
                                />
                              }
                              label="Lembrar-me"
                            />
                            
                            <Link
                              component="button"
                              type="button"
                              variant="body2"
                              sx={{
                                textDecoration: 'none',
                                fontWeight: 500,
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              Esqueceu a senha?
                            </Link>
                          </Stack>
                        )}

                        {/* Botão de submit */}
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="large"
                          disabled={isLoading}
                          endIcon={isLoading ? null : <ArrowForward />}
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                            '&:hover': {
                              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                              transform: 'translateY(-1px)',
                            },
                            '&:disabled': {
                              background: alpha(theme.palette.primary.main, 0.5),
                            },
                          }}
                        >
                          {isLoading ? 'Entrando...' : (loginMode === 'login' ? 'Entrar' : 'Criar Conta')}
                        </Button>
                      </Stack>
                    </Box>

                    {/* Toggle entre login/registro */}
                    <Box textAlign="center">
                      <Typography variant="body2" color="text.secondary">
                        {loginMode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                        {' '}
                        <Link
                          component="button"
                          type="button"
                          variant="body2"
                          onClick={() => {
                            setLoginMode(loginMode === 'login' ? 'register' : 'login');
                            setErrors({}); // Limpar erros ao alternar modo
                            setFormData({
                              name: '',
                              email: '',
                              phone: '',
                              password: '',
                              confirmPassword: '',
                              rememberMe: false,
                            }); // Limpar formulário ao alternar modo
                          }}
                          sx={{
                            fontWeight: 600,
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {loginMode === 'login' ? 'Cadastre-se' : 'Entrar'}
                        </Link>
                      </Typography>
                    </Box>

                    {/* Política de privacidade */}
                    <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
                      Ao continuar, você concorda com nossos{' '}
                      <Link href="#" sx={{ fontWeight: 'bold', color: 'inherit', textDecoration: 'none' }}>Termos de Uso</Link>
                      {' '}e{' '}
                      <Link href="#" sx={{ fontWeight: 'bold', color: 'inherit', textDecoration: 'none' }}>Política de Privacidade</Link>
                    </Typography>
                  </Stack>
                </Paper>
              </Box>
            </Slide>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;