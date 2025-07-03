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
import {
  Business,
  Star,
  Security,
  Speed,
  SupportAgent,
  VerifiedUser,
  LocalOffer,
  AttachMoney,
} from '@mui/icons-material';
import './CorretoraAfiliado.css';

const CorretoraAfiliado = () => {
  const theme = useTheme();

  const beneficios = [
    {
      icon: <Security />,
      titulo: 'Regulamentação Internacional',
      descricao: 'Corretora regulamentada por autoridades financeiras reconhecidas mundialmente'
    },
    {
      icon: <Speed />,
      titulo: 'Execução Ultra-Rápida',
      descricao: 'Ordens executadas em milissegundos com spreads baixíssimos'
    },

    {
      icon: <SupportAgent />,
      titulo: 'Suporte 24/7',
      descricao: 'Atendimento especializado 24 horas por dia, 7 dias por semana'
    },
    {
      icon: <VerifiedUser />,
      titulo: 'Educação Gratuita',
      descricao: 'Webinars, cursos e materiais educativos para todos os níveis'
    },
    {
      icon: <Star />,
      titulo: 'Demonstração',
      descricao: 'Pratique seus conhecimentos e análises técnicas com R$10.000,00 a hora que quiser'
    }
  ];

  const beneficiosAfiliado = [
    {
      icon: <LocalOffer />,
      titulo: 'Bonificação de boas-vindas',
      descricao: 'Até 100% de bonificação no primeiro depósito para novos investidores'
    },
    {
      icon: <AttachMoney />,
      titulo: 'CashBack',
      descricao: 'Receba parte de seus aportes de volta em cada operação'
    },
    {
      icon: <Security />,
      titulo: 'Sinais Premium',
      descricao: 'Receba sinais de trading exclusivos e análises técnicas avançadas'
    },
    {
      icon: <VerifiedUser />,
      titulo: 'Alavancagem Especial',
      descricao: 'Alavancagem diferenciada para maximizar seus resultados'
    },
    {
      icon: <Business />,
      titulo: 'Consultoria Personalizada',
      descricao: 'Acesso direto aos nossos analistas seniores e estratégias exclusivas'
    }
  ];



  const handleAbrirConta = () => {
    // Substitua pelo seu link de afiliado real
    const linkAfiliado = 'https://corretora.com/register?ref=SEU_CODIGO_AFILIADO';
    window.open(linkAfiliado, '_blank');
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: '50%',
              background: `linear-gradient(135deg, #2196f3 0%, #1976d2 100%)`,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Business sx={{ fontSize: 32 }} />
          </Box>
        </Stack>
        <Typography variant="h4" fontWeight="600" gutterBottom>
          Bolsa de Valores
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Crie seu cadastro na Bolsa de Valores através do botão abaixo e tenha acesso a Benefícios Especiais, Suporte Premium e Spreads reduzidos para aumentar ainda mais seu lucro.
        </Typography>
      </Box>

      {/* Call to Action Principal */}
      <Card 
        sx={{ 
          mb: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha('#2196f3', 0.12)} 0%, ${alpha('#1976d2', 0.08)} 100%)`,
          border: `2px solid ${alpha('#2196f3', 0.25)}`,
          boxShadow: `0 6px 25px ${alpha('#2196f3', 0.12)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 12px 35px ${alpha('#2196f3', 0.18)}`,
            border: `2px solid ${alpha('#2196f3', 0.35)}`,
          },
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" fontWeight="600" gutterBottom>
            🚀 Abra Sua Conta Agora
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Business />}
              onClick={handleAbrirConta}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
                }
              }}
            >
              Abrir Conta Real
            </Button>
          </Box>
        </CardContent>
      </Card>



      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 4 }}>
        {/* Benefícios da Corretora */}
        <Card sx={{
          borderRadius: 4,
          border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        }}>
          <CardContent>

            <Stack spacing={2}>
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
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                      {beneficio.titulo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {beneficio.descricao}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Benefícios Exclusivos */}
        <Card sx={{
          borderRadius: 4,
          border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
              🎁 Benefícios Exclusivos
            </Typography>
            <Stack spacing={2}>
              {beneficiosAfiliado.map((beneficio, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      background: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
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
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                      {beneficio.titulo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {beneficio.descricao}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Informações Importantes */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Regulamentação:</strong> A corretora é regulamentada pela CySEC (Cyprus Securities and Exchange Commission) 
          e está registrada na FCA (Financial Conduct Authority), garantindo a segurança dos seus investimentos.
        </Typography>
      </Alert>


    </Box>
  );
};

export default CorretoraAfiliado; 