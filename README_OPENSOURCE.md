
# Pet InfoCare - Guia de Execução Open Source (Local)

Este guia explica como rodar o sistema **Pet InfoCare** em um ambiente totalmente local, sem dependências do Google Gemini, Supabase ou hospedagem em nuvem.

O sistema foi arquitetado como **Offline-First**, utilizando o navegador (IndexedDB) como banco de dados principal, tornando a execução local extremamente simples.

---

## 1. Como Baixar Todo o Código

### 🪟 Para Usuários Windows
1.  Localize a pasta `scripts/` no projeto.
2.  Clique com o botão direito no arquivo `export_project.ps1`.
3.  Selecione **"Executar com o PowerShell"**.
4.  Um arquivo `.zip` será criado na raiz do projeto com todo o código fonte limpo.

### 🐧 Para Usuários Linux/Mac
1.  Abra o terminal.
2.  Execute `chmod +x scripts/export_project.sh`.
3.  Execute `./scripts/export_project.sh`.

---

## 2. Configuração de Ambiente (Desvinculando Nuvem)

Para garantir que o sistema não tente conectar ao Google ou Supabase e rode liso no seu PC:

1.  Renomeie o arquivo `.env.example` para `.env` (ou crie um novo).
2.  Deixe as chaves de API vazias ou defina as flags como false:

```env
# .env

# Nome da Instância Local
VITE_INSTANCE_NAME="Pet InfoCare Local"

# Desativar Inteligência Artificial do Google
VITE_ENABLE_GOOGLE_AI=false
API_KEY=""

# Desativar Sincronização em Nuvem (Supabase)
VITE_SUPABASE_URL=""
VITE_SUPABASE_ANON_KEY=""
```

Ao fazer isso, o sistema ativará automaticamente os "Mock Services" (Serviços Simulados) definidos em `config.ts`, permitindo que você teste o prontuário com IA simulada e banco de dados local.

---

## 3. Rodando a Aplicação (Frontend + Banco Local)

O banco de dados principal é o **Dexie.js** (IndexedDB), que roda dentro do seu navegador (Chrome/Edge/Firefox). Não é necessário instalar nada pesado.

### Pré-requisitos
*   [Node.js](https://nodejs.org/) (Baixe a versão LTS - 18 ou superior).

### Passo a Passo
1.  Descompacte o arquivo ZIP gerado.
2.  Abra a pasta no VSCode ou Terminal.
3.  Instale as dependências:
    ```bash
    npm install
    ```
4.  Inicie o servidor local:
    ```bash
    npm run dev
    ```
5.  O navegador abrirá automaticamente em `http://localhost:3000`.

---

## 4. Rodando com Docker (Opcional)

Se você tem Docker Desktop instalado no Windows e quer simular um servidor real:

1.  Na raiz do projeto, abra o terminal.
2.  Execute:
    ```bash
    docker-compose up -d --build
    ```
3.  O sistema estará disponível em `http://localhost:8080`.

---

## 5. Estrutura do Projeto

*   **`services/db.ts`**: Banco de dados local (funciona offline).
*   **`services/geminiService.ts`**: Controlador da IA. Se `VITE_ENABLE_GOOGLE_AI` for false, ele retorna textos pré-prontos para teste.
*   **`views/`**: Todas as telas do sistema (Agenda, Prontuário, Financeiro).

## 6. Backup dos Dados

Seus dados ficam salvos no navegador. Para garantir que não perca nada:
1.  No menu lateral do sistema, clique em **"Baixar Sistema"**.
2.  Isso baixará um arquivo `.json` com todos os pacientes e finanças cadastrados localmente.
