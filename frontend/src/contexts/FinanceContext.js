import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const FinanceContext = createContext();

// Chaves para localStorage
const STORAGE_KEYS = {
  BALANCE: 'forex_signals_balance',
  TRANSACTIONS: 'forex_signals_transactions',
  INITIAL_BALANCE: 'forex_signals_initial_balance'
};

export const FinanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(1000); // Saldo inicial padrão
  const [transactions, setTransactions] = useState([]);
  const [initialBalance] = useState(1000);
  
  // Ref para controlar transações em processamento e evitar duplicação
  const processingTransactionsRef = useRef(new Set());

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    try {
      const savedBalance = localStorage.getItem(STORAGE_KEYS.BALANCE);
      const savedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      
      if (savedBalance) {
        setBalance(parseFloat(savedBalance));
      }
      
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    }
  }, []);

  // Salvar no localStorage quando os dados mudarem
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BALANCE, balance.toString());
    } catch (error) {
      console.error('Erro ao salvar saldo:', error);
    }
  }, [balance]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error('Erro ao salvar transações:', error);
    }
  }, [transactions]);

  // NOVA: Função para atualizar saldo manualmente
  const updateBalance = (newBalance) => {
    try {
      if (typeof newBalance !== 'number' || isNaN(newBalance) || newBalance < 0) {
        console.error('Valor de saldo inválido:', newBalance);
        return false;
      }
      
      setBalance(newBalance);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      return false;
    }
  };

  // CORRIGIDA: Função para adicionar resultado de trading (win/loss) - ANTI-DUPLICAÇÃO TOTAL
  const addTradingResult = useCallback((signal, result) => {
    // Verificar se já está sendo processado
    const transactionKey = `${signal.id}_${result}`;
    if (processingTransactionsRef.current.has(transactionKey)) {
      // console.log('⚠️ TRANSAÇÃO JÁ EM PROCESSAMENTO - BLOQUEADA:', { transactionKey });
      return;
    }

    // Marcar como processando
    processingTransactionsRef.current.add(transactionKey);

    try {
      // Validação de parâmetros
      if (!signal || !signal.id || !result) {
        console.error('❌ Parâmetros inválidos para addTradingResult:', { signal, result });
        return;
      }

      // Extrair valores
      const entryValue = parseFloat(signal.valor);
      const payoutPercent = parseFloat(signal.probabilidade);

      // Validação de valores numéricos
      if (isNaN(entryValue) || isNaN(payoutPercent) || entryValue <= 0 || payoutPercent <= 0) {
        console.error('❌ Valores numéricos inválidos:', { entryValue, payoutPercent });
        return;
      }

      // Processar resultado
      let amount = 0;
      let type = '';
      let description = '';

      if (result === 'win') {
        // WIN: Receber lucro baseado no payout
        amount = entryValue * (payoutPercent / 100);
        type = 'gain';
        description = `WIN - ${signal.par || 'Par'} - Lucro de ${payoutPercent}%`;
      } else if (result === 'loss') {
        // LOSS: Perder valor de entrada
        amount = -entryValue;
        type = 'loss';
        description = `LOSS - ${signal.par || 'Par'} - Perda total`;
      } else {
        console.error('❌ Resultado inválido:', result);
        return;
      }

      // Criar transação única baseada no ID do sinal
      const transactionId = `signal_${signal.id}_${Date.now()}`;
      const transaction = {
        id: transactionId,
        signalId: signal.id,
        amount,
        type,
        description,
        timestamp: new Date().toISOString(),
        par: signal.par,
        direction: signal.direcao,
        entryValue,
        payoutPercent,
        result
      };

      setTransactions(prev => {
        // Verificar se já existe uma transação para este sinal
        const existingIndex = prev.findIndex(t => t.signalId === signal.id);
        let updatedTransactions;

        if (existingIndex !== -1) {
          // Substituir transação existente
          updatedTransactions = [...prev];
          updatedTransactions[existingIndex] = transaction;
        } else {
          // Adicionar nova transação
          updatedTransactions = [transaction, ...prev];
        }

        // console.log('💳 Criando transação:', {
        //   signalId: signal.id,
        //   amount,
        //   type,
        //   result
        // });

        // console.log('📊 Estado atual de transações:', {
        //   total: prev.length,
        //   paraEsteSignal: existingIndex !== -1 ? 1 : 0
        // });

        // console.log('📊 Estado atualizado de transações:', {
        //   total: updatedTransactions.length,
        //   ultimaTransacao: transaction
        // });

        return updatedTransactions;
      });

      // Atualizar saldo
      setBalance(prevBalance => {
        const newBalance = prevBalance + amount;
        
        // console.log('💰 Atualizando saldo:', {
        //   anterior: prevBalance.toFixed(2),
        //   transacao: amount.toFixed(2),
        //   novo: newBalance.toFixed(2)
        // });

        return newBalance;
      });

      // Retornar dados da transação para feedback
      // console.log('✅ addTradingResult FINALIZADO com sucesso:', {
      //   signalId: signal.id,
      //   transactionId,
      //   amount: amount.toFixed(2),
      //   type,
      //   result
      // });

      return transaction;

    } catch (error) {
      console.error('❌ Erro ao adicionar resultado de trading:', error);
    } finally {
      // Remover da lista de processamento
      processingTransactionsRef.current.delete(transactionKey);
    }
  }, []);

  // Função para adicionar transação manual
  const addTransaction = (transactionData) => {
    const transaction = {
      id: Date.now() + Math.random(),
      ...transactionData,
      date: transactionData.date || new Date().toISOString()
    };

    const amount = transactionData.type === 'income' 
      ? Math.abs(transactionData.amount)
      : -Math.abs(transactionData.amount);

    transaction.amount = amount;

    setTransactions(prev => [transaction, ...prev]);
    setBalance(prev => prev + amount);

    return transaction;
  };

  // Função para atualizar transação
  const updateTransaction = (id, updatedData) => {
    setTransactions(prev => {
      const oldTransactions = [...prev];
      const transactionIndex = oldTransactions.findIndex(t => t.id === id);
      
      if (transactionIndex === -1) return prev;

      const oldTransaction = oldTransactions[transactionIndex];
      const newAmount = updatedData.type === 'income'
        ? Math.abs(updatedData.amount)
        : -Math.abs(updatedData.amount);

      const amountDifference = newAmount - oldTransaction.amount;

      oldTransactions[transactionIndex] = {
        ...oldTransaction,
        ...updatedData,
        amount: newAmount
      };

      setBalance(prev => prev + amountDifference);

      return oldTransactions;
    });
  };

  // Função para deletar transação
  const deleteTransaction = (id) => {
    setTransactions(prev => {
      const transaction = prev.find(t => t.id === id);
      if (transaction) {
        setBalance(current => current - transaction.amount);
      }
      return prev.filter(t => t.id !== id);
    });
  };

  // CORRIGIDA: Função para obter estatísticas
  const getStats = () => {
    const income = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const incomeCount = transactions.filter(t => t.amount > 0).length;
    const expenseCount = transactions.filter(t => t.amount < 0).length;

    // Calcular lucro líquido
    const netProfit = income - expenses;
    
    // Total de transações
    const totalTransactions = transactions.length;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netIncome: income - expenses,
      netProfit: netProfit, // ADICIONADO
      totalTransactions: totalTransactions, // ADICIONADO
      incomeCount,
      expenseCount,
      balance: balance
    };
  };

  // Função para formatar moeda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const value = {
    balance,
    transactions,
    initialBalance,
    addTradingResult,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateBalance, // ADICIONADO
    getStats,
    formatCurrency
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider');
  }
  return context;
}; 