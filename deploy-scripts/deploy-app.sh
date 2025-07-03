#!/bin/bash

# Script de deploy da aplicação Forex Signals
# Execute este script após a configuração inicial da VPS

set -e

echo "🚀 Iniciando deploy da aplicação Forex Signals..."

# Navegar para diretório da aplicação
cd /var/www/forex-signals

# Fazer backup se já existir
if [ -d ".git" ]; then
    echo "📁 Fazendo backup da versão anterior..."
    sudo cp -r . ../forex-signals-backup-$(date +%Y%m%d-%H%M%S)
    git pull origin main
else
    # Clone do repositório (você precisará configurar o URL)
    echo "📥 Clonando repositório..."
    # git clone https://github.com/seu-usuario/forex-signals.git .
    echo "⚠️  Configure o URL do repositório no script"
fi

# Configurar variáveis de ambiente do backend
echo "⚙️ Configurando variáveis de ambiente..."
cd backend

# Criar .env do backend se não existir
if [ ! -f ".env" ]; then
    cat > .env << EOF
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=forex_signals
DB_USER=forex_user
DB_PASSWORD=forex_password_123
JWT_SECRET=$(openssl rand -base64 32)
CORS_ORIGIN=https://seu-dominio.com
EOF
    echo "✅ Arquivo .env do backend criado"
else
    echo "✅ Arquivo .env do backend já existe"
fi

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
npm install --production

# Executar scripts de banco de dados
echo "🗃️ Configurando banco de dados..."
npm run setup-db

# Configurar frontend
echo "🎨 Configurando frontend..."
cd ../frontend

# Criar .env do frontend se não existir
if [ ! -f ".env" ]; then
    cat > .env << EOF
REACT_APP_API_URL=https://seu-dominio.com/api
REACT_APP_ENVIRONMENT=production
EOF
    echo "✅ Arquivo .env do frontend criado"
else
    echo "✅ Arquivo .env do frontend já existe"
fi

# Instalar dependências e fazer build do frontend
echo "📦 Instalando dependências do frontend..."
npm install

echo "🔨 Fazendo build do frontend..."
npm run build

# Configurar PM2
echo "🔄 Configurando PM2..."
cd ..

# Criar configuração do PM2 se não existir
if [ ! -f "ecosystem.config.js" ]; then
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'forex-signals-backend',
    script: 'backend/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
EOF
fi

# Parar processos antigos se existirem
pm2 delete forex-signals-backend || true

# Iniciar aplicação com PM2
echo "🚀 Iniciando aplicação com PM2..."
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save
pm2 startup

echo "✅ Deploy da aplicação concluído!"
echo "🔗 Próximo passo: Configurar Nginx" 