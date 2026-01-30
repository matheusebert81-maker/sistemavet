
import React, { useState } from 'react';
import { MOCK_ANIMAIS, MOCK_TUTORES } from '../constants';

// Mock de Comandas para visualização (Simulando estrutura da API)
const MOCK_COMANDAS = [
  { id: '19347', numero: 19347, animalId: MOCK_ANIMAIS[0].id, status: 'FECHADA', dataAbertura: '2026-01-29T15:38:00', dataFechamento: '2026-01-29T16:24:00', total: 150.00 },
  { id: '19348', numero: 19348, animalId: MOCK_ANIMAIS[1].id, status: 'ABERTA', dataAbertura: '2026-01-29T16:00:00', dataFechamento: null, total: 85.00 },
];

const Comandas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('19347'); // Começa expandido como na imagem

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusStyle = (status: string) => {
    return status === 'FECHADA' 
      ? 'bg-slate-300 text-white font-bold' 
      : 'bg-emerald-500 text-white font-bold';
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-screen">
      <header>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Comandas</h2>
        <p className="text-slate-500 font-medium">Gerenciamento de contas de atendimento.</p>
      </header>

      {/* Barra de Filtro */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex space-x-4 items-center shadow-sm">
        <div className="flex-1 relative">
           <input 
             type="text" 
             placeholder="Buscar por Nome, CPF, E-mail ou ID" 
             className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
           <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
        </div>
        <button className="px-6 py-3 bg-white border border-orange-300 text-orange-500 font-bold rounded-lg text-sm hover:bg-orange-50 transition-all flex items-center">
           <i className="fas fa-filter mr-2"></i> Filtrar
        </button>
      </div>

      {/* Lista de Comandas */}
      <div className="space-y-4">
         {MOCK_COMANDAS.map(comanda => {
            const animal = MOCK_ANIMAIS.find(a => a.id === comanda.animalId);
            const tutor = MOCK_TUTORES.find(t => t.id === animal?.tutorId);

            return (
              <div key={comanda.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                 {/* Cabeçalho da Comanda */}
                 <div 
                   className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                   onClick={() => toggleExpand(comanda.id)}
                 >
                    <div className="flex items-center space-x-6">
                       <span className={`px-4 py-1 rounded-full text-xs uppercase tracking-wide ${getStatusStyle(comanda.status)}`}>
                          {comanda.status === 'FECHADA' ? 'Fechada' : 'Aberta'}
                       </span>
                       
                       <div className="grid grid-cols-4 gap-8 text-sm text-slate-600">
                          <div>
                             <p className="text-slate-400 font-bold text-xs uppercase">ID da Comanda:</p>
                             <p className="font-bold text-slate-800 text-lg">{comanda.numero}</p>
                          </div>
                          <div>
                             <p className="text-slate-400 font-bold text-xs uppercase">Abertura:</p>
                             <p className="font-medium">{new Date(comanda.dataAbertura).toLocaleDateString()} às {new Date(comanda.dataAbertura).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}h</p>
                          </div>
                          <div>
                             <p className="text-slate-400 font-bold text-xs uppercase">Fechamento:</p>
                             <p className="font-medium">{comanda.dataFechamento ? `${new Date(comanda.dataFechamento).toLocaleDateString()} às ${new Date(comanda.dataFechamento).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}h` : '-'}</p>
                          </div>
                          <div>
                             <p className="text-slate-400 font-bold text-xs uppercase">Cliente:</p>
                             <p className="font-bold text-slate-800 uppercase">{tutor?.nome}</p>
                          </div>
                       </div>
                    </div>
                    <i className={`fas fa-chevron-down text-slate-300 transition-transform ${expandedId === comanda.id ? 'rotate-180' : ''}`}></i>
                 </div>

                 {/* Detalhes Expansíveis */}
                 {expandedId === comanda.id && (
                    <div className="px-8 pb-8 animate-in slide-in-from-top-2">
                       {/* Seção Cliente */}
                       <div className="mb-6 pt-4 border-t border-slate-100">
                          <h4 className="flex items-center text-blue-600 font-bold text-sm mb-4">
                             <i className="fas fa-chevron-up mr-2 text-xs"></i> Informações do cliente
                          </h4>
                          <div className="grid grid-cols-3 gap-6 bg-slate-50/50 p-6 rounded-xl">
                             <div>
                                <p className="text-slate-500 text-xs mb-1">Telefone Fixo:</p>
                                <p className="font-medium text-slate-800">-</p>
                             </div>
                             <div>
                                <p className="text-slate-500 text-xs mb-1">Celular:</p>
                                <p className="font-medium text-slate-800">{tutor?.telefone}</p>
                             </div>
                             <div>
                                <p className="text-slate-500 text-xs mb-1">E-mail:</p>
                                <p className="font-medium text-slate-800">{tutor?.email}</p>
                             </div>
                          </div>
                       </div>

                       {/* Seção Serviços */}
                       <div>
                          <h4 className="flex items-center text-blue-600 font-bold text-sm mb-4">
                             <i className="fas fa-chevron-up mr-2 text-xs"></i> Serviços / Produtos
                          </h4>
                          
                          <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-white">
                             <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200">
                                   <img src={animal?.fotoUrl} className="w-full h-full object-cover" alt={animal?.nome} />
                                </div>
                                <div>
                                   <p className="font-black text-slate-800">{animal?.nome}</p>
                                   <p className="text-xs text-slate-500 font-bold uppercase">{animal?.raca} {animal?.especie}</p>
                                </div>
                             </div>
                             
                             <div>
                                <p className="text-slate-400 text-xs font-bold uppercase">Serviço:</p>
                                <p className="text-slate-800 font-medium">Primeiro retorno (POPULAR)</p>
                             </div>

                             <div>
                                <p className="text-slate-400 text-xs font-bold uppercase">Executante:</p>
                                <p className="text-slate-800 font-medium">Não Informado</p>
                             </div>
                             
                             <div className="text-right">
                                <p className="text-slate-400 text-xs font-bold uppercase">Valor:</p>
                                <p className="text-emerald-600 font-black">R$ 0,00</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
            );
         })}
      </div>
    </div>
  );
};

export default Comandas;
