import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  ArrowLeft, Edit, Phone, Mail, MapPin, FileText, PawPrint, User, 
  Calendar, ShoppingBag, Receipt, Filter, Search, Clock, Plus, Save, Trash2
} from "lucide-react";

// --- COMPONENTS ---

const AgendamentoOnlineMock = ({ onSuccess, onCancel }) => (
  <div className="p-6 text-center">
    <h3 className="text-lg font-bold mb-4">Agendamento Rápido</h3>
    <p className="text-slate-500 mb-6">Funcionalidade de agendamento simplificado.</p>
    <div className="flex justify-center gap-4">
      <Button variant="outline" onClick={onCancel}>Cancelar</Button>
      <Button onClick={onSuccess}>Confirmar Agendamento</Button>
    </div>
  </div>
);

function ClienteForm({ cliente, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(cliente || {
    nome: "", cpf: "", rg: "", telefone: "", telefone_secundario: "", email: "",
    cep: "", endereco: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", observacoes: ""
  });

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={onCancel} className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{cliente ? 'Editar Cliente' : 'Novo Cliente'}</h1>
          <p className="text-slate-600 mt-1">Preencha os dados do tutor</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader className="border-b bg-slate-50"><CardTitle>Dados Pessoais</CardTitle></CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input id="nome" value={formData.nome} onChange={(e) => handleChange('nome', e.target.value)} required className="mt-2" />
              </div>
              <div><Label>CPF</Label><Input value={formData.cpf} onChange={(e) => handleChange('cpf', e.target.value)} className="mt-2" /></div>
              <div><Label>RG</Label><Input value={formData.rg} onChange={(e) => handleChange('rg', e.target.value)} className="mt-2" /></div>
              <div><Label>Telefone *</Label><Input value={formData.telefone} onChange={(e) => handleChange('telefone', e.target.value)} required className="mt-2" /></div>
              <div><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className="mt-2" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg mb-6">
          <CardHeader className="border-b bg-slate-50"><CardTitle>Endereço</CardTitle></CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><Label>CEP</Label><Input value={formData.cep} onChange={(e) => handleChange('cep', e.target.value)} className="mt-2" /></div>
              <div className="md:col-span-2"><Label>Endereço</Label><Input value={formData.endereco} onChange={(e) => handleChange('endereco', e.target.value)} className="mt-2" /></div>
              <div><Label>Bairro</Label><Input value={formData.bairro} onChange={(e) => handleChange('bairro', e.target.value)} className="mt-2" /></div>
              <div><Label>Cidade/UF</Label><Input value={formData.cidade} onChange={(e) => handleChange('cidade', e.target.value)} className="mt-2" /></div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancelar</Button>
          <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white"><Save className="w-4 h-4 mr-2" /> {isLoading ? 'Salvando...' : 'Salvar'}</Button>
        </div>
      </form>
    </div>
  );
}

function ClienteDetalhes({ cliente, animais, onClose, onEdit }) {
  const [showAgendamento, setShowAgendamento] = useState(false);
  
  // Mock Queries for details
  const { data: agendamentos = [] } = useQuery({ queryKey: ['agendamentos', cliente.id], queryFn: () => base44.entities.Agendamento.filter({ cliente_id: cliente.id }) });
  
  return (
    <div className="animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onClose} className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{cliente.nome}</h1>
            <p className="text-slate-600 mt-1">Detalhes e histórico</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAgendamento(true)} className="bg-green-600 hover:bg-green-700 text-white"><Plus className="w-4 h-4 mr-2" /> Agendar</Button>
          <Button onClick={() => onEdit(cliente)} className="bg-blue-600 hover:bg-blue-700 text-white"><Edit className="w-4 h-4 mr-2" /> Editar</Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm border">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="pets">Pets ({animais.length})</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-blue-50/50"><CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-blue-600"/> Dados Pessoais</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4">
              <div><p className="text-sm text-slate-500">CPF</p><p className="font-semibold">{cliente.cpf || '-'}</p></div>
              <div><p className="text-sm text-slate-500">Email</p><div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400"/><p className="font-semibold">{cliente.email || '-'}</p></div></div>
              <div><p className="text-sm text-slate-500">Telefone</p><div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400"/><p className="font-semibold">{cliente.telefone}</p></div></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-blue-50/50"><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600"/> Endereço</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-2">
              <p className="font-medium text-slate-800">{cliente.endereco || 'Sem endereço cadastrado'}</p>
              <p className="text-slate-600">{cliente.bairro} {cliente.cidade && `- ${cliente.cidade}`}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {animais.map(animal => (
              <Card key={animal.id} className="hover:shadow-md transition-all">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center"><PawPrint className="w-8 h-8 text-slate-300"/></div>
                  <div>
                    <h4 className="font-bold text-lg">{animal.nome}</h4>
                    <p className="text-sm text-slate-500">{animal.especie} • {animal.raca}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {animais.length === 0 && <p className="col-span-full text-center text-slate-500 py-8">Nenhum pet cadastrado.</p>}
          </div>
        </TabsContent>

        <TabsContent value="historico">
          <Card>
            <CardHeader><CardTitle>Últimos Agendamentos</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agendamentos.map(ag => (
                  <div key={ag.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                      <Calendar className="w-5 h-5 text-blue-500"/>
                      <div>
                        <p className="font-bold">{format(new Date(ag.data), 'dd/MM/yyyy')} - {ag.horario}</p>
                        <p className="text-sm text-slate-500">{ag.servicos?.join(', ')}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{ag.status}</Badge>
                  </div>
                ))}
                {agendamentos.length === 0 && <p className="text-center text-slate-500 py-4">Sem histórico recente.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAgendamento} onOpenChange={setShowAgendamento}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Agendamento</DialogTitle></DialogHeader>
          <AgendamentoOnlineMock onSuccess={() => { alert('Agendado!'); setShowAgendamento(false); }} onCancel={() => setShowAgendamento(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- MAIN PAGE ---

export default function Clientes() {
  const [viewMode, setViewMode] = useState('list'); // list, form, details
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: clientes = [] } = useQuery({ queryKey: ['clientes'], queryFn: () => base44.entities.Cliente.list() });
  const { data: animais = [] } = useQuery({ queryKey: ['animais'], queryFn: () => base44.entities.Animal.list() });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Cliente.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['clientes']); setViewMode('list'); }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Cliente.update(data.id, data),
    onSuccess: () => { queryClient.invalidateQueries(['clientes']); setViewMode('list'); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Cliente.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['clientes'])
  });

  const filteredClientes = clientes.filter(c => 
    c.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.cpf?.includes(searchTerm) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (data) => {
    if (data.id) updateMutation.mutate(data);
    else createMutation.mutate(data);
  };

  if (viewMode === 'form') {
    return <ClienteForm cliente={selectedCliente} onSubmit={handleSave} onCancel={() => setViewMode('list')} isLoading={createMutation.isPending || updateMutation.isPending} />;
  }

  if (viewMode === 'details' && selectedCliente) {
    const clienteAnimais = animais.filter(a => a.cliente_id === selectedCliente.id);
    return <ClienteDetalhes cliente={selectedCliente} animais={clienteAnimais} onClose={() => setViewMode('list')} onEdit={(c) => { setSelectedCliente(c); setViewMode('form'); }} />;
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
            <p className="text-slate-600">Gestão de tutores</p>
          </div>
          <Button onClick={() => { setSelectedCliente(null); setViewMode('form'); }} className="bg-blue-600 text-white"><Plus className="w-4 h-4 mr-2"/> Novo Cliente</Button>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"/>
              <Input 
                placeholder="Buscar por nome, CPF ou email..." 
                className="pl-10" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClientes.map(cliente => (
            <Card key={cliente.id} className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-500" onClick={() => { setSelectedCliente(cliente); setViewMode('details'); }}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {cliente.nome.charAt(0)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={(e) => { e.stopPropagation(); setSelectedCliente(cliente); setViewMode('form'); }}><Edit className="w-4 h-4"/></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={(e) => { e.stopPropagation(); if(confirm('Excluir cliente?')) deleteMutation.mutate(cliente.id); }}><Trash2 className="w-4 h-4"/></Button>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{cliente.nome}</h3>
                <div className="space-y-1 text-sm text-slate-500">
                  <p className="flex items-center gap-2"><Phone className="w-3 h-3"/> {cliente.telefone}</p>
                  <p className="flex items-center gap-2 truncate"><Mail className="w-3 h-3"/> {cliente.email}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredClientes.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">
              <User className="w-12 h-12 mx-auto mb-3 opacity-20"/>
              <p>Nenhum cliente encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
