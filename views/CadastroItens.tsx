
import React, { useState } from 'react';
import { EstoqueCategoria } from '../types';

const CadastroItens: React.FC = () => {
  const [categoria, setCategoria] = useState<EstoqueCategoria>(EstoqueCategoria.SERVICO);
  const [formData, setFormData] = useState({
    nome: '',
    precoVenda: '',
    custo: '',
    codigo: '',
    estoqueInicial: '0'
  });

  const handleSave = () => {
    console.log("Salvando Item:", { categoria, ...formData });
    alert(`Item "${formData.nome}" cadastrado com sucesso no catálogo de ${categoria}!`);
    setFormData({ nome: '', precoVenda: '', custo: '', codigo: '', estoqueInicial: '0' });
  };

  const isServico = [EstoqueCategoria.SERVICO, EstoqueCategoria.CIRURGIA, EstoqueCategoria.PROCEDIMENTO].includes(categoria);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Catálogo de Itens & Serviços</h2>
        <p className="text-slate-500 font-medium">Cadastre tudo que sua clínica oferece e utiliza nas comandas.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Seletor de Categoria */}
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">1. Selecione a Categoria</h3>
            <div className="space-y-3">
               {[
                 { id: EstoqueCategoria.SERVICO, label: 'Serviço Clínico', icon: 'fa-stethoscope' },
                 { id: EstoqueCategoria.VACINA, label: 'Vacina', icon: 'fa-syringe' },
                 { id: EstoqueCategoria.MEDICAMENTO, label: 'Medicamento', icon: 'fa-pills' },
                 { id: EstoqueCategoria.CIRURGIA, label: 'Procedimento Cirúrgico', icon: 'fa-scalpel' },
                 { id: EstoqueCategoria.PROCEDIMENTO, label: 'Exame / Procedimento', icon: 'fa-microscope' },
                 { id: EstoqueCategoria.REVENDA, label: 'Produto Petshop', icon: 'fa-bag-shopping' },
                 { id: EstoqueCategoria.INS_CLINICO, label: 'Insumo Interno', icon: 'fa-box-open' },
               ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoria(cat.id)}
                    className={`w-full flex items-center p-4 rounded-2xl transition-all border ${
                      categoria === cat.id 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' 
                        : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100'
                    }`}
                  >
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${categoria === cat.id ? 'bg-white/20' : 'bg-white'}`}>
                        <i className={`fas ${cat.icon}`}></i>
                     </div>
                     <span className="font-bold text-sm">{cat.label}</span>
                  </button>
               ))}
            </div>
         </div>

         {/* Formulário de Cadastro */}
         <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">2. Detalhes do Item</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nome do Item / Serviço</label>
                  <input 
                     type="text" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                     placeholder="Ex: Consulta Geral, Vacina V10, Dipirona..."
                     value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})}
                  />
               </div>

               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Valor de Venda (R$)</label>
                  <input 
                     type="number" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                     placeholder="0.00"
                     value={formData.precoVenda} onChange={e => setFormData({...formData, precoVenda: e.target.value})}
                  />
               </div>

               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Custo Estimado (R$)</label>
                  <input 
                     type="number" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                     placeholder="0.00"
                     value={formData.custo} onChange={e => setFormData({...formData, custo: e.target.value})}
                  />
               </div>

               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Código / SKU</label>
                  <input 
                     type="text" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                     placeholder="AUTO-001"
                     value={formData.codigo} onChange={e => setFormData({...formData, codigo: e.target.value})}
                  />
               </div>

               {!isServico && (
                  <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Estoque Inicial</label>
                     <input 
                        type="number" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.estoqueInicial} onChange={e => setFormData({...formData, estoqueInicial: e.target.value})}
                     />
                  </div>
               )}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
               <button 
                  onClick={handleSave}
                  className="px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200 transition-all transform hover:-translate-y-1"
               >
                  Cadastrar no Sistema
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CadastroItens;
