
# ==========================================
# EXPORTADOR DE PROJETO PARA WINDOWS
# ==========================================

$ErrorActionPreference = "SilentlyContinue"
$AppName = "pet-infocare-opensource"
$Date = Get-Date -Format "yyyy-MM-dd"
$ZipName = "$PWD\$AppName_$Date.zip"
$TempDir = "$PWD\temp_export_build"

Write-Host "📦 Preparando pacote Open Source para Windows..." -ForegroundColor Cyan

# 1. Limpeza de builds anteriores
if (Test-Path $TempDir) { Remove-Item -Path $TempDir -Recurse -Force }
if (Test-Path $ZipName) { Remove-Item -Path $ZipName -Force }

# 2. Criar diretório temporário
New-Item -ItemType Directory -Path $TempDir | Out-Null

# 3. Copiar arquivos usando Robocopy (Rápido e robusto para exclusões)
Write-Host "📂 Copiando arquivos (Ignorando node_modules, .git, etc)..." -ForegroundColor Yellow

# /E = Recursivo incluindo vazios
# /XD = Excluir Diretórios
# /XF = Excluir Arquivos
# /NFL /NDL = No File/Dir Log (Silencioso)
robocopy . $TempDir /E /XD node_modules dist .git .vs coverage .idea /XF *.zip *.log .DS_Store .env /NFL /NDL /NJH /NJS

# 4. Comprimir
Write-Host "🗜️  Compactando arquivos..." -ForegroundColor Yellow
Compress-Archive -Path "$TempDir\*" -DestinationPath $ZipName -Force

# 5. Limpar temp
Remove-Item -Path $TempDir -Recurse -Force

Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Pacote criado com sucesso!" -ForegroundColor Green
Write-Host "📁 Arquivo: $ZipName" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host "Instruções:"
Write-Host "1. Extraia o ZIP em uma pasta"
Write-Host "2. Abra o terminal (CMD ou Powershell) na pasta"
Write-Host "3. Rode 'npm install'"
Write-Host "4. Rode 'npm run dev'"
