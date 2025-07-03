import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import DashboardLayout from './Dashboard/DashboardLayout';
import OverviewPage from './Dashboard/OverviewPage';
import Indicacoes from './Indicacoes';
import Protecao from './Protecao';
import GestaoFinanceira from './GestaoFinanceira';
import GrupoTelegram from './GrupoTelegram';
import CorretoraAfiliado from './CorretoraAfiliado';
import InstitucionalAulas from './InstitucionalAulas';
import Settings from './Settings';

const Dashboard = ({ user, onLogout }) => {
  // Estados centralizados
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Novo Sinal EUR/USD',
      message: 'Sinal de COMPRA para EUR/USD identificado com 85% de probabilidade',
      time: 'Há 5 minutos',
      read: false,
      severity: 'success',
    },
    {
      id: 2,
      title: 'Meta de Lucro Atingida',
      message: 'Parabéns! Você atingiu sua meta mensal de lucro',
      time: 'Há 1 hora',
      read: false,
      severity: 'success',
    },
    {
      id: 3,
      title: 'Atualização da Plataforma',
      message: 'Nova versão disponível com melhorias de performance',
      time: 'Há 2 horas',
      read: true,
      severity: 'info',
    },
  ]);

  // Simular dados financeiros
  const [financialData, setFinancialData] = useState({
    balance: 2750.00,
    transactions: [
      {
        id: 1,
        type: 'income',
        amount: 150.00,
        description: 'Lucro EUR/USD',
        date: new Date().toISOString(),
        status: 'completed'
      },
      {
        id: 2,
        type: 'income',
        amount: 85.50,
        description: 'Lucro GBP/JPY',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed'
      },
      {
        id: 3,
        type: 'expense',
        amount: 25.00,
        description: 'Taxa de spread',
        date: new Date(Date.now() - 172800000).toISOString(),
        status: 'completed'
      }
    ],
    signals: [
      {
        id: 1,
        pair: 'EUR/USD',
        direction: 'BUY',
        entry: 1.0850,
        target: 1.0900,
        stop: 1.0800,
        status: 'active',
        result: null,
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        pair: 'GBP/JPY',
        direction: 'SELL',
        entry: 185.50,
        target: 184.00,
        stop: 187.00,
        status: 'completed',
        result: 'win',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Função para mostrar notificação
  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
    
    // Adicionar às notificações persistentes
    const newNotification = {
      id: Date.now(),
      message,
      severity,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
  };

  // Função para marcar notificações como lidas
  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Função para adicionar transação
  const addTransaction = (transaction) => {
    const transactionAmount = parseFloat(transaction.amount) || 0;
    
    // Validação de valor
    if (isNaN(transactionAmount)) {
      // console.error('Valor da transação inválido:', transaction.amount);
      return;
    }
    
    setFinancialData(prev => ({
      ...prev,
      transactions: [transaction, ...prev.transactions]
    }));
    
    setFinancialData(prev => ({
      ...prev,
      balance: prev.balance + (transaction.type === 'income' ? transactionAmount : -transactionAmount)
    }));
    
    const message = transaction.type === 'income' 
      ? `💰 Lucro de R$ ${transactionAmount.toFixed(2)} adicionado!`
      : `💸 Perda de R$ ${transactionAmount.toFixed(2)} registrada`;
    
    showNotification(message, transaction.type === 'income' ? 'success' : 'warning');
  };

  // Função para remover transação
  const deleteTransaction = (id) => {
    const transaction = financialData.transactions.find(t => t.id === id);
    if (!transaction) return;
    
    setFinancialData(prev => ({
      ...prev,
      balance: prev.balance - (transaction.type === 'income' ? transaction.amount : -transaction.amount),
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
    showNotification('Transação removida', 'info');
  };

  // Função para atualizar saldo manualmente
  const setManualBalance = (newBalance) => {
    const oldBalance = financialData.balance;
    setFinancialData(prev => ({
      ...prev,
      balance: newBalance
    }));
    const diff = newBalance - oldBalance;
    showNotification(
      `Saldo atualizado: ${diff >= 0 ? '+' : ''}R$ ${diff.toFixed(2)}`, 
      diff >= 0 ? 'success' : 'warning'
    );
  };

  // Funções para gerenciar indicações
  const addSignal = (signal) => {
    setFinancialData(prev => ({
      ...prev,
      signals: [signal, ...prev.signals]
    }));
    showNotification(`📊 Novo sinal ${signal.direction} para ${signal.pair}`, 'info');
  };

  const updateSignal = (signalId, updates) => {
    setFinancialData(prev => ({
      ...prev,
      signals: prev.signals.map(signal => 
        signal.id === signalId ? { ...signal, ...updates } : signal
      )
    }));
    
    if (updates.result) {
      const resultEmoji = updates.result === 'win' ? '🎉' : '😞';
      const resultText = updates.result === 'win' ? 'ganhou' : 'perdeu';
      showNotification(`${resultEmoji} Sinal ${resultText}!`, updates.result === 'win' ? 'success' : 'error');
    }
  };

  const updateSignalInputs = (signalId, field, value) => {
    setFinancialData(prev => ({
      ...prev,
      signals: prev.signals.map(signal => 
        signal.id === signalId ? {
          ...signal,
          [field]: value
        } : signal
      )
    }));
  };

  const clearSignalInputs = (signalId) => {
    setFinancialData(prev => ({
      ...prev,
      signals: prev.signals.map(signal => 
        signal.id === signalId ? {
          ...signal,
          entry: null,
          target: null,
          stop: null,
          status: 'inactive',
          result: null
        } : signal
      )
    }));
  };

  const clearAllSignals = () => {
    setFinancialData(prev => ({
      ...prev,
      signals: []
    }));
    setFinancialData(prev => ({
      ...prev,
      signals: []
    }));
    showNotification('Todas as indicações foram limpas', 'info');
  };

  // Função para navegar entre páginas
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  // Função para fechar snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Renderizar conteúdo baseado na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewPage 
            user={user}
            onTabChange={handleTabChange}
            balance={financialData.balance}
            transactions={financialData.transactions}
            signals={financialData.signals}
          />
        );
      case 'signals':
        return (
          <Indicacoes
            balance={financialData.balance}
            addTransaction={addTransaction}
            signals={financialData.signals}
            addSignal={addSignal}
            updateSignal={updateSignal}
            updateSignalInputs={updateSignalInputs}
            clearSignalInputs={clearSignalInputs}
            clearAllSignals={clearAllSignals}
          />
        );
      case 'martingale':
        return <Protecao />;
      case 'finance':
        return (
          <GestaoFinanceira
            initialBalance={financialData.balance}
            initialTransactions={financialData.transactions}
            onDataChange={(newData) => {
              setFinancialData(prev => ({
                ...prev,
                ...newData
              }));
            }}
          />
        );
      case 'telegram':
        return <GrupoTelegram />;
      case 'corretora':
        return <CorretoraAfiliado />;
      case 'institucional':
        return <InstitucionalAulas />;
      case 'settings':
        return <Settings user={user} />;
      default:
        return (
          <OverviewPage 
            user={user}
            onTabChange={handleTabChange}
            balance={financialData.balance}
            transactions={financialData.transactions}
            signals={financialData.signals}
          />
        );
    }
  };

  return (
    <>
      <DashboardLayout
        user={user}
        onLogout={onLogout}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        notifications={notifications}
        onMarkNotificationsRead={markNotificationsAsRead}
      >
        {renderContent()}
      </DashboardLayout>

      {/* Snackbar para notificações */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard; 