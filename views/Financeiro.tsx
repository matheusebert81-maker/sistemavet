
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const Financeiro: React.FC = () => {
  const { transactions, isFeatureLocked, addTransaction } = useApp();
  const [activeTab, setActiveTab] = useState<'EXTRATO' | 'ANALISE'>('EXTRATO');

  // Cálculos Básicos (Free)
  const saldo = transactions.reduce((acc, t) => t.type === 'INCOME' ? acc + t.amount : acc - t.amount, 0);
  const entradas = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
  const saidas = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);

  // Paywall Overlay
  const PremiumOverlay = () => (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center">
          <i className="fas fa-lock text-4xl text-indigo-600 mb-4 animate-bounce"></i>
          <h3 className="text-2xl font-black text-slate-900">Recurso Premium</h3>
          <p className="text-slate-500 mb-6 max-w-sm">Análises detalhadas, DRE e projeção de fluxo de caixa estão disponíveis no plano Pro.</p>
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase shadow-xl hover:bg-indigo-700 transition-all">
              Liberar Analytics
          </button>
      </div>
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-slate-50 min-h-screen">
      
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financeiro</h2>
          <p className="text-slate-500 font-medium">Controle de caixa e lançamentos.</p>
        </div>
        <button 
            onClick={() => {
                // Simulação simples de adicionar transação manual
                const desc = prompt("Descrição:");
                const valor = Number(prompt("Valor:"));
                if(desc && valor) addTransaction({
                    description: desc, amount: valor, type: 'INCOME', category: 'Manual', date: new Date().toISOString(), status: 'PAID'
                });
            }}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all"
        >
             <i className="fas fa-plus mr-2"></i> Lançamento Rápido
        </button>
      </header>

      {/* Resumo Básico (Sempre Visível) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Atual</p>
              <h3 className={`text-3xl font-black mt-2 ${saldo >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                  R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Entradas</p>
              <h3 className="text-3xl font-black text-emerald-600 mt-2">
                  + R$ {entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Saídas</p>
              <h3 className="text-3xl font-black text-rose-600 mt-2">
                  - R$ {saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('EXTRATO')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'EXTRATO' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
              Extrato (Livro Caixa)
          </button>
          <button 
            onClick={() => setActiveTab('ANALISE')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'ANALISE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
              Gráficos & Análise <i className="fas fa-lock text-[10px] ml-1 opacity-50"></i>
          </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px] relative">
          
          {/* CONTEÚDO: EXTRATO (FREE) */}
          {activeTab === 'EXTRATO' && (
              <div className="divide-y divide-slate-50">
                  {transactions.length === 0 ? (
                      <div className="p-10 text-center text-slate-400">Nenhuma transação registrada.</div>
                  ) : (
                      transactions.map(t => (
                          <div key={t.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                              <div className="flex items-center space-x-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                      <i className={`fas ${t.type === 'INCOME' ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                                  </div>
                                  <div>
                                      <p className="font-bold text-slate-900">{t.description}</p>
                                      <p className="text-xs text-slate-400 font-medium">{new Date(t.date).toLocaleDateString()} • {t.category}</p>
                                  </div>
                              </div>
                              <span className={`font-black ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {t.type === 'INCOME' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                          </div>
                      ))
                  )}
              </div>
          )}

          {/* CONTEÚDO: ANÁLISE (PAGA) */}
          {activeTab === 'ANALISE' && (
              <div className="p-8 h-full relative">
                  {isFeatureLocked('ANALYTICS') && <PremiumOverlay />}
                  
                  {/* Mock Visual Borrado */}
                  <div className={`grid grid-cols-2 gap-8 ${isFeatureLocked('ANALYTICS') ? 'blur-md opacity-50' : ''}`}>
                      <div className="h-64 bg-slate-50 rounded-2xl flex items-end justify-around p-4">
                          {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                              <div key={i} className="w-8 bg-indigo-500 rounded-t-lg" style={{ height: `${h}%` }}></div>
                          ))}
                      </div>
                      <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full border-8 border-indigo-500 border-t-emerald-400 border-l-purple-500"></div>
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default Financeiro;
