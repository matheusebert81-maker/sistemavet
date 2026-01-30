
import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../services/logService';
import { AuditLog, LogAction } from '../types';

const Auditoria: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    // Busca inicial
    setLogs(getAuditLogs());
    
    // Simulação de Polling (consulta periódica) para atualizações em tempo real
    const interval = setInterval(() => {
      setLogs(getAuditLogs());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const getActionColor = (action: LogAction) => {
    switch(action) {
      case LogAction.CREATE: return 'text-emerald-600 bg-emerald-50';
      case LogAction.UPDATE: return 'text-indigo-600 bg-indigo-50';
      case LogAction.DELETE: return 'text-rose-600 bg-rose-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trilha de Auditoria</h2>
          <p className="text-slate-500 font-medium">Histórico imutável de todas as ações no sistema.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center">
             <i className="fas fa-file-export mr-2"></i> Exportar Logs
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 px-8 py-5 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/30">
          <div className="col-span-2">Data/Hora</div>
          <div className="col-span-1">Ação</div>
          <div className="col-span-2">Recurso</div>
          <div className="col-span-2">Usuário</div>
          <div className="col-span-1">Branch</div>
          <div className="col-span-4">Detalhes</div>
        </div>

        <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
          {logs.map(log => (
            <div key={log.id} className="grid grid-cols-12 px-8 py-6 items-center text-sm hover:bg-slate-50/50 transition-colors">
              <div className="col-span-2 font-medium text-slate-500">
                {new Date(log.createdAt).toLocaleString()}
              </div>
              <div className="col-span-1">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                  {log.action}
                </span>
              </div>
              <div className="col-span-2 font-bold text-slate-700">
                {log.resource}
              </div>
              <div className="col-span-2 text-slate-600">
                {log.userId}
              </div>
              <div className="col-span-1">
                <span className="text-[10px] font-black text-indigo-400">{log.branchId}</span>
              </div>
              <div className="col-span-4">
                <p className="text-xs text-slate-400 truncate">Target ID: {log.targetId}</p>
                {/* Exibindo o motivo se ele foi fornecido durante a criação do log */}
                {log.reason && (
                  <p className="text-[10px] text-amber-600 font-bold truncate">Motivo: {log.reason}</p>
                )}
                {log.newData && (
                  <p className="text-[10px] text-indigo-500 font-bold truncate">Update: {JSON.stringify(log.newData)}</p>
                )}
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="p-20 text-center text-slate-400">
              <i className="fas fa-fingerprint text-6xl mb-4 opacity-10"></i>
              <p className="font-bold uppercase text-xs tracking-widest">Aguardando atividades do sistema...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auditoria;
