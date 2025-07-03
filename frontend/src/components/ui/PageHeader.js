import React from 'react';
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link, 
  Chip, 
  Button,
  Stack,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const PageHeader = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  status = null, 
  actions = [], 
  gradient = false,
  backgroundImage = null 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        position: 'relative',
        mb: 4,
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        overflow: 'hidden',
        background: gradient
          ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
          : isDark 
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        color: gradient ? 'white' : theme.palette.text.primary,
        ...(backgroundImage && {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: gradient
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`
              : alpha(theme.palette.background.paper, 0.9),
            zIndex: 1,
          },
        }),
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{
              mb: 2,
              '& .MuiBreadcrumbs-separator': {
                color: gradient ? alpha('white', 0.7) : theme.palette.text.secondary,
              },
            }}
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return isLast ? (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    color: gradient ? alpha('white', 0.9) : theme.palette.text.primary,
                    fontWeight: 600,
                  }}
                >
                  {crumb.label}
                </Typography>
              ) : (
                <Link
                  key={index}
                  href={crumb.href}
                  underline="hover"
                  sx={{
                    color: gradient ? alpha('white', 0.7) : theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {crumb.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        )}

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
        >
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={1}>
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                sx={{
                  fontWeight: 700,
                  color: gradient ? 'white' : theme.palette.text.primary,
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </Typography>
              
              {status && (
                <Chip
                  label={status.label}
                  size="small"
                  sx={{
                    background: status.color || theme.palette.primary.main,
                    color: 'white',
                    fontWeight: 600,
                    border: gradient ? '1px solid rgba(255,255,255,0.2)' : 'none',
                  }}
                />
              )}
            </Stack>
            
            {subtitle && (
              <Typography
                variant="body1"
                sx={{
                  color: gradient ? alpha('white', 0.9) : theme.palette.text.secondary,
                  maxWidth: { md: '600px' },
                  lineHeight: 1.6,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {actions.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'contained'}
                  color={action.color || 'primary'}
                  startIcon={action.icon}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    ...(gradient && action.variant === 'contained' && {
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.3)',
                      },
                    }),
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </Stack>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default PageHeader; 