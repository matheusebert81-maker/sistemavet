
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessPasswordStrength } from '../utils/security';

const RegisterClinic: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clinicName: '',
    cnpj: '',
    phone: '',
    whatsapp: '', // Added WhatsApp
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    receiveViaWhatsapp: true // Added Opt-in
  });

  // Calcula força em tempo real
  const passwordStrength = assessPasswordStrength(formData.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de segurança básica
    if (formData.password !== formData.confirmPassword) {
        alert("As senhas não coincidem.");
        return;
    }
    
    if (!passwordStrength.isSafe) {
        alert("A senha é muito fraca para uma conta administrativa. Reforce sua senha.");
        return;
    }
    
    // Simulação de criação de conta e geração de matrícula
    const matriculaGerada = `CLI-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Dados para API (Removendo senha do log)
    const { password, confirmPassword, ...apiData } = formData;
    
    // Dados iniciais do Tenant
    const newTenantData = {
        ...apiData,
        matricula: matriculaGerada,
        storageUsed: 0,
        maxStorage: 1073741824, // 1GB
        plan: 'CLOUD_START'
    };

    // Em produção, isso iria para o backend. O log aqui está seguro pois não tem senha.
    console.log("[API] Registrando Clínica na Nuvem (Payload Seguro):", newTenantData);
    
    let successMsg = `Cadastro realizado com sucesso!\n\nSeu ambiente de 1GB na nuvem foi provisionado.\nMATRÍCULA: ${matriculaGerada}`;
    if (formData.receiveViaWhatsapp) {
        successMsg += `\n\nEnviamos suas credenciais para o WhatsApp: ${formData.whatsapp}`;
    }

    alert(successMsg);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col md:flex-row">
        
        {/* Lado Esquerdo - Visual */}
        <div className="md:w-1/3 bg-slate-900 p-10 flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           <div className="z-10">
             <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                <i className="fas fa-cloud-arrow-up text-white text-xl"></i>
             </div>
             <h2 className="text-2xl font-black text-white leading-tight mb-2">Sua Clínica na Nuvem</h2>
             <p className="text-slate-400 text-sm font-medium">Infraestrutura escalável começando com 1GB garantido.</p>
           </div>
           <div className="z-10 mt-10">
              <div className="flex items-center space-x-2 mb-4">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                 <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Storage Provisionado</p>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Passo {step} de 2</p>
              <div className="w-full h-1 bg-slate-800 rounded-full mt-2">
                 <div className={`h-full bg-indigo-500 rounded-full transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
              </div>
           </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="md:w-2/3 p-12 relative">
           <button onClick={() => navigate('/login')} className="absolute top-8 right-8 text-[10px] font-black text-slate-400 uppercase hover:text-indigo-600 transition-all">
             Já tenho conta <i className="fas fa-arrow-right ml-1"></i>
           </button>

           <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">
             {step === 1 ? 'Dados da Empresa' : 'Administrador do Sistema'}
           </h3>

           <form onSubmit={handleSubmit} className="space-y-6">
             {step === 1 && (
               <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nome da Clínica / Hospital</label>
                    <input 
                      type="text" required
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="Ex: PetCare Central"
                      value={formData.clinicName}
                      onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">CNPJ</label>
                      <input 
                        type="text" required
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="00.000.000/0000-00"
                        value={formData.cnpj}
                        onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Telefone Fixo</label>
                      <input 
                        type="text" required
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="(00) 0000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Campo WhatsApp Adicionado */}
                  <div>
                      <label className="text-[10px] font-black text-emerald-600 uppercase mb-2 block flex items-center">
                          <i className="fab fa-whatsapp mr-1 text-lg"></i> WhatsApp para Contato
                      </label>
                      <input 
                        type="tel" required
                        className="w-full p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-emerald-800"
                        placeholder="(00) 90000-0000"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      />
                  </div>

                  <div className="pt-4">
                     <button 
                       type="button" 
                       onClick={() => setStep(2)}
                       className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                     >
                       Continuar <i className="fas fa-arrow-right ml-2"></i>
                     </button>
                  </div>
               </div>
             )}

             {step === 2 && (
               <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nome do Gestor</label>
                    <input 
                      type="text" required
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.adminName}
                      onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">E-mail Corporativo</label>
                    <input 
                      type="email" required
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Senha Mestra</label>
                      <input 
                        type="password" required
                        className={`w-full p-4 bg-slate-50 border rounded-2xl text-sm font-bold outline-none transition-all ${passwordStrength.score > 0 && !passwordStrength.isSafe ? 'border-rose-200 bg-rose-50' : 'border-slate-100 focus:ring-2 focus:ring-indigo-500'}`}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                       {/* Indicador de Força */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex space-x-1 h-1">
                            {[1, 2, 3, 4].map((step) => (
                              <div 
                                key={step} 
                                className={`h-full flex-1 rounded-full transition-all duration-300 ${
                                  passwordStrength.score >= step ? passwordStrength.color : 'bg-slate-200'
                                }`}
                              ></div>
                            ))}
                          </div>
                          <p className={`text-[10px] font-black uppercase mt-1 text-right ${passwordStrength.textColor}`}>
                            {passwordStrength.label}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Confirmar</label>
                      <input 
                        type="password" required
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Checkbox Opt-in WhatsApp */}
                  <label className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-xl cursor-pointer border border-emerald-100">
                      <input 
                          type="checkbox" 
                          className="mt-1 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                          checked={formData.receiveViaWhatsapp}
                          onChange={(e) => setFormData({...formData, receiveViaWhatsapp: e.target.checked})}
                      />
                      <div className="text-sm">
                          <span className="font-bold text-emerald-800 block">Receber acesso no WhatsApp</span>
                          <span className="text-emerald-600/80 text-xs">Enviaremos a matrícula e senha temporária para {formData.whatsapp || 'seu número'}.</span>
                      </div>
                  </label>

                  <div className="pt-4 flex space-x-4">
                     <button 
                       type="button" 
                       onClick={() => setStep(1)}
                       className="w-1/3 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                     >
                       Voltar
                     </button>
                     <button 
                       type="submit" 
                       className={`w-2/3 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
                          !passwordStrength.isSafe && formData.password 
                          ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                       }`}
                       disabled={!passwordStrength.isSafe && formData.password.length > 0}
                     >
                       Finalizar Cadastro
                     </button>
                  </div>
               </div>
             )}
           </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterClinic;
