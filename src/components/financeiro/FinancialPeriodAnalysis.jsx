import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { BarChart3 } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, startOfYear, endOfYear, startOfQuarter, endOfQuarter, eachQuarterOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function FinancialPeriodAnalysis({ agendamentos, despesas, vendas }) {
  const [periodType, setPeriodType] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const chartData = useMemo(() => {
    const selectedYear = parseInt(year);
    const startDate = startOfYear(new Date(selectedYear, 0, 1));
    const endDate = endOfYear(new Date(selectedYear, 0, 1));
    let intervals = periodType === "monthly" ? eachMonthOfInterval({ start: startDate, end: endDate }) : eachQuarterOfInterval({ start: startDate, end: endDate });
    let dateFormat = periodType === "monthly" ? "MMM" : "'Q'Q";

    return intervals.map(date => {
      let intervalStart = periodType === "monthly" ? startOfMonth(date) : startOfQuarter(date);
      let intervalEnd = periodType === "monthly" ? endOfMonth(date) : endOfQuarter(date);

      const receitasServicos = agendamentos.filter(a => { const d = new Date(a.data); return d >= intervalStart && d <= intervalEnd && a.status === 'Concluído'; }).reduce((sum, a) => sum + (a.valor_total || 0), 0);
      const receitasVendas = vendas.filter(v => { const d = new Date(v.data_venda); return d >= intervalStart && d <= intervalEnd; }).reduce((sum, v) => sum + (v.valor_total || 0), 0);
      const totalDespesas = despesas.filter(d => { const dd = new Date(d.data); return dd >= intervalStart && dd <= intervalEnd; }).reduce((sum, d) => sum + (d.valor || 0), 0);

      return {
        name: format(date, dateFormat, { locale: ptBR }).toUpperCase(),
        Receitas: receitasServicos + receitasVendas,
        Despesas: totalDespesas,
        Lucro: (receitasServicos + receitasVendas) - totalDespesas
      };
    });
  }, [periodType, year, agendamentos, despesas, vendas]);

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-blue-50 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg"><BarChart3 className="w-5 h-5 text-indigo-600" /> Análise de Receita x Despesa</CardTitle>
        <div className="flex gap-2">
          <Select value={periodType} onValueChange={setPeriodType}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="monthly">Mensal</SelectItem><SelectItem value="quarterly">Trimestral</SelectItem></SelectContent></Select>
          <Select value={year} onValueChange={setYear}><SelectTrigger className="w-24"><SelectValue /></SelectTrigger><SelectContent>{years.map(y => (<SelectItem key={y} value={y}>{y}</SelectItem>))}</SelectContent></Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Lucro" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}