import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function ExpenseBreakdown({ despesas }) {
  const despesasPorCategoria = despesas.reduce((acc, despesa) => {
    if (!acc[despesa.categoria]) {
      acc[despesa.categoria] = { categoria: despesa.categoria, total: 0, quantidade: 0 };
    }
    acc[despesa.categoria].total += despesa.valor;
    acc[despesa.categoria].quantidade += 1;
    return acc;
  }, {});

  const categorias = Object.values(despesasPorCategoria).sort((a, b) => b.total - a.total);
  const chartData = categorias.map(item => ({ name: item.categoria, value: item.total }));
  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#3b82f6', '#6366f1'];
  const totalDespesas = categorias.reduce((sum, cat) => sum + cat.total, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-red-50 to-orange-50">
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-600" /> Distribuição de Despesas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="text-center py-10 text-slate-400">Sem dados de despesas</div>}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-red-50 to-orange-50">
          <CardTitle>Detalhamento</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left p-2">Categoria</th>
                  <th className="text-right p-2">Total</th>
                  <th className="text-right p-2">%</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((item, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-2 font-medium">{item.categoria}</td>
                    <td className="p-2 text-right text-red-600 font-bold">R$ {item.total.toFixed(2)}</td>
                    <td className="p-2 text-right text-slate-500">{((item.total / totalDespesas) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}