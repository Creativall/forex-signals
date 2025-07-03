import React from 'react';
import { Box, CircularProgress, Typography, Stack, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

const LoadingState = ({ 
  message = 'Carregando...', 
  size = 40, 
  fullScreen = false,
  overlay = false,
  variant = 'circular' // 'circular', 'dots', 'pulse'
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const DotsLoader = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            animation: 'dotPulse 1.4s ease-in-out infinite both',
            animationDelay: `${i * 0.16}s`,
            '@keyframes dotPulse': {
              '0%, 80%, 100%': {
                transform: 'scale(0)',
                opacity: 0.5,
              },
              '40%': {
                transform: 'scale(1)',
                opacity: 1,
              },
            },
          }}
        />
      ))}
    </Box>
  );

  const PulseLoader = () => (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        '@keyframes pulse': {
          '0%, 100%': {
            opacity: 1,
            transform: 'scale(1)',
          },
          '50%': {
            opacity: 0.7,
            transform: 'scale(1.1)',
          },
        },
      }}
    />
  );

  const LoaderComponent = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader />;
      case 'pulse':
        return <PulseLoader />;
      default:
        return (
          <CircularProgress
            size={size}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
        );
    }
  };

  const LoadingContent = () => (
    <Stack spacing={3} alignItems="center">
      <LoaderComponent />
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        {message}
      </Typography>
    </Stack>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDark 
            ? alpha(theme.palette.background.default, 0.9)
            : alpha(theme.palette.background.default, 0.95),
          backdropFilter: 'blur(10px)',
          zIndex: theme.zIndex.modal + 1,
        }}
      >
        <LoadingContent />
      </Box>
    );
  }

  if (overlay) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(5px)',
          borderRadius: 'inherit',
          zIndex: 1,
        }}
      >
        <LoadingContent />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}
    >
      <LoadingContent />
    </Box>
  );
};

export default LoadingState; 