
import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { VacinaRecord } from '../types';

const Vacinas: React.FC = () => {
  const { vacinas, animals, updateVacina, addVacina } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'OVERDUE' | 'DONE'>('ALL');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Estados para Modal de Aplicação
  const [selectedVac, setSelectedVac] = useState<VacinaRecord | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyData, setApplyData] = useState({
    dateApplied: new Date().toISOString().split('T')[0],
    nextDoseDate: '',
    batch: '',
    notes: ''
  });

  // Lógica de Alertas e Notificações
  const alerts = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return vacinas.filter(v => {
      if (v.status === 'DONE') return false;
      const date = new Date(v.dataPrevista);
      return date <= nextWeek; // Vencidas ou vencendo em 7 dias
    }).sort((a, b) => new Date(a.dataPrevista).getTime() - new Date(b.dataPrevista).getTime());
  }, [vacinas]);

  const filteredVacinas = vacinas.filter(v => {
    if (filter === 'ALL') return true;
    return v.status === filter;
  });

  const handleOpenApplyModal = (vac: VacinaRecord) => {
    setSelectedVac(vac);
    
    // Sugestão inteligente de próxima dose
    const nextDate = new Date();
    if (vac.nome.toLowerCase().includes('vermífugo')) {
      nextDate.setMonth(nextDate.getMonth() + 4); // +4 meses para vermífugo
    } else {
      nextDate.setFullYear(nextDate.getFullYear() + 1); // +1 ano para vacinas anuais
    }

    setApplyData({
      dateApplied: new Date().toISOString().split('T')[0],
      nextDoseDate: nextDate.toISOString().split('T')[0],
      batch: '',
      notes: ''
    });
    setIsApplyModalOpen(true);
  };

  const handleConfirmApplication = async () => {
    if (!selectedVac) return;

    await updateVacina({
      ...selectedVac,
      status: 'DONE',
      dataPrevista: applyData.dateApplied
    });

    if (applyData.nextDoseDate) {
      await addVacina({
        animalId: selectedVac.animalId,
        nome: selectedVac.nome,
        dataPrevista: applyData.nextDoseDate,
        status: 'PENDING'
      });
    }

    setIsApplyModalOpen(false);
    setSelectedVac(null);
  };

  const simulateNotification = (v: VacinaRecord) => {
    const animal = animals.find(a => a.id === v.animalId);
    alert(`[SIMULAÇÃO] Notificação enviada para o tutor de ${animal?.nome} sobre a vacina ${v.nome}.`);
  };

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Vacinas & Prevenção</h2>
          <p className="text-slate-500 font-medium italic">Gestão proativa de imunização e protocolos sanitários.</p>
        </div>
        
        <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-3 rounded-xl transition-all ${alerts.length > 0 ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-white text-slate-400 border border-slate-200'}`}
              title="Central de Alertas"
            >
                <i className="fas fa-bell"></i>
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {alerts.length}
                  </span>
                )}
            </button>

            <select 
                className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
            >
                <option value="ALL">Todos os Status</option>
                <option value="PENDING">Pendentes</option>
                <option value="OVERDUE">Atrasadas</option>
                <option value="DONE">Aplicadas</option>
            </select>
            
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                <i className="fas fa-plus mr-2"></i> Agendar Vacina
            </button>
        </div>
      </header>

      {/* Painel de Alertas Rápidos (Condicional) */}
      {showNotifications && alerts.length > 0 && (
        <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black text-rose-800 uppercase tracking-widest flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i> Atenção: Vacinas Vencidas ou Próximas
            </h3>
            <button onClick={() => setShowNotifications(false)} className="text-rose-400 hover:text-rose-600">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alerts.map(v => {
              const animal = animals.find(a => a.id === v.animalId);
              const isOverdue = new Date(v.dataPrevista) < new Date();
              return (
                <div key={v.id} className="bg-white p-4 rounded-2xl border border-rose-200 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{animal?.nome}</p>
                    <p className="text-[10px] font-black text-rose-500 uppercase">{v.nome} • {isOverdue ? 'Vencida' : 'Vence em breve'}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{new Date(v.dataPrevista).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => simulateNotification(v)}
                    className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"
                    title="Notificar Tutor"
                  >
                    <i className="fas fa-paper-plane text-xs"></i>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
              {filteredVacinas.length > 0 ? filteredVacinas.map(v => {
                const animal = animals.find(a => a.id === v.animalId);
                const isOverdue = new Date(v.dataPrevista) < new Date() && v.status !== 'DONE';
                
                return (
                  <tr key={v.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                            <img src={animal?.fotoUrl || `https://ui-avatars.com/api/?name=${animal?.nome}&background=random`} className="w-full h-full object-cover" />
                         </div>
                         <span className="font-black text-slate-900">{animal?.nome || 'Paciente Desconhecido'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-700">
                        {v.nome}
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-500">
                        {new Date(v.dataPrevista).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border ${
                         v.status === 'DONE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                         isOverdue ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' :
                         'bg-amber-50 text-amber-600 border-amber-100'
                       }`}>
                          {v.status === 'DONE' ? 'Aplicada' : isOverdue ? 'Atrasada' : 'Pendente'}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end space-x-2">
                        {v.status !== 'DONE' && (
                           <>
                             <button 
                                onClick={() => simulateNotification(v)}
                                className="p-3 bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                                title="Enviar Alerta ao Tutor"
                             >
                               <i className="fas fa-envelope text-xs"></i>
                             </button>
                             <button 
                                onClick={() => handleOpenApplyModal(v)}
                                className="bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
                             >
                                 Dar Baixa / Aplicar
                             </button>
                           </>
                        )}
                        {v.status === 'DONE' && (
                           <span className="text-emerald-500 font-black text-[10px] uppercase">
                               <i className="fas fa-check-double mr-1"></i> Concluído
                           </span>
                        )}
                       </div>
                    </td>
                  </tr>
                );
              }) : (
                  <tr>
                      <td colSpan={5} className="py-20 text-center text-slate-400">
                          <i className="fas fa-syringe text-4xl mb-4 opacity-10"></i>
                          <p className="font-bold uppercase text-xs tracking-widest">Nenhuma vacina encontrada no filtro selecionado.</p>
                      </td>
                  </tr>
              )}
            </tbody>
         </table>
      </div>

      {/* Modal de Baixa de Vacina */}
      {isApplyModalOpen && selectedVac && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 relative">
                  <button 
                    onClick={() => setIsApplyModalOpen(false)}
                    className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                  >
                     <i className="fas fa-times"></i>
                  </button>

                  <h3 className="text-2xl font-black text-slate-900 mb-2">Registrar Aplicação</h3>
                  <p className="text-sm text-slate-500 font-medium mb-8">
                    Paciente: <span className="font-bold text-slate-700">{animals.find(a => a.id === selectedVac.animalId)?.nome}</span> • 
                    Vacina: <span className="font-bold text-slate-700">{selectedVac.nome}</span>
                  </p>
                  
                  <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Data da Aplicação</label>
                            <input 
                              type="date"
                              className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                              value={applyData.dateApplied}
                              onChange={(e) => setApplyData({...applyData, dateApplied: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-emerald-600 uppercase mb-2 block">Próximo Reforço</label>
                            <input 
                              type="date"
                              className="w-full p-4 bg-emerald-50 rounded-xl font-bold text-sm text-emerald-700 border-none outline-none focus:ring-2 focus:ring-emerald-500"
                              value={applyData.nextDoseDate}
                              onChange={(e) => setApplyData({...applyData, nextDoseDate: e.target.value})}
                            />
                          </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Lote / Fabricante</label>
                        <input 
                          type="text"
                          placeholder="Ex: Lote 1234 - Zoetis"
                          className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                          value={applyData.batch}
                          onChange={(e) => setApplyData({...applyData, batch: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Observações</label>
                        <textarea 
                          className="w-full p-4 bg-slate-50 rounded-xl font-medium text-sm text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                          placeholder="Reação adversa, local da aplicação..."
                          value={applyData.notes}
                          onChange={(e) => setApplyData({...applyData, notes: e.target.value})}
                        ></textarea>
                      </div>
                  </div>

                  <div className="pt-8 flex justify-end space-x-3">
                    <button 
                      onClick={() => setIsApplyModalOpen(false)}
                      className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase hover:bg-slate-200 transition-all"
                    >
                        Cancelar
                    </button>
                    <button 
                      onClick={handleConfirmApplication}
                      className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                    >
                        Confirmar Baixa
                    </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Vacinas;
