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
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';

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
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Geointeligência</h2>
          <p className="text-sm text-muted-foreground">Análise geoespacial avançada integrando satélite, clima e logística.</p>
        </div>
      </header>

      {/* Sub-navigation Tabs */}
      <div className="inline-flex items-center gap-1 rounded-md bg-muted p-1">
        <Button
          onClick={() => setActiveTab('map')}
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 rounded-sm px-3 text-xs font-medium",
            activeTab === 'map'
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MapIcon className="w-3.5 h-3.5" />
          Mapa Inteligente
        </Button>
        <Button
          onClick={() => setActiveTab('predictions')}
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 rounded-sm px-3 text-xs font-medium",
            activeTab === 'predictions'
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Brain className="w-3.5 h-3.5" />
          Previsões
        </Button>
        <Button
          onClick={() => setActiveTab('alerts')}
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 rounded-sm px-3 text-xs font-medium",
            activeTab === 'alerts'
              ? "bg-background text-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Alertas
        </Button>
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
          "lg:col-span-3 bg-card rounded-lg relative overflow-hidden shadow-md border border-border z-0 transition-all duration-700",
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
                fillColor={cell.value > 0.7 ? '#22863a' : cell.value > 0.4 ? '#cb7c00' : '#dc2626'}
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
                    <h4 className="font-medium text-foreground text-xs">{zone.type}</h4>
                    <p className="text-xs text-muted-foreground">{zone.name}</p>
                  </div>
                </Popup>
              </Circle>
            ))}

            {layers.climate && climateGrid.map((cell) => (
              <CircleMarker
                key={`climate-${cell.id}`}
                center={cell.coords as [number, number]}
                radius={20}
                fillColor={cell.rain > 50 ? '#0369a1' : '#cb7c00'}
                stroke={false}
                fillOpacity={0.15}
              >
                <Popup>
                  <div className="p-2">
                    <p className="text-xs font-medium">Temp: {cell.temp.toFixed(1)}°C</p>
                    <p className="text-xs font-medium">Chuva: {cell.rain.toFixed(0)}mm</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

            {layers.health && productionPoints.map((point) => (
              <CircleMarker
                key={point.id}
                center={point.coords as [number, number]}
                radius={16}
                fillColor={point.health === 'Good' ? '#22863a' : point.health === 'Warning' ? '#cb7c00' : '#dc2626'}
                color="#fff"
                weight={2}
                opacity={1}
                fillOpacity={0.9}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h4 className="font-medium text-foreground mb-1">{point.name}</h4>
                    <div className="space-y-1 mb-3">
                      <p className="text-xs text-muted-foreground flex justify-between"><span>NDVI:</span> <span className="font-medium">{point.ndvi}</span></p>
                      {layers.soil && <p className="text-xs text-muted-foreground flex justify-between"><span>Solo:</span> <span className="font-medium text-warning">{point.soil}</span></p>}
                      {layers.history && <p className="text-xs text-muted-foreground flex justify-between"><span>Prod. Histórica:</span> <span className="font-medium text-info">{point.history[point.history.length-1]} Ton/Ha</span></p>}
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded text-xs font-medium uppercase text-center",
                      point.health === 'Good' ? "bg-success/10 text-success" :
                      point.health === 'Warning' ? "bg-warning/15 text-warning" : "bg-destructive/10 text-destructive"
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
                color={route.quality === 'Good' ? '#22863a' : '#dc2626'}
                weight={route.isIdeal ? 6 : 4}
                dashArray={route.isIdeal ? '' : '10, 10'}
                opacity={0.8}
              >
                <Popup>
                  <div className="p-2 min-w-[180px]">
                    <h4 className="font-medium text-foreground mb-2">{route.name}</h4>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Qualidade:</span>
                        <span className={cn("font-medium", route.quality === 'Good' ? "text-success" : "text-destructive")}>{route.quality === 'Good' ? 'Boa' : 'Ruim'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Tempo Est.:</span>
                        <span className="font-medium">{route.estTime}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Atrasos:</span>
                        <span className="font-medium text-destructive">{route.delays}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Risco Roubo:</span>
                        <span className="font-medium text-destructive">{route.theftRisk}</span>
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
                  html: `<div class="p-1 bg-white rounded-full border-2 border-rose-500 shadow-lg"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>`,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12]
                })}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-medium text-destructive text-xs">{risk.type === 'Theft' ? 'Risco de Roubo' : 'Estrada Crítica'}</h4>
                    <p className="text-xs text-muted-foreground">{risk.name}</p>
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
                  html: `<div class="animate-pulse p-2 bg-blue-500/20 rounded-full border-2 border-blue-400 backdrop-blur-sm"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0369a1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>`,
                  iconSize: [40, 40],
                  iconAnchor: [20, 20]
                })}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-medium text-info text-xs">Clima Extremo</h4>
                    <p className="text-xs text-muted-foreground">{weather.name}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {layers.climate && (
              <div className="absolute inset-0 pointer-events-none z-[400]">
                <div className="absolute top-10 left-1/4 animate-bounce opacity-40"><CloudLightning className="w-12 h-12 text-info" /></div>
                <div className="absolute bottom-20 right-1/3 animate-pulse opacity-30"><CloudRain className="w-16 h-16 text-info" /></div>
              </div>
            )}
          </MapContainer>
          </div>

          {/* Layer Controls Overlay */}
          <div className="absolute top-4 left-4 z-[1000] space-y-2">
            <div className="bg-card/95 backdrop-blur-md p-4 rounded-md border border-border shadow-md w-64">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-foreground" />
                <h4 className="text-xs font-medium text-foreground">Camadas SIG</h4>
              </div>
              <div className="space-y-1">
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
                    "flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer transition-all",
                    layer.key === 'is3D' && "mt-1 pt-2 border-t border-border"
                  )}>
                    <div className="flex items-center gap-2">
                      {layer.icon && <layer.icon className="w-3 h-3 text-muted-foreground" />}
                      <span className="text-xs text-muted-foreground">
                        {layer.label}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={layers[layer.key as keyof typeof layers]}
                      onChange={() => setLayers(prev => ({ ...prev, [layer.key]: !prev[layer.key] }))}
                      className="size-4 accent-foreground rounded border-border"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Insights */}
          <div className="absolute top-4 right-4 z-[1000] space-y-2">
            <Card className="py-0 max-w-[240px]">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground">Geointeligência IA</p>
                </div>
                <p className="text-xs text-foreground leading-relaxed">Chuvas acima da média no Huambo indicam aumento de 15% na safra.</p>
              </CardContent>
            </Card>

            {/* Map Legend */}
            <div className="bg-card/95 backdrop-blur-md p-4 rounded-md border border-border shadow-md w-64">
              <h4 className="text-xs font-medium text-foreground mb-3">Legenda SIG</h4>

              {layers.health && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Saúde (NDVI)</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gradient-to-r from-destructive via-warning to-success rounded-full" />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Baixo</span>
                    <span>Médio</span>
                    <span>Alto</span>
                  </div>
                </div>
              )}

              {layers.soil && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Tipos de Solo</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#ea580c]" />
                      <span className="text-xs text-muted-foreground">Ferralsols</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#eab308]" />
                      <span className="text-xs text-muted-foreground">Arenosols</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
                      <span className="text-xs text-muted-foreground">Fluvisols</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#78350f]" />
                      <span className="text-xs text-muted-foreground">Calcisols</span>
                    </div>
                  </div>
                </div>
              )}

              {layers.climate && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Condições Climáticas</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-info" />
                      <span className="text-xs text-muted-foreground">Chuva</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      <span className="text-xs text-muted-foreground">Seco</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4 overflow-y-auto no-scrollbar pr-2">
          {/* Análise Estratégica */}
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-medium text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-foreground" />
                  Análise Estratégica
                </h3>
                <Button
                  onClick={() => setSelectedDetail('strategy')}
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                >
                  Ver mais <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Onde Investir', value: 'Malanje (Capanda)', icon: Briefcase },
                  { label: 'Onde Comprar', value: 'Huambo (Planalto)', icon: ShoppingCart },
                  { label: 'Onde Expandir', value: 'Cuanza Norte', icon: Expand },
                  { label: 'Onde há Risco', value: 'Benguela (Hídrico)', icon: AlertOctagon },
                  { label: 'Oportunidade', value: 'Logística Reversa', icon: ZapIcon },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-md bg-muted/50 border border-border flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-md bg-card border border-border">
                      <item.icon className="w-3.5 h-3.5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-xs font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status do Território */}
          <Card className="py-0">
            <CardContent className="p-5">
              <h3 className="text-xs font-medium text-foreground mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-foreground" />
                Status do Território
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-success/10 rounded-md border border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Áreas Cultivadas</p>
                  <p className="text-lg font-semibold text-foreground tracking-tight">1.2M Ha</p>
                  <div className="flex items-center gap-1 text-xs font-medium text-success mt-1">
                    <TrendingUp className="w-3 h-3" /> +4.2% Expansão
                  </div>
                </div>
                <div className="p-3 bg-destructive/10 rounded-md border border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Zonas de Risco</p>
                  <p className="text-lg font-semibold text-foreground tracking-tight">12 Zonas</p>
                  <div className="flex items-center gap-1 text-xs font-medium text-destructive mt-1">
                    <AlertTriangle className="w-3 h-3" /> Stress Hídrico
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monitoramento Climático */}
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xs font-medium text-foreground flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-info" />
                  Clima em Tempo Real
                </h3>
                <Button
                  onClick={() => setSelectedDetail('climate')}
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                >
                  Ver mais <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Chuva', value: '120mm', icon: CloudRain, color: 'text-info' },
                  { label: 'Temp', value: '24°C', icon: Thermometer, color: 'text-destructive' },
                  { label: 'Humid', value: '68%', icon: Droplets, color: 'text-success' },
                  { label: 'Vento', value: '12km/h', icon: Wind, color: 'text-warning' },
                ].map((stat, i) => (
                  <div key={i} className="p-3 rounded-md bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon className={cn("w-3 h-3", stat.color)} />
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerta de Saúde NDVI */}
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-destructive" />
                <h4 className="text-xs font-medium text-foreground">Saúde das Culturas</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Análise de infravermelho indica queda no vigor vegetativo em 450 hectares no Bié.
              </p>
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Média NDVI: 0.68</span>
                <span className="text-destructive">Risco: 12%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="py-0">
            <CardContent className="p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-5">
                <Satellite className="w-12 h-12 text-foreground" />
              </div>
              <h4 className="font-medium text-sm text-foreground mb-1">Análise de Satélite</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Processamento em tempo real via Sentinel-2 para detecção de anomalias no cultivo.
              </p>
              <Button size="sm" className="w-full">
                Ver Relatório Completo
              </Button>
            </CardContent>
          </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="py-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                    <TrendingUp className="w-4 h-4 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground tracking-tight">Safra 2026</h3>
                    <p className="text-xs text-muted-foreground">Projeção de Rendimento</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-semibold text-foreground tracking-tight">5.8M <span className="text-sm text-muted-foreground">Ton</span></span>
                    <span className="text-success font-medium text-xs">+12.4%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success w-[78%]" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Baseado em modelos climáticos e histórico de NDVI, prevemos um aumento significativo na região do Planalto Central.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="py-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                    <ArrowRightLeft className="w-4 h-4 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground tracking-tight">Demanda Logística</h3>
                    <p className="text-xs text-muted-foreground">Próximos 30 Dias</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-semibold text-foreground tracking-tight">Alta</span>
                    <span className="text-info font-medium text-xs">Escassez</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-info w-[92%]" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Aumento na necessidade de transporte de grãos de Malanje para o Porto de Luanda.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="py-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                    <Sprout className="w-4 h-4 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground tracking-tight">Novas Áreas</h3>
                    <p className="text-xs text-muted-foreground">Expansão Detectada</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-semibold text-foreground tracking-tight">45k <span className="text-sm text-muted-foreground">Ha</span></span>
                    <span className="text-foreground font-medium text-xs">Bié</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-foreground w-[45%]" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Novas fronteiras agrícolas identificadas via satélite Sentinel-2 na província do Bié.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="py-0">
            <CardContent className="p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <Brain className="w-48 h-48 text-foreground" />
              </div>
              <div className="relative z-10 max-w-2xl">
                <h3 className="text-xl font-semibold tracking-tight text-foreground mb-3">Relatório de Inteligência Preditiva</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Nossa IA processa bilhões de pontos de dados geográficos, climáticos e de mercado para fornecer uma visão clara do futuro do agronegócio em Angola.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Confiança do Modelo</p>
                    <p className="text-2xl font-semibold text-foreground tracking-tight">94.2%</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Dados Processados</p>
                    <p className="text-2xl font-semibold text-foreground tracking-tight">1.2 TB</p>
                  </div>
                </div>
                <Button>
                  <Download className="w-4 h-4" />
                  Baixar Análise Completa (PDF)
                </Button>
              </div>
            </CardContent>
          </Card>
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
          <div className="lg:col-span-2 space-y-3">
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
              <Card key={alert.id} className="py-0">
                <CardContent className={cn(
                  "p-5 flex gap-4 items-start",
                )}>
                  <div className={cn(
                    "flex size-10 items-center justify-center rounded-md shrink-0",
                    alert.type === 'critical' ? "bg-destructive/10 text-destructive" :
                    alert.type === 'warning' ? "bg-warning/15 text-warning" : "bg-info/10 text-info"
                  )}>
                    <alert.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-semibold text-foreground tracking-tight">
                        {alert.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{alert.desc}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <MapIcon2 className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{alert.location}</span>
                      </div>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">Ver no Mapa</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card className="py-0">
              <CardContent className="p-6">
                <h3 className="text-xs font-medium text-foreground mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-foreground" />
                  Filtrar Alertas
                </h3>
                <div className="space-y-1">
                  {['Críticos', 'Avisos', 'Informativos', 'Logística', 'Clima', 'Produção'].map((filter) => (
                    <label key={filter} className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer transition-all">
                      <span className="text-xs text-muted-foreground">{filter}</span>
                      <input type="checkbox" defaultChecked className="size-4 accent-foreground rounded border-border" />
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="py-0">
              <CardContent className="p-6">
                <ShieldAlert className="w-8 h-8 mb-3 text-destructive" />
                <h4 className="text-base font-semibold text-foreground tracking-tight mb-2">Protocolo de Emergência</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Em caso de alertas críticos de segurança, siga os protocolos estabelecidos e notifique a central imediatamente.
                </p>
                <Button variant="destructive" size="sm" className="w-full">
                  Ver Protocolos
                </Button>
              </CardContent>
            </Card>
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
              className="fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-md z-[2001] overflow-y-auto no-scrollbar border-l border-border"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                      {selectedDetail === 'strategy' ? <Target className="w-4 h-4 text-foreground" /> : <CloudRain className="w-4 h-4 text-foreground" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground tracking-tight">
                        {selectedDetail === 'strategy' ? 'Detalhes Estratégicos' : 'Previsão Climática'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedDetail === 'strategy' ? 'Inteligência de Mercado' : 'Análise Meteorológica'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedDetail(null)}
                    size="icon"
                    variant="ghost"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>

                {selectedDetail === 'strategy' ? (
                  <div className="space-y-6">
                    <section>
                      <h4 className="text-xs font-medium text-muted-foreground mb-3">Oportunidades de Investimento</h4>
                      <div className="space-y-3">
                        <div className="p-4 bg-success/10 rounded-md border border-border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">Polo de Capanda</span>
                            <Badge variant="success">ALTO ROI</Badge>
                          </div>
                          <p className="text-xs text-foreground leading-relaxed">
                            Foco em infraestrutura de secagem e armazenamento. Déficit de 30% na capacidade atual.
                          </p>
                        </div>
                        <div className="p-4 bg-info/10 rounded-md border border-border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">Logística Reversa</span>
                            <Badge variant="info">EFICIÊNCIA</Badge>
                          </div>
                          <p className="text-xs text-foreground leading-relaxed">
                            Otimização de rotas de retorno de Luanda para o interior com insumos agrícolas.
                          </p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-xs font-medium text-muted-foreground mb-3">Análise de Risco Geopolítico</h4>
                      <div className="p-5 bg-destructive/10 rounded-md border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertOctagon className="w-4 h-4 text-destructive" />
                          <span className="text-xs font-medium text-destructive">Zonas de Atenção</span>
                        </div>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-xs text-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                            Instabilidade climática no Sul (Cunene)
                          </li>
                          <li className="flex items-center gap-2 text-xs text-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                            Degradação da EN100 (Benguela-Namibe)
                          </li>
                        </ul>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-xs font-medium text-muted-foreground mb-3">Projeção de Expansão</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-muted/50 rounded-md border border-border">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Novas Áreas</p>
                          <p className="text-base font-semibold text-foreground tracking-tight">+150k Ha</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-md border border-border">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Novos Hubs</p>
                          <p className="text-base font-semibold text-foreground tracking-tight">3 Unidades</p>
                        </div>
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <section>
                      <h4 className="text-xs font-medium text-muted-foreground mb-3">Previsão 7 Dias</h4>
                      <div className="space-y-2">
                        {[
                          { day: 'Segunda', temp: '24°C', cond: 'Sol', icon: Sun, color: 'text-warning' },
                          { day: 'Terça', temp: '22°C', cond: 'Nuvens', icon: MapIcon2, color: 'text-muted-foreground' },
                          { day: 'Quarta', temp: '19°C', cond: 'Chuva', icon: CloudRain, color: 'text-info' },
                          { day: 'Quinta', temp: '18°C', cond: 'Tempestade', icon: CloudLightning, color: 'text-info' },
                          { day: 'Sexta', temp: '21°C', cond: 'Sol', icon: Sun, color: 'text-warning' },
                          { day: 'Sábado', temp: '23°C', cond: 'Sol', icon: Sun, color: 'text-warning' },
                          { day: 'Domingo', temp: '25°C', cond: 'Sol', icon: Sun, color: 'text-warning' },
                        ].map((day, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-md border border-border hover:bg-muted transition-all">
                            <div className="flex items-center gap-3">
                              <day.icon className={cn("w-4 h-4", day.color)} />
                              <span className="text-xs font-medium text-foreground">{day.day}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">{day.cond}</span>
                              <span className="text-sm font-medium text-foreground">{day.temp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h4 className="text-xs font-medium text-muted-foreground mb-3">Alertas Meteorológicos</h4>
                      <div className="p-4 bg-info/10 rounded-md border border-border flex items-start gap-3">
                        <div className="flex size-8 items-center justify-center rounded-md bg-card border border-border">
                          <CloudLightning className="w-4 h-4 text-info" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground mb-1">Aviso de Tempestade</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Previsão de ventos fortes e descargas elétricas na região norte nas próximas 48h.
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-border">
                  <Button className="w-full">
                    <Download className="w-4 h-4" />
                    Gerar Relatório PDF
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
