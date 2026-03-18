import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users, 
  PawPrint,
  Syringe,
  Package,
  AlertCircle
} from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const { data: agendamentos = [] } = useQuery({
    queryKey: ['agendamentos'],
    queryFn: () => base44.entities.Agendamento.list('-data'),
    initialData: [],
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => base44.entities.Cliente.list(),
    initialData: [],
  });

  const { data: animais = [] } = useQuery({
    queryKey: ['animais'],
    queryFn: () => base44.entities.Animal.list(),
    initialData: [],
  });

  const { data: vacinas = [] } = useQuery({
    queryKey: ['vacinas'],
    queryFn: () => base44.entities.VacinaHistorico.list(),
    initialData: [],
  });

  const { data: despesas = [] } = useQuery({
    queryKey: ['despesas'],
    queryFn: () => base44.entities.Despesa.list(),
    initialData: [],
  });

  const { data: produtos = [] } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => base44.entities.Produto.list(),
    initialData: [],
  });

  // Cálculos do mês atual
  const hoje = new Date();
  const inicioMes = startOfMonth(hoje);
  const fimMes = endOfMonth(hoje);
  const inicioMesPassado = startOfMonth(subMonths(hoje, 1));
  const fimMesPassado = endOfMonth(subMonths(hoje, 1));
  const inicioAno = startOfYear(hoje);

  const agendamentosMes = agendamentos.filter(a => {
    const data = new Date(a.data);
    return data >= inicioMes && data <= fimMes;
  });

  const agendamentosMesPassado = agendamentos.filter(a => {
    const data = new Date(a.data);
    return data >= inicioMesPassado && data <= fimMesPassado;
  });

  const faturamentoMes = agendamentosMes
    .filter(a => a.status === 'Concluído')
    .reduce((sum, a) => sum + (a.valor_total || 0), 0);

  const faturamentoMesPassado = agendamentosMesPassado
    .filter(a => a.status === 'Concluído')
    .reduce((sum, a) => sum + (a.valor_total || 0), 0);

  const despesasMes = despesas
    .filter(d => {
      const data = new Date(d.data);
      return data >= inicioMes && data <= fimMes;
    })
    .reduce((sum, d) => sum + (d.valor || 0), 0);

  const lucroMes = faturamentoMes - despesasMes;
  
  const crescimento = faturamentoMesPassado > 0 
    ? ((faturamentoMes - faturamentoMesPassado) / faturamentoMesPassado * 100).toFixed(1)
    : 0;

  // Agendamentos de hoje
  const agendamentosHoje = agendamentos.filter(a => {
    const dataAgendamento = new Date(a.data);
    return format(dataAgendamento, 'yyyy-MM-dd') === format(hoje, 'yyyy-MM-dd');
  });

  const StatsCard = ({ title, value, icon: Icon, bgColor, subtitle, trend }) => (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 ${bgColor} rounded-full opacity-10`} />
      <CardHeader className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <CardTitle className="text-3xl font-bold mt-2 text-slate-900">
              {value}
            </CardTitle>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${bgColor} bg-opacity-20`}>
            <Icon className={`w-6 h-6 ${bgColor.replace('bg-', 'text-')}`} />
          </div>
        </div>
        {trend && (
          <div className="flex items-center mt-3 text-sm">
            <TrendingUp className={`w-4 h-4 mr-1 ${parseFloat(trend) >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`font-medium ${parseFloat(trend) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-slate-500 ml-1">vs mês anterior</span>
          </div>
        )}
      </CardHeader>
    </Card>
  );

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Dashboard
          </h1>
          <p className="text-slate-600 mt-2">
            Visão geral do seu petshop • {format(hoje, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Faturamento Mês" 
            value={`R$ ${faturamentoMes.toFixed(2)}`}
            icon={DollarSign}
            bgColor="bg-green-500"
            subtitle={`${agendamentosMes.length} atendimentos`}
            trend={crescimento}
          />
          <StatsCard 
            title="Agendamentos Hoje" 
            value={agendamentosHoje.length}
            icon={Calendar}
            bgColor="bg-blue-600"
            subtitle={`${agendamentosMes.length} no mês`}
          />
          <StatsCard 
            title="Total de Clientes" 
            value={clientes.length}
            icon={Users}
            bgColor="bg-purple-500"
            subtitle={`${animais.length} animais cadastrados`}
          />
          <StatsCard 
            title="Lucro Mês" 
            value={`R$ ${lucroMes.toFixed(2)}`}
            icon={TrendingUp}
            bgColor={lucroMes >= 0 ? "bg-emerald-500" : "bg-red-500"}
            subtitle={`Despesas: R$ ${despesasMes.toFixed(2)}`}
          />
        </div>
      </div>
    </div>
  );
}