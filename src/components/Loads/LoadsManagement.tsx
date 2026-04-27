import React, { useState } from 'react';
import { Calendar, DollarSign, Edit2, Filter, MapPin, Package, Plus, Search, Trash2, Truck, Warehouse } from 'lucide-react';
import { motion } from 'motion/react';
import CreateFreightModal from '../Support/CreateFreightModal';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Select } from '../ui/select';

const initialLoads = [
  { id: 'FR-2034', codigo: 'FR-2034', produto: 'Milho Branco', quantidade: '15.0', origem_nome: 'Huambo', destino_nome: 'Luanda', data_coleta_prevista: '2026-04-10', tipo_frete: 'VIA_HUB', hub_destino_name: 'Hub Luanda Sul', valor_frete: '120.000', status: 'PENDENTE', percentual_conclusao: 0 },
  { id: 'FR-2033', codigo: 'FR-2033', produto: 'Mandioca', quantidade: '8.5', origem_nome: 'Uíge', destino_nome: 'Benguela', data_coleta_prevista: '2026-04-12', tipo_frete: 'DIRETO', hub_destino_name: 'N/A', valor_frete: '85.000', status: 'EM_TRANSITO', percentual_conclusao: 45 },
  { id: 'FR-2032', codigo: 'FR-2032', produto: 'Feijão Frade', quantidade: '5.2', origem_nome: 'Bié', destino_nome: 'Luanda', data_coleta_prevista: '2026-04-15', tipo_frete: 'MARKETPLACE', hub_destino_name: 'N/A', valor_frete: '150.000', status: 'PENDENTE', percentual_conclusao: 0 },
];

const hubs = [
  { id: 'HUB-CN-01', name: 'Hub Cuanza Norte' },
  { id: 'HUB-MA-02', name: 'Hub Malanje' },
  { id: 'HUB-HU-03', name: 'Hub Huambo' },
];

export default function LoadsManagement() {
  const [loads, setLoads] = useState(initialLoads);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [originFilter, setOriginFilter] = useState('Todos');
  const [destinationFilter, setDestinationFilter] = useState('Todos');

  const provinces = Array.from(new Set([...loads.map((l) => l.origem_nome), ...loads.map((l) => l.destino_nome)])).sort();

  const filteredLoads = loads.filter((load) => {
    const matchesSearch = load.produto.toLowerCase().includes(searchTerm.toLowerCase()) || load.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'Todos' || load.tipo_frete === typeFilter;
    const matchesOrigin = originFilter === 'Todos' || load.origem_nome === originFilter;
    const matchesDestination = destinationFilter === 'Todos' || load.destino_nome === destinationFilter;
    return matchesSearch && matchesType && matchesOrigin && matchesDestination;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Gestão de Cargas e Fretes</h2>
          <p className="text-muted-foreground">Monitorização e registo de solicitações de transporte.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />
          Nova Carga
        </Button>
      </div>

      <CreateFreightModal isOpen={showModal} onClose={() => setShowModal(false)} onSuccess={(newFreight) => setLoads((prev) => [newFreight, ...prev])} hubs={hubs} />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Pesquisar por produto ou código..." className="pl-9 h-9" />
        </div>
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-9 w-auto min-w-[130px]">
          <option value="Todos">Todos os Tipos</option>
          <option value="DIRETO">Direto</option>
          <option value="VIA_HUB">Via Hub</option>
          <option value="MARKETPLACE">Marketplace</option>
        </Select>
        <Select value={originFilter} onChange={(e) => setOriginFilter(e.target.value)} className="h-9 w-auto min-w-[130px]">
          <option value="Todos">Origem: Todas</option>
          {provinces.map((p) => <option key={`origin-${p}`} value={p}>{p}</option>)}
        </Select>
        <Select value={destinationFilter} onChange={(e) => setDestinationFilter(e.target.value)} className="h-9 w-auto min-w-[130px]">
          <option value="Todos">Destino: Todas</option>
          {provinces.map((p) => <option key={`dest-${p}`} value={p}>{p}</option>)}
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredLoads.map((load) => (
          <motion.div key={load.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="gap-0 py-0 h-full border-border transition-all hover:shadow-md hover:border-foreground/20">
              <CardContent className="flex flex-col gap-2 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="rounded-md bg-muted p-1.5 shrink-0">
                      <Package className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">{load.produto}</h3>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Truck className="h-2.5 w-2.5" />
                        <span className="truncate">{load.tipo_frete}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <Badge
                      variant={load.status === 'EM_TRANSITO' ? 'info' : load.status === 'ENTREGUE' ? 'success' : 'warning'}
                      className="text-[9px] px-1.5 py-0"
                    >
                      {load.status === 'EM_TRANSITO' ? 'Em Trânsito' : load.status === 'ENTREGUE' ? 'Entregue' : 'Pendente'}
                    </Badge>
                    <span className="text-[9px] font-medium text-muted-foreground">{load.codigo}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1 py-1.5 border-y border-border text-[11px]">
                  <div className="flex items-center gap-1 min-w-0">
                    <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="truncate">{load.origem_nome} → {load.destino_nome}</span>
                  </div>
                  <div className="flex items-center gap-1 justify-end">
                    <span className="font-semibold text-foreground tabular-nums">{load.quantidade}</span>
                    <span className="text-muted-foreground">Ton</span>
                  </div>
                  <div className="flex items-center gap-1 min-w-0 text-muted-foreground">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span className="truncate">{load.data_coleta_prevista}</span>
                  </div>
                  {load.tipo_frete === 'VIA_HUB' ? (
                    <div className="flex items-center gap-1 min-w-0 text-muted-foreground justify-end">
                      <Warehouse className="h-3 w-3 shrink-0" />
                      <span className="truncate">{load.hub_destino_name}</span>
                    </div>
                  ) : <div />}
                </div>

                {load.status === 'EM_TRANSITO' && (
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                      <span>Progresso</span>
                      <span className="tabular-nums">{load.percentual_conclusao}%</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-foreground transition-all duration-500" style={{ width: `${load.percentual_conclusao}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-foreground">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-semibold tabular-nums">{load.valor_frete}</span>
                    <span className="text-[10px] text-muted-foreground">Kz</span>
                  </div>
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="icon" className="size-7">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
