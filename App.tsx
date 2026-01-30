
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Prontuario from './views/Prontuario';
import Agenda from './views/Agenda';
import Vendas from './views/Vendas';
import Comandas from './views/Comandas';
import Financeiro from './views/Financeiro';
import Internacao from './views/Internacao';
import Cirurgico from './views/Cirurgico';
import Auditoria from './views/Auditoria';
import Estoque from './views/Estoque';
import Esteira from './views/Esteira';
import Vacinas from './views/Vacinas';
import Termos from './views/Termos';
import Login from './views/Login';
import RegisterVet from './views/RegisterVet';
import RegisterClinic from './views/RegisterClinic';
import LandingPage from './views/LandingPage';
import CadastroPacientes from './views/CadastroPacientes';
import CadastroItens from './views/CadastroItens';
import AdminTenants from './views/AdminTenants';

// Componente de Proteção de Rota
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    // Redireciona para login mantendo a origem para voltar depois
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isPublicPage = ['/', '/login', '/register-vet', '/register-clinic'].includes(location.pathname);

  if (isPublicPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register-vet" element={<RegisterVet />} />
      <Route path="/register-clinic" element={<RegisterClinic />} />
      
      {/* Rotas Protegidas */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/esteira" element={<ProtectedRoute><Esteira /></ProtectedRoute>} />
      <Route path="/agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />
      <Route path="/prontuario" element={<ProtectedRoute><Prontuario /></ProtectedRoute>} />
      <Route path="/comandas" element={<ProtectedRoute><Comandas /></ProtectedRoute>} />
      <Route path="/estoque" element={<ProtectedRoute><Estoque /></ProtectedRoute>} />
      <Route path="/financeiro" element={<ProtectedRoute><Financeiro /></ProtectedRoute>} />
      <Route path="/vendas" element={<ProtectedRoute><Vendas /></ProtectedRoute>} />
      <Route path="/vacinas" element={<ProtectedRoute><Vacinas /></ProtectedRoute>} />
      <Route path="/internacao" element={<ProtectedRoute><Internacao /></ProtectedRoute>} />
      <Route path="/cirurgico" element={<ProtectedRoute><Cirurgico /></ProtectedRoute>} />
      <Route path="/auditoria" element={<ProtectedRoute><Auditoria /></ProtectedRoute>} />
      <Route path="/termos" element={<ProtectedRoute><Termos /></ProtectedRoute>} />
      <Route path="/cadastro-pacientes" element={<ProtectedRoute><CadastroPacientes /></ProtectedRoute>} />
      <Route path="/cadastro-itens" element={<ProtectedRoute><CadastroItens /></ProtectedRoute>} />
      <Route path="/admin/tenants" element={<ProtectedRoute><AdminTenants /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </Router>
    </AppProvider>
  );
};

export default App;
