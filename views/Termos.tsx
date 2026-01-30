
import React, { useState } from 'react';
import { MOCK_ANIMAIS, MOCK_TUTORES } from '../constants';

const Termos: React.FC = () => {
  const [selectedTerm, setSelectedTerm] = useState('CIRURGIA');
  const [selectedAnimalId, setSelectedAnimalId] = useState(MOCK_ANIMAIS[0].id);

  const animal = MOCK_ANIMAIS.find(a => a.id === selectedAnimalId);
  const tutor = MOCK_TUTORES.find(t => t.id === animal?.tutorId);

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Termos de Responsabilidade</h2>
          <p className="text-slate-500 font-medium italic">Gestão jurídica e segurança clínica.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Configuração</h4>
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Tipo de Termo</label>
                    <select className="w-full p-3 bg-slate-50 border-none rounded-xl text-xs font-bold" value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
                       <option value="CIRURGIA">Cirurgia Geral</option>
                       <option value="ANESTESIA">Protocolo Anestésico</option>
                       <option value="EUTANASIA">Eutanásia Humanitária</option>
                       <option value="INTERNACAO">Termo de Internamento</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Selecionar Paciente</label>
                    <select className="w-full p-3 bg-slate-50 border-none rounded-xl text-xs font-bold" value={selectedAnimalId} onChange={(e) => setSelectedAnimalId(e.target.value)}>
                       {MOCK_ANIMAIS.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                    </select>
                 </div>
              </div>
              <button className="w-full mt-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                 <i className="fas fa-print mr-2"></i> Imprimir Termo
              </button>
           </div>
        </div>

        <div className="lg:col-span-3 bg-white p-16 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
           {/* Visual de Papel */}
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <i className="fas fa-file-invoice text-9xl"></i>
           </div>
           
           <div className="max-w-2xl mx-auto space-y-10">
              <div className="text-center border-b pb-8 border-slate-100">
                 <h3 className="text-2xl font-black text-slate-900 mb-2">TERMO DE RESPONSABILIDADE: {selectedTerm}</h3>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Rede VibeVet Enterprise</p>
              </div>

              <div className="text-sm text-slate-700 leading-relaxed space-y-6 font-medium">
                 <p>
                    Eu, <strong>{tutor?.nome}</strong>, inscrito no CPF sob nº <strong>{tutor?.cpf}</strong>, na qualidade de proprietário/responsável pelo animal <strong>{animal?.nome}</strong> (Espécie: {animal?.especie}, Raça: {animal?.raca}), declaro estar ciente dos riscos inerentes ao procedimento de <strong>{selectedTerm}</strong>.
                 </p>
                 <p>
                    Fui informado pela equipe médica da unidade <strong>Matriz Centro</strong> sobre as possíveis complicações, intercorrências e a necessidade de exames pré-operatórios para minimizar riscos anestésicos e cirúrgicos.
                 </p>
                 <p>
                    Autorizo a realização de procedimentos de emergência caso sejam necessários durante o atendimento para preservação da vida do paciente.
                 </p>
              </div>

              <div className="pt-20 grid grid-cols-2 gap-20">
                 <div className="border-t border-slate-300 pt-4 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400">Assinatura do Tutor</p>
                    <p className="text-xs font-bold text-slate-900 mt-2">{tutor?.nome}</p>
                 </div>
                 <div className="border-t border-slate-300 pt-4 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400">Assinatura Médica</p>
                    <p className="text-xs font-bold text-slate-900 mt-2">Dr. Ricardo Vet - CRMV/SP 12345</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Termos;
