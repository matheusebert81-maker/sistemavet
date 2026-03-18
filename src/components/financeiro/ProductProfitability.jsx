import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingUp } from "lucide-react";

export default function ProductProfitability({ vendas, produtos }) {
  const productStats = useMemo(() => {
    const stats = {};
    
    // Process Sales
    vendas.forEach(venda => {
      venda.itens?.forEach(item => {
        if (!stats[item.produto_id]) {
          const produto = produtos.find(p => p.id === item.produto_id);
          stats[item.produto_id] = {
            id: item.produto_id,
            nome: produto?.nome || item.nome_produto || 'Desconhecido',
            qtd: 0,
            receita: 0,
            custoUnitario: produto?.custo || 0,
            categoria: produto?.categoria || 'Geral'
          };
        }
        stats[item.produto_id].qtd += item.quantidade || 1;
        stats[item.produto_id].receita += (item.preco_unitario || 0) * (item.quantidade || 1);
      });
    });

    return Object.values(stats).map(item => {
      const custoTotal = item.custoUnitario * item.qtd;
      const lucro = item.receita - custoTotal;
      const margem = item.receita > 0 ? (lucro / item.receita) * 100 : 0;
      return { ...item, custoTotal, lucro, margem };
    }).sort((a, b) => b.lucro - a.lucro);
  }, [vendas, produtos]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-600" />
          Lucratividade por Produto
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-4 font-semibold text-slate-700">Produto</th>
                <th className="text-center p-4 font-semibold text-slate-700">Qtd</th>
                <th className="text-right p-4 font-semibold text-slate-700">Receita</th>
                <th className="text-right p-4 font-semibold text-slate-700">Custo Est.</th>
                <th className="text-right p-4 font-semibold text-slate-700">Lucro</th>
                <th className="text-center p-4 font-semibold text-slate-700">Margem</th>
              </tr>
            </thead>
            <tbody>
              {productStats.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{item.nome}</p>
                    <p className="text-xs text-slate-500">{item.categoria}</p>
                  </td>
                  <td className="p-4 text-center text-slate-600">{item.qtd}</td>
                  <td className="p-4 text-right text-slate-700">R$ {item.receita.toFixed(2)}</td>
                  <td className="p-4 text-right text-slate-500">R$ {item.custoTotal.toFixed(2)}</td>
                  <td className="p-4 text-right font-bold text-green-600">R$ {item.lucro.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <Badge variant={item.margem > 50 ? "success" : item.margem > 20 ? "secondary" : "destructive"}>
                      {item.margem.toFixed(1)}%
                    </Badge>
                  </td>
                </tr>
              ))}
              {productStats.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">Nenhum dado de venda disponível.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}