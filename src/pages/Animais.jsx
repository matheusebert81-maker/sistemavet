import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, PawPrint, Search, Plus, Edit, Trash2 } from "lucide-react";

// --- COMPONENTS ---

function AnimalForm({ animal, clientes, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(animal || {
    cliente_id: "", nome: "", especie: "Cão", raca: "", data_nascimento: "",
    peso: "", porte: "Médio", tipo_pelagem: "Curto/Liso", cor: "",
    sexo: "Macho", castrado: false, temperamento: "Calmo", observacoes_especiais: ""
  });

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.peso <= 0) { alert("Peso deve ser maior que zero."); return; }
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={onCancel} className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{animal ? 'Editar Animal' : 'Novo Animal'}</h1>
          <p className="text-slate-600 mt-1">Preencha os dados do pet</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader className="border-b bg-green-50"><CardTitle>Dados Básicos</CardTitle></CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label>Tutor *</Label>
                <Select value={formData.cliente_id} onValueChange={(v) => handleChange('cliente_id', v)} required>
                  <SelectTrigger className="mt-2"><SelectValue placeholder="Selecione o tutor" /></SelectTrigger>
                  <SelectContent>{clientes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div><Label>Nome *</Label><Input value={formData.nome} onChange={(e) => handleChange('nome', e.target.value)} required className="mt-2" /></div>
              <div>
                <Label>Espécie *</Label>
                <Select value={formData.especie} onValueChange={(v) => handleChange('especie', v)}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Cão">Cão</SelectItem><SelectItem value="Gato">Gato</SelectItem><SelectItem value="Outro">Outro</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Raça</Label><Input value={formData.raca} onChange={(e) => handleChange('raca', e.target.value)} className="mt-2" /></div>
              <div>
                <Label>Sexo</Label>
                <Select value={formData.sexo} onValueChange={(v) => handleChange('sexo', v)}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Macho">Macho</SelectItem><SelectItem value="Fêmea">Fêmea</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Peso (kg)</Label><Input type="number" value={formData.peso} onChange={(e) => handleChange('peso', e.target.value)} className="mt-2" /></div>
              <div><Label>Porte</Label><Select value={formData.porte} onValueChange={(v) => handleChange('porte', v)}><SelectTrigger className="mt-2"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Pequeno">Pequeno</SelectItem><SelectItem value="Médio">Médio</SelectItem><SelectItem value="Grande">Grande</SelectItem></SelectContent></Select></div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancelar</Button>
          <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white"><Save className="w-4 h-4 mr-2" /> {isLoading ? 'Salvando...' : 'Salvar'}</Button>
        </div>
      </form>
    </div>
  );
}

// --- MAIN PAGE ---

export default function Animais() {
  const [viewMode, setViewMode] = useState('list');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: animais = [] } = useQuery({ queryKey: ['animais'], queryFn: () => base44.entities.Animal.list() });
  const { data: clientes = [] } = useQuery({ queryKey: ['clientes'], queryFn: () => base44.entities.Cliente.list() });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Animal.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['animais']); setViewMode('list'); }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Animal.update(data.id, data),
    onSuccess: () => { queryClient.invalidateQueries(['animais']); setViewMode('list'); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Animal.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['animais'])
  });

  const filteredAnimais = animais.filter(a => 
    a.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.raca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (data) => {
    if (data.id) updateMutation.mutate(data);
    else createMutation.mutate(data);
  };

  if (viewMode === 'form') {
    return <AnimalForm animal={selectedAnimal} clientes={clientes} onSubmit={handleSave} onCancel={() => setViewMode('list')} isLoading={createMutation.isPending || updateMutation.isPending} />;
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Animais</h1>
            <p className="text-slate-600">Gestão de pacientes</p>
          </div>
          <Button onClick={() => { setSelectedAnimal(null); setViewMode('form'); }} className="bg-green-600 text-white"><Plus className="w-4 h-4 mr-2"/> Novo Animal</Button>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4"/>
              <Input 
                placeholder="Buscar por nome do pet ou raça..." 
                className="pl-10" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAnimais.map(animal => {
            const tutor = clientes.find(c => c.id === animal.cliente_id);
            return (
              <Card key={animal.id} className="hover:shadow-lg transition-all border-t-4 border-t-green-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold text-2xl border border-green-100">
                      {animal.foto_url ? <img src={animal.foto_url} className="w-full h-full rounded-full object-cover"/> : <PawPrint className="w-8 h-8"/>}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedAnimal(animal); setViewMode('form'); }}><Edit className="w-4 h-4"/></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => { if(confirm('Excluir animal?')) deleteMutation.mutate(animal.id); }}><Trash2 className="w-4 h-4"/></Button>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{animal.nome}</h3>
                  <p className="text-sm text-slate-500 font-medium">{animal.raca} • {animal.peso}kg</p>
                  <div className="mt-3 pt-3 border-t text-xs text-slate-400">
                    <span className="font-bold uppercase text-[10px] tracking-wider">Tutor</span>
                    <p className="text-slate-700 font-semibold truncate">{tutor?.nome || 'Sem tutor'}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filteredAnimais.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">
              <PawPrint className="w-12 h-12 mx-auto mb-3 opacity-20"/>
              <p>Nenhum animal encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
