
/**
 * PET INFOCARE - CONFIGURAÇÃO SAAS (HOSTGATOR READY)
 */

declare global {
  interface Window {
    _env_: any;
  }
}

// Carrega variáveis de ambiente injetadas pelo Docker ou Vite
const env = window._env_ || (import.meta as any).env || {};

export const APP_CONFIG = {
  // Identidade da Instância
  INSTANCE_NAME: env.VITE_INSTANCE_NAME || 'Pet InfoCare Cloud',
  INSTANCE_ID: env.VITE_INSTANCE_ID || 'cloud-br-01',
  
  // Backend (Pode ser alterado para o endpoint PHP/Node da HostGator)
  API_URL: env.VITE_API_URL || '/api',
  ENVIRONMENT: env.MODE || 'production',
  
  FEATURES: {
    USE_GOOGLE_AI: false, // Desativado para economizar custos iniciais
    USE_CLOUD_STORAGE: true,
    ENABLE_TELEMETRY: true, // Útil para SaaS para saber quem usa
  },

  AI_CONFIG: {
    PROVIDER: 'none', 
    API_KEY: '',
    MODEL_TEXT: '',
  }
};

// Lógica para detectar se é Local ou SaaS
export const isSelfHosted = () => {
  // Se estiver rodando no domínio oficial, é SaaS. Caso contrário (localhost/IP), é dev/self-hosted.
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname.includes('192.168') || hostname.includes('127.0.0.1');
};
