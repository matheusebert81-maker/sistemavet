
# Pet InfoCare - Open Source Veterinary ERP (Lite Edition)

Sistema de gestão veterinária ultra-leve, modular e 100% independente. Projetado para rodar em servidores próprios (VPS), Raspberry Pi ou computadores locais usando Docker.

## 🚀 Características (Versão Lite)

*   **Zero Dependências Externas:** Não conecta com Google, AWS ou Azure por padrão.
*   **Privacidade Total:** Todos os dados ficam no seu banco PostgreSQL local.
*   **Performance:** Frontend React puro + Nginx Alpine (Imagem Docker < 50MB).
*   **Kiosk Mode Ready:** Pronto para rodar em terminais Linux touch-screen.

---

## 🛠️ Como rodar na sua VPS (Linux)

### Pré-requisitos
*   Docker e Docker Compose instalados.

### Passo 1: Subir o Sistema
Execute o comando abaixo na raiz do projeto:

```bash
docker-compose up -d --build
```

Isso iniciará:
1.  **Frontend:** Nginx servindo a aplicação na porta `8080`.
2.  **Database:** PostgreSQL na porta `5432` (isolado na rede Docker).

### Passo 2: Acessar
Abra seu navegador em: `http://localhost:8080` ou `http://SEU_IP_VPS:8080`

---

## 🖥️ Modo Web App (Kiosk)

Para transformar um computador Linux em um terminal dedicado do Pet InfoCare:

1.  Dê permissão ao script: `chmod +x start_kiosk.sh`
2.  Execute: `./start_kiosk.sh`

O sistema abrirá em tela cheia, sem barras de navegação, parecendo um aplicativo nativo.

---

## ☁️ Habilitar Recursos Opcionais (Google AI)

O sistema possui "dois modos". O padrão é o Lite. Se desejar ativar recursos de IA (Resumo de Prontuário, etc):

1.  Edite `config.ts` e mude `USE_GOOGLE_AI: true`.
2.  Adicione a biblioteca `@google/genai` de volta ao `index.html`.
3.  Insira sua API Key nas variáveis de ambiente do Docker.

---

## 📂 Estrutura de Arquivos

*   `/views`: Telas do sistema (Agenda, Prontuário, Financeiro).
*   `/database`: Configurações de conexão local.
*   `nginx.conf`: Configuração do servidor web de alta performance.
*   `docker-compose.yml`: Orquestração dos containers.
