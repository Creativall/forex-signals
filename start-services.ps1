# Script para iniciar os serviços do projeto Indicações Forex

Write-Host "Iniciando serviços do Indicações Forex..." -ForegroundColor Green

# Verificar se as portas estão livres
$backend_port = netstat -ano | findstr ":5001"
$frontend_port = netstat -ano | findstr ":3000"

if ($backend_port) {
    Write-Host "Porta 5001 ocupada. Liberando..." -ForegroundColor Yellow
    taskkill /f /im node.exe
}

if ($frontend_port) {
    Write-Host "Porta 3000 ocupada. Liberando..." -ForegroundColor Yellow
    taskkill /f /im node.exe
}

Start-Sleep -Seconds 2

# Iniciar backend
Write-Host "Iniciando backend na porta 5001..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-Command", "cd '$PWD\backend'; npm start" -WindowStyle Minimized

Start-Sleep -Seconds 5

# Iniciar frontend
Write-Host "Iniciando frontend na porta 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-Command", "cd '$PWD\frontend'; npm start" -WindowStyle Minimized

Write-Host "Serviços iniciados!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend: http://localhost:5001" -ForegroundColor White

# Aguardar alguns segundos para verificar se os serviços subiram
Start-Sleep -Seconds 10

# Verificar se os serviços estão rodando
$backend_running = netstat -ano | findstr ":5001.*LISTENING"
$frontend_running = netstat -ano | findstr ":3000.*LISTENING"

if ($backend_running) {
    Write-Host "✓ Backend rodando na porta 5001" -ForegroundColor Green
} else {
    Write-Host "✗ Erro ao iniciar backend" -ForegroundColor Red
}

if ($frontend_running) {
    Write-Host "✓ Frontend rodando na porta 3000" -ForegroundColor Green
} else {
    Write-Host "✗ Erro ao iniciar frontend" -ForegroundColor Red
}

Write-Host "Pressione qualquer tecla para continuar..." -ForegroundColor Yellow
Read-Host 