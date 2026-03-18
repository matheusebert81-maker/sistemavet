
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { AppointStatus } from '../types';

const Agenda: React.FC = () => {
  const { appointments, animals, tutors, updateAppointmentStatus } = useApp();
  const navigate = useNavigate();

  const handleStateTransition = (id: string, nextStatus: AppointStatus) => {
    const item = appointments.find(i => i.id === id);
    if (!item) return;

    updateAppointmentStatus(id, nextStatus);
    
    if (nextStatus === AppointStatus.IN_PROGRESS) {
      // Lógica Vibe: Check-in na Agenda -> Status "Em atendimento" -> Abre Workstation
      navigate(`/workstation?animalId=${item.animalId}&appointmentId=${id}`);
    }
  };

  const getStatusStyle = (status: AppointStatus) => {
    switch(status) {
      case AppointStatus.IN_PROGRESS: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case AppointStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
      case AppointStatus.FINISHED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case AppointStatus.CANCELLED: return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Agenda</h2>
          <p className="text-slate-500 font-medium">Controle de fluxo de pacientes da unidade.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center">
             <i className="fas fa-filter mr-2"></i> Filtrar
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center">
            <i className="fas fa-plus mr-2"></i> Novo Agendamento
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-12 border-b border-slate-100 bg-slate-50 py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <div className="col-span-1">Hora</div>
          <div className="col-span-3">Paciente / Tutor</div>
          <div className="col-span-3">Serviço</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3 text-right">Ações Rápidas</div>
        </div>
        
        <div className="divide-y divide-slate-50">
          {appointments.map((item) => {
            const animal = animals.find(a => a.id === item.animalId);
            const tutor = tutors.find(t => t.id === item.tutorId);
            const hora = new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div key={item.id} className="grid grid-cols-12 items-center py-6 px-8 hover:bg-slate-50/50 transition-colors group">
                <div className="col-span-1 font-black text-slate-900 text-lg">{hora}</div>
                <div className="col-span-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center font-bold text-indigo-600">
                       {animal?.nome[0] || '?'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{animal?.nome || 'Não encontrado'}</p>
                      <p className="text-xs text-slate-400 font-medium">{tutor?.nome || 'Não encontrado'}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">{item.type}</span>
                </div>
                <div className="col-span-2">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="col-span-3 text-right flex justify-end space-x-2">
                  {item.status === AppointStatus.PENDING && (
                    <>
                      <button 
                        onClick={() => handleStateTransition(item.id, AppointStatus.IN_PROGRESS)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-[11px] hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                      >
                        CHECK-IN
                      </button>
                      <button 
                        onClick={() => handleStateTransition(item.id, AppointStatus.CANCELLED)}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <i className="fas fa-times-circle"></i>
                      </button>
                    </>
                  )}
                  {item.status === AppointStatus.IN_PROGRESS && (
                    <button 
                      onClick={() => navigate(`/workstation?animalId=${item.animalId}&appointmentId=${item.id}`)}
                      className="px-4 py-2 bg-amber-500 text-white rounded-xl font-bold text-[11px] hover:bg-amber-600 transition-all shadow-md shadow-amber-100"
                    >
                      REASSUMIR
                    </button>
                  )}
                  {item.status === AppointStatus.FINISHED && (
                    <div className="flex items-center space-x-2 text-emerald-500 font-bold text-xs">
                      <i className="fas fa-check-double"></i>
                      <span>CONCLUÍDO</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Agenda;
