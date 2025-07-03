# 🚀 Instruções de Deploy - Forex Signals

## ⚡ Deploy Rápido (1 comando)

Execute este comando no seu computador Windows:

```bash
./deploy-vps-production.sh
```

**Senha da VPS**: `RochaG4y`

---

## 📋 Informações do Sistema

- **VPS IP**: 138.197.22.239
- **Domínio**: app-gaskpay.com
- **Supabase Project**: forex-signals (gjfdtrmxinexrgxwixam)
- **Repositório**: https://github.com/Creativall/forex-signals.git

## 🗃️ Banco de Dados Supabase

**Configuração do projeto Supabase:**
- **URL**: https://gjfdtrmxinexrgxwixam.supabase.co
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Região**: sa-east-1 (São Paulo)
- **Status**: ACTIVE_HEALTHY

**Tabelas existentes:**
- ✅ `users` - Usuários do sistema
- ✅ `verification_tokens` - Tokens de verificação
- ✅ `forex_signals` - Sinais forex

## 📁 Arquivos de Configuração

### Backend (.env)
Copie de: `backend/env.production.example`
```bash
cp backend/env.production.example backend/.env
```

### Frontend (.env)
Copie de: `frontend/env.production.example`
```bash
cp frontend/env.production.example frontend/.env
```

## 🌐 Configuração DNS

Configure no seu provedor de domínio:

```
Tipo: A
Nome: @
Valor: 138.197.22.239

Tipo: A
Nome: www
Valor: 138.197.22.239
```

## 🔒 SSL (Após deploy)

Execute na VPS após configurar o DNS:

```bash
ssh root@138.197.22.239
certbot --nginx -d app-gaskpay.com -d www.app-gaskpay.com
```

## 📊 Comandos de Monitoramento

```bash
# Conectar na VPS
ssh root@138.197.22.239

# Status da aplicação
sudo -u forex pm2 status

# Logs da aplicação
sudo -u forex pm2 logs forex-signals-backend

# Status do Nginx
systemctl status nginx

# Logs do Nginx
tail -f /var/log/nginx/forex-signals.error.log
```

## 🎯 URLs Finais

- **Site**: https://app-gaskpay.com
- **API**: https://app-gaskpay.com/api
- **Supabase Dashboard**: https://supabase.com/dashboard/project/gjfdtrmxinexrgxwixam

---

## ⚠️ Importante

1. **Execute o script de deploy** - `./deploy-vps-production.sh`
2. **Configure o DNS** antes de obter o SSL
3. **Substitua as chaves secretas** nos arquivos .env
4. **Configure email/notificações** se necessário

## 🆘 Problemas?

Execute o comando de monitoramento na VPS:
```bash
./monitor.sh
```

---

**🎉 Após o deploy, seu sistema estará online em https://app-gaskpay.com!** 