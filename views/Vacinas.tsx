
import React, { useState } from 'react';
import { MOCK_VACINAS, MOCK_ANIMAIS } from '../constants';

const Vacinas: React.FC = () => {
  const [vacinas] = useState(MOCK_VACINAS);

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Vacinas & Prevenção</h2>
          <p className="text-slate-500 font-medium italic">Gestão proativa de imunização e protocolos sanitários.</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100">
           <i className="fas fa-plus mr-2"></i> Agendar Vacina
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vacina / Vermífugo</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Prevista</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {vacinas.map(v => {
                  const animal = MOCK_ANIMAIS.find(a => a.id === v.animalId);
                  return (
                    <tr key={v.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                           <img src={animal?.fotoUrl} className="w-10 h-10 rounded-xl object-cover" />
                           <span className="font-black text-slate-900">{animal?.nome}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-700">{v.nome}</td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-500">{new Date(v.dataPrevista).toLocaleDateString()}</td>
                      <td className="px-8 py-6">
                         <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border ${
                           v.status === 'OVERDUE' ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' :
                           v.status === 'DONE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                           'bg-amber-50 text-amber-600 border-amber-100'
                         }`}>
                            {v.status === 'OVERDUE' ? 'Atrasada' : v.status === 'DONE' ? 'Aplicada' : 'Pendente'}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button className="text-indigo-600 hover:text-indigo-800 font-black text-[10px] uppercase tracking-widest">Baixar / Registrar</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default Vacinas;
