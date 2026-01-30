import { createClient } from '@supabase/supabase-js';

// Tenta pegar as variáveis de ambiente de forma segura.
const getEnv = () => {
  try {
    // @ts-ignore
    return (import.meta && import.meta.env) ? import.meta.env : {};
  } catch (e) {
    return {};
  }
};

const env = getEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Helper para verificar conexão
 */
export const checkConnection = async () => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('tenants').select('count', { count: 'exact', head: true });
      return !error;
    } catch (e) {
      console.warn("Supabase connection check failed:", e);
      return false;
    }
};