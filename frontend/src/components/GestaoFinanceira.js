import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Tooltip,
  InputAdornment,
  AppBar,
  Toolbar,
  Fab,
  Collapse,
  SwipeableDrawer,
  alpha,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Add,
  Edit,
  Delete,
  MonetizationOn,
  Assessment,
  Savings,
  CreditCard,
  Receipt,
  Search,
  Category,
  SwapHoriz,
  AccountBalanceWallet,
  Euro,
  AttachMoney,
  Timeline,
  Close,
  ViewList,
  ViewModule,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useFinance } from '../contexts/FinanceContext';
import { TITLE_STYLES } from '../theme';
import BalanceDisplay from './ui/BalanceDisplay';

const GestaoFinanceira = () => {
  const theme = useTheme();
  
  // Responsividade otimizada seguindo padrão das indicações
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  // Usar contexto financeiro global
  const { 
    balance, 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    getStats, 
    formatCurrency
  } = useFinance();

  // Estados principais
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Estados de interface responsiva
  const [viewMode, setViewMode] = useState('cards');
  const [expandedCard, setExpandedCard] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'income',
    category: 'trading',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Dados seguros para transações
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  // Categorias completas
  const categories = {
    trading: { label: 'Trading', icon: <TrendingUp />, color: 'primary' },
    investment: { label: 'Investimento', icon: <AccountBalance />, color: 'success' },
    profit: { label: 'Lucro', icon: <MonetizationOn />, color: 'info' },
    loss: { label: 'Perda', icon: <TrendingDown />, color: 'error' },
    deposit: { label: 'Depósito', icon: <Savings />, color: 'secondary' },
    withdrawal: { label: 'Saque', icon: <CreditCard />, color: 'warning' },
    fees: { label: 'Taxas', icon: <Receipt />, color: 'error' },
    transfer: { label: 'Transferência', icon: <SwapHoriz />, color: 'info' },
    bonus: { label: 'Bônus', icon: <Euro />, color: 'success' },
    refund: { label: 'Reembolso', icon: <AttachMoney />, color: 'secondary' },
    other: { label: 'Outros', icon: <Category />, color: 'default' }
  };

  // Cálculos estatísticos usando função do contexto
  const stats = getStats();

  // Estatísticas adicionais
  const additionalStats = {
    averageWin: safeTransactions
      .filter(t => t.amount > 0 && t.category === 'trading')
      .reduce((acc, t, _, arr) => acc + t.amount / arr.length, 0) || 0,
    averageLoss: safeTransactions
      .filter(t => t.amount < 0 && t.category === 'trading')
      .reduce((acc, t, _, arr) => acc + Math.abs(t.amount) / arr.length, 0) || 0,
    winRate: (() => {
      const tradingTransactions = safeTransactions.filter(t => t.category === 'trading');
      const wins = tradingTransactions.filter(t => t.amount > 0).length;
      return tradingTransactions.length > 0 ? (wins / tradingTransactions.length) * 100 : 0;
    })(),
    totalTrades: safeTransactions.filter(t => t.category === 'trading').length
  };

  // Filtrar e ordenar transações
  const filteredAndSortedTransactions = safeTransactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = Math.abs(a.amount);
          bValue = Math.abs(b.amount);
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default: // date
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Handlers
  const openDialog = (transaction = null) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        description: transaction.description,
        amount: Math.abs(transaction.amount).toString(),
        type: transaction.type,
        category: transaction.category,
        date: transaction.date.split('T')[0] || new Date().toISOString().split('T')[0],
        notes: transaction.notes || ''
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        description: '',
        amount: '',
        type: 'income',
        category: 'trading',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.description || !formData.amount) return;

    const transactionData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
      notes: formData.notes
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(id);
    }
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  // Componente StatCard responsivo seguindo padrão das indicações
  const StatCard = ({ title, value, subtitle, icon, color = 'primary' }) => (
    <Card
      sx={{
        height: { xs: 110, sm: 120, md: 140 },
        borderRadius: { xs: 2, sm: 3 },
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        backdropFilter: 'blur(20px)',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent 
        sx={{ 
          p: { xs: 1.5, sm: 2, md: 2.5 }, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between'
        }}
      >
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                fontWeight: 500,
                mb: { xs: 0.5, sm: 1 },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h6" 
              color="text.primary"
              sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                fontWeight: 'bold',
                lineHeight: 1.1,
                mb: { xs: 0, sm: 0.5 }
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.65rem', sm: '0.7rem' },
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette[color].main, 0.1),
              color: theme.palette[color].main,
              width: { xs: 32, sm: 36, md: 40 },
              height: { xs: 32, sm: 36, md: 40 },
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );

  // Componente TransactionCard otimizado para mobile
  const TransactionCard = ({ transaction }) => {
    const isExpanded = expandedCard === transaction.id;
    
    return (
      <Card 
        sx={{ 
          mb: 1,
          border: `1px solid ${alpha(theme.palette[getTransactionColor(transaction.type)].main, 0.2)}`,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={isMobile ? 1 : 2} sx={{ flexGrow: 1, minWidth: 0 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: alpha(theme.palette[getTransactionColor(transaction.type)].main, 0.1),
                    color: theme.palette[getTransactionColor(transaction.type)].main,
                    width: isMobile ? 32 : 40,
                    height: isMobile ? 32 : 40,
                    flexShrink: 0
                  }}
                >
                  {React.cloneElement(getTransactionIcon(transaction.type, transaction.category), {
                    sx: { fontSize: isMobile ? 16 : 20 }
                  })}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: isMobile ? '0.8rem' : '0.875rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {transaction.description}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} flexWrap="wrap">
                    <Chip 
                      label={categories[transaction.category]?.label || transaction.category}
                      size="small"
                      color={categories[transaction.category]?.color || 'default'}
                      variant="outlined"
                      sx={{ 
                        fontSize: isMobile ? '0.6rem' : '0.75rem',
                        height: isMobile ? 20 : 24
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.6rem' : '0.75rem' }}
                    >
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
              <Stack alignItems="flex-end" spacing={0.5}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: theme.palette[getTransactionColor(transaction.type)].main,
                    fontWeight: 700,
                    fontSize: isMobile ? '0.8rem' : '1rem'
                  }}
                >
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </Typography>
                <IconButton 
                  size="small"
                  onClick={() => setExpandedCard(isExpanded ? null : transaction.id)}
                  sx={{ p: 0.5 }}
                >
                  {isExpanded ? 
                    <ExpandLess sx={{ fontSize: isMobile ? 16 : 20 }} /> : 
                    <ExpandMore sx={{ fontSize: isMobile ? 16 : 20 }} />
                  }
                </IconButton>
              </Stack>
            </Stack>
            
            <Collapse in={isExpanded}>
              <Box sx={{ pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                {transaction.notes && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 1,
                      fontSize: isMobile ? '0.7rem' : '0.875rem'
                    }}
                  >
                    <strong>Observações:</strong> {transaction.notes}
                  </Typography>
                )}
                
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <IconButton 
                    size="small" 
                    onClick={() => openDialog(transaction)}
                    sx={{ 
                      color: 'primary.main',
                      p: isMobile ? 0.5 : 1
                    }}
                  >
                    <Edit sx={{ fontSize: isMobile ? 16 : 18 }} />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDelete(transaction.id)}
                    sx={{ 
                      color: 'error.main',
                      p: isMobile ? 0.5 : 1
                    }}
                  >
                    <Delete sx={{ fontSize: isMobile ? 16 : 18 }} />
                  </IconButton>
                </Stack>
              </Box>
            </Collapse>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  // Componente FiltersDrawer para mobile
  const FiltersDrawer = () => (
    <SwipeableDrawer
      anchor="bottom"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      onOpen={() => setDrawerOpen(true)}
      disableSwipeToOpen={false}
      PaperProps={{
        sx: { 
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '80vh'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontSize: '1rem' }}>Filtros e Ordenação</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small">
            <Close />
          </IconButton>
        </Stack>
        
        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Tipo"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="income">Entrada</MenuItem>
              <MenuItem value="expense">Saída</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Categoria</InputLabel>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              label="Categoria"
            >
              <MenuItem value="all">Todas</MenuItem>
              {Object.entries(categories).map(([key, cat]) => (
                <MenuItem key={key} value={key}>{cat.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Ordenar por"
            >
              <MenuItem value="date">Data</MenuItem>
              <MenuItem value="amount">Valor</MenuItem>
              <MenuItem value="description">Descrição</MenuItem>
              <MenuItem value="category">Categoria</MenuItem>
            </Select>
          </FormControl>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setFilterCategory('all');
              setSortBy('date');
              setSortOrder('desc');
            }}
          >
            Limpar Filtros
          </Button>
        </Stack>
      </Box>
    </SwipeableDrawer>
  );

  const getTransactionIcon = (type, category) => {
    return categories[category]?.icon || <Category />;
  };

  const getTransactionColor = (type) => {
    return type === 'income' ? 'success' : 'error';
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  // Grid responsivo otimizado
  const getStatGridProps = () => {
    if (isMobile) {
      return { xs: 6, sm: 6 }; // 2 colunas no mobile
    }
    return { xs: 12, sm: 6, md: 3 }; // Padrão para desktop
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      <Container 
        maxWidth="xl"
        sx={{ 
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3 },
          pb: { xs: 10, sm: 3 } // Espaço extra para FAB no mobile
        }}
      >
        {/* Header responsivo */}
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          justifyContent="space-between" 
          alignItems={{ xs: "flex-start", sm: "center" }} 
          spacing={{ xs: 2, sm: 1 }}
          mb={{ xs: 3, sm: 4 }}
        >
          <Box>
            <Typography 
              variant="h4"
              sx={{
                ...TITLE_STYLES.pageTitle,
                mb: 1, 
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 1.5 }
              }}
            >
              <AccountBalanceWallet sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' } }} />
              Gestão Financeira
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1rem' },
                lineHeight: 1.5
              }}
            >
              Controle suas finanças e acompanhe resultados de trading
            </Typography>
          </Box>
          {/* Chip do saldo apenas em desktop para economizar espaço */}
          {!isMobile && (
            <BalanceDisplay 
              variant="chip" 
              size={{ xs: "medium", sm: "large" }}
              showEditButton={false}
            />
          )}
        </Stack>

        {/* Card de Saldo Atual em Destaque */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <BalanceDisplay 
            variant="card"
            size="large"
            showDetails={true}
            showEditButton={true}
          />
        </Box>

        {/* Cards de Estatísticas Principais */}
        <Grid container spacing={{ xs: 2, sm: 3 }} mb={{ xs: 3, sm: 4 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatCard
              title="Total Entradas"
              value={formatCurrency(stats.totalIncome)}
              subtitle={`${stats.incomeCount} transações`}
              icon={<TrendingUp />}
              color="success"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatCard
              title="Total Saídas"
              value={formatCurrency(stats.totalExpenses)}
              subtitle={`${stats.expenseCount} transações`}
              icon={<TrendingDown />}
              color="error"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatCard
              title="Lucro/Prejuízo"
              value={formatCurrency(stats.netIncome)}
              subtitle="Resultado líquido"
              icon={<Assessment />}
              color={stats.netIncome >= 0 ? 'success' : 'error'}
            />
          </Grid>
        </Grid>

        {/* Cards de Estatísticas de Trading - Responsivo */}
        {additionalStats.totalTrades > 0 && (
          <Grid container spacing={{ xs: 2, sm: 3 }} mb={{ xs: 3, sm: 4 }}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Taxa Vitória"
                value={`${additionalStats.winRate.toFixed(1)}%`}
                subtitle={`${additionalStats.totalTrades} trades`}
                icon={<Timeline />}
                color={additionalStats.winRate >= 60 ? 'success' : additionalStats.winRate >= 40 ? 'warning' : 'error'}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Lucro Médio"
                value={formatCurrency(additionalStats.averageWin)}
                subtitle="Por vitória"
                icon={<TrendingUp />}
                color="success"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Perda Média"
                value={formatCurrency(additionalStats.averageLoss)}
                subtitle="Por derrota"
                icon={<TrendingDown />}
                color="error"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Total Trades"
                value={additionalStats.totalTrades.toString()}
                subtitle="Operações"
                icon={<SwapHoriz />}
                color="info"
              />
            </Grid>
          </Grid>
        )}

        {/* Seção de Filtros - Desktop */}
        {!isMobile && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack spacing={3}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Search /> Filtros e Controles
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant={viewMode === 'table' ? 'contained' : 'outlined'}
                      size="small"
                      startIcon={<ViewList />}
                      onClick={() => setViewMode('table')}
                    >
                      Tabela
                    </Button>
                    <Button
                      variant={viewMode === 'cards' ? 'contained' : 'outlined'}
                      size="small"
                      startIcon={<ViewModule />}
                      onClick={() => setViewMode('cards')}
                    >
                      Cards
                    </Button>
                  </Stack>
                </Stack>
                
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      fullWidth
                      placeholder="Buscar transações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Tipo</InputLabel>
                      <Select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        label="Tipo"
                      >
                        <MenuItem value="all">Todos</MenuItem>
                        <MenuItem value="income">Entrada</MenuItem>
                        <MenuItem value="expense">Saída</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Categoria</InputLabel>
                      <Select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        label="Categoria"
                      >
                        <MenuItem value="all">Todas</MenuItem>
                        {Object.entries(categories).map(([key, cat]) => (
                          <MenuItem key={key} value={key}>{cat.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Ordenar</InputLabel>
                      <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        label="Ordenar"
                      >
                        <MenuItem value="date">Data</MenuItem>
                        <MenuItem value="amount">Valor</MenuItem>
                        <MenuItem value="description">Descrição</MenuItem>
                        <MenuItem value="category">Categoria</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => openDialog()}
                      size="small"
                    >
                      Nova Transação
                    </Button>
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Header mobile com busca e filtros */}
        {isMobile && (
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ p: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  fullWidth
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.8rem'
                    }
                  }}
                />
                <IconButton 
                  onClick={() => setDrawerOpen(true)}
                  size="small"
                  sx={{ p: 1 }}
                >
                  <Search sx={{ fontSize: 20 }} />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Lista de Transações - Mobile Otimizada */}
        <Card>
          <CardContent sx={{ p: isMobile ? 1.5 : 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontSize: isMobile ? '0.9rem' : '1.25rem' }}>
                Transações ({filteredAndSortedTransactions.length})
              </Typography>
              <Chip 
                label={formatCurrency(balance)}
                color={balance >= 0 ? 'success' : 'error'}
                variant="outlined"
                size="small"
                sx={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}
              />
            </Stack>
            
            {/* Vista de Cards - Mobile/Desktop */}
            {(isMobile || viewMode === 'cards') && (
              <Box>
                {filteredAndSortedTransactions.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: isMobile ? 4 : 6 }}>
                    <Assessment sx={{ fontSize: isMobile ? 48 : 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                      {safeTransactions.length === 0 
                        ? 'Nenhuma transação cadastrada'
                        : 'Nenhuma transação encontrada'
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}>
                      {safeTransactions.length === 0 
                        ? 'Adicione sua primeira transação para começar.'
                        : 'Tente ajustar os filtros de busca.'
                      }
                    </Typography>
                  </Box>
                ) : (
                  filteredAndSortedTransactions.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))
                )}
              </Box>
            )}

            {/* Vista de Tabela - Desktop apenas */}
            {!isMobile && viewMode === 'table' && (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        sx={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort('date')}
                      >
                        Data {getSortIcon('date')}
                      </TableCell>
                      <TableCell 
                        sx={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort('description')}
                      >
                        Descrição {getSortIcon('description')}
                      </TableCell>
                      <TableCell 
                        sx={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort('category')}
                      >
                        Categoria {getSortIcon('category')}
                      </TableCell>
                      <TableCell 
                        sx={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => handleSort('amount')}
                      >
                        Valor {getSortIcon('amount')}
                      </TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredAndSortedTransactions.map((transaction) => (
                      <TableRow key={transaction.id} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {getTransactionIcon(transaction.type, transaction.category)}
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {transaction.description}
                              </Typography>
                              {transaction.notes && (
                                <Typography variant="caption" color="text.secondary">
                                  {transaction.notes}
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={categories[transaction.category]?.label}
                            color={categories[transaction.category]?.color}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color={getTransactionColor(transaction.type)}
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                onClick={() => openDialog(transaction)}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Excluir">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(transaction.id)}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredAndSortedTransactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Box sx={{ py: 4 }}>
                            <Assessment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography color="text.secondary" variant="h6">
                              Nenhuma transação encontrada
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* FAB para adicionar transação no mobile */}
        {isMobile && (
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: { xs: 16, sm: 24 },
              right: { xs: 16, sm: 24 },
              zIndex: 1000,
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              boxShadow: theme.shadows[8],
              '&:hover': {
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
            onClick={() => openDialog()}
          >
            <Add />
          </Fab>
        )}

        {/* Drawer de filtros para mobile */}
        <FiltersDrawer />

        {/* Dialog de Transação - Mobile Otimizado */}
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)} 
          maxWidth="sm" 
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: isMobile ? { margin: 0 } : { borderRadius: 2 }
          }}
        >
          {isMobile && (
            <AppBar position="static" color="primary" elevation={0}>
              <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '1rem' }}>
                  {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
                </Typography>
                <IconButton edge="end" color="inherit" onClick={() => setDialogOpen(false)}>
                  <Close />
                </IconButton>
              </Toolbar>
            </AppBar>
          )}
          
          {!isMobile && (
            <DialogTitle sx={{ fontSize: '1.1rem' }}>
              {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
            </DialogTitle>
          )}
          
          <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
            <Stack spacing={isMobile ? 2 : 3} sx={{ mt: isMobile ? 0 : 1 }}>
              <TextField
                label="Descrição"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                required
                size={isMobile ? "small" : "medium"}
                placeholder="Ex: Lucro do trade EUR/USD"
              />
              
              <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                  <TextField
                    label="Valor"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    fullWidth
                    required
                    size={isMobile ? "small" : "medium"}
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <FormControl fullWidth required size={isMobile ? "small" : "medium"}>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      label="Tipo"
                    >
                      <MenuItem value="income">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <TrendingUp color="success" />
                          <span>Entrada</span>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="expense">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <TrendingDown color="error" />
                          <span>Saída</span>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                  <FormControl fullWidth required size={isMobile ? "small" : "medium"}>
                    <InputLabel>Categoria</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      label="Categoria"
                    >
                      {Object.entries(categories).map(([key, cat]) => (
                        <MenuItem key={key} value={key}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {cat.icon}
                            <span>{cat.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    label="Data"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    fullWidth
                    size={isMobile ? "small" : "medium"}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </Grid>

              <TextField
                label="Observações"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                fullWidth
                multiline
                rows={isMobile ? 2 : 3}
                size={isMobile ? "small" : "medium"}
                placeholder="Adicione observações sobre esta transação..."
              />
            </Stack>
          </DialogContent>
          
          <DialogActions sx={{ p: isMobile ? 2 : 3, gap: 1 }}>
            <Button 
              onClick={() => setDialogOpen(false)} 
              size={isMobile ? "large" : "medium"}
              fullWidth={isMobile}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained"
              disabled={!formData.description || !formData.amount}
              size={isMobile ? "large" : "medium"}
              fullWidth={isMobile}
            >
              {editingTransaction ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default GestaoFinanceira; 