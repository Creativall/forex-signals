import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import './GrupoTelegram.css';
import {
  Telegram,
  Group,
  Notifications,
  Schedule,
  TrendingUp,
  Support,
  Security,
  Android,
  Apple,
  GetApp,
} from '@mui/icons-material';

const GrupoTelegram = () => {
  const theme = useTheme();

  const beneficios = [
    {
      icon: <TrendingUp />,
      titulo: 'Indicações Exclusivas',
      descricao: 'Receba recomendações feita por nossos Analistas Especialistas ao vivo'
    },
    {
      icon: <Notifications />,
      titulo: 'Alertas Instantâneos',
      descricao: 'Fique sabendo das melhores oportunidades antes de todo o mundo'
    },
    {
      icon: <Group />,
      titulo: 'Comunidade Ativa',
      descricao: 'Converse com outros alunos e troquem experiências'
    },
    {
      icon: <Support />,
      titulo: 'Suporte Direto',
      descricao: 'Tire suas dúvidas com nossa equipe de suporte'
    },
    {
      icon: <Security />,
      titulo: 'Comunidade Privada',
      descricao: 'Acesso exclusivo para alunos verificados'
    }
  ];





  const handleJoinTelegram = () => {
    // Substitua pelo link real do seu grupo do Telegram
    const telegramGroupLink = 'https://t.me/+SEU_LINK_DO_GRUPO_AQUI';
    window.open(telegramGroupLink, '_blank');
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: '100%', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: '50%',
              background: `linear-gradient(135deg, #0088cc 0%, #0066aa 100%)`,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Telegram sx={{ fontSize: 32 }} />
          </Box>
        </Stack>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          Comunidade Exclusiva
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Junte-se à nossa comunidade Exclusiva no Telegram para receber recomendações e suporte especializado de nossa Equipe Interna de Analistas e Especialistas.
        </Typography>
      </Box>

      {/* Call to Action */}
      <Card 
        sx={{ 
          mb: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha('#0088cc', 0.12)} 0%, ${alpha('#0066aa', 0.08)} 100%)`,
          border: `2px solid ${alpha('#0088cc', 0.25)}`,
          boxShadow: `0 6px 25px ${alpha('#0088cc', 0.12)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 12px 35px ${alpha('#0088cc', 0.18)}`,
            border: `2px solid ${alpha('#0088cc', 0.35)}`,
          },
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" fontWeight="600" gutterBottom>
            Clique no botão abaixo para entrar em nossa Comunidade ⬇
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Telegram />}
            onClick={handleJoinTelegram}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #0088cc 30%, #0066aa 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0066aa 30%, #004488 90%)',
              }
            }}
          >
            Entrar no Grupo
          </Button>
        </CardContent>
      </Card>

      {/* Benefícios */}
      <Card sx={{ 
        mb: 4,
        borderRadius: 4,
        border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            🎯 O que a Comunidade oferece?
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {beneficios.map((beneficio, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    background: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    minWidth: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {beneficio.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    {beneficio.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {beneficio.descricao}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Horários de Funcionamento */}
      <Box sx={{ mb: 4 }}>
        <Card sx={{
          borderRadius: { xs: 2, md: 4 },
          border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
          boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.12)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.18)}`,
          },
        }}>
          <CardContent sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Schedule />
                </Box>
                Horário de atendimento
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Nossa equipe está sempre disponível para ajudar você
              </Typography>
            </Box>
            
                         <Box sx={{ 
               display: 'flex', 
               justifyContent: 'center',
               maxWidth: { xs: '100%', md: 800 },
               mx: 'auto'
             }}>
               <Box sx={{
                 background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                 borderRadius: { xs: 2, md: 3 },
                 p: { xs: 2.5, md: 3 },
                 textAlign: 'center',
                 width: { xs: '100%', md: 'auto' },
                 minWidth: { xs: 'auto', md: 300 },
                 border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
               }}>
                 <Typography variant="h6" fontWeight="600" color="primary" gutterBottom>
                   Segunda à Domingo
                 </Typography>
                 <Typography variant={{ xs: 'h5', md: 'h4' }} fontWeight="700" color="primary" sx={{ mb: 1 }}>
                   08:00 - 22:00
                 </Typography>
                 <Typography variant="body2" color="text.secondary">
                   14 horas de atendimento diário
                 </Typography>
               </Box>
             </Box>
            
            <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}` }}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                💬 Respostas rápidas durante o horário de funcionamento
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Download do Telegram */}
      <Card sx={{ 
        mb: 4,
        borderRadius: 4,
        background: `linear-gradient(135deg, ${alpha('#00BFA5', 0.08)} 0%, ${alpha('#26C6DA', 0.05)} 100%)`,
        border: `2px solid ${alpha('#00BFA5', 0.2)}`,
        boxShadow: `0 4px 20px ${alpha('#00BFA5', 0.08)}`,
      }}>
        <CardContent sx={{ textAlign: 'center', py: 4, px: { xs: 2, md: 4 } }}>
                     <Typography variant="h5" fontWeight="600" gutterBottom sx={{ color: '#00695C', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
             <GetApp sx={{ fontSize: 28 }} />
             Você não tem telegram?
           </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Baixe o aplicativo abaixo
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center'
          }}>
                         <Button
               variant="contained"
               size="large"
               startIcon={<Android />}
               onClick={() => window.open('https://play.google.com/store/apps/details?id=org.telegram.messenger', '_blank')}
               sx={{
                 background: 'linear-gradient(45deg, #34A853 30%, #137333 90%)',
                 color: 'white',
                 px: 3,
                 py: 1.5,
                 fontSize: '1rem',
                 fontWeight: 600,
                 borderRadius: 2,
                 textTransform: 'none',
                 minWidth: { xs: '100%', sm: 200 },
                 '&:hover': {
                   background: 'linear-gradient(45deg, #137333 30%, #0F5132 90%)',
                   transform: 'translateY(-1px)',
                   boxShadow: '0 6px 20px rgba(52, 168, 83, 0.3)',
                 }
               }}
             >
               Baixe no Google Play
             </Button>
            
                         <Button
               variant="contained"
               size="large"
               startIcon={<Apple />}
               onClick={() => window.open('https://apps.apple.com/br/app/telegram/id686449807', '_blank')}
               sx={{
                 background: 'linear-gradient(45deg, #007AFF 30%, #0051D5 90%)',
                 color: 'white',
                 px: 3,
                 py: 1.5,
                 fontSize: '1rem',
                 fontWeight: 600,
                 borderRadius: 2,
                 textTransform: 'none',
                 minWidth: { xs: '100%', sm: 200 },
                 '&:hover': {
                   background: 'linear-gradient(45deg, #0051D5 30%, #003A9B 90%)',
                   transform: 'translateY(-1px)',
                   boxShadow: '0 6px 20px rgba(0, 122, 255, 0.3)',
                 }
               }}
             >
               Baixe no App Store
             </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Aviso Final */}
      <Alert severity="warning" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Importante:</strong> Esta é uma comunidade exclusiva para membros da plataforma, 
          mantenha suas credenciais de acesso seguras e nunca compartilhe informações pessoais ou financeiras na comunidade.
        </Typography>
      </Alert>
    </Box>
  );
};

export default GrupoTelegram; 