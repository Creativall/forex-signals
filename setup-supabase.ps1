# =====================================================
# CONFIGURAÇÃO AUTOMÁTICA DO SUPABASE - FOREX SIGNALS
# =====================================================

Write-Host "🚀 CONFIGURAÇÃO AUTOMÁTICA DO SUPABASE" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Informações do projeto
$PROJECT_ID = "gjfdtrmxinexrgxwixam"
$PROJECT_URL = "https://supabase.com/dashboard/project/$PROJECT_ID"
$SQL_EDITOR_URL = "$PROJECT_URL/sql/new"

Write-Host ""
Write-Host "📊 Projeto ID: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "🌐 Dashboard: $PROJECT_URL" -ForegroundColor Yellow

# Verificar configuração
$envPath = "backend\.env"
if (Test-Path $envPath) {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Arquivo .env não encontrado" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 COPIANDO SQL PARA ÁREA DE TRANSFERÊNCIA..." -ForegroundColor Cyan

# Copiar SQL para clipboard
$sqlPath = "backend\database_schema.sql"
if (Test-Path $sqlPath) {
    Get-Content $sqlPath -Raw | Set-Clipboard
    Write-Host "✅ SQL copiado!" -ForegroundColor Green
} else {
    Write-Host "❌ Arquivo database_schema.sql não encontrado" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🌐 ABRINDO SQL EDITOR..." -ForegroundColor Cyan
Start-Process $SQL_EDITOR_URL

Write-Host ""
Write-Host "📝 INSTRUÇÕES:" -ForegroundColor Yellow
Write-Host "1. O SQL Editor abriu no seu navegador" -ForegroundColor White
Write-Host "2. Cole o SQL com Ctrl+V" -ForegroundColor White
Write-Host "3. Clique em 'Run' para executar" -ForegroundColor White
Write-Host "4. Verifique se aparece 'Success'" -ForegroundColor White

Write-Host ""
Read-Host "Pressione Enter após executar o SQL no navegador"

Write-Host ""
Write-Host "🎉 CONFIGURAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 EXECUTE AGORA:" -ForegroundColor Yellow
Write-Host "npm start" -ForegroundColor White
Write-Host ""
Write-Host "🔗 ACESSE:" -ForegroundColor Yellow  
Write-Host "http://localhost:3000" -ForegroundColor White 