import React, { useState } from 'react';
import {
  Typography,
  Chip,
  Card,
  CardContent,
  Stack,
  useTheme,
  alpha,
  Tooltip,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
  Refresh,
  Edit,
  Save,
  Cancel,
  CheckCircle,
} from '@mui/icons-material';
import { useFinance } from '../../contexts/FinanceContext';

const BalanceDisplay = ({ 
  variant = 'card', // 'card', 'chip', 'inline'
  showDetails = false,
  showRefresh = false,
  showEditButton = false, // Nova prop para mostrar botão de edição
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  const theme = useTheme();
  const { balance, formatCurrency, getStats, updateBalance } = useFinance();
  const stats = getStats();

  // Estados para edição do saldo
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editError, setEditError] = useState('');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Funções para edição
  const handleEditClick = () => {
    // Formatar valor inicial no padrão brasileiro (ponto por vírgula)
    setEditValue(balance.toString().replace('.', ','));
    setEditError('');
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!editValue || editValue.trim() === '') {
      setEditError('Digite um valor válido');
      return;
    }

    // Normalizar valor para formato americano (trocar vírgula por ponto)
    const normalizedValue = editValue.replace(',', '.');
    const numericValue = parseFloat(normalizedValue);
    
    if (isNaN(numericValue) || numericValue < 0) {
      setEditError('Valor deve ser um número positivo');
      return;
    }

    if (updateBalance(numericValue)) {
      setIsEditDialogOpen(false);
      setEditError('');
      setShowSuccessNotification(true);
    } else {
      setEditError('Erro ao atualizar saldo');
    }
  };

  const handleEditCancel = () => {
    setIsEditDialogOpen(false);
    setEditError('');
    setEditValue('');
  };

  const formatValue = (value) => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return formatCurrency(value);
  };

  const getBalanceColor = () => {
    if (balance > 5000) return theme.palette.success.main;
    if (balance < 1000) return theme.palette.error.main;
    return theme.palette.warning.main;
  };

  const getTrendIcon = () => {
    const netProfit = stats.netProfit || 0;
    if (netProfit > 0) return <TrendingUp sx={{ fontSize: '1rem' }} />;
    if (netProfit < 0) return <TrendingDown sx={{ fontSize: '1rem' }} />;
    return null;
  };

  if (variant === 'chip') {
    return (
      <Tooltip title={`Saldo atual: ${formatCurrency(balance)}`}>
        <Chip
          icon={<AccountBalanceWallet />}
          label={formatValue(balance)}
          sx={{
            bgcolor: alpha(getBalanceColor(), 0.1),
            color: getBalanceColor(),
            fontWeight: 600,
            fontSize: size === 'small' ? '0.75rem' : '0.875rem',
            height: size === 'small' ? 24 : size === 'large' ? 36 : 32,
            '& .MuiChip-icon': {
              color: getBalanceColor(),
            },
          }}
        />
      </Tooltip>
    );
  }

  if (variant === 'inline') {
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <AccountBalanceWallet 
          sx={{ 
            color: getBalanceColor(),
            fontSize: size === 'small' ? '1rem' : size === 'large' ? '1.5rem' : '1.25rem'
          }} 
        />
        <Typography
          variant={size === 'small' ? 'body2' : size === 'large' ? 'h6' : 'body1'}
          sx={{
            color: getBalanceColor(),
            fontWeight: 600,
          }}
        >
          {formatValue(balance)}
        </Typography>
        {showDetails && getTrendIcon()}
      </Stack>
    );
  }

  // variant === 'card'
  const cardContent = (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(getBalanceColor(), 0.2)}`,
        background: `linear-gradient(135deg, 
          ${alpha(getBalanceColor(), 0.05)} 0%, 
          ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${alpha(getBalanceColor(), 0.15)}`,
        },
      }}
    >
      <CardContent sx={{ p: size === 'small' ? 2 : 3 }}>
        <Stack spacing={size === 'small' ? 1 : 2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccountBalanceWallet 
                sx={{ 
                  color: getBalanceColor(),
                  fontSize: size === 'small' ? '1.25rem' : size === 'large' ? '2rem' : '1.5rem'
                }} 
              />
              <Typography
                variant={size === 'small' ? 'subtitle2' : 'h6'}
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Saldo Atual
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={0.5}>
              {showEditButton && (
                <Tooltip title="Editar saldo">
                  <IconButton 
                    size="small" 
                    onClick={handleEditClick}
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': {
                        color: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              
              {showRefresh && (
                <Tooltip title="Atualizar dados financeiros">
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
                    <Refresh fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>

          <Typography
            variant={size === 'small' ? 'h6' : size === 'large' ? 'h3' : 'h4'}
            sx={{
              color: getBalanceColor(),
              fontWeight: 700,
              fontFamily: 'monospace',
            }}
          >
            {formatCurrency(balance)}
          </Typography>

          {showDetails && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {getTrendIcon()}
                <Typography
                  variant="caption"
                  sx={{
                    color: (stats.netProfit || 0) >= 0 ? theme.palette.success.main : theme.palette.error.main,
                    fontWeight: 600,
                  }}
                >
                  {(stats.netProfit || 0) >= 0 ? '+' : ''}{formatCurrency(stats.netProfit || 0)}
                </Typography>
              </Stack>
              
              <Typography variant="caption" color="text.secondary">
                {stats.totalTransactions || 0} operações
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <>
      {cardContent}
      
      {/* Dialog de edição do saldo */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={handleEditCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Edit color="primary" />
            <Typography 
              variant="h6"
              sx={{ 
                fontSize: { sm: '1rem', lg: '1.25rem' },
                color: 'text.primary'
              }}
            >
              Editar Saldo Atual
            </Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="info" variant="outlined">
              Esta ação irá alterar diretamente o seu saldo atual. Use com cuidado.
            </Alert>
            
            <TextField
              label="Novo Saldo"
              fullWidth
              value={editValue}
              onChange={(e) => {
                // Permitir apenas números, vírgulas e pontos
                const value = e.target.value.replace(/[^0-9.,]/g, '');
                setEditValue(value);
                setEditError(''); // Limpar erro ao começar a digitar
              }}
              error={!!editError}
              helperText={editError || "Digite o novo valor do saldo (ex: 1500,50)"}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>R$</Typography>,
              }}
              placeholder="0,00"
              autoFocus
            />
            
            <Typography variant="body2" color="text.secondary">
              Saldo atual: {formatCurrency(balance)}
            </Typography>
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={handleEditCancel}
            startIcon={<Cancel />}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleEditSave}
            variant="contained"
            startIcon={<Save />}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificação de sucesso */}
      <Snackbar
        open={showSuccessNotification}
        autoHideDuration={4000}
        onClose={() => setShowSuccessNotification(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowSuccessNotification(false)}
          severity="success"
          variant="filled"
          icon={<CheckCircle />}
          sx={{
            minWidth: 300,
            fontWeight: 600,
          }}
        >
          Saldo atualizado com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
};

export default BalanceDisplay; 