
import { AuditLog, LogAction } from '../types';

// logService.ts: Serviço para gerenciar o log de auditoria imutável com uso correto de branchId e LogAction

// Em um aplicativo real, isso seria uma chamada de API com RLS (Segurança em Nível de Linha)
const LOGS: AuditLog[] = [];

// Adicionado 'reason' (motivo) ao objeto de dados para permitir capturar motivações para mudanças
export const logAction = (
  branchId: string,
  userId: string,
  action: LogAction,
  resource: string,
  targetId: string,
  data: { old?: any; new?: any; reason?: string } = {}
) => {
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    branchId,
    userId,
    action,
    resource,
    targetId,
    oldData: data.old,
    newData: data.new,
    reason: data.reason,
    createdAt: new Date().toISOString()
  };

  LOGS.push(log);
  
  // Simulação de imutabilidade - estritamente console log para auditoria
  console.group(`[AUDIT_LOG] ${action} em ${resource}`);
  console.log(`Unidade (Branch): ${branchId}`);
  console.log(`Usuário: ${userId}`);
  console.log(`Alvo: ${targetId}`);
  if (data.old) console.log('Dados Antigos:', data.old);
  if (data.new) console.log('Dados Novos:', data.new);
  if (data.reason) console.log('Motivo:', data.reason);
  console.groupEnd();

  return log;
};

export const getAuditLogs = () => {
  return [...LOGS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};
