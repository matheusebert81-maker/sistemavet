
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { AppointStatus } from '../types';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { appointments, transactions, vacinas, isFeatureLocked, currentUser } = useApp();
  const navigate = useNavigate();

  // Dados Operacionais (Sempre Visíveis)
  const todaysAppointments = appointments.filter(a => {
    return a.status === AppointStatus.PENDING || a.status === AppointStatus.IN_PROGRESS || a.status === AppointStatus.CONFIRMED;
  });

  const pendingIncome = transactions
    .filter(t => t.type === 'INCOME' && t.status === 'PENDING')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Alertas de Vacinas para o Dashboard (Vencidas + Próximas 7 dias)
  const alertVacinasCount = vacinas.filter(v => {
    if (v.status === 'DONE') return false;
    const date = new Date(v.dataPrevista);
    const limit = new Date();
    limit.setDate(limit.getDate() + 7);
    return date <= limit;
  }).length;

  // Paywall Component
  const AnalyticsLock = () => (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6 rounded-[2.5rem]">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
        <i className="fas fa-lock text-slate-400"></i>
      </div>
      <p className="text-slate-600 font-bold text-xs uppercase mb-2">Recurso Pro</p>
      <button className="px-6 py-2 bg-slate-800 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
        Liberar
      </button>
    </div>
  );

  return (
    <div className="p-8 md:p-10 bg-slate-50 min-h-screen space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-2">
            Olá, Dr(a). {currentUser?.name?.split(' ')[1] || 'Vet'}! 🐶🐱
          </h1>
          <p className="text-slate-500 font-medium">
            Resumo clínico e operacional da sua unidade.
          </p>
        </div>
        
        <div className="flex space-x-3">
           <button onClick={() => navigate('/agenda')} className="p-4 bg-teal-100 text-teal-700 rounded-2xl hover:bg-teal-200 transition-colors flex items-center shadow-sm">
              <i className="fas fa-calendar-plus text-xl"></i>
           </button>
           <button onClick={() => navigate('/vendas')} className="p-4 bg-orange-100 text-orange-700 rounded-2xl hover:bg-orange-200 transition-colors flex items-center shadow-sm">
              <i className="fas fa-shopping-basket text-xl"></i>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-2 gap-6">
             <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-[2.5rem] shadow-lg text-white relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => navigate('/agenda')}>
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-md">
                         <i className="fas fa-paw"></i>
                      </div>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Hoje</span>
                   </div>
                   <h3 className="text-4xl font-black mb-1">{todaysAppointments.length}</h3>
                   <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Pacientes na Fila</p>
                </div>
                <i className="fas fa-dog absolute -right-5 -bottom-5 text-9xl text-white opacity-10 rotate-12"></i>
             </div>

             <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden cursor-pointer hover:border-teal-200 transition-colors" onClick={() => navigate('/financeiro')}>
                <div className="flex justify-between items-start mb-4">
                   <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center text-2xl">
                      <i className="fas fa-hand-holding-heart"></i>
                   </div>
                   <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Receber</span>
                </div>
                <h3 className="text-4xl font-black text-slate-800 mb-1">R$ {pendingIncome.toLocaleString()}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Aberto (Fiado/Boleto)</p>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800">Próximos Atendimentos</h3>
                <button onClick={() => navigate('/agenda')} className="text-teal-600 font-bold text-xs uppercase hover:underline">Ver Agenda Completa</button>
             </div>
             
             <div className="space-y-4">
                {todaysAppointments.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <i className="fas fa-coffee text-4xl mb-3 text-slate-300"></i>
                    <p className="font-bold">Agenda tranquila por enquanto.</p>
                  </div>
                ) : (
                  todaysAppointments.slice(0, 5).map(apt => (
                    <div key={apt.id} className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-teal-200 hover:bg-teal-50/30 transition-all cursor-pointer" onClick={() => navigate(`/prontuario?animalId=${apt.animalId}&appointmentId=${apt.id}`)}>
                       <div className="w-16 text-center border-r border-slate-200 pr-4 mr-4">
                          <p className="text-lg font-black text-slate-700">{new Date(apt.startTime).getHours()}:{new Date(apt.startTime).getMinutes().toString().padStart(2, '0')}</p>
                       </div>
                       <div className="flex-1">
                          <div className="flex items-center space-x-2">
                             <span className={`w-2 h-2 rounded-full ${apt.type === 'Consulta' ? 'bg-blue-500' : 'bg-orange-500'}`}></span>
                             <h4 className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">Paciente (ID: {apt.animalId})</h4>
                          </div>
                          <p className="text-xs text-slate-500 font-medium ml-4">{apt.type} • {apt.status === 'CONFIRMED' ? 'Confirmado' : 'Aguardando'}</p>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-sm">
                          <i className="fas fa-chevron-right text-xs"></i>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

        <div className="space-y-8">
           
           {/* Widget de Alerta de Vacinas */}
           <div 
            onClick={() => navigate('/vacinas')}
            className={`p-8 rounded-[2.5rem] border cursor-pointer transition-all ${alertVacinasCount > 0 ? 'bg-rose-50 border-rose-100 hover:bg-rose-100' : 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100'}`}
           >
               <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${alertVacinasCount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <i className="fas fa-syringe"></i>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${alertVacinasCount > 0 ? 'bg-rose-200 text-rose-700' : 'bg-emerald-200 text-emerald-700'}`}>
                    Prevenção
                  </span>
               </div>
               <h3 className={`text-xl font-black mb-1 ${alertVacinasCount > 0 ? 'text-rose-800' : 'text-emerald-800'}`}>
                 {alertVacinasCount > 0 ? `${alertVacinasCount} Alertas de Vacina` : 'Imunização em Dia'}
               </h3>
               <p className={`text-xs font-medium ${alertVacinasCount > 0 ? 'text-rose-600/80' : 'text-emerald-600/80'}`}>
                 {alertVacinasCount > 0 ? 'Vacinas vencidas ou próximas do vencimento.' : 'Nenhum paciente com reforço atrasado.'}
               </p>
           </div>

           {/* Campanhas Sociais */}
           <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100 relative overflow-hidden">
               <h3 className="text-lg font-black text-orange-800 mb-4 relative z-10">Campanha Social</h3>
               <div className="space-y-3 relative z-10">
                   <div className="bg-white p-3 rounded-xl shadow-sm flex items-center space-x-3">
                       <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs">
                           <i className="fas fa-syringe"></i>
                       </div>
                       <div>
                           <p className="font-bold text-slate-700 text-xs">Vacinação Solidária</p>
                           <p className="text-[10px] text-slate-400">Sábado, 09:00</p>
                       </div>
                   </div>
                   <div className="bg-white p-3 rounded-xl shadow-sm flex items-center space-x-3">
                       <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs">
                           <i className="fas fa-scissors"></i>
                       </div>
                       <div>
                           <p className="font-bold text-slate-700 text-xs">Mutirão Castração</p>
                           <p className="text-[10px] text-slate-400">Domingo, 08:00</p>
                       </div>
                   </div>
               </div>
               <i className="fas fa-heart absolute -bottom-6 -right-6 text-9xl text-orange-200/50 rotate-12"></i>
           </div>

           <div className="relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
              {isFeatureLocked('ANALYTICS') && <AnalyticsLock />}
              
              <div className="opacity-30 blur-sm pointer-events-none">
                 <h3 className="text-lg font-black text-slate-800 mb-6">Faturamento Social</h3>
                 <div className="flex items-end space-x-2 h-40">
                    <div className="w-8 bg-teal-200 h-[40%] rounded-t-lg"></div>
                    <div className="w-8 bg-teal-300 h-[60%] rounded-t-lg"></div>
                    <div className="w-8 bg-teal-500 h-[80%] rounded-t-lg"></div>
                    <div className="w-8 bg-teal-600 h-[100%] rounded-t-lg"></div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
