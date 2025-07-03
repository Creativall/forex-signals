#!/bin/bash

# Script para configurar projeto forex-signals já existente na VPS
# Domínio: app-gaskpay.com
# Repositório: https://github.com/Creativall/forex-signals.git

set -e

echo "🚀 CONFIGURANDO FOREX SIGNALS - app-gaskpay.com"
echo "=============================================="
echo ""

DOMAIN="app-gaskpay.com"
REPO_URL="https://github.com/Creativall/forex-signals.git"
APP_USER="forex"
PROJECT_DIR="/var/www/forex-signals"

# Função para verificar sucesso
check_command() {
    if [ $? -eq 0 ]; then
        echo "✅ $1 - Sucesso"
    else
        echo "❌ $1 - Erro"
        exit 1
    fi
}

echo "🔍 Verificando estado atual..."

# Verificar se estamos como root
if [ "$EUID" -ne 0 ]; then
    echo "⚠️ Execute como root: sudo $0"
    exit 1
fi

# Verificar se o projeto existe
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Projeto não encontrado em $PROJECT_DIR"
    exit 1
fi

echo "✅ Projeto encontrado em $PROJECT_DIR"

# 1. ATUALIZAR SISTEMA
echo ""
echo "📦 1/8 - Atualizando sistema..."
apt update && apt upgrade -y
check_command "Atualização do sistema"

# 2. INSTALAR DEPENDÊNCIAS SE NECESSÁRIO
echo ""
echo "🔧 2/8 - Verificando/Instalando dependências..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "📋 Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi

# Verificar outras dependências
apt install -y curl wget git build-essential ufw nginx certbot python3-certbot-nginx postgresql postgresql-contrib jq

# Instalar PM2 se não existir
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

check_command "Instalação de dependências"

# 3. CONFIGURAR USUÁRIO DA APLICAÇÃO
echo ""
echo "👤 3/8 - Configurando usuário da aplicação..."
if ! id "$APP_USER" &>/dev/null; then
    useradd -m -s /bin/bash $APP_USER
    usermod -aG sudo $APP_USER
fi
check_command "Configuração do usuário"

# 4. CONFIGURAR POSTGRESQL
echo ""
echo "🗃️ 4/8 - Configurando PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql

# Gerar senha forte para o banco
DB_PASSWORD=$(openssl rand -base64 16)

# Configurar banco de dados (apenas se não existir)
sudo -u postgres psql << EOF || true
CREATE USER forex_user WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE forex_signals OWNER forex_user;
GRANT ALL PRIVILEGES ON DATABASE forex_signals TO forex_user;
ALTER USER forex_user CREATEDB;
\q
EOF
check_command "Configuração do PostgreSQL"

# 5. CONFIGURAR FIREWALL
echo ""
echo "🛡️ 5/8 - Configurando firewall..."
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable
check_command "Configuração do firewall"

# 6. CONFIGURAR PROJETO
echo ""
echo "📁 6/8 - Configurando projeto..."

# Definir propriedade do diretório
chown -R $APP_USER:$APP_USER $PROJECT_DIR

# Navegar para o projeto
cd $PROJECT_DIR

# Atualizar código (se for repositório git)
if [ -d ".git" ]; then
    echo "🔄 Atualizando código do repositório..."
    sudo -u $APP_USER git pull origin main || true
else
    echo "🔄 Inicializando repositório Git..."
    sudo -u $APP_USER git init
    sudo -u $APP_USER git remote add origin $REPO_URL || true
    sudo -u $APP_USER git pull origin main || true
fi

# Configurar backend
echo "⚙️ Configurando backend..."
cd backend

# Criar .env do backend
sudo -u $APP_USER cat > .env << EOF
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=forex_signals
DB_USER=forex_user
DB_PASSWORD=$DB_PASSWORD
JWT_SECRET=$(openssl rand -base64 32)
CORS_ORIGIN=https://$DOMAIN
EOF

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
sudo -u $APP_USER npm install --production

# Configurar frontend
echo "🎨 Configurando frontend..."
cd ../frontend

# Criar .env do frontend
sudo -u $APP_USER cat > .env << EOF
REACT_APP_API_URL=https://$DOMAIN/api
REACT_APP_ENVIRONMENT=production
EOF

# Instalar dependências e fazer build
echo "📦 Instalando dependências do frontend..."
sudo -u $APP_USER npm install

echo "🔨 Fazendo build do frontend..."
sudo -u $APP_USER npm run build

# Configurar PM2
echo "🔄 Configurando PM2..."
cd ..

# Criar/atualizar configuração do PM2
sudo -u $APP_USER cat > ecosystem.config.js << EOF
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

check_command "Configuração do projeto"

# 7. CONFIGURAR BANCO DE DADOS
echo ""
echo "🗃️ 7/8 - Configurando estrutura do banco..."
cd backend
sudo -u $APP_USER npm run setup-db || true
check_command "Setup do banco de dados"

# 8. CONFIGURAR NGINX E SSL
echo ""
echo "🌐 8/8 - Configurando Nginx e SSL..."

# Parar Nginx se estiver rodando
systemctl stop nginx || true

# Remover configuração padrão
rm -f /etc/nginx/sites-enabled/default

# Criar configuração do site
cat > /etc/nginx/sites-available/forex-signals << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Servir arquivos estáticos do React
    location / {
        root $PROJECT_DIR/frontend/build;
        try_files \$uri \$uri/ /index.html;
        
        # Cache para arquivos estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Proxy para API do backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Logs
    access_log /var/log/nginx/forex-signals.access.log;
    error_log /var/log/nginx/forex-signals.error.log;

    # Compressão
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

# Habilitar site
ln -sf /etc/nginx/sites-available/forex-signals /etc/nginx/sites-enabled/

# Testar configuração
nginx -t
systemctl start nginx
systemctl enable nginx
check_command "Configuração do Nginx"

# Iniciar aplicação
echo ""
echo "🚀 Iniciando aplicação..."
cd $PROJECT_DIR

# Parar processos antigos
sudo -u $APP_USER pm2 delete forex-signals-backend || true

# Iniciar com PM2
sudo -u $APP_USER pm2 start ecosystem.config.js
sudo -u $APP_USER pm2 save

# Configurar PM2 para inicializar com o sistema
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $APP_USER --hp /home/$APP_USER

check_command "Inicialização da aplicação"

# Configurar SSL
echo ""
echo "🔒 Configurando SSL..."
echo "⚠️ IMPORTANTE: Configure o DNS primeiro!"
echo "No seu provedor de domínio, configure:"
echo "  Tipo A: @ -> 138.197.22.239"
echo "  Tipo A: www -> 138.197.22.239"
echo ""

read -p "DNS já está configurado? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔐 Obtendo certificado SSL..."
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    # Configurar renovação automática
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    
    check_command "Configuração do SSL"
else
    echo "⚠️ Configure o DNS e execute depois:"
    echo "certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

echo ""
echo "✅ CONFIGURAÇÃO CONCLUÍDA!"
echo "========================="
echo ""
echo "🌍 Site: http://$DOMAIN (https após SSL)"
echo "🔧 API: http://$DOMAIN/api"
echo ""
echo "🔐 CREDENCIAIS DO BANCO:"
echo "Usuário: forex_user"
echo "Senha: $DB_PASSWORD"
echo "Banco: forex_signals"
echo ""
echo "📊 COMANDOS ÚTEIS:"
echo "sudo -u $APP_USER pm2 status"
echo "sudo -u $APP_USER pm2 logs forex-signals-backend"
echo "sudo -u $APP_USER pm2 restart forex-signals-backend"
echo "systemctl status nginx"
echo ""
echo "🎉 Sistema configurado com sucesso!" 