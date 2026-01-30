
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  // Estado para Modal de Lead
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadMethod, setLeadMethod] = useState<'WHATSAPP' | 'EMAIL'>('WHATSAPP');
  const [leadData, setLeadData] = useState({ name: '', contact: '' });

  // Cálculo de desconto de 30% por 6 meses
  const calculatePrice = (basePrice: number) => {
    const discounted = basePrice * 0.7; // 30% off
    return {
        original: basePrice,
        discounted: Math.ceil(discounted) - 0.10 // Preço psicológico xx.90
    };
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Simulação de envio de lead
      console.log(`Enviando Lead via ${leadMethod}:`, leadData);
      
      const message = leadMethod === 'WHATSAPP' 
        ? `Olá ${leadData.name}, enviamos seu acesso de teste para o WhatsApp ${leadData.contact}!` 
        : `Olá ${leadData.name}, verifique seu e-mail ${leadData.contact} para acessar o teste!`;
      
      alert(message);
      setShowLeadModal(false);
      navigate('/register-clinic'); // Prossegue para registro completo pré-preenchido (simulado)
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-teal-500 selection:text-white">
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-center py-2 text-xs font-bold uppercase tracking-widest sticky top-0 z-[60]">
         🎉 Oferta Social: 30% de desconto nos primeiros 6 meses para novas clínicas!
      </div>

      {/* Navbar Social */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 top-8">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-200">
              <i className="fas fa-cat text-white text-lg"></i>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-800 block leading-none">Pet InfoCare</span>
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Cat & Dog System</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-slate-500">
             <a href="#como-funciona" className="hover:text-teal-600 transition-colors">Como Funciona</a>
             <a href="#recursos" className="hover:text-teal-600 transition-colors">Recursos</a>
             <a href="#precos" className="hover:text-teal-600 transition-colors">Preço Justo</a>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-teal-600 transition-colors"
            >
              Entrar
            </button>
            <button 
              onClick={() => setShowLeadModal(true)}
              className="px-6 py-3 bg-teal-500 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-teal-600 hover:scale-105 transition-all shadow-lg shadow-teal-200"
            >
              Testar Grátis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section: Gatos em Destaque */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div className="relative z-10 order-2 lg:order-1">
              <div className="inline-flex items-center space-x-2 bg-orange-100 border border-orange-200 px-4 py-2 rounded-full mb-6">
                 <i className="fas fa-paw text-orange-500"></i>
                 <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">O preferido dos gateiros</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-6">
                Gestão Veterinária<br/>
                <span className="text-teal-500">Simples e Humana.</span>
              </h1>
              
              <p className="text-lg text-slate-500 font-medium max-w-lg leading-relaxed mb-8">
                Do consultório popular ao hospital 24h. Organize sua agenda, estoque e prontuários com um sistema que entende a rotina de quem salva vidas.
              </p>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                 <button onClick={() => setShowLeadModal(true)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all">
                    Criar Conta Grátis
                 </button>
                 <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center">
                    <i className="fab fa-whatsapp text-emerald-500 text-lg mr-2"></i> Receber Demo
                 </button>
              </div>

              <div className="mt-10 flex items-center space-x-4 text-xs font-bold text-slate-400">
                  <div className="flex -space-x-2">
                     <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" alt="Vet" />
                     <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=5" alt="Vet" />
                     <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=8" alt="Vet" />
                  </div>
                  <span>Usado por +500 clínicas gateiras</span>
              </div>
           </div>

           <div className="relative order-1 lg:order-2">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-200/30 rounded-full blur-3xl -z-10"></div>
              {/* Imagem de Gato substituída conforme solicitado */}
              <img 
                 src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                 alt="Gato com olhos atentos" 
                 className="rounded-[3rem] shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500 object-cover h-[500px] w-full"
              />
              {/* Floating Card */}
              <div className="absolute bottom-10 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-4 animate-bounce duration-[3000ms]">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl">
                      <i className="fas fa-syringe"></i>
                  </div>
                  <div>
                      <p className="font-black text-slate-800 text-sm">Vacina V5 Aplicada</p>
                      <p className="text-xs text-slate-500">Mingau • Felino • 4kg</p>
                  </div>
              </div>
           </div>
        </div>
      </section>

      {/* Seção: Como Funciona */}
      <section id="como-funciona" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                  <span className="text-teal-600 font-black text-[10px] uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full">Passo a Passo</span>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4">Simples para sua equipe</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                      { 
                          img: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=500", 
                          title: "1. Cadastro Rápido", 
                          desc: "Cadastre tutores e pacientes (Cães e Gatos) em segundos. Ficha de felinos personalizada." 
                      },
                      { 
                          img: "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?w=500", 
                          title: "2. Prontuário Visual", 
                          desc: "Histórico clínico completo, carteira de vacinação e controle de peso." 
                      },
                      { 
                          img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500", 
                          title: "3. Controle Financeiro", 
                          desc: "Fluxo de caixa, vendas de produtos e emissão de recibos integrados." 
                      }
                  ].map((item, i) => (
                      <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                          <div className="h-48 overflow-hidden">
                              <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                          </div>
                          <div className="p-8">
                              <h3 className="text-xl font-black text-slate-800 mb-2">{item.title}</h3>
                              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Preços */}
      <section id="precos" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Comece Grátis Hoje</h2>
              <p className="text-slate-500 mt-4">Planos flexíveis que crescem com sua clínica.</p>
              
              <div className="inline-flex bg-slate-50 border border-slate-200 p-1 rounded-xl mt-8">
                 <button onClick={() => setBillingCycle('monthly')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'}`}>Mensal</button>
                 <button onClick={() => setBillingCycle('yearly')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${billingCycle === 'yearly' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'}`}>Anual (Extra -10%)</button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Plano Social */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 hover:border-teal-300 transition-all relative overflow-hidden group">
                 <h3 className="text-xl font-black text-slate-900">Start Social</h3>
                 <p className="text-sm text-slate-500 mt-2">Para quem está começando.</p>
                 <div className="my-8">
                    <span className="text-4xl font-black text-slate-900">R$ {calculatePrice(69.90).discounted}</span>
                    <span className="text-slate-400 font-bold text-xs">/mês</span>
                 </div>
                 <button onClick={() => setShowLeadModal(true)} className="w-full py-4 border-2 border-slate-900 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                    Criar Conta
                 </button>
              </div>

              {/* Plano Clínica Pro */}
              <div className="bg-slate-900 text-white rounded-[2rem] p-8 relative transform md:-translate-y-4 shadow-2xl shadow-teal-500/20">
                 <div className="absolute top-0 right-0 bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-[2rem]">
                    Recomendado
                 </div>
                 <h3 className="text-xl font-black">Clínica Pro</h3>
                 <p className="text-sm text-slate-400 mt-2">Gestão completa e ilimitada.</p>
                 <div className="my-8">
                    <span className="text-4xl font-black">R$ {calculatePrice(149.90).discounted}</span>
                    <span className="text-slate-400 font-bold text-xs">/mês</span>
                 </div>
                 <button onClick={() => setShowLeadModal(true)} className="w-full py-4 bg-teal-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/50">
                    Testar Grátis no WhatsApp
                 </button>
              </div>

              {/* Plano Hospital */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 hover:border-teal-300 transition-all">
                 <h3 className="text-xl font-black text-slate-900">Hospital 24h</h3>
                 <p className="text-sm text-slate-500 mt-2">Múltiplas unidades e internação.</p>
                 <div className="my-8">
                    <span className="text-4xl font-black text-slate-900">R$ {calculatePrice(299.90).discounted}</span>
                    <span className="text-slate-400 font-bold text-xs">/mês</span>
                 </div>
                 <button onClick={() => setShowLeadModal(true)} className="w-full py-4 border-2 border-slate-900 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                    Falar com Consultor
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-16 text-white border-t border-slate-800">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
               <div className="flex items-center space-x-3 mb-6 md:mb-0">
                   <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-paw text-white"></i>
                   </div>
                   <span className="font-black text-xl tracking-tight">Pet InfoCare</span>
               </div>
               <div className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center md:text-right">
                   Especialistas em Felinos e Caninos.<br/>© 2024 Pet InfoCare Systems.
               </div>
            </div>
         </div>
      </footer>

      {/* MODAL DE LEAD / CAPTURA (NOVO) */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
              <button 
                onClick={() => setShowLeadModal(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
              >
                 <i className="fas fa-times"></i>
              </button>

              <div className="text-center mb-8">
                 <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                    <i className="fas fa-rocket"></i>
                 </div>
                 <h3 className="text-2xl font-black text-slate-900">Teste Grátis Agora</h3>
                 <p className="text-sm text-slate-500 mt-2">Escolha como prefere receber seu acesso.</p>
              </div>

              {/* Tabs do Modal */}
              <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                 <button 
                   onClick={() => setLeadMethod('WHATSAPP')}
                   className={`flex-1 py-3 rounded-lg text-xs font-black uppercase transition-all flex items-center justify-center space-x-2 ${leadMethod === 'WHATSAPP' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    <i className="fab fa-whatsapp text-lg"></i>
                    <span>WhatsApp</span>
                 </button>
                 <button 
                   onClick={() => setLeadMethod('EMAIL')}
                   className={`flex-1 py-3 rounded-lg text-xs font-black uppercase transition-all flex items-center justify-center space-x-2 ${leadMethod === 'EMAIL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    <i className="fas fa-envelope text-lg"></i>
                    <span>E-mail</span>
                 </button>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Seu Nome</label>
                    <input 
                       type="text" required
                       placeholder="Como devemos te chamar?"
                       className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none"
                       value={leadData.name}
                       onChange={e => setLeadData({...leadData, name: e.target.value})}
                    />
                 </div>

                 {leadMethod === 'WHATSAPP' ? (
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Seu WhatsApp</label>
                        <input 
                           type="tel" required
                           placeholder="(00) 00000-0000"
                           className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                           value={leadData.contact}
                           onChange={e => setLeadData({...leadData, contact: e.target.value})}
                        />
                        <p className="text-[10px] text-slate-400 mt-2 ml-2">
                           <i className="fas fa-lock mr-1"></i> Enviaremos seu login e senha por zap.
                        </p>
                     </div>
                 ) : (
                     <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Seu E-mail Profissional</label>
                        <input 
                           type="email" required
                           placeholder="nome@clinica.com"
                           className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                           value={leadData.contact}
                           onChange={e => setLeadData({...leadData, contact: e.target.value})}
                        />
                     </div>
                 )}

                 <button 
                   type="submit"
                   className={`w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all mt-6 ${leadMethod === 'WHATSAPP' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                 >
                    {leadMethod === 'WHATSAPP' ? 'Receber Acesso no Zap' : 'Cadastrar por E-mail'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
