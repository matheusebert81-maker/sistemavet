import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Package, 
  AlertTriangle,
  TrendingDown,
  Scan,
  ShoppingCart,
  BrainCircuit
} from "lucide-react";

// Placeholders
const ProdutoForm = ({ onCancel }) => <div>Produto Form <Button onClick={onCancel}>Cancel</Button></div>;
const ProdutoDetalhes = ({ onClose }) => <div>Detalhes <Button onClick={onClose}>Close</Button></div>;
const ProdutoCard = ({ produto, onClick }) => <div onClick={onClick} className="border p-4 rounded hover:bg-slate-50 cursor-pointer">{produto.nome}</div>;
const BarcodeScannerModal = ({ onClose }) => <div>Scanner <Button onClick={onClose}>Close</Button></div>;
const EstoqueBaixoAlerts = () => <div className="p-2 bg-yellow-100 text-yellow-800 rounded mb-4">Alertas de Estoque Baixo</div>;
const VendaForm = ({ onClose }) => <div>Venda <Button onClick={onClose}>Close</Button></div>;
const EstoqueInteligente = () => <div>IA Estoque</div>;

export default function Produtos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showVendaForm, setShowVendaForm] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [viewMode, setViewMode] = useState("all");

  const { data: produtos = [], isLoading } = useQuery({
    queryKey: ['produtos'],
    queryFn: () => base44.entities.Produto.list('-created_date'),
    initialData: [],
  });

  const produtosFiltrados = produtos.filter(produto => 
    produto.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedProduto) return <ProdutoDetalhes onClose={() => setSelectedProduto(null)} />;
  if (showForm) return <ProdutoForm onCancel={() => setShowForm(false)} />;

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Produtos</h1>
            <p className="text-slate-600 mt-2">Gerencie o estoque e catálogo</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowScanner(true)} variant="outline"><Scan className="w-4 h-4 mr-2" /> Escanear</Button>
            <Button onClick={() => setShowVendaForm(true)} className="bg-green-600 hover:bg-green-700"><ShoppingCart className="w-5 h-5 mr-2" /> Nova Venda</Button>
            <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700"><Plus className="w-5 h-5 mr-2" /> Novo Produto</Button>
          </div>
        </div>

        <EstoqueBaixoAlerts />

        <Card className="mb-6 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
            </div>
          </CardContent>
        </Card>

        <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-md rounded-xl p-1">
            <TabsTrigger value="all"><Package className="w-4 h-4 mr-2" /> Todos</TabsTrigger>
            <TabsTrigger value="low-stock"><TrendingDown className="w-4 h-4 mr-2" /> Estoque Baixo</TabsTrigger>
            <TabsTrigger value="out-of-stock"><AlertTriangle className="w-4 h-4 mr-2" /> Sem Estoque</TabsTrigger>
             <TabsTrigger value="ai-stock"><BrainCircuit className="w-4 h-4 mr-2" /> IA Estoque</TabsTrigger>
            </TabsList>

          <TabsContent value={viewMode}>
            {isLoading ? <div>Carregando...</div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtosFiltrados.map((produto) => (
                  <ProdutoCard key={produto.id} produto={produto} onClick={() => setSelectedProduto(produto)} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="ai-stock"><EstoqueInteligente /></TabsContent>
        </Tabs>
      </div>

      {showScanner && <BarcodeScannerModal onClose={() => setShowScanner(false)} />}
      {showVendaForm && <VendaForm onClose={() => setShowVendaForm(false)} />}
    </div>
  );
}