
import React, { useState } from 'react';
import { MOCK_ESTOQUE, MOCK_TUTORES } from '../constants.tsx';
import { PaymentMethod } from '../types';

const Vendas: React.FC = () => {
  const [cart, setCart] = useState<{ itemId: string; nome: string; preco: number; qtd: number }[]>([]);
  const [selectedTutorId, setSelectedTutorId] = useState(MOCK_TUTORES[0].id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.preco * item.qtd), 0);

  const addToCart = (item: any) => {
    const existing = cart.find(c => c.itemId === item.id);
    if (existing) {
      setCart(cart.map(c => c.itemId === item.id ? { ...c, qtd: c.qtd + 1 } : c));
    } else {
      setCart([...cart, { itemId: item.id, nome: item.nome, preco: item.valorVenda, qtd: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(c => c.itemId !== itemId));
  };

  const handleFinalizarVenda = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      alert('Venda finalizada com sucesso! Recibo enviado ao tutor.');
      setCart([]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Grid de Produtos */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Vendas & Serviços</h2>
            <p className="text-slate-500 font-medium">Caixa rápido para produtos e procedimentos.</p>
          </div>
          <div className="relative w-64">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
            <input 
              type="text" 
              placeholder="Buscar item..." 
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {MOCK_ESTOQUE.map(item => (
            <div 
              key={item.id} 
              onClick={() => addToCart(item)}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-teal-50 hover:border-teal-200 transition-all cursor-pointer group flex flex-col justify-between min-h-[220px]"
            >
              <div>
                 <div className="w-full h-24 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-slate-300 group-hover:bg-teal-50 group-hover:text-teal-400 transition-colors">
                   <i className={`fas ${item.categoria === 'VACINA' ? 'fa-syringe' : item.categoria === 'SERVICO' ? 'fa-user-doctor' : 'fa-box-open'} text-3xl`}></i>
                 </div>
                 <h4 className="font-black text-slate-800 mb-1 line-clamp-2">{item.nome}</h4>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.categoria}</p>
              </div>
              <div className="flex justify-between items-end mt-4">
                <span className="text-xl font-black text-teal-600">R$ {item.valorVenda.toFixed(2)}</span>
                <span className={`text-[9px] font-bold px-2 py-1 rounded-lg ${item.quantidade <= item.minimo ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                  {item.quantidade} un
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Sidebar */}
      <div className="w-[450px] bg-white border-l border-slate-100 flex flex-col shadow-2xl z-10">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-900">Carrinho de Compras</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          {cart.map(item => (
            <div key={item.itemId} className="flex justify-between items-center bg-white border border-slate-100 p-4 rounded-2xl group animate-in slide-in-from-right duration-300 shadow-sm">
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm">{item.nome}</p>
                <p className="text-xs text-slate-400">{item.qtd}x R$ {item.preco.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-black text-slate-900">R$ {(item.preco * item.qtd).toFixed(2)}</span>
                <button 
                  onClick={() => removeFromCart(item.itemId)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                >
                  <i className="fas fa-trash-alt text-xs"></i>
                </button>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
              <i className="fas fa-cart-arrow-down text-6xl mb-4 text-slate-300"></i>
              <p className="font-bold text-slate-500">Caixa Livre</p>
              <p className="text-xs text-slate-400">Adicione itens para começar</p>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50 space-y-6 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tutor Responsável</label>
            <select 
              className="w-full p-4 bg-white border-none shadow-sm rounded-xl text-sm font-bold outline-none text-slate-700"
              value={selectedTutorId}
              onChange={(e) => setSelectedTutorId(e.target.value)}
            >
              {MOCK_TUTORES.map(t => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Forma de Pagamento</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: PaymentMethod.CASH, label: 'Dinheiro', icon: 'fa-money-bill-wave', color: 'bg-emerald-500' },
                { id: PaymentMethod.CARD, label: 'Cartão', icon: 'fa-credit-card', color: 'bg-blue-500' },
                { id: PaymentMethod.PIX, label: 'PIX', icon: 'fa-qrcode', color: 'bg-teal-500' },
                { id: PaymentMethod.CREDIT_BOOK, label: 'Fiado/Social', icon: 'fa-book-heart', color: 'bg-rose-500' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-4 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md ${
                    paymentMethod === m.id 
                    ? `${m.color} text-white scale-105 ring-2 ring-offset-2 ring-${m.color.split('-')[1]}-300` 
                    : 'bg-white text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <i className={`fas ${m.icon}`}></i>
                  <span className="text-[11px] font-black uppercase">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-between items-end">
             <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Total a Pagar</p>
                <p className="text-4xl font-black text-slate-900 tracking-tight">R$ {total.toFixed(2)}</p>
             </div>
             <button 
               onClick={handleFinalizarVenda}
               disabled={isProcessing || cart.length === 0}
               className="px-8 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl uppercase text-xs tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
             >
               {isProcessing ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-check mr-2"></i>}
               Concluir
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vendas;
