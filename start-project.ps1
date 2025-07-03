# Script PowerShell para iniciar o projeto Indicações Forex com PostgreSQL/Supabase
# Resolve o problema de comandos compostos no PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 INDICAÇÕES FOREX - PostgreSQL/Supabase" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script no diretório raiz do projeto" -ForegroundColor Red
    exit 1
}

# Função para verificar se uma porta está livre
function Test-Port {
    param([int]$Port)
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
        return -not $connection
    } catch {
        return $true
    }
}

# Verificar arquivo .env no backend
Write-Host "🔍 Verificando configuração..." -ForegroundColor Cyan

if (-not (Test-Path "backend/.env")) {
    Write-Host "⚠️  Arquivo .env não encontrado no backend!" -ForegroundColor Yellow
    Write-Host "📝 Criando arquivo .env baseado no template..." -ForegroundColor White
    
    if (Test-Path "backend/env.example") {
        Copy-Item "backend/env.example" "backend/.env"
        Write-Host "✅ Arquivo .env criado!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔧 AÇÃO NECESSÁRIA:" -ForegroundColor Red
        Write-Host "   1. Edite o arquivo backend/.env" -ForegroundColor White
        Write-Host "   2. Configure sua DATABASE_URL do Supabase" -ForegroundColor White
        Write-Host "   3. Configure JWT_SECRET com uma chave forte" -ForegroundColor White
        Write-Host "   4. Execute novamente este script" -ForegroundColor White
        Write-Host ""
        Write-Host "📖 Consulte SUPABASE_SETUP.md para instruções completas" -ForegroundColor Cyan
        exit 1
    } else {
        Write-Host "❌ Template env.example não encontrado!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
}

# Verificar se DATABASE_URL está configurada
$envContent = Get-Content "backend/.env" -Raw
if ($envContent -match "DATABASE_URL=postgresql://postgres:\[SUA-SENHA\]") {
    Write-Host "⚠️  DATABASE_URL ainda não foi configurada!" -ForegroundColor Yellow
    Write-Host "🔧 Configure sua URL do Supabase no arquivo backend/.env" -ForegroundColor White
    Write-Host "📖 Consulte SUPABASE_SETUP.md para instruções" -ForegroundColor Cyan
    exit 1
} else {
    Write-Host "✅ DATABASE_URL configurada" -ForegroundColor Green
}

# Verificar portas
Write-Host ""
Write-Host "🌐 Verificando portas..." -ForegroundColor Cyan

if (-not (Test-Port -Port 3000)) {
    Write-Host "⚠️  Porta 3000 ocupada. Tentando liberá-la..." -ForegroundColor Yellow
    try {
        $process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($process) {
            Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
            Write-Host "✅ Processo na porta 3000 finalizado" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Não foi possível liberar a porta 3000 automaticamente" -ForegroundColor Yellow
    }
}

if (-not (Test-Port -Port 5001)) {
    Write-Host "⚠️  Porta 5001 ocupada. Tentando liberá-la..." -ForegroundColor Yellow
    try {
        $process = Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($process) {
            Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
            Write-Host "✅ Processo na porta 5001 finalizado" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Não foi possível liberar a porta 5001 automaticamente" -ForegroundColor Yellow
    }
}

# Verificar e instalar dependências
Write-Host ""
Write-Host "📦 Verificando dependências..." -ForegroundColor Cyan

# Backend
Write-Host "🔧 Verificando backend..." -ForegroundColor White
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "📥 Instalando dependências do backend..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
    Write-Host "✅ Dependências do backend instaladas!" -ForegroundColor Green
} else {
    Write-Host "✅ Dependências do backend OK" -ForegroundColor Green
}

# Frontend
Write-Host "⚛️  Verificando frontend..." -ForegroundColor White
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "📥 Instalando dependências do frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
    Write-Host "✅ Dependências do frontend instaladas!" -ForegroundColor Green
} else {
    Write-Host "✅ Dependências do frontend OK" -ForegroundColor Green
}

# Verificar se o banco de dados está configurado
Write-Host ""
Write-Host "🗄️  Verificando banco de dados..." -ForegroundColor Cyan

Set-Location backend
$dbTest = node -e "
    require('dotenv').config();
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });
    
    async function test() {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = `$`public`$` AND table_name IN (`$`users`$`, `$`verification_tokens`$`)');
            client.release();
            await pool.end();
            
            if (result.rows.length === 2) {
                console.log('TABLES_OK');
            } else {
                console.log('TABLES_MISSING');
            }
        } catch (error) {
            console.log('CONNECTION_ERROR');
        }
    }
    
    test();
" 2>$null

Set-Location ..

if ($dbTest -eq "TABLES_OK") {
    Write-Host "✅ Banco de dados configurado e tabelas encontradas" -ForegroundColor Green
} elseif ($dbTest -eq "TABLES_MISSING") {
    Write-Host "⚠️  Conexão OK, mas tabelas não encontradas" -ForegroundColor Yellow
    Write-Host "🔧 Executando configuração do banco..." -ForegroundColor White
    
    Set-Location backend
    npm run setup-db
    Set-Location ..
    
    Write-Host "✅ Banco de dados configurado!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro na conexão com banco de dados" -ForegroundColor Red
    Write-Host "🔧 Verifique sua DATABASE_URL no arquivo backend/.env" -ForegroundColor White
    Write-Host "📖 Consulte SUPABASE_SETUP.md para instruções" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  🎉 TUDO PRONTO! INICIANDO SERVIÇOS..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Serviços:" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5001" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Health:   http://localhost:5001/api/health" -ForegroundColor White
Write-Host ""
Write-Host "⏹️  Para parar os serviços, pressione Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Iniciar o projeto
npm start 