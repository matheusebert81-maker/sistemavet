
#!/bin/bash

# ==========================================
# PET INFOCARE - SOURCE CODE BUNDLER
# Use este script para gerar um arquivo ZIP do código-fonte
# Ideal para backup de desenvolvimento ou transferência entre IDEs.
# ==========================================

APP_NAME="pet-infocare-source"
DATE=$(date +%Y-%m-%d_%H-%M)
FILENAME="${APP_NAME}_${DATE}.zip"

echo "📦 Iniciando empacotamento do código-fonte..."

# Remove arquivos antigos
rm -f ${APP_NAME}_*.zip

# Cria o zip ignorando node_modules, dist, e logs
zip -r $FILENAME . \
    -x "node_modules/*" \
    -x "dist/*" \
    -x ".git/*" \
    -x "*.log" \
    -x ".DS_Store"

echo "✅ Sucesso! Código-fonte exportado para: $FILENAME"
echo "👉 Este arquivo pode ser aberto diretamente no WebStorm ou VSCode."
