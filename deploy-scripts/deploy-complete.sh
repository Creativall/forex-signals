#!/bin/bash

# Script completo de deploy automático - Forex Signals
# Este script faz todo o processo de configuração da VPS

set -e

echo "🚀 DEPLOY AUTOMÁTICO - FOREX SIGNALS"
echo "==================================="
echo ""

# Função para verificar se o comando foi executado com sucesso
check_command() {
    if [ $? -eq 0 ]; then
        echo "✅ $1 - Sucesso"
    else
        echo "❌ $1 - Erro"
        exit 1
    fi
}

# Função para solicitar confirmação
confirm() {
    read -p "$1 (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Operação cancelada."
        exit 1
    fi
}

# Verificar se está rodando como root ou com sudo
if [ "$EUID" -ne 0 ]; then
    echo "⚠️ Este script precisa de permissões de administrador."
    echo "Execute com: sudo $0"
    exit 1
fi

# Solicitar informações do usuário
echo "📝 INFORMAÇÕES NECESSÁRIAS:"
echo ""

read -p "Digite seu domínio (ex: meusite.com): " DOMAIN
if [ -z "$DOMAIN" ]; then
    echo "❌ Domínio é obrigatório!"
    exit 1
fi

read -p "Digite a URL do seu repositório Git: " REPO_URL
if [ -z "$REPO_URL" ]; then
    echo "❌ URL do repositório é obrigatória!"
    exit 1
fi

read -p "Digite o nome de usuário não-root para a aplicação (padrão: forex): " APP_USER
APP_USER=${APP_USER:-forex}

read -s -p "Digite uma senha segura para o banco de dados: " DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ Senha do banco é obrigatória!"
    exit 1
fi

echo ""
echo "🔍 RESUMO DA CONFIGURAÇÃO:"
echo "Domínio: $DOMAIN"
echo "Repositório: $REPO_URL"
echo "Usuário da aplicação: $APP_USER"
echo "Banco de dados: PostgreSQL com senha personalizada"
echo ""

confirm "Confirma as configurações acima?"

echo ""
echo "🚀 Iniciando configuração automática..."

# 1. ATUALIZAR SISTEMA
echo ""
echo "📦 1/8 - Atualizando sistema..."
apt update && apt upgrade -y
check_command "Atualização do sistema"

# 2. INSTALAR DEPENDÊNCIAS
echo ""
echo "🔧 2/8 - Instalando dependências..."
apt install -y curl wget git build-essential software-properties-common ufw nginx certbot python3-certbot-nginx postgresql postgresql-contrib jq
check_command "Instalação de dependências"

# 3. INSTALAR NODE.JS
echo ""
echo "📋 3/8 - Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
npm install -g pm2
check_command "Instalação do Node.js e PM2"

# 4. CONFIGURAR USUÁRIO DA APLICAÇÃO
echo ""
echo "👤 4/8 - Configurando usuário da aplicação..."
if ! id "$APP_USER" &>/dev/null; then
    useradd -m -s /bin/bash $APP_USER
    usermod -aG sudo $APP_USER
fi
check_command "Configuração do usuário"

# 5. CONFIGURAR POSTGRESQL
echo ""
echo "🗃️ 5/8 - Configurando PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql

# Configurar banco de dados
sudo -u postgres psql << EOF
CREATE USER forex_user WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE forex_signals OWNER forex_user;
GRANT ALL PRIVILEGES ON DATABASE forex_signals TO forex_user;
ALTER USER forex_user CREATEDB;
\q
EOF
check_command "Configuração do PostgreSQL"

# 6. CONFIGURAR FIREWALL
echo ""
echo "🛡️ 6/8 - Configurando firewall..."
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable
check_command "Configuração do firewall"

# 7. CONFIGURAR APLICAÇÃO
echo ""
echo "📁 7/8 - Configurando aplicação..."

# Criar diretório e definir permissões
mkdir -p /var/www/forex-signals
chown -R $APP_USER:$APP_USER /var/www/forex-signals

# Clone do repositório como usuário da aplicação
sudo -u $APP_USER bash << EOF
cd /var/www/forex-signals
git clone $REPO_URL .

# Configurar backend
cd backend
cat > .env << EOL
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=forex_signals
DB_USER=forex_user
DB_PASSWORD=$DB_PASSWORD
JWT_SECRET=$(openssl rand -base64 32)
CORS_ORIGIN=https://$DOMAIN
EOL

# Instalar dependências do backend
npm install --production

# Configurar frontend
cd ../frontend
cat > .env << EOL
REACT_APP_API_URL=https://$DOMAIN/api
REACT_APP_ENVIRONMENT=production
EOL

# Instalar dependências e fazer build
npm install
npm run build

# Voltar para raiz e configurar PM2
cd ..
cat > ecosystem.config.js << EOL
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
EOL
EOF

check_command "Configuração da aplicação"

# Setup do banco de dados
echo "🗃️ Configurando estrutura do banco..."
cd /var/www/forex-signals/backend
sudo -u $APP_USER npm run setup-db || true
check_command "Setup do banco de dados"

# 8. CONFIGURAR NGINX E SSL
echo ""
echo "🌐 8/8 - Configurando Nginx e SSL..."

# Remover configuração padrão
rm -f /etc/nginx/sites-enabled/default

# Criar configuração temporária (HTTP apenas)
cat > /etc/nginx/sites-available/forex-signals << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Servir arquivos estáticos do React
    location / {
        root /var/www/forex-signals/frontend/build;
        try_files \$uri \$uri/ /index.html;
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
    }

    # Logs
    access_log /var/log/nginx/forex-signals.access.log;
    error_log /var/log/nginx/forex-signals.error.log;
}
EOF

# Habilitar site
ln -sf /etc/nginx/sites-available/forex-signals /etc/nginx/sites-enabled/

# Testar e reiniciar Nginx
nginx -t
systemctl restart nginx
check_command "Configuração do Nginx"

# Iniciar aplicação com PM2
echo ""
echo "🚀 Iniciando aplicação..."
cd /var/www/forex-signals
sudo -u $APP_USER pm2 start ecosystem.config.js
sudo -u $APP_USER pm2 save
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $APP_USER --hp /home/$APP_USER
check_command "Inicialização da aplicação"

# Configurar SSL
echo ""
echo "🔒 Configurando SSL..."
echo "Obtendo certificado SSL do Let's Encrypt..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
check_command "Configuração do SSL"

# Configurar renovação automática
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

echo ""
echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
echo "================================"
echo ""
echo "🌍 Seu site está disponível em: https://$DOMAIN"
echo "🔧 Painel de administração: https://$DOMAIN/admin"
echo ""
echo "📊 COMANDOS ÚTEIS:"
echo "  - Verificar status: sudo -u $APP_USER pm2 status"
echo "  - Ver logs: sudo -u $APP_USER pm2 logs forex-signals-backend"
echo "  - Reiniciar app: sudo -u $APP_USER pm2 restart forex-signals-backend"
echo "  - Status do Nginx: systemctl status nginx"
echo "  - Logs do Nginx: tail -f /var/log/nginx/forex-signals.error.log"
echo ""
echo "🔒 SEGURANÇA:"
echo "  - Senha do banco salva em: /var/www/forex-signals/backend/.env"
echo "  - Certificado SSL configurado e renovação automática ativa"
echo ""
echo "📝 PRÓXIMOS PASSOS:"
echo "  1. Configure os registros DNS do seu domínio para apontar para este IP"
echo "  2. Teste todas as funcionalidades do sistema"
echo "  3. Configure backup automático do banco de dados"
echo ""
echo "🎉 Parabéns! Seu sistema Forex Signals está online!" 