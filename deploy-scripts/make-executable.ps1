# Script PowerShell para preparar os arquivos de deploy
# Execute este script no Windows antes de enviar para a VPS

Write-Host "🔧 Preparando scripts de deploy..." -ForegroundColor Green

# Verificar se estamos na pasta correta
if (!(Test-Path "deploy-scripts")) {
    Write-Host "❌ Pasta deploy-scripts não encontrada!" -ForegroundColor Red
    Write-Host "Execute este script na raiz do projeto forex-signals" -ForegroundColor Yellow
    exit 1
}

# Listar arquivos .sh
$scriptFiles = Get-ChildItem -Path "deploy-scripts" -Filter "*.sh"

if ($scriptFiles.Count -eq 0) {
    Write-Host "❌ Nenhum script .sh encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Scripts encontrados:" -ForegroundColor Cyan
foreach ($file in $scriptFiles) {
    Write-Host "  - $($file.Name)" -ForegroundColor White
}

Write-Host ""
Write-Host "✅ Scripts prontos para upload!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Envie a pasta 'deploy-scripts' para sua VPS" -ForegroundColor White
Write-Host "2. Conecte-se via SSH à VPS" -ForegroundColor White
Write-Host "3. Execute: chmod +x deploy-scripts/*.sh" -ForegroundColor White
Write-Host "4. Execute: ./deploy-scripts/deploy-complete.sh" -ForegroundColor White
Write-Host ""
Write-Host "🌐 COMANDOS PARA VPS:" -ForegroundColor Cyan
Write-Host "# Conectar via SSH" -ForegroundColor Gray
Write-Host "ssh root@SEU_IP_DA_VPS" -ForegroundColor White
Write-Host ""
Write-Host "# Baixar scripts (opção 1)" -ForegroundColor Gray
Write-Host "wget https://github.com/seu-usuario/forex-signals/archive/main.zip" -ForegroundColor White
Write-Host "unzip main.zip" -ForegroundColor White
Write-Host "cd forex-signals-main/deploy-scripts" -ForegroundColor White
Write-Host ""
Write-Host "# Ou upload manual (opção 2)" -ForegroundColor Gray
Write-Host "# Use WinSCP ou FileZilla para enviar a pasta deploy-scripts" -ForegroundColor White
Write-Host ""
Write-Host "# Tornar executável e executar" -ForegroundColor Gray
Write-Host "chmod +x *.sh" -ForegroundColor White
Write-Host "sudo ./deploy-complete.sh" -ForegroundColor White
Write-Host ""
Write-Host "💡 DICA: O script deploy-complete.sh faz todo o processo automaticamente!" -ForegroundColor Yellow 