import React, { useState } from 'react';
import { 
  BarChart3, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Brain,
  Zap,
  ShieldAlert,
  MapPin,
  Activity,
  Leaf,
  X,
  CloudRain,
  Thermometer,
  Filter
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import FeedbackBanner from '../../Common/FeedbackBanner';

const productionTrend = [
  { day: '01', volume: 420 },
  { day: '05', volume: 450 },
  { day: '10', volume: 480 },
  { day: '15', volume: 520 },
  { day: '20', volume: 490 },
  { day: '25', volume: 580 },
  { day: '30', volume: 610 },
];

const freightPriceEvolution = [
  { month: 'Jan', price: 380 },
  { month: 'Fev', price: 400 },
  { month: 'Mar', price: 420 },
  { month: 'Abr', price: 450 },
  { month: 'Mai', price: 440 },
  { month: 'Jun', price: 460 },
];

const supplyDemandData = [
  { region: 'Luanda', supply: 120, demand: 450 },
  { region: 'Huambo', supply: 380, demand: 150 },
  { region: 'Benguela', supply: 210, demand: 380 },
  { region: 'Bié', supply: 310, demand: 120 },
  { region: 'Uíge', supply: 250, demand: 180 },
];

const StatCard = ({ title, value, change, trend, icon: Icon, unit, colorClass = "text-[#16a34a]", bgClass = "bg-[#f0fdf4]" }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
  >
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
  </motion.div>
);

export default function BIOverview() {
  const [initialLoadMs, setInitialLoadMs] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activePeriod, setActivePeriod] = useState('Hoje');

  // Filter States
  const [filterProvince, setFilterProvince] = useState('Todas');
  const [filterMunicipality, setFilterMunicipality] = useState('Todos');
  const [filterCommune, setFilterCommune] = useState('Todas');
  const [filterCulture, setFilterCulture] = useState('Todas');

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

  React.useEffect(() => {
    const start = performance.now();
    const rafId = window.requestAnimationFrame(() => {
      const elapsed = Math.round(performance.now() - start);
      setInitialLoadMs(elapsed);
      console.info(`[BI smoke] painel inicial carregado em ${elapsed} ms`);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="space-y-8">
      {initialLoadMs !== null && (
        <FeedbackBanner
          type={initialLoadMs < 1200 ? 'success' : 'info'}
          title="Smoke test de carregamento"
          message={`O painel BI inicial ficou interativo em aproximadamente ${initialLoadMs} ms nesta sessão.`}
        />
      )}

      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Visão Geral BI</h2>
          <p className="text-gray-500 text-sm font-medium">Painel estratégico de inteligência de mercado e dinâmica agrícola.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            {['Hoje', 'Semana', 'Mês'].map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                  activePeriod === period 
                    ? "bg-white text-[#16a34a] shadow-sm" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Global Filters */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <Filter className="w-3 h-3" /> Filtros Globais de Inteligência
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Província</label>
            <select 
              value={filterProvince}
              onChange={(e) => {
                setFilterProvince(e.target.value);
                setFilterMunicipality('Todos');
                setFilterCommune('Todas');
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
              value={filterMunicipality}
              onChange={(e) => {
                setFilterMunicipality(e.target.value);
                setFilterCommune('Todas');
              }}
              disabled={filterProvince === 'Todas'}
              className="w-full bg-slate-50 border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:ring-emerald-500 disabled:opacity-50"
            >
              <option value="Todos">Todos</option>
              {filterProvince !== 'Todas' && municipalitiesByProvince[filterProvince].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Comuna</label>
            <select 
              value={filterCommune}
              onChange={(e) => setFilterCommune(e.target.value)}
              disabled={filterMunicipality === 'Todos'}
              className="w-full bg-slate-50 border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:ring-emerald-500 disabled:opacity-50"
            >
              <option value="Todas">Todas</option>
              {filterMunicipality !== 'Todos' && communesByMunicipality[filterMunicipality]?.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cultura</label>
            <select 
              value={filterCulture}
              onChange={(e) => setFilterCulture(e.target.value)}
              className="w-full bg-slate-50 border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:ring-emerald-500"
            >
              {cultures.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          title="Volume no Mercado" 
          value="45.820" 
          unit="Ton"
          change="+12%" 
          trend="up" 
          icon={Package} 
        />
        <StatCard 
          title="Preço Médio Frete" 
          value="450" 
          unit="Kz/Km"
          change="+2.4%" 
          trend="up" 
          icon={DollarSign} 
        />
        <StatCard 
          title="Maior Produção" 
          value="Huambo" 
          unit="Província"
          icon={MapPin} 
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />
        <StatCard 
          title="Nível de Demanda" 
          value="Alta" 
          icon={Activity} 
          colorClass="text-rose-600"
          bgClass="bg-rose-50"
        />
        <StatCard 
          title="Risco Logístico" 
          value="Baixo" 
          icon={ShieldAlert} 
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Production Trend Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#f0fdf4] rounded-2xl">
                <TrendingUp className="w-6 h-6 text-[#16a34a]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Tendência de Produção</h3>
                <p className="text-xs text-gray-500 font-medium">Últimos 30 dias (Toneladas)</p>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productionTrend}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#16a34a" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorProd)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Freight Price Evolution */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#f0fdf4] rounded-2xl">
                <DollarSign className="w-6 h-6 text-[#16a34a]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Evolução de Preços</h3>
                <p className="text-xs text-gray-500 font-medium">Custo médio de frete por Km</p>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={freightPriceEvolution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#16a34a" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supply vs Demand */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#f0fdf4] rounded-2xl">
                <BarChart3 className="w-6 h-6 text-[#16a34a]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Oferta vs Demanda por Região</h3>
                <p className="text-xs text-gray-500 font-medium">Equilíbrio entre cargas disponíveis e veículos</p>
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplyDemandData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="region" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#1e293b', fontSize: 12, fontWeight: 800}}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right"
                  height={36}
                  formatter={(value) => <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{value === 'supply' ? 'Oferta' : 'Demanda'}</span>}
                />
                <Bar dataKey="supply" fill="#16a34a" radius={[10, 10, 0, 0]} barSize={40} />
                <Bar dataKey="demand" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insight Banner - Moved to bottom and made more compact */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#052e16] p-5 rounded-[2rem] text-[#f0fdf4] relative overflow-hidden shadow-xl border border-[#166534]/30"
      >
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-[#16a34a]/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="p-3 bg-[#16a34a]/20 rounded-2xl border border-[#16a34a]/30 shrink-0">
            <Brain className="w-7 h-7 text-[#86efac]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5 text-[#86efac]" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#86efac]">Insight Automático (IA)</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold leading-tight">
              “A produção de milho aumentou <span className="text-[#86efac]">20%</span> no Cuanza Norte — oportunidade de compra antecipada”
            </h3>
            <p className="text-[#86efac]/70 text-xs font-medium mt-1">Baseado em dados de satélite e transações recentes na plataforma.</p>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="px-5 py-2.5 bg-[#16a34a] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#15803d] transition-all shadow-lg shadow-[#16a34a]/20 whitespace-nowrap"
          >
            Ver Detalhes
          </button>
        </div>
      </motion.div>

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
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Inteligência de Mercado</p>
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
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Previsão Climática</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <CloudRain className="w-4 h-4 text-blue-600" />
                          <span className="text-[10px] font-bold text-blue-400 uppercase">Precipitação</span>
                        </div>
                        <p className="text-xl font-black text-blue-900">12mm</p>
                        <p className="text-[9px] text-blue-600 font-bold mt-1">Ideal para colheita</p>
                      </div>
                      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Thermometer className="w-4 h-4 text-rose-600" />
                          <span className="text-[10px] font-bold text-rose-400 uppercase">Temperatura</span>
                        </div>
                        <p className="text-xl font-black text-rose-900">26°C</p>
                        <p className="text-[9px] text-rose-600 font-bold mt-1">Estável</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Oportunidades Detalhadas</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <p className="text-xs font-bold text-emerald-900 mb-2 uppercase">Cuanza Norte - Milho</p>
                        <p className="text-xs text-emerald-700 leading-relaxed">
                          O aumento de 20% na produção local cria uma janela de oportunidade para aquisição com preços 15% abaixo da média de Luanda.
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <p className="text-xs font-bold text-blue-900 mb-2 uppercase">Logística de Retorno</p>
                        <p className="text-xs text-blue-700 leading-relaxed">
                          Alta disponibilidade de veículos retornando vazios de Luanda para o Huambo. Potencial de redução de 25% no custo de frete de insumos.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Tendência de Preços (Próximos 15 dias)</h4>
                    <div className="h-40 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Gráfico de Projeção IA</p>
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
