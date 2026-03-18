import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Scissors } from "lucide-react";

export default function ServiceProfitability({ agendamentos }) {
  const data = useMemo(() => {
    const stats = {};
    agendamentos.forEach(a => {
      if (a.status !== 'Concluído') return;
      a.servicos?.forEach(servico => {
        if (!stats[servico]) stats[servico] = 0;
        // Estimate service value portion (simplified: total / num_services)
        const val = (a.valor_total || 0) / (a.servicos.length || 1);
        stats[servico] += val;
      });
    });

    return Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8
  }, [agendamentos]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-pink-50 to-rose-50">
        <CardTitle className="flex items-center gap-2">
          <Scissors className="w-5 h-5 text-rose-600" />
          Top Serviços por Faturamento
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#f43f5e', '#ec4899', '#d946ef', '#a855f7'][index % 4]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}