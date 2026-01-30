
import React, { useState } from 'react';
import { MOCK_ANIMAIS, MOCK_SURGERIES } from '../constants.tsx';
import { SurgeryQueueItem, SurgicalRecord, ASAScore } from '../types';

const Cirurgico: React.FC = () => {
  const [surgicalQueue, setSurgicalQueue] = useState<SurgeryQueueItem[]>(MOCK_SURGERIES);
  const [selectedSurgery, setSelectedSurgery] = useState<SurgeryQueueItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'PRE' | 'TRANS' | 'POS'>('PRE');

  // Estado temporário para edição da ficha (simulação)
  const [editingRecord, setEditingRecord] = useState<Partial<SurgicalRecord>>({});

  const handleOpenRecord = (surgery: SurgeryQueueItem) => {
    setSelectedSurgery(surgery);
    // Inicializa o record se não existir
    setEditingRecord(surgery.surgicalRecord || {
        id: Math.random().toString(),
        surgeryId: surgery.id,
        asa: ASAScore.I,
        preOp: { jejumHoras: 0, examesPreCheck: false, tricotomia: false, acessoVenoso: '', observacoes: '' },
        intraOp: { inicioAnestesia: '', inicioCirurgia: '', fimCirurgia: '', fimAnestesia: '', complicacoes: '', sangramentoEstimadoML: 0 },
        monitoramento: [],
        posOp: { instrucoes: '', antibiotico: '', analgesia: '', retornoDias: 7 }
    });
    setIsModalOpen(true);
  };

  const handleSaveRecord = () => {
    if (!selectedSurgery) return;
    
    // Atualiza a lista mockada
    const updatedQueue = surgicalQueue.map(item => 
        item.id === selectedSurgery.id ? { ...item, surgicalRecord: editingRecord as SurgicalRecord } : item
    );
    setSurgicalQueue(updatedQueue);
    setIsModalOpen(false);
    alert('Ficha cirúrgica salva com sucesso! (Dados locais)');
  };

  const addMonitoringEntry = () => {
      const currentMon = editingRecord.monitoramento || [];
      const newEntry = { fc: '0', spo2: '0', pas: '0', pad: '0', temp: '0' };
      setEditingRecord({ ...editingRecord, monitoramento: [...currentMon, newEntry] });
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Centro Cirúrgico</h2>
          <p className="text-slate-500 font-medium">Controle de bloco, fichas anestésicas e recuperação.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-xl shadow-rose-100 transition-all flex items-center">
             <i className="fas fa-plus mr-2"></i> Agendar Cirurgia
          </button>
        </div>
      </header>

      {/* Lista de Procedimentos */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Procedimentos do Dia</h3>
        </div>

        <div className="divide-y divide-slate-50">
          {surgicalQueue.map(item => {
            const animal = MOCK_ANIMAIS.find(a => a.id === item.animalId);
            return (
              <div key={item.id} className="p-8 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                 <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-600 text-2xl font-black">
                       {animal?.nome[0]}
                    </div>
                    <div>
                       <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-black text-slate-900 text-lg">{animal?.nome}</h4>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase">{item.room}</span>
                       </div>
                       <p className="text-sm font-bold text-indigo-600">{item.procedure}</p>
                       <p className="text-xs text-slate-400 font-medium mt-1">Vet: {item.vet} • Anest: {item.anesthesist}</p>
                    </div>
                 </div>

                 <div className="flex items-center space-x-10">
                    <div className="text-right">
                       <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                         item.status === 'IN_SURGERY' ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' : 
                         item.status === 'RECOVERY' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                         'bg-emerald-50 text-emerald-600 border-emerald-100'
                       }`}>
                         {item.status === 'IN_SURGERY' ? 'EM CIRURGIA' : item.status === 'RECOVERY' ? 'RECUPERAÇÃO' : 'FINALIZADO'}
                       </span>
                    </div>
                    <div className="flex space-x-2">
                       <button 
                         onClick={() => handleOpenRecord(item)}
                         className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center"
                       >
                          <i className="fas fa-clipboard-check mr-2"></i> Ficha
                       </button>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Ficha Cirúrgica */}
      {isModalOpen && selectedSurgery && editingRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-8">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
                
                {/* Header Modal */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">Ficha Cirúrgica Digital</h3>
                        <p className="text-sm font-bold text-slate-500">Paciente: {MOCK_ANIMAIS.find(a => a.id === selectedSurgery.animalId)?.nome} • Proc: {selectedSurgery.procedure}</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 px-8">
                    {[
                        { id: 'PRE', label: 'Pré-Operatório', icon: 'fa-notes-medical' },
                        { id: 'TRANS', label: 'Trans-Operatório', icon: 'fa-heart-pulse' },
                        { id: 'POS', label: 'Pós-Operatório', icon: 'fa-bed-pulse' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-8 py-5 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center space-x-2 ${
                                activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <i className={`fas ${tab.icon}`}></i>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30 custom-scrollbar">
                    
                    {/* PRÉ-OPERATÓRIO */}
                    {activeTab === 'PRE' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Avaliação de Risco</h4>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Classificação ASA</label>
                                    <select 
                                        className="w-full p-3 bg-slate-50 rounded-xl font-bold text-sm border-none"
                                        value={editingRecord.asa}
                                        onChange={e => setEditingRecord({...editingRecord, asa: e.target.value as ASAScore})}
                                    >
                                        {Object.values(ASAScore).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Jejum (Horas)</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-3 bg-slate-50 rounded-xl font-bold text-sm border-none"
                                        value={editingRecord.preOp?.jejumHoras}
                                        onChange={e => setEditingRecord({...editingRecord, preOp: {...editingRecord.preOp!, jejumHoras: Number(e.target.value)}})}
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Checklist de Segurança</h4>
                                <label className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded text-blue-600 focus:ring-0"
                                        checked={editingRecord.preOp?.examesPreCheck}
                                        onChange={e => setEditingRecord({...editingRecord, preOp: {...editingRecord.preOp!, examesPreCheck: e.target.checked}})}
                                    />
                                    <span className="text-sm font-bold text-slate-700">Exames Pré-Cirúrgicos Avaliados</span>
                                </label>
                                <label className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded text-blue-600 focus:ring-0"
                                        checked={editingRecord.preOp?.tricotomia}
                                        onChange={e => setEditingRecord({...editingRecord, preOp: {...editingRecord.preOp!, tricotomia: e.target.checked}})}
                                    />
                                    <span className="text-sm font-bold text-slate-700">Tricotomia Realizada</span>
                                </label>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Acesso Venoso</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ex: Cefálica Direita"
                                        className="w-full p-3 bg-slate-50 rounded-xl font-bold text-sm border-none"
                                        value={editingRecord.preOp?.acessoVenoso}
                                        onChange={e => setEditingRecord({...editingRecord, preOp: {...editingRecord.preOp!, acessoVenoso: e.target.value}})}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Observações Gerais</label>
                                <textarea 
                                    className="w-full p-4 bg-white rounded-2xl border border-slate-200 text-sm font-medium h-32 resize-none"
                                    placeholder="Alergias, comportamento..."
                                    value={editingRecord.preOp?.observacoes}
                                    onChange={e => setEditingRecord({...editingRecord, preOp: {...editingRecord.preOp!, observacoes: e.target.value}})}
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {/* TRANS-OPERATÓRIO */}
                    {activeTab === 'TRANS' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Início Anestesia</label>
                                    <input 
                                        type="time" 
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-sm"
                                        value={editingRecord.intraOp?.inicioAnestesia}
                                        onChange={e => setEditingRecord({...editingRecord, intraOp: {...editingRecord.intraOp!, inicioAnestesia: e.target.value}})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Início Cirurgia</label>
                                    <input 
                                        type="time" 
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-sm"
                                        value={editingRecord.intraOp?.inicioCirurgia}
                                        onChange={e => setEditingRecord({...editingRecord, intraOp: {...editingRecord.intraOp!, inicioCirurgia: e.target.value}})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Fim Cirurgia</label>
                                    <input 
                                        type="time" 
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-sm"
                                        value={editingRecord.intraOp?.fimCirurgia}
                                        onChange={e => setEditingRecord({...editingRecord, intraOp: {...editingRecord.intraOp!, fimCirurgia: e.target.value}})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Sangramento (ml)</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-sm"
                                        value={editingRecord.intraOp?.sangramentoEstimadoML}
                                        onChange={e => setEditingRecord({...editingRecord, intraOp: {...editingRecord.intraOp!, sangramentoEstimadoML: Number(e.target.value)}})}
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-sm font-black uppercase tracking-widest flex items-center">
                                        <i className="fas fa-heart-pulse text-rose-500 mr-2 animate-pulse"></i> 
                                        Monitoramento Multiparamétrico
                                    </h4>
                                    <button onClick={addMonitoringEntry} className="px-4 py-2 bg-blue-600 rounded-xl text-[10px] font-black uppercase hover:bg-blue-500 transition-all">
                                        + Registrar Parâmetros
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/10 text-[10px] font-black uppercase text-slate-400">
                                                <th className="pb-3 pl-2">FC (bpm)</th>
                                                <th className="pb-3">SpO2 (%)</th>
                                                <th className="pb-3">PAS (mmHg)</th>
                                                <th className="pb-3">PAD (mmHg)</th>
                                                <th className="pb-3">Temp (ºC)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {editingRecord.monitoramento?.map((mon, idx) => (
                                                <tr key={idx} className="group hover:bg-white/5 transition-colors">
                                                    <td className="py-3 pl-2 font-mono text-emerald-400 font-bold">{mon.fc}</td>
                                                    <td className="py-3 font-mono text-blue-400 font-bold">{mon.spo2}</td>
                                                    <td className="py-3 font-mono">{mon.pas}</td>
                                                    <td className="py-3 font-mono">{mon.pad}</td>
                                                    <td className="py-3 font-mono text-amber-400">{mon.temp}</td>
                                                </tr>
                                            ))}
                                            {(!editingRecord.monitoramento || editingRecord.monitoramento.length === 0) && (
                                                <tr>
                                                    <td colSpan={5} className="py-8 text-center text-slate-600 text-xs italic">
                                                        Nenhum registro de monitoramento adicionado.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Intercorrências / Complicações</label>
                                <textarea 
                                    className="w-full p-4 bg-rose-50 rounded-2xl border border-rose-100 text-sm font-medium h-24 resize-none text-rose-900 placeholder:text-rose-300"
                                    placeholder="Descreva qualquer evento adverso..."
                                    value={editingRecord.intraOp?.complicacoes}
                                    onChange={e => setEditingRecord({...editingRecord, intraOp: {...editingRecord.intraOp!, complicacoes: e.target.value}})}
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {/* PÓS-OPERATÓRIO */}
                    {activeTab === 'POS' && (
                        <div className="space-y-6">
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Prescrição de Alta</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Antibioticoterapia</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 bg-slate-50 rounded-xl font-bold text-sm border-none"
                                            placeholder="Ex: Enrofloxacina 150mg 12/12h"
                                            value={editingRecord.posOp?.antibiotico}
                                            onChange={e => setEditingRecord({...editingRecord, posOp: {...editingRecord.posOp!, antibiotico: e.target.value}})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Analgesia</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 bg-slate-50 rounded-xl font-bold text-sm border-none"
                                            placeholder="Ex: Dipirona 500mg 8/8h"
                                            value={editingRecord.posOp?.analgesia}
                                            onChange={e => setEditingRecord({...editingRecord, posOp: {...editingRecord.posOp!, analgesia: e.target.value}})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Retorno (Dias)</label>
                                        <input 
                                            type="number" 
                                            className="w-full p-3 bg-slate-50 rounded-xl font-bold text-sm border-none"
                                            value={editingRecord.posOp?.retornoDias}
                                            onChange={e => setEditingRecord({...editingRecord, posOp: {...editingRecord.posOp!, retornoDias: Number(e.target.value)}})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Instruções ao Tutor</label>
                                    <textarea 
                                        className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium h-32 resize-none"
                                        placeholder="Cuidados com ferida cirúrgica, alimentação, repouso..."
                                        value={editingRecord.posOp?.instrucoes}
                                        onChange={e => setEditingRecord({...editingRecord, posOp: {...editingRecord.posOp!, instrucoes: e.target.value}})}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Modal */}
                <div className="p-8 border-t border-slate-100 flex justify-end space-x-4 bg-white">
                    <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                        Cancelar
                    </button>
                    <button onClick={handleSaveRecord} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">
                        Salvar Ficha Cirúrgica
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Cirurgico;
