import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Megaphone, Ticket, Trash2, Edit, Send, Loader2, Users } from 'lucide-react';
import { format } from 'date-fns';

// Placeholders
const CampanhaForm = ({ onCancel }) => <div className="p-4 border rounded">Formulário Campanha <Button onClick={onCancel}>Cancelar</Button></div>;
const PromocaoForm = ({ onCancel }) => <div className="p-4 border rounded">Formulário Promoção <Button onClick={onCancel}>Cancelar</Button></div>;

export default function Marketing() {
  const [view, setView] = useState('list'); 
  const [editingCampanha, setEditingCampanha] = useState(null);
  const [editingPromocao, setEditingPromocao] = useState(null);
  const [showConfirmSend, setShowConfirmSend] = useState(null);
  const queryClient = useQueryClient();

  const { data: campanhas = [] } = useQuery({ queryKey: ['campanhas'], queryFn: () => base44.entities.Campanha.list('-created_date') });
  const { data: promocoes = [] } = useQuery({ queryKey: ['promocoes'], queryFn: () => base44.entities.Promocao.list('-created_date') });
  const { data: clientes = [] } = useQuery({ queryKey: ['clientes'], queryFn: () => base44.entities.Cliente.list() });
  const { data: animais = [] } = useQuery({ queryKey: ['animais'], queryFn: () => base44.entities.Animal.list() });

  const deleteCampanhaMutation = useMutation({
    mutationFn: (id) => base44.entities.Campanha.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campanhas'] })
  });

  const deletePromocaoMutation = useMutation({
    mutationFn: (id) => base44.entities.Promocao.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promocoes'] })
  });

  const handleSendCampaign = async (campanha) => {
    // Logic simulated
    alert("Enviando campanha: " + campanha.nome);
    setShowConfirmSend(null);
  };

  if (view === 'form') {
    if (editingCampanha !== null) return <CampanhaForm campanha={editingCampanha} onCancel={() => { setView('list'); setEditingCampanha(null); }} />
    if (editingPromocao !== null) return <PromocaoForm promocao={editingPromocao} onCancel={() => { setView('list'); setEditingPromocao(null); }} />
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Marketing</h1>
        </div>

        <Tabs defaultValue="campanhas">
            <TabsList className="grid w-full grid-cols-2 md:w-96 bg-white shadow-sm p-1 rounded-xl mb-6">
                <TabsTrigger value="campanhas"><Megaphone className="w-4 h-4 mr-2"/> Campanhas</TabsTrigger>
                <TabsTrigger value="promocoes"><Ticket className="w-4 h-4 mr-2"/> Promoções</TabsTrigger>
            </TabsList>

            <TabsContent value="campanhas">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Campanhas de Email</CardTitle>
                            <Button onClick={() => { setEditingCampanha({}); setView('form'); }}>
                                <Plus className="w-4 h-4 mr-2"/> Nova Campanha
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Segmento</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Enviada em</TableHead>
                                    <TableHead className="text-center">Análise</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {campanhas.map(c => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.nome}</TableCell>
                                        <TableCell>{c.segmento_clientes}</TableCell>
                                        <TableCell><Badge variant={c.status === 'Enviada' ? 'default' : 'secondary'}>{c.status}</Badge></TableCell>
                                        <TableCell>{c.data_envio ? format(new Date(c.data_envio), 'dd/MM/yyyy') : '-'}</TableCell>
                                        <TableCell className="text-center">
                                            {c.status === 'Enviada' ? (
                                                <div className="flex items-center justify-center gap-2 font-bold text-sm text-slate-600">
                                                    <Users className="w-4 h-4" /> {c.total_enviado}
                                                </div>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {c.status === 'Rascunho' && <Button variant="ghost" size="sm" onClick={() => setShowConfirmSend(c)}><Send className="w-4 h-4"/></Button>}
                                            <Button variant="ghost" size="sm" onClick={() => { setEditingCampanha(c); setView('form'); }}><Edit className="w-4 h-4"/></Button>
                                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteCampanhaMutation.mutate(c.id)}><Trash2 className="w-4 h-4"/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="promocoes">
                 <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                           <CardTitle>Promoções e Cupons</CardTitle>
                            <Button onClick={() => { setEditingPromocao({}); setView('form'); }}>
                                <Plus className="w-4 h-4 mr-2"/> Nova Promoção
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Desconto</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-center">Usos</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {promocoes.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.nome}</TableCell>
                                        <TableCell><Badge variant="outline">{p.codigo}</Badge></TableCell>
                                        <TableCell>{p.tipo_desconto === 'percentual' ? `${p.valor_desconto}%` : `R$ ${p.valor_desconto.toFixed(2)}`}</TableCell>
                                        <TableCell><Badge variant={p.ativo ? 'default' : 'secondary'}>{p.ativo ? 'Ativa' : 'Inativa'}</Badge></TableCell>
                                        <TableCell className="text-center font-bold text-slate-600">{p.num_usos || 0}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => { setEditingPromocao(p); setView('form'); }}><Edit className="w-4 h-4"/></Button>
                                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deletePromocaoMutation.mutate(p.id)}><Trash2 className="w-4 h-4"/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
        
        {showConfirmSend && (
            <Dialog open={!!showConfirmSend} onOpenChange={() => setShowConfirmSend(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Envio de Campanha</DialogTitle>
                    </DialogHeader>
                    <p>Você está prestes a enviar a campanha "<strong>{showConfirmSend.nome}</strong>".</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmSend(null)}>Cancelar</Button>
                        <Button onClick={() => handleSendCampaign(showConfirmSend)} className="bg-blue-600 text-white">
                            <Send className="w-4 h-4 mr-2"/> Sim, enviar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
    </div>
  );
}