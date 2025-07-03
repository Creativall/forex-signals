# 📁 Scripts de Deploy - Forex Signals

Esta pasta contém todos os scripts necessários para fazer o deploy do sistema Forex Signals em uma VPS.

## 🚀 Deploy Rápido (Recomendado)

Para um deploy completo e automático:

```bash
# 1. Fazer SSH na VPS
ssh root@SEU_IP_DA_VPS

# 2. Baixar e executar o script completo
wget https://raw.githubusercontent.com/seu-usuario/forex-signals/main/deploy-scripts/deploy-complete.sh
chmod +x deploy-complete.sh
sudo ./deploy-complete.sh
```

O script irá solicitar:
- Seu domínio
- URL do repositório Git
- Senha do banco de dados
- Nome do usuário da aplicação

## 📋 Scripts Individuais

Se preferir fazer o deploy passo a passo:

### 1. `vps-setup.sh` - Configuração inicial
Instala e configura todas as dependências básicas:
- Node.js 18.x
- PostgreSQL
- Nginx
- PM2
- Firewall

```bash
./vps-setup.sh
```

### 2. `deploy-app.sh` - Deploy da aplicação
Clona o repositório e configura a aplicação:
- Clone do código
- Configuração do .env
- Instalação de dependências
- Build do frontend
- Configuração do PM2

```bash
./deploy-app.sh
```

### 3. `configure-nginx.sh` - Configuração do web server
Configura Nginx como proxy reverso e SSL:
- Configuração do Nginx
- Certificado SSL (Let's Encrypt)
- Redirecionamento HTTPS

```bash
./configure-nginx.sh
```

### 4. `monitor.sh` - Monitoramento
Script para verificar o status de todos os serviços:
- Status do sistema
- PostgreSQL
- Nginx
- PM2
- Certificado SSL
- Logs de erro

```bash
./monitor.sh
```

## 📁 Arquivos de Configuração

- `GUIA_DEPLOY.md` - Guia completo passo a passo
- `deploy-complete.sh` - Script de deploy automático
- `monitor.sh` - Script de monitoramento

## 🔧 Configuração Manual

Se você quiser configurar manualmente ou entender cada passo:

1. Leia o `GUIA_DEPLOY.md` para instruções detalhadas
2. Execute os scripts individuais na ordem correta
3. Use o `monitor.sh` para verificar se tudo está funcionando

## 🆘 Solução de Problemas

### Script não executa
```bash
# Dar permissão de execução
chmod +x nome-do-script.sh
```

### Erro de permissão
```bash
# Executar como administrador
sudo ./nome-do-script.sh
```

### Verificar logs
```bash
# Logs do sistema
journalctl -f

# Logs da aplicação
sudo -u forex pm2 logs forex-signals-backend

# Logs do Nginx
tail -f /var/log/nginx/forex-signals.error.log
```

## 📞 Suporte

Se encontrar problemas:

1. Execute o script de monitoramento: `./monitor.sh`
2. Verifique os logs específicos do serviço com problema
3. Consulte o guia de solução de problemas no `GUIA_DEPLOY.md`

## 🔒 Segurança

- Todos os scripts configuram firewall automaticamente
- SSL é configurado com Let's Encrypt
- Usuário não-root é criado para a aplicação
- Renovação automática do certificado SSL

---

**💡 Dica**: Use o script `deploy-complete.sh` para um deploy rápido e sem complicações! 