#!/bin/bash

# Script de monitoramento do sistema Forex Signals
# Verifica o status de todos os serviços

echo "🔍 MONITORAMENTO DO SISTEMA FOREX SIGNALS"
echo "========================================"

# Verificar status do sistema
echo "💻 STATUS DO SISTEMA:"
echo "Uptime: $(uptime -p)"
echo "Memória: $(free -h | grep '^Mem:' | awk '{printf "Usado: %s / Total: %s (%.1f%%)\n", $3, $2, ($3/$2)*100}')"
echo "Disco: $(df -h / | tail -1 | awk '{printf "Usado: %s / Total: %s (%s)\n", $3, $2, $5}')"
echo ""

# Verificar PostgreSQL
echo "🗃️ STATUS DO POSTGRESQL:"
if systemctl is-active --quiet postgresql; then
    echo "✅ PostgreSQL está rodando"
    psql_connections=$(sudo -u postgres psql -t -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';" 2>/dev/null || echo "0")
    echo "📊 Conexões ativas: $psql_connections"
else
    echo "❌ PostgreSQL não está rodando"
fi
echo ""

# Verificar Nginx
echo "🌐 STATUS DO NGINX:"
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx está rodando"
    nginx_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health 2>/dev/null || echo "000")
    if [ "$nginx_status" = "200" ]; then
        echo "✅ API está respondendo"
    else
        echo "⚠️ API não está respondendo (HTTP: $nginx_status)"
    fi
else
    echo "❌ Nginx não está rodando"
fi
echo ""

# Verificar PM2
echo "🔄 STATUS DO PM2:"
if command -v pm2 &> /dev/null; then
    pm2_status=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name=="forex-signals-backend") | .pm2_env.status' 2>/dev/null || echo "not found")
    if [ "$pm2_status" = "online" ]; then
        echo "✅ Aplicação está rodando"
        pm2 status forex-signals-backend
    else
        echo "❌ Aplicação não está rodando (Status: $pm2_status)"
    fi
else
    echo "❌ PM2 não está instalado"
fi
echo ""

# Verificar certificado SSL
echo "🔒 STATUS DO SSL:"
domain=$(grep "server_name" /etc/nginx/sites-available/forex-signals 2>/dev/null | head -1 | awk '{print $2}' | sed 's/;//g')
if [ -n "$domain" ] && [ "$domain" != "localhost" ]; then
    ssl_expiry=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null | grep "notAfter" | cut -d= -f2)
    if [ -n "$ssl_expiry" ]; then
        echo "✅ Certificado SSL válido"
        echo "📅 Expira em: $ssl_expiry"
    else
        echo "⚠️ Certificado SSL não encontrado ou inválido"
    fi
else
    echo "⚠️ Domínio não configurado"
fi
echo ""

# Verificar logs de erro recentes
echo "📋 LOGS RECENTES (últimos 10 erros):"
echo "--- Nginx Errors ---"
sudo tail -10 /var/log/nginx/forex-signals.error.log 2>/dev/null | grep -E "(error|crit|alert|emerg)" || echo "Nenhum erro encontrado"
echo ""

echo "--- PM2 Errors ---"
pm2 logs forex-signals-backend --lines 5 --err 2>/dev/null || echo "Nenhum erro encontrado"
echo ""

# Verificar portas
echo "🔌 PORTAS EM USO:"
echo "Porta 80 (HTTP): $(ss -tlnp | grep ':80 ' | wc -l) processo(s)"
echo "Porta 443 (HTTPS): $(ss -tlnp | grep ':443 ' | wc -l) processo(s)"
echo "Porta 5000 (Backend): $(ss -tlnp | grep ':5000 ' | wc -l) processo(s)"
echo "Porta 5432 (PostgreSQL): $(ss -tlnp | grep ':5432 ' | wc -l) processo(s)"
echo ""

# Resumo do status
echo "📊 RESUMO DO STATUS:"
services_ok=0
total_services=4

systemctl is-active --quiet postgresql && ((services_ok++))
systemctl is-active --quiet nginx && ((services_ok++))
[ "$pm2_status" = "online" ] && ((services_ok++))
[ "$nginx_status" = "200" ] && ((services_ok++))

echo "Serviços funcionando: $services_ok/$total_services"

if [ $services_ok -eq $total_services ]; then
    echo "✅ Todos os serviços estão funcionando corretamente!"
else
    echo "⚠️ Alguns serviços precisam de atenção"
fi 