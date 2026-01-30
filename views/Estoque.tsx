
import React, { useState } from 'react';
import { MOCK_ESTOQUE, MOCK_USER } from '../constants.tsx';
import { EstoqueCategoria, LogAction } from '../types';
import { logAction } from '../services/logService';

// Estoque: Corrigida a nomenclatura de propriedades como unidadeId e adicionada tipagem explícita para strings de enum

const Estoque: React.FC = () => {
  const [items, setItems] = useState(MOCK_ESTOQUE);
  const [filter, setFilter] = useState<EstoqueCategoria | 'TODOS'>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'TODOS' || item.categoria === filter;
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusInfo = (item: typeof MOCK_ESTOQUE[0]) => {
    const today = new Date();
    const expiry = new Date(item.validade);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (expiry < today) return { label: 'VENCIDO', color: 'bg-rose-100 text-rose-700 border-rose-200' };
    if (item.quantidade <= item.minimo) return { label: 'CRÍTICO', color: 'bg-rose-100 text-rose-700 border-rose-200' };
    if (diffDays <= 30) return { label: 'EXPIRA LOGO', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'OK', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  };

  const handleAdjustStock = (id: string, amount: number, reason: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    logAction(
      MOCK_USER.unidadeId,
      MOCK_USER.id,
      LogAction.UPDATE,
      "StockAdjustment",
      id,
      { old: item.quantidade, new: item.quantidade + amount, reason }
    );

    setItems(prev => prev.map(i => i.id === id ? { ...i, quantidade: i.quantidade + amount } : i));
    alert(`Estoque de ${item.nome} ajustado em ${amount} unidades.`);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Estoque</h2>
          <p className="text-slate-500 font-medium">Controle de insumos, medicamentos e validade (Unidade Centro).</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center">
             <i className="fas fa-file-import mr-2"></i> Importar
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">
            <i className="fas fa-plus mr-2"></i> Novo Item
          </button>
        </div>
      </header>

      <div className="flex space-x-4 items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
          <input 
            type="text" 
            placeholder="Buscar por SKU ou Nome..." 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="bg-slate-50 border-none rounded-2xl px-6 py-3 text-xs font-black uppercase outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="TODOS">Todas Categorias</option>
          {Object.values(EstoqueCategoria).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qtd</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Validade</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredItems.map(item => {
              const status = getStatusInfo(item);
              return (
                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 text-xs font-black text-slate-400">{item.sku}</td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-900">{item.nome}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Custo: R$ {item.valorCusto.toFixed(2)}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase">{item.categoria}</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-black text-slate-900">{item.quantidade} {item.unidadeMedida}</span>
                      <span className="text-[9px] text-slate-400 font-bold">Min: {item.minimo}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-500">{new Date(item.validade).toLocaleDateString()}</td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black border ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end space-x-2">
                       <button 
                         onClick={() => handleAdjustStock(item.id, 1, 'Ajuste manual')}
                         className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"
                       >
                         <i className="fas fa-plus text-[10px]"></i>
                       </button>
                       <button 
                         onClick={() => handleAdjustStock(item.id, -1, 'Ajuste manual')}
                         className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all"
                       >
                         <i className="fas fa-minus text-[10px]"></i>
                       </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Estoque;
