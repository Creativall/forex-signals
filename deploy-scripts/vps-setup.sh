#!/bin/bash

# Script de configuração inicial para VPS - Forex Signals
# Este script configura o ambiente necessário para rodar o sistema

set -e

echo "🚀 Iniciando configuração da VPS para Forex Signals..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar dependências básicas
echo "🔧 Instalando dependências básicas..."
sudo apt install -y curl wget git build-essential software-properties-common

# Instalar Node.js 18.x
echo "📋 Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalações
echo "✅ Verificando instalações..."
node --version
npm --version

# Instalar PM2 globalmente
echo "🔄 Instalando PM2..."
sudo npm install -g pm2

# Instalar e configurar PostgreSQL
echo "🗃️ Instalando PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Configurar PostgreSQL
echo "⚙️ Configurando PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Criar usuário e banco de dados
sudo -u postgres psql << EOF
CREATE USER forex_user WITH PASSWORD 'forex_password_123';
CREATE DATABASE forex_signals OWNER forex_user;
GRANT ALL PRIVILEGES ON DATABASE forex_signals TO forex_user;
\q
EOF

# Configurar firewall
echo "🛡️ Configurando firewall..."
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3001
sudo ufw allow 5000
sudo ufw --force enable

# Instalar Nginx
echo "🌐 Instalando Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Criar diretório para aplicação
echo "📁 Criando estrutura de diretórios..."
sudo mkdir -p /var/www/forex-signals
sudo chown -R $USER:$USER /var/www/forex-signals

# Configurar Git (caso necessário)
echo "🔧 Configurando ambiente..."
cd /var/www/forex-signals

echo "✅ Configuração inicial concluída!"
echo "🔗 Próximos passos:"
echo "   1. Fazer clone do repositório"
echo "   2. Configurar variáveis de ambiente" 
echo "   3. Instalar dependências"
echo "   4. Configurar banco de dados"
echo "   5. Configurar Nginx"
echo "   6. Iniciar serviços com PM2" 