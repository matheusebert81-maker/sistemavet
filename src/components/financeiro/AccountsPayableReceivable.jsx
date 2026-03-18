import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownCircle, ArrowUpCircle, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { format, startOfDay } from "date-fns";

export default function AccountsPayableReceivable({ agendamentos, despesas }) {
  const today = startOfDay(new Date());

  const contasPagar = despesas
    .filter(d => d.status !== 'Paga')
    .map(d => {
      const vencimento = new Date(d.data_vencimento || d.data);
      const diasAtraso = Math.ceil((today - vencimento) / (1000 * 60 * 60 * 24));
      const status = diasAtraso > 0 ? 'Atrasada' : 'Pendente';
      return { ...d, vencimento, diasAtraso, statusReal: status };
    })
    .sort((a, b) => a.vencimento - b.vencimento);

  const contasReceber = agendamentos
    .filter(a => a.status === 'Concluído' && (!a.status_pagamento || a.status_pagamento === 'Pendente'))
    .map(a => {
      const dataServico = new Date(a.data);
      const diasAtraso = Math.ceil((today - dataServico) / (1000 * 60 * 60 * 24));
      return { ...a, vencimento: dataServico, diasAtraso, statusReal: 'Pendente' };
    })
    .sort((a, b) => a.vencimento - b.vencimento);

  const totalPagar = contasPagar.reduce((acc, curr) => acc + (curr.valor || 0), 0);
  const totalReceber = contasReceber.reduce((acc, curr) => acc + (curr.valor_total || 0), 0);
  const totalAtrasadoPagar = contasPagar.filter(c => c.statusReal === 'Atrasada').reduce((acc, curr) => acc + (curr.valor || 0), 0);

  const ListaContas = ({ items, tipo }) => (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-center text-slate-500 py-8">Nenhuma conta encontrada.</p>
      ) : (
        items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <div className={`mt-1 p-2 rounded-full ${tipo === 'pagar' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {tipo === 'pagar' ? <ArrowDownCircle className="w-4 h-4" /> : <ArrowUpCircle className="w-4 h-4" />}
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {tipo === 'pagar' ? item.descricao : (item.servicos?.[0] || 'Serviço')}
                </p>
                <p className="text-xs text-slate-500">
                  {tipo === 'pagar' ? item.categoria : (item.cliente_nome || 'Cliente')}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Vencimento: {format(item.vencimento, 'dd/MM/yyyy')}
                  </span>
                  {item.diasAtraso > 0 && (
                    <Badge variant="destructive" className="text-[10px] h-5">
                      {item.diasAtraso} dias atraso
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${tipo === 'pagar' ? 'text-red-600' : 'text-green-600'}`}>
                R$ {(tipo === 'pagar' ? item.valor : item.valor_total).toFixed(2)}
              </p>
              <Badge variant="outline" className="mt-1">
                {item.statusReal}
              </Badge>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <p className="text-red-600 text-sm font-medium flex items-center gap-2">
              <ArrowDownCircle className="w-4 h-4" /> Total a Pagar
            </p>
            <p className="text-3xl font-bold text-red-700 mt-2">R$ {totalPagar.toFixed(2)}</p>
            {totalAtrasadoPagar > 0 && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                R$ {totalAtrasadoPagar.toFixed(2)} em atraso
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <p className="text-green-600 text-sm font-medium flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4" /> Total a Receber
            </p>
            <p className="text-3xl font-bold text-green-700 mt-2">R$ {totalReceber.toFixed(2)}</p>
            <p className="text-xs text-green-600 mt-1">
              {contasReceber.length} lançamentos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <p className="text-blue-600 text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Saldo Previsto
            </p>
            <p className={`text-3xl font-bold mt-2 ${totalReceber - totalPagar >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              R$ {(totalReceber - totalPagar).toFixed(2)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              (Receber - Pagar)
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="lg:col-span-3 border-0 shadow-lg">
        <CardHeader className="border-b">
          <CardTitle>Detalhamento de Contas</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="pagar">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="pagar" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-700">
                Contas a Pagar ({contasPagar.length})
              </TabsTrigger>
              <TabsTrigger value="receber" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                Contas a Receber ({contasReceber.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pagar">
              <ListaContas items={contasPagar} tipo="pagar" />
            </TabsContent>
            
            <TabsContent value="receber">
              <ListaContas items={contasReceber} tipo="receber" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}