# 🚀 Guia Completo de Deploy - Forex Signals

Este guia te ajudará a configurar seu sistema Forex Signals em uma VPS de forma simples e organizada.

## 📋 Pré-requisitos

### VPS Recomendada
- **Sistema Operacional**: Ubuntu 20.04+ ou Debian 11+
- **RAM**: Mínimo 2GB (recomendado 4GB)
- **Processador**: 2 vCPUs
- **Armazenamento**: 20GB SSD
- **Largura de banda**: Ilimitada

### Informações Necessárias
- IP da VPS
- Usuário SSH (root ou ubuntu)
- Senha ou chave SSH
- Domínio registrado (ex: meusite.com)

## 🔧 Passo 1: Conexão SSH

### Windows (PowerShell)
```powershell
ssh usuario@IP_DA_VPS
# Exemplo: ssh root@192.168.1.100
```

### Linux/Mac
```bash
ssh usuario@IP_DA_VPS
# Exemplo: ssh root@192.168.1.100
```

## 🛠️ Passo 2: Configuração Inicial da VPS

1. **Baixar os scripts de deploy:**
```bash
wget https://raw.githubusercontent.com/seu-usuario/forex-signals/main/deploy-scripts/vps-setup.sh
chmod +x vps-setup.sh
```

2. **Executar configuração inicial:**
```bash
./vps-setup.sh
```

Este script irá:
- Atualizar o sistema
- Instalar Node.js, PostgreSQL, Nginx, PM2
- Configurar firewall
- Criar estrutura de diretórios

## 📁 Passo 3: Upload do Código

### Opção A: Via Git (Recomendado)
```bash
cd /var/www/forex-signals
git clone https://github.com/seu-usuario/forex-signals.git .
```

### Opção B: Via Upload Manual
1. Comprima seu projeto em um arquivo ZIP
2. Use ferramentas como WinSCP ou FileZilla para enviar
3. Descompacte na pasta `/var/www/forex-signals`

## ⚙️ Passo 4: Deploy da Aplicação

1. **Baixar script de deploy:**
```bash
cd /var/www/forex-signals
wget https://raw.githubusercontent.com/seu-usuario/forex-signals/main/deploy-scripts/deploy-app.sh
chmod +x deploy-app.sh
```

2. **Editar configurações antes do deploy:**
```bash
nano deploy-app.sh
# Configure a URL do seu repositório Git
```

3. **Executar deploy:**
```bash
./deploy-app.sh
```

## 🌐 Passo 5: Configuração do Nginx

1. **Baixar script de configuração:**
```bash
wget https://raw.githubusercontent.com/seu-usuario/forex-signals/main/deploy-scripts/configure-nginx.sh
chmod +x configure-nginx.sh
```

2. **Executar configuração:**
```bash
./configure-nginx.sh
# Digite seu domínio quando solicitado
```

3. **Configurar SSL (certificado gratuito):**
```bash
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

## 🔍 Passo 6: Verificação e Monitoramento

1. **Baixar script de monitoramento:**
```bash
wget https://raw.githubusercontent.com/seu-usuario/forex-signals/main/deploy-scripts/monitor.sh
chmod +x monitor.sh
```

2. **Verificar status do sistema:**
```bash
./monitor.sh
```

## 🌍 Configuração de DNS

No seu provedor de domínio, configure os seguintes registros DNS:

```
Tipo: A
Nome: @
Valor: IP_DA_SUA_VPS

Tipo: A  
Nome: www
Valor: IP_DA_SUA_VPS
```

## 📊 Comandos Úteis

### Gerenciamento do PM2
```bash
# Ver status da aplicação
pm2 status

# Ver logs em tempo real
pm2 logs forex-signals-backend

# Reiniciar aplicação
pm2 restart forex-signals-backend

# Parar aplicação
pm2 stop forex-signals-backend
```

### Gerenciamento do Nginx
```bash
# Verificar status
sudo systemctl status nginx

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver logs de erro
sudo tail -f /var/log/nginx/forex-signals.error.log
```

### Gerenciamento do PostgreSQL
```bash
# Verificar status
sudo systemctl status postgresql

# Conectar ao banco
sudo -u postgres psql forex_signals

# Fazer backup do banco
sudo -u postgres pg_dump forex_signals > backup.sql
```

## 🔄 Atualizações Futuras

Para atualizar sua aplicação:

```bash
cd /var/www/forex-signals

# Fazer backup
cp -r . ../backup-$(date +%Y%m%d)

# Atualizar código
git pull origin main

# Atualizar dependências
cd backend && npm install --production
cd ../frontend && npm install && npm run build

# Reiniciar aplicação
pm2 restart forex-signals-backend
```

## 🆘 Solução de Problemas

### Aplicação não inicia
```bash
# Verificar logs
pm2 logs forex-signals-backend

# Verificar configuração do banco
cd /var/www/forex-signals/backend
node -e "console.log(require('./config/database.js'))"
```

### Site não carrega
```bash
# Verificar status do Nginx
sudo systemctl status nginx

# Verificar configuração
sudo nginx -t

# Ver logs de erro
sudo tail -f /var/log/nginx/error.log
```

### Banco de dados não conecta
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar conexões
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

## 📞 Suporte

Se encontrar problemas:

1. Execute o script de monitoramento: `./monitor.sh`
2. Verifique os logs específicos do serviço com problema
3. Consulte a documentação do erro específico

## 🔒 Segurança

### Configurações Recomendadas
- Altere a senha padrão do PostgreSQL
- Configure backup automático do banco
- Monitore logs regularmente
- Mantenha o sistema atualizado

### Backup Automático
```bash
# Adicionar ao crontab
crontab -e

# Adicionar linha para backup diário às 2:00 AM
0 2 * * * sudo -u postgres pg_dump forex_signals > /var/backups/forex-$(date +\%Y\%m\%d).sql
```

---

**✅ Parabéns! Seu sistema Forex Signals está configurado e rodando em produção!**

Acesse seu site em: `https://seudominio.com` 