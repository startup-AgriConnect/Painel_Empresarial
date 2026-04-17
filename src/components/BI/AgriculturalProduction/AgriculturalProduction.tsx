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
  { name: 'Milho', value: 45, color: '#16a34a' },
  { name: 'Mandioca', value: 30, color: '#3b82f6' },
  { name: 'Feijão', value: 15, color: '#f59e0b' },
  { name: 'Outros', value: 10, color: '#94a3b8' },
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

const StatCard = ({ title, value, change, trend, icon: Icon, unit, colorClass = "text-[#16a34a]", bgClass = "bg-[#f0fdf4]" }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-2xl", bgClass)}>
        <Icon className={cn("w-6 h-6", colorClass)} />
      </div>
      {change && (
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider",
          trend === 'up' ? "bg-[#f0fdf4] text-[#16a34a]" : "bg-rose-50 text-rose-600"
        )}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      )}
    </div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
    <div className="flex items-baseline gap-1">
      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
      {unit && <span className="text-xs font-bold text-gray-400">{unit}</span>}
    </div>
  </div>
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
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 mb-8">
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <Filter className="w-3 h-3" /> Filtros de Produção
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Província</label>
          <select 
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedMunicipality('Todos');
              setSelectedCommune('Todas');
            }}
            className="w-full bg-slate-50 border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:ring-emerald-500"
          >
            {provinces.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Município</label>
          <select 
            value={selectedMunicipality}
            onChange={(e) => {
              setSelectedMunicipality(e.target.value);
              setSelectedCommune('Todas');
            }}
            disabled={selectedProvince === 'Todas'}
            className="w-full bg-slate-50 border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:ring-emerald-500 disabled:opacity-50"
          >
            <option value="Todos">Todos</option>
            {selectedProvince !== 'Todas' && municipalitiesByProvince[selectedProvince].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Comuna</label>
          <select 
            value={selectedCommune}
            onChange={(e) => setSelectedCommune(e.target.value)}
            disabled={selectedMunicipality === 'Todos'}
            className="w-full bg-slate-50 border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:ring-emerald-500 disabled:opacity-50"
          >
            <option value="Todas">Todas</option>
            {selectedMunicipality !== 'Todos' && communesByMunicipality[selectedMunicipality]?.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cultura</label>
          <select 
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full bg-slate-50 border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:ring-emerald-500"
          >
            {cultures.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Produção Agrícola</h2>
          <p className="text-gray-500 text-sm font-medium">Monitorização geoespacial e volumétrica da produção nacional.</p>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex bg-gray-100 p-1.5 rounded-[1.5rem] border border-gray-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-white text-[#16a34a] shadow-sm" 
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            <tab.icon className="w-4 h-4" />
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
            <div className="space-y-8">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Produzido" value="145.200" unit="Ton" change="+8.4%" trend="up" icon={Package} />
                <StatCard title="Crescimento Anual" value="12.5" unit="%" change="+2.1%" trend="up" icon={TrendingUp} />
                <StatCard title="Média por Região" value="3.450" unit="Ton" icon={Activity} colorClass="text-blue-600" bgClass="bg-blue-50" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Climate Impact */}
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-50 rounded-2xl">
                      <CloudRain className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 tracking-tight">Impacto Climático</h3>
                      <p className="text-xs text-gray-500 font-medium">Correlação entre clima e produtividade</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        <CloudRain className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pluviosidade</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">+15% <span className="text-xs text-emerald-600">Ideal</span></p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Thermometer className="w-4 h-4 text-rose-500" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Temperatura</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">24°C <span className="text-xs text-emerald-600">Estável</span></p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-gray-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    “Chuvas aumentaram produtividade no Huambo em 12% comparado ao ano anterior.”
                  </p>
                </div>

                {/* Production Flow */}
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-emerald-50 rounded-2xl">
                      <ArrowRightLeft className="w-6 h-6 text-[#16a34a]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 tracking-tight">Fluxo de Produção</h3>
                      <p className="text-xs text-gray-500 font-medium">Origem → Destino (Principais Rotas)</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { from: 'Huambo', to: 'Luanda', vol: '450 Ton', color: 'bg-[#16a34a]' },
                      { from: 'Malanje', to: 'Luanda', vol: '320 Ton', color: 'bg-blue-500' },
                      { from: 'Bié', to: 'Benguela', vol: '210 Ton', color: 'bg-amber-500' },
                    ].map((route, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-1">
                            <span>{route.from} → {route.to}</span>
                            <span>{route.vol}</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full", route.color)} style={{ width: '70%' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Insight Block - Moved to bottom */}
              <div className="bg-[#052e16] p-8 rounded-[2.5rem] text-[#f0fdf4] relative overflow-hidden border border-[#166534]/30 shadow-xl">
                <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-[#16a34a]/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="p-4 bg-[#16a34a]/20 rounded-[2rem] border border-[#16a34a]/30 shrink-0">
                    <Brain className="w-10 h-10 text-[#86efac]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-[#86efac]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#86efac]">Insight Estratégico</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold leading-tight">
                      “A produção de milho aumentou <span className="text-[#86efac]">20%</span> no Cuanza Norte — oportunidade de compra antecipada”
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(true)}
                    className="px-6 py-3 bg-[#16a34a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#15803d] transition-all shadow-lg shadow-[#16a34a]/20 whitespace-nowrap"
                  >
                    Ver Mais
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="space-y-8">
              {/* Filters */}
              <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cultura:</span>
                  <select 
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none cursor-pointer focus:ring-2 focus:ring-[#16a34a]/20"
                  >
                    <option value="Todos">Todas as Culturas</option>
                    <option value="Milho">Milho</option>
                    <option value="Mandioca">Mandioca</option>
                    <option value="Feijão">Feijão</option>
                    <option value="Arroz">Arroz</option>
                    <option value="Hortícolas">Hortícolas</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Província:</span>
                  <select 
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none cursor-pointer focus:ring-2 focus:ring-[#16a34a]/20"
                  >
                    <option value="Todas">Todas as Províncias</option>
                    <option value="Huambo">Huambo</option>
                    <option value="Malanje">Malanje</option>
                    <option value="Benguela">Benguela</option>
                    <option value="Bengo">Bengo</option>
                    <option value="Huíla">Huíla</option>
                  </select>
                </div>
              </div>

              {/* Map */}
              <div className={cn(
                "bg-white rounded-[2.5rem] relative overflow-hidden shadow-2xl border-4 border-white h-[600px] z-0 transition-all duration-700",
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
                            <h4 className="font-bold text-gray-900">{point.name}</h4>
                            <p className="text-xs text-gray-500">{point.province}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase">
                                {point.product}
                              </span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">
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
                  <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200 flex flex-col gap-1 shadow-lg">
                    <button 
                      onClick={() => setIs3D(!is3D)}
                      className={cn(
                        "p-2.5 rounded-xl transition-all",
                        is3D ? "bg-[#16a34a] text-white shadow-lg shadow-[#16a34a]/20" : "text-gray-600 hover:bg-gray-100"
                      )}
                      title="Alternar Modo 3D"
                    >
                      <Box className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"><Layers className="w-4 h-4" /></button>
                    <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"><Search className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 z-[1000] bg-white/80 backdrop-blur-md p-4 rounded-[1.5rem] border border-gray-200 w-64 shadow-lg">
                  <p className="text-[10px] font-bold text-[#16a34a] uppercase tracking-widest mb-3">Intensidade de Produção</p>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-gradient-to-r from-emerald-900 via-emerald-500 to-emerald-200 rounded-full" />
                    <div className="flex justify-between text-[9px] font-bold text-gray-600 uppercase tracking-tighter">
                      <span>Baixa</span>
                      <span>Média</span>
                      <span>Alta</span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-6 right-6 z-[1000] space-y-3">
                  <div className="bg-[#16a34a] text-white p-4 rounded-2xl shadow-xl max-w-[200px] border border-[#f0fdf4]/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-[#86efac]" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#86efac]">Insight</p>
                    </div>
                    <p className="text-xs font-bold leading-relaxed">Alta produção no Huambo identificada via satélite.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'volume' && (
            <div className="space-y-8">
               <GlobalFilters />
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-8">Produção por Província</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={provinceProduction} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#1e293b', fontSize: 11, fontWeight: 800}} />
                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="volume" fill="#16a34a" radius={[0, 8, 8, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-8">Evolução Temporal</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={productionHistory}>
                        <defs>
                          <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                        <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="volume" stroke="#16a34a" strokeWidth={4} fill="url(#colorVol)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Top Regions Ranking */}
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Top 10 Regiões Produtoras</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topRegions.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#16a34a]/30 transition-all">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-black text-gray-200">#{i+1}</span>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{item.region}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">{item.province}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#16a34a]">{item.volume}</p>
                        <div className={cn("flex items-center justify-end gap-1 text-[9px] font-bold uppercase", item.trend === 'up' ? "text-emerald-500" : "text-rose-500")}>
                          {item.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {item.trend === 'up' ? 'Crescente' : 'Estável'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'crops' && (
            <div className="space-y-8">
              <GlobalFilters />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-8">Participação por Cultura</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={cropDistribution} innerRadius={60} outerRadius={100} paddingAngle={8} dataKey="value">
                          {cropDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-xs font-bold text-gray-600">{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-800 text-center">“Milho representa 45% da produção total nacional.”</p>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-8">Ranking de Culturas (Volume)</h3>
                  <div className="space-y-6">
                    {cropDistribution.map((crop, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-700 uppercase tracking-widest">
                          <span>{crop.name}</span>
                          <span>{crop.value}%</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
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
                </div>
              </div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-8">
              <GlobalFilters />
              <div className="bg-[#052e16] p-10 rounded-[3rem] text-white relative overflow-hidden border border-[#166534]/30 shadow-2xl">
                <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#16a34a]/10 rounded-full blur-[100px]" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                  <div className="shrink-0">
                    <div className="w-24 h-24 bg-[#16a34a]/20 rounded-[2.5rem] border border-[#16a34a]/30 flex items-center justify-center">
                      <Brain className="w-12 h-12 text-[#86efac]" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-[#16a34a]/30 rounded-full border border-[#16a34a]/50">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#86efac]">Previsão ML 2026</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold leading-tight">Estimativa de Produção Futura: <span className="text-[#86efac]">168.400 Ton</span></h3>
                    <p className="text-[#86efac]/70 text-lg font-medium">Tendência de crescimento de 16% para o próximo trimestre com base em dados históricos e SIG.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Tendência de Crescimento Estimada</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={productionHistory}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                        <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={4} strokeDasharray="8 8" dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center">
                  <div className="space-y-6">
                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Confiança do Modelo</p>
                      <p className="text-3xl font-black text-blue-600">94.2%</p>
                    </div>
                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Fator de Impacto</p>
                      <p className="text-xl font-bold text-emerald-800 leading-relaxed">Condições climáticas favoráveis no Planalto Central.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-6">
              {alerts.map((alert) => (
                <div key={alert.id} className={cn(
                  "p-6 rounded-[2rem] border flex items-start gap-6 transition-all hover:scale-[1.01]",
                  alert.type === 'success' ? "bg-emerald-50 border-emerald-100" : 
                  alert.type === 'warning' ? "bg-amber-50 border-amber-100" : "bg-blue-50 border-blue-100"
                )}>
                  <div className={cn(
                    "p-4 rounded-2xl shrink-0",
                    alert.type === 'success' ? "bg-emerald-500 text-white" : 
                    alert.type === 'warning' ? "bg-amber-500 text-white" : "bg-blue-500 text-white"
                  )}>
                    {alert.type === 'success' ? <TrendingUp className="w-6 h-6" /> : 
                     alert.type === 'warning' ? <ShieldAlert className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={cn(
                        "text-lg font-bold",
                        alert.type === 'success' ? "text-emerald-900" : 
                        alert.type === 'warning' ? "text-amber-900" : "text-blue-900"
                      )}>{alert.title}</h4>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{alert.time}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed">{alert.message}</p>
                  </div>
                </div>
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
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[2001] overflow-y-auto no-scrollbar border-l border-gray-100"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Análise Estratégica</h3>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Detalhes e Previsões</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-8">
                  <section>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Previsão do Tempo</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <CloudRain className="w-4 h-4 text-blue-600" />
                          <span className="text-[10px] font-bold text-blue-400 uppercase">Chuva</span>
                        </div>
                        <p className="text-xl font-black text-blue-900">15mm</p>
                        <p className="text-[9px] text-blue-600 font-bold mt-1">Probabilidade: 85%</p>
                      </div>
                      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Thermometer className="w-4 h-4 text-rose-600" />
                          <span className="text-[10px] font-bold text-rose-400 uppercase">Temp</span>
                        </div>
                        <p className="text-xl font-black text-rose-900">28°C</p>
                        <p className="text-[9px] text-rose-600 font-bold mt-1">Máxima esperada</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Insights de Produção</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <p className="text-xs font-bold text-emerald-900 mb-2 uppercase">Cuanza Norte</p>
                        <p className="text-xs text-emerald-700 leading-relaxed">
                          O aumento de 20% na produção de milho é impulsionado por novas técnicas de irrigação implementadas no último semestre.
                        </p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <p className="text-xs font-bold text-amber-900 mb-2 uppercase">Recomendação</p>
                        <p className="text-xs text-amber-700 leading-relaxed">
                          Antecipar contratos de frete para evitar a alta sazonal de preços prevista para o próximo mês.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Histórico de Variação</h4>
                    <div className="h-48 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center">
                      <p className="text-[10px] font-black text-gray-300 uppercase">Gráfico de Variação Semanal</p>
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
