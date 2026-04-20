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
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Cargas e Fretes</h2>
          <p className="text-gray-500">Monitorização e registo de solicitações de transporte.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />
          Nova Carga
        </Button>
      </div>

      <CreateFreightModal isOpen={showModal} onClose={() => setShowModal(false)} onSuccess={(newFreight) => setLoads((prev) => [newFreight, ...prev])} hubs={hubs} />

      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Pesquisar por produto ou código..." className="pl-10" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="Todos">Todos os Tipos</option>
                <option value="DIRETO">Direto</option>
                <option value="VIA_HUB">Via Hub</option>
                <option value="MARKETPLACE">Marketplace</option>
              </Select>
            </div>
            <Select value={originFilter} onChange={(e) => setOriginFilter(e.target.value)}>
              <option value="Todos">Origem: Todas</option>
              {provinces.map((p) => <option key={`origin-${p}`} value={p}>{p}</option>)}
            </Select>
            <Select value={destinationFilter} onChange={(e) => setDestinationFilter(e.target.value)}>
              <option value="Todos">Destino: Todas</option>
              {provinces.map((p) => <option key={`dest-${p}`} value={p}>{p}</option>)}
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLoads.map((load) => (
          <motion.div key={load.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="h-full border-gray-100 transition-all hover:shadow-md">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <Package className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={load.status === 'EM_TRANSITO' ? 'success' : 'warning'}>
                      {load.status === 'EM_TRANSITO' ? 'Em Trânsito' : load.status === 'ENTREGUE' ? 'Entregue' : 'Pendente'}
                    </Badge>
                    <span className="text-[10px] font-bold uppercase text-gray-400">{load.codigo}</span>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{load.produto}</h3>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                      <Truck className="h-3 w-3" />
                      <span className="font-medium">{load.tipo_frete}</span>
                    </div>
                  </div>
                  <p className="text-right text-lg font-black text-emerald-600">
                    {load.quantidade} <span className="text-xs font-bold">Ton</span>
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                    <span className="truncate">{load.origem_nome} → {load.destino_nome}</span>
                  </div>
                  {load.tipo_frete === 'VIA_HUB' && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Warehouse className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="truncate">Via: {load.hub_destino_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                    <span>Coleta: {load.data_coleta_prevista}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-1.5 text-gray-900">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-bold">{load.valor_frete} Kz</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {load.status === 'EM_TRANSITO' && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400">
                      <span>Progresso</span>
                      <span>{load.percentual_conclusao}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${load.percentual_conclusao}%` }} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
