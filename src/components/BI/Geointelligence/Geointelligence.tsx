import React, { useState } from 'react';
import { 
  Satellite, 
  Layers, 
  Maximize2, 
  MousePointer2, 
  CloudRain, 
  Sun, 
  Wind, 
  Thermometer,
  Search,
  Filter,
  Download,
  Eye,
  Zap,
  Navigation,
  Info,
  Leaf,
  Map as MapIcon,
  Activity,
  Truck,
  ShieldAlert,
  ArrowRightLeft,
  Brain,
  LayoutDashboard,
  Droplets,
  AlertTriangle,
  TrendingUp,
  Construction,
  Sprout,
  History,
  Target,
  AlertOctagon,
  Briefcase,
  ShoppingCart,
  Expand,
  Zap as ZapIcon,
  CloudLightning,
  X,
  Calendar,
  Map as MapIcon2,
  BarChart2,
  PieChart,
  ArrowRight,
  Box,
  Compass
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline, Circle, Polygon } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet icon issue using CDN URLs
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const productionPoints = [
  { 
    id: 1, 
    name: 'Polo Agroindustrial de Capanda', 
    province: 'Malanje', 
    coords: [-9.42, 15.45], 
    health: 'Good', 
    ndvi: 0.82,
    soil: 'Ferralsols (Rico)',
    history: [4.2, 4.5, 4.8, 5.1], // Ton/Ha
    investment: 'Alto',
    opportunity: 'Expansão de Silos'
  },
  { 
    id: 2, 
    name: 'Planalto Central', 
    province: 'Huambo', 
    coords: [-12.77, 15.73], 
    health: 'Good', 
    ndvi: 0.78,
    soil: 'Arenosols (Médio)',
    history: [3.8, 3.9, 4.1, 4.3],
    investment: 'Médio',
    opportunity: 'Novas Culturas'
  },
  { 
    id: 3, 
    name: 'Vale do Cavaco', 
    province: 'Benguela', 
    coords: [-12.58, 13.41], 
    health: 'Warning', 
    ndvi: 0.45,
    soil: 'Fluvisols (Aluvial)',
    history: [5.5, 5.2, 4.8, 4.5],
    investment: 'Risco',
    opportunity: 'Irrigação'
  },
  { 
    id: 4, 
    name: 'Matala', 
    province: 'Huíla', 
    coords: [-14.77, 15.03], 
    health: 'Critical', 
    ndvi: 0.25,
    soil: 'Calcisols (Seco)',
    history: [3.1, 2.8, 2.5, 2.1],
    investment: 'Baixo',
    opportunity: 'Recuperação de Solo'
  },
];

const mainRoutes = [
  { 
    id: 1, 
    name: 'EN230 (Malanje-Luanda)', 
    coords: [[-9.54, 16.34], [-9.15, 14.5], [-8.81, 13.23]], 
    status: 'Critical', 
    efficiency: '45%',
    quality: 'Bad',
    estTime: '14h',
    theftRisk: 'High',
    delays: '4h',
    isIdeal: false
  },
  { 
    id: 2, 
    name: 'Caminho de Ferro de Benguela', 
    coords: [[-12.35, 13.53], [-12.58, 13.41], [-12.77, 15.73], [-12.18, 16.94]], 
    status: 'Good', 
    efficiency: '92%',
    quality: 'Good',
    estTime: '18h',
    theftRisk: 'Low',
    delays: '0h',
    isIdeal: true
  },
];

const riskZones = [
  { id: 1, name: 'Zona de Roubo Frequente', coords: [-9.15, 14.5], type: 'Theft' },
  { id: 2, name: 'Estrada Intransitável', coords: [-10.5, 15.2], type: 'Critical' },
];

const extremeWeather = [
  { id: 1, name: 'Tempestade Tropical', coords: [-8.5, 14.0], type: 'Storm' },
  { id: 2, name: 'Seca Extrema', coords: [-15.5, 14.5], type: 'Drought' },
];

const soilZones = [
  { id: 1, name: 'Zona Ferralsols (Alta Produtividade)', coords: [-9.42, 15.45], radius: 80000, color: '#ea580c', type: 'Ferralsols' },
  { id: 2, name: 'Zona Arenosols (Pastagens)', coords: [-12.77, 15.73], radius: 60000, color: '#eab308', type: 'Arenosols' },
  { id: 3, name: 'Zona Fluvisols (Arroz/Hortícolas)', coords: [-12.58, 13.41], radius: 40000, color: '#0ea5e9', type: 'Fluvisols' },
  { id: 4, name: 'Zona Calcisols (Árido)', coords: [-14.77, 15.03], radius: 50000, color: '#78350f', type: 'Calcisols' },
];

const ndviGrid = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  coords: [-8 - Math.random() * 8, 13 + Math.random() * 6],
  value: 0.2 + Math.random() * 0.7
}));

const climateGrid = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  coords: [-8 - Math.random() * 8, 13 + Math.random() * 6],
  temp: 18 + Math.random() * 12,
  rain: Math.random() * 100
}));

export default function Geointelligence() {
  const [layers, setLayers] = useState({
    logistics: true,
    satellite: false,
    climate: true,
    health: true,
    soil: false,
    history: false,
    is3D: false
  });

  const [activeTab, setActiveTab] = useState<'map' | 'predictions' | 'alerts'>('map');
  const [selectedDetail, setSelectedDetail] = useState<'strategy' | 'climate' | null>(null);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Satellite className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Geointeligência</h2>
          </div>
          <p className="text-gray-500 text-sm font-medium">Análise geoespacial avançada integrando satélite, clima e logística.</p>
        </div>
      </header>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-100 pb-4">
        <button 
          onClick={() => setActiveTab('map')}
          className={cn(
            "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all pb-4 -mb-4 border-b-2",
            activeTab === 'map' ? "text-emerald-600 border-emerald-600" : "text-gray-400 border-transparent hover:text-gray-600"
          )}
        >
          <MapIcon className="w-4 h-4" />
          Mapa Inteligente
        </button>
        <button 
          onClick={() => setActiveTab('predictions')}
          className={cn(
            "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all pb-4 -mb-4 border-b-2",
            activeTab === 'predictions' ? "text-emerald-600 border-emerald-600" : "text-gray-400 border-transparent hover:text-gray-600"
          )}
        >
          <Brain className="w-4 h-4" />
          Previsões
        </button>
        <button 
          onClick={() => setActiveTab('alerts')}
          className={cn(
            "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all pb-4 -mb-4 border-b-2",
            activeTab === 'alerts' ? "text-emerald-600 border-emerald-600" : "text-gray-400 border-transparent hover:text-gray-600"
          )}
        >
          <ShieldAlert className="w-4 h-4" />
          Alertas
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'map' && (
          <motion.div 
            key="map-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[800px]"
          >
        {/* Main Map Area */}
        <div className={cn(
          "lg:col-span-3 bg-white rounded-[2.5rem] relative overflow-hidden shadow-2xl border-4 border-white z-0 transition-all duration-700",
          layers.is3D && "perspective-[1200px]"
        )}>
          <div className={cn(
            "h-full w-full transition-all duration-1000 ease-in-out origin-bottom",
            layers.is3D && "rotate-x-[30deg] scale-[1.15] translate-y-[-5%]"
          )}>
            <MapContainer 
              center={[-11.2027, 17.8739]} 
              zoom={6} 
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={layers.satellite 
                ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
            />
            
            {layers.health && ndviGrid.map((cell) => (
              <CircleMarker
                key={`ndvi-${cell.id}`}
                center={cell.coords as [number, number]}
                radius={12}
                fillColor={cell.value > 0.7 ? '#15803d' : cell.value > 0.4 ? '#eab308' : '#be123c'}
                stroke={false}
                fillOpacity={0.3}
              />
            ))}

            {layers.soil && soilZones.map((zone) => (
              <Circle
                key={`soil-${zone.id}`}
                center={zone.coords as [number, number]}
                radius={zone.radius}
                pathOptions={{
                  fillColor: zone.color,
                  fillOpacity: 0.2,
                  color: zone.color,
                  weight: 1,
                  dashArray: '5, 5'
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold text-gray-900 text-xs uppercase">{zone.type}</h4>
                    <p className="text-[10px] text-gray-500">{zone.name}</p>
                  </div>
                </Popup>
              </Circle>
            ))}

            {layers.climate && climateGrid.map((cell) => (
              <CircleMarker
                key={`climate-${cell.id}`}
                center={cell.coords as [number, number]}
                radius={20}
                fillColor={cell.rain > 50 ? '#3b82f6' : '#f59e0b'}
                stroke={false}
                fillOpacity={0.15}
              >
                <Popup>
                  <div className="p-2">
                    <p className="text-[10px] font-bold">Temp: {cell.temp.toFixed(1)}°C</p>
                    <p className="text-[10px] font-bold">Chuva: {cell.rain.toFixed(0)}mm</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {layers.health && productionPoints.map((point) => (
              <CircleMarker 
                key={point.id}
                center={point.coords as [number, number]}
                radius={16}
                fillColor={point.health === 'Good' ? '#16a34a' : point.health === 'Warning' ? '#f59e0b' : '#ef4444'}
                color="#fff"
                weight={2}
                opacity={1}
                fillOpacity={0.9}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h4 className="font-bold text-gray-900 mb-1">{point.name}</h4>
                    <div className="space-y-1 mb-3">
                      <p className="text-[10px] text-gray-500 flex justify-between"><span>NDVI:</span> <span className="font-bold">{point.ndvi}</span></p>
                      {layers.soil && <p className="text-[10px] text-gray-500 flex justify-between"><span>Solo:</span> <span className="font-bold text-amber-700">{point.soil}</span></p>}
                      {layers.history && <p className="text-[10px] text-gray-500 flex justify-between"><span>Prod. Histórica:</span> <span className="font-bold text-blue-600">{point.history[point.history.length-1]} Ton/Ha</span></p>}
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase text-center",
                      point.health === 'Good' ? "bg-emerald-100 text-emerald-700" : 
                      point.health === 'Warning' ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                    )}>
                      {point.health === 'Good' ? 'Saudável' : point.health === 'Warning' ? 'Stress Hídrico' : 'Crítico'}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {layers.logistics && mainRoutes.map((route) => (
              <Polyline 
                key={route.id}
                positions={route.coords as [number, number][]}
                color={route.quality === 'Good' ? '#16a34a' : '#ef4444'}
                weight={route.isIdeal ? 6 : 4}
                dashArray={route.isIdeal ? '' : '10, 10'}
                opacity={0.8}
              >
                <Popup>
                  <div className="p-2 min-w-[180px]">
                    <h4 className="font-bold text-gray-900 mb-2">{route.name}</h4>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500">Qualidade:</span>
                        <span className={cn("font-bold", route.quality === 'Good' ? "text-emerald-600" : "text-rose-600")}>{route.quality === 'Good' ? 'Boa' : 'Ruim'}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500">Tempo Est.:</span>
                        <span className="font-bold">{route.estTime}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500">Atrasos:</span>
                        <span className="font-bold text-rose-600">{route.delays}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500">Risco Roubo:</span>
                        <span className="font-bold text-rose-600">{route.theftRisk}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Polyline>
            ))}

            {layers.logistics && riskZones.map((risk) => (
              <Marker 
                key={risk.id} 
                position={risk.coords as [number, number]}
                icon={L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div class="p-1 bg-white rounded-full border-2 border-rose-500 shadow-lg"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>`,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12]
                })}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold text-rose-600 text-xs uppercase">{risk.type === 'Theft' ? 'Risco de Roubo' : 'Estrada Crítica'}</h4>
                    <p className="text-[10px] text-gray-500">{risk.name}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {layers.climate && extremeWeather.map((weather) => (
              <Marker 
                key={weather.id} 
                position={weather.coords as [number, number]}
                icon={L.divIcon({
                  className: 'climate-icon',
                  html: `<div class="animate-pulse p-2 bg-blue-500/20 rounded-full border-2 border-blue-400 backdrop-blur-sm"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>`,
                  iconSize: [40, 40],
                  iconAnchor: [20, 20]
                })}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold text-blue-600 text-xs uppercase">Clima Extremo</h4>
                    <p className="text-[10px] text-gray-500">{weather.name}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {layers.climate && (
              <div className="absolute inset-0 pointer-events-none z-[400]">
                <div className="absolute top-10 left-1/4 animate-bounce opacity-40"><CloudLightning className="w-12 h-12 text-blue-400" /></div>
                <div className="absolute bottom-20 right-1/3 animate-pulse opacity-30"><CloudRain className="w-16 h-16 text-blue-300" /></div>
              </div>
            )}
          </MapContainer>
          </div>

          {/* Layer Controls Overlay */}
          <div className="absolute top-6 left-6 z-[1000] space-y-2">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-[1.5rem] border border-gray-200 shadow-xl w-64">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-[#16a34a]" />
                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Camadas SIG</h4>
              </div>
              <div className="space-y-2">
                {[
                  { key: 'health', label: 'Saúde (NDVI)' },
                  { key: 'climate', label: 'Clima (Tempo Real)' },
                  { key: 'logistics', label: 'Rotas Logísticas' },
                  { key: 'soil', label: 'Solo (Qualidade)' },
                  { key: 'history', label: 'Histórico de Prod.' },
                  { key: 'satellite', label: 'Visão Satélite' },
                  { key: 'is3D', label: 'Modo 3D (Beta)', icon: Box },
                ].map((layer) => (
                  <label key={layer.key} className={cn(
                    "flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-all",
                    layer.key === 'is3D' && "mt-2 pt-3 border-t border-gray-100"
                  )}>
                    <div className="flex items-center gap-2">
                      {layer.icon && <layer.icon className="w-3 h-3 text-emerald-600" />}
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                        {layer.label}
                      </span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={layers[layer.key as keyof typeof layers]} 
                      onChange={() => setLayers(prev => ({ ...prev, [layer.key]: !prev[layer.key] }))}
                      className="w-4 h-4 text-[#16a34a] rounded border-gray-300 focus:ring-[#16a34a]"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Insights */}
          <div className="absolute top-6 right-6 z-[1000] space-y-3">
            <div className="bg-[#052e16] text-white p-4 rounded-2xl shadow-xl max-w-[240px] border border-[#166534]/30">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-[#86efac]" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#86efac]">Geointeligência IA</p>
              </div>
              <p className="text-xs font-bold leading-relaxed">Chuvas acima da média no Huambo indicam aumento de 15% na safra.</p>
            </div>

            {/* Map Legend */}
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-[1.5rem] border border-gray-200 shadow-xl w-64">
              <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-3">Legenda SIG</h4>
              
              {layers.health && (
                <div className="mb-4">
                  <p className="text-[9px] font-bold text-gray-500 uppercase mb-2">Saúde (NDVI)</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[8px] font-bold text-gray-400 mt-1 uppercase">
                    <span>Baixo</span>
                    <span>Médio</span>
                    <span>Alto</span>
                  </div>
                </div>
              )}

              {layers.soil && (
                <div className="mb-4">
                  <p className="text-[9px] font-bold text-gray-500 uppercase mb-2">Tipos de Solo</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#ea580c]" />
                      <span className="text-[8px] font-bold text-gray-600">Ferralsols</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#eab308]" />
                      <span className="text-[8px] font-bold text-gray-600">Arenosols</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
                      <span className="text-[8px] font-bold text-gray-600">Fluvisols</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#78350f]" />
                      <span className="text-[8px] font-bold text-gray-600">Calcisols</span>
                    </div>
                  </div>
                </div>
              )}

              {layers.climate && (
                <div>
                  <p className="text-[9px] font-bold text-gray-500 uppercase mb-2">Condições Climáticas</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                      <span className="text-[8px] font-bold text-gray-600">Chuva</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                      <span className="text-[8px] font-bold text-gray-600">Seco</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6 overflow-y-auto no-scrollbar pr-2">
          {/* Análise Estratégica */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                Análise Estratégica
              </h3>
              <button 
                onClick={() => setSelectedDetail('strategy')}
                className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                Ver mais <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Onde Investir', value: 'Malanje (Capanda)', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Onde Comprar', value: 'Huambo (Planalto)', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Onde Expandir', value: 'Cuanza Norte', icon: Expand, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Onde há Risco', value: 'Benguela (Hídrico)', icon: AlertOctagon, color: 'text-rose-600', bg: 'bg-rose-50' },
                { label: 'Oportunidade', value: 'Logística Reversa', icon: ZapIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((item, i) => (
                <div key={i} className={cn("p-3 rounded-2xl flex items-center gap-3", item.bg)}>
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <item.icon className={cn("w-3.5 h-3.5", item.color)} />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold text-gray-500 uppercase">{item.label}</p>
                    <p className="text-[10px] font-black text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status do Território */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#16a34a]" />
              Status do Território
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-[9px] font-bold text-emerald-600 uppercase mb-1">Áreas Cultivadas</p>
                <p className="text-xl font-black text-emerald-900">1.2M Ha</p>
                <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 mt-1">
                  <TrendingUp className="w-3 h-3" /> +4.2% Expansão
                </div>
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <p className="text-[9px] font-bold text-rose-600 uppercase mb-1">Zonas de Risco</p>
                <p className="text-xl font-black text-rose-900">12 Zonas</p>
                <div className="flex items-center gap-1 text-[9px] font-bold text-rose-600 mt-1">
                  <AlertTriangle className="w-3 h-3" /> Stress Hídrico
                </div>
              </div>
            </div>
          </div>

          {/* Monitoramento Climático */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-600" />
                Clima em Tempo Real
              </h3>
              <button 
                onClick={() => setSelectedDetail('climate')}
                className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                Ver mais <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Chuva', value: '120mm', icon: CloudRain, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Temp', value: '24°C', icon: Thermometer, color: 'text-rose-600', bg: 'bg-rose-50' },
                { label: 'Humid', value: '68%', icon: Droplets, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Vento', value: '12km/h', icon: Wind, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((stat, i) => (
                <div key={i} className={cn("p-3 rounded-2xl border border-transparent", stat.bg)}>
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className={cn("w-3 h-3", stat.color)} />
                    <span className="text-[8px] font-bold text-gray-500 uppercase">{stat.label}</span>
                  </div>
                  <p className="text-sm font-black text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alerta de Saúde NDVI */}
          <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-5 h-5 text-rose-600" />
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">Saúde das Culturas</h4>
            </div>
            <p className="text-[10px] text-rose-800 leading-relaxed mb-3 font-medium">
              Análise de infravermelho indica queda no vigor vegetativo em 450 hectares no Bié.
            </p>
            <div className="flex items-center justify-between text-[9px] font-black text-rose-600 uppercase">
              <span>Média NDVI: 0.68</span>
              <span>Risco: 12%</span>
            </div>
          </div>

          <div className="bg-[#052e16] p-6 rounded-[2rem] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Satellite className="w-16 h-16" />
            </div>
            <h4 className="font-bold text-sm mb-2">Análise de Satélite</h4>
            <p className="text-[10px] text-emerald-100/70 leading-relaxed mb-4">
              Processamento em tempo real via Sentinel-2 para detecção de anomalias no cultivo.
            </p>
            <button className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all">
              Ver Relatório Completo
            </button>
          </div>
        </div>
      </motion.div>
    )}

      {activeTab === 'predictions' && (
        <motion.div 
          key="predictions-tab"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-50 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Safra 2026</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Projeção de Rendimento</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-black text-gray-900">5.8M <span className="text-sm text-gray-400">Ton</span></span>
                  <span className="text-emerald-600 font-black text-xs">+12.4%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[78%]" />
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Baseado em modelos climáticos e histórico de NDVI, prevemos um aumento significativo na região do Planalto Central.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <ArrowRightLeft className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Demanda Logística</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Próximos 30 Dias</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-black text-gray-900">Alta</span>
                  <span className="text-blue-600 font-black text-xs">Escassez</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[92%]" />
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Aumento na necessidade de transporte de grãos de Malanje para o Porto de Luanda.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-50 rounded-2xl">
                  <Sprout className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Novas Áreas</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Expansão Detectada</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-3xl font-black text-gray-900">45k <span className="text-sm text-gray-400">Ha</span></span>
                  <span className="text-purple-600 font-black text-xs">Bié</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[45%]" />
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Novas fronteiras agrícolas identificadas via satélite Sentinel-2 na província do Bié.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-10 rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Brain className="w-64 h-64" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Relatório de Inteligência Preditiva</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Nossa IA processa bilhões de pontos de dados geográficos, climáticos e de mercado para fornecer uma visão clara do futuro do agronegócio em Angola.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Confiança do Modelo</p>
                  <p className="text-3xl font-black">94.2%</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Dados Processados</p>
                  <p className="text-3xl font-black">1.2 TB</p>
                </div>
              </div>
              <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl">
                Baixar Análise Completa (PDF)
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'alerts' && (
        <motion.div 
          key="alerts-tab"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-4">
            {[
              { 
                id: 1, 
                title: 'Risco de Roubo Elevado', 
                desc: 'Aumento de atividade suspeita detectado na EN230 entre Malanje e Luanda.', 
                type: 'critical', 
                icon: ShieldAlert,
                time: 'Há 15 min',
                location: 'EN230 - Malanje'
              },
              { 
                id: 2, 
                title: 'Aviso de Tempestade', 
                desc: 'Previsão de chuvas torrenciais e ventos fortes nas próximas 24h no litoral norte.', 
                type: 'warning', 
                icon: CloudLightning,
                time: 'Há 1 hora',
                location: 'Zaire / Cabinda'
              },
              { 
                id: 3, 
                title: 'Stress Hídrico Crítico', 
                desc: 'NDVI abaixo da média histórica detectado em 1.200 hectares no Vale do Cavaco.', 
                type: 'critical', 
                icon: Activity,
                time: 'Há 3 horas',
                location: 'Benguela'
              },
              { 
                id: 4, 
                title: 'Manutenção de Estrada', 
                desc: 'Obras na EN100 causando atrasos estimados de 3 horas.', 
                type: 'info', 
                icon: Construction,
                time: 'Há 5 horas',
                location: 'Sumbe'
              },
            ].map((alert) => (
              <div key={alert.id} className={cn(
                "p-6 rounded-[2rem] border flex gap-6 items-start transition-all hover:shadow-md",
                alert.type === 'critical' ? "bg-rose-50 border-rose-100" : 
                alert.type === 'warning' ? "bg-amber-50 border-amber-100" : "bg-blue-50 border-blue-100"
              )}>
                <div className={cn(
                  "p-4 rounded-2xl shadow-sm",
                  alert.type === 'critical' ? "bg-white text-rose-600" : 
                  alert.type === 'warning' ? "bg-white text-amber-600" : "bg-white text-blue-600"
                )}>
                  <alert.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={cn(
                      "text-sm font-black uppercase tracking-tight",
                      alert.type === 'critical' ? "text-rose-900" : 
                      alert.type === 'warning' ? "text-amber-900" : "text-blue-900"
                    )}>
                      {alert.title}
                    </h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{alert.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">{alert.desc}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <MapIcon2 className="w-3 h-3 text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{alert.location}</span>
                    </div>
                    <button className="text-[10px] font-black text-gray-900 uppercase tracking-widest hover:underline">Ver no Mapa</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                Filtrar Alertas
              </h3>
              <div className="space-y-3">
                {['Críticos', 'Avisos', 'Informativos', 'Logística', 'Clima', 'Produção'].map((filter) => (
                  <label key={filter} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all">
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{filter}</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded border-gray-300" />
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-rose-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-rose-200">
              <ShieldAlert className="w-10 h-10 mb-4 opacity-50" />
              <h4 className="text-lg font-black uppercase tracking-tight mb-2">Protocolo de Emergência</h4>
              <p className="text-xs text-rose-100 leading-relaxed mb-6">
                Em caso de alertas críticos de segurança, siga os protocolos estabelecidos e notifique a central imediatamente.
              </p>
              <button className="w-full py-3 bg-white text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all">
                Ver Protocolos
              </button>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Detail Side Panel Overlay */}
      <AnimatePresence>
        {selectedDetail && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetail(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[2000]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[2001] overflow-y-auto no-scrollbar border-l border-gray-100"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-3 rounded-2xl",
                      selectedDetail === 'strategy' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {selectedDetail === 'strategy' ? <Target className="w-6 h-6" /> : <CloudRain className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                        {selectedDetail === 'strategy' ? 'Detalhes Estratégicos' : 'Previsão Climática'}
                      </h3>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                        {selectedDetail === 'strategy' ? 'Inteligência de Mercado' : 'Análise Meteorológica'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedDetail(null)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                {selectedDetail === 'strategy' ? (
                  <div className="space-y-8">
                    <section>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Oportunidades de Investimento</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black text-emerald-900 uppercase">Polo de Capanda</span>
                            <span className="px-2 py-0.5 bg-emerald-200 text-emerald-700 rounded text-[9px] font-black">ALTO ROI</span>
                          </div>
                          <p className="text-xs text-emerald-800 leading-relaxed">
                            Foco em infraestrutura de secagem e armazenamento. Déficit de 30% na capacidade atual.
                          </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black text-blue-900 uppercase">Logística Reversa</span>
                            <span className="px-2 py-0.5 bg-blue-200 text-blue-700 rounded text-[9px] font-black">EFICIÊNCIA</span>
                          </div>
                          <p className="text-xs text-blue-800 leading-relaxed">
                            Otimização de rotas de retorno de Luanda para o interior com insumos agrícolas.
                          </p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Análise de Risco Geopolítico</h4>
                      <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100">
                        <div className="flex items-center gap-3 mb-4">
                          <AlertOctagon className="w-5 h-5 text-rose-600" />
                          <span className="text-xs font-black text-rose-900 uppercase tracking-wider">Zonas de Atenção</span>
                        </div>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-2 text-xs text-rose-800 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            Instabilidade climática no Sul (Cunene)
                          </li>
                          <li className="flex items-center gap-2 text-xs text-rose-800 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            Degradação da EN100 (Benguela-Namibe)
                          </li>
                        </ul>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Projeção de Expansão</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-[9px] font-bold text-gray-500 uppercase mb-1">Novas Áreas</p>
                          <p className="text-lg font-black text-gray-900">+150k Ha</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-[9px] font-bold text-gray-500 uppercase mb-1">Novos Hubs</p>
                          <p className="text-lg font-black text-gray-900">3 Unidades</p>
                        </div>
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <section>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Previsão 7 Dias</h4>
                      <div className="space-y-3">
                        {[
                          { day: 'Segunda', temp: '24°C', cond: 'Sol', icon: Sun, color: 'text-amber-500' },
                          { day: 'Terça', temp: '22°C', cond: 'Nuvens', icon: MapIcon2, color: 'text-gray-400' },
                          { day: 'Quarta', temp: '19°C', cond: 'Chuva', icon: CloudRain, color: 'text-blue-500' },
                          { day: 'Quinta', temp: '18°C', cond: 'Tempestade', icon: CloudLightning, color: 'text-blue-600' },
                          { day: 'Sexta', temp: '21°C', cond: 'Sol', icon: Sun, color: 'text-amber-500' },
                          { day: 'Sábado', temp: '23°C', cond: 'Sol', icon: Sun, color: 'text-amber-500' },
                          { day: 'Domingo', temp: '25°C', cond: 'Sol', icon: Sun, color: 'text-amber-500' },
                        ].map((day, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
                            <div className="flex items-center gap-4">
                              <day.icon className={cn("w-5 h-5", day.color)} />
                              <span className="text-xs font-black text-gray-900 uppercase">{day.day}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-bold text-gray-500 uppercase">{day.cond}</span>
                              <span className="text-sm font-black text-gray-900">{day.temp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Alertas Meteorológicos</h4>
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                          <CloudLightning className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-blue-900 uppercase mb-1">Aviso de Tempestade</p>
                          <p className="text-[10px] text-blue-800 leading-relaxed">
                            Previsão de ventos fortes e descargas elétricas na região norte nas próximas 48h.
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                )}
                
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <button className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl">
                    Gerar Relatório PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
