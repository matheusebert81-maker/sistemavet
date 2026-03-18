
import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { InventoryItem } from '../types';

const StatsCard: React.FC<{ icon: string; label: string; value: string | number; color: string; }> = ({ icon, label, value, color }) => (
  <div className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-${color}-200 transition-all`}>
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-${color}-50 group-hover:scale-150 transition-transform duration-500 opacity-50`}></div>
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-2xl bg-${color}-100 text-${color}-600 flex items-center justify-center text-2xl mb-4`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <p className="text-3xl font-black text-slate-800">{value}</p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
  </div>
);

const ProdutoCard: React.FC<{ item: InventoryItem; onClick: () => void }> = ({ item, onClick }) => {
  const stockStatus = item.quantity <= 0 ? 'empty' : item.quantity <= item.minQuantity ? 'low' : 'ok';
  
  const statusStyles = {
    ok: { border: 'border-transparent', bg: 'bg-white' },
    low: { border: 'border-amber-300', bg: 'bg-amber-50/50' },
    empty: { border: 'border-rose-300', bg: 'bg-rose-50/50' },
  };

  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-3xl border shadow-sm hover:shadow-xl hover:shadow-indigo-50 hover:-translate-y-1 transition-all cursor-pointer group ${statusStyles[stockStatus].border} ${statusStyles[stockStatus].bg}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{item.nome}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.categoria}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-indigo-600">R$ {item.valorVenda.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl mt-4 text-xs">
        <div className="font-bold text-slate-500">
          SKU: <span className="font-mono">{item.sku}</span>
        </div>
        <div className={`font-black px-2 py-1 rounded-md text-[10px] ${
            stockStatus === 'empty' ? 'bg-rose-100 text-rose-600' :
            stockStatus === 'low' ? 'bg-amber-100 text-amber-600' :
            'bg-emerald-100 text-emerald-600'
        }`}>
          {item.quantidade} em estoque
        </div>
      </div>
    </div>
  );
};

const Estoque: React.FC = () => {
  const { inventory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => {
    const totalValue = inventory.reduce((sum, item) => sum + (item.costPrice || 0) * (item.quantity || 0), 0);
    const lowStock = inventory.filter(p => p.quantity > 0 && p.quantity <= p.minQuantity).length;
    const outOfStock = inventory.filter(p => p.quantity <= 0).length;
    return { totalValue, lowStock, outOfStock };
  }, [inventory]);
  
  const filteredItems = useMemo(() => 
    inventory.filter(item => 
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    ), [inventory, searchTerm]);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Produtos & Estoque</h2>
          <p className="text-slate-500 font-medium">Gerenciamento de inventário, serviços e insumos.</p>
        </div>
        <div className="flex space-x-3">
           <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center text-xs uppercase tracking-widest">
            <i className="fas fa-plus mr-2"></i> Novo Produto
          </button>
        </div>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon="fa-boxes-stacked" label="Itens no Catálogo" value={inventory.length} color="indigo" />
        <StatsCard icon="fa-dollar-sign" label="Valor em Estoque (Custo)" value={`R$ ${stats.totalValue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} color="emerald" />
        <StatsCard icon="fa-triangle-exclamation" label="Estoque Baixo" value={stats.lowStock} color="amber" />
        <StatsCard icon="fa-box-open" label="Fora de Estoque" value={stats.outOfStock} color="rose" />
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
          <input 
            type="text"
            placeholder="Buscar por nome, SKU ou categoria..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <ProdutoCard 
              key={item.id} 
              item={item} 
              onClick={() => alert(`Detalhes para ${item.nome}`)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-slate-100">
            <i className="fas fa-box-open text-6xl text-slate-200 mb-4"></i>
            <p className="font-bold text-slate-500">Nenhum produto encontrado</p>
            <p className="text-xs text-slate-400">Tente ajustar sua busca ou adicione um novo produto.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Estoque;
