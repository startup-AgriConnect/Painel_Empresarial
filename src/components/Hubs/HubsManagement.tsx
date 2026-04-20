import React, { useState } from 'react';
import { Warehouse, MapPin, Scale, Package, ArrowRight, Users, Plus, MoreVertical, Snowflake, Truck, Clock, Filter, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import CreateHubModal from './CreateHubModal';
import ManageHubStockModal from './ManageHubStockModal';
import { Edit2, Ban, Settings, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';

const initialHubs = [
  { 
    id: 'HUB-CN-01', 
    codigo: 'HUB-CN-01',
    name: 'Hub Cuanza Norte - EN230', 
    location: 'Lucala', 
    capacity: '85%', 
    stock: '25.4 Ton', 
    aggregators: 12, 
    status: 'OPERACIONAL',
    possui_balanca: true,
    possui_refrigeracao: false,
    numero_docas: 4,
    horario_funcionamento: '08:00 - 18:00'
  },
  { 
    id: 'HUB-MA-02', 
    codigo: 'HUB-MA-02',
    name: 'Hub Malanje - Centro', 
    location: 'Malanje', 
    capacity: '40%', 
    stock: '12.1 Ton', 
    aggregators: 8, 
    status: 'OPERACIONAL',
    possui_balanca: true,
    possui_refrigeracao: true,
    numero_docas: 2,
    horario_funcionamento: '24h'
  },
  { 
    id: 'HUB-HU-03', 
    codigo: 'HUB-HU-03',
    name: 'Hub Huambo - Sul', 
    location: 'Caála', 
    capacity: '95%', 
    stock: '28.9 Ton', 
    aggregators: 24, 
    status: 'SATURADO',
    possui_balanca: true,
    possui_refrigeracao: false,
    numero_docas: 6,
    horario_funcionamento: '06:00 - 22:00'
  },
];

export default function HubsManagement() {
  const [hubs, setHubs] = useState(initialHubs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedHub, setSelectedHub] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const filteredHubs = hubs.filter(hub => {
    const matchesSearch = hub.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         hub.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || hub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSuccess = (newHub: any) => {
    if (isEditMode) {
      setHubs(prev => prev.map(hub => hub.id === newHub.id ? newHub : hub));
    } else {
      setHubs(prev => [newHub, ...prev]);
    }
    setIsEditMode(false);
    setSelectedHub(null);
  };

  const handleStatusChange = (hubId: string, newStatus: string) => {
    setHubs(prev => prev.map(hub => hub.id === hubId ? { ...hub, status: newStatus } : hub));
    setActiveDropdown(null);
  };

  const handleEditHub = (hub: any) => {
    setSelectedHub(hub);
    setIsEditMode(true);
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedHub(null);
  };

  const handleManageStock = (hub: any) => {
    setSelectedHub(hub);
    setIsStockModalOpen(true);
  };

  const handleDispatchSuccess = (hubId: string, tons: number) => {
    setHubs(prev => prev.map(hub => {
      if (hub.id === hubId) {
        const currentStock = parseFloat(hub.stock);
        const newStock = Math.max(0, currentStock - tons);
        // Also update capacity percentage based on some logic (e.g. 30 tons is 100%)
        const newCapacity = Math.round((newStock / 30) * 100);
        return { 
          ...hub, 
          stock: `${newStock.toFixed(1)} Ton`,
          capacity: `${newCapacity}%`,
          status: newCapacity > 90 ? 'SATURADO' : 'OPERACIONAL'
        };
      }
      return hub;
    }));
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hubs de Consolidação</h2>
          <p className="text-gray-500">Pontos estratégicos de recepção, pesagem e cross-docking.</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2 rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Novo Hub
        </Button>
      </header>
      <CreateHubModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleCreateSuccess}
        initialData={isEditMode ? selectedHub : null}
      />

      <ManageHubStockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        hub={selectedHub}
        onDispatchSuccess={handleDispatchSuccess}
      />

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Pesquisar por nome ou código..." 
            className="border-none bg-gray-50 pl-10 pr-4 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 flex-1 border-none bg-gray-50 text-sm font-medium text-gray-600 shadow-none md:w-48"
          >
            <option value="Todos">Todos os Status</option>
            <option value="OPERACIONAL">Operacional</option>
            <option value="SATURADO">Saturado</option>
            <option value="MANUTENCAO">Manutenção</option>
            <option value="INATIVO">Inativo</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredHubs.map((hub) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={hub.id} 
            className={cn(
              "bg-white rounded-2xl border border-gray-100 shadow-sm group relative",
              activeDropdown === hub.id ? "z-30" : "z-0"
            )}
          >
            <div className="p-6 flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="p-4 bg-emerald-50 rounded-2xl shrink-0">
                <Warehouse className="w-8 h-8 text-emerald-600" />
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">{hub.name}</h3>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    hub.status === 'OPERACIONAL' ? "bg-emerald-100 text-emerald-700" : 
                    hub.status === 'SATURADO' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {hub.status === 'OPERACIONAL' ? 'Operacional' : 
                     hub.status === 'SATURADO' ? 'Saturado' : 
                     hub.status === 'MANUTENCAO' ? 'Manutenção' : 'Inativo'}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{hub.codigo}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">{hub.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">{hub.aggregators} Agregadores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">{hub.numero_docas} Docas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">{hub.horario_funcionamento}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors",
                    hub.possui_balanca ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-50 text-gray-400 border border-gray-100"
                  )}>
                    <Scale className="w-3.5 h-3.5" />
                    Balança
                  </div>
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors",
                    hub.possui_refrigeracao ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-gray-50 text-gray-400 border border-gray-100"
                  )}>
                    <Snowflake className="w-3.5 h-3.5" />
                    Frio
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:items-center gap-8 lg:pl-8 lg:border-l border-gray-100">
                <div className="flex flex-row lg:flex-col gap-8 lg:gap-3 lg:text-right min-w-[160px]">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">Carga Atual</p>
                    <p className="text-2xl font-black text-emerald-600 leading-none">{hub.stock}</p>
                  </div>
                  <div className="flex-1 lg:flex-none">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1.5">Capacidade</p>
                    <div className="flex items-center lg:justify-end gap-3">
                      <div className="flex-1 lg:w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-700 ease-out",
                            parseInt(hub.capacity) > 80 ? "bg-rose-500" : "bg-emerald-500"
                          )} 
                          style={{ width: hub.capacity }}
                        ></div>
                      </div>
                      <span className="text-xs font-black text-gray-700 tabular-nums">{hub.capacity}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 relative">
                  <Button
                    onClick={() => handleManageStock(hub)}
                    className="h-auto rounded-2xl bg-gray-900 px-6 py-3.5 text-sm font-black shadow-xl shadow-gray-900/10 hover:bg-gray-800"
                  >
                    Gerir Stock
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  
                  <div className="relative">
                    <Button
                      onClick={() => setActiveDropdown(activeDropdown === hub.id ? null : hub.id)}
                      className={cn(
                        "h-auto rounded-2xl border border-transparent p-3.5 transition-all",
                        activeDropdown === hub.id 
                          ? "bg-gray-100 text-gray-900 border-gray-200" 
                          : "text-gray-400 hover:bg-gray-50 hover:border-gray-200"
                      )}
                      variant="ghost"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>

                    <AnimatePresence>
                      {activeDropdown === hub.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setActiveDropdown(null)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 mt-3 w-64 bg-white rounded-[24px] shadow-2xl border border-gray-100 py-3 z-20 overflow-hidden"
                          >
                            <div className="px-5 py-2 border-b border-gray-50 mb-2">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Gestão do Hub</p>
                            </div>
                            
                            <Button
                              onClick={() => handleEditHub(hub)}
                              className="h-auto w-full justify-start gap-4 px-5 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 group"
                              variant="ghost"
                            >
                              <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                                <Edit2 className="w-4 h-4" />
                              </div>
                              <span className="font-bold">Editar Hub</span>
                            </Button>
                            
                            {hub.status !== 'MANUTENCAO' && (
                              <Button
                                onClick={() => handleStatusChange(hub.id, 'MANUTENCAO')}
                                className="h-auto w-full justify-start gap-4 px-5 py-3 text-sm text-amber-600 hover:bg-amber-50 group"
                                variant="ghost"
                              >
                                <div className="p-2 bg-amber-50/50 rounded-xl group-hover:bg-amber-100 transition-colors">
                                  <Settings className="w-4 h-4" />
                                </div>
                                <span className="font-bold">Colocar em Manutenção</span>
                              </Button>
                            )}

                            {hub.status !== 'INATIVO' && (
                              <Button
                                onClick={() => handleStatusChange(hub.id, 'INATIVO')}
                                className="h-auto w-full justify-start gap-4 px-5 py-3 text-sm text-rose-600 hover:bg-rose-50 group"
                                variant="ghost"
                              >
                                <div className="p-2 bg-rose-50/50 rounded-xl group-hover:bg-rose-100 transition-colors">
                                  <Ban className="w-4 h-4" />
                                </div>
                                <span className="font-bold">Desativar Hub</span>
                              </Button>
                            )}

                            {(hub.status === 'INATIVO' || hub.status === 'MANUTENCAO') && (
                              <Button
                                onClick={() => handleStatusChange(hub.id, 'OPERACIONAL')}
                                className="h-auto w-full justify-start gap-4 px-5 py-3 text-sm text-emerald-600 hover:bg-emerald-50 group"
                                variant="ghost"
                              >
                                <div className="p-2 bg-emerald-50/50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <span className="font-bold">Ativar Hub</span>
                              </Button>
                            )}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-900 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold">Validação de Balanças</h3>
          </div>
          <p className="text-emerald-200 text-sm mb-6">
            Todos os Hubs utilizam balanças digitais certificadas pela AgriConnect para garantir a precisão do peso e a confiança dos compradores.
          </p>
          <Button className="h-auto px-0 text-sm font-bold text-emerald-400 hover:text-emerald-300" variant="ghost">
            Verificar Certificações
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-900">Próximos Despachos</h3>
          </div>
          <div className="space-y-4">
            {[
              { hub: 'Hub Cuanza Norte', truck: 'Camião 30T', eta: '2h 15m' },
              { hub: 'Hub Huambo', truck: 'Camião 20T', eta: '45m' },
            ].map((dispatch, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-gray-900">{dispatch.hub}</p>
                  <p className="text-xs text-gray-500">{dispatch.truck}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-600 uppercase">ETA</p>
                  <p className="text-sm font-bold text-gray-900">{dispatch.eta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
