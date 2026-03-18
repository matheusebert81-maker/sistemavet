import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { SOAPRecord } from '../types';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

const Prontuario: React.FC = () => {
  const { animalId } = useParams<{ animalId: string }>();
  const navigate = useNavigate();
  const { animals, tutors, medicalRecords, vacinas } = useApp();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const animal = animals.find(a => a.id === animalId);
  const tutor = tutors.find(t => t.id === animal?.tutorId);
  
  // Sort history: Newest first
  const sortedHistory = useMemo(() => {
    return [...medicalRecords]
      .filter(r => r.animalId === animalId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [medicalRecords, animalId]);

  const latestRecord = sortedHistory[0];
  const pastHistory = sortedHistory.slice(1).filter(record => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      (record.assessment?.toLowerCase() || '').includes(search) ||
      (record.subjective?.toLowerCase() || '').includes(search)
    );
  });

  const animalVacinas = vacinas.filter(v => v.animalId === animalId);

  const toggleRecord = (id: string) => {
    setSelectedRecordId(selectedRecordId === id ? null : id);
  };

  const SOAPDetail: React.FC<{ record: SOAPRecord, isLatest?: boolean }> = ({ record, isLatest }) => (
    <div className={`space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 ${isLatest ? '' : 'pt-6 mt-4 border-t border-slate-100'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
            <i className="fas fa-comment-medical mr-2 text-slate-300"></i> (S) Subjetivo / Queixa
          </h5>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">{record.subjective}</p>
        </div>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
            <i className="fas fa-search mr-2 text-slate-300"></i> (O) Objetivo / Exame
          </h5>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">{record.objective}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl">
            <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center">
                <i className="fas fa-stethoscope mr-2"></i> (A) Diagnóstico
            </h5>
            <p className="text-sm text-indigo-900 font-bold">{record.assessment}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
            <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center">
                <i className="fas fa-clipboard-list mr-2"></i> (P) Conduta / Plano
            </h5>
            <p className="text-sm text-emerald-900 font-semibold whitespace-pre-wrap">{record.plan}</p>
        </div>
      </div>
    </div>
  );

  if (!animal) {
    return (
      <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4">
           <i className="fas fa-search text-rose-500 text-2xl"></i>
        </div>
        <h2 className="text-xl font-black text-slate-800">Paciente não encontrado.</h2>
        <button onClick={() => navigate('/dashboard')} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Voltar</button>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 space-y-10 animate-in fade-in duration-500 bg-slate-50/50 min-h-screen">
      {/* Header Profile */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm">
            <i className="fas fa-arrow-left text-slate-500"></i>
          </button>
          <div className="flex items-center space-x-5">
            <div className="relative">
              <img src={animal.fotoUrl} className="w-20 h-20 rounded-[2rem] object-cover border-4 border-white shadow-xl" alt={animal.nome} />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                 <i className="fas fa-check text-[10px] text-white"></i>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{animal.nome}</h2>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">#{animal.matricula}</span>
              </div>
              <p className="text-slate-500 font-bold text-sm">
                <span className="text-indigo-600">{animal.especie}</span> • {animal.raca} • {animal.idade} • {animal.pesoAtual}kg
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
           <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center shadow-sm">
              <i className="fas fa-print mr-2"></i> Imprimir
           </button>
           <button onClick={() => navigate(`/workstation?animalId=${animal.id}`)} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center">
              <i className="fas fa-plus mr-2"></i> Novo Atendimento
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Clinical Column */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Latest Record Card */}
          {latestRecord ? (
            <section className="space-y-6">
              <div className="flex items-center space-x-3 pl-4">
                 <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Última Evolução</h3>
              </div>
              
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                 <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center space-x-4">
                       <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl text-indigo-600 shadow-inner">
                          <i className="fas fa-file-medical"></i>
                       </div>
                       <div>
                          <p className="text-lg font-black text-slate-800 capitalize">
                             {format(new Date(latestRecord.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                          </p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vet ID: {latestRecord.vetId}</p>
                       </div>
                    </div>
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">Atualizado</span>
                 </div>
                 
                 <SOAPDetail record={latestRecord} isLatest />
              </div>
            </section>
          ) : (
            <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center">
              <i className="fas fa-folder-open text-6xl text-slate-200 mb-6"></i>
              <h3 className="text-xl font-black text-slate-800">Sem histórico clínico</h3>
              <p className="text-slate-400 mt-2 max-w-xs">Este paciente ainda não possui evoluções ou atendimentos registrados.</p>
              <button onClick={() => navigate(`/workstation?animalId=${animal.id}`)} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">Iniciar Primeiro Atendimento</button>
            </div>
          )}

          {/* Patient History Section */}
          {sortedHistory.length > 1 && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-4 pt-8 border-t border-slate-200">
                 <div className="flex items-center space-x-3">
                    <div className="w-2 h-6 bg-slate-300 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Histórico de Consultas</h3>
                 </div>
                 
                 <div className="relative w-full sm:w-64">
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
                    <input 
                       type="text" 
                       placeholder="Filtrar histórico..." 
                       className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                       value={searchTerm}
                       onChange={e => setSearchTerm(e.target.value)}
                    />
                 </div>
              </div>

              <div className="space-y-4">
                {pastHistory.map(record => {
                  const hasPrescription = record.plan.toLowerCase().includes('mg') || record.plan.toLowerCase().includes('ml') || record.plan.toLowerCase().includes('receita');
                  const hasExam = record.plan.toLowerCase().includes('exame') || record.plan.toLowerCase().includes('hemograma') || record.plan.toLowerCase().includes('raio');
                  const isOpen = selectedRecordId === record.id;

                  return (
                    <div 
                      key={record.id} 
                      className={`bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden ${isOpen ? 'border-indigo-300 shadow-xl ring-1 ring-indigo-50' : 'border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md'}`}
                    >
                      <div 
                        className="p-6 cursor-pointer flex items-center justify-between group"
                        onClick={() => toggleRecord(record.id)}
                      >
                        <div className="flex items-center space-x-6 flex-1 overflow-hidden">
                          <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border transition-colors ${isOpen ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                             <span className="text-[9px] font-black uppercase leading-none">{format(new Date(record.date), 'MMM', { locale: ptBR })}</span>
                             <span className="text-xl font-black leading-tight">{format(new Date(record.date), 'dd')}</span>
                             <span className="text-[8px] font-bold leading-none mt-0.5">{format(new Date(record.date), 'yyyy')}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-black text-slate-800 text-sm truncate">
                                    {record.assessment || "Atendimento Geral"}
                                </p>
                                {hasPrescription && <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded uppercase">Receita</span>}
                                {hasExam && <span className="bg-purple-100 text-purple-700 text-[9px] font-black px-2 py-0.5 rounded uppercase">Exames</span>}
                            </div>
                            <p className="text-xs text-slate-400 font-medium truncate">
                               <span className="font-bold text-slate-500 uppercase text-[10px] mr-1">Queixa:</span> {record.subjective}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 ml-4">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-indigo-50 text-indigo-600 rotate-180' : 'bg-slate-50 text-slate-300'}`}>
                                <i className="fas fa-chevron-down text-xs"></i>
                           </div>
                        </div>
                      </div>
                      
                      {isOpen && (
                        <div className="px-6 pb-6 animate-in slide-in-from-top-2">
                          <SOAPDetail record={record} />
                        </div>
                      )}
                    </div>
                  );
                })}
                {pastHistory.length === 0 && searchTerm && (
                  <div className="py-10 text-center text-slate-400 italic text-sm bg-white rounded-3xl border border-slate-100">
                      Nenhum registro encontrado para "{searchTerm}".
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Side Context Column */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Tutor Card */}
          {tutor && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10">Tutor Responsável</h4>
              <div className="flex items-center space-x-4 relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-xl border border-slate-200">
                    <i className="fas fa-user"></i>
                 </div>
                 <div className="flex-1">
                    <p className="font-black text-slate-800">{tutor.nome}</p>
                    <p className="text-xs text-slate-500 font-medium flex items-center mt-1">
                       <i className="fas fa-phone-alt mr-2 text-[10px]"></i> {tutor.telefone}
                    </p>
                 </div>
              </div>
              <button className="w-full mt-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-200">
                 Ver Ficha Financeira
              </button>
            </div>
          )}

          {/* Health Markers & Alerts */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Alertas Clínicos</h4>
             <div className="space-y-3">
                <div className="bg-rose-50 p-4 rounded-2xl flex items-start space-x-3 border border-rose-100">
                    <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center text-rose-500 flex-shrink-0">
                       <i className="fas fa-allergies text-sm"></i>
                    </div>
                    <div>
                       <p className="text-xs font-black text-rose-800 uppercase leading-none mt-1">Alergia Grave</p>
                       <p className="text-[10px] text-rose-600 font-bold mt-1">Dipirona e Ivermectina</p>
                    </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl flex items-start space-x-3 border border-amber-100">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-500 flex-shrink-0">
                       <i className="fas fa-exclamation-triangle text-sm"></i>
                    </div>
                    <div>
                       <p className="text-xs font-black text-amber-800 uppercase leading-none mt-1">Comportamento</p>
                       <p className="text-[10px] text-amber-600 font-bold mt-1">Agressivo com manipulação de patas</p>
                    </div>
                </div>
             </div>
          </div>

          {/* Vaccination Portfolio */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-4 right-4 opacity-5">
                <i className="fas fa-syringe text-4xl"></i>
             </div>
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Imunização</h4>
             <div className="space-y-3">
              {animalVacinas.map(vac => (
                 <div key={vac.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all group">
                    <div>
                       <p className="text-xs font-black text-slate-700">{vac.nome}</p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{new Date(vac.dataPrevista).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black ${vac.status === 'DONE' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {vac.status === 'DONE' ? 'OK' : 'PENDENTE'}
                    </span>
                 </div>
              ))}
              {animalVacinas.length === 0 && (
                <div className="text-center py-6">
                   <p className="text-[10px] text-slate-400 font-bold uppercase italic">Nenhum protocolo ativo.</p>
                </div>
              )}
             </div>
             <button onClick={() => navigate('/vacinas')} className="w-full mt-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100">
                Gerenciar Carteira
             </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Prontuario;