import React, { useState } from 'react';
import {
  Map as MapIcon,
  BarChart3,
  Filter,
  Download,
  ChevronRight,
  Info,
  Zap,
  Layers,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Leaf,
  TrendingUp,
  Package,
  Activity,
  CloudRain,
  Thermometer,
  Brain,
  ShieldAlert,
  ArrowRightLeft,
  LayoutDashboard,
  PieChart as PieChartIcon,
  Box,
  X
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
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
  { id: 1, name: 'Polo Agroindustrial de Capanda', province: 'Malanje', coords: [-9.42, 15.45], volume: 'High', product: 'Milho' },
  { id: 2, name: 'Planalto Central', province: 'Huambo', coords: [-12.77, 15.73], volume: 'High', product: 'Mandioca' },
  { id: 3, name: 'Vale do Cavaco', province: 'Benguela', coords: [-12.58, 13.41], volume: 'Medium', product: 'Feijão' },
  { id: 4, name: 'Quiminha', province: 'Bengo', coords: [-9.15, 13.85], volume: 'Medium', product: 'Hortícolas' },
  { id: 5, name: 'Matala', province: 'Huíla', coords: [-14.77, 15.03], volume: 'High', product: 'Arroz' },
];

const provinceProduction = [
  { name: 'Huambo', volume: 850, color: '#16a34a' },
  { name: 'Bié', volume: 720, color: '#16a34a' },
  { name: 'Uíge', volume: 640, color: '#16a34a' },
  { name: 'Malanje', volume: 590, color: '#16a34a' },
  { name: 'Huíla', volume: 480, color: '#16a34a' },
  { name: 'C. Norte', volume: 420, color: '#16a34a' },
];

const productionHistory = [
  { month: 'Jan', volume: 2100 },
  { month: 'Fev', volume: 2300 },
  { month: 'Mar', volume: 2800 },
  { month: 'Abr', volume: 3200 },
  { month: 'Mai', volume: 3100 },
  { month: 'Jun', volume: 3500 },
];

const cropDistribution = [
  { name: 'Milho', value: 45, color: 'var(--chart-1)' },
  { name: 'Mandioca', value: 30, color: 'var(--chart-2)' },
  { name: 'Feijão', value: 15, color: 'var(--chart-3)' },
  { name: 'Outros', value: 10, color: 'var(--chart-4)' },
];

const topRegions = [
  { region: 'Planalto Central', province: 'Huambo', volume: '1.2k Ton', trend: 'up' },
  { region: 'Vale do Cavaco', province: 'Benguela', volume: '950 Ton', trend: 'up' },
  { region: 'Baixa de Cassanje', province: 'Malanje', volume: '780 Ton', trend: 'down' },
  { region: 'Kikuxi', province: 'Luanda', volume: '450 Ton', trend: 'up' },
];

const alerts = [
  { id: 1, type: 'success', title: 'Aumento Repentino', message: 'Produção em Malanje subiu 15% acima do esperado.', time: '2h atrás' },
  { id: 2, type: 'warning', title: 'Queda Inesperada', message: 'Bié apresenta queda de 8% devido a atrasos na colheita.', time: '5h atrás' },
  { id: 3, type: 'info', title: 'Nova Região Ativa', message: 'Zonas de cultivo identificadas no Moxico via satélite.', time: '1 dia atrás' },
];

const StatCard = ({ title, value, change, trend, icon: Icon, unit }: any) => (
  <Card className="py-0">
    <CardContent className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-9 items-center justify-center rounded-md bg-muted">
          <Icon className="w-4 h-4 text-foreground" />
        </div>
        {change && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend === 'up' ? "text-success" : "text-destructive"
          )}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{title}</p>
      <div className="flex items-baseline gap-1">
        <h3 className="text-2xl font-semibold text-foreground tracking-tight">{value}</h3>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </CardContent>
  </Card>
);

export default function AgriculturalProduction() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProduct, setSelectedProduct] = useState('Todos');
  const [selectedProvince, setSelectedProvince] = useState('Todas');
  const [selectedMunicipality, setSelectedMunicipality] = useState('Todos');
  const [selectedCommune, setSelectedCommune] = useState('Todas');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [is3D, setIs3D] = useState(false);

  const provinces = ['Todas', 'Huambo', 'Bié', 'Benguela', 'Malanje', 'Uíge', 'Huíla'];
  const municipalitiesByProvince: Record<string, string[]> = {
    'Todas': [],
    'Huambo': ['Caála', 'Huambo', 'Bailundo'],
    'Bié': ['Cuito', 'Andulo', 'Camacupa'],
    'Benguela': ['Ganda', 'Benguela', 'Lobito'],
    'Malanje': ['Cacuso', 'Malanje', 'Calandula'],
    'Uíge': ['Negage', 'Uíge', 'Maquela do Zombo'],
    'Huíla': ['Lubango', 'Chibia', 'Humpata']
  };
  const communesByMunicipality: Record<string, string[]> = {
    'Caála': ['Sede', 'Cuima', 'Catata'],
    'Huambo': ['Sede', 'Calenga', 'Chipipa'],
    'Cuito': ['Sede', 'Cunje', 'Trumba'],
    'Ganda': ['Sede', 'Babaera', 'Casseque'],
    'Cacuso': ['Sede', 'Lombe', 'Quizenga'],
    'Negage': ['Sede', 'Dimuca', 'Quisseque'],
    'Lubango': ['Sede', 'Arimba', 'Hoque']
  };
  const cultures = ['Todas', 'Milho', 'Feijão', 'Batata Doce', 'Mandioca', 'Café', 'Hortícolas'];

  const filteredPoints = productionPoints.filter(point => {
    const productMatch = selectedProduct === 'Todos' || point.product === selectedProduct;
    const provinceMatch = selectedProvince === 'Todas' || point.province === selectedProvince;
    return productMatch && provinceMatch;
  });

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'map', label: 'Mapa', icon: MapIcon },
    { id: 'volume', label: 'Volume', icon: BarChart3 },
    { id: 'crops', label: 'Culturas', icon: Leaf },
    { id: 'predictions', label: 'Previsões', icon: Brain },
    { id: 'alerts', label: 'Alertas', icon: ShieldAlert },
  ];

  const GlobalFilters = () => (
    <Card className="py-0 mb-6">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Filter className="w-3.5 h-3.5" /> Filtros de Produção
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Província</label>
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedMunicipality('Todos');
                setSelectedCommune('Todas');
              }}
              className="w-full h-9 px-3 bg-background border border-input rounded-md text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              {provinces.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Município</label>
            <select
              value={selectedMunicipality}
              onChange={(e) => {
                setSelectedMunicipality(e.target.value);
                setSelectedCommune('Todas');
              }}
              disabled={selectedProvince === 'Todas'}
              className="w-full h-9 px-3 bg-background border border-input rounded-md text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50"
            >
              <option value="Todos">Todos</option>
              {selectedProvince !== 'Todas' && municipalitiesByProvince[selectedProvince].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Comuna</label>
            <select
              value={selectedCommune}
              onChange={(e) => setSelectedCommune(e.target.value)}
              disabled={selectedMunicipality === 'Todos'}
              className="w-full h-9 px-3 bg-background border border-input rounded-md text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50"
            >
              <option value="Todas">Todas</option>
              {selectedMunicipality !== 'Todos' && communesByMunicipality[selectedMunicipality]?.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Cultura</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full h-9 px-3 bg-background border border-input rounded-md text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              {cultures.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Produção Agrícola</h2>
          <p className="text-sm text-muted-foreground">Monitorização geoespacial e volumétrica da produção nacional.</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4" /> Exportar
        </Button>
      </header>

      {/* Tabs Navigation */}
      <div className="inline-flex items-center gap-1 rounded-md bg-muted p-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 h-8 px-3 rounded-sm text-xs font-medium transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Produzido" value="145.200" unit="Ton" change="+8.4%" trend="up" icon={Package} />
                <StatCard title="Crescimento Anual" value="12.5" unit="%" change="+2.1%" trend="up" icon={TrendingUp} />
                <StatCard title="Média por Região" value="3.450" unit="Ton" icon={Activity} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Climate Impact */}
                <Card className="py-0">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                        <CloudRain className="w-4 h-4 text-info" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground tracking-tight">Impacto Climático</h3>
                        <p className="text-xs text-muted-foreground">Correlação entre clima e produtividade</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-4 bg-muted rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <CloudRain className="w-4 h-4 text-info" />
                          <span className="text-xs text-muted-foreground">Pluviosidade</span>
                        </div>
                        <p className="text-xl font-semibold text-foreground">+15% <span className="text-xs text-success">Ideal</span></p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <Thermometer className="w-4 h-4 text-destructive" />
                          <span className="text-xs text-muted-foreground">Temperatura</span>
                        </div>
                        <p className="text-xl font-semibold text-foreground">24°C <span className="text-xs text-success">Estável</span></p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground bg-success/10 p-3 rounded-md border border-success/20">
                      "Chuvas aumentaram produtividade no Huambo em 12% comparado ao ano anterior."
                    </p>
                  </CardContent>
                </Card>

                {/* Production Flow */}
                <Card className="py-0">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                        <ArrowRightLeft className="w-4 h-4 text-foreground" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground tracking-tight">Fluxo de Produção</h3>
                        <p className="text-xs text-muted-foreground">Origem → Destino (Principais Rotas)</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        { from: 'Huambo', to: 'Luanda', vol: '450 Ton', color: 'bg-foreground' },
                        { from: 'Malanje', to: 'Luanda', vol: '320 Ton', color: 'bg-info' },
                        { from: 'Bié', to: 'Benguela', vol: '210 Ton', color: 'bg-warning' },
                      ].map((route, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>{route.from} → {route.to}</span>
                              <span className="font-medium text-foreground">{route.vol}</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full", route.color)} style={{ width: '70%' }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Insight Block */}
              <Card className="py-0">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-md bg-muted shrink-0">
                      <Brain className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Insight Estratégico</span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground leading-tight">
                        "A produção de milho aumentou <span className="text-success">20%</span> no Cuanza Norte — oportunidade de compra antecipada"
                      </h3>
                    </div>
                    <Button onClick={() => setIsDrawerOpen(true)} size="sm">
                      Ver Mais
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="space-y-6">
              {/* Filters */}
              <Card className="py-0">
                <CardContent className="p-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Cultura:</span>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="h-9 px-3 bg-background border border-input rounded-md text-sm text-foreground shadow-xs outline-none cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                      <option value="Todos">Todas as Culturas</option>
                      <option value="Milho">Milho</option>
                      <option value="Mandioca">Mandioca</option>
                      <option value="Feijão">Feijão</option>
                      <option value="Arroz">Arroz</option>
                      <option value="Hortícolas">Hortícolas</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Província:</span>
                    <select
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      className="h-9 px-3 bg-background border border-input rounded-md text-sm text-foreground shadow-xs outline-none cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                      <option value="Todas">Todas as Províncias</option>
                      <option value="Huambo">Huambo</option>
                      <option value="Malanje">Malanje</option>
                      <option value="Benguela">Benguela</option>
                      <option value="Bengo">Bengo</option>
                      <option value="Huíla">Huíla</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <div className={cn(
                "bg-card rounded-lg relative overflow-hidden shadow-md border border-border h-[600px] z-0 transition-all duration-700",
                is3D && "perspective-[1200px]"
              )}>
                <div className={cn(
                  "h-full w-full transition-all duration-1000 ease-in-out origin-bottom",
                  is3D && "rotate-x-[30deg] scale-[1.15] translate-y-[-5%]"
                )}>
                  <MapContainer
                    center={[-11.2027, 17.8739]}
                    zoom={6}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {filteredPoints.map((point) => (
                      <CircleMarker
                        key={point.id}
                        center={point.coords as [number, number]}
                        radius={point.volume === 'High' ? 15 : 10}
                        fillColor="#16a34a"
                        color="#052e16"
                        weight={2}
                        opacity={1}
                        fillOpacity={0.6}
                      >
                        <Popup>
                          <div className="p-2">
                            <h4 className="font-semibold text-foreground">{point.name}</h4>
                            <p className="text-xs text-muted-foreground">{point.province}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <Badge variant="success">{point.product}</Badge>
                              <span className="text-xs text-muted-foreground">
                                Vol: {point.volume}
                              </span>
                            </div>
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                  </MapContainer>
                </div>

                <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2">
                  <div className="bg-card/90 backdrop-blur-md p-1.5 rounded-md border border-border flex flex-col gap-1 shadow-md">
                    <button
                      onClick={() => setIs3D(!is3D)}
                      className={cn(
                        "p-2 rounded-sm transition-all",
                        is3D ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                      )}
                      title="Alternar Modo 3D"
                    >
                      <Box className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-muted-foreground hover:bg-muted rounded-sm transition-all"><Layers className="w-4 h-4" /></button>
                    <button className="p-2 text-muted-foreground hover:bg-muted rounded-sm transition-all"><Search className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 z-[1000] bg-card/90 backdrop-blur-md p-4 rounded-lg border border-border w-64 shadow-md">
                  <p className="text-xs font-medium text-foreground mb-3">Intensidade de Produção</p>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-gradient-to-r from-foreground via-muted-foreground to-muted rounded-full" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Baixa</span>
                      <span>Média</span>
                      <span>Alta</span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-6 right-6 z-[1000] space-y-3">
                  <Card className="py-0 max-w-[200px]">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                        <p className="text-xs font-medium text-muted-foreground">Insight</p>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">Alta produção no Huambo identificada via satélite.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'volume' && (
            <div className="space-y-6">
               <GlobalFilters />
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="py-0">
                  <CardContent className="p-6">
                    <h3 className="text-base font-semibold text-foreground tracking-tight mb-6">Produção por Província</h3>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={provinceProduction} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: 'var(--foreground)', fontSize: 12, fontWeight: 600}} />
                          <Tooltip cursor={{fill: 'var(--muted)'}} contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="volume" fill="var(--foreground)" radius={[0, 4, 4, 0]} barSize={24} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="py-0">
                  <CardContent className="p-6">
                    <h3 className="text-base font-semibold text-foreground tracking-tight mb-6">Evolução Temporal</h3>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={productionHistory}>
                          <defs>
                            <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} />
                          <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                          <Area type="monotone" dataKey="volume" stroke="var(--foreground)" strokeWidth={2} fill="url(#colorVol)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Regions Ranking */}
              <Card className="py-0">
                <CardContent className="p-6">
                  <h3 className="text-base font-semibold text-foreground tracking-tight mb-6">Top 10 Regiões Produtoras</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topRegions.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border hover:border-ring/40 transition-all">
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-semibold text-muted-foreground/60">#{i+1}</span>
                          <div>
                            <h4 className="text-sm font-medium text-foreground">{item.region}</h4>
                            <p className="text-xs text-muted-foreground">{item.province}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{item.volume}</p>
                          <div className={cn("flex items-center justify-end gap-1 text-xs font-medium", item.trend === 'up' ? "text-success" : "text-destructive")}>
                            {item.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {item.trend === 'up' ? 'Crescente' : 'Estável'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'crops' && (
            <div className="space-y-6">
              <GlobalFilters />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 py-0">
                  <CardContent className="p-6">
                    <h3 className="text-base font-semibold text-foreground tracking-tight mb-6">Participação por Cultura</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={cropDistribution} innerRadius={60} outerRadius={100} paddingAngle={8} dataKey="value">
                            {cropDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                          <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-3 bg-success/10 rounded-md border border-success/20">
                      <p className="text-xs text-foreground text-center">"Milho representa 45% da produção total nacional."</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 py-0">
                  <CardContent className="p-6">
                    <h3 className="text-base font-semibold text-foreground tracking-tight mb-6">Ranking de Culturas (Volume)</h3>
                    <div className="space-y-5">
                      {cropDistribution.map((crop, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-sm text-foreground">
                            <span className="font-medium">{crop.name}</span>
                            <span className="text-muted-foreground">{crop.value}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${crop.value}%` }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: crop.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-6">
              <GlobalFilters />
              <Card className="py-0">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="shrink-0">
                      <div className="flex size-16 items-center justify-center rounded-md bg-muted">
                        <Brain className="w-8 h-8 text-foreground" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Badge variant="secondary">Previsão ML 2026</Badge>
                      <h3 className="text-2xl font-semibold text-foreground tracking-tight leading-tight">Estimativa de Produção Futura: <span className="text-success">168.400 Ton</span></h3>
                      <p className="text-sm text-muted-foreground">Tendência de crescimento de 16% para o próximo trimestre com base em dados históricos e SIG.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="py-0">
                  <CardContent className="p-6">
                    <h3 className="text-base font-semibold text-foreground tracking-tight mb-6">Tendência de Crescimento Estimada</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={productionHistory}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} />
                          <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                          <Line type="monotone" dataKey="volume" stroke="var(--chart-1)" strokeWidth={2} strokeDasharray="6 6" dot={{ r: 4, fill: 'var(--chart-1)', strokeWidth: 2, stroke: 'var(--background)' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card className="py-0">
                  <CardContent className="p-6 flex flex-col justify-center">
                    <div className="space-y-4">
                      <div className="p-5 bg-info/10 rounded-lg border border-info/20">
                        <p className="text-xs font-medium text-info mb-2">Confiança do Modelo</p>
                        <p className="text-3xl font-semibold text-info">94.2%</p>
                      </div>
                      <div className="p-5 bg-success/10 rounded-lg border border-success/20">
                        <p className="text-xs font-medium text-success mb-2">Fator de Impacto</p>
                        <p className="text-base font-medium text-foreground leading-relaxed">Condições climáticas favoráveis no Planalto Central.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className="py-0">
                  <CardContent className={cn(
                    "p-5 flex items-start gap-4 border-l-4",
                    alert.type === 'success' ? "border-l-success" :
                    alert.type === 'warning' ? "border-l-warning" : "border-l-info"
                  )}>
                    <div className={cn(
                      "flex size-10 items-center justify-center rounded-md shrink-0",
                      alert.type === 'success' ? "bg-success/10 text-success" :
                      alert.type === 'warning' ? "bg-warning/15 text-warning" : "bg-info/10 text-info"
                    )}>
                      {alert.type === 'success' ? <TrendingUp className="w-5 h-5" /> :
                       alert.type === 'warning' ? <ShieldAlert className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-base font-semibold text-foreground">{alert.title}</h4>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{alert.message}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Detail Side Panel Overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
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
                      <Brain className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground tracking-tight">Análise Estratégica</h3>
                      <p className="text-xs text-muted-foreground">Detalhes e Previsões</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsDrawerOpen(false)}
                    size="icon"
                    variant="ghost"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <section>
                    <h4 className="text-xs font-medium text-muted-foreground mb-3">Previsão do Tempo</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="py-0">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CloudRain className="w-4 h-4 text-info" />
                            <span className="text-xs text-muted-foreground">Chuva</span>
                          </div>
                          <p className="text-xl font-semibold text-foreground">15mm</p>
                          <p className="text-xs text-info mt-1">Probabilidade: 85%</p>
                        </CardContent>
                      </Card>
                      <Card className="py-0">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Thermometer className="w-4 h-4 text-destructive" />
                            <span className="text-xs text-muted-foreground">Temp</span>
                          </div>
                          <p className="text-xl font-semibold text-foreground">28°C</p>
                          <p className="text-xs text-destructive mt-1">Máxima esperada</p>
                        </CardContent>
                      </Card>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-medium text-muted-foreground mb-3">Insights de Produção</h4>
                    <div className="space-y-3">
                      <Card className="py-0">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="success">Cuanza Norte</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            O aumento de 20% na produção de milho é impulsionado por novas técnicas de irrigação implementadas no último semestre.
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="py-0">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="warning">Recomendação</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Antecipar contratos de frete para evitar a alta sazonal de preços prevista para o próximo mês.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-medium text-muted-foreground mb-3">Histórico de Variação</h4>
                    <div className="h-48 bg-muted rounded-lg border border-border flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">Gráfico de Variação Semanal</p>
                    </div>
                  </section>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
