import AdminUsuarios from './pages/AdminUsuarios';
import Agendamentos from './pages/Agendamentos';
import Animais from './pages/Animais';
import Clientes from './pages/Clientes';
import Dashboard from './pages/Dashboard';
import Escala from './pages/Escala';
import Financeiro from './pages/Financeiro';
import Home from './pages/Home';
import Marketing from './pages/Marketing';
import Produtos from './pages/Produtos';
import Veterinario from './pages/Veterinario';
import __Layout from './Layout.jsx';

export const PAGES = {
    "AdminUsuarios": AdminUsuarios,
    "Agendamentos": Agendamentos,
    "Animais": Animais,
    "Clientes": Clientes,
    "Dashboard": Dashboard,
    "Escala": Escala,
    "Financeiro": Financeiro,
    "Home": Home,
    "Marketing": Marketing,
    "Produtos": Produtos,
    "Veterinario": Veterinario,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};