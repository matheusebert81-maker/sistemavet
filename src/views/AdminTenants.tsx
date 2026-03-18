import React, { useState } from 'react';
import { MOCK_TENANT, MOCK_UNIDADES } from '../constants';
import { Tenant, TenantStatus, PlanoType, Unidade } from '../types';
import { ChevronDown, ChevronRight, Building, MapPin, Plus, Server, Database, Activity, ShieldCheck } from 'lucide-react';

const AdminTenants: React.FC = () => {
  // Estado local simulando a base de dados de clientes SaaS com dados de STORAGE
  const [tenants, setTenants] = useState<Tenant[]>([
    { 
        ...MOCK_TENANT, 
        status: TenantStatus.ACTIVE, 
        domain: 'hospital.petinfocare.com', 
        adminEmail: 'diretoria@infocare.com.br', 
        createdAt: '2023-01-15',
        storageUsed: 450 * 1024 * 1024, // 450MB usados
        maxStorage: 1024 * 1024 * 1024 // 1GB
    },
    { 
        id: 't-2', 
        nome: 'Vet Popular Zona Sul', 
        cnpj: '99.888.777/0001-22', 
        plano: PlanoType.CLOUD,
        plan: PlanoType.CLOUD, 
        matricula: 'CLI-5590', 
        status: TenantStatus.TRIAL,
        domain: 'zs.petinfocare.com',
        adminEmail: 'contato@vetzs.com',
        createdAt: '2023-10-01',
        storageUsed: 50 * 1024 * 1024, // 50MB
        maxStorage: 1024 * 1024 * 1024 // 1GB
    }
  ]);

  // Estado local para Unidades (Relacionamento N:1 com Tenant)
  const [units, setUnits] = useState<Unidade[]>([
    ...MOCK_UNIDADES,
    { id: 'u-3', tenantId: 't-2', nome: 'Matriz Zona Sul', endereco: 'Av. Santo Amaro, 1000' }
  ]);

  const [expandedTenantId, setExpandedTenantId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    plano: PlanoType.CLOUD,
    adminEmail: '',
    domain: ''
  });

  const toggleExpand = (id: string) => {
    setExpandedTenantId(expandedTenantId === id ? null : id);
  };

  const handleCreateTenant = () => {
    const newMatricula = `CLI-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Determina storage baseado no plano
    let storageLimit = 1024 * 1024 * 1024; // 1GB Default
    if (formData.plano === PlanoType.CLOUD) storageLimit = 5 * 1024 * 1024 * 1024; // 5GB
    if (formData.plano === PlanoType.ENTERPRISE) storageLimit = 20 * 1024 * 1024 * 1024; // 20GB

    const newTenant: Tenant = {
      id: `t-${Date.now()}`,
      nome: formData.nome,
      cnpj: formData.cnpj,
      plano: formData.plano,
      plan: formData.plano,
      matricula: newMatricula,
      status: TenantStatus.ACTIVE,
      domain: formData.domain ? `${formData.domain}.petinfocare.com` : undefined,
      adminEmail: formData.adminEmail,
      createdAt: new Date().toISOString().split('T')[0],
      storageUsed: 0,
      maxStorage: storageLimit
    };

    setTenants([...tenants, newTenant]);
    
    // Cria unidade padrão automaticamente
    setUnits([...units, {
        id: `u-${Date.now()}`,
        tenantId: newTenant.id,
        nome: 'Unidade Matriz',
        endereco: 'Endereço não informado'
    }]);

    setShowModal(false);
    setFormData({ nome: '', cnpj: '', plano: PlanoType.CLOUD, adminEmail: '', domain: '' });
  };

  const handleAddUnit = (tenantId: string) => {
      const nome = prompt("Nome da Nova Unidade:");
      if (!nome) return;
      const endereco = prompt("Endereço da Unidade:");
      
      const newUnit: Unidade = {
          id: `u-${Date.now()}`,
          tenantId,
          nome,
          endereco: endereco || 'Endereço Pendente'
      };
      setUnits([...units, newUnit]);
  };

  const getStatusBadge = (status: TenantStatus) => {
    switch(status) {
      case TenantStatus.ACTIVE: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case TenantStatus.SUSPENDED: return 'bg-rose-100 text-rose-700 border-rose-200';
      case TenantStatus.TRIAL: return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  // Helper para formatar bytes
  const formatBytes = (bytes: number) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500 min-h-screen bg-slate-50">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Server className="w-8 h-8 text-indigo-600" />
            Gestão de Plataforma
          </h2>
          <p className="text-slate-500 font-medium">Administração de Tenants (Raiz) e Unidades</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-300 hover:bg-black transition-all flex items-center"
        >
           <Plus className="w-4 h-4 mr-2" /> Novo Tenant
        </button>
      </header>

      {/* Lista de Tenants */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
           <thead>
             <tr className="bg-slate-50/50 border-b border-slate-100">
               <th className="w-10 px-4 py-5"></th>
               <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tenant (Cliente)</th>
               <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plano / CNPJ</th>
               <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Armazenamento</th>
               <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
             {tenants.map(tenant => {
               const usagePercent = (tenant.storageUsed / tenant.maxStorage) * 100;
               const isExpanded = expandedTenantId === tenant.id;
               const tenantUnits = units.filter(u => u.tenantId === tenant.id);

               return (
               <React.Fragment key={tenant.id}>
                 <tr 
                    onClick={() => toggleExpand(tenant.id)}
                    className={`group transition-colors cursor-pointer ${isExpanded ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}`}
                 >
                   <td className="px-4 py-6 text-center">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-indigo-500" /> : <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />}
                   </td>
                   <td className="px-4 py-6">
                      <div className="flex items-center space-x-4">
                         <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-100">
                            {tenant.nome[0]}
                         </div>
                         <div>
                            <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                {tenant.nome}
                                <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">ID: {tenant.matricula}</span>
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider mt-0.5 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> {tenant.adminEmail}
                            </p>
                         </div>
                      </div>
                   </td>
                   <td className="px-4 py-6">
                      <p className="text-xs font-black uppercase text-indigo-600 mb-1">{tenant.plano}</p>
                      <p className="text-xs font-mono text-slate-500">{tenant.cnpj}</p>
                   </td>
                   <td className="px-4 py-6 w-1/4">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                          <span className="flex items-center gap-1"><Database className="w-3 h-3" /> {formatBytes(tenant.storageUsed)}</span>
                          <span>{formatBytes(tenant.maxStorage)}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div 
                              className={`h-full rounded-full ${usagePercent > 90 ? 'bg-rose-500' : 'bg-blue-500'}`} 
                              style={{ width: `${usagePercent}%` }}
                          ></div>
                      </div>
                   </td>
                   <td className="px-4 py-6">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border ${getStatusBadge(tenant.status)}`}>
                         {tenant.status}
                      </span>
                   </td>
                 </tr>
                 
                 {/* Nested Units View */}
                 {isExpanded && (
                    <tr className="bg-indigo-50/10">
                        <td colSpan={5} className="p-0">
                            <div className="px-16 py-6 border-b border-indigo-100 border-l-4 border-l-indigo-500 ml-4 mb-4 rounded-r-xl shadow-inner bg-slate-50/50">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Building className="w-4 h-4" /> Unidades Vinculadas ({tenantUnits.length})
                                    </h4>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleAddUnit(tenant.id); }}
                                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 shadow-sm hover:shadow-md transition-all"
                                    >
                                        <Plus className="w-3 h-3" /> Adicionar Unidade
                                    </button>
                                </div>
                                
                                {tenantUnits.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {tenantUnits.map(unit => (
                                            <div key={unit.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3 hover:border-indigo-200 transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                                                    <Building className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 truncate">{unit.nome}</p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1 truncate mt-1">
                                                        <MapPin className="w-3 h-3" /> {unit.endereco}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 rounded">ID: {unit.id}</span>
                                                        <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1"><Activity className="w-3 h-3" /> Ativa</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-slate-400 text-sm italic border-2 border-dashed border-slate-200 rounded-xl">
                                        Nenhuma unidade cadastrada para este tenant.
                                    </div>
                                )}
                            </div>
                        </td>
                    </tr>
                 )}
               </React.Fragment>
             )})}
           </tbody>
        </table>
      </div>

      {/* Modal Cadastro SaaS */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Provisionar Nova Clínica</h3>
                    <p className="text-sm font-bold text-slate-400">O armazenamento será alocado automaticamente.</p>
                 </div>
                 <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all">
                    <i className="fas fa-times text-slate-400"></i>
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                 <div className="col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nome da Clínica (Razão Social)</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.nome}
                      onChange={e => setFormData({...formData, nome: e.target.value})}
                    />
                 </div>
                 
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Plano (Define Storage)</label>
                    <select 
                      className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.plano}
                      onChange={e => setFormData({...formData, plano: e.target.value as PlanoType})}
                    >
                       <option value={PlanoType.COMMUNITY}>Start (1GB)</option>
                       <option value={PlanoType.CLOUD}>Pro (5GB)</option>
                       <option value={PlanoType.ENTERPRISE}>Hospital (20GB)</option>
                    </select>
                 </div>

                 <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Email Admin</label>
                     <input 
                      type="email" 
                      className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.adminEmail}
                      onChange={e => setFormData({...formData, adminEmail: e.target.value})}
                    />
                 </div>
              </div>

              <div className="flex justify-end space-x-4">
                 <button onClick={() => setShowModal(false)} className="px-8 py-4 text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Cancelar</button>
                 <button onClick={handleCreateTenant} className="px-10 py-4 bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-600 shadow-xl shadow-emerald-200 transition-all">
                    Criar & Provisionar
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminTenants;