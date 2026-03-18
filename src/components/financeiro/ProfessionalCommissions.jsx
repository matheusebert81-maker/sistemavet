import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, DollarSign } from "lucide-react";

export default function ProfessionalCommissions({ agendamentos, profissionais }) {
  const [commissionRate, setCommissionRate] = useState("30");

  const stats = useMemo(() => {
    const data = {};
    
    agendamentos.forEach(a => {
      if (a.status !== 'Concluído') return;
      const profName = a.profissional || 'Não Atribuído';
      
      if (!data[profName]) {
        data[profName] = { nome: profName, servicos: 0, faturamento: 0 };
      }
      data[profName].servicos += 1;
      data[profName].faturamento += (a.valor_total || 0);
    });

    return Object.values(data).sort((a, b) => b.faturamento - a.faturamento);
  }, [agendamentos]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-row justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Comissões de Profissionais
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Taxa Base:</span>
          <Select value={commissionRate} onValueChange={setCommissionRate}>
            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10%</SelectItem>
              <SelectItem value="30">30%</SelectItem>
              <SelectItem value="40">40%</SelectItem>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="60">60%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4">
          {stats.map((prof, idx) => {
            const comissao = prof.faturamento * (parseInt(commissionRate) / 100);
            return (
              <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {prof.nome.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{prof.nome}</p>
                    <p className="text-sm text-slate-500">{prof.servicos} atendimentos realizados</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase font-bold">Faturamento</p>
                  <p className="text-slate-700 font-medium">R$ {prof.faturamento.toFixed(2)}</p>
                  <div className="mt-1 pt-1 border-t border-slate-100">
                    <p className="text-xs text-green-600 uppercase font-bold">Comissão ({commissionRate}%)</p>
                    <p className="text-lg font-bold text-green-700">R$ {comissao.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {stats.length === 0 && <div className="text-center py-8 text-slate-400">Nenhum atendimento concluído para cálculo.</div>}
        </div>
      </CardContent>
    </Card>
  );
}