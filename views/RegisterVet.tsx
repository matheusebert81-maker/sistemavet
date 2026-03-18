
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessPasswordStrength } from '../utils/security';

const RegisterVet: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    crmv: '',
    uf: 'SP',
    especialidade: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: ''
  });

  // Calcula força em tempo real
  const passwordStrength = assessPasswordStrength(formData.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
        alert("As senhas não coincidem.");
        return;
    }

    if (!passwordStrength.isSafe) {
        alert("A senha é muito fraca. Tente misturar letras maiúsculas, números ou símbolos.");
        return;
    }

    // Separa dados sensíveis antes de qualquer log ou envio (Mock)
    const { password, confirmPassword, ...safeData } = formData;

    console.log("[DB_INSERT] Registrando novo veterinário (Safe Payload):", safeData);
    
    alert('Solicitação de registro enviada para o administrador do Pet InfoCare.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5">
           <i className="fas fa-user-md text-9xl"></i>
        </div>

        <button onClick={() => navigate('/login')} className="mb-8 text-[10px] font-black text-slate-400 uppercase hover:text-indigo-600 transition-all">
          <i className="fas fa-arrow-left mr-2"></i> Voltar para Login
        </button>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Registro de Veterinário</h2>
        <p className="text-slate-500 font-medium mb-10">Preencha suas informações profissionais para acesso ao sistema.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nome Completo</label>
            <input 
              type="text" required
              className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">CRMV</label>
            <input 
              type="text" required placeholder="00000"
              className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.crmv}
              onChange={(e) => setFormData({...formData, crmv: e.target.value})}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">UF de Registro</label>
            <select 
              className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.uf}
              onChange={(e) => setFormData({...formData, uf: e.target.value})}
            >
              {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Especialidade Principal</label>
            <input 
              type="text" placeholder="Ex: Clínica Geral, Cirurgia..."
              className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.especialidade}
              onChange={(e) => setFormData({...formData, especialidade: e.target.value})}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Telefone / WhatsApp</label>
            <input 
              type="tel" required placeholder="(00) 00000-0000"
              className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.telefone}
              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
            />
          </div>

          <div className="md:col-span-2 border-t border-slate-100 pt-6">
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">E-mail Profissional</label>
            <input 
              type="email" required
              className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Senha</label>
            <input 
              type="password" required
              className={`w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold focus:ring-2 outline-none transition-all ${passwordStrength.score > 0 && !passwordStrength.isSafe ? 'ring-2 ring-rose-200 bg-rose-50' : 'focus:ring-indigo-500'}`}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {/* Indicador de Força */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex space-x-1 h-1.5">
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
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Confirmar Senha</label>
            <input 
              type="password" required
              className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <div className="md:col-span-2 mt-6">
             <button 
                type="submit"
                className={`w-full py-5 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all ${
                    !passwordStrength.isSafe && formData.password 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
                }`}
                disabled={!passwordStrength.isSafe && formData.password.length > 0}
             >
               Finalizar Cadastro Profissional
             </button>
             <p className="text-[10px] text-center text-slate-400 font-bold uppercase mt-6 tracking-tighter">
                Ao registrar, você concorda com os termos de uso do Pet InfoCare.
             </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterVet;
