
import React from 'react';
import { MOCK_UNIDADES } from '../constants';

interface BranchSelectorProps {
  activeUnidadeId: string;
  onChange: (id: string) => void;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({ activeUnidadeId, onChange }) => {
  return (
    <div className="relative group">
      <div className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-200 transition-all border border-slate-200">
        <i className="fas fa-building text-indigo-500 text-xs"></i>
        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
          {MOCK_UNIDADES.find(u => u.id === activeUnidadeId)?.nome || 'Selecionar Unidade'}
        </span>
        <i className="fas fa-chevron-down text-[10px] text-slate-400"></i>
      </div>
      
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-[100] transform origin-top-right group-hover:translate-y-0 translate-y-2">
        <div className="px-4 py-2 mb-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alternar Unidade</p>
        </div>
        {MOCK_UNIDADES.map(u => (
          <button
            key={u.id}
            onClick={() => onChange(u.id)}
            className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center justify-between ${
              activeUnidadeId === u.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {u.nome}
            {activeUnidadeId === u.id && <i className="fas fa-check text-[10px]"></i>}
          </button>
        ))}
        <div className="mt-3 pt-3 border-t border-slate-50 px-4">
          <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline">
            + Gerenciar Unidades
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchSelector;
