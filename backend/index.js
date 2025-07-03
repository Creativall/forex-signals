require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Importar configuração do banco
const { testConnection, initializeDatabase } = require('./database');

const app = express();

// Configuração de trust proxy baseada no ambiente
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  // Em produção, confiar apenas no primeiro proxy (load balancer/CDN)
  app.set('trust proxy', 1);
} else {
  // Em desenvolvimento, não confiar em proxies
  app.set('trust proxy', false);
}

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting configurado por ambiente
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limite de requests por IP
  message: {
    error: 'Muitas tentativas. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Configuração segura de trust proxy por ambiente
  trustProxy: isProduction ? 1 : false, // Em produção: apenas 1 proxy confiável, dev: false
  // Skip requests que não precisam de rate limiting (health checks)
  skip: (req) => {
    // Pular rate limiting para health checks e rotas de sistema
    return req.path === '/api/health' || req.path === '/api';
  }
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de monitoramento de proxy para detecção de bypass
app.use('/api/', (req, res, next) => {
  const forwardedFor = req.get('X-Forwarded-For');
  const realIp = req.get('X-Real-IP');
  const clientIp = req.ip;
  
  // Log suspeito: múltiplos IPs em desenvolvimento
  if (!isProduction && forwardedFor && forwardedFor.includes(',')) {
    console.warn('⚠️ Múltiplos IPs detectados em desenvolvimento:', {
      'X-Forwarded-For': forwardedFor,
      'X-Real-IP': realIp,
      'req.ip': clientIp,
      'User-Agent': req.get('User-Agent'),
      path: req.path
    });
  }
  
  next();
});

// Rotas de autenticação
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Rotas de sinais forex
const signalsRouter = require('./routes/signals');
app.use('/api/signals', signalsRouter);

// Rota de status da API
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API Indicações Forex funcionando!',
    database: 'PostgreSQL',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Rota de health check
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await testConnection();
    
    res.json({
      status: 'ok',
      database: dbStatus ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('❌ Erro não tratado:', error);
  
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'JSON inválido no corpo da requisição'
    });
  }
  
  res.status(500).json({
    error: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Função para inicializar o servidor
const startServer = async () => {
  try {
    console.log('🚀 Iniciando servidor...');
    
    // Testar conexão com banco de dados
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Falha ao conectar com o banco de dados');
      process.exit(1);
    }
    
    // Inicializar banco de dados
    await initializeDatabase();
    
    // Iniciar servidor
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🌟 Servidor rodando na porta ${PORT}`);
      console.log(`🔗 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️ Banco de dados: PostgreSQL`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔧 API: http://localhost:${PORT}/api`);
      }
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM recebido, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT recebido, encerrando servidor...');
  process.exit(0);
});

// Inicializar servidor
startServer(); 