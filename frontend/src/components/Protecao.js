import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Collapse,
  SwipeableDrawer,
  AppBar,
  Toolbar,
  Fab,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Calculate,
  TrendingUp,
  TrendingDown,
  Warning,
  Info,
  PlayArrow,
  Refresh,
  Save,
  Download,
  AttachMoney,
  Casino,
  PieChart,
  BarChart,
  Assessment,
  Speed,
  MonetizationOn,
  ShowChart,
  Menu,
  Close,
  ExpandMore,
  ExpandLess,
  TableView,
  ViewList,
  Analytics,
  Settings,
  SwipeUp,
} from '@mui/icons-material';
import { TITLE_STYLES } from '../theme';

const Protecao = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  // Estados principais - VALORES PADRÃO PARA SIMULAÇÃO AUTOMÁTICA
  const [config, setConfig] = useState({
    valorOperacao: '10', // Valor padrão 10 reais
    multiplicador: '2', // Multiplicador padrão 2x
    maxNiveis: 3, // Padrão 3 tentativas
    moeda: 'BRL', // Padrão BRL
    incluirSpread: false, // Desativado por padrão
    spread: '',
  });

  const [resultados, setResultados] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [alertas, setAlertas] = useState([]);
  
  // Estados para responsividade
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState(isMobile ? 'cards' : 'table');
  const [expandedCards, setExpandedCards] = useState(new Set());

  // Cálculo da Proteção - otimizado sem capital inicial
  const calcularProtecao = useCallback(() => {
    // Validar se os campos necessários estão preenchidos
    if (!config.valorOperacao || !config.multiplicador || !config.maxNiveis) {
      setResultados([]);
      setEstatisticas(null);
      setAlertas([]);
      return;
    }

    const valorOperacao = parseFloat(config.valorOperacao) || 0;
    const multiplicador = parseFloat(config.multiplicador) || 2;
    const maxNiveis = parseInt(config.maxNiveis) || 3;
    const spread = parseFloat(config.spread) || 0;

    // Validações básicas
    if (valorOperacao <= 0 || multiplicador <= 0 || maxNiveis <= 0) {
      setResultados([]);
      setEstatisticas(null);
      setAlertas([]);
      return;
    }

    const niveis = [];
    let valorAcumulado = 0;
    let proximoValor = valorOperacao;
    
    for (let i = 1; i <= maxNiveis; i++) {
      valorAcumulado += proximoValor;
      
      const perdaTotal = valorAcumulado;
      // Capital necessário é o valor acumulado até este nível
      const capitalNecessario = perdaTotal;
      const spreadCalculado = config.incluirSpread ? proximoValor * spread : 0;
      const lucroLiquido = proximoValor - perdaTotal - spreadCalculado;
      
      niveis.push({
        nivel: i,
        valor: proximoValor,
        valorAcumulado: perdaTotal,
        capitalNecessario: capitalNecessario,
        spread: spreadCalculado,
        lucroLiquido: lucroLiquido,
        risco: capitalNecessario > 100 ? 'alto' : capitalNecessario > 50 ? 'medio' : 'baixo'
      });
      
      proximoValor = proximoValor * multiplicador;
    }
    
    setResultados(niveis);
    calcularEstatisticas(niveis, maxNiveis, config.moeda);
    gerarAlertas(niveis, valorOperacao, config.moeda);
  }, [config]);

  // Cálculo de estatísticas - sem capital inicial
  const calcularEstatisticas = useCallback((niveis, maxNiveis, moeda) => {
    if (!niveis.length) return;
    
    const totalCapitalNecessario = niveis[niveis.length - 1].valorAcumulado;
    const maiorOperacao = niveis[niveis.length - 1].valor;
    const probabilidadeSequenciaPerda = Math.pow(0.5, maxNiveis) * 100;
    
    setEstatisticas({
      totalCapitalNecessario,
      maiorOperacao,
      probabilidadeSequenciaPerda,
      niveisSegurosBaixo: niveis.filter(n => n.risco === 'baixo').length,
      niveisMedio: niveis.filter(n => n.risco === 'medio').length,
      niveisAlto: niveis.filter(n => n.risco === 'alto').length,
    });
  }, []);

  // Gerar alertas - sem capital inicial
  const gerarAlertas = useCallback((niveis, valorOperacao, moeda) => {
    if (!niveis.length) return;
    
    const alertasTemp = [];
    
    const totalNecessario = niveis[niveis.length - 1].valorAcumulado;
    if (totalNecessario > 500) {
      alertasTemp.push({
        tipo: 'warning',
        titulo: 'Capital Alto Necessário',
        mensagem: `Você precisará de ${moeda} ${totalNecessario.toFixed(2)} para completar todos os níveis da Proteção.`
      });
    }
    
    if (niveis.filter(n => n.risco === 'alto').length > 0) {
      alertasTemp.push({
        tipo: 'error',
        titulo: 'Níveis de Alto Risco',
        mensagem: `${niveis.filter(n => n.risco === 'alto').length} níveis apresentam risco alto (>R$ 100 por operação).`
      });
    }
    
    const lucroMaximo = Math.max(...niveis.map(n => n.lucroLiquido));
    if (lucroMaximo < valorOperacao * 0.5) {
      alertasTemp.push({
        tipo: 'info',
        titulo: 'Lucro Reduzido',
        mensagem: 'O lucro líquido está sendo significativamente impactado pelo spread.'
      });
    }
    
    setAlertas(alertasTemp);
  }, []);

  // CALCULAR AUTOMATICAMENTE NA INICIALIZAÇÃO
  useEffect(() => {
    calcularProtecao();
  }, [calcularProtecao]);

  // Ajustar view mode baseado no tamanho da tela
  useEffect(() => {
    if (isMobile && viewMode === 'table') {
      setViewMode('cards');
    }
  }, [isMobile, viewMode]);

  // Função para alternar cards expandidos
  const toggleCardExpansion = (cardId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  // Input completamente isolado que NUNCA reseta durante re-renders
  const IsolatedInput = React.memo(({ 
    label, 
    value: initialValue, 
    fieldName, 
    onSave, 
    disabled,
    type = "number",
    step,
    min,
    max,
    placeholder,
    startAdornment,
    endAdornment,
    size,
    inputProps
  }) => {
    // Estados estáveis que só mudam quando necessário
    const [localValue, setLocalValue] = useState(() => initialValue || '');
    const isEditingRef = useRef(false);
    const hasUserInputRef = useRef(false);
    const initializedRef = useRef(false);
    const lastExternalValueRef = useRef(initialValue);

    // Inicialização controlada - só na primeira vez ou quando valor externo muda significativamente
    useEffect(() => {
      if (!initializedRef.current) {
        setLocalValue(initialValue || '');
        lastExternalValueRef.current = initialValue;
        initializedRef.current = true;
      } else if (initialValue !== lastExternalValueRef.current && !isEditingRef.current && !hasUserInputRef.current) {
        // Só atualizar se: valor externo mudou E não está editando E usuário não digitou nada ainda
        setLocalValue(initialValue || '');
        lastExternalValueRef.current = initialValue;
      }
    }, [initialValue]);

    const handleChange = useCallback((e) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      isEditingRef.current = true;
      hasUserInputRef.current = true;
    }, []);

    const handleFocus = useCallback(() => {
      isEditingRef.current = true;
    }, []);

    const handleBlur = useCallback(() => {
      isEditingRef.current = false;
      lastExternalValueRef.current = localValue;
      onSave(fieldName, localValue);
    }, [fieldName, localValue, onSave]);

    const handleKeyPress = useCallback((e) => {
      if (e.key === 'Enter') {
        e.target.blur();
      }
    }, []);

    return (
      <Box 
        onClick={(e) => e.stopPropagation()} 
        onMouseDown={(e) => e.stopPropagation()}
        sx={{ position: 'relative', zIndex: 10 }}
      >
        <TextField
          fullWidth
          label={label}
          type={type}
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          step={step}
          InputProps={{
            startAdornment,
            endAdornment,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              cursor: 'text',
              pointerEvents: 'auto',
            },
            '& .MuiInputBase-input': {
              userSelect: 'text !important',
              WebkitUserSelect: 'text !important',
              MozUserSelect: 'text !important',
              msUserSelect: 'text !important',
              cursor: 'text !important',
              pointerEvents: 'auto !important',
            },
            '& .MuiInputBase-root': {
              pointerEvents: 'auto !important',
            },
            '& fieldset': {
              pointerEvents: 'none',
            },
          }}
          inputProps={{
            ...inputProps,
            min,
            max,
            step,
            'data-testid': `${label.toLowerCase().replace(' ', '-')}-input`,
            style: {
              userSelect: 'text !important',
              WebkitUserSelect: 'text !important',
              MozUserSelect: 'text !important',
              msUserSelect: 'text !important',
              pointerEvents: 'auto !important',
            }
          }}
        />
      </Box>
    );
  }, (prevProps, nextProps) => {
    // BLOQUEIO TOTAL: Só re-renderizar se realmente necessário
    return (
      prevProps.fieldName === nextProps.fieldName &&
      prevProps.disabled === nextProps.disabled &&
      prevProps.label === nextProps.label &&
      prevProps.placeholder === nextProps.placeholder &&
      prevProps.onSave === nextProps.onSave &&
      prevProps.type === nextProps.type &&
      prevProps.size === nextProps.size
      // IMPORTANTE: NÃO comparar `value` para evitar re-renders durante typing
    );
  });

  // Função otimizada para atualizar configurações
  const updateConfig = useCallback((fieldName, value) => {
    setConfig(prev => ({ ...prev, [fieldName]: value }));
  }, []);

  // Função para resetar configurações
  const resetConfig = useCallback(() => {
    setConfig({
      valorOperacao: '10',
      multiplicador: '2',
      maxNiveis: 3,
      moeda: 'BRL',
      incluirSpread: false,
      spread: '',
    });
    setResultados([]);
    setEstatisticas(null);
    setAlertas([]);
  }, []);

  // Componente de estatística responsivo
  const StatCard = ({ title, value, subtitle, icon, color = 'primary', trend = null, size = 'medium' }) => (
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

  // Funções auxiliares
  const getRiscoColor = (risco) => {
    switch (risco) {
      case 'baixo': return 'success';
      case 'medio': return 'warning';
      case 'alto': return 'error';
      default: return 'default';
    }
  };

  const getRiscoIcon = (risco) => {
    switch (risco) {
      case 'baixo': return <TrendingUp />;
      case 'medio': return <Warning />;
      case 'alto': return <TrendingDown />;
      default: return <Info />;
    }
  };

  // Componente de configuração responsivo
  const ConfigSection = () => (
    <Card
      sx={{
        borderRadius: { xs: 2, sm: 3 },
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        backdropFilter: 'blur(20px)',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={{ xs: 2, sm: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 600,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Settings sx={{ fontSize: { xs: 20, sm: 24 } }} />
            Configurações
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <IsolatedInput
                label="Valor da Operação"
                value={config.valorOperacao}
                fieldName="valorOperacao"
                onSave={updateConfig}
                disabled={false}
                type="number"
                step="0.01"
                min="0"
                max="1000000"
                placeholder="Digite o valor da operação"
                startAdornment={<MonetizationOn sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <IsolatedInput
                label="Multiplicador"
                value={config.multiplicador}
                fieldName="multiplicador"
                onSave={updateConfig}
                disabled={false}
                type="number"
                step="0.1"
                min="1"
                max="10"
                placeholder="Digite o multiplicador"
                startAdornment={<ShowChart sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <IsolatedInput
                label="Máximo de Níveis"
                value={config.maxNiveis}
                fieldName="maxNiveis"
                onSave={updateConfig}
                disabled={false}
                type="number"
                step="1"
                min="1"
                max="10"
                placeholder="Digite o máximo de níveis"
                startAdornment={<BarChart sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                <InputLabel>Moeda</InputLabel>
                <Select
                  value={config.moeda}
                  label="Moeda"
                  onChange={(e) => updateConfig('moeda', e.target.value)}
                >
                  <MenuItem value="BRL">BRL (R$)</MenuItem>
                  <MenuItem value="USD">USD ($)</MenuItem>
                  <MenuItem value="EUR">EUR (€)</MenuItem>
                  <MenuItem value="GBP">GBP (£)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <IsolatedInput
                label="Spread"
                value={config.spread}
                fieldName="spread"
                onSave={updateConfig}
                disabled={!config.incluirSpread}
                type="number"
                step="0.0001"
                min="0"
                max="0.01"
                placeholder={config.incluirSpread ? "Digite o spread" : "Spread desabilitado"}
                startAdornment={config.incluirSpread ? <MonetizationOn sx={{ fontSize: { xs: 18, sm: 20 } }} /> : null}
                size={isMobile ? "small" : "medium"}
              />
            </Grid>
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.incluirSpread}
                    onChange={(e) => updateConfig('incluirSpread', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    Incluir Spread nos Cálculos
                  </Typography>
                }
              />
            </Grid>
          </Grid>

          {/* Mensagem informativa quando campos obrigatórios não estão preenchidos */}
          {(!config.valorOperacao || !config.multiplicador || !config.maxNiveis) && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                Preencha os campos obrigatórios: Valor da Operação, Multiplicador e Máximo de Níveis para calcular a Proteção.
              </Typography>
            </Alert>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Calculate />}
              onClick={calcularProtecao}
              fullWidth={isMobile}
              disabled={!config.valorOperacao || !config.multiplicador || !config.maxNiveis}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Calcular Proteção
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={resetConfig}
              fullWidth={isMobile}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Resetar
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  // Componente de resultado como card para mobile
  const ResultCard = ({ nivel, index }) => {
    const isExpanded = expandedCards.has(nivel.nivel);
    
    return (
      <Card
        sx={{
          borderRadius: { xs: 2, sm: 3 },
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Stack spacing={{ xs: 1.5, sm: 2 }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette[getRiscoColor(nivel.risco)].main, 0.1),
                    color: theme.palette[getRiscoColor(nivel.risco)].main,
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                  }}
                >
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                  >
                    {nivel.nivel}
                  </Typography>
                </Avatar>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 600 
                    }}
                  >
                    Nível {nivel.nivel}
                  </Typography>
                  <Chip
                    size="small"
                    label={nivel.risco.toUpperCase()}
                    color={getRiscoColor(nivel.risco)}
                    sx={{ 
                      fontSize: { xs: '0.65rem', sm: '0.7rem' },
                      height: { xs: 20, sm: 24 }
                    }}
                  />
                </Box>
              </Stack>

              <IconButton
                onClick={() => toggleCardExpansion(nivel.nivel)}
                size={isMobile ? "small" : "medium"}
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Stack>

            {/* Informações principais sempre visíveis */}
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              <Grid size={6}>
                <Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  >
                    Valor da Aposta
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight="bold"
                    sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                  >
                    {config.moeda} {nivel.valor.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={6}>
                <Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  >
                    Total Acumulado
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight="bold"
                    sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                  >
                    {config.moeda} {nivel.valorAcumulado.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Informações detalhadas - expandível */}
            <Collapse in={isExpanded}>
              <Divider sx={{ my: { xs: 1, sm: 1.5 } }} />
              <Grid container spacing={{ xs: 1, sm: 2 }}>
                <Grid size={6}>
                  <Box>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                    >
                      Capital Necessário
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                    >
                      R$ {nivel.capitalNecessario.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                    >
                      Spread
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                    >
                      {config.moeda} {nivel.spread.toFixed(4)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={12}>
                  <Box>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                    >
                      Lucro Líquido
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color={nivel.lucroLiquido > 0 ? 'success.main' : 'error.main'}
                      fontWeight="bold"
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                    >
                      {config.moeda} {nivel.lucroLiquido.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Collapse>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header responsivo */}
      {isMobile && (
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            mb: { xs: 1, sm: 2 }
          }}
        >
          <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
            <IconButton
              edge="start"
              onClick={() => setConfigDrawerOpen(true)}
              sx={{ 
                mr: 2,
                color: 'text.primary',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: 2
              }}
              size="small"
            >
              <Menu />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                flexGrow: 1, 
                color: 'text.primary',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                fontWeight: 600
              }}
            >
              Proteção
            </Typography>
            <IconButton
              onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
              sx={{
                color: 'text.primary',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: 2
              }}
              size="small"
            >
              {viewMode === 'cards' ? <TableView /> : <ViewList />}
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Container 
        maxWidth="xl" 
        sx={{ 
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3 }
        }}
      >
        <Stack spacing={{ xs: 2, sm: 4 }}>
          {/* Header principal para desktop/tablet */}
          {!isMobile && (
            <Box>
              <Typography 
                {...TITLE_STYLES.pageTitle}
              >
                Calculadora de Proteção
              </Typography>
              <Stack 
                direction={{ sm: 'column', lg: 'row' }} 
                justifyContent={{ lg: 'space-between' }} 
                alignItems={{ lg: 'center' }}
                spacing={{ sm: 1, lg: 0 }}
              >
                <Typography 
                  {...TITLE_STYLES.pageSubtitle}
                  sx={{ 
                    ...TITLE_STYLES.pageSubtitle.sx,
                    maxWidth: { sm: '100%', lg: 800 },
                  }}
                >
                  Calcule e analise estratégias de Proteção com gestão de risco inteligente
                </Typography>
                {!isMobile && (
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                      }}
                    >
                      {viewMode === 'cards' ? <TableView /> : <ViewList />}
                    </IconButton>
                  </Stack>
                )}
              </Stack>
            </Box>
          )}

          {/* Alertas */}
          {alertas.length > 0 && (
            <Stack spacing={2}>
              {alertas.map((alerta, index) => (
                <Fade in key={index} timeout={500 + index * 100}>
                  <Alert 
                    severity={alerta.tipo}
                    sx={{ 
                      borderRadius: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                    icon={alerta.tipo === 'error' ? <Warning /> : <Info />}
                  >
                    <Typography variant="subtitle2" fontWeight="600">
                      {alerta.titulo}
                    </Typography>
                    <Typography variant="body2">
                      {alerta.mensagem}
                    </Typography>
                  </Alert>
                </Fade>
              ))}
            </Stack>
          )}

          {/* Configurações - Desktop sempre visível, Mobile em drawer */}
          {!isMobile ? (
            <ConfigSection />
          ) : (
            <SwipeableDrawer
              anchor="bottom"
              open={configDrawerOpen}
              onClose={() => setConfigDrawerOpen(false)}
              onOpen={() => setConfigDrawerOpen(true)}
              disableSwipeToOpen={false}
              ModalProps={{
                keepMounted: true,
              }}
              PaperProps={{
                sx: {
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  maxHeight: '90vh',
                }
              }}
            >
              <Box sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography 
                    variant="h6" 
                    fontWeight="600"
                    sx={{ 
                      fontSize: { sm: '1rem', lg: '1.25rem' },
                      color: 'text.primary'
                    }}
                  >
                    Configurações
                  </Typography>
                  <IconButton onClick={() => setConfigDrawerOpen(false)}>
                    <Close />
                  </IconButton>
                </Stack>
                <ConfigSection />
              </Box>
            </SwipeableDrawer>
          )}

          {/* Estatísticas */}
          {estatisticas && (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <StatCard
                  title="Capital Necessário"
                  value={`R$ ${estatisticas.totalCapitalNecessario.toFixed(2)}`}
                                      subtitle="Para completar Proteção"
                  icon={<MonetizationOn />}
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <StatCard
                  title="Maior Operação"
                  value={`R$ ${estatisticas.maiorOperacao.toFixed(2)}`}
                  subtitle={`Nível ${config.maxNiveis}`}
                  icon={<Casino />}
                  color="warning"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <StatCard
                  title="Níveis de Risco"
                  value={`${estatisticas.niveisAlto} de ${config.maxNiveis}`}
                  subtitle="Operações > R$ 100"
                  icon={<Assessment />}
                  color="error"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <StatCard
                  title="Probabilidade"
                  value={`${estatisticas.probabilidadeSequenciaPerda.toFixed(2)}%`}
                  subtitle="Sequência de perdas"
                  icon={<PieChart />}
                  color="info"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Grid>
            </Grid>
          )}

          {/* Resultados - Tabela para desktop */}
          {viewMode === 'table' && !isMobile ? (
            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, pb: 0 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.secondary.main, 0.1),
                          color: theme.palette.secondary.main,
                        }}
                      >
                        <Speed />
                      </Avatar>
                      <Typography 
                        variant="h5" 
                        fontWeight="600"
                        sx={{ 
                          fontSize: { sm: '1.25rem', lg: '1.5rem' },
                          color: 'text.primary'
                        }}
                      >
                        Análise por Níveis
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Salvar Configuração">
                        <IconButton>
                          <Save />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Exportar Dados">
                        <IconButton>
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Box>

                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 600, py: 2 }}>
                          Nível
                        </TableCell>
                        <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 600, py: 2 }}>
                          Valor da Operação
                        </TableCell>
                        <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 600, py: 2 }}>
                          Capital Acumulado
                        </TableCell>
                        <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 600, py: 2 }}>
                          Capital Necessário
                        </TableCell>
                        <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 600, py: 2 }}>
                          Spread
                        </TableCell>
                        <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 600, py: 2 }}>
                          Lucro Líquido
                        </TableCell>
                        <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 600, py: 2 }}>
                          Risco
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {resultados.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                            <Stack spacing={2} alignItems="center">
                              <Calculate sx={{ fontSize: 64, color: 'text.disabled' }} />
                              <Typography variant="h6" color="text.secondary">
                                Configure os parâmetros e clique em Calcular
                              </Typography>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ) : (
                        resultados.map((nivel, index) => (
                          <Fade in timeout={300 + index * 50} key={nivel.nivel}>
                            <TableRow
                              hover
                              sx={{
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                                },
                                '&:nth-of-type(odd)': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.01),
                                }
                              }}
                            >
                              <TableCell sx={{ py: 2 }}>
                                <Typography variant="h6" fontWeight="600">
                                  {nivel.nivel}
                                </Typography>
                              </TableCell>

                              <TableCell sx={{ py: 2 }}>
                                <Typography variant="body1" fontWeight="600" color="primary.main">
                                  {config.moeda} {nivel.valor.toLocaleString()}
                                </Typography>
                              </TableCell>

                              <TableCell sx={{ py: 2 }}>
                                <Typography variant="body1" fontWeight="600">
                                  {config.moeda} {nivel.valorAcumulado.toLocaleString()}
                                </Typography>
                              </TableCell>

                              <TableCell sx={{ py: 2 }}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography 
                                    variant="body1" 
                                    fontWeight="600"
                                    color={nivel.capitalNecessario > 100 ? 'error.main' : 
                                          nivel.capitalNecessario > 50 ? 'warning.main' : 'success.main'}
                                  >
                                    R$ {nivel.capitalNecessario.toFixed(2)}
                                  </Typography>
                                </Stack>
                              </TableCell>

                              <TableCell sx={{ py: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {config.moeda} {nivel.spread.toFixed(4)}
                                </Typography>
                              </TableCell>

                              <TableCell sx={{ py: 2 }}>
                                <Typography 
                                  variant="body1" 
                                  fontWeight="600"
                                  color={nivel.lucroLiquido > 0 ? 'success.main' : 'error.main'}
                                >
                                  {config.moeda} {nivel.lucroLiquido.toFixed(2)}
                                </Typography>
                              </TableCell>

                              <TableCell sx={{ py: 2 }}>
                                <Chip 
                                  label={nivel.risco.toUpperCase()}
                                  color={getRiscoColor(nivel.risco)}
                                  size="small"
                                  icon={getRiscoIcon(nivel.risco)}
                                  sx={{ 
                                    fontWeight: 600,
                                    minWidth: 80,
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          </Fade>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ) : null}
          
          {/* Resultados como cards para mobile ou quando selecionado */}
          {(viewMode === 'cards' || isMobile) && (
            <Card
              sx={{
                borderRadius: { xs: 2, sm: 3 },
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                        width: { xs: 32, sm: 40 },
                        height: { xs: 32, sm: 40 },
                      }}
                    >
                      <Analytics />
                    </Avatar>
                    <Typography 
                      variant={isMobile ? 'h6' : 'h5'} 
                      fontWeight="600"
                      sx={{ fontSize: { xs: '1.125rem', sm: '1.5rem' } }}
                    >
                      Análise por Níveis
                    </Typography>
                  </Stack>
                  {!isMobile && (
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Salvar Configuração">
                        <IconButton size="small">
                          <Save />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Exportar Dados">
                        <IconButton size="small">
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  )}
                </Stack>

                {resultados.length === 0 ? (
                  <Stack spacing={2} alignItems="center" py={4}>
                    <Calculate sx={{ fontSize: { xs: 48, sm: 64 }, color: 'text.disabled' }} />
                    <Typography 
                      variant="h6" 
                      color="text.secondary"
                      textAlign="center"
                      sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      Configure os parâmetros e clique em Calcular
                    </Typography>
                  </Stack>
                ) : (
                  <Stack spacing={1}>
                    {resultados.map((nivel, index) => (
                      <ResultCard key={nivel.nivel} nivel={nivel} index={index} />
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          )}

          {/* Resumo de Níveis por Risco */}
          {estatisticas && (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: { xs: 2, sm: 3 },
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.03)} 0%, ${alpha(theme.palette.success.light, 0.01)} 100%)`,
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar 
                        sx={{ 
                          bgcolor: alpha(theme.palette.success.main, 0.1), 
                          color: 'success.main',
                          width: { xs: 40, sm: 48 },
                          height: { xs: 40, sm: 48 },
                        }}
                      >
                        <TrendingUp />
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h4" 
                          fontWeight="bold" 
                          color="success.main"
                          sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                        >
                          {estatisticas.niveisSegurosBaixo}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          Níveis de Baixo Risco
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                        >
                          Até 25% do capital
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: { xs: 2, sm: 3 },
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.03)} 0%, ${alpha(theme.palette.warning.light, 0.01)} 100%)`,
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar 
                        sx={{ 
                          bgcolor: alpha(theme.palette.warning.main, 0.1), 
                          color: 'warning.main',
                          width: { xs: 40, sm: 48 },
                          height: { xs: 40, sm: 48 },
                        }}
                      >
                        <Warning />
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h4" 
                          fontWeight="bold" 
                          color="warning.main"
                          sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                        >
                          {estatisticas.niveisMedio}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          Níveis de Risco Médio
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                        >
                          25% - 50% do capital
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: { xs: 2, sm: 3 },
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.03)} 0%, ${alpha(theme.palette.error.light, 0.01)} 100%)`,
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar 
                        sx={{ 
                          bgcolor: alpha(theme.palette.error.main, 0.1), 
                          color: 'error.main',
                          width: { xs: 40, sm: 48 },
                          height: { xs: 40, sm: 48 },
                        }}
                      >
                        <TrendingDown />
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h4" 
                          fontWeight="bold" 
                          color="error.main"
                          sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
                        >
                          {estatisticas.niveisAlto}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          Níveis de Alto Risco
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                        >
                          Acima de 50% do capital
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Stack>
      </Container>

      {/* FAB para configurações no mobile */}
      {isMobile && (
        <Fab
          color="primary"
          size="medium"
          onClick={() => setConfigDrawerOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
            boxShadow: theme.shadows[8],
            '&:hover': {
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <Settings />
        </Fab>
      )}
    </Box>
  );
};

export default Protecao; 