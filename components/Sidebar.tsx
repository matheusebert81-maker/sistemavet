
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cloudService } from '../services/cloudService';
import { backupService } from '../services/backupService';
import { MOCK_TENANT } from '../constants';
import { useApp } from '../contexts/AppContext';

interface MenuItem {
  to?: string;
  icon: string;
  label: string;
  children?: MenuItem[];
}

const MENU_STRUCTURE: MenuItem[] = [
  { to: '/dashboard', icon: 'fa-home', label: 'Início' },
  { 
    label: 'Atendimento', 
    icon: 'fa-user-doctor',
    children: [
      { to: '/agenda', icon: 'fa-calendar-alt', label: 'Agenda' },
      { to: '/comandas', icon: 'fa-file-invoice', label: 'Comandas' },
      { to: '/esteira', icon: 'fa-arrows-left-right-to-line', label: 'Esteira' },
      { to: '/prontuario', icon: 'fa-file-medical', label: 'Prontuário' },
      { to: '/vacinas', icon: 'fa-syringe', label: 'Vacinas' },
    ]
  },
  {
    label: 'Internação',
    icon: 'fa-bed-pulse',
    children: [
      { to: '/internacao', icon: 'fa-bed', label: 'Mapa de Leitos' },
      { to: '/cirurgico', icon: 'fa-scissors', label: 'Centro Cirúrgico' },
    ]
  },
  {
    label: 'Cadastros',
    icon: 'fa-folder-open',
    children: [
      { to: '/cadastro-pacientes', icon: 'fa-paw', label: 'Clientes e Animais' },
      { to: '/cadastro-itens', icon: 'fa-tags', label: 'Produtos e Serviços' },
      { to: '/estoque', icon: 'fa-boxes-stacked', label: 'Estoque' },
    ]
  },
  {
    label: 'Financeiro',
    icon: 'fa-money-bill-trend-up',
    children: [
      { to: '/vendas', icon: 'fa-cart-shopping', label: 'PDV / Vendas' },
      { to: '/financeiro', icon: 'fa-chart-pie', label: 'Fluxo de Caixa' },
      { to: '/auditoria', icon: 'fa-shield-halved', label: 'Auditoria' },
    ]
  },
  {
    label: 'Configurações',
    icon: 'fa-cog',
    children: [
      { to: '/admin/tenants', icon: 'fa-server', label: 'Plataforma' },
      { to: '/termos', icon: 'fa-file-signature', label: 'Termos' },
    ]
  }
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, lastSaved, vacinas } = useApp();
  const [openGroups, setOpenGroups] = useState<string[]>(['Atendimento', 'Internação']);
  const [storageData, setStorageData] = useState({ used: 0, max: 1073741824, percentage: 0 });
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Cálculo de Notificações de Vacina (Vencidas + Próximas 7 dias)
  const vaccineAlerts = vacinas ? vacinas.filter(v => {
    if (v.status === 'DONE') return false;
    const date = new Date(v.dataPrevista);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return date <= nextWeek;
  }).length : 0;

  useEffect(() => {
    const fetchStorage = async () => {
        try {
            const data = await cloudService.checkStorageUsage(MOCK_TENANT.id);
            setStorageData(data);
        } catch (e) { console.error(e); }
    };
    fetchStorage();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFullBackup = async () => {
      setIsBackingUp(true);
      await backupService.createFullBackup();
      setTimeout(() => setIsBackingUp(false), 2000);
  };

  const toggleGroup = (label: string) => {
    if (openGroups.includes(label)) {
      setOpenGroups(openGroups.filter(g => g !== label));
    } else {
      setOpenGroups([...openGroups, label]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <aside className="w-64 bg-white h-screen flex flex-col fixed left-0 top-0 z-50 border-r border-slate-200 shadow-sm">
      <div className="p-6 flex items-center space-x-3 mb-2">
        <div className="bg-gradient-to-br from-blue-600 to-emerald-400 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
          <i className="fas fa-paw text-white text-lg"></i>
        </div>
        <div>
          <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">Pet InfoCare</h1>
          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">Cloud</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-1">
        {MENU_STRUCTURE.map((item) => (
          <div key={item.label}>
            {item.children ? (
              // Grupo com Filhos
              <div className="mb-2">
                <button 
                  onClick={() => toggleGroup(item.label)}
                  className="w-full flex items-center justify-between px-3 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <i className={`fas ${item.icon} w-5 text-center text-slate-400 group-hover:text-blue-500 transition-colors`}></i>
                    <span className="font-bold text-sm">{item.label}</span>
                  </div>
                  <i className={`fas fa-chevron-down text-[10px] text-slate-300 transition-transform ${openGroups.includes(item.label) ? 'rotate-180' : ''}`}></i>
                </button>
                
                {openGroups.includes(item.label) && (
                  <div className="pl-4 space-y-1 mt-1 animate-in slide-in-from-top-2 duration-200">
                    {item.children.map(subItem => (
                      <NavLink
                        key={subItem.label}
                        to={subItem.to!}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all border-l-2 ml-2 ${
                            isActive 
                              ? 'border-blue-500 text-blue-600 bg-blue-50 font-bold' 
                              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                          }`
                        }
                      >
                         <span className="text-[13px]">{subItem.label}</span>
                         
                         {/* Badge de Vacinas */}
                         {subItem.label === 'Vacinas' && vaccineAlerts > 0 && (
                            <span className="ml-auto bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm animate-pulse">
                                {vaccineAlerts}
                            </span>
                         )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Item Solto (Dashboard)
              <NavLink
                to={item.to!}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-3 rounded-xl transition-all mb-2 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 font-bold' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <i className={`fas ${item.icon} w-5 text-center`}></i>
                <span className="text-sm">{item.label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Botão de Download Completo */}
      <div className="px-4 pb-2">
          <button 
            onClick={handleFullBackup}
            disabled={isBackingUp}
            className="w-full py-3 bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center space-x-2 shadow-lg"
          >
              {isBackingUp ? (
                  <><i className="fas fa-spinner fa-spin"></i><span>Exportando...</span></>
              ) : (
                  <><i className="fas fa-download"></i><span>Baixar Sistema</span></>
              )}
          </button>
      </div>

      {/* Medidor de Nuvem & Backup Status */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
         <div className="flex justify-between items-end mb-1">
            <span className="text-[10px] font-black text-slate-500 uppercase">Cloud Storage</span>
            <span className="text-[10px] font-bold text-slate-400">{Math.round(storageData.percentage)}%</span>
         </div>
         <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${storageData.percentage > 80 ? 'bg-rose-500' : 'bg-blue-500'}`} 
              style={{ width: `${storageData.percentage}%` }}
            ></div>
         </div>
         <div className="flex justify-between items-center mt-2">
            <p className="text-[9px] text-slate-400 font-medium">
               {formatSize(storageData.used)} / 1 GB
            </p>
            {lastSaved && (
              <p className="text-[9px] text-emerald-600 font-bold animate-pulse" title="Backup automático">
                <i className="fas fa-cloud-upload-alt mr-1"></i>
                {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            )}
         </div>
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm shadow-sm">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">{currentUser?.name || 'Visitante'}</p>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Online</p>
          </div>
          <button onClick={handleLogout} className="text-slate-300 hover:text-rose-500 transition-colors" title="Sair">
             <i className="fas fa-power-off text-xs"></i>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
