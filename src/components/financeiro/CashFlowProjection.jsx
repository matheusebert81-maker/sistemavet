import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from "recharts";
import { CalendarClock } from "lucide-react";
import { addDays, format, isAfter, isBefore, startOfDay } from "date-fns";

export default function CashFlowProjection({ agendamentos, despesas }) {
  const projectionData = useMemo(() => {
    const today = startOfDay(new Date());
    const endDate = addDays(today, 30);
    const days = [];
    
    let acumulado = 0;

    for (let d = 0; d <= 30; d++) {
      const date = addDays(today, d);
      const dateStr = format(date, 'yyyy-MM-dd');
      days.push({
        date: date,
        dateStr: dateStr,
        displayDate: format(date, 'dd/MM'),
        receitas: 0,
        despesas: 0,
        saldo: 0,
        acumulado: 0
      });
    }

    agendamentos.forEach(a => {
      if (a.status === 'Cancelado') return;
      const date = new Date(a.data);
      if (isAfter(date, today) && isBefore(date, endDate)) {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayStats = days.find(d => d.dateStr === dateStr);
        if (dayStats) {
          dayStats.receitas += (a.valor_total || 0);
        }
      }
    });

    despesas.forEach(d => {
      if (d.status === 'Paga') return;
      const date = new Date(d.data_vencimento || d.data);
      if (isAfter(date, today) && isBefore(date, endDate)) {
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayStats = days.find(d => d.dateStr === dateStr);
        if (dayStats) {
          dayStats.despesas += (d.valor || 0);
        }
      }
    });

    days.forEach(day => {
      day.saldo = day.receitas - day.despesas;
      acumulado += day.saldo;
      day.acumulado = acumulado;
    });

    return days;
  }, [agendamentos, despesas]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarClock className="w-5 h-5 text-green-600" />
          Projeção de Fluxo de Caixa (30 Dias)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="displayDate" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Area type="monotone" dataKey="receitas" name="Receitas Previstas" stroke="#10b981" fillOpacity={1} fill="url(#colorReceitas)" />
              <Area type="monotone" dataKey="despesas" name="Despesas Previstas" stroke="#ef4444" fillOpacity={1} fill="url(#colorDespesas)" />
              <Line type="monotone" dataKey="acumulado" name="Saldo Acumulado" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}