#!/bin/bash

# Script de Deploy para Produção - Forex Signals
# VPS: 138.197.22.239
# Domínio: app-gaskpay.com
# Supabase: gjfdtrmxinexrgxwixam

set -e

echo "🚀 DEPLOY FOREX SIGNALS - PRODUÇÃO"
echo "=================================="
echo "Domínio: app-gaskpay.com"
echo "VPS: 138.197.22.239"
echo "Supabase Project: forex-signals"
echo ""

DOMAIN="app-gaskpay.com"
VPS_IP="138.197.22.239"
PROJECT_DIR="/var/www/forex-signals"
APP_USER="forex"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Função para executar comandos na VPS
run_on_vps() {
    ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no -o StrictHostKeyChecking=no root@$VPS_IP "$1"
}

echo "🔐 Conectando na VPS..."
echo "Senha necessária para root@$VPS_IP"

# 1. VERIFICAR SISTEMA
log_info "1/10 - Verificando sistema..."
run_on_vps "apt update && apt upgrade -y"

# 2. INSTALAR DEPENDÊNCIAS
log_info "2/10 - Instalando dependências..."
run_on_vps "apt install -y nginx certbot python3-certbot-nginx ufw jq"

# 3. INSTALAR PM2 GLOBALMENTE
log_info "3/10 - Configurando PM2..."
run_on_vps "npm install -g pm2"

# 4. CRIAR USUÁRIO DA APLICAÇÃO
log_info "4/10 - Configurando usuário da aplicação..."
run_on_vps "useradd -m -s /bin/bash $APP_USER 2>/dev/null || true; usermod -aG sudo $APP_USER"

# 5. CONFIGURAR FIREWALL
log_info "5/10 - Configurando firewall..."
run_on_vps "ufw allow ssh && ufw allow 80 && ufw allow 443 && ufw --force enable"

# 6. CONFIGURAR PROJETO
log_info "6/10 - Configurando projeto..."
run_on_vps "mkdir -p $PROJECT_DIR && chown -R $APP_USER:$APP_USER $PROJECT_DIR"

# 7. ATUALIZAR CÓDIGO DO REPOSITÓRIO
log_info "7/10 - Atualizando código..."
run_on_vps "cd $PROJECT_DIR && sudo -u $APP_USER git pull origin main || sudo -u $APP_USER git clone https://github.com/Creativall/forex-signals.git ."

# 8. CONFIGURAR BACKEND
log_info "8/10 - Configurando backend..."

# Criar .env do backend
cat > backend_env_temp << 'EOF'
NODE_ENV=production
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://gjfdtrmxinexrgxwixam.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZmR0cm14aW5leHJneHdpeGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMzc1MTYsImV4cCI6MjA2NjkxMzUxNn0.m7aysu_WlaQMWSyQuG63nkhCAnE9prd24zzKbMvzx3Q
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database (Supabase PostgreSQL)
DB_HOST=db.gjfdtrmxinexrgxwixam.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_db_password

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 32)

# CORS Configuration
CORS_ORIGIN=https://app-gaskpay.com

# Email Configuration (se usar)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app

# App Configuration
APP_NAME=Forex Signals
APP_URL=https://app-gaskpay.com
EOF

# Enviar .env para VPS
scp -o PreferredAuthentications=password -o PubkeyAuthentication=no -o StrictHostKeyChecking=no backend_env_temp root@$VPS_IP:$PROJECT_DIR/backend/.env
rm backend_env_temp

run_on_vps "chown $APP_USER:$APP_USER $PROJECT_DIR/backend/.env"

# Instalar dependências do backend
run_on_vps "cd $PROJECT_DIR/backend && sudo -u $APP_USER npm install --production"

# 9. CONFIGURAR FRONTEND
log_info "9/10 - Configurando frontend..."

# Criar .env do frontend
cat > frontend_env_temp << 'EOF'
REACT_APP_API_URL=https://app-gaskpay.com/api
REACT_APP_SUPABASE_URL=https://gjfdtrmxinexrgxwixam.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZmR0cm14aW5leHJneHdpeGFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMzc1MTYsImV4cCI6MjA2NjkxMzUxNn0.m7aysu_WlaQMWSyQuG63nkhCAnE9prd24zzKbMvzx3Q
REACT_APP_ENVIRONMENT=production
REACT_APP_APP_NAME=Forex Signals
REACT_APP_VERSION=1.0.0
EOF

# Enviar .env do frontend para VPS
scp -o PreferredAuthentications=password -o PubkeyAuthentication=no -o StrictHostKeyChecking=no frontend_env_temp root@$VPS_IP:$PROJECT_DIR/frontend/.env
rm frontend_env_temp

run_on_vps "chown $APP_USER:$APP_USER $PROJECT_DIR/frontend/.env"

# Instalar dependências e fazer build do frontend
run_on_vps "cd $PROJECT_DIR/frontend && sudo -u $APP_USER npm install && sudo -u $APP_USER npm run build"

# 10. CONFIGURAR PM2
log_info "10/10 - Configurando PM2 e serviços..."

# Criar configuração do PM2
cat > ecosystem_temp << 'EOF'
module.exports = {
  apps: [{
    name: 'forex-signals-backend',
    script: 'backend/index.js',
    cwd: '/var/www/forex-signals',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    log_file: '/var/www/forex-signals/logs/combined.log',
    out_file: '/var/www/forex-signals/logs/out.log',
    error_file: '/var/www/forex-signals/logs/error.log',
    time: true
  }]
};
EOF

# Enviar configuração do PM2
scp -o PreferredAuthentications=password -o PubkeyAuthentication=no -o StrictHostKeyChecking=no ecosystem_temp root@$VPS_IP:$PROJECT_DIR/ecosystem.config.js
rm ecosystem_temp

run_on_vps "chown $APP_USER:$APP_USER $PROJECT_DIR/ecosystem.config.js"

# Criar diretório de logs
run_on_vps "mkdir -p $PROJECT_DIR/logs && chown $APP_USER:$APP_USER $PROJECT_DIR/logs"

# Parar PM2 anterior se existir
run_on_vps "sudo -u $APP_USER pm2 delete forex-signals-backend || true"

# Iniciar aplicação com PM2
run_on_vps "cd $PROJECT_DIR && sudo -u $APP_USER pm2 start ecosystem.config.js"
run_on_vps "sudo -u $APP_USER pm2 save"

# Configurar PM2 para iniciar com o sistema
run_on_vps "env PATH=\$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $APP_USER --hp /home/$APP_USER"

# CONFIGURAR NGINX
log_info "Configurando Nginx..."

cat > nginx_config_temp << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Redirecionar para HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # Configurações SSL (serão configuradas com certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Servir arquivos estáticos do React
    location / {
        root $PROJECT_DIR/frontend/build;
        try_files \$uri \$uri/ /index.html;
        
        # Cache para arquivos estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
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

    # Segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;" always;
}
EOF

# Enviar configuração do Nginx
scp -o PreferredAuthentications=password -o PubkeyAuthentication=no -o StrictHostKeyChecking=no nginx_config_temp root@$VPS_IP:/etc/nginx/sites-available/forex-signals
rm nginx_config_temp

# Habilitar site e testar configuração
run_on_vps "rm -f /etc/nginx/sites-enabled/default"
run_on_vps "ln -sf /etc/nginx/sites-available/forex-signals /etc/nginx/sites-enabled/"
run_on_vps "nginx -t && systemctl restart nginx"

echo ""
log_info "DEPLOY CONCLUÍDO!"
echo "=================="
echo ""
echo "🌍 Site: http://$DOMAIN"
echo "🔧 API: http://$DOMAIN/api"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Configure o DNS do domínio para apontar para $VPS_IP"
echo "2. Obtenha certificado SSL:"
echo "   ssh root@$VPS_IP"
echo "   certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "📊 COMANDOS ÚTEIS:"
echo "   ssh root@$VPS_IP"
echo "   sudo -u $APP_USER pm2 status"
echo "   sudo -u $APP_USER pm2 logs forex-signals-backend"
echo "   systemctl status nginx"
echo ""
log_warn "IMPORTANTE: Configure o DNS antes de obter o certificado SSL!"
echo ""
log_info "🎉 Sistema configurado com sucesso!" 