
#!/bin/bash

# ==========================================
# EXPORTADOR DE PROJETO OPEN SOURCE
# Execute este script para gerar um ZIP instalável
# ==========================================

APP_NAME="pet-infocare-opensource"
DATE=$(date +%Y-%m-%d)
FILENAME="${APP_NAME}_${DATE}.zip"

echo "📦 Preparando pacote Open Source..."

# Verifica se o zip está instalado
if ! command -v zip &> /dev/null; then
    echo "Erro: 'zip' não está instalado. Instale com 'sudo apt install zip' ou equivalente."
    exit 1
fi

# Remove builds anteriores
rm -f ${APP_NAME}_*.zip

# Cria o zip excluindo pastas pesadas ou de sistema
zip -r $FILENAME . \
    -x "node_modules/*" \
    -x "dist/*" \
    -x ".git/*" \
    -x ".env" \
    -x "*.log" \
    -x ".DS_Store" \
    -x "coverage/*"

echo "========================================"
echo "✅ Pacote criado com sucesso: $FILENAME"
echo "========================================"
echo "Para instalar em outra máquina:"
echo "1. Descompacte o arquivo"
echo "2. Rode 'npm install'"
echo "3. Rode 'npm run dev'"
