import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Avatar,
  TextField,
  useTheme,
  alpha,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  TrendingUp,
  TrendingDown,
  AccessTime,
  Refresh,
  Timeline,
  CheckCircle,
  Cancel,
  Check,
  Close,
  LocationOn,
  Bolt,
  GpsFixed,
  DeleteSweep,
  Clear,
  CalendarToday,
  CloudSync,
  CloudDone,
  Cloud,
} from '@mui/icons-material';
import { useFinance } from '../contexts/FinanceContext';
import { TITLE_STYLES } from '../theme';
import BalanceDisplay from './ui/BalanceDisplay';
import * as signalsService from '../services/signalsService';

// Mover dados estáticos para fora do componente para evitar re-renders
const FOREX_PAIRS = [
  'GOOGL'
];

// Chaves para localStorage
const STORAGE_KEYS = {
  SIGNALS_DATA: 'indicacoes_data',
  API_PREFERENCE: 'api_preference'
};

// Funções helper estáticas (fora do componente para evitar recriação)
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      // console.warn('Erro ao salvar no localStorage:', error);
    }
  };

  const loadFromStorage = (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      // console.warn('Erro ao carregar do localStorage:', error);
      return null;
    }
  };

const isOTCTime = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Domingo, 6 = Sábado
  const hour = now.getHours();
  
  // OTC: Sábado e Domingo, ou após 17h e antes de 9h em dias úteis
  return day === 0 || day === 6 || hour >= 17 || hour < 9;
};

const getRandomDirection = () => {
  return Math.random() > 0.5 ? 'CALL' : 'PUT';
};

const Indicacoes = () => {
  const theme = useTheme();
  const { addTradingResult } = useFinance();

  const [signals, setSignals] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [isClearing, setIsClearing] = useState(false);
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'yesterday', 'week'
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState(null);

  // =====================================================
  // VERIFICAR CONEXÃO COM API
  // =====================================================
  const checkApiConnection = useCallback(async () => {
    try {
      const response = await apiCall('/health');
      const success = response.ok && response.status === 200;
      setIsApiConnected(success);
      if (!success) {
        // console.log('🔄 API não disponível, usando localStorage');
      }
      return success;
    } catch (error) {
      setIsApiConnected(false);
      return false;
    }
  }, []);

  // =====================================================
  // CARREGAR SINAIS (API OU LOCALSTORAGE)
  // =====================================================
  const loadSignals = useCallback(async () => {
    try {
      if (isApiConnected) {
        // console.log('🌐 Carregando sinais da API...');
        try {
          const apiSignals = await signalsService.getSignals({
            limit: 20,
            order: 'created_at',
            direction: 'desc'
          });
          
          // console.log(`✅ ${apiSignals.length} sinais carregados da API`);
          setSignals(apiSignals);
          return apiSignals;
        } catch (apiError) {
          // console.log('💾 Carregando sinais do localStorage...');
          const localSignals = loadFromStorage(STORAGE_KEYS.SIGNALS_DATA) || [];
          // console.log(`✅ ${localSignals.length} sinais carregados do localStorage`);
          setSignals(localSignals);
          return localSignals;
        }
      } else {
        // console.log('💾 Carregando sinais do localStorage...');
        const localSignals = loadFromStorage(STORAGE_KEYS.SIGNALS_DATA) || [];
        // console.log(`✅ ${localSignals.length} sinais carregados do localStorage`);
        setSignals(localSignals);
        return localSignals;
      }
    } catch (error) {
      console.error('❌ Erro ao carregar sinais:', error);
      return [];
    }
  }, [isApiConnected]);

  // =====================================================
  // MIGRAR DADOS DO LOCALSTORAGE PARA API
  // =====================================================
  const migrateToDatabase = useCallback(async () => {
    if (!isApiConnected) return;
    
    try {
      setMigrationStatus('migrating');
      // console.log('🔄 Iniciando migração de dados...');
      
      const result = await signalsService.migrateLocalStorageData();
      
      if (result.success) {
        // console.log(`✅ Migração concluída: ${result.migrated} sinais`);
        
        if (result.migrated > 0) {
          setNotification({
            open: true,
            message: `${result.migrated} sinais migrados para o banco de dados!`,
            severity: 'success'
          });
          
          // Recarregar dados da API
          await loadSignals();
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Erro na migração:', error);
      setMigrationStatus('error');
      setNotification({
        open: true,
        message: 'Erro na migração de dados',
        severity: 'error'
      });
    }
  }, [isApiConnected, loadSignals]);

  // Função para gerar indicação aleatória (sempre 1M)
  const generateRandomSignal = useCallback(() => {
    const randomPair = FOREX_PAIRS[Math.floor(Math.random() * FOREX_PAIRS.length)];
    const direction = getRandomDirection();
    const isOTC = isOTCTime();
    const now = new Date();
    
    // Calcular horário de entrada (2 minutos após o sinal)
    const entryTime = new Date(now.getTime() + 2 * 60 * 1000); // Adiciona 2 minutos
    
    return {
      id: Date.now() + Math.random(),
      par: randomPair,
      direcao: direction,
      timeframe: '1M', // Sempre 1 minuto
      entrada: entryTime.toISOString(),
      expiracao: new Date(entryTime.getTime() + 60 * 1000).toISOString(), // 1 minuto de duração
      createdAt: now.toISOString(), // Data completa de criação
      createdDate: now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      signalTime: now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }),
      time: entryTime.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit'
      }),
      isOTC: isOTC,
      valor: '',
      probabilidade: '',
      resultado: null // null, 'WIN', 'LOSS'
    };
  }, []);

  // Função para gerar indicações iniciais
  const generateAllSignals = useCallback(() => {
    const allSignals = [];
    
    // Gerar apenas 1 sinal inicial
    allSignals.push(generateRandomSignal());
    
    return allSignals;
  }, [generateRandomSignal]);

  // Inicialização com verificação de API
  useEffect(() => {
    const initializeApp = async () => {
      if (!isInitialized) {
        // 1. Verificar conexão com API
        const apiConnected = await checkApiConnection();
        
        // 2. Carregar sinais
        const loadedSignals = await loadSignals();
        
        // 3. Se conectado à API e há dados locais, perguntar sobre migração
        if (apiConnected && loadedSignals.length === 0) {
          const localData = loadFromStorage(STORAGE_KEYS.SIGNALS_DATA);
          if (localData && localData.length > 0) {
            setNotification({
              open: true,
              message: 'Dados locais encontrados. Migração para banco disponível.',
              severity: 'info'
            });
          }
        }
        
        // 4. Se não há dados, gerar sinais iniciais
        if (loadedSignals.length === 0) {
          const initialSignals = generateAllSignals();
          if (apiConnected) {
            // Salvar na API
            for (const signal of initialSignals) {
              await signalsService.createSignal(signal);
            }
            await loadSignals(); // Recarregar da API
          } else {
            // Salvar no localStorage
            setSignals(initialSignals);
            saveToStorage(STORAGE_KEYS.SIGNALS_DATA, initialSignals);
          }
        }

        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [isInitialized, checkApiConnection, loadSignals, generateAllSignals]);

  // Função para adicionar novas indicações (API ou localStorage)
  const addNewSignals = useCallback(async () => {
    // Proteção contra execução duplicada
    if (isGenerating) {
      // console.log('Execução bloqueada:', { isGenerating });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simular um pequeno delay para feedback visual
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Gerar novo sinal
      const newSignal = generateRandomSignal();
      
      if (isApiConnected) {
        // Salvar na API
        // console.log('💾 Salvando sinal na API...');
        const result = await signalsService.createSignal(newSignal);
        
        if (result.success) {
          // Recarregar dados da API
          await loadSignals();
          setNotification({
            open: true,
            message: '✅ Nova recomendação salva no banco!',
            severity: 'success'
          });
        } else {
          throw new Error(result.error);
        }
      } else {
        // Salvar no localStorage
        // console.log('💾 Salvando sinal no localStorage...');
        setSignals(prev => {
          // Adicionar novo sinal ao início da lista (mais recente primeiro)
          const updatedSignals = [newSignal, ...prev];
          
          // Manter apenas os últimos 20 sinais para não sobrecarregar a interface
          const limitedSignals = updatedSignals.slice(0, 20);
          
          // Salvar no localStorage
          saveToStorage(STORAGE_KEYS.SIGNALS_DATA, limitedSignals);
          
          return limitedSignals;
        });

        setNotification({
          open: true,
          message: '📱 Nova recomendação salva localmente!',
          severity: 'success'
        });
      }

      // console.log('Nova indicação gerada com sucesso');
      
    } catch (error) {
      console.error('Erro ao gerar indicações:', error);
      setNotification({
        open: true,
        message: 'Erro ao gerar nova recomendação: ' + error.message,
        severity: 'error'
      });
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, generateRandomSignal, isApiConnected, loadSignals]);

  // Função para limpar recomendações antigas
  const clearOldSignals = useCallback(async () => {
    if (isClearing) return;

    setIsClearing(true);
    
    try {
      // Simular um pequeno delay para feedback visual
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Manter apenas sinais sem resultado definido (sinais ativos)
      setSignals(prev => {
        const activeSignals = prev.filter(signal => signal.resultado === null);
        saveToStorage(STORAGE_KEYS.SIGNALS_DATA, activeSignals);
        return activeSignals;
      });

      setNotification({
        open: true,
        message: 'Recomendações finalizadas foram removidas!',
        severity: 'info'
      });
      
    } catch (error) {
      console.error('Erro ao limpar recomendações:', error);
      setNotification({
        open: true,
        message: 'Erro ao limpar recomendações',
        severity: 'error'
      });
    } finally {
      setIsClearing(false);
    }
  }, [isClearing]);

  // Função para limpar TODAS as recomendações
  const clearAllSignals = useCallback(async () => {
    if (isClearing) return;

    setIsClearing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSignals([]);
      saveToStorage(STORAGE_KEYS.SIGNALS_DATA, []);

      setNotification({
        open: true,
        message: 'Todas as recomendações foram removidas!',
        severity: 'info'
      });
      
    } catch (error) {
      console.error('Erro ao limpar todas as recomendações:', error);
      setNotification({
        open: true,
        message: 'Erro ao limpar recomendações',
        severity: 'error'
      });
    } finally {
      setIsClearing(false);
    }
  }, [isClearing]);

  // Função para atualizar valor de entrada
  const updateEntryValue = useCallback((id, value) => {
    setSignals(prev => {
      const updated = prev.map(signal => 
        signal.id === id ? { ...signal, valor: value } : signal
      );
      saveToStorage(STORAGE_KEYS.SIGNALS_DATA, updated);
      return updated;
    });
  }, []);

  // Função para atualizar payout
  const updatePayout = useCallback((id, value) => {
    setSignals(prev => {
      const updated = prev.map(signal => 
        signal.id === id ? { ...signal, probabilidade: value } : signal
      );
      saveToStorage(STORAGE_KEYS.SIGNALS_DATA, updated);
      return updated;
    });
  }, []);

  // Ref para controlar processamento e evitar duplicação
  const processingRef = useRef(new Set());

  // Função para marcar resultado - VERSÃO ANTI-DUPLICAÇÃO TOTAL
  const markResult = useCallback((id, result) => {
    // PROTEÇÃO 1: Verificar se já está processando esta operação
    if (processingRef.current.has(`${id}_${result}`)) {
      // console.log('⚠️ OPERAÇÃO JÁ EM PROCESSAMENTO - BLOQUEADA:', { signalId: id, result });
      return;
    }
    
    // Marcar como processando
    processingRef.current.add(`${id}_${result}`);
    
    setSignals(prev => {
      const signal = prev.find(s => s.id === id);
      
      // Validação básica
      if (!signal) {
        // console.log('❌ Sinal não encontrado');
        processingRef.current.delete(`${id}_${result}`);
        return prev;
      }
      
      // Se está definindo um resultado (win/loss), verificar se campos estão preenchidos
      if (result && (!signal.valor || !signal.probabilidade)) {
        // console.log('⚠️ Campos não preenchidos');
        setNotification({
          open: true,
          message: 'Preencha todos os campos antes de marcar o resultado',
          severity: 'warning'
        });
        processingRef.current.delete(`${id}_${result}`);
        return prev;
      }
      
      // Criar objeto atualizado
      const updatedSignal = {
        ...signal,
        resultado: result
      };
      
      // Se definindo resultado, processar transação financeira
      if (result && addTradingResult) {
        // console.log('💰 PROCESSANDO TRANSAÇÃO:', {
        //   signalId: id,
        //   result,
        //   entryValue: signal.valor,
        //   payoutPercent: signal.probabilidade
        // });
        
        try {
          addTradingResult(updatedSignal, result);
        } catch (financeError) {
          console.error('❌ Erro na transação financeira:', financeError);
          setNotification({
            open: true,
            message: 'Erro ao processar transação financeira',
            severity: 'error'
          });
          processingRef.current.delete(`${id}_${result}`);
          return prev;
        }
      }
      
      // Atualizar lista de sinais
      const updatedSignals = prev.map(s => s.id === id ? updatedSignal : s);
      
      // Salvar dependendo da conexão
      if (isApiConnected) {
        // Tentar salvar na API (async, sem bloquear UI)
        signalsService.updateSignal(id, { resultado: result })
          .catch(error => {
            console.error('❌ Erro ao salvar na API:', error);
            // Em caso de erro, salvar localmente como fallback
            saveToStorage(STORAGE_KEYS.SIGNALS_DATA, updatedSignals);
          });
      } else {
        // Salvar no localStorage
        saveToStorage(STORAGE_KEYS.SIGNALS_DATA, updatedSignals);
      }
      
      // Feedback visual baseado no resultado
      if (result === 'win') {
        setNotification({
          open: true,
          message: '✅ WIN marcado! Lucro adicionado ao saldo.',
          severity: 'success'
        });
      } else if (result === 'loss') {
        setNotification({
          open: true,
          message: '❌ LOSS marcado. Valor descontado do saldo.',
          severity: 'error'
        });
      } else if (result === null) {
        setNotification({
          open: true,
          message: '🔄 Resultado removido.',
          severity: 'info'
        });
      }
      
      // Remover da lista de processamento
      processingRef.current.delete(`${id}_${result}`);
      
      return updatedSignals;
    });
  }, [isApiConnected, addTradingResult]);

  // Input completamente isolado que NUNCA reseta durante countdown
  const IsolatedInput = React.memo(({ 
    label, 
    value: initialValue, 
    signalId, 
    onSave, 
    onRealTimeChange, // Nova prop para atualização em tempo real
    disabled,
    startAdornment,
    endAdornment,
    placeholder,
    inputProps
  }) => {
    // Estados estáveis que só mudam quando necessário
    const [localValue, setLocalValue] = useState(() => initialValue || '');
    const isEditingRef = useRef(false);
    const hasUserInputRef = useRef(false);
    const initializedRef = useRef(false);
    const lastExternalValueRef = useRef(initialValue);

    // Inicialização controlada - só na primeira vez ou quando sinal muda
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
      
      // Notificar mudança em tempo real para ativar botões
      if (onRealTimeChange) {
        onRealTimeChange(signalId, newValue);
      }
    }, [signalId, onRealTimeChange]);

    const handleFocus = useCallback(() => {
      isEditingRef.current = true;
    }, []);

    const handleBlur = useCallback(() => {
      isEditingRef.current = false;
      lastExternalValueRef.current = localValue;
      onSave(signalId, localValue);
      // Não resetar hasUserInputRef para manter proteção
    }, [signalId, localValue, onSave]);

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
          type="number"
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
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
      prevProps.signalId === nextProps.signalId &&
      prevProps.disabled === nextProps.disabled &&
      prevProps.label === nextProps.label &&
      prevProps.placeholder === nextProps.placeholder &&
      prevProps.onSave === nextProps.onSave &&
      prevProps.onRealTimeChange === nextProps.onRealTimeChange
      // IMPORTANTE: NÃO comparar `value` para evitar re-renders durante countdown
    );
  });

  // Função para filtrar por data
  const filterSignalsByDate = useCallback((signals, filter) => {
    if (filter === 'all') return signals;
    
    const today = new Date();
    const todayStr = today.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return signals.filter(signal => {
      const signalDate = signal.createdDate || todayStr; // fallback para sinais antigos
      
      switch (filter) {
        case 'today':
          return signalDate === todayStr;
        case 'yesterday':
          return signalDate === yesterdayStr;
        case 'week':
          if (signal.createdAt) {
            const signalDateTime = new Date(signal.createdAt);
            return signalDateTime >= weekAgo;
          }
          return true; // incluir sinais antigos sem data
        default:
          return true;
      }
    });
  }, []);

  // Filtrar indicações por data e sempre 1M
  const filteredSignals = useMemo(() => {
    return filterSignalsByDate(signals, dateFilter);
  }, [signals, dateFilter, filterSignalsByDate]);

  // Estatísticas das recomendações (baseadas nos sinais filtrados)
  const signalStats = useMemo(() => {
    const total = filteredSignals.length;
    const active = filteredSignals.filter(s => s.resultado === null).length;
    const wins = filteredSignals.filter(s => s.resultado === 'WIN').length;
    const losses = filteredSignals.filter(s => s.resultado === 'LOSS').length;
    const finished = wins + losses;
    
    return {
      total,
      active,
      finished,
      wins,
      losses,
      winRate: finished > 0 ? (wins / finished * 100).toFixed(1) : 0
    };
  }, [filteredSignals]);

  // Componente do Card de Sinal completamente isolado do countdown
  const SignalCard = React.memo(({ signal }) => {
    // Estados locais para controlar ativação dos botões em tempo real
    const [currentEntryValue, setCurrentEntryValue] = useState(signal.valor || '');
    const [currentPayoutValue, setCurrentPayoutValue] = useState(signal.probabilidade || '');
    const [timeProgress, setTimeProgress] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState('');

    // Calcular progresso do tempo até a entrada
    useEffect(() => {
      const updateTimeProgress = () => {
        const now = new Date();
        const signalTime = new Date();
        const [hours, minutes, seconds] = signal.signalTime.split(':');
        signalTime.setHours(hours, minutes, seconds);
        
        const entryTime = new Date();
        const [entryHours, entryMinutes] = signal.time.split(':');
        entryTime.setHours(entryHours, entryMinutes, 0);
        
        const totalDuration = entryTime - signalTime;
        const elapsed = now - signalTime;
        const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
        
        setTimeProgress(progress);
        
        if (progress < 100) {
          const remaining = entryTime - now;
          if (remaining > 0) {
            const remainingMinutes = Math.floor(remaining / 60000);
            const remainingSeconds = Math.floor((remaining % 60000) / 1000);
            setTimeRemaining(`${remainingMinutes}m ${remainingSeconds}s`);
          } else {
            setTimeRemaining('Entrada liberada');
          }
        } else {
          setTimeRemaining('Entrada expirada');
        }
      };

      updateTimeProgress();
      const interval = setInterval(updateTimeProgress, 1000);
      return () => clearInterval(interval);
    }, [signal.signalTime, signal.time]);

    // Computar se os botões devem estar ativos quando ambos os campos tiverem números
    const buttonsEnabled = useMemo(() => {
      const entryValid = currentEntryValue && currentEntryValue.trim() !== '' && !isNaN(parseFloat(currentEntryValue));
      const payoutValid = currentPayoutValue && currentPayoutValue.trim() !== '' && !isNaN(parseFloat(currentPayoutValue));
      return entryValid && payoutValid && signal.resultado === null;
    }, [currentEntryValue, currentPayoutValue, signal.resultado]);

    // Calcular lucro/prejuízo potencial
    const potentialResult = useMemo(() => {
      const entry = parseFloat(currentEntryValue || 0);
      const payout = parseFloat(currentPayoutValue || 0);
      if (entry > 0 && payout > 0) {
        const profit = entry * (payout / 100);
        return {
          profit: profit.toFixed(2),
          loss: entry.toFixed(2)
        };
      }
      return null;
    }, [currentEntryValue, currentPayoutValue]);

    // Handlers para atualização em tempo real
    const handleEntryRealTimeChange = useCallback((signalId, value) => {
      setCurrentEntryValue(value);
    }, []);

    const handlePayoutRealTimeChange = useCallback((signalId, value) => {
      setCurrentPayoutValue(value);
    }, []);

    // Ref para controlar cliques duplos
    const lastClickRef = useRef(0);

    // Handlers para os botões - COM DEBOUNCE ANTI-DUPLO CLIQUE
    const handleWinClick = useCallback(() => {
      const now = Date.now();
      if (now - lastClickRef.current < 500) { // 500ms de debounce
        // console.log('🚫 Clique duplo bloqueado - WIN');
        return;
      }
      lastClickRef.current = now;
      
      // Permitir toggle: se já é WIN, volta para null, senão marca WIN
      const newResult = signal.resultado === 'WIN' ? null : 'WIN';
      markResult(signal.id, newResult);
    }, [signal.id, signal.resultado]);

    const handleLossClick = useCallback(() => {
      const now = Date.now();
      if (now - lastClickRef.current < 500) { // 500ms de debounce
        // console.log('🚫 Clique duplo bloqueado - LOSS');
        return;
      }
      lastClickRef.current = now;
      // Permitir toggle: se já é LOSS, volta para null, senão marca LOSS
      const newResult = signal.resultado === 'LOSS' ? null : 'LOSS';
      markResult(signal.id, newResult);
    }, [signal.id, signal.resultado]);

    // Função para preencher rapidamente valores comuns
    const handleQuickFill = useCallback((entryValue, payoutValue) => {
      setCurrentEntryValue(entryValue.toString());
      setCurrentPayoutValue(payoutValue.toString());
      updateEntryValue(signal.id, entryValue.toString());
      updatePayout(signal.id, payoutValue.toString());
    }, [signal.id]);

    // Sincronizar estados locais quando o sinal mudar externamente
    useEffect(() => {
      if (signal.valor !== currentEntryValue) {
        setCurrentEntryValue(signal.valor || '');
      }
      if (signal.probabilidade !== currentPayoutValue) {
        setCurrentPayoutValue(signal.probabilidade || '');
      }
    }, [signal.valor, signal.probabilidade, currentEntryValue, currentPayoutValue]);

    // Handler simplificado para prevenir seleção apenas quando necessário
    const preventSelection = (e) => {
      // Lista completa de elementos interativos
      const interactiveSelectors = [
        'input', 'button', 'a', 'select', 'textarea',
        '.MuiTextField-root', '.MuiButton-root', '.MuiInputBase-root',
        '.MuiInputBase-input', '.MuiOutlinedInput-input',
        '[role="button"]', '[contenteditable]', '[tabindex]'
      ];
      
      const isInteractive = 
        ['INPUT', 'BUTTON', 'A', 'SELECT', 'TEXTAREA'].includes(e.target.tagName) ||
        e.target.type === 'number' ||
        e.target.type === 'text' ||
        interactiveSelectors.some(selector => e.target.closest(selector));
      
      if (isInteractive) {
        e.stopPropagation(); // Parar propagação mas permitir o evento
        return;
      }
      
      e.preventDefault();
      return false;
    };

    return (
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 32px ${alpha(theme.palette.common.black, 0.15)}`,
        },
        ...(signal.resultado === 'WIN' && {
          border: `2px solid ${theme.palette.success.main}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.success.main, 0.25)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
            zIndex: 1,
          }
        }),
        ...(signal.resultado === 'LOSS' && {
          border: `2px solid ${theme.palette.error.main}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.error.main, 0.25)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.light})`,
            zIndex: 1,
          }
        }),
        ...(signal.resultado === null && timeProgress < 100 && {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: alpha(theme.palette.primary.main, 0.1),
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${timeProgress}%`,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            transition: 'width 1s ease-out',
            zIndex: 1,
          }
        }),
      }}
      onMouseDown={(e) => {
        if (!e.target.closest('[data-testid*="input"]') && 
            !e.target.closest('.MuiTextField-root') && 
            !e.target.closest('.MuiInputBase-root')) {
          preventSelection(e);
        }
      }}
      onSelectStart={(e) => {
        if (!e.target.closest('[data-testid*="input"]') && 
            !e.target.closest('.MuiTextField-root') && 
            !e.target.closest('.MuiInputBase-root')) {
          preventSelection(e);
        }
      }}
    >
      <CardContent sx={{ p: 3, pt: 4 }}>
        <Stack spacing={3}>
          {/* Header Principal */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2.5}>
              <Avatar
                sx={{
                  bgcolor: signal.direcao === 'CALL' 
                    ? alpha(theme.palette.success.main, 0.15) 
                    : alpha(theme.palette.error.main, 0.15),
                  color: signal.direcao === 'CALL' 
                    ? theme.palette.success.main 
                    : theme.palette.error.main,
                  width: 56,
                  height: 56,
                  userSelect: 'none',
                  boxShadow: `0 4px 12px ${alpha(
                    signal.direcao === 'CALL' ? theme.palette.success.main : theme.palette.error.main, 
                    0.3
                  )}`,
                }}
              >
                {signal.direcao === 'CALL' ? <TrendingUp sx={{ fontSize: 32 }} /> : <TrendingDown sx={{ fontSize: 32 }} />}
              </Avatar>
              
              <Box sx={{ userSelect: 'none' }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                  <Typography 
                    variant="h5" 
                    fontWeight="800"
                    sx={{ 
                      userSelect: 'none',
                      background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {signal.par}
                  </Typography>
                  <Chip 
                    label={signal.direcao === 'CALL' ? 'COMPRA' : 'VENDA'}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      height: 24,
                      userSelect: 'none',
                      backgroundColor: signal.direcao === 'CALL' 
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: signal.direcao === 'CALL' 
                          ? theme.palette.success.dark 
                          : theme.palette.error.dark,
                      },
                    }}
                  />
                </Stack>
                
                <Stack spacing={0.5}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ userSelect: 'none', fontWeight: 500 }}
                    >
                      {signal.createdDate || new Date().toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ userSelect: 'none', fontWeight: 500 }}
                    >
                      Sinal: {signal.signalTime}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: timeProgress < 100 ? 'success.main' : 'error.main',
                        animation: timeProgress < 100 ? 'pulse 2s infinite' : 'none',
                        '@keyframes pulse': {
                          '0%': { opacity: 1 },
                          '50%': { opacity: 0.5 },
                          '100%': { opacity: 1 },
                        },
                      }}
                    />
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <LocationOn sx={{ fontSize: 16, color: 'primary.main' }} />
                      <Typography 
                        variant="body2" 
                        color="primary.main"
                        sx={{ 
                          userSelect: 'none',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                        }}
                      >
                        Entrada: {signal.time}
                      </Typography>
                    </Stack>
                    {timeRemaining && (
                      <Chip
                        label={timeRemaining}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.6rem',
                          fontWeight: 600,
                          bgcolor: timeProgress < 100 ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                          color: timeProgress < 100 ? theme.palette.success.main : theme.palette.error.main,
                        }}
                      />
                    )}
                  </Stack>
                </Stack>
              </Box>
            </Stack>
            
            {/* Status e Informações */}
            <Stack spacing={1} alignItems="flex-end">
              {signal.isOTC && (
                <Chip 
                  label="OTC" 
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.15),
                    color: theme.palette.warning.main,
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                    userSelect: 'none',
                  }}
                />
              )}
                              <Chip 
                  icon={<GpsFixed sx={{ fontSize: 14 }} />}
                  label="1M"
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    userSelect: 'none',
                  }}
                />
            </Stack>
          </Stack>

          {/* Seção de Análise Financeira */}
          {potentialResult && (
            <Card
              sx={{
                bgcolor: alpha(theme.palette.info.main, 0.04),
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Projeção de Resultado
                    </Typography>
                    <Stack direction="row" spacing={2} mt={0.5}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                        <Typography variant="body2" color="success.main" fontWeight={700}>
                          +R$ {potentialResult.profit}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
                        <Typography variant="body2" color="error.main" fontWeight={700}>
                          -R$ {potentialResult.loss}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                  <Typography 
                    variant="h6" 
                    color="info.main" 
                    fontWeight={800}
                    sx={{ textAlign: 'right' }}
                  >
                    {parseFloat(currentPayoutValue || 0).toFixed(1)}%
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Ações Rápidas */}
          {signal.resultado === null && (
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                <Bolt sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Preenchimento Rápido
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} justifyContent="center">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleQuickFill(5, 80)}
                  sx={{
                    fontSize: '0.7rem',
                    px: 1,
                    py: 0.5,
                    minWidth: 'auto',
                    borderRadius: 1,
                  }}
                >
                  R$5 • 80%
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleQuickFill(10, 85)}
                  sx={{
                    fontSize: '0.7rem',
                    px: 1,
                    py: 0.5,
                    minWidth: 'auto',
                    borderRadius: 1,
                  }}
                >
                  R$10 • 85%
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleQuickFill(20, 90)}
                  sx={{
                    fontSize: '0.7rem',
                    px: 1,
                    py: 0.5,
                    minWidth: 'auto',
                    borderRadius: 1,
                  }}
                >
                  R$20 • 90%
                </Button>
              </Stack>
            </Stack>
          )}

          {/* Campos de Entrada Melhorados */}
          <Stack spacing={2.5}>
            <IsolatedInput
              label="Valor da Entrada"
              value={signal.valor}
              signalId={signal.id}
              onSave={updateEntryValue}
              onRealTimeChange={handleEntryRealTimeChange}
              disabled={signal.resultado !== null}
              placeholder="0.00"
              startAdornment={
                <InputAdornment position="start">
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    R$
                  </Typography>
                </InputAdornment>
              }
              inputProps={{
                min: 0,
                step: "0.01"
              }}
            />
            
            <IsolatedInput
              label="Payout (%)"
              value={signal.probabilidade}
              signalId={signal.id}
              onSave={updatePayout}
              onRealTimeChange={handlePayoutRealTimeChange}
              disabled={signal.resultado !== null}
              placeholder="0.00"
              endAdornment={
                <InputAdornment position="end">
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    %
                  </Typography>
                </InputAdornment>
              }
              inputProps={{
                min: 0,
                max: 1000,
                step: "0.01"
              }}
            />
          </Stack>

          {/* Botões de Resultado Aprimorados */}
          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant={signal.resultado === 'WIN' ? 'contained' : 'outlined'}
              color="success"
              size="large"
              onClick={handleWinClick}
              disabled={!buttonsEnabled}
              startIcon={signal.resultado === 'WIN' ? <CheckCircle /> : <Check />}
              sx={{
                py: 2,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1.1rem',
                userSelect: 'none',
                border: signal.resultado === 'WIN' ? 'none' : `2px solid ${theme.palette.success.main}`,
                background: signal.resultado === 'WIN' 
                  ? `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`
                  : 'transparent',
                boxShadow: signal.resultado === 'WIN' 
                  ? `0 8px 24px ${alpha(theme.palette.success.main, 0.4)}`
                  : 'none',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 32px ${alpha(theme.palette.success.main, 0.3)}`,
                  background: signal.resultado === 'WIN' 
                    ? `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`
                    : alpha(theme.palette.success.main, 0.08),
                },
                '&:disabled': {
                  opacity: 0.6,
                  transform: 'none',
                  boxShadow: 'none',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {signal.resultado === 'WIN' ? 'WIN!' : 'Win'}
            </Button>
            
            <Button
              fullWidth
              variant={signal.resultado === 'LOSS' ? 'contained' : 'outlined'}
              color="error"
              size="large"
              onClick={handleLossClick}
              disabled={!buttonsEnabled}
              startIcon={signal.resultado === 'LOSS' ? <Cancel /> : <Close />}
              sx={{
                py: 2,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1.1rem',
                userSelect: 'none',
                border: signal.resultado === 'LOSS' ? 'none' : `2px solid ${theme.palette.error.main}`,
                background: signal.resultado === 'LOSS' 
                  ? `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`
                  : 'transparent',
                boxShadow: signal.resultado === 'LOSS' 
                  ? `0 8px 24px ${alpha(theme.palette.error.main, 0.4)}`
                  : 'none',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 32px ${alpha(theme.palette.error.main, 0.3)}`,
                  background: signal.resultado === 'LOSS' 
                    ? `linear-gradient(135deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`
                    : alpha(theme.palette.error.main, 0.08),
                },
                '&:disabled': {
                  opacity: 0.6,
                  transform: 'none',
                  boxShadow: 'none',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {signal.resultado === 'LOSS' ? 'LOSS!' : 'Loss'}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
  }, (prevProps, nextProps) => {
    // MÁXIMA PROTEÇÃO: Só re-renderizar se propriedades essenciais mudaram
    // NÃO comparar entryValue e payout para evitar re-renders durante countdown
    return (
      prevProps.signal.id === nextProps.signal.id &&
      prevProps.signal.par === nextProps.signal.par &&
      prevProps.signal.direcao === nextProps.signal.direcao &&
      prevProps.signal.timeframe === nextProps.signal.timeframe &&
      prevProps.signal.time === nextProps.signal.time &&
      prevProps.signal.resultado === nextProps.signal.resultado &&
      prevProps.signal.isOTC === nextProps.signal.isOTC &&
      prevProps.signal.createdDate === nextProps.signal.createdDate
      // IMPORTANTE: NÃO comparar entryValue e payout - gerenciados localmente
    );
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
        <Box>
          <Typography 
              {...TITLE_STYLES.pageTitle}
            sx={{ 
                ...TITLE_STYLES.pageTitle.sx,
                userSelect: 'none',
            }}
          >
            Recomendações
          </Typography>
          <Typography 
              {...TITLE_STYLES.pageSubtitle}
              sx={{ 
                ...TITLE_STYLES.pageSubtitle.sx,
                maxWidth: 800,
                userSelect: 'none',
                mb: 1,
              }}
            >
              Acompanhe as recomendações forex em tempo real e registre seus resultados
          </Typography>
          
          {/* Informação sobre timeframe */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Chip 
              icon={<AccessTime />}
              label="Todas as recomendações são para operações de 1 MINUTO"
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
                fontWeight: 600,
                fontSize: '0.75rem',
                userSelect: 'none',
                border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
              }}
            />
          </Stack>
        </Box>

          {/* Saldo Display */}
          <BalanceDisplay 
            variant="card" 
            size="small" 
            showDetails={true}
            showEditButton={true}
          />
        </Stack>

        {/* Actions Bar */}
        <Card
          sx={{
            borderRadius: 4,
            border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          }}
        >
          <CardContent sx={{ p: 3 }}>
                          <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
                  onClick={addNewSignals}
                  disabled={isGenerating || isClearing}
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    minWidth: 140,
                  }}
                >
                  {isGenerating ? 'Gerando...' : 'Nova Recomendação'}
                </Button>
                
                {signals.length > 0 && (
                  <>
                    <Button
                      variant="outlined"
                      size="medium"
                      startIcon={isClearing ? <CircularProgress size={18} color="inherit" /> : <DeleteSweep />}
                      onClick={clearOldSignals}
                      disabled={isGenerating || isClearing}
                      sx={{ 
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        color: 'warning.main',
                        borderColor: 'warning.main',
                        '&:hover': {
                          borderColor: 'warning.dark',
                          bgcolor: alpha(theme.palette.warning.main, 0.04),
                        },
                      }}
                    >
                      {isClearing ? 'Limpando...' : 'Limpar Finalizadas'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="medium"
                      startIcon={isClearing ? <CircularProgress size={18} color="inherit" /> : <Clear />}
                      onClick={clearAllSignals}
                      disabled={isGenerating || isClearing}
                      sx={{ 
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        color: 'error.main',
                        borderColor: 'error.main',
                        '&:hover': {
                          borderColor: 'error.dark',
                          bgcolor: alpha(theme.palette.error.main, 0.04),
                        },
                      }}
                    >
                      {isClearing ? 'Limpando...' : 'Limpar Todas'}
                    </Button>
                  </>
                )}
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                {/* Filtros de Data */}
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Chip 
                    label="Todos"
                    size="small"
                    variant={dateFilter === 'all' ? 'filled' : 'outlined'}
                    color={dateFilter === 'all' ? 'primary' : 'default'}
                    onClick={() => setDateFilter('all')}
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) }
                    }}
                  />
                  <Chip 
                    label="Hoje"
                    size="small"
                    variant={dateFilter === 'today' ? 'filled' : 'outlined'}
                    color={dateFilter === 'today' ? 'primary' : 'default'}
                    onClick={() => setDateFilter('today')}
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) }
                    }}
                  />
                  <Chip 
                    label="Ontem"
                    size="small"
                    variant={dateFilter === 'yesterday' ? 'filled' : 'outlined'}
                    color={dateFilter === 'yesterday' ? 'primary' : 'default'}
                    onClick={() => setDateFilter('yesterday')}
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) }
                    }}
                  />
                  <Chip 
                    label="7 dias"
                    size="small"
                    variant={dateFilter === 'week' ? 'filled' : 'outlined'}
                    color={dateFilter === 'week' ? 'primary' : 'default'}
                    onClick={() => setDateFilter('week')}
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.08) }
                    }}
                  />
                </Stack>
                
                {/* Divisor */}
                <Box sx={{ width: 1, height: 20, bgcolor: 'divider' }} />
                
                {/* Estatísticas */}
                <Chip 
                  icon={<Timeline />}
                  label={`${signalStats.total} Total`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                />
                
                {signalStats.active > 0 && (
                  <Chip 
                    label={`${signalStats.active} Ativa${signalStats.active > 1 ? 's' : ''}`}
                    color="info"
                    size="small"
                    sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                  />
                )}
                
                {signalStats.finished > 0 && (
                  <>
                    <Chip 
                      label={`${signalStats.wins}W/${signalStats.losses}L`}
                      color={signalStats.wins > signalStats.losses ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                    />
                    <Chip 
                      label={`${signalStats.winRate}%`}
                      color={parseFloat(signalStats.winRate) >= 60 ? 'success' : parseFloat(signalStats.winRate) >= 40 ? 'warning' : 'error'}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                    />
                  </>
                )}
                
                {/* Divisor */}
                <Box sx={{ width: 1, height: 20, bgcolor: 'divider' }} />
                
                {/* Status da API */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip 
                    icon={isApiConnected ? <CloudDone /> : <Cloud />}
                    label={isApiConnected ? 'Banco' : 'Local'}
                    size="small"
                    color={isApiConnected ? 'success' : 'default'}
                    variant={isApiConnected ? 'filled' : 'outlined'}
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      userSelect: 'none',
                    }}
                  />
                  
                  {/* Botão de migração */}
                  {isApiConnected && migrationStatus !== 'completed' && (
                    <Button
                      size="small"
                      variant="text"
                      startIcon={migrationStatus === 'migrating' ? <CircularProgress size={12} /> : <CloudSync />}
                      onClick={migrateToDatabase}
                      disabled={migrationStatus === 'migrating'}
                      sx={{ 
                        textTransform: 'none',
                        fontSize: '0.65rem',
                        px: 1,
                        py: 0.25,
                        minHeight: 'auto',
                        color: 'primary.main',
                      }}
                    >
                      {migrationStatus === 'migrating' ? 'Migrando...' : 'Migrar'}
                    </Button>
                  )}
                </Stack>
                
                {/* Divisor */}
                <Box sx={{ width: 1, height: 20, bgcolor: 'divider' }} />
                
                {/* Status */}
                <Chip 
                  label={isOTCTime() ? 'Horário OTC' : 'Mercado Aberto'}
                  color={isOTCTime() ? 'warning' : 'success'}
                  size="small"
                  sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                />

                <Chip 
                  icon={<GpsFixed />}
                  label="1M"
                  size="small"
                  sx={{
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                  }}
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Recomendações Grid */}
              <Grid container spacing={3}>
                {filteredSignals.length === 0 ? (
                          <Grid size={12}>
              <Card sx={{ 
                borderRadius: 4, 
                py: 8,
                border: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
                boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
              }}>
                <CardContent>
                      <Stack spacing={2} alignItems="center">
                        <Timeline sx={{ fontSize: 64, color: 'text.disabled' }} />
                        <Typography variant="h6" color="text.secondary">
                          {dateFilter === 'all' 
                            ? 'Nenhuma recomendação disponível'
                            : `Nenhuma recomendação encontrada para ${
                                dateFilter === 'today' ? 'hoje' : 
                                dateFilter === 'yesterday' ? 'ontem' : 
                                dateFilter === 'week' ? 'os últimos 7 dias' : 
                                'este período'
                              }`
                          }
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {dateFilter === 'all' 
                            ? 'Clique em "Nova Recomendação" para gerar uma nova recomendação'
                            : 'Tente selecionar outro período ou gere uma nova recomendação'
                          }
                        </Typography>
                      </Stack>
                </CardContent>
              </Card>
            </Grid>
                ) : (
                  filteredSignals.map((signal) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={signal.id}>
                <SignalCard signal={signal} />
              </Grid>
            ))
          )}
        </Grid>
      </Stack>

      {/* Sistema de Notificação */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{
            minWidth: 300,
            fontWeight: 600,
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Indicacoes;
