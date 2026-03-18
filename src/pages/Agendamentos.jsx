
import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, Clock, Search, Plus, Filter, Scissors, User, MoreVertical, Trash2, Edit, ArrowLeft, ChevronLeft, ChevronRight, Bell, GripVertical, Check, AlertCircle, X, MessageCircle, Mail, DollarSign, FileText, PawPrint, Weight, Stethoscope, History, Pill
} from "lucide-react";
import { format, parseISO, isToday, isTomorrow, addDays, subDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Main Component
export default function Agendamentos() {
  const [viewState, setViewState] = useState({ mode: 'list', data: null });
  const [agendaView, setAgendaView] = useState('dia');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOnlineBooking, setShowOnlineBooking] = useState(false);
  
  const queryClient = useQueryClient();

  // --- DATA FETCHING ---
  const { data: agendamentos = [], isLoading: isLoadingAgendamentos } = useQuery({ queryKey: ['agendamentos'], queryFn: () => base44.entities.Agendamento.list('-data') });
  const { data: clientes = [] } = useQuery({ queryKey: ['clientes'], queryFn: () => base44.entities.Cliente.list() });
  const { data: animais = [] } = useQuery({ queryKey: ['animais'], queryFn: () => base44.entities.Animal.list() });
  const { data: profissionais = [] } = useQuery({ queryKey: ['profissionais'], queryFn: () => base44.entities.Profissional.filter({ ativo: true }) });
  const { data: notificacoes = [] } = useQuery({ queryKey: ['notificacoes'], queryFn: () => base44.entities.Notificacao.list('-data_envio') });
  
  // --- MUTATIONS ---
  const saveMutation = useMutation({
    mutationFn: (data) => data.id ? base44.entities.Agendamento.update(data.id, data) : base44.entities.Agendamento.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      setViewState({ mode: 'list', data: null });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Agendamento.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      setViewState({ mode: 'list', data: null });
    }
  });

  const reagendarMutation = useMutation({
    mutationFn: ({ id, data, horario, profissional }) => base44.entities.Agendamento.update(id, { data, horario, profissional }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agendamentos'] })
  });

  // --- EVENT HANDLERS ---
  const handleReagendar = (id, novaData, novoHorario, novoProfissional = null) => {
    const agendamento = agendamentos.find(a => a.id === id);
    if (agendamento) {
      reagendarMutation.mutate({ 
        id, 
        data: novaData, 
        horario: novoHorario, 
        profissional: novoProfissional || agendamento.profissional 
      });
    }
  };

  const handleSelect = (agendamento) => setViewState({ mode: 'details', data: agendamento });
  const handleEdit = (agendamento) => setViewState({ mode: 'form', data: agendamento });
  const handleNew = () => setViewState({ mode: 'form', data: null });
  const handleClose = () => setViewState({ mode: 'list', data: null });
  const handleDelete = (id) => { if (confirm("Confirmar exclusão?")) deleteMutation.mutate(id); };

  // --- RENDER LOGIC ---
  if (viewState.mode === 'details') {
    return (
      <AgendamentoDetalhes
        agendamento={viewState.data}
        cliente={clientes.find(c => c.id === viewState.data.cliente_id)}
        animal={animais.find(a => a.id === viewState.data.animal_id)}
        onClose={handleClose}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  if (viewState.mode === 'form') {
    return (
      <AgendamentoForm
        agendamento={viewState.data}
        clientes={clientes}
        animais={animais}
        profissionais={profissionais}
        onSubmit={saveMutation.mutate}
        onCancel={handleClose}
        isLoading={saveMutation.isPending}
        selectedDate={selectedDate}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Agenda</h1>
          <p className="text-slate-500 mt-1">Visão geral de atendimentos e serviços.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="icon" className="relative" onClick={() => setShowNotifications(true)}>
             <Bell className="w-4 h-4" />
             {notificacoes.filter(n => n.status === 'Pendente').length > 0 && 
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] rounded-full flex items-center justify-center border-2 border-slate-50"/>
             }
           </Button>
           <Button variant="outline" onClick={() => setShowOnlineBooking(true)}>Agendamento Online</Button>
           <Button onClick={handleNew} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" /> Novo Agendamento
          </Button>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
         <div className="flex-1 flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
              <ChevronLeft className="w-5 h-5"/>
            </Button>
            <h2 className="text-lg font-bold text-slate-800 text-center w-64 capitalize">
              {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
              <ChevronRight className="w-5 h-5"/>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>Hoje</Button>
         </div>
         <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {['dia', 'semana', 'profissional'].map(view => (
              <Button 
                key={view}
                variant={agendaView === view ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setAgendaView(view)}
                className="capitalize"
              >
                {view}
              </Button>
            ))}
         </div>
      </div>
      
      {agendaView === 'dia' && <AgendaDia agendamentos={agendamentos} clientes={clientes} animais={animais} selectedDate={selectedDate} onSelect={handleSelect} onEdit={handleEdit} onDelete={handleDelete} />}
      {agendaView === 'semana' && <AgendaSemanal agendamentos={agendamentos} clientes={clientes} animais={animais} selectedDate={selectedDate} onSelectAgendamento={handleSelect} onReagendar={handleReagendar} isLoading={isLoadingAgendamentos} />}
      {agendaView === 'profissional' && <AgendaPorProfissional agendamentos={agendamentos} clientes={clientes} animais={animais} profissionais={profissionais} selectedDate={selectedDate} onSelectAgendamento={handleSelect} onReagendar={handleReagendar} isLoading={isLoadingAgendamentos} />}
    
      {showNotifications && <NotificacoesPanel notificacoes={notificacoes} agendamentos={agendamentos} clientes={clientes} animais={animais} onClose={() => setShowNotifications(false)} />}
      {showOnlineBooking && <AgendamentoOnline clienteId={clientes[0]?.id} onSuccess={() => { alert("Agendado!"); setShowOnlineBooking(false); }} onCancel={() => setShowOnlineBooking(false)} />}
    </div>
  );
}

// --- SUB-VIEWS AND COMPONENTS ---

// -- AGENDA DIA (LIST VIEW) --
function AgendaDia({ agendamentos, clientes, animais, selectedDate, onSelect, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmado': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Em andamento': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Concluído': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelado': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredAgendamentos = useMemo(() => {
    return agendamentos.filter(ag => {
      const agDate = parseISO(ag.data);
      if (!isToday(agDate) && format(agDate, 'yyyy-MM-dd') !== format(selectedDate, 'yyyy-MM-dd')) return false;
      
      const cliente = clientes.find(c => c.id === ag.cliente_id);
      const animal = animais.find(a => a.id === ag.animal_id);

      const matchesSearch = searchTerm === "" || 
        ag.profissional?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal?.nome.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "todos" || ag.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [agendamentos, searchTerm, statusFilter, selectedDate, clientes, animais]);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input placeholder="Buscar por cliente, animal ou profissional..." className="pl-9 bg-slate-50 border-slate-200" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]"><Filter className="w-4 h-4 mr-2 text-slate-500" /><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="Agendado">Agendado</SelectItem>
            <SelectItem value="Confirmado">Confirmado</SelectItem>
            <SelectItem value="Em andamento">Em andamento</SelectItem>
            <SelectItem value="Concluído">Concluído</SelectItem>
            <SelectItem value="Cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredAgendamentos.map((item) => {
          const cliente = clientes.find(c => c.id === item.cliente_id);
          const animal = animais.find(a => a.id === item.animal_id);
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow border-slate-200 cursor-pointer" onClick={() => onSelect(item)}>
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-slate-700 font-bold text-lg"><Clock className="w-4 h-4 mr-2 text-indigo-500" />{item.horario}</div>
                  <div className="border-l pl-4">
                    <h3 className="font-bold text-slate-900">{animal?.nome || 'N/A'} <Badge variant="outline" className="text-[10px] bg-slate-50">{cliente?.nome || 'N/A'}</Badge></h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mt-1"><Scissors className="w-3.5 h-3.5" /><span>{item.servicos?.join(', ') || 'N/A'}</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={`px-3 py-1 text-xs capitalize ${getStatusColor(item.status)}`}>{item.status}</Badge>
                  <div className="text-sm font-bold text-slate-700">R$ {item.valor_total?.toFixed(2) || '0.00'}</div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={(e) => { e.stopPropagation(); onEdit(item); }}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filteredAgendamentos.length === 0 && <div className="text-center py-20 text-slate-400 bg-white rounded-xl border-dashed"><CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" /><p>Nenhum agendamento para este dia.</p></div>}
      </div>
    </div>
  );
}

// -- FORMULÁRIO --
function AgendamentoForm({ agendamento, clientes, animais, profissionais, onSubmit, onCancel, isLoading, selectedDate }) {
  const [formData, setFormData] = useState(agendamento || {
    cliente_id: "", animal_id: "", data: selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"), horario: "09:00", servicos: [], desembolar: false, profissional: "", status: "Agendado", valor_total: 0, forma_pagamento: "Pendente", observacoes: ""
  });
  
  const [animaisFiltrados, setAnimaisFiltrados] = useState([]);
  
  useEffect(() => {
    if (formData.cliente_id) setAnimaisFiltrados(animais.filter(a => a.cliente_id === formData.cliente_id));
    else setAnimaisFiltrados([]);
  }, [formData.cliente_id, animais]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleServicoToggle = (servico) => setFormData(prev => ({ ...prev, servicos: prev.servicos.includes(servico) ? prev.servicos.filter(s => s !== servico) : [...prev.servicos, servico] }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
  
  const servicosDisponiveis = ["Banho", "Tosa", "Banho e Tosa", "Entrega"];

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={onCancel} className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{agendamento ? 'Editar Agendamento' : 'Novo Agendamento'}</h1>
            <p className="text-slate-600 mt-1">Preencha os dados do agendamento</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card className="border-0 shadow-lg"><CardHeader><CardTitle>Cliente e Animal</CardTitle></CardHeader><CardContent className="p-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><Label htmlFor="cliente_id">Cliente *</Label><Select value={formData.cliente_id} onValueChange={(v) => handleChange('cliente_id', v)} required><SelectTrigger className="mt-2"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{clientes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>))}</SelectContent></Select></div>
              <div><Label htmlFor="animal_id">Animal *</Label><Select value={formData.animal_id} onValueChange={(v) => handleChange('animal_id', v)} required disabled={!formData.cliente_id}><SelectTrigger className="mt-2"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{animaisFiltrados.map((a) => (<SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>))}</SelectContent></Select></div>
            </div></CardContent></Card>
            
            <Card className="border-0 shadow-lg"><CardHeader><CardTitle>Agendamento</CardTitle></CardHeader><CardContent className="p-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><Label>Data *</Label><Input type="date" value={formData.data} onChange={(e) => handleChange('data', e.target.value)} required className="mt-2" /></div>
              <div><Label>Horário *</Label><Input type="time" value={formData.horario} onChange={(e) => handleChange('horario', e.target.value)} required className="mt-2" /></div>
              <div><Label>Profissional</Label><Select value={formData.profissional} onValueChange={(v) => handleChange('profissional', v)}><SelectTrigger className="mt-2"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{profissionais.map((p) => (<SelectItem key={p.id} value={p.nome}>{p.nome}</SelectItem>))}</SelectContent></Select></div>
            </div></CardContent></Card>

            <Card className="border-0 shadow-lg"><CardHeader><CardTitle>Serviços e Financeiro</CardTitle></CardHeader><CardContent className="p-6"><div className="space-y-6">
              <div><Label>Serviços</Label><div className="flex flex-wrap gap-2 mt-2">{servicosDisponiveis.map(s => (<Button key={s} type="button" variant={formData.servicos.includes(s) ? 'default' : 'outline'} onClick={() => handleServicoToggle(s)}>{s}</Button>))}</div></div>
              <div className="flex items-center space-x-2"><input type="checkbox" id="desembolar" checked={formData.desembolar} onChange={e => handleChange('desembolar', e.target.checked)} /><Label htmlFor="desembolar">Necessita desembolar? (+R$15)</Label></div>
              <div className="grid grid-cols-2 gap-6">
                 <div><Label>Valor Total</Label><Input type="number" value={formData.valor_total} onChange={(e) => handleChange('valor_total', e.target.value)} className="mt-2"/></div>
                 <div><Label>Status</Label><Select value={formData.status} onValueChange={(v) => handleChange('status', v)}><SelectTrigger className="mt-2"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Agendado">Agendado</SelectItem><SelectItem value="Confirmado">Confirmado</SelectItem><SelectItem value="Em andamento">Em andamento</SelectItem><SelectItem value="Concluído">Concluído</SelectItem><SelectItem value="Cancelado">Cancelado</SelectItem></SelectContent></Select></div>
              </div>
            </div></CardContent></Card>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" disabled={isLoading} className="bg-indigo-600 text-white"><Save className="w-4 h-4 mr-2" />{isLoading ? "Salvando..." : "Salvar"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -- DETALHES --
function AgendamentoDetalhes({ agendamento, cliente, animal, onClose, onEdit, onDelete }) {
  const getStatusColor = (status) => ({ "Confirmado": "bg-green-500", "Agendado": "bg-blue-500", "Em andamento": "bg-yellow-500", "Concluído": "bg-gray-500", "Cancelado": "bg-red-500" }[status] || "bg-slate-500");
  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8"><div className="flex items-center gap-4"><Button variant="outline" size="icon" onClick={onClose} className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button><div><h1 className="text-3xl font-bold text-slate-900">Detalhes do Agendamento</h1><p className="text-slate-600 mt-1">#{agendamento.id?.slice(0, 8)}</p></div></div><div className="flex gap-3"><Button onClick={() => onEdit(agendamento)}><Edit className="w-4 h-4 mr-2" />Editar</Button>{agendamento.status !== "Concluído" && (<Button onClick={() => onDelete(agendamento.id)} variant="destructive"><Trash2 className="w-4 h-4 mr-2" />Cancelar</Button>)}</div></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6"><Card className="border-0 shadow-lg"><CardHeader className="border-b"><div className="flex items-center justify-between"><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600" />Data e Horário</CardTitle><Badge className={`${getStatusColor(agendamento.status)} text-white`}>{agendamento.status}</Badge></div></CardHeader><CardContent className="p-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><p className="text-sm text-slate-500">Data</p><p className="font-semibold text-slate-900 text-lg mt-1">{format(new Date(agendamento.data), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p></div><div><p className="text-sm text-slate-500">Horário</p><p className="font-semibold text-slate-900 text-lg mt-1">{agendamento.horario}</p></div>{agendamento.profissional && <div className="md:col-span-2"><p className="text-sm text-slate-500">Profissional</p><p className="font-semibold text-slate-900 mt-1">{agendamento.profissional}</p></div>}</div></CardContent></Card>
          <Card className="border-0 shadow-lg"><CardHeader className="border-b"><CardTitle className="flex items-center gap-2"><PawPrint className="w-5 h-5 text-blue-600" />Animal e Tutor</CardTitle></CardHeader><CardContent className="p-6 space-y-4">{animal && <div><p className="text-sm text-slate-500 mb-1">Animal</p><p className="font-bold text-lg text-slate-900">{animal.nome}</p></div>}{cliente && <div><p className="text-sm text-slate-500 mb-1">Tutor</p><p className="font-semibold text-slate-900">{cliente.nome}</p></div>}</CardContent></Card>
          {agendamento.observacoes && <Card className="border-0 shadow-lg"><CardHeader className="border-b"><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" />Observações</CardTitle></CardHeader><CardContent className="p-6"><p className="text-slate-700 whitespace-pre-wrap">{agendamento.observacoes}</p></CardContent></Card>}</div>
          <div className="space-y-6"><Card className="border-0 shadow-lg"><CardHeader className="border-b"><CardTitle className="flex items-center gap-2"><Check className="w-5 h-5 text-purple-600" />Serviços</CardTitle></CardHeader><CardContent className="p-6"><ul>{agendamento.servicos?.map(s => <li key={s} className="font-medium text-slate-700">{s}</li>)}</ul></CardContent></Card><Card className="border-0 shadow-lg"><CardHeader className="border-b"><CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-600" />Pagamento</CardTitle></CardHeader><CardContent className="p-6"><p className="text-2xl font-bold text-slate-900">R$ {agendamento.valor_total?.toFixed(2)}</p></CardContent></Card></div>
        </div>
      </div>
    </div>
  );
}

// -- AGENDA SEMANAL --
function AgendaSemanal({ agendamentos, animais, selectedDate, onSelectAgendamento, onReagendar, isLoading }) {
  const inicioSemana = startOfWeek(selectedDate, { locale: ptBR });
  const diasDaSemana = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i));
  const horarios = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  const getAgendamentos = (dia, horario) => agendamentos.filter(a => isToday(parseISO(a.data)) ? true : format(parseISO(a.data), 'yyyy-MM-dd') === format(dia, 'yyyy-MM-dd') && a.horario.startsWith(horario.slice(0, 2)));
  const getStatusColor = (status) => ({ "Confirmado": "bg-green-500", "Agendado": "bg-blue-500", "Em andamento": "bg-yellow-500" }[status] || "bg-slate-500");
  const handleDragEnd = (result) => { if (result.destination) onReagendar(result.draggableId, result.destination.droppableId.split("-")[0], result.destination.droppableId.split("-")[1] + ":00"); };

  return (
    <Card className="border-0 shadow-lg"><CardContent className="p-6"><DragDropContext onDragEnd={handleDragEnd}><div className="overflow-x-auto"><div className="min-w-[1200px]">
      <div className="grid grid-cols-8 gap-2 mb-4"><div />{diasDaSemana.map((d, i) => <div key={i} className="text-center p-3 bg-slate-100 rounded-lg"><p className="text-sm font-semibold">{format(d, "EEE", { locale: ptBR })}</p><p className="text-lg font-bold">{format(d, "dd")}</p></div>)}</div>
      <div className="space-y-2">{horarios.map(h => <div key={h} className="grid grid-cols-8 gap-2"><div className="flex items-center justify-center"><p className="text-sm font-semibold">{h}</p></div>{diasDaSemana.map((d, i) => {
        const droppableId = `${format(d, "yyyy-MM-dd")}-${h.slice(0, 2)}`;
        return <Droppable key={i} droppableId={droppableId}>{(provided, snapshot) => <div ref={provided.innerRef} {...provided.droppableProps} className={`min-h-[80px] p-2 rounded-lg border-2 ${snapshot.isDraggingOver ? "bg-blue-100 border-blue-400 border-dashed" : "bg-white border-slate-200"}`}>{getAgendamentos(d, h).map((ag, idx) => <Draggable key={ag.id} draggableId={ag.id} index={idx}>{(provided, snapshot) => <div ref={provided.innerRef} {...provided.draggableProps} className={`mb-2 p-2 bg-blue-500 text-white rounded cursor-pointer ${snapshot.isDragging ? "shadow-2xl" : ""}`}><div className="flex items-start gap-1"><div {...provided.dragHandleProps}><GripVertical className="w-3 h-3" /></div><div className="flex-1" onClick={() => !snapshot.isDragging && onSelectAgendamento(ag)}><p className="text-xs font-bold truncate">{animais.find(a => a.id === ag.animal_id)?.nome}</p><p className="text-xs opacity-90">{ag.horario}</p><div className={`w-2 h-2 rounded-full ${getStatusColor(ag.status)} mt-1`}></div></div></div></div>}</Draggable>)}{provided.placeholder}</div>}</Droppable>
      })}</div>)}</div>
    </div></div></DragDropContext></CardContent></Card>
  );
}

// -- AGENDA PROFISSIONAL --
function AgendaPorProfissional({ agendamentos, animais, profissionais, selectedDate, onSelectAgendamento, onReagendar }) {
  const horarios = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  const getAgendamentos = (prof, hor) => agendamentos.filter(a => format(parseISO(a.data), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') && a.profissional === prof && a.horario.startsWith(hor.slice(0, 2)));
  const handleDragEnd = (result) => { if (result.destination) onReagendar(result.draggableId, format(selectedDate, "yyyy-MM-dd"), result.destination.droppableId.split("-")[1] + ":00", result.destination.droppableId.split("-")[0]); };
  
  return (
    <Card className="border-0 shadow-lg"><CardContent className="p-6"><DragDropContext onDragEnd={handleDragEnd}><div className="overflow-x-auto"><div className="min-w-[1000px]">
      <div className={`grid gap-2 mb-4`} style={{ gridTemplateColumns: `120px repeat(${profissionais.length}, 1fr)` }}><div/><_components>
