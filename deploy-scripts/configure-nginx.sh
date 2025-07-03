#!/bin/bash

# Script de configuração do Nginx para Forex Signals
# Configure seu domínio antes de executar

set -e

# Solicitar domínio do usuário
read -p "Digite seu domínio (ex: meusite.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ Domínio é obrigatório!"
    exit 1
fi

echo "🌐 Configurando Nginx para domínio: $DOMAIN"

# Remover configuração padrão do Nginx
sudo rm -f /etc/nginx/sites-enabled/default

# Criar configuração do site
sudo tee /etc/nginx/sites-available/forex-signals << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Redirecionar para HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # Configurações SSL (serão configuradas com Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Servir arquivos estáticos do React
    location / {
        root /var/www/forex-signals/frontend/build;
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

    # Segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Habilitar site
sudo ln -sf /etc/nginx/sites-available/forex-signals /etc/nginx/sites-enabled/

# Testar configuração do Nginx
echo "🔍 Testando configuração do Nginx..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuração do Nginx válida"
    
    # Instalar Certbot para SSL
    echo "🔒 Instalando Certbot para SSL..."
    sudo apt install -y certbot python3-certbot-nginx
    
    # Obter certificado SSL
    echo "🔐 Configurando SSL com Let's Encrypt..."
    echo "Execute o comando abaixo para obter o certificado SSL:"
    echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    
    # Reiniciar Nginx
    echo "🔄 Reiniciando Nginx..."
    sudo systemctl restart nginx
    
    echo "✅ Nginx configurado com sucesso!"
    echo "🌍 Seu site estará disponível em: https://$DOMAIN"
    
else
    echo "❌ Erro na configuração do Nginx"
    exit 1
fi

# Configurar renovação automática do SSL
echo "⚙️ Configurando renovação automática do SSL..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

echo "📋 Comandos úteis:"
echo "  - Ver logs do Nginx: sudo tail -f /var/log/nginx/forex-signals.error.log"
echo "  - Verificar status do PM2: pm2 status"
echo "  - Reiniciar aplicação: pm2 restart forex-signals-backend"
echo "  - Ver logs da aplicação: pm2 logs forex-signals-backend" 