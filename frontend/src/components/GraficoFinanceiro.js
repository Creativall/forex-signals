import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GraficoFinanceiro = ({ transactions }) => {
  const [selectedLines, setSelectedLines] = useState({
    total: true,
    ganhos: true,
    perdas: true
  });

  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Ordenar transações por data
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Agrupar transações por data
    const groupedByDate = sortedTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.timestamp).toLocaleDateString('pt-BR');
      if (!acc[date]) {
        acc[date] = { ganhos: 0, perdas: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[date].ganhos += transaction.amount;
      } else {
        acc[date].perdas += transaction.amount;
      }
      
      return acc;
    }, {});

    const labels = Object.keys(groupedByDate);
    const ganhosData = labels.map(date => groupedByDate[date].ganhos);
    const perdasData = labels.map(date => groupedByDate[date].perdas);

    // Calcular dados acumulados
    let totalAcumulado = 0;
    const totalData = labels.map((date, index) => {
      const ganho = ganhosData[index];
      const perda = perdasData[index];
      totalAcumulado += ganho - perda;
      return totalAcumulado;
    });

    // Calcular ganhos acumulados
    let ganhosAcumulados = 0;
    const ganhosAcumuladosData = ganhosData.map(ganho => {
      ganhosAcumulados += ganho;
      return ganhosAcumulados;
    });

    // Calcular perdas acumuladas
    let perdasAcumuladas = 0;
    const perdasAcumuladasData = perdasData.map(perda => {
      perdasAcumuladas += perda;
      return perdasAcumuladas;
    });

    const datasets = [];

    if (selectedLines.total) {
      datasets.push({
        label: 'Saldo Total',
        data: totalData,
        borderColor: 'rgb(255, 215, 0)',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(255, 215, 0)',
        pointBorderColor: '#000',
        pointBorderWidth: 2
      });
    }

    if (selectedLines.ganhos) {
      datasets.push({
        label: 'Ganhos Acumulados',
        data: ganhosAcumuladosData,
        borderColor: 'rgb(0, 212, 170)',
        backgroundColor: 'rgba(0, 212, 170, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(0, 212, 170)',
        pointBorderColor: '#000',
        pointBorderWidth: 1
      });
    }

    if (selectedLines.perdas) {
      datasets.push({
        label: 'Perdas Acumuladas',
        data: perdasAcumuladasData,
        borderColor: 'rgb(255, 107, 107)',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(255, 107, 107)',
        pointBorderColor: '#000',
        pointBorderWidth: 1
      });
    }

    return {
      labels,
      datasets
    };
  }, [transactions, selectedLines]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
            weight: '600'
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Evolução Financeira',
        color: '#ffffff',
        font: {
          size: 16,
          weight: '700'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 215, 0, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: R$ ${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Data',
          color: '#ffffff',
          font: {
            size: 12,
            weight: '600'
          }
        },
        ticks: {
          color: '#b3b3b3',
          maxRotation: 45
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Valor (R$)',
          color: '#ffffff',
          font: {
            size: 12,
            weight: '600'
          }
        },
        ticks: {
          color: '#b3b3b3',
          callback: function(value) {
            return `R$ ${value.toFixed(2)}`;
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        hoverBorderWidth: 3
      }
    }
  };

  const handleLineToggle = (line) => {
    setSelectedLines(prev => ({
      ...prev,
      [line]: !prev[line]
    }));
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="grafico-container">
        <div className="grafico-header">
          <h3 className="grafico-title">📊 Gráfico Financeiro</h3>
          <p className="grafico-subtitle">Visualize a evolução dos seus ganhos e perdas</p>
        </div>
        <div className="grafico-empty">
          <div className="empty-icon">📈</div>
          <h4>Nenhum dado para exibir</h4>
          <p>Adicione transações para ver o gráfico de evolução financeira</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grafico-container">
      <div className="grafico-header">
        <div className="grafico-title-section">
          <h3 className="grafico-title">📊 Gráfico Financeiro</h3>
          <p className="grafico-subtitle">Evolução dos ganhos e perdas ao longo do tempo</p>
        </div>
        
        <div className="grafico-controls">
          <div className="line-toggles">
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={selectedLines.total}
                onChange={() => handleLineToggle('total')}
              />
              <span className="toggle-label total">Saldo Total</span>
            </label>
            
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={selectedLines.ganhos}
                onChange={() => handleLineToggle('ganhos')}
              />
              <span className="toggle-label ganhos">Ganhos</span>
            </label>
            
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={selectedLines.perdas}
                onChange={() => handleLineToggle('perdas')}
              />
              <span className="toggle-label perdas">Perdas</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grafico-content">
        <div className="chart-wrapper">
          <Line data={chartData} options={options} />
        </div>
      </div>

      <div className="grafico-stats">
        <div className="stat-item">
          <span className="stat-label">Total de Transações:</span>
          <span className="stat-value">{transactions.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Período:</span>
          <span className="stat-value">
            {transactions.length > 0 ? 
              `${new Date(transactions[transactions.length - 1].timestamp).toLocaleDateString('pt-BR')} - ${new Date(transactions[0].timestamp).toLocaleDateString('pt-BR')}` : 
              'N/A'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default GraficoFinanceiro; 