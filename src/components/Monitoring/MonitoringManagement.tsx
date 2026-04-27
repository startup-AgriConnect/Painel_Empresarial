import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Maximize2, 
  Minimize2, 
  ChevronRight,
  Info,
  Zap,
  Warehouse,
  MoreVertical
} from 'lucide-react';
import { cn, maskData } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import FeedbackBanner from '../Common/FeedbackBanner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

// CartoDB Positron Style (Light OSM)
const TILE_LAYER_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Component to handle map center and zoom changes
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const initialFreights = [
  {
    id: 'FR-2034',
    codigo: 'FR-2034',
    produto: 'Milho Branco',
    quantidade: '15.0',
    origem: 'Huambo',
    destino: 'Luanda',
    status: 'EM_TRANSITO',
    percentual: 65,
    latitude: -10.7,
    longitude: 14.9,
    origem_coords: [-12.77, 15.73] as [number, number], // Huambo
    destino_coords: [-8.83, 13.23] as [number, number], // Luanda
    motorista: 'Mateus Kiala',
    veiculo: 'Volvo FH 460',
    velocidade: '72 km/h',
    ultima_atualizacao: '2 min atrás',
    checkpoints: [
      { local: 'Huambo (Origem)', hora: '08:00', status: 'COMPLETO' },
      { local: 'Cuanza Sul (Sumbe)', hora: '09:53', status: 'COMPLETO' },
      { local: 'Porto Amboim', hora: '10:20', status: 'EM_CURSO' },
      { local: 'Luanda (Destino)', hora: '12:00', status: 'PENDENTE' }
    ]
  },
  {
    id: 'FR-2033',
    codigo: 'FR-2033',
    produto: 'Mandioca',
    quantidade: '8.5',
    origem: 'Uíge',
    destino: 'Benguela',
    status: 'EM_TRANSITO',
    percentual: 30,
    latitude: -9.1,
    longitude: 14.2,
    origem_coords: [-7.61, 15.06] as [number, number], // Uíge
    destino_coords: [-12.58, 13.41] as [number, number], // Benguela
    motorista: 'António José',
    veiculo: 'Scania R450',
    velocidade: '65 km/h',
    ultima_atualizacao: '5 min atrás',
    checkpoints: [
      { local: 'Uíge (Origem)', hora: '06:30', status: 'COMPLETO' },
      { local: 'Caxito', hora: '08:45', status: 'COMPLETO' },
      { local: 'Luanda', hora: '10:30', status: 'EM_CURSO' },
      { local: 'Benguela (Destino)', hora: '16:00', status: 'PENDENTE' }
    ]
  },
  {
    id: 'FR-2032',
    codigo: 'FR-2032',
    produto: 'Feijão Frade',
    quantidade: '5.2',
    origem: 'Bié',
    destino: 'Luanda',
    status: 'PENDENTE',
    percentual: 0,
    latitude: -12.38,
    longitude: 16.94,
    origem_coords: [-12.38, 16.94] as [number, number], // Bié
    destino_coords: [-8.83, 13.23] as [number, number], // Luanda
    motorista: 'Carlos Alberto',
    veiculo: 'Iveco Stralis',
    velocidade: '0 km/h',
    ultima_atualizacao: '10 min atrás',
    checkpoints: [
      { local: 'Bié (Origem)', hora: '14:00', status: 'PENDENTE' },
      { local: 'Huambo', hora: '16:30', status: 'PENDENTE' },
      { local: 'Luanda (Destino)', hora: '21:00', status: 'PENDENTE' }
    ]
  },
  {
    id: 'FR-2035',
    codigo: 'FR-2035',
    produto: 'Café Robusta',
    quantidade: '12.0',
    origem: 'Cuanza Norte',
    destino: 'Porto de Luanda',
    status: 'ENTREGUE',
    percentual: 100,
    latitude: -8.83,
    longitude: 13.23,
    origem_coords: [-9.30, 14.91] as [number, number], // Cuanza Norte
    destino_coords: [-8.83, 13.23] as [number, number], // Porto de Luanda
    motorista: 'Manuel Bento',
    veiculo: 'Mercedes Actros',
    velocidade: '0 km/h',
    ultima_atualizacao: '1 hora atrás',
    checkpoints: [
      { local: 'Ndalatando', hora: '07:00', status: 'COMPLETO' },
      { local: 'Dondo', hora: '08:30', status: 'COMPLETO' },
      { local: 'Luanda (Porto)', hora: '11:00', status: 'COMPLETO' }
    ]
  },
  {
    id: 'FR-2036',
    codigo: 'FR-2036',
    produto: 'Soja',
    quantidade: '20.0',
    origem: 'Malanje',
    destino: 'Luanda',
    status: 'COM_PROBLEMA',
    percentual: 45,
    latitude: -9.54,
    longitude: 16.34,
    origem_coords: [-9.54, 16.34] as [number, number],
    destino_coords: [-8.83, 13.23] as [number, number],
    motorista: 'João Paulo',
    veiculo: 'Scania G420',
    velocidade: '0 km/h',
    ultima_atualizacao: '15 min atrás',
    checkpoints: [
      { local: 'Malanje (Origem)', hora: '09:00', status: 'COMPLETO' },
      { local: 'Cacuso', hora: '11:30', status: 'EM_CURSO' },
      { local: 'Avaria Mecânica', hora: '12:15', status: 'ALERTA' }
    ]
  }
];

const initialHubs = [
  { 
    id: 'HUB-CN-01', 
    name: 'Hub Cuanza Norte', 
    location: 'Lucala', 
    latitude: -9.27, 
    longitude: 15.24,
    status: 'OPERACIONAL'
  },
  { 
    id: 'HUB-MA-02', 
    name: 'Hub Malanje', 
    location: 'Centro', 
    latitude: -9.54, 
    longitude: 16.34,
    status: 'OPERACIONAL'
  },
  { 
    id: 'HUB-HU-03', 
    name: 'Hub Huambo', 
    location: 'Caála', 
    latitude: -12.85, 
    longitude: 15.56,
    status: 'SATURADO'
  }
];

interface MonitoringManagementProps {
  initialSelectedId?: string | null;
  onClearSelection?: () => void;
}

export default function MonitoringManagement({ initialSelectedId, onClearSelection }: MonitoringManagementProps) {
  const { user } = useAuth();
  const [freights, setFreights] = useState(initialFreights);
  const [selectedFreight, setSelectedFreight] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-11.2027, 17.8739]); // Lat, Lng
  const [mapZoom, setMapZoom] = useState(6);
  const [routeData, setRouteData] = useState<[number, number][]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');
  const [routeCache, setRouteCache] = useState<Record<string, [number, number][]>>({});
  const [routeWarning, setRouteWarning] = useState('');
  const [simulateRouteFailure, setSimulateRouteFailure] = useState(false);

  React.useEffect(() => {
    if (initialSelectedId) {
      const freight = freights.find(f => f.id === initialSelectedId);
      if (freight) {
        handleSelectFreight(freight);
      }
    }
  }, [initialSelectedId]);

  const fetchRoute = async (freight: any) => {
    if (routeCache[freight.id]) {
      setRouteData(routeCache[freight.id]);
      setRouteWarning('');
      return;
    }

    setIsLoadingRoute(true);
    setRouteData([]); // Limpa a rota anterior
    setRouteWarning('');
    try {
      if (simulateRouteFailure) {
        throw new Error('Falha simulada para smoke UX');
      }

      // OSRM espera longitude,latitude
      const coords = [
        `${freight.origem_coords[1]},${freight.origem_coords[0]}`,
        `${freight.longitude},${freight.latitude}`,
        `${freight.destino_coords[1]},${freight.destino_coords[0]}`
      ].join(';');

      const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&continue_straight=true&radiuses=3000;3000;3000`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const points = data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
        setRouteData(points);
        setRouteCache(prev => ({ ...prev, [freight.id]: points }));
      } else {
        const fallback = [
          freight.origem_coords,
          [freight.latitude, freight.longitude],
          freight.destino_coords
        ] as [number, number][];
        setRouteData(fallback);
        setRouteWarning('Não foi possível obter a rota detalhada. A visualização está a usar o traçado simplificado.');
      }
    } catch (error) {
      console.error("Erro ao buscar rota OSRM:", error);
      const fallback = [
        freight.origem_coords,
        [freight.latitude, freight.longitude],
        freight.destino_coords
      ] as [number, number][];
      setRouteData(fallback);
      setRouteWarning(
        simulateRouteFailure
          ? 'Falha simulada de fetch ativada. A rota está a ser apresentada com fallback simplificado.'
          : 'A consulta da rota falhou. O mapa manteve um percurso simplificado para não bloquear a operação.'
      );
    } finally {
      setIsLoadingRoute(false);
    }
  };

  const filteredFreights = freights.filter(f => {
    const matchesSearch = f.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.motorista.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'TODOS' || f.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleSelectFreight = (freight: any) => {
    setSelectedFreight(freight);
    setMapCenter([freight.latitude, freight.longitude]);
    setMapZoom(9); // Zoom um pouco mais aberto para ver a rota
    fetchRoute(freight);
  };

  const createCustomIcon = (status: string, isSelected: boolean = false) => {
    const colorClass = status === 'EM_TRANSITO' ? "bg-info" :
                      status === 'ENTREGUE' ? "bg-success" :
                      status === 'COM_PROBLEMA' ? "bg-destructive" : "bg-warning";
    
    const iconSvg = status === 'EM_TRANSITO' 
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`
      : status === 'ENTREGUE'
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`
      : status === 'COM_PROBLEMA'
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative group">
          ${status === 'EM_TRANSITO' ? '<div class="absolute inset-0 rounded-full bg-info animate-ping opacity-30"></div>' : ''}
          ${status === 'COM_PROBLEMA' ? '<div class="absolute inset-0 rounded-full bg-destructive animate-ping opacity-40"></div>' : ''}
          <div class="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 ${isSelected ? 'border-foreground scale-125' : 'border-background'} text-white ${colorClass} transition-all duration-300 hover:scale-110" style="z-index: ${isSelected ? 1000 : 1};">
            ${iconSvg}
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  };

  const createLocationIcon = (type: 'origem' | 'destino') => {
    const color = type === 'origem' ? '#525252' : '#171717';
    return L.divIcon({
      className: 'location-icon',
      html: `
        <div class="flex flex-col items-center">
          <div class="px-2 py-1 bg-card rounded-lg shadow-lg border border-border text-[10px] font-black uppercase tracking-tighter mb-1">
            ${type}
          </div>
          <div class="w-4 h-4 rounded-full border-2 border-background shadow-lg" style="background-color: ${color}"></div>
        </div>
      `,
      iconSize: [60, 40],
      iconAnchor: [30, 40],
    });
  };

  const createHubIcon = React.useCallback((status: string) => {
    return L.divIcon({
      className: 'hub-icon',
      html: `
        <div class="relative group">
          <div class="w-9 h-9 rounded-md flex items-center justify-center shadow-lg border-2 border-background text-primary-foreground bg-foreground transition-all duration-300 hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V8l9-4 9 4v13"/><path d="M13 21V13h8"/><path d="M13 13V9l8 4v8"/><path d="M8 21v-7"/><path d="M3 13h5"/></svg>
          </div>
          <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${status === 'SATURADO' ? 'bg-destructive' : 'bg-success'}"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  }, []);

  // Memoize markers to prevent unnecessary re-renders
  const freightMarkers = React.useMemo(() => (
    freights.map(freight => (
      <Marker 
        key={freight.id} 
        position={[freight.latitude, freight.longitude]}
        icon={createCustomIcon(freight.status, selectedFreight?.id === freight.id)}
        eventHandlers={{
          click: () => handleSelectFreight(freight)
        }}
      />
    ))
  ), [freights, selectedFreight?.id]);

  const hubMarkers = React.useMemo(() => (
    initialHubs.map(hub => (
      <Marker 
        key={hub.id} 
        position={[hub.latitude, hub.longitude]}
        icon={createHubIcon(hub.status)}
      >
        <Popup>
          <div className="p-2">
            <p className="font-black text-sm text-foreground">{hub.name}</p>
            <p className="text-xs text-muted-foreground">{hub.location}</p>
            <div className={cn(
              "mt-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase inline-block",
              hub.status === 'SATURADO' ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
            )}>
              {hub.status}
            </div>
          </div>
        </Popup>
      </Marker>
    ))
  ), [createHubIcon]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Monitorização em Tempo Real</h2>
          <p className="text-sm text-muted-foreground">Rastreamento GPS e status de todos os fretes ativos.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setSimulateRouteFailure((prev) => !prev)}
            variant={simulateRouteFailure ? 'destructive' : 'outline'}
            size="sm"
          >
            {simulateRouteFailure ? 'Erro simulado: ligado' : 'Simular erro'}
          </Button>
          <div className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-card text-xs font-medium">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-success opacity-75 animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            Ao Vivo
          </div>
        </div>
      </header>

      <div className="-mx-6 lg:-mx-8 -mb-6 lg:-mb-8 h-[calc(100vh-11rem)] flex relative overflow-hidden border-t border-border bg-card">
        {/* Sidebar de Fretes */}
        <motion.aside
          initial={false}
          animate={{ width: isSidebarOpen ? '320px' : '0px', opacity: isSidebarOpen ? 1 : 0 }}
          className="h-full border-r border-border flex flex-col bg-card z-10 overflow-hidden"
        >
          <div className="p-3 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Pesquisar frete ou motorista..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-1">
              {[
                { id: 'TODOS', label: 'Todos', count: freights.length },
                { id: 'EM_TRANSITO', label: 'Em Trânsito', count: freights.filter(f => f.status === 'EM_TRANSITO').length },
                { id: 'PENDENTE', label: 'Pendentes', count: freights.filter(f => f.status === 'PENDENTE').length },
                { id: 'COM_PROBLEMA', label: 'Problemas', count: freights.filter(f => f.status === 'COM_PROBLEMA').length, destructive: true },
              ].map((f) => {
                const active = filterStatus === f.id;
                return (
                  <Button
                    key={f.id}
                    onClick={() => setFilterStatus(f.id)}
                    variant="ghost"
                    className={cn(
                      "h-7 justify-between rounded-md px-2 text-[11px] font-medium transition-colors",
                      active
                        ? (f.destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90")
                        : (f.destructive ? "text-destructive hover:bg-destructive/10" : "text-muted-foreground hover:bg-accent hover:text-foreground")
                    )}
                  >
                    <span className="truncate">{f.label}</span>
                    <span className={cn(
                      "ml-1.5 shrink-0 rounded px-1 text-[10px] font-semibold tabular-nums",
                      active ? "bg-background/20" : "bg-muted"
                    )}>
                      {f.count}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
            {filteredFreights.map((freight) => {
              const statusColor =
                freight.status === 'ENTREGUE' ? 'bg-success' :
                freight.status === 'COM_PROBLEMA' ? 'bg-destructive' :
                freight.status === 'EM_TRANSITO' ? 'bg-info' : 'bg-warning';
              const statusText =
                freight.status === 'EM_TRANSITO' ? 'Em Trânsito' :
                freight.status === 'ENTREGUE' ? 'Entregue' :
                freight.status === 'COM_PROBLEMA' ? 'Problema' : 'Pendente';
              return (
                <button
                  key={freight.id}
                  onClick={() => handleSelectFreight(freight)}
                  className={cn(
                    "relative w-full rounded-md border p-2.5 text-left transition-all",
                    selectedFreight?.id === freight.id
                      ? "bg-accent border-foreground/20"
                      : "bg-card border-transparent hover:bg-accent/50 hover:border-border"
                  )}
                >
                  <span className={cn("absolute left-0 top-2 bottom-2 w-0.5 rounded-r", statusColor)} />
                  <div className="pl-2">
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        {freight.status === 'COM_PROBLEMA' ? (
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-destructive" />
                        ) : (
                          <Truck className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                        )}
                        <span className="text-xs font-semibold text-foreground">{freight.codigo}</span>
                        <span className="text-[10px] text-muted-foreground truncate">· {freight.produto}</span>
                      </div>
                      <span className={cn(
                        "text-[9px] font-semibold uppercase tracking-wider shrink-0",
                        freight.status === 'ENTREGUE' ? "text-success" :
                        freight.status === 'COM_PROBLEMA' ? "text-destructive" :
                        freight.status === 'EM_TRANSITO' ? "text-info" : "text-warning"
                      )}>
                        {statusText}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{freight.origem} → {freight.destino}</span>
                    </div>
                    {freight.status === 'EM_TRANSITO' && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-foreground rounded-full transition-all"
                            style={{ width: `${freight.percentual}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground tabular-nums">{freight.percentual}%</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.aside>

        {/* Mapa */}
        <div className="flex-1 relative bg-muted min-h-[400px]">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            className="absolute inset-0 w-full h-full z-0"
            zoomControl={false}
          >
            <TileLayer
              url={TILE_LAYER_URL}
              attribution={ATTRIBUTION}
            />
            <MapController center={mapCenter} zoom={mapZoom} />
            
            {freightMarkers}
            {hubMarkers}

            {selectedFreight && (
              <>
                <Polyline 
                  key={`route-${selectedFreight.id}`}
                  positions={routeData.length > 0 ? routeData : [
                    selectedFreight.origem_coords,
                    [selectedFreight.latitude, selectedFreight.longitude],
                    selectedFreight.destino_coords
                  ]}
                  pathOptions={{
                    color: '#171717',
                    weight: 4,
                    dashArray: isLoadingRoute ? '10, 10' : undefined,
                    opacity: 0.8
                  }}
                />
                <Marker position={selectedFreight.origem_coords} icon={createLocationIcon('origem')} />
                <Marker position={selectedFreight.destino_coords} icon={createLocationIcon('destino')} />
              </>
            )}
          </MapContainer>
          
          {/* Botão de Toggle Sidebar */}
          <Button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute left-3 top-3 z-20 size-8 rounded-md border border-border bg-card shadow hover:bg-accent"
            size="icon"
            variant="outline"
          >
            {isSidebarOpen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>

          {routeWarning && (
            <div className="absolute left-4 top-20 z-20 max-w-md">
              <FeedbackBanner
                type="info"
                title="Fallback de rota ativo"
                message={routeWarning}
                onDismiss={() => setRouteWarning('')}
              />
            </div>
          )}

          {/* Info Card Flutuante */}
          <AnimatePresence>
            {selectedFreight && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-4 bottom-4 w-80 bg-card rounded-lg shadow-lg border border-border overflow-hidden z-20"
              >
                <div className={cn(
                  "p-4 text-primary-foreground flex justify-between items-center",
                  selectedFreight.status === 'COM_PROBLEMA' ? "bg-destructive" : "bg-primary"
                )}>
                  <div className="flex items-center gap-2">
                    {selectedFreight.status === 'COM_PROBLEMA' ? <AlertCircle className="w-5 h-5 text-primary-foreground" /> : <Truck className="w-5 h-5 text-primary-foreground" />}
                    <h3 className="font-semibold">{selectedFreight.codigo}</h3>
                  </div>
                  <Button onClick={() => { setSelectedFreight(null); onClearSelection?.(); }} className="h-7 w-7 rounded-lg p-0 hover:bg-white/10" size="icon" variant="ghost">
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase">Motorista</p>
                      <p className="text-xs font-semibold text-foreground">{maskData(selectedFreight.motorista, user?.role)}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase">Velocidade</p>
                      <p className={cn(
                        "text-xs font-semibold",
                        selectedFreight.status === 'COM_PROBLEMA' ? "text-destructive" : "text-primary"
                      )}>{selectedFreight.velocidade}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase">Veículo</p>
                      <p className="text-xs font-semibold text-foreground">{maskData(selectedFreight.veiculo, user?.role)}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase">Atualização</p>
                      <p className="text-xs font-semibold text-muted-foreground">{selectedFreight.ultima_atualizacao}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Navigation className="w-4 h-4 text-primary" />
                      <span className="font-semibold">Rota: {selectedFreight.origem} → {selectedFreight.destino}</span>
                    </div>

                    <div className="mt-3 space-y-3 pl-2 border-l-2 border-border ml-2">
                      {selectedFreight.checkpoints?.map((cp: any, idx: number) => (
                        <div key={idx} className="relative flex items-center gap-3">
                          <div className={cn(
                            "absolute -left-[13px] w-2 h-2 rounded-full",
                            cp.status === 'COMPLETO' ? "bg-success" :
                            cp.status === 'EM_CURSO' ? "bg-warning animate-pulse" :
                            cp.status === 'ALERTA' ? "bg-destructive animate-pulse" : "bg-muted-foreground"
                          )} />
                          <div className="flex-1 flex justify-between items-center">
                            <span className={cn(
                              "text-[10px] font-medium",
                              cp.status === 'PENDENTE' ? "text-muted-foreground" : "text-foreground"
                            )}>
                              {cp.local}
                            </span>
                            <span className="text-[10px] font-semibold text-muted-foreground">{cp.hora}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                      <Info className="w-4 h-4 text-warning" />
                      <span>Carga: {selectedFreight.quantidade} Ton de {selectedFreight.produto}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 rounded-lg py-2 text-xs font-semibold">
                      Contactar Motorista
                    </Button>
                    <Button className="rounded-lg px-3 py-2" variant="outline">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legenda do Mapa */}
          <div className="absolute left-3 bottom-3 bg-card/95 backdrop-blur-sm p-2.5 rounded-md shadow-md border border-border z-10">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Legenda</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[11px] text-foreground">
                <div className="w-2.5 h-2.5 bg-info rounded-full" />
                <span>Em Trânsito</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-foreground">
                <div className="w-2.5 h-2.5 bg-warning rounded-full" />
                <span>Pendente</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-foreground">
                <div className="w-2.5 h-2.5 bg-success rounded-full" />
                <span>Entregue</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-foreground">
                <div className="w-2.5 h-2.5 bg-destructive rounded-full" />
                <span>Com Problema</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-foreground pt-1 mt-1 border-t border-border">
                <div className="w-2.5 h-2.5 bg-foreground rounded-sm" />
                <span>Hub Logístico</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add missing icon
function XCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    </svg>
  );
}
