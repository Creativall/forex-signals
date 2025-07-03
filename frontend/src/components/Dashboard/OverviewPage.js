import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Container,
  Chip,
  useTheme,
  alpha,
  Avatar,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  TrendingUp,
  Calculate,
  AccountBalance,
  Analytics,
  AutoAwesome,
  Security,
  School,
  ArrowForward,
  PlayArrow,
  Telegram,
  Business,
} from '@mui/icons-material';
import { TITLE_STYLES } from '../../theme';
import ResponsiveCardGrid from '../ui/ResponsiveCardGrid';
import './OverviewPage.css';

const FeatureCard = ({ icon, title, description, action, status, onClick }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: '100%',
        minHeight: 280,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
        borderRadius: 4,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
        backdropFilter: 'blur(20px)',
        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        '&:hover': onClick ? {
          transform: 'translateY(-6px)',
          boxShadow: `0 16px 40px ${alpha(theme.palette.common.black, 0.15)}`,
          border: `2px solid ${alpha(theme.palette.divider, 0.3)}`,
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 }, flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
        <Stack spacing={2.5} sx={{ height: '100%', width: '100%', flex: 1 }}>
          {/* Icon & Status */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                width: { xs: 48, sm: 52 },
                height: { xs: 48, sm: 52 },
              }}
            >
              {icon}
            </Avatar>
            {status && (
              <Chip
                label={status}
                size="small"
                color={status === 'Ativo' ? 'success' : 'default'}
                sx={{ fontSize: '0.75rem' }}
              />
            )}
          </Stack>

          {/* Title & Description */}
          <Stack spacing={1.5} sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                lineHeight: 1.2,
                minHeight: '1.5rem',
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                lineHeight: 1.6,
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                flex: 1,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {description}
            </Typography>
          </Stack>

          {/* Action Button */}
          {action && (
            <Button
              variant={action.variant || 'outlined'}
              size="medium"
              endIcon={action.icon || <ArrowForward />}
              sx={{
                alignSelf: 'flex-start',
                textTransform: 'none',
                borderRadius: 2,
                fontSize: '0.85rem',
                px: 2.5,
                py: 1,
                mt: 'auto',
              }}
            >
              {action.label}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const StatCard = ({ label, value, change, positive = true }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: 140,
        width: '100%',
        flex: 1,
        borderRadius: 4,
        border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
        backdropFilter: 'blur(20px)',
        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 30px ${alpha(theme.palette.common.black, 0.12)}`,
          border: `2px solid ${alpha(theme.palette.divider, 0.3)}`,
        },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent 
        sx={{ 
          p: { xs: 2.5, sm: 3 }, 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          textAlign: { xs: 'center', sm: 'left' },
          width: '100%',
          height: '100%',
        }}
      >
        <Stack spacing={1.5} sx={{ height: '100%', justifyContent: 'center', width: '100%' }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            fontWeight="medium"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              lineHeight: 1,
            }}
          >
            {label}
          </Typography>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color="text.primary"
            sx={{ 
              fontSize: { xs: '1.6rem', sm: '1.8rem', md: '2rem' },
              lineHeight: 1,
              mb: 0.5,
            }}
          >
            {value}
          </Typography>
          {change && (
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1}
              sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}
            >
              <TrendingUp 
                sx={{ 
                  fontSize: { xs: 14, sm: 16 }, 
                  color: positive ? 'success.main' : 'error.main',
                  transform: positive ? 'none' : 'rotate(180deg)'
                }} 
              />
              <Typography 
                variant="caption" 
                color={positive ? 'success.main' : 'error.main'}
                fontWeight="medium"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              >
                {change}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const OverviewPage = ({ onTabChange, user }) => {
  const theme = useTheme();

  const features = [
    // Primeira linha (3 cards)
    {
      icon: <TrendingUp />,
      title: 'Recomendações',
      description: 'Acesse suas recomendações de alta precisão e análise técnica automática.',
      action: { label: 'Ver Recomendações', variant: 'contained' },
      status: 'Ativo',
      onClick: () => onTabChange('signals'),
    },
    {
      icon: <Calculate />,
      title: 'Calculadora de Proteção',
      description: 'Gerencie riscos com nossa calculadora avançada de estratégia de Proteção.',
      action: { label: 'Calcular', icon: <PlayArrow /> },
      onClick: () => onTabChange('martingale'),
    },
    {
      icon: <AccountBalance />,
      title: 'Gestão Financeira',
      description: 'Controle completo das suas transações e análise de performance.',
      action: { label: 'Gerenciar' },
      onClick: () => onTabChange('finance'),
    },
    // Segunda linha (3 cards)
    {
      icon: <Analytics />,
      title: 'Análise Avançada',
      description: 'Relatórios detalhados e insights para otimizar sua estratégia de trading.',
      action: { label: 'Analisar' },
      onClick: () => onTabChange('analysis'),
    },
    {
      icon: <Business />,
      title: 'Corretora Parceira',
      description: 'Abra sua conta com benefícios exclusivos: bônus, spreads reduzidos e suporte VIP.',
      action: { label: 'Abrir Conta', variant: 'contained' },
      onClick: () => onTabChange('corretora'),
    },
    {
      icon: <Telegram />,
      title: 'Grupo Telegram',
      description: 'Entre na nossa comunidade exclusiva para receber recomendações e trocar experiências.',
      action: { label: 'Entrar no Grupo', variant: 'outlined' },
      onClick: () => onTabChange('telegram'),
    },
  ];

  const stats = [
    { label: 'Recomendações Hoje', value: '12', change: '+8%', positive: true },
    { label: 'Taxa de Acerto', value: '87%', change: '+5%', positive: true },
    { label: 'Lucro Mensal', value: 'R$ 2.450', change: '+15%', positive: true },
    { label: 'Operações Ativas', value: '3', change: '-2', positive: false },
  ];

  return (
    <Container maxWidth={false} sx={{ py: { xs: 2, sm: 3 }, width: '100%', px: { xs: 2, sm: 3 } }}>
      <Stack spacing={{ xs: 3.5, sm: 4.5 }} sx={{ width: '100%' }}>
        {/* Header */}
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography 
            {...TITLE_STYLES.pageTitle}
          >
            Bem-vindo, {user?.name || 'Trader'}
          </Typography>
          <Typography 
            {...TITLE_STYLES.pageSubtitle}
            sx={{ 
              ...TITLE_STYLES.pageSubtitle.sx,
              maxWidth: { xs: '100%', sm: 600 },
              lineHeight: 1.5,
            }}
          >
            Seu painel de controle inteligente em tempo real.
          </Typography>
        </Box>

        {/* Quick Stats - Layout Responsivo usando ResponsiveCardGrid */}
        <ResponsiveCardGrid 
          items={stats}
          renderCard={(stat, index) => <StatCard {...stat} />}
          spacing={{ xs: 1, sm: 2, md: 2 }}
          containerProps={{ 
            sx: { 
              mb: 1 
            } 
          }}
        />

        {/* Main Features */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} mb={3.5} sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <AutoAwesome sx={{ color: theme.palette.primary.main }} />
            <Typography 
              {...TITLE_STYLES.sectionTitle}
            >
              Recursos Principais
            </Typography>
          </Stack>
          
          {/* Grid Responsivo: Desktop 3x2, Tablet 2x3, Mobile 1x6 */}
          <div className="features-grid-container">
            {features.map((card, index) => (
              <div 
                key={index}
                className="features-grid-item"
              >
                <FeatureCard {...card} />
              </div>
            ))}
          </div>
        </Box>

        {/* Additional Resources */}
        <Box>
          <Typography 
            {...TITLE_STYLES.sectionTitle}
            mb={3.5}
            sx={{ 
              ...TITLE_STYLES.sectionTitle.sx,
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Recursos de Aprendizado
          </Typography>
          
          <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ alignItems: 'stretch', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'stretch' }}>
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flex: 1, minWidth: 0 }}>
              <FeatureCard
                icon={<School />}
                title="Guias e Tutoriais"
                description="Aprenda estratégias avançadas de trading e como usar nossa plataforma."
                action={{ label: 'Aprender', icon: <ArrowForward /> }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flex: 1, minWidth: 0 }}>
              <FeatureCard
                icon={<Security />}
                title="Gestão de Risco"
                description="Entenda como gerenciar riscos e proteger seu capital de forma inteligente."
                action={{ label: 'Explorar', icon: <ArrowForward /> }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Quick Actions */}
        <Card
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
            border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
            borderRadius: 4,
            boxShadow: `0 6px 25px ${alpha(theme.palette.common.black, 0.08)}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 12px 35px ${alpha(theme.palette.common.black, 0.12)}`,
              border: `2px solid ${alpha(theme.palette.divider, 0.3)}`,
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={3} 
              alignItems="center"
              sx={{ textAlign: { xs: 'center', md: 'left' } }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography 
                  {...TITLE_STYLES.cardTitle}
                  mb={1}
                >
                  Pronto para começar?
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                >
                  Explore todos os recursos da plataforma e maximize seus resultados no trading.
                </Typography>
              </Box>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => onTabChange('signals')}
                  sx={{ 
                    textTransform: 'none', 
                    borderRadius: 2,
                    minWidth: { xs: '100%', sm: 140 },
                  }}
                >
                  Ver Recomendações
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => onTabChange('martingale')}
                  sx={{ 
                    textTransform: 'none', 
                    borderRadius: 2,
                    minWidth: { xs: '100%', sm: 140 },
                  }}
                >
                  Calcular Riscos
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default OverviewPage; 