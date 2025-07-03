import React from 'react';
import { Box, Typography, Button, Stack, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action = null,
  illustration = null,
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  const theme = useTheme();

  const getSizeProps = () => {
    switch (size) {
      case 'small':
        return {
          iconSize: 48,
          spacing: 2,
          titleVariant: 'h6',
          bodyVariant: 'body2',
          py: 4,
        };
      case 'large':
        return {
          iconSize: 80,
          spacing: 4,
          titleVariant: 'h4',
          bodyVariant: 'body1',
          py: 8,
        };
      default:
        return {
          iconSize: 64,
          spacing: 3,
          titleVariant: 'h5',
          bodyVariant: 'body1',
          py: 6,
        };
    }
  };

  const sizeProps = getSizeProps();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: sizeProps.py,
        px: 3,
      }}
    >
      <Stack spacing={sizeProps.spacing} alignItems="center" maxWidth="400px">
        {illustration ? (
          <Box
            sx={{
              width: sizeProps.iconSize,
              height: sizeProps.iconSize,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.primary.main,
              mb: 1
            }}
          >
            {illustration}
          </Box>
        ) : icon ? (
          <Box
            sx={{
              color: theme.palette.text.secondary,
              fontSize: sizeProps.iconSize,
              mb: 1,
              opacity: 0.6
            }}
          >
            {icon}
          </Box>
        ) : null}

        <Box>
          <Typography
            variant={sizeProps.titleVariant}
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            {title}
          </Typography>
          
          {description && (
            <Typography
              variant={sizeProps.bodyVariant}
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.6,
              }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {action && (
          <Button
            variant={action.variant || 'contained'}
            color={action.color || 'primary'}
            startIcon={action.icon}
            onClick={action.onClick}
            disabled={action.disabled}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              px: 3,
              py: 1.2,
            }}
          >
            {action.label}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default EmptyState; 