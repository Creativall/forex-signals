const express = require('express');
const rateLimit = require('express-rate-limit');

// Simula as configurações do servidor principal
const isProduction = process.env.NODE_ENV === 'production';

console.log('🧪 Testando configurações de proxy...\n');
console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
console.log(`🛡️ Modo produção: ${isProduction}`);

// Testa configuração do trust proxy
const app = express();

if (isProduction) {
  app.set('trust proxy', 1);
  console.log('✅ Trust proxy configurado para PRODUÇÃO (1 hop)');
} else {
  app.set('trust proxy', false);
  console.log('✅ Trust proxy configurado para DESENVOLVIMENTO (false)');
}

// Testa configuração do rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Rate limit atingido' },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: isProduction ? 1 : false,
  skip: (req) => {
    return req.path === '/api/health' || req.path === '/api';
  }
});

console.log('✅ Rate limiter configurado corretamente');

// Middleware de teste
app.use('/api/', (req, res, next) => {
  console.log('📊 Headers recebidos:', {
    'X-Forwarded-For': req.get('X-Forwarded-For') || 'não presente',
    'X-Real-IP': req.get('X-Real-IP') || 'não presente',
    'req.ip': req.ip,
    'trustProxy': app.get('trust proxy')
  });
  next();
});

app.use('/api/', limiter);

app.get('/api/test', (req, res) => {
  res.json({
    message: 'Teste OK',
    ip: req.ip,
    headers: {
      'X-Forwarded-For': req.get('X-Forwarded-For'),
      'X-Real-IP': req.get('X-Real-IP')
    },
    trustProxy: app.get('trust proxy')
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor de teste rodando na porta ${PORT}`);
  console.log(`📍 Teste: http://localhost:${PORT}/api/test`);
  console.log('\n💡 Para testar:');
  console.log('   curl http://localhost:3001/api/test');
  console.log('   curl -H "X-Forwarded-For: 192.168.1.100" http://localhost:3001/api/test');
  console.log('\n⏹️  Pressione Ctrl+C para parar o teste');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Encerrando teste...');
  process.exit(0);
}); 