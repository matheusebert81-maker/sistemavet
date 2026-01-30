
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CadastroPacientes: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'TUTOR' | 'ANIMAL'>('TUTOR');
  
  // Dados do Tutor
  const [tutorData, setTutorData] = useState({
    nome: '', cpf: '', email: '', telefone: '', cep: '', endereco: ''
  });

  // Dados do Animal (Matrícula gerada automaticamente na visualização)
  const matriculaPreview = `PET-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
  const [animalData, setAnimalData] = useState({
    nome: '', especie: 'Canina', raca: '', sexo: 'M',
    peso: '', nascimento: '', pelagem: '', microchip: '',
    temperamento: 'Dócil'
  });

  const handleSave = () => {
    // Simulação de persistência
    console.log("Salvando Tutor:", tutorData);
    console.log("Salvando Animal:", { ...animalData, matricula: matriculaPreview });
    alert(`Cadastro realizado com sucesso!\n\nMatrícula do Animal: ${matriculaPreview}`);
    navigate('/agenda'); // Redireciona para agendar a primeira consulta
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cadastro Unificado</h2>
          <p className="text-slate-500 font-medium">Registro simultâneo de Tutor e Paciente com geração de matrícula.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Lado Esquerdo: Formulários */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Tutor Section */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5">
                <i className="fas fa-user text-8xl"></i>
             </div>
             <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">1</span>
                Dados do Tutor
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nome Completo</label>
                   <input 
                     type="text" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                     value={tutorData.nome} onChange={e => setTutorData({...tutorData, nome: e.target.value})}
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">CPF</label>
                   <input 
                     type="text" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                     value={tutorData.cpf} onChange={e => setTutorData({...tutorData, cpf: e.target.value})}
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Celular / WhatsApp</label>
                   <input 
                     type="text" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                     value={tutorData.telefone} onChange={e => setTutorData({...tutorData, telefone: e.target.value})}
                   />
                </div>
                <div className="md:col-span-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Endereço Completo</label>
                   <input 
                     type="text" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="Rua, Número, Bairro, Cidade"
                     value={tutorData.endereco} onChange={e => setTutorData({...tutorData, endereco: e.target.value})}
                   />
                </div>
             </div>
          </div>

          {/* Animal Section */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-5">
                <i className="fas fa-paw text-8xl"></i>
             </div>
             <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 text-sm">2</span>
                Dados do Paciente
             </h3>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nome do Animal</label>
                   <input 
                     type="text" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                     value={animalData.nome} onChange={e => setAnimalData({...animalData, nome: e.target.value})}
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Matrícula (Auto)</label>
                   <div className="w-full p-4 bg-slate-100 rounded-2xl text-sm font-black text-slate-500 uppercase tracking-widest text-center select-all">
                      {matriculaPreview}
                   </div>
                </div>

                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Espécie</label>
                   <select 
                      className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none"
                      value={animalData.especie} onChange={e => setAnimalData({...animalData, especie: e.target.value})}
                   >
                      <option value="Canina">Canina</option>
                      <option value="Felina">Felina</option>
                      <option value="Outros">Outros (Silvestre)</option>
                   </select>
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Raça</label>
                   <input 
                     type="text" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                     value={animalData.raca} onChange={e => setAnimalData({...animalData, raca: e.target.value})}
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Sexo</label>
                   <div className="flex space-x-2">
                      <button 
                        onClick={() => setAnimalData({...animalData, sexo: 'M'})}
                        className={`flex-1 p-4 rounded-2xl font-black transition-all ${animalData.sexo === 'M' ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'}`}
                      >M</button>
                      <button 
                        onClick={() => setAnimalData({...animalData, sexo: 'F'})}
                        className={`flex-1 p-4 rounded-2xl font-black transition-all ${animalData.sexo === 'F' ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-400'}`}
                      >F</button>
                   </div>
                </div>

                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Peso (kg)</label>
                   <input 
                     type="number" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                     value={animalData.peso} onChange={e => setAnimalData({...animalData, peso: e.target.value})}
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Microchip</label>
                   <input 
                     type="text" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                     placeholder="Opcional"
                     value={animalData.microchip} onChange={e => setAnimalData({...animalData, microchip: e.target.value})}
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Pelagem</label>
                   <input 
                     type="text" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                     value={animalData.pelagem} onChange={e => setAnimalData({...animalData, pelagem: e.target.value})}
                   />
                </div>
             </div>
          </div>
        </div>

        {/* Lado Direito: Resumo e Ações */}
        <div className="xl:col-span-4 space-y-8">
           <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <h4 className="text-xl font-black mb-4">Vincular Serviços Iniciais</h4>
              <p className="text-sm text-slate-400 mb-8">Selecione o que deseja agendar imediatamente após o cadastro.</p>
              
              <div className="space-y-4">
                 <label className="flex items-center space-x-3 p-4 bg-white/10 rounded-2xl cursor-pointer hover:bg-white/20 transition-all">
                    <input type="checkbox" className="w-5 h-5 rounded text-emerald-500 focus:ring-0" />
                    <span className="font-bold text-sm">Consulta de Rotina</span>
                 </label>
                 <label className="flex items-center space-x-3 p-4 bg-white/10 rounded-2xl cursor-pointer hover:bg-white/20 transition-all">
                    <input type="checkbox" className="w-5 h-5 rounded text-emerald-500 focus:ring-0" />
                    <span className="font-bold text-sm">Aplicação de Vacina</span>
                 </label>
                 <label className="flex items-center space-x-3 p-4 bg-white/10 rounded-2xl cursor-pointer hover:bg-white/20 transition-all">
                    <input type="checkbox" className="w-5 h-5 rounded text-emerald-500 focus:ring-0" />
                    <span className="font-bold text-sm">Internação Imediata</span>
                 </label>
              </div>

              <button 
                onClick={handleSave}
                className="w-full mt-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all"
              >
                Confirmar Cadastro
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroPacientes;
