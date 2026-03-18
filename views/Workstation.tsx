
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { SOAPRecord, Animal } from '../types';
import { sanitizeInput, validateRequiredFields } from '../utils/security';
import { geminiService } from '../services/geminiService';

const Workstation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const animalIdParam = searchParams.get('animalId');
  const appointmentIdParam = searchParams.get('appointmentId');
  
  const { animals, tutors, medicalRecords, saveMedicalRecord, currentUser } = useApp();

  const [animal, setAnimal] = useState<Animal | undefined>(animals[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [soap, setSoap] = useState<Omit<SOAPRecord, 'id' | 'date'>>({ 
    subjective: '', objective: '', assessment: '', plan: '',
    animalId: animalIdParam || '', vetId: currentUser?.id || '', appointmentId: appointmentIdParam || ''
  });

  const tutor = tutors.find(t => t.id === animal?.tutorId);
  const history = medicalRecords.filter(h => h.animalId === animal?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  useEffect(() => {
    const currentAnimal = animals.find(a => a.id === animalIdParam);
    if (currentAnimal) {
        setAnimal(currentAnimal);
        setSoap(prev => ({ ...prev, animalId: currentAnimal.id }));
    } else if (animalIdParam) {
        console.warn("Animal ID from URL not found, defaulting to first animal.");
        setAnimal(animals[0]);
        setSoap(prev => ({ ...prev, animalId: animals[0].id }));
    }
  }, [animalIdParam, animals]);

  const handleGenerateAISuggestion = async () => {
    if (!soap.subjective && !soap.objective) {
      alert("Por favor, preencha os campos 'Subjetivo' e 'Objetivo' para obter uma sugestão da IA.");
      return;
    }
    setIsAiLoading(true);
    setErrorMsg(null);
    try {
      const suggestion = await geminiService.suggestAssessmentAndPlan(
        soap.subjective,
        soap.objective,
        animal?.especie || 'Não especificada'
      );
      if (suggestion) {
        setSoap(prev => ({
          ...prev,
          assessment: suggestion.assessment,
          plan: suggestion.plan
        }));
      }
    } catch (err) {
      setErrorMsg("Falha ao comunicar com o serviço de IA.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveRecord = async () => {
      setErrorMsg(null);
      setIsSaving(true);
      try {
        const missingFields = validateRequiredFields(soap, ['subjective', 'animalId']);
        if (missingFields.length > 0) throw new Error(`Campos obrigatórios: ${missingFields.join(', ')}`);
        if (!currentUser?.id) throw new Error("Sessão inválida.");

        const sanitizedSoap = {
            ...soap,
            subjective: sanitizeInput(soap.subjective),
            objective: sanitizeInput(soap.objective),
            assessment: sanitizeInput(soap.assessment),
            plan: sanitizeInput(soap.plan),
            vetId: currentUser.id
        };
        
        await saveMedicalRecord(sanitizedSoap);
        
        // Navega para a agenda após salvar para indicar a finalização do fluxo
        navigate('/agenda');

      } catch (err: any) {
        setErrorMsg(err.message || "Erro desconhecido ao salvar.");
        setIsSaving(false);
      }
  };
  
  if (!animal) return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        <i className="fas fa-spinner fa-spin mr-2"></i> Carregando dados do paciente...
      </div>
  );

  return (
    <div className="flex h-screen bg-slate-100/50 overflow-hidden font-sans">
      
      {/* Main Content: SOAP Form */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white p-6 border-b border-slate-200 flex-shrink-0 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/agenda')} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
              <i className="fas fa-arrow-left text-slate-500"></i>
            </button>
            <div>
               <h1 className="text-xl font-black text-slate-800 tracking-tight">Workstation de Atendimento</h1>
               <p className="text-xs font-bold text-slate-400 uppercase">Paciente: {animal.nome}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <button 
                onClick={handleSaveRecord} 
                disabled={isSaving}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black uppercase text-xs shadow-lg shadow-emerald-200 transition-all flex items-center disabled:opacity-50 disabled:cursor-wait"
              >
                {isSaving ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-check mr-2"></i>}
                Finalizar e Salvar
              </button>
          </div>
        </header>
        
        {/* Form Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-bold flex items-center">
                <i className="fas fa-exclamation-triangle mr-3"></i> {errorMsg}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block flex justify-between">
                    <span>(S)ubjetivo / Queixa Principal</span>
                    <span className="text-indigo-500">Obrigatório</span>
                </label>
                <textarea 
                    className="w-full p-4 bg-white rounded-xl border border-slate-200 h-40 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700"
                    value={soap.subjective}
                    onChange={e => setSoap({...soap, subjective: e.target.value})}
                    placeholder="Anamnese, histórico, o que o tutor relata..."
                    disabled={isSaving}
                ></textarea>
             </div>
             <div>
                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">(O)bjetivo / Exame Físico</label>
                <textarea 
                    className="w-full p-4 bg-white rounded-xl border border-slate-200 h-40 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-700"
                    value={soap.objective}
                    onChange={e => setSoap({...soap, objective: e.target.value})}
                    placeholder="Sinais vitais, palpação, ausculta, estado geral..."
                    disabled={isSaving}
                ></textarea>
             </div>
          </div>
          
          <div className="bg-indigo-50 border-2 border-dashed border-indigo-200/50 rounded-2xl p-6 space-y-6 relative">
            <div className="absolute -top-3 right-6">
               <button 
                onClick={handleGenerateAISuggestion}
                disabled={isAiLoading}
                className="px-5 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:scale-105 transition-all flex items-center space-x-2"
               >
                 {isAiLoading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                 ) : (
                    <i className="fas fa-wand-magic-sparkles"></i>
                 )}
                 <span>Sugerir com IA</span>
               </button>
            </div>

            <div>
              <label className="text-xs font-black text-indigo-800/50 uppercase mb-2 block">(A)valiação / Diagnóstico Diferencial</label>
              <textarea 
                  className="w-full p-4 bg-white rounded-xl border border-indigo-200 h-32 focus:ring-2 focus:ring-indigo-400 outline-none transition-all font-medium text-slate-800"
                  value={soap.assessment}
                  onChange={e => setSoap({...soap, assessment: e.target.value})}
                  placeholder="Suspeitas diagnósticas, problemas identificados..."
                  disabled={isSaving}
              ></textarea>
            </div>
            <div>
              <label className="text-xs font-black text-indigo-800/50 uppercase mb-2 block">(P)lano / Conduta</label>
              <textarea 
                  className="w-full p-4 bg-white rounded-xl border border-indigo-200 h-32 focus:ring-2 focus:ring-indigo-400 outline-none transition-all font-medium text-slate-800"
                  value={soap.plan}
                  onChange={e => setSoap({...soap, plan: e.target.value})}
                  placeholder="Exames a solicitar, tratamento prescrito, orientações..."
                  disabled={isSaving}
              ></textarea>
            </div>
          </div>

        </div>
      </main>

      {/* Right Sidebar: Patient Info */}
      <aside className="w-96 bg-white h-screen flex flex-col border-l border-slate-200 flex-shrink-0">
         <div className="p-6 text-center">
            <img src={animal.fotoUrl} className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-slate-100 shadow-xl mb-4" />
            <h2 className="text-xl font-black text-slate-800">{animal.nome}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{animal.raca} • {animal.sexo} • {animal.idade}</p>
         </div>
         
         <div className="grid grid-cols-3 gap-px bg-slate-200 border-y border-slate-200">
            <div className="bg-white p-3 text-center"><p className="text-xs text-slate-400 font-bold">Peso</p><p className="font-bold text-slate-700">{animal.pesoAtual} kg</p></div>
            <div className="bg-white p-3 text-center"><p className="text-xs text-slate-400 font-bold">Tutor</p><p className="font-bold text-slate-700 truncate">{tutor?.nome.split(' ')[0]}</p></div>
            <div className="bg-white p-3 text-center"><p className="text-xs text-slate-400 font-bold">ID</p><p className="font-mono text-xs text-slate-500 mt-1">{animal.matricula}</p></div>
         </div>

         {/* Alertas */}
         <div className="p-6 space-y-3">
            <div className="bg-rose-50 p-3 rounded-lg flex items-center space-x-3 text-xs border border-rose-100">
              <i className="fas fa-allergies text-rose-500"></i>
              <span className="font-bold text-rose-700">Alergia: Dipirona</span>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg flex items-center space-x-3 text-xs border border-amber-100">
              <i className="fas fa-exclamation-triangle text-amber-500"></i>
              <span className="font-bold text-amber-700">Paciente Agressivo</span>
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-0">
           <h4 className="text-xs font-black text-slate-400 uppercase mb-4">Histórico Rápido</h4>
           <div className="space-y-4">
              {history.length > 0 ? history.slice(0, 5).map(rec => (
                <div key={rec.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <p className="text-[10px] font-black text-indigo-500 uppercase">{new Date(rec.date).toLocaleDateString()}</p>
                   <p className="text-xs font-bold text-slate-700 truncate mt-1">{rec.assessment || 'Consulta de rotina'}</p>
                </div>
              )) : (
                <div className="text-center text-slate-400 text-xs py-10">
                  <i className="fas fa-folder-open mb-2"></i>
                  <p>Primeiro atendimento.</p>
                </div>
              )}
           </div>
         </div>
      </aside>
    </div>
  );
};

export default Workstation;
