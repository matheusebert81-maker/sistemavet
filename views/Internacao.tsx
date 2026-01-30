
import React, { useState } from 'react';
import { MOCK_BEDS, MOCK_INTERNAMENTOS, MOCK_ANIMAIS, MOCK_USER } from '../constants.tsx';
import { Bed, BedStatus, Internamento, LogAction, InternmentEvolution, MedicationRecord } from '../types';
import { logAction } from '../services/logService';

const Internacao: React.FC = () => {
  const [internamentos, setInternamentos] = useState<Internamento[]>(MOCK_INTERNAMENTOS);
  const [selectedInternment, setSelectedInternment] = useState<Internamento | null>(MOCK_INTERNAMENTOS[0]); // Seleciona o primeiro por padrão
  const [activeTab, setActiveTab] = useState<'ANIMAIS' | 'MAPA'>('ANIMAIS');
  const [showMedModal, setShowMedModal] = useState(false);
  const [medicationToAdminister, setMedicationToAdminister] = useState<MedicationRecord | null>(null);

  const getStatusInfo = (med: MedicationRecord) => {
      // Lógica de atraso: Se horário < agora e status == PENDING
      const [hora, min] = med.horario.split(':').map(Number);
      const now = new Date();
      const medTime = new Date();
      medTime.setHours(hora, min, 0);

      // Simulação: Considera atrasado se passar do horário hoje (apenas para demo visual)
      const isLate = med.status === 'PENDING'; 
      
      return isLate 
        ? { label: 'Atrasado', color: 'text-rose-600 font-bold' } 
        : { label: med.status, color: 'text-slate-500' };
  };

  const openMedModal = () => {
      setShowMedModal(true);
  };

  const confirmAdministration = () => {
      if(medicationToAdminister && selectedInternment) {
        setInternamentos(prev => prev.map(int => {
            if(int.id === selectedInternment.id) {
                return {
                    ...int,
                    medicacoes: int.medicacoes.map(m => m.id === medicationToAdminister.id ? { ...m, status: 'ADMINISTERED' } : m)
                }
            }
            return int;
        }));
        // Atualiza selecionado
        setSelectedInternment(prev => prev ? {
            ...prev,
            medicacoes: prev.medicacoes.map(m => m.id === medicationToAdminister.id ? { ...m, status: 'ADMINISTERED' } : m)
        } : null);
        
        setShowMedModal(false);
        setMedicationToAdminister(null);
      }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar Local de Internação (Estilo Reference) */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col z-10">
         <div className="p-6 border-b border-slate-100">
            <h2 className="text-2xl font-black text-orange-400 tracking-tight">Internação</h2>
         </div>
         
         {/* Abas Locais */}
         <div className="flex border-b border-slate-100">
            <button 
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === 'ANIMAIS' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-400 hover:text-slate-600'}`}
              onClick={() => setActiveTab('ANIMAIS')}
            >
                Animais Internados
            </button>
            <button 
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === 'MAPA' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-400 hover:text-slate-600'}`}
              onClick={() => setActiveTab('MAPA')}
            >
                Mapa Geral
            </button>
         </div>

         {/* Lista de Animais */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-slate-50/30">
            {internamentos.map(int => {
                const animal = MOCK_ANIMAIS.find(a => a.id === int.animalId);
                const isSelected = selectedInternment?.id === int.id;
                
                return (
                    <div 
                        key={int.id}
                        onClick={() => setSelectedInternment(int)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            isSelected 
                            ? 'bg-white border-blue-300 shadow-md transform scale-[1.02]' 
                            : 'bg-white border-slate-200 hover:border-blue-200'
                        }`}
                    >
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                                <img src={animal?.fotoUrl} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="font-black text-slate-800 text-sm">{animal?.nome}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{animal?.raca}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium bg-slate-50 p-2 rounded-lg">
                            <span>Box: {MOCK_BEDS.find(b => b.id === int.bedId)?.name}</span>
                            <span className="text-orange-500 font-bold">Em Tratamento</span>
                        </div>
                    </div>
                )
            })}
         </div>
      </div>

      {/* Área Principal (Detalhes do Paciente) */}
      <div className="flex-1 flex flex-col bg-slate-100/50 overflow-hidden">
         {selectedInternment ? (
             <div className="p-8 h-full flex flex-col">
                 <div className="bg-white rounded-t-[2rem] border-x border-t border-slate-200 p-8 shadow-sm flex-shrink-0">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 rounded-2xl bg-slate-200 overflow-hidden shadow-inner">
                            <img src={MOCK_ANIMAIS.find(a => a.id === selectedInternment.animalId)?.fotoUrl} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                                {MOCK_ANIMAIS.find(a => a.id === selectedInternment.animalId)?.nome}
                            </h2>
                            <p className="font-bold text-slate-500">
                                {MOCK_ANIMAIS.find(a => a.id === selectedInternment.animalId)?.especie} • Peso: {MOCK_ANIMAIS.find(a => a.id === selectedInternment.animalId)?.pesoAtual}kg
                            </p>
                            <p className="text-sm text-slate-400 mt-1">Responsável: Dr. Ricardo</p>
                        </div>
                    </div>
                    
                    <div className="flex mt-8 space-x-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase shadow-lg shadow-blue-200" onClick={openMedModal}>
                            <i className="fas fa-pills mr-2"></i> Medicamentos
                        </button>
                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold text-xs uppercase hover:bg-slate-50">
                            <i className="fas fa-file-medical mr-2"></i> Exames
                        </button>
                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold text-xs uppercase hover:bg-slate-50">
                            <i className="fas fa-notes-medical mr-2"></i> Parâmetros
                        </button>
                    </div>
                 </div>

                 <div className="flex-1 bg-white rounded-b-[2rem] border-x border-b border-slate-200 p-8 shadow-sm overflow-y-auto custom-scrollbar">
                    <div className="max-w-3xl">
                        <h3 className="text-lg font-black text-slate-800 mb-6">Resumo Clínico do Dia</h3>
                        {/* Timeline Simplificada */}
                        <div className="space-y-6 border-l-2 border-slate-100 pl-6 ml-2">
                             {selectedInternment.medicacoes.map((med, idx) => {
                                 const status = getStatusInfo(med);
                                 return (
                                     <div key={idx} className="relative">
                                         <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 border-white shadow-sm ${status.label === 'Atrasado' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                                         <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                                             <div>
                                                 <p className="font-bold text-slate-800">{med.nome}</p>
                                                 <p className="text-xs text-slate-500">{med.dosagem} • {med.horario}</p>
                                             </div>
                                             <span className={`text-xs ${status.color} uppercase`}>{status.label}</span>
                                         </div>
                                     </div>
                                 )
                             })}
                        </div>
                    </div>
                 </div>
             </div>
         ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
                <p className="font-bold uppercase tracking-widest">Selecione um animal</p>
            </div>
         )}
      </div>

      {/* Modal de Medicamentos (Estilo Referência) */}
      {showMedModal && selectedInternment && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-4xl rounded shadow-2xl overflow-hidden animate-in zoom-in-95">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                      <h3 className="font-bold text-lg text-slate-800">Medicamentos</h3>
                      <button onClick={() => setShowMedModal(false)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times"></i></button>
                  </div>
                  
                  <div className="p-0">
                      <table className="w-full text-left">
                          <thead>
                              <tr className="border-b border-slate-200 text-xs font-bold text-slate-600 bg-white">
                                  <th className="w-10 py-3 text-center">#</th>
                                  <th className="py-3 px-4">Medicamento</th>
                                  <th className="py-3 px-4 text-center">Status</th>
                                  <th className="py-3 px-4 text-center">Via</th>
                                  <th className="py-3 px-4 text-center">Quantidade</th>
                                  <th className="py-3 px-4 text-center">Aplicar</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {selectedInternment.medicacoes.map((med, idx) => {
                                  const status = getStatusInfo(med);
                                  return (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 text-center text-slate-400">
                                            <i className="fas fa-chevron-circle-right"></i>
                                        </td>
                                        <td className="px-4 font-medium text-slate-700">{med.nome} <span className="text-slate-400 text-xs ml-1">{med.dosagem}</span></td>
                                        <td className={`px-4 text-center text-sm ${status.color}`}>{status.label}</td>
                                        <td className="px-4 text-center text-sm text-slate-600">Subcutânea</td> {/* Mockado para IV/SC */}
                                        <td className="px-4 text-center text-sm text-slate-600">1 un</td>
                                        <td className="px-4 text-center">
                                            {med.status !== 'ADMINISTERED' && (
                                                <button 
                                                    onClick={() => { setMedicationToAdminister(med); confirmAdministration(); }}
                                                    className="w-8 h-8 rounded bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
                                                >
                                                    <i className="fas fa-check"></i>
                                                </button>
                                            )}
                                            {med.status === 'ADMINISTERED' && (
                                                <i className="fas fa-check-double text-emerald-500"></i>
                                            )}
                                        </td>
                                    </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>

                  <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
                      <button className="px-4 py-2 bg-emerald-700 text-white rounded font-bold text-sm shadow-sm hover:bg-emerald-800 transition-all">
                          <i className="fas fa-file-pdf mr-2"></i> Imprimir Mapa
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Internacao;
