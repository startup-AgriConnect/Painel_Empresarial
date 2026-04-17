import React, { useState } from 'react';
import { Plus, Package, MapPin, Calendar, Trash2, Edit2, PhoneCall, Truck, DollarSign, Warehouse, Search, Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import CreateFreightModal from '../Support/CreateFreightModal';

const initialLoads = [
  { 
    id: 'FR-2034', 
    codigo: 'FR-2034',
    produto: 'Milho Branco', 
    quantidade: '15.0', 
    origem_nome: 'Huambo', 
    destino_nome: 'Luanda', 
    data_coleta_prevista: '2026-04-10', 
    tipo_frete: 'VIA_HUB',
    hub_destino_name: 'Hub Luanda Sul',
    valor_frete: '120.000',
    status: 'PENDENTE',
    percentual_conclusao: 0
  },
  { 
    id: 'FR-2033', 
    codigo: 'FR-2033',
    produto: 'Mandioca', 
    quantidade: '8.5', 
    origem_nome: 'Uíge', 
    destino_nome: 'Benguela', 
    data_coleta_prevista: '2026-04-12', 
    tipo_frete: 'DIRETO',
    hub_destino_name: 'N/A',
    valor_frete: '85.000',
    status: 'EM_TRANSITO',
    percentual_conclusao: 45
  },
  { 
    id: 'FR-2032', 
    codigo: 'FR-2032',
    produto: 'Feijão Frade', 
    quantidade: '5.2', 
    origem_nome: 'Bié', 
    destino_nome: 'Luanda', 
    data_coleta_prevista: '2026-04-15', 
    tipo_frete: 'MARKETPLACE',
    hub_destino_name: 'N/A',
    valor_frete: '150.000',
    status: 'PENDENTE',
    percentual_conclusao: 0
  },
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

  // Extrair províncias únicas para os filtros
  const provinces = Array.from(new Set([
    ...loads.map(l => l.origem_nome),
    ...loads.map(l => l.destino_nome)
  ])).sort();

  const filteredLoads = loads.filter(load => {
    const matchesSearch = load.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         load.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'Todos' || load.tipo_frete === typeFilter;
    const matchesOrigin = originFilter === 'Todos' || load.origem_nome === originFilter;
    const matchesDestination = destinationFilter === 'Todos' || load.destino_nome === destinationFilter;
    
    return matchesSearch && matchesType && matchesOrigin && matchesDestination;
  });

  const handleCreateSuccess = (newFreight: any) => {
    setLoads(prev => [newFreight, ...prev]);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Cargas e Fretes</h2>
          <p className="text-gray-500">Monitorização e registo de solicitações de transporte.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nova Carga
        </button>
      </header>

      <CreateFreightModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleCreateSuccess}
        hubs={hubs}
      />

      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por produto ou código..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="h-8 w-[1px] bg-gray-100 hidden lg:block" />

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
            >
              <option value="Todos">Todos os Tipos</option>
              <option value="DIRETO">Direto</option>
              <option value="VIA_HUB">Via Hub</option>
              <option value="MARKETPLACE">Marketplace</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <select 
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
            >
              <option value="Todos">Origem: Todas</option>
              {provinces.map(p => (
                <option key={`origin-${p}`} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <select 
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
            >
              <option value="Todos">Destino: Todas</option>
              {provinces.map(p => (
                <option key={`dest-${p}`} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLoads.map((load) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={load.id} 
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={cn(
                  "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                  load.status === 'EM_TRANSITO' ? "bg-emerald-100 text-emerald-700" : 
                  load.status === 'ENTREGUE' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                )}>
                  {load.status === 'EM_TRANSITO' ? 'Em Trânsito' : 
                   load.status === 'ENTREGUE' ? 'Entregue' : 'Pendente'}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{load.codigo}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{load.produto}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                    <Truck className="w-3 h-3" />
                    <span className="font-medium">{load.tipo_frete}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-600 font-black text-lg">{load.quantidade} <span className="text-xs font-bold">Ton</span></p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{load.origem_nome} → {load.destino_nome}</span>
                </div>

                {load.tipo_frete === 'VIA_HUB' && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Warehouse className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="truncate">Via: {load.hub_destino_name}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>Coleta: {load.data_coleta_prevista}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-gray-900">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold">{load.valor_frete} Kz</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {load.status === 'EM_TRANSITO' && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400">
                    <span>Progresso</span>
                    <span>{load.percentual_conclusao}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${load.percentual_conclusao}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
