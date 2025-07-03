import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Stack,
  Avatar,
  TextField,
  Divider,
  Chip,
  useTheme,
  alpha,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Person,
  Notifications,
  Security,
  Palette,
  Language,
  TrendingUp,
  Save,
  Edit,
  Shield,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useTheme as useAppTheme } from '../App';

const SettingCard = ({ icon, title, description, children }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        backdropFilter: 'blur(20px)',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                width: 40,
                height: 40,
              }}
            >
              {icon}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="600">
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
};

const Settings = ({ user }) => {
  const theme = useTheme();
  const appTheme = useAppTheme();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      trading: true,
      marketing: false,
    },
    trading: {
      autoSignals: true,
      riskLevel: 'medium',
      maxLoss: 5,
      currency: 'BRL',
    },
    display: {
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      compactView: false,
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: user?.name || 'Trader',
    email: user?.email || 'trader@askpay.com',
    phone: '+55 (11) 99999-9999',
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleUserInfoChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // console.log('Saving settings:', settings);
    setNotification({
      open: true,
      message: 'Configurações salvas com sucesso!',
      severity: 'success'
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Configurações
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ fontWeight: 400, maxWidth: 600 }}
          >
            Personalize sua experiência de trading e gerencie suas preferências
          </Typography>
        </Box>

        {/* Profile Section */}
        <SettingCard
          icon={<Person />}
          title="Perfil do Usuário"
          description="Gerencie suas informações pessoais"
        >
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2">Informações Básicas</Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Edit />}
                onClick={() => setEditMode(!editMode)}
                sx={{ textTransform: 'none' }}
              >
                {editMode ? 'Cancelar' : 'Editar'}
              </Button>
            </Stack>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={userInfo.name}
                  onChange={(e) => handleUserInfoChange('name', e.target.value)}
                  disabled={!editMode}
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={userInfo.email}
                  onChange={(e) => handleUserInfoChange('email', e.target.value)}
                  disabled={!editMode}
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={userInfo.phone}
                  onChange={(e) => handleUserInfoChange('phone', e.target.value)}
                  disabled={!editMode}
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Chip label="Conta Pro" color="primary" size="small" />
                  <Chip label="Verificado" color="success" size="small" />
                </Stack>
              </Grid>
            </Grid>

            {editMode && (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Save />}
                  onClick={() => setEditMode(false)}
                  sx={{ textTransform: 'none' }}
                >
                  Salvar
                </Button>
              </Stack>
            )}
          </Stack>
        </SettingCard>

        <Grid container spacing={3}>
          {/* Theme Settings */}
          <Grid size={{ xs: 12, md: 6 }}>
            <SettingCard
              icon={<Palette />}
              title="Aparência"
              description="Customize a aparência da plataforma"
            >
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={appTheme.isDark}
                      onChange={appTheme.toggleTheme}
                      icon={
                        <LightMode 
                          sx={{ 
                            fontSize: 18, 
                            color: '#FFA726' // Cor laranja para o sol
                          }} 
                        />
                      }
                      checkedIcon={
                        <DarkMode 
                          sx={{ 
                            fontSize: 18, 
                            color: '#90CAF9' // Cor azul claro para a lua
                          }} 
                        />
                      }
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {appTheme.isDark ? (
                        <DarkMode sx={{ color: '#90CAF9', fontSize: 20 }} />
                      ) : (
                        <LightMode sx={{ color: '#FFA726', fontSize: 20 }} />
                      )}
                      <span>{appTheme.isDark ? 'Modo Escuro' : 'Modo Claro'}</span>
                    </Box>
                  }
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.display.compactView}
                      onChange={(e) => handleSettingChange('display', 'compactView', e.target.checked)}
                    />
                  }
                  label="Visualização Compacta"
                />

                <FormControl size="small" fullWidth>
                  <InputLabel>Idioma</InputLabel>
                  <Select
                    value={settings.display.language}
                    onChange={(e) => handleSettingChange('display', 'language', e.target.value)}
                    label="Idioma"
                  >
                    <MenuItem value="pt-BR">Português (BR)</MenuItem>
                    <MenuItem value="en-US">English (US)</MenuItem>
                    <MenuItem value="es-ES">Español</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </SettingCard>
          </Grid>

          {/* Notification Settings */}
          <Grid size={{ xs: 12, md: 6 }}>
            <SettingCard
              icon={<Notifications />}
              title="Notificações"
              description="Configure suas preferências de notificação"
            >
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.email}
                      onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    />
                  }
                  label="Notificações por Email"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.push}
                      onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                    />
                  }
                  label="Notificações Push"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.trading}
                      onChange={(e) => handleSettingChange('notifications', 'trading', e.target.checked)}
                    />
                  }
                  label="Alertas de Trading"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.marketing}
                      onChange={(e) => handleSettingChange('notifications', 'marketing', e.target.checked)}
                    />
                  }
                  label="Novidades e Promoções"
                />
              </Stack>
            </SettingCard>
          </Grid>

          {/* Trading Settings */}
          <Grid size={{ xs: 12, md: 6 }}>
            <SettingCard
              icon={<TrendingUp />}
              title="Preferências de Trading"
              description="Configure suas preferências de negociação"
            >
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.trading.autoSignals}
                      onChange={(e) => handleSettingChange('trading', 'autoSignals', e.target.checked)}
                    />
                  }
                  label="Indicações Automáticas"
                />

                <FormControl size="small" fullWidth>
                  <InputLabel>Nível de Risco</InputLabel>
                  <Select
                    value={settings.trading.riskLevel}
                    onChange={(e) => handleSettingChange('trading', 'riskLevel', e.target.value)}
                    label="Nível de Risco"
                  >
                    <MenuItem value="low">Baixo</MenuItem>
                    <MenuItem value="medium">Médio</MenuItem>
                    <MenuItem value="high">Alto</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  size="small"
                  label="Perda Máxima (%)"
                  type="number"
                  value={settings.trading.maxLoss}
                  onChange={(e) => handleSettingChange('trading', 'maxLoss', parseFloat(e.target.value))}
                />

                <FormControl size="small" fullWidth>
                  <InputLabel>Moeda</InputLabel>
                  <Select
                    value={settings.trading.currency}
                    onChange={(e) => handleSettingChange('trading', 'currency', e.target.value)}
                    label="Moeda"
                  >
                    <MenuItem value="BRL">Real Brasileiro (BRL)</MenuItem>
                    <MenuItem value="USD">Dólar Americano (USD)</MenuItem>
                    <MenuItem value="EUR">Euro (EUR)</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </SettingCard>
          </Grid>

          {/* Security Settings */}
          <Grid size={{ xs: 12, md: 6 }}>
            <SettingCard
              icon={<Security />}
              title="Segurança"
              description="Mantenha sua conta segura"
            >
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.twoFactor}
                      onChange={(e) => handleSettingChange('security', 'twoFactor', e.target.checked)}
                    />
                  }
                  label="Autenticação de Dois Fatores"
                />

                <FormControl size="small" fullWidth>
                  <InputLabel>Timeout da Sessão</InputLabel>
                  <Select
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                    label="Timeout da Sessão"
                  >
                    <MenuItem value={15}>15 minutos</MenuItem>
                    <MenuItem value={30}>30 minutos</MenuItem>
                    <MenuItem value={60}>1 hora</MenuItem>
                    <MenuItem value={120}>2 horas</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Shield />}
                  sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
                >
                  Alterar Senha
                </Button>
              </Stack>
            </SettingCard>
          </Grid>
        </Grid>

        {/* Save All Settings */}
        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="600" mb={1}>
                  Salvar Configurações
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Suas alterações serão aplicadas imediatamente e salvas em sua conta.
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Salvar Todas as Configurações
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-icon': {
              alignItems: 'center'
            }
          }}
        >
          <Typography variant="body2">
            <strong>Dica de Segurança:</strong> Mantenha sempre suas informações atualizadas e 
            ative a autenticação de dois fatores para maior segurança da sua conta.
          </Typography>
        </Alert>
      </Stack>
    </Container>
  );
};

export default Settings; 