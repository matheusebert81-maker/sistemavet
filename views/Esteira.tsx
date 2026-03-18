
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { WorkflowStage } from '../types';

const STAGES = [
  { id: WorkflowStage.RECEPTION, label: 'Recepção', icon: 'fa-id-card' },
  { id: WorkflowStage.TRIAGE, label: 'Triagem', icon: 'fa-heart-pulse' },
  { id: WorkflowStage.CONSULTATION, label: 'Consulta', icon: 'fa-stethoscope' },
  { id: WorkflowStage.EXAMS, label: 'Exames', icon: 'fa-microscope' },
  { id: WorkflowStage.CHECKOUT, label: 'Checkout', icon: 'fa-cash-register' },
];

const Esteira: React.FC = () => {
  const { workflowItems: items, animals, updateWorkflowItemStage } = useApp();

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Esteira de Atendimento</h2>
        <p className="text-slate-500 font-medium">Fluxo operacional em tempo real • Sem tráfego de papel.</p>
      </header>

      <div className="flex space-x-6 overflow-x-auto pb-10 custom-scrollbar">
        {STAGES.map(stage => (
          <div key={stage.id} className="min-w-[320px] bg-slate-100/50 rounded-[2.5rem] p-6 border border-slate-200/50">
             <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                      <i className={`fas ${stage.icon}`}></i>
                   </div>
                   <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">{stage.label}</h4>
                </div>
                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                  {items.filter(i => i.currentStage === stage.id).length}
                </span>
             </div>

             <div className="space-y-4">
                {items.filter(i => i.currentStage === stage.id).map(item => {
                  const animal = animals.find(a => a.id === item.animalId);
                  return (
                    <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-move group">
                       <div className="flex items-center space-x-4 mb-4">
                          <img src={animal?.fotoUrl} className="w-12 h-12 rounded-2xl object-cover" />
                          <div>
                             <h5 className="font-black text-slate-900">{animal?.nome}</h5>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{animal?.raca}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${
                            item.priority === 'HIGH' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {item.priority}
                          </span>
                          <div className="flex space-x-1">
                             <button 
                               onClick={() => {
                                 const idx = STAGES.findIndex(s => s.id === stage.id);
                                 if (idx < STAGES.length - 1) updateWorkflowItemStage(item.id, STAGES[idx+1].id);
                               }}
                               className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                             >
                                <i className="fas fa-chevron-right text-xs"></i>
                             </button>
                          </div>
                       </div>
                    </div>
                  );
                })}
                {items.filter(i => i.currentStage === stage.id).length === 0 && (
                  <div className="py-20 flex flex-col items-center justify-center opacity-20 grayscale">
                    <i className={`fas ${stage.icon} text-4xl mb-4`}></i>
                    <p className="text-[10px] font-black uppercase tracking-widest">Setor Vazio</p>
                  </div>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Esteira;
