
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { SOAPRecord } from '../types';
import { sanitizeInput, validateRequiredFields } from '../utils/security';

const Prontuario: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const animalIdParam = searchParams.get('animalId');
  const appointmentIdParam = searchParams.get('appointmentId');
  
  const { animals, tutors, medicalRecords, saveMedicalRecord, currentUser } = useApp();

  // Estado Principal
  const [selectedAnimal, setSelectedAnimal] = useState(animals[0]);
  const [activeAccordions, setActiveAccordions] = useState<string[]>(['client_info', 'anamneses']);
  const [viewMode, setViewMode] = useState<'OVERVIEW' | 'NEW_RECORD'>(appointmentIdParam ? 'NEW_RECORD' : 'OVERVIEW');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Novo estado para feedback seguro
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Estado para controle do histórico na tela de nova consulta
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  // Estado para Modal de Agendamento de Procedimento
  const [isProcedureModalOpen, setIsProcedureModalOpen] = useState(false);
  const [procedureData, setProcedureData] = useState({
      type: '',
      date: '',
      notes: ''
  });

  // Dados Relacionados
  const tutor = tutors.find(t => t.id === selectedAnimal?.tutorId);
  const historico = medicalRecords.filter(h => h.animalId === selectedAnimal?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Form SOAP
  const [soap, setSoap] = useState<Omit<SOAPRecord, 'id' | 'date'>>({ 
    subjective: '', objective: '', assessment: '', plan: '',
    animalId: '', vetId: currentUser?.id || '', appointmentId: appointmentIdParam || ''
  });
  
  useEffect(() => {
    if (animalIdParam) {
        const animal = animals.find(a => a.id === animalIdParam);
        if (animal) {
            setSelectedAnimal(animal);
            setSoap(prev => ({ ...prev, animalId: animal.id }));
        } else {
            console.warn("Animal ID inválido na URL");
        }
    }
  }, [animalIdParam, animals]);

  const toggleAccordion = (id: string) => {
    if (activeAccordions.includes(id)) {
      setActiveAccordions(activeAccordions.filter(item => item !== id));
    } else {
      setActiveAccordions([...activeAccordions, id]);
    }
  };

  const toggleHistoryItem = (id: string) => {
      setExpandedHistoryId(expandedHistoryId === id ? null : id);
  };

  const handleSaveRecord = async () => {
      setErrorMsg(null);
      setIsSaving(true);
      setIsSuccess(false);

      try {
        // 1. Validação de Campos Obrigatórios
        const missingFields = validateRequiredFields(soap, ['subjective', 'plan', 'animalId']);
        if (missingFields.length > 0) {
            throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
        }

        // 2. Validação de Segurança (Vet Logado)
        if (!currentUser?.id) {
            throw new Error("Sessão inválida. Faça login novamente.");
        }

        // 3. Sanitização de Inputs (Anti-XSS)
        const sanitizedSoap = {
            ...soap,
            subjective: sanitizeInput(soap.subjective),
            objective: sanitizeInput(soap.objective),
            assessment: sanitizeInput(soap.assessment),
            plan: sanitizeInput(soap.plan),
            vetId: currentUser.id
        };
        
        // 4. Persistência
        await saveMedicalRecord(sanitizedSoap);
        
        // 5. Feedback Visual Seguro (Sem innerHTML)
        setIsSuccess(true);
        setTimeout(() => {
           setViewMode('OVERVIEW');
           setSoap({ subjective: '', objective: '', assessment: '', plan: '', animalId: selectedAnimal.id, vetId: currentUser.id, appointmentId: '' });
           setIsSaving(false);
           setIsSuccess(false);
        }, 1500);

      } catch (err: any) {
        console.error("Erro ao salvar prontuário:", err);
        setErrorMsg(err.message || "Erro desconhecido ao salvar.");
        setIsSaving(false);
      }
  };

  const handleScheduleProcedure = (e: React.FormEvent) => {
      e.preventDefault();
      if(!procedureData.type || !procedureData.date) {
          alert("Por favor, selecione o procedimento e a data.");
          return;
      }
      
      // Simulação de salvamento
      console.log("Agendando procedimento:", { ...procedureData, animalId: selectedAnimal.id });
      alert(`Procedimento agendado com sucesso!\n${procedureData.type} para ${new Date(procedureData.date).toLocaleString()}`);
      
      setIsProcedureModalOpen(false);
      setProcedureData({ type: '', date: '', notes: '' });
  };

  const AccordionHeader = ({ id, title, icon }: { id: string, title: string, icon: string }) => {
      const isOpen = activeAccordions.includes(id);
      return (
          <button 
            onClick={() => toggleAccordion(id)}
            className="w-full bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:bg-slate-50 transition-all mb-2"
          >
              <div className="flex items-center space-x-3">
                  <i className={`fas ${icon} text-slate-500 text-lg w-6 text-center`}></i>
                  <span className="font-bold text-slate-700 text-sm">{title}</span>
              </div>
              <i className={`fas fa-chevron-down text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
          </button>
      );
  };

  // MODO: NOVA CONSULTA (SOAP)
  if (viewMode === 'NEW_RECORD') {
      return (
          <div className="p-8 bg-slate-50 min-h-screen animate-in fade-in">
              <div className="max-w-5xl mx-auto bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
                      <div>
                        <h2 className="text-2xl font-black text-slate-800">Atendimento Clínico</h2>
                        <p className="text-sm text-slate-500 font-bold">Paciente: {selectedAnimal?.nome}</p>
                      </div>
                      <button onClick={() => setViewMode('OVERVIEW')} className="text-slate-400 hover:text-rose-500 font-bold uppercase text-xs">
                          <i className="fas fa-times mr-2"></i> Cancelar
                      </button>
                  </div>
                  
                  {errorMsg && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-bold flex items-center">
                        <i className="fas fa-exclamation-triangle mr-3"></i>
                        {errorMsg}
                    </div>
                  )}

                  <div className="space-y-6">
                      <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block flex justify-between">
                              <span>(S)ubjetivo / Anamnese</span>
                              <span className="text-indigo-500">Obrigatório</span>
                          </label>
                          <textarea 
                              className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 h-32 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700"
                              value={soap.subjective}
                              onChange={e => setSoap({...soap, subjective: e.target.value})}
                              placeholder="Queixa principal, histórico recente..."
                              disabled={isSaving}
                          ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="text-xs font-black text-slate-400 uppercase mb-2 block">(O)bjetivo / Exame Físico</label>
                              <textarea 
                                  className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 h-32 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700"
                                  value={soap.objective}
                                  onChange={e => setSoap({...soap, objective: e.target.value})}
                                  placeholder="FC, FR, TPC, Temperatura..."
                                  disabled={isSaving}
                              ></textarea>
                          </div>
                          <div>
                              <label className="text-xs font-black text-slate-400 uppercase mb-2 block">(A)valiação / Suspeita</label>
                              <textarea 
                                  className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 h-32 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700"
                                  value={soap.assessment}
                                  onChange={e => setSoap({...soap, assessment: e.target.value})}
                                  placeholder="Diagnóstico diferencial ou definitivo..."
                                  disabled={isSaving}
                              ></textarea>
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block flex justify-between">
                              <span>(P)lano / Tratamento</span>
                              <span className="text-indigo-500">Obrigatório</span>
                          </label>
                          <textarea 
                              className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 h-32 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700"
                              value={soap.plan}
                              onChange={e => setSoap({...soap, plan: e.target.value})}
                              placeholder="Medicação, exames solicitados, orientações..."
                              disabled={isSaving}
                          ></textarea>
                      </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-4 pt-6 border-t border-slate-100">
                      <button 
                        onClick={handleSaveRecord} 
                        disabled={isSaving}
                        className={`px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-indigo-200 transition-all flex items-center ${isSaving || isSuccess ? 'opacity-80 cursor-wait' : 'hover:bg-indigo-700 hover:scale-105'}`}
                      >
                          {isSuccess ? (
                            <>
                                <i className="fas fa-check mr-2"></i> Salvo com Sucesso!
                            </>
                          ) : isSaving ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-2"></i> Salvando...
                            </>
                          ) : (
                            'Finalizar Atendimento'
                          )}
                      </button>
                  </div>

                  {/* SEÇÃO: HISTÓRICO DO PACIENTE (REFERÊNCIA) */}
                  <div className="mt-12 pt-8 border-t-2 border-slate-100">
                      <h3 className="text-lg font-black text-slate-700 mb-6 flex items-center">
                          <i className="fas fa-history mr-3 text-slate-400"></i>
                          Histórico Prévio (Referência)
                      </h3>
                      
                      {historico.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            Nenhum registro histórico encontrado para este paciente.
                        </div>
                      ) : (
                        <div className="space-y-4">
                            {historico.map(rec => {
                                const isExpanded = expandedHistoryId === rec.id;
                                return (
                                    <div key={rec.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:border-indigo-200">
                                        <button 
                                            onClick={() => toggleHistoryItem(rec.id)}
                                            className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-indigo-50/30 transition-colors text-left"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                                                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                                                    {new Date(rec.date).toLocaleDateString()}
                                                </span>
                                                <div className="mt-2 md:mt-0">
                                                    <span className="block text-sm font-bold text-slate-700">
                                                        {rec.assessment || 'Sem diagnóstico definido'}
                                                    </span>
                                                    <span className="block text-xs text-slate-500 truncate max-w-md">
                                                        {rec.subjective.substring(0, 60)}...
                                                    </span>
                                                </div>
                                            </div>
                                            <i className={`fas fa-chevron-down text-slate-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`}></i>
                                        </button>
                                        
                                        {isExpanded && (
                                            <div className="p-6 bg-white border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-200">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Subjetivo</p>
                                                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">{rec.subjective}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Objetivo</p>
                                                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">{rec.objective}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Avaliação</p>
                                                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">{rec.assessment}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Plano</p>
                                                    <p className="text-sm font-bold text-indigo-700 leading-relaxed bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">{rec.plan}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                      )}
                  </div>
              </div>
          </div>
      )
  }

  // MODO: VISUALIZAÇÃO (DASHBOARD DO PACIENTE)
  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen space-y-6 font-sans text-slate-600">
      
      {/* 1. Header Paciente */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start justify-between relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-purple-400"></div>
         
         <div className="flex flex-col md:flex-row items-center md:space-x-8 w-full z-10">
             <div className="w-28 h-28 rounded-full border-4 border-slate-100 shadow-xl overflow-hidden bg-slate-200">
                 <img src={selectedAnimal?.fotoUrl || `https://ui-avatars.com/api/?name=${selectedAnimal?.nome}&background=random`} className="w-full h-full object-cover" />
             </div>
             
             <div className="mt-4 md:mt-0 text-center md:text-left flex-1 space-y-2">
                 <div>
                     <h1 className="text-3xl font-black text-slate-900 leading-none">{selectedAnimal?.nome}</h1>
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                         {selectedAnimal?.raca} • {selectedAnimal?.sexo} • {selectedAnimal?.peso}kg
                     </p>
                 </div>
                 
                 <div className="inline-flex items-center space-x-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                     <div className="text-center">
                         <p className="text-[9px] font-black uppercase text-slate-400">Tutor</p>
                         <p className="text-xs font-bold text-slate-700">{tutor?.nome}</p>
                     </div>
                     <div className="w-px h-6 bg-slate-200"></div>
                     <div className="text-center">
                         <p className="text-[9px] font-black uppercase text-slate-400">Contato</p>
                         <p className="text-xs font-bold text-slate-700">{tutor?.telefone}</p>
                     </div>
                 </div>
             </div>

             <div className="flex flex-col space-y-3">
                 <button 
                    onClick={() => setViewMode('NEW_RECORD')}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center"
                 >
                     <i className="fas fa-plus mr-2"></i> Novo Atendimento
                 </button>
                 <button 
                    onClick={() => setIsProcedureModalOpen(true)}
                    className="px-6 py-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl font-bold text-xs uppercase hover:bg-indigo-50 transition-all flex items-center justify-center"
                 >
                    <i className="fas fa-calendar-plus mr-2"></i> Agendar Procedimento
                 </button>
                 <button 
                    onClick={() => navigate('/comandas')}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase hover:bg-slate-50 transition-all flex items-center justify-center"
                 >
                     <i className="fas fa-receipt mr-2"></i> Financeiro
                 </button>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Timeline de Histórico (Central) */}
          <div className="lg:col-span-8 space-y-4">
              <h3 className="text-lg font-black text-slate-800 px-2">Histórico Clínico</h3>
              
              {historico.length > 0 ? historico.map(record => (
                  <div key={record.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-6">
                          <div>
                              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Consulta</span>
                              <h4 className="font-black text-slate-800 text-xl mt-2">
                                {new Date(record.date).toLocaleDateString()}
                              </h4>
                              <p className="text-xs font-bold text-slate-400">{new Date(record.date).toLocaleTimeString()}</p>
                          </div>
                          <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                              <i className="fas fa-print"></i>
                          </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase">Anamnese</p>
                              <p className="text-sm font-medium text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">{record.subjective}</p>
                          </div>
                          <div className="space-y-1">
                               <p className="text-[10px] font-black text-slate-400 uppercase">Diagnóstico</p>
                               <p className="text-sm font-medium text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">{record.assessment}</p>
                          </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-50">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tratamento / Plano</p>
                          <p className="text-sm font-bold text-indigo-700">{record.plan}</p>
                      </div>
                  </div>
              )) : (
                  <div className="bg-white rounded-[2rem] p-10 text-center border-2 border-dashed border-slate-200">
                      <i className="fas fa-folder-open text-4xl text-slate-200 mb-4"></i>
                      <p className="font-bold text-slate-400">Nenhum histórico registrado.</p>
                      <button onClick={() => setViewMode('NEW_RECORD')} className="mt-4 text-indigo-600 text-xs font-black uppercase hover:underline">Iniciar Primeiro Atendimento</button>
                  </div>
              )}
          </div>

          {/* Sidebar Auxiliar */}
          <div className="lg:col-span-4 space-y-4">
              <AccordionHeader id="vacinas" title="Carteira de Vacinação" icon="fa-syringe" />
              <AccordionHeader id="exames" title="Resultados de Exames" icon="fa-microscope" />
              <AccordionHeader id="arquivos" title="Anexos e Imagens" icon="fa-paperclip" />
          </div>
      </div>

      {/* Modal de Agendamento de Procedimento */}
      {isProcedureModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 relative">
              <button 
                onClick={() => setIsProcedureModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
              >
                 <i className="fas fa-times"></i>
              </button>

              <h3 className="text-xl font-black text-slate-900 mb-6">Agendar Procedimento</h3>
              
              <form onSubmit={handleScheduleProcedure} className="space-y-5">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Tipo de Procedimento</label>
                    <select 
                      className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                      value={procedureData.type}
                      onChange={(e) => setProcedureData({...procedureData, type: e.target.value})}
                      required
                    >
                        <option value="">Selecione...</option>
                        <option value="Cirurgia">Cirurgia</option>
                        <option value="Exame de Imagem">Exame de Imagem (RX/US)</option>
                        <option value="Exame Laboratorial">Exame Laboratorial</option>
                        <option value="Limpeza de Tártaro">Limpeza de Tártaro</option>
                        <option value="Curativo / Sedação">Curativo / Sedação</option>
                    </select>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Data e Hora</label>
                    <input 
                      type="datetime-local"
                      className="w-full p-4 bg-slate-50 rounded-xl font-bold text-sm text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                      value={procedureData.date}
                      onChange={(e) => setProcedureData({...procedureData, date: e.target.value})}
                      required
                    />
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Observações</label>
                    <textarea 
                      className="w-full p-4 bg-slate-50 rounded-xl font-medium text-sm text-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                      placeholder="Instruções de preparo, jejum, etc..."
                      value={procedureData.notes}
                      onChange={(e) => setProcedureData({...procedureData, notes: e.target.value})}
                    ></textarea>
                 </div>

                 <div className="pt-4 flex justify-end space-x-3">
                    <button 
                      type="button"
                      onClick={() => setIsProcedureModalOpen(false)}
                      className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase hover:bg-slate-200 transition-all"
                    >
                        Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                    >
                        Agendar
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default Prontuario;
