import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import { format, startOfYear, endOfYear, eachMonthOfInterval, getMonth, isSameYear, subYears } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function RevenueComparisonChart({ agendamentos, vendas }) {
  const chartData = useMemo(() => {
    const today = new Date();
    const currentYearStart = startOfYear(today);
    const lastYearStart = startOfYear(subYears(today, 1));
    
    const months = eachMonthOfInterval({ start: currentYearStart, end: endOfYear(today) });

    return months.map(month => {
      const monthIdx = getMonth(month);
      
      const calculateRevenue = (yearStart) => {
        const agendamentosRevenue = agendamentos
          .filter(a => {
            const d = new Date(a.data);
            return isSameYear(d, yearStart) && getMonth(d) === monthIdx && a.status === 'Concluído';
          })
          .reduce((sum, a) => sum + (a.valor_total || 0), 0);

        const vendasRevenue = vendas
          .filter(v => {
            const d = new Date(v.data_venda);
            return isSameYear(d, yearStart) && getMonth(d) === monthIdx;
          })
          .reduce((sum, v) => sum + (v.valor_total || 0), 0);
          
        return agendamentosRevenue + vendasRevenue;
      };

      return {
        name: format(month, 'MMM', { locale: ptBR }),
        AnoAtual: calculateRevenue(currentYearStart),
        AnoAnterior: calculateRevenue(lastYearStart)
      };
    });
  }, [agendamentos, vendas]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" /> Comparativo Anual de Receita
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="AnoAtual" name="Ano Atual" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="AnoAnterior" name="Ano Anterior" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}