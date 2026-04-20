import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  Info,
  Filter,
  Activity,
  Zap,
  MapPin,
  LayoutDashboard,
  Map as MapIcon,
  Scale,
  Truck,
  AlertCircle,
  Package,
  Brain,
  ArrowRightLeft,
  Clock,
  Coins,
  ChevronRight,
  Search
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
  ComposedChart,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../ui/button';
import { Select } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';

// Mock Data
const priceHistory = [
  { month: 'Jan', price: 380, demand: 420, supply: 400 },
  { month: 'Fev', price: 400, demand: 450, supply: 410 },
  { month: 'Mar', price: 420, demand: 580, supply: 430 },
  { month: 'Abr', price: 450, demand: 610, supply: 420 },
  { month: 'Mai', price: 440, demand: 590, supply: 450 },
  { month: 'Jun', price: 460, demand: 650, supply: 440 },
];

const supplyDemandByRegion = [
  { region: 'Luanda', supply: 120, demand: 450, status: 'Escassez', price: 'Alto' },
  { region: 'Huambo', supply: 380, demand: 150, status: 'Excesso', price: 'Baixo' },
  { region: 'Benguela', supply: 210, demand: 380, status: 'Escassez', price: 'Médio-Alto' },
  { region: 'Bié', supply: 310, demand: 120, status: 'Excesso', price: 'Baixo' },
  { region: 'Uíge', supply: 250, demand: 180, status: 'Equilibrado', price: 'Médio' },
  { region: 'Huíla', supply: 180, demand: 320, status: 'Escassez', price: 'Alto' },
];

const routePrices = [
  { id: 1, from: 'Huambo', to: 'Luanda', price: '450.000 Kz', time: '12h', profit: 'Alta', trend: 'up' },
  { id: 2, from: 'Bié', to: 'Luanda', price: '520.000 Kz', time: '14h', profit: 'Média', trend: 'stable' },
  { id: 3, from: 'Malanje', to: 'Luanda', price: '380.000 Kz', time: '8h', profit: 'Alta', trend: 'down' },
  { id: 4, from: 'Uíge', to: 'Luanda', price: '410.000 Kz', time: '10h', profit: 'Média', trend: 'up' },
];

const forecastData = [
  { day: 'Hoje', price: 460 },
  { day: '+7d', price: 485 },
  { day: '+15d', price: 510 },
  { day: '+30d', price: 530 },
];

const demandByProduct = [
  { name: 'Milho', value: 45, color: '#10b981' },
  { name: 'Mandioca', value: 25, color: '#3b82f6' },
  { name: 'Feijão', value: 15, color: '#f59e0b' },
  { name: 'Soja', value: 10, color: '#ef4444' },
  { name: 'Outros', value: 5, color: '#64748b' },
];

export default function PriceDemand() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'supply-demand', label: 'Oferta vs Demanda', icon: Scale },
    { id: 'routes', label: 'Rotas', icon: Truck },
    { id: 'trends', label: 'Tendências', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Coins className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Preços & Demanda</h2>
          </div>
          <p className="text-gray-500 text-sm font-medium">Análise de custos logísticos, equilíbrio de mercado e oportunidades de negócio.</p>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex bg-gray-100 p-1.5 rounded-[1.5rem] border border-gray-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "h-auto whitespace-nowrap rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-white text-[#16a34a] shadow-sm" 
                : "text-gray-400 hover:text-gray-600"
            )}
            variant="ghost"
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Button>
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
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'supply-demand' && <SupplyDemandTab />}
          {activeTab === 'routes' && <RoutesTab />}
          {activeTab === 'trends' && <TrendsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Preço Médio / Km', value: '420 Kz', trend: '+12%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Preço Médio / Ton', value: '15.400 Kz', trend: '+5.2%', icon: Coins, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Variação (30d)', value: '+8.4%', trend: 'Alta', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Região Mais Cara', value: 'Luanda', trend: '850 Kz/km', icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className={cn("p-3 rounded-2xl w-fit mb-4", kpi.bg)}>
              <kpi.icon className={cn("w-6 h-6", kpi.color)} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-gray-900">{kpi.value}</h3>
              <span className={cn("text-[10px] font-bold", kpi.trend.startsWith('+') ? "text-rose-600" : "text-emerald-600")}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Price Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Evolução do Preço de Frete
            </h3>
            <Select className="border-none bg-gray-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest shadow-none focus-visible:ring-2 focus-visible:ring-emerald-500">
              <option>Últimos 6 Meses</option>
              <option>Último Ano</option>
            </Select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceHistory}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights & Alerts */}
        <div className="space-y-6">
          <div className="bg-[#052e16] p-8 rounded-[2.5rem] text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-6 h-6 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Insight de Mercado</h4>
              </div>
              <p className="text-sm font-bold leading-relaxed mb-6">
                "Preço de frete subiu 12% em Luanda devido à alta demanda. Oportunidade de frete premium em Benguela."
              </p>
              <Button className="h-auto w-full rounded-xl py-3 text-[10px] font-black uppercase tracking-widest">
                Ver Detalhes
              </Button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Alertas Ativos
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-2xl border border-rose-100">
                <div className="p-2 bg-white rounded-lg">
                  <TrendingUp className="w-3 h-3 text-rose-600" />
                </div>
                <p className="text-[10px] font-bold text-rose-900">Alta demanda crítica em Luanda</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="p-2 bg-white rounded-lg">
                  <TrendingDown className="w-3 h-3 text-emerald-600" />
                </div>
                <p className="text-[10px] font-bold text-emerald-900">Queda de preço no Huambo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupplyDemandTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Equilíbrio de Mercado por Região</h3>
            <p className="text-xs text-gray-500 font-medium">Análise de escassez vs excesso de oferta</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-gray-500 uppercase">Oferta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-[10px] font-bold text-gray-500 uppercase">Demanda</span>
            </div>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={supplyDemandByRegion} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{fill: '#1e293b', fontSize: 12, fontWeight: 800}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="supply" fill="#10b981" radius={[10, 10, 0, 0]} barSize={40} />
              <Bar dataKey="demand" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6">Status Regional</h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-50 hover:bg-transparent">
                  <TableHead className="pb-4">Região</TableHead>
                  <TableHead className="pb-4">Status</TableHead>
                  <TableHead className="pb-4">Preço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-50">
                {supplyDemandByRegion.map((row, i) => (
                  <TableRow key={i} className="group transition-all hover:bg-gray-50">
                    <TableCell className="py-4 text-xs font-bold text-gray-900">{row.region}</TableCell>
                    <TableCell className="py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider",
                        row.status === 'Escassez' ? "bg-rose-100 text-rose-700" : 
                        row.status === 'Excesso' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-xs font-bold text-gray-600">{row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6">Demanda por Produto</h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandByProduct} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#1e293b', fontSize: 12, fontWeight: 700}} width={100} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                  {demandByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoutesTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-8">Análise de Rotas e Rentabilidade</h3>
          <div className="space-y-4">
            {routePrices.map((route) => (
              <div key={route.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-emerald-200 transition-all group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      <Truck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-gray-900">{route.from}</span>
                        <ArrowRightLeft className="w-3 h-3 text-gray-400" />
                        <span className="text-sm font-black text-gray-900">{route.to}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                          <Clock className="w-3 h-3" /> {route.time}
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                          route.profit === 'Alta' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          Rentabilidade {route.profit}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900">{route.price}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      {route.trend === 'up' ? <TrendingUp className="w-3 h-3 text-rose-500" /> : 
                       route.trend === 'down' ? <TrendingDown className="w-3 h-3 text-emerald-500" /> : 
                       <Activity className="w-3 h-3 text-gray-400" />}
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tendência</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#052e16] p-8 rounded-[2.5rem] text-white">
            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">Insight de Rota</h4>
            <p className="text-sm leading-relaxed mb-6">
              "A rota Bié → Luanda está com custo 15% acima da média, porém o tempo de trânsito reduziu em 2h devido a melhorias na EN230."
            </p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-emerald-400 uppercase mb-2">Recomendação</p>
              <p className="text-xs font-bold">Priorizar cargas de alto valor perecível nesta rota.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Previsão de Preços (ML)</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
              <Brain className="w-3 h-3" /> IA Preditiva Ativa
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
            <p className="text-sm font-bold text-emerald-900 leading-relaxed">
              "Nossa IA prevê um aumento de 15% nos preços de frete nas próximas 3 semanas devido ao início da colheita de milho no Planalto Central."
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6">Dinâmica de Mercado</h4>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Relação Oferta/Preço</span>
                <span className="text-xs font-black text-rose-600">Inversa</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-[85%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Sazonalidade</span>
                <span className="text-xs font-black text-emerald-600">Alta</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[70%]" />
              </div>
            </div>
            <div className="pt-6 border-t border-gray-50">
              <h5 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4">Próximos Eventos</h5>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <p className="text-[10px] font-bold text-gray-600">Início Colheita Milho (15 dias)</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <p className="text-[10px] font-bold text-gray-600">Aumento Demanda Luanda (7 dias)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
