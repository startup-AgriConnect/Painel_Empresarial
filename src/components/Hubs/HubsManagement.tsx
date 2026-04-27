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
          <h2 className="text-2xl font-semibold text-foreground">Hubs de Consolidação</h2>
          <p className="text-muted-foreground">Pontos estratégicos de recepção, pesagem e cross-docking.</p>
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

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar por nome ou código..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-auto min-w-[160px]"
        >
          <option value="Todos">Todos os Status</option>
          <option value="OPERACIONAL">Operacional</option>
          <option value="SATURADO">Saturado</option>
          <option value="MANUTENCAO">Manutenção</option>
          <option value="INATIVO">Inativo</option>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        {filteredHubs.map((hub) => (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            key={hub.id}
            className={cn(
              "bg-card rounded-lg border border-border shadow-sm relative",
              activeDropdown === hub.id ? "z-30" : "z-0"
            )}
          >
            <div className="p-3 flex items-center gap-3">
              <div className="p-2 bg-muted rounded-md shrink-0">
                <Warehouse className="w-4 h-4 text-foreground" />
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-foreground truncate">{hub.name}</h3>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider shrink-0",
                    hub.status === 'OPERACIONAL' ? "bg-success/10 text-success" :
                    hub.status === 'SATURADO' ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning"
                  )}>
                    {hub.status === 'OPERACIONAL' ? 'Operacional' :
                     hub.status === 'SATURADO' ? 'Saturado' :
                     hub.status === 'MANUTENCAO' ? 'Manutenção' : 'Inativo'}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground shrink-0">{hub.codigo}</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /><span>{hub.location}</span></div>
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" /><span>{hub.aggregators} Agreg.</span></div>
                  <div className="flex items-center gap-1"><Truck className="w-3 h-3" /><span>{hub.numero_docas} Docas</span></div>
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>{hub.horario_funcionamento}</span></div>
                  {hub.possui_balanca && (
                    <div className="flex items-center gap-1"><Scale className="w-3 h-3" /><span>Balança</span></div>
                  )}
                  {hub.possui_refrigeracao && (
                    <div className="flex items-center gap-1 text-info"><Snowflake className="w-3 h-3" /><span>Frio</span></div>
                  )}
                </div>
              </div>

              <div className="hidden md:flex flex-col items-end gap-1 min-w-[140px] pl-3 border-l border-border">
                <div className="flex items-baseline gap-1.5">
                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">Carga</p>
                  <p className="text-sm font-semibold text-foreground tabular-nums">{hub.stock}</p>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        parseInt(hub.capacity) > 80 ? "bg-destructive" : "bg-foreground"
                      )}
                      style={{ width: hub.capacity }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-foreground tabular-nums">{hub.capacity}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  onClick={() => handleManageStock(hub)}
                  size="sm"
                  className="gap-1.5"
                >
                  Gerir Stock
                  <ArrowRight className="w-3 h-3" />
                </Button>

                <div className="relative">
                  <Button
                    onClick={() => setActiveDropdown(activeDropdown === hub.id ? null : hub.id)}
                    variant="ghost"
                    size="icon"
                    className="size-8"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>

                  <AnimatePresence>
                    {activeDropdown === hub.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveDropdown(null)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 4 }}
                          className="absolute right-0 mt-1 w-52 bg-popover text-popover-foreground rounded-md shadow-md border p-1 z-20"
                        >
                          <Button
                            onClick={() => handleEditHub(hub)}
                            variant="ghost"
                            className="h-8 w-full justify-start gap-2 px-2 text-sm"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Editar Hub
                          </Button>

                          {hub.status !== 'MANUTENCAO' && (
                            <Button
                              onClick={() => handleStatusChange(hub.id, 'MANUTENCAO')}
                              variant="ghost"
                              className="h-8 w-full justify-start gap-2 px-2 text-sm text-warning hover:bg-warning/10 hover:text-warning"
                            >
                              <Settings className="w-3.5 h-3.5" />
                              Em Manutenção
                            </Button>
                          )}

                          {hub.status !== 'INATIVO' && (
                            <Button
                              onClick={() => handleStatusChange(hub.id, 'INATIVO')}
                              variant="ghost"
                              className="h-8 w-full justify-start gap-2 px-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              Desativar
                            </Button>
                          )}

                          {(hub.status === 'INATIVO' || hub.status === 'MANUTENCAO') && (
                            <Button
                              onClick={() => handleStatusChange(hub.id, 'OPERACIONAL')}
                              variant="ghost"
                              className="h-8 w-full justify-start gap-2 px-2 text-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Ativar Hub
                            </Button>
                          )}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary rounded-lg p-6 text-primary-foreground">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-6 h-6 text-primary-foreground" />
            <h3 className="text-lg font-semibold">Validação de Balanças</h3>
          </div>
          <p className="text-primary-foreground/80 text-sm mb-6">
            Todos os Hubs utilizam balanças digitais certificadas pela AgriConnect para garantir a precisão do peso e a confiança dos compradores.
          </p>
          <Button className="h-auto px-0 text-sm font-semibold text-primary-foreground hover:text-primary-foreground/80" variant="ghost">
            Verificar Certificações
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Próximos Despachos</h3>
          </div>
          <div className="space-y-4">
            {[
              { hub: 'Hub Cuanza Norte', truck: 'Camião 30T', eta: '2h 15m' },
              { hub: 'Hub Huambo', truck: 'Camião 20T', eta: '45m' },
            ].map((dispatch, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-foreground">{dispatch.hub}</p>
                  <p className="text-xs text-muted-foreground">{dispatch.truck}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-primary uppercase">ETA</p>
                  <p className="text-sm font-semibold text-foreground">{dispatch.eta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
