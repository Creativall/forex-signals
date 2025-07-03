import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Stack,
  Chip,
  IconButton,
  Divider,
  useTheme,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  LinearProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  School,
  PlayCircleOutline,
  WatchLater,
  TrendingUp,
  Group,
  Star,
  Bookmark,
  NotificationsActive,
  CheckCircle,
  AccessTime,
  Person,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import PageHeader from './ui/PageHeader';

const InstitucionalAulas = () => {
  const theme = useTheme();
  const [notifyEnabled, setNotifyEnabled] = useState(false);

  const upcomingCourses = [
    {
      id: 1,
      title: 'Fundamentos do Forex',
      description: 'Aprenda os conceitos básicos do mercado de câmbio e como começar a operar.',
      duration: '4 horas',
      modules: 8,
      level: 'Iniciante',
      instructor: 'Prof. Ricardo Silva',
      status: 'coming_soon',
      progress: 0,
      estimatedLaunch: 'Dezembro 2024',
      topics: [
        'Introdução ao Forex',
        'Pares de moedas principais',
        'Análise técnica básica',
        'Gerenciamento de risco'
      ]
    },
    {
      id: 2,
      title: 'Estratégias Avançadas de Trading',
      description: 'Técnicas avançadas para maximizar lucros e minimizar riscos no trading.',
      duration: '6 horas',
      modules: 12,
      level: 'Avançado',
      instructor: 'Prof. Ana Costa',
      status: 'development',
      progress: 35,
      estimatedLaunch: 'Janeiro 2025',
      topics: [
        'Análise fundamentalista',
        'Estratégias de scalping',
        'Automatização de trades',
        'Psicologia do trading'
      ]
    },
    {
      id: 3,
      title: 'Gestão de Risco e Capital',
      description: 'Como proteger seu capital e gerenciar riscos de forma eficiente.',
      duration: '3 horas',
      modules: 6,
      level: 'Intermediário',
      instructor: 'Prof. Carlos Mendoza',
      status: 'planning',
      progress: 15,
      estimatedLaunch: 'Fevereiro 2025',
      topics: [
        'Calculadora de risco',
        'Diversificação de portfólio',
        'Stop loss e take profit',
        'Martingale e anti-martingale'
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'coming_soon':
        return theme.palette.primary.main;
      case 'development':
        return theme.palette.warning.main;
      case 'planning':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'coming_soon':
        return 'Em Breve';
      case 'development':
        return 'Em Desenvolvimento';
      case 'planning':
        return 'Em Planejamento';
      default:
        return 'Indefinido';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Iniciante':
        return theme.palette.success.main;
      case 'Intermediário':
        return theme.palette.warning.main;
      case 'Avançado':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const handleNotifyToggle = () => {
    setNotifyEnabled(!notifyEnabled);
    // Aqui você pode adicionar lógica para salvar a preferência de notificação
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PageHeader
        title="Institucional - Aulas"
        subtitle="Conteúdo educativo profissional para sua evolução no trading"
        icon={<School sx={{ fontSize: 40, color: theme.palette.primary.main }} />}
      />

      {/* Banner de Novidades */}
      <Card
        sx={{
          mb: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                🎓 Novos Cursos em Desenvolvimento!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                Estamos preparando conteúdo educativo de alta qualidade para levar suas habilidades de trading ao próximo nível. 
                Seja notificado quando os cursos estiverem disponíveis!
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant={notifyEnabled ? "outlined" : "contained"}
                  startIcon={<NotificationsActive />}
                  onClick={handleNotifyToggle}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                  }}
                >
                  {notifyEnabled ? 'Notificações Ativadas' : 'Ativar Notificações'}
                </Button>
                {notifyEnabled && (
                  <Chip
                    icon={<CheckCircle />}
                    label="Você será notificado"
                    color="success"
                    size="small"
                  />
                )}
              </Stack>
            </Box>
            <Box
              sx={{
                minWidth: 200,
                display: 'flex',
                justifyContent: 'center',
                opacity: 0.8,
              }}
            >
              <School sx={{ fontSize: 120, color: theme.palette.primary.main }} />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Lista de Cursos Próximos */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          📚 Cursos em Desenvolvimento
        </Typography>
        <Grid container spacing={3}>
          {upcomingCourses.map((course) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={course.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: theme.palette.background.paper,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  },
                }}
              >
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Stack spacing={2}>
                    {/* Header do Curso */}
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Chip
                          label={getStatusText(course.status)}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getStatusColor(course.status), 0.1),
                            color: getStatusColor(course.status),
                            fontWeight: 600,
                          }}
                        />
                        <Chip
                          label={course.level}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getLevelColor(course.level), 0.1),
                            color: getLevelColor(course.level),
                            fontWeight: 600,
                          }}
                        />
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {course.description}
                      </Typography>
                    </Box>

                    {/* Progresso */}
                    {course.status === 'development' && (
                      <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Progresso do desenvolvimento
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {course.progress}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: alpha(theme.palette.grey[500], 0.2),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              backgroundColor: getStatusColor(course.status),
                            },
                          }}
                        />
                      </Box>
                    )}

                    {/* Informações do Curso */}
                    <Stack direction="row" spacing={2} sx={{ py: 1 }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTime sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="caption" color="text.secondary">
                          {course.duration}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <PlayCircleOutline sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                        <Typography variant="caption" color="text.secondary">
                          {course.modules} módulos
                        </Typography>
                      </Stack>
                    </Stack>

                    <Divider />

                    {/* Instrutor */}
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                        <Person sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Instrutor
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {course.instructor}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Tópicos */}
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Principais tópicos:
                      </Typography>
                      <List dense sx={{ py: 0 }}>
                        {course.topics.slice(0, 2).map((topic, index) => (
                          <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 20 }}>
                              <Star sx={{ fontSize: 12, color: theme.palette.primary.main }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={topic}
                              primaryTypographyProps={{
                                variant: 'caption',
                                color: 'text.secondary',
                              }}
                            />
                          </ListItem>
                        ))}
                        {course.topics.length > 2 && (
                          <Typography variant="caption" color="text.secondary" sx={{ pl: 2.5 }}>
                            +{course.topics.length - 2} tópicos
                          </Typography>
                        )}
                      </List>
                    </Box>

                    {/* Data de Lançamento */}
                    <Box
                      sx={{
                        mt: 'auto',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <WatchLater sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Previsão: {course.estimatedLaunch}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Estatísticas */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            📊 Estatísticas do Programa Educativo
          </Typography>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Stack spacing={1} alignItems="center">
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  3
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Cursos em Desenvolvimento
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Stack spacing={1} alignItems="center">
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  21
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Módulos Planejados
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Stack spacing={1} alignItems="center">
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                  13h
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Conteúdo Total
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Stack spacing={1} alignItems="center">
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                  3
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Instrutores Especialistas
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            💡 Sobre o Programa Institucional
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Nosso programa educativo foi desenvolvido para capacitar traders de todos os níveis com conhecimento prático e estratégico. 
            Cada curso é cuidadosamente estruturado por especialistas com anos de experiência no mercado financeiro.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Em breve:</strong> Sistema de certificação, aulas ao vivo, mentoria personalizada e muito mais!
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default InstitucionalAulas; 