
#!/bin/bash

# SCRIPT DE INICIALIZAÇÃO KIOSK MODE (LINUX)
# Use este script em sua VPS ou Terminal Linux para abrir o sistema como um App nativo.

# 1. Aguarda a rede estar disponível
echo "Aguardando rede..."
sleep 5

# 2. Desativa proteção de tela e economia de energia (Ideal para painéis)
xset s noblank
xset s off
xset -dpms

# 3. Oculta o cursor do mouse se ocioso (opcional, requer 'unclutter')
# unclutter -idle 0.1 -root &

# 4. Inicia o Chromium em modo Kiosk
# --kiosk: Tela cheia, sem barras de endereço
# --no-first-run: Evita assistentes de configuração
# --incognito: Não salva cache local (opcional, remova se quiser persistência)
# http://localhost:8080: Endereço do container Docker

echo "Iniciando Pet InfoCare..."

/usr/bin/chromium-browser \
  --no-first-run \
  --kiosk \
  --app=http://localhost:8080 \
  --start-maximized \
  --disable-translate \
  --disable-features=TranslateUI \
  --check-for-update-interval=31536000
