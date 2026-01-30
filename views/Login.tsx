
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

const Login: React.FC = () => {
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (matricula && email && password) {
        const success = login(email, password);
        if (success) {
            navigate('/dashboard');
        } else {
            alert("Erro ao autenticar.");
        }
    } else {
        alert("Credenciais incompletas.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      
      {/* Background Decorativo */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 flex h-[600px] border border-slate-100">
        
        {/* Lado Esquerdo: Marca & Info */}
        <div className="w-1/2 bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           
           <div className="z-10 cursor-pointer" onClick={() => navigate('/')}>
             <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                   <i className="fas fa-shield-cat text-white"></i>
                </div>
                <span className="text-xl font-black tracking-tight">Pet InfoCare</span>
             </div>
           </div>

           <div className="z-10">
              <h2 className="text-3xl font-black leading-tight mb-4">Gestão inteligente para clínicas exigentes.</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                 Acesse seu painel administrativo para controlar agenda, financeiro e prontuários com segurança nível bancário.
              </p>
           </div>

           <div className="z-10 flex space-x-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <span>Status: <span className="text-emerald-400">Operacional</span></span>
              <span>Versão: 2.5.0</span>
           </div>
        </div>

        {/* Lado Direito: Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
           <div className="mb-8">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Acesso ao Sistema</h3>
              <p className="text-slate-500 text-sm">Insira suas credenciais corporativas.</p>
           </div>

           <form onSubmit={handleLogin} className="space-y-5">
              <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">ID da Clínica</label>
                 <input 
                   type="text" 
                   className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300"
                   placeholder="Ex: CLI-1024"
                   value={matricula}
                   onChange={(e) => setMatricula(e.target.value.toUpperCase())}
                 />
              </div>
              <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">E-mail</label>
                 <input 
                   type="email" 
                   className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
              </div>
              <div>
                 <div className="flex justify-between mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Senha</label>
                    <a href="#" className="text-[10px] font-bold text-indigo-600 hover:underline">Esqueceu?</a>
                 </div>
                 <input 
                   type="password" 
                   className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                 />
              </div>

              <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 mt-4">
                 Entrar
              </button>
           </form>
           
           <div className="mt-8 text-center">
              <p className="text-xs text-slate-400">
                 Ainda não é cliente? <span onClick={() => navigate('/register-clinic')} className="text-indigo-600 font-bold cursor-pointer hover:underline">Solicite uma demo</span>
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
