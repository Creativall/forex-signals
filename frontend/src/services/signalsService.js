import { apiCall, API_BASE_URL } from '../config/api';

// Função para obter o token do usuário (simulado por enquanto)
const getAuthToken = () => {
  // Por enquanto retorna um token simulado
  // TODO: Implementar autenticação real
  return 'bearer_token_placeholder';
};

// Headers padrão para requisições
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

// =====================================================
// CRIAR NOVO SINAL
// =====================================================
export const createSignal = async (signalData) => {
  try {
    const response = await apiCall('/signals', {
      method: 'POST',
      body: JSON.stringify({
        pair: signalData.par,
        direction: signalData.direcao,
        timeframe: signalData.timeframe,
        entry_time: signalData.entrada,
        expiration_time: signalData.expiracao,
        amount: signalData.valor ? parseFloat(signalData.valor) : null,
        probability: signalData.probabilidade ? parseInt(signalData.probabilidade) : null,
        result: signalData.resultado || 'PENDING'
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.signal
    };
  } catch (error) {
    console.error('❌ Erro ao criar sinal:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// =====================================================
// LISTAR SINAIS
// =====================================================
export const getSignals = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    if (filters.result) params.append('result', filters.result);
    if (filters.pair) params.append('pair', filters.pair);
    if (filters.order) params.append('order', filters.order);
    if (filters.direction) params.append('direction', filters.direction);

    const response = await apiCall(`/signals?${params}`);

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.signals || [],
      total: result.total || 0
    };
  } catch (error) {
    console.error('❌ Erro ao buscar sinais:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

// =====================================================
// ATUALIZAR SINAL
// =====================================================
export const updateSignal = async (signalId, updateData) => {
  try {
    const response = await apiCall(`/signals/${signalId}`, {
      method: 'PUT',
      body: JSON.stringify({
        pair: updateData.par,
        direction: updateData.direcao,
        timeframe: updateData.timeframe,
        entry_time: updateData.entrada,
        expiration_time: updateData.expiracao,
        amount: updateData.valor ? parseFloat(updateData.valor) : null,
        probability: updateData.probabilidade ? parseInt(updateData.probabilidade) : null,
        result: updateData.resultado,
        profit_loss: updateData.lucro ? parseFloat(updateData.lucro) : null
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.signal
    };
  } catch (error) {
    console.error('❌ Erro ao atualizar sinal:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// =====================================================
// DELETAR SINAL
// =====================================================
export const deleteSignal = async (signalId) => {
  try {
    const response = await apiCall(`/signals/${signalId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    return {
      success: true,
      message: 'Sinal deletado com sucesso'
    };
  } catch (error) {
    console.error('❌ Erro ao deletar sinal:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// =====================================================
// OBTER ESTATÍSTICAS
// =====================================================
export const getStats = async () => {
  try {
    const response = await apiCall('/signals/stats/summary');

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.stats
    };
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    return {
      success: false,
      error: error.message,
      data: {
        total: 0,
        pending: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        totalProfit: 0
      }
    };
  }
};

// =====================================================
// FUNÇÃO PARA CONVERTER DADOS DO BACKEND PARA FRONTEND
// =====================================================
export const convertSignalFromAPI = (apiSignal) => {
  return {
    id: apiSignal.id,
    par: apiSignal.pair,
    direcao: apiSignal.direction,
    timeframe: apiSignal.timeframe,
    entrada: apiSignal.entry_time,
    expiracao: apiSignal.expiration_time,
    valor: apiSignal.amount,
    probabilidade: apiSignal.probability,
    resultado: apiSignal.result,
    lucro: apiSignal.profit_loss,
    createdAt: apiSignal.created_at,
    createdDate: new Date(apiSignal.created_at).toLocaleDateString('pt-BR'),
    signalTime: new Date(apiSignal.created_at).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    }),
    time: new Date(apiSignal.entry_time).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit'
    }),
    isOTC: false // TODO: Calcular com base no horário
  };
};

// =====================================================
// FUNÇÃO PARA MIGRAR DADOS DO LOCALSTORAGE PARA API
// =====================================================
export const migrateLocalStorageData = async () => {
  try {
    const localData = localStorage.getItem('indicacoes_data');
    if (!localData) return { success: true, migrated: 0 };

    const signals = JSON.parse(localData);
    let migrated = 0;

    for (const signal of signals) {
      const result = await createSignal(signal);
      if (result.success) {
        migrated++;
      }
    }

    // Backup dos dados locais antes de limpar
    localStorage.setItem('indicacoes_data_backup', localData);
    localStorage.removeItem('indicacoes_data');

    return {
      success: true,
      migrated,
      message: `${migrated} sinais migrados para o banco de dados`
    };
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 