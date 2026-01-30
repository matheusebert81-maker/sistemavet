
/**
 * PET INFOCARE - CONFIGURAÇÃO SAAS (HOSTGATOR READY)
 */

declare global {
  interface Window {
    _env_: any;
  }
}

// Carrega variáveis de ambiente injetadas pelo Docker ou Vite
// @ts-ignore
const env = window._env_ || (import.meta && import.meta.env) ? import.meta.env : {};

// Converte string "true"/"false" para booleano
const toBool = (val: string | boolean | undefined) => {
    if (typeof val === 'boolean') return val;
    return val === 'true';
};

export const APP_CONFIG = {
  // Identidade da Instância
  INSTANCE_NAME: env.VITE_INSTANCE_NAME || 'Pet InfoCare Local',
  INSTANCE_ID: env.VITE_INSTANCE_ID || 'local-01',
  
  // Backend
  API_URL: env.VITE_API_URL || '/api',
  ENVIRONMENT: env.MODE || 'development',
  
  FEATURES: {
    // Padrão FALSE para rodar open source sem chave de API
    USE_GOOGLE_AI: toBool(env.VITE_ENABLE_GOOGLE_AI), 
    
    // Padrão FALSE se não houver URL do Supabase definida
    USE_CLOUD_STORAGE: !!env.VITE_SUPABASE_URL,
    
    ENABLE_TELEMETRY: false, 
  },

  AI_CONFIG: {
    PROVIDER: toBool(env.VITE_ENABLE_GOOGLE_AI) ? 'google' : 'local_mock', 
    API_KEY: env.API_KEY || '',
  }
};

// Lógica para detectar se é Local ou SaaS
export const isSelfHosted = () => {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname.includes('192.168') || hostname.includes('127.0.0.1');
};
