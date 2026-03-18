import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
} from "lucide-react";
import { startOfMonth, endOfMonth, subMonths, startOfYear, format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Import Components
import AccountsPayableReceivable from "@/components/financeiro/AccountsPayableReceivable";
import CashFlowProjection from "@/components/financeiro/CashFlowProjection";
import ExpenseBreakdown from "@/components/financeiro/ExpenseBreakdown";
import FinancialPeriodAnalysis from "@/components/financeiro/FinancialPeriodAnalysis";
import ProductProfitability from "@/components/financeiro/ProductProfitability";
import ProfessionalCommissions from "@/components/financeiro/ProfessionalCommissions";
import RevenueComparisonChart from "@/components/financeiro/RevenueComparisonChart";
import ServiceProfitability from "@/components/financeiro/ServiceProfitability";

export default function Financeiro() {
  const { data: agendamentos = [] } = useQuery({
    queryKey: ['agendamentos'],
    queryFn: () => base44.entities.Agendamento.list(),
    initialData: [],
  });

  const { data: despesas = [] } = useQuery({
    queryKey: ['despesas'],
    queryFn: () => base44.entities.Despesa.list('-data'),
    initialData: [],
  });

  const { data: vendas = [] } = useQuery({
    queryKey: ['vendas'],
    queryFn: () => base44.entities.Venda.list('-data_venda'),
    initialData: [],
  });

  const { data: produtos = [] } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => base44.entities.Produto.list(),
    initialData: [],
  });

  const { data: profissionais = [] } = useQuery({
    queryKey: ['profissionais'],
    queryFn: () => base44.entities.Profissional.list(),
    initialData: [],
  });

  const hoje = new Date();
  const inicioMesAtual = startOfMonth(hoje);
  const fimMesAtual = endOfMonth(hoje);
  const inicioMesPassado = startOfMonth(subMonths(hoje, 1));
  const fimMesPassado = endOfMonth(subMonths(hoje, 1));
  const inicioMesAnoPassado = startOfMonth(subMonths(hoje, 12));
  const fimMesAnoPassado = endOfMonth(subMonths(hoje, 12));

  const calcularReceita = (inicio, fim) => {
    const agendamentosPeriodo = agendamentos.filter(a => {
      const data = new Date(a.data);
      return data >= inicio && data <= fim && a.status === 'Concluído';
    });
    
    const vendasPeriodo = vendas.filter(v => {
      const data = new Date(v.data_venda);
      return data >= inicio && data <= fim;
    });

    const receitaServicos = agendamentosPeriodo.reduce((sum, a) => sum + (a.valor_total || 0), 0);
    const receitaProdutos = vendasPeriodo.reduce((sum, v) => sum + (v.valor_total || 0), 0);

    return { receitaServicos, receitaProdutos, total: receitaServicos + receitaProdutos };
  };

  const calcularDespesas = (inicio, fim) => {
    return despesas
      .filter(d => {
        const data = new Date(d.data);
        return data >= inicio && data <= fim;
      })
      .reduce((sum, d) => sum + (d.valor || 0), 0);
  };

  const receitaMesAtual = calcularReceita(inicioMesAtual, fimMesAtual);
  const despesasMesAtual = calcularDespesas(inicioMesAtual, fimMesAtual);
  const lucroMesAtual = receitaMesAtual.total - despesasMesAtual;

  const MetricCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className={`text-3xl font-bold mt-2 ${color}`}>
              R$ {value.toFixed(2)}
            </p>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Financeiro</h1>
          <p className="text-slate-600 mt-2">
            Relatórios e análises financeiras • {format(hoje, "MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Receita Total"
            value={receitaMesAtual.total}
            subtitle={`Serviços: R$ ${receitaMesAtual.receitaServicos.toFixed(2)} | Produtos: R$ ${receitaMesAtual.receitaProdutos.toFixed(2)}`}
            icon={DollarSign}
            color="text-green-600"
          />
          <MetricCard
            title="Despesas Total"
            value={despesasMesAtual}
            icon={TrendingDown}
            color="text-red-600"
          />
          <MetricCard
            title="Lucro Líquido"
            value={lucroMesAtual}
            icon={TrendingUp}
            color={lucroMesAtual >= 0 ? "text-blue-600" : "text-red-600"}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-white shadow-md rounded-xl p-1 overflow-x-auto">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="accounts">Contas</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="expenses">Despesas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <FinancialPeriodAnalysis agendamentos={agendamentos} despesas={despesas} vendas={vendas} />
            <RevenueComparisonChart agendamentos={agendamentos} vendas={vendas} />
            <ProfessionalCommissions agendamentos={agendamentos} profissionais={profissionais} />
          </TabsContent>

          <TabsContent value="cashflow">
            <CashFlowProjection agendamentos={agendamentos} despesas={despesas} />
          </TabsContent>
          
          <TabsContent value="accounts">
            <AccountsPayableReceivable agendamentos={agendamentos} despesas={despesas} />
          </TabsContent>
          
          <TabsContent value="services">
            <ServiceProfitability agendamentos={agendamentos} />
          </TabsContent>
          
          <TabsContent value="products">
            <ProductProfitability vendas={vendas} produtos={produtos} />
          </TabsContent>
          
          <TabsContent value="expenses">
            <ExpenseBreakdown despesas={despesas} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}