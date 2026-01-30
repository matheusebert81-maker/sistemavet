
/**
 * Utilitários de Segurança e Validação
 * Previne XSS básico e garante integridade de dados.
 */

// Remove tags HTML e scripts de strings
export const sanitizeInput = (str: string): string => {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
};

// Gera UUID seguro com fallback
export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback para ambientes antigos
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface PasswordStrength {
  score: number; // 0 a 4
  label: string;
  color: string; // Tailwind class bg
  textColor: string; // Tailwind class text
  isSafe: boolean;
}

// Avalia a força da senha
export const assessPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  
  if (!password) {
    return { score: 0, label: '', color: 'bg-slate-200', textColor: 'text-slate-400', isSafe: false };
  }

  // Critérios
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++; // Caracteres especiais

  // Normalização do Score (Max 4 para UI simplificada)
  if (password.length < 6) {
    return { score: 1, label: 'Muito Fraca (Mín. 6 caracteres)', color: 'bg-rose-500', textColor: 'text-rose-500', isSafe: false };
  }

  if (score < 3) {
    return { score: 2, label: 'Fraca', color: 'bg-orange-400', textColor: 'text-orange-400', isSafe: false };
  }

  if (score === 3 || score === 4) {
    return { score: 3, label: 'Média', color: 'bg-yellow-400', textColor: 'text-yellow-500', isSafe: true };
  }

  return { score: 4, label: 'Forte', color: 'bg-emerald-500', textColor: 'text-emerald-500', isSafe: true };
};

// Validação de força básica de senha (Retrocompatibilidade)
export const validatePasswordStrength = (password: string): boolean => {
  const assessment = assessPasswordStrength(password);
  return assessment.isSafe;
};

// Valida se um objeto possui os campos obrigatórios preenchidos
export const validateRequiredFields = (obj: any, fields: string[]): string[] => {
  const errors: string[] = [];
  fields.forEach(field => {
    if (!obj[field] || (typeof obj[field] === 'string' && !obj[field].trim())) {
      errors.push(field);
    }
  });
  return errors;
};

// --- RATE LIMITER (Prevenção de Ataques/Flood) ---
const requestTimestamps: number[] = [];
const LIMIT = 20; // Máximo de requisições
const INTERVAL = 60000; // Por minuto

export const checkRateLimit = (): boolean => {
    const now = Date.now();
    // Remove timestamps antigos
    while (requestTimestamps.length > 0 && requestTimestamps[0] < now - INTERVAL) {
        requestTimestamps.shift();
    }
    
    if (requestTimestamps.length >= LIMIT) {
        console.warn("[Security] Rate limit excedido. Aguarde.");
        return false;
    }

    requestTimestamps.push(now);
    return true;
};
