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
  LayoutDashboard,
  Users,
  Tractor,
  ShieldCheck,
  Filter,
  Search,
  ChevronRight,
  Info,
  AlertTriangle,
  Star,
  Box,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { cn, maskData } from '../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../../context/AuthContext';

const producersData = [
  { id: 'P001', name: 'Fazenda Esperança', location: 'Huambo, Caála', product: 'Milho', volume: '1,200t', freights: 45, score: 92, type: 'Grande', status: 'Ativo', phone: '+244 923 000 111', email: 'contato@esperanca.ao', responsible: 'Manuel Gonçalves' },
  { id: 'P002', name: 'Cooperativa Agrícola Bié', location: 'Bié, Cuito', product: 'Feijão', volume: '850t', freights: 32, score: 88, type: 'Médio', status: 'Ativo', phone: '+244 931 222 333', email: 'geral@coopbie.ao', responsible: 'Maria Antónia' },
  { id: 'P003', name: 'Produtor João Silva', location: 'Benguela, Ganda', product: 'Batata Doce', volume: '120t', freights: 12, score: 75, type: 'Pequeno', status: 'Risco', phone: '+244 945 444 555', email: 'joao.silva@agromail.ao', responsible: 'João Silva' },
  { id: 'P004', name: 'Agro-Industrial Malanje', location: 'Malanje, Cacuso', product: 'Mandioca', volume: '2,500t', freights: 88, score: 95, type: 'Grande', status: 'Ativo', phone: '+244 912 666 777', email: 'admin@agroindustrial.ao', responsible: 'Carlos Mendes' },
  { id: 'P005', name: 'Fazenda Vale do Kwanza', location: 'Uíge, Negage', product: 'Café', volume: '450t', freights: 25, score: 82, type: 'Médio', status: 'Ativo', phone: '+244 928 888 999', email: 'valekwanza@cafe.ao', responsible: 'Ana Paula' },
  { id: 'P006', name: 'Horta Comunitária Huíla', location: 'Huíla, Lubango', product: 'Hortícolas', volume: '80t', freights: 15, score: 68, type: 'Pequeno', status: 'Atenção', phone: '+244 933 111 222', email: 'horta.huila@comunidade.ao', responsible: 'Pedro Santos' },
];

export default function ProducersFarms() {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [selectedProducer, setSelectedProducer] = useState<any>(null);
  const [is3D, setIs3D] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('Todos');
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
  const types = ['Todos', 'Pequeno', 'Médio', 'Grande'];

  const filteredProducers = producersData.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'Todos' || p.type === filterType;
    const matchesProvince = filterProvince === 'Todas' || p.location.includes(filterProvince);
    const matchesMunicipality = filterMunicipality === 'Todos' || p.location.includes(filterMunicipality);
    const matchesCommune = filterCommune === 'Todas' || p.location.includes(filterCommune);
    const matchesCulture = filterCulture === 'Todas' || p.product === filterCulture;
    
    return matchesSearch && matchesType && matchesProvince && matchesMunicipality && matchesCommune && matchesCulture;
  });

  const subTabs = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'list', label: 'Lista / Perfis', icon: Users },
    { id: 'scores', label: 'Scores', icon: Star },
    { id: 'activity', label: 'Atividade', icon: Activity },
    { id: 'predictions', label: 'Previsões', icon: Brain },
  ];

  const renderSubContent = () => {
    switch (activeSubTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total de Produtores</p>
                <h3 className="text-3xl font-black text-slate-900">1,284</h3>
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
                  <ArrowUpRight className="w-3 h-3" /> +12 este mês
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Volume Total Estimado</p>
                <h3 className="text-3xl font-black text-slate-900">45.2kt</h3>
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
                  <ArrowUpRight className="w-3 h-3" /> +5.4% vs ano anterior
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Score Médio de Confiança</p>
                <h3 className="text-3xl font-black text-slate-900">84/100</h3>
                <div className="flex items-center gap-1 text-blue-600 text-xs font-bold mt-2">
                  <ShieldCheck className="w-3 h-3" /> Nível de Confiança Alto
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden h-[400px] relative">
                <div className="absolute inset-0 bg-emerald-50/30 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-emerald-600 opacity-20" />
                  <p className="text-emerald-950 font-bold opacity-40">Preview do Mapa de Produção</p>
                </div>
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur p-4 rounded-2xl border border-emerald-100 shadow-lg z-10">
                  <h4 className="text-xs font-black uppercase tracking-widest text-emerald-900 mb-2">Concentração</h4>
                  <p className="text-sm font-bold text-emerald-600">Alta concentração no Huambo</p>
                </div>
              </div>
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#0a2e24] text-white p-6 rounded-3xl shadow-lg border border-emerald-900/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-6 h-6 text-emerald-400" />
                    <h3 className="font-bold uppercase tracking-tight">Matching IA</h3>
                  </div>
                  <p className="text-sm text-emerald-100/80 mb-4">3 novos produtores no Bié atendem aos seus critérios de qualidade e volume.</p>
                  <button 
                    onClick={() => setIsDrawerOpen(true)}
                    className="w-full py-3 bg-emerald-500 text-emerald-950 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-emerald-400 transition-all shadow-md shadow-emerald-900/20"
                  >
                    Ver Detalhes
                  </button>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Alertas de Risco</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-900">Baixa atividade logística detectada em Benguela.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <h3 className="font-bold text-slate-900 uppercase tracking-tight">Base de Dados de Produtores</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Filtrar por nome ou ID..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-full lg:w-64 focus:ring-2 focus:ring-emerald-500 transition-all" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo</label>
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full bg-slate-50 border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:ring-emerald-500"
                  >
                    {types.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">ID/Nome</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Localização</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Cultura Principal</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Volume Est.</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Fretes</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducers.length > 0 ? (
                    filteredProducers.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedProducer(p)}>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 text-sm">{maskData(p.name, user?.role)}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{p.id}</p>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-600">{p.location}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold uppercase">{p.product}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{p.volume}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{p.freights}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={cn(
                            "px-2 py-1 rounded text-[10px] font-black",
                            p.score > 90 ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                          )}>{p.score}/100</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-900 font-bold">Nenhum produtor encontrado com os filtros selecionados.</p>
                        <button 
                          onClick={() => {
                            setSearchQuery('');
                            setFilterType('Todos');
                            setFilterProvince('Todas');
                            setFilterMunicipality('Todos');
                            setFilterCommune('Todas');
                            setFilterCulture('Todas');
                          }}
                          className="mt-4 text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline"
                        >
                          Limpar Filtros
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'scores':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm">
                <h3 className="font-bold text-emerald-950 uppercase tracking-tight mb-6">Ranking de Confiabilidade</h3>
                <div className="space-y-4">
                  {producersData.sort((a,b) => b.score - a.score).map((p, i) => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-black text-emerald-200 w-6">0{i+1}</span>
                        <div>
                          <p className="font-bold text-emerald-950 text-sm">{p.name}</p>
                          <p className="text-[10px] text-emerald-500 font-bold uppercase">{p.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-emerald-600">{p.score}</p>
                        <p className="text-[8px] font-bold text-emerald-400 uppercase">Pontos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-900 p-8 rounded-3xl shadow-xl text-white">
                <h3 className="font-bold uppercase tracking-tight mb-6">Critérios do Score</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Regularidade', desc: 'Frequência constante de produção e oferta.', weight: '35%' },
                    { label: 'Volume', desc: 'Capacidade de escala e entrega de grandes lotes.', weight: '25%' },
                    { label: 'Cumprimento', desc: 'Histórico de pontualidade e integridade da carga.', weight: '30%' },
                    { label: 'Histórico', desc: 'Tempo de atividade na plataforma AgriConnect.', weight: '10%' },
                  ].map(c => (
                    <div key={c.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 font-black text-xs shrink-0">{c.weight}</div>
                      <div>
                        <p className="font-bold text-sm">{c.label}</p>
                        <p className="text-xs text-emerald-400">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-xs italic text-emerald-200">"O Score AgriConnect é utilizado por bancos para facilitar o acesso ao crédito agrícola."</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'activity':
        return (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <h3 className="font-bold text-slate-900 uppercase tracking-tight">Filtros de Atividade</h3>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                  <Activity className="w-3 h-3" /> Monitoramento em Tempo Real
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo</label>
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full bg-slate-50 border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:ring-emerald-500"
                  >
                    {types.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                
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

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 uppercase tracking-tight mb-6">Fluxo Logístico dos Produtores</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'Sem 1', value: 400 },
                    { name: 'Sem 2', value: 300 },
                    { name: 'Sem 3', value: 600 },
                    { name: 'Sem 4', value: 800 },
                    { name: 'Sem 5', value: 500 },
                    { name: 'Sem 6', value: 900 },
                  ]}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#064e3b', fontSize: 12, fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#064e3b', fontSize: 12, fontWeight: 600 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-emerald-50 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Média de Fretes</p>
                  <p className="text-xl font-black text-emerald-950">12.4 / dia</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Rotas Ativas</p>
                  <p className="text-xl font-black text-emerald-950">48 rotas</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Conectividade Hubs</p>
                  <p className="text-xl font-black text-emerald-950">82%</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'predictions':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm">
                <h3 className="font-bold text-emerald-950 uppercase tracking-tight mb-6">Previsão de Produção Futura</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { name: 'Abr', real: 4000, prev: 4000 },
                      { name: 'Mai', real: 4500, prev: 4500 },
                      { name: 'Jun', real: 4200, prev: 4200 },
                      { name: 'Jul', prev: 4800 },
                      { name: 'Ago', prev: 5200 },
                      { name: 'Set', prev: 5800 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0fdf4" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#064e3b', fontSize: 12, fontWeight: 600 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#064e3b', fontSize: 12, fontWeight: 600 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="real" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981' }} />
                      <Line type="monotone" dataKey="prev" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <Info className="w-4 h-4" /> Tendência de crescimento de 15% para o próximo trimestre.
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-emerald-900 p-6 rounded-3xl text-white shadow-xl">
                  <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">Segmentação de Produtores</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Grande Porte', count: 124, color: 'bg-emerald-400' },
                      { label: 'Médio Porte', count: 456, color: 'bg-emerald-500' },
                      { label: 'Pequeno Porte', count: 704, color: 'bg-emerald-600' },
                    ].map(s => (
                      <div key={s.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", s.color)} />
                          <span className="text-sm font-bold">{s.label}</span>
                        </div>
                        <span className="text-sm font-black">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
                  <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">Produtores em Risco</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <p className="text-[10px] font-bold text-red-900">12 produtores com queda brusca de atividade no Huambo.</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <p className="text-[10px] font-bold text-amber-900">8 produtores isolados logisticamente no Bié.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">Produtores / Fazendas</h2>
          <p className="text-slate-500 font-medium">Inteligência de Origem: Quem produz, onde e com que confiabilidade.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar - Matching the image style */}
      <div className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                isActive 
                  ? "bg-white text-emerald-600 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-200" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? "text-emerald-600" : "text-slate-400")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderSubContent()}
        </motion.div>
      </AnimatePresence>

      {/* Detail Side Panel Overlay */}
      <AnimatePresence>
        {selectedProducer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProducer(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[2000]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[2001] overflow-y-auto no-scrollbar border-l border-gray-100"
            >
              <div className="relative">
                <button 
                  onClick={() => setSelectedProducer(null)}
                  className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 rounded-xl transition-all z-20 text-white"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="bg-[#0a2e24] p-8 pt-12 text-white relative overflow-hidden">
                  <Tractor className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-emerald-400 border border-white/20">
                        <Tractor className="w-10 h-10" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-black uppercase tracking-tight leading-tight">{maskData(selectedProducer.name, user?.role)}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                          <div className="flex items-center gap-1.5 text-emerald-400/80 text-xs font-bold">
                            <MapPin className="w-3.5 h-3.5" /> {selectedProducer.location}
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-400/80 text-xs font-bold">
                            <User className="w-3.5 h-3.5" /> {maskData(selectedProducer.responsible, user?.role)}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <div className="flex items-center gap-1.5 text-emerald-300/60 text-[11px] font-bold">
                            <Phone className="w-3 h-3" /> {maskData(selectedProducer.phone, user?.role)}
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-300/60 text-[11px] font-bold">
                            <Mail className="w-3 h-3" /> {maskData(selectedProducer.email, user?.role)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-bold text-emerald-400/80 uppercase mb-1">Score</p>
                        <p className="text-2xl font-black">{selectedProducer.score}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-bold text-emerald-400/80 uppercase mb-1">Volume</p>
                        <p className="text-2xl font-black">{selectedProducer.volume}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-bold text-emerald-400/80 uppercase mb-1">Fretes</p>
                        <p className="text-2xl font-black">{selectedProducer.freights}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-bold text-emerald-400/80 uppercase mb-1">Status</p>
                        <p className="text-2xl font-black">{selectedProducer.status}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <h5 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Culturas Cultivadas</h5>
                      <div className="flex flex-wrap gap-2">
                        {['Milho', 'Feijão', 'Soja'].map(c => (
                          <span key={c} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 uppercase">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <h5 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Frequência de Atividade</h5>
                      <p className="text-sm font-bold text-slate-900">Média de 4.5 transportes/mês</p>
                      <p className="text-[10px] text-slate-500 mt-1">Consistência de entrega: 98%</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-tight mb-4">Histórico de Produção</h4>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Jan', value: 400 },
                          { name: 'Fev', value: 300 },
                          { name: 'Mar', value: 600 },
                          { name: 'Abr', value: 800 },
                          { name: 'Mai', value: 500 },
                          { name: 'Jun', value: 900 },
                        ]}>
                          <defs>
                            <linearGradient id="colorProfile" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#64748b" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                          <Tooltip />
                          <Area type="monotone" dataKey="value" stroke="#64748b" strokeWidth={3} fillOpacity={1} fill="url(#colorProfile)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-[#0a2e24] text-white p-6 rounded-3xl shadow-lg border border-emerald-900/50">
                    <div className="flex items-center gap-3 mb-4">
                      <Brain className="w-6 h-6 text-emerald-400" />
                      <h3 className="font-bold uppercase tracking-tight">Análise de Matching IA</h3>
                    </div>
                    <p className="text-sm text-emerald-100/80 mb-4">
                      Este produtor possui uma correlação de 94% com suas necessidades logísticas atuais. 
                      A regularidade de entrega nos últimos 6 meses é superior à média regional.
                    </p>
                    <button className="w-full py-3 bg-emerald-500 text-emerald-950 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-emerald-400 transition-all shadow-md shadow-emerald-900/20">
                      Gerar Relatório de Due Diligence
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

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
                      <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Matching Estratégico</h3>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Inteligência de Origem</p>
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
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Produtores Recomendados</h4>
                    <div className="space-y-4">
                      {[
                        { name: 'Fazenda Boa Vista', region: 'Bié', match: '98%', reason: 'Volume e Qualidade' },
                        { name: 'Cooperativa Agrícola', region: 'Huambo', match: '94%', reason: 'Logística Facilitada' },
                      ].map((m, i) => (
                        <div key={i} className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black text-emerald-900 uppercase">{m.name}</span>
                            <span className="px-2 py-0.5 bg-emerald-200 text-emerald-700 rounded text-[9px] font-black">{m.match} MATCH</span>
                          </div>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">{m.region}</p>
                          <p className="text-xs text-emerald-700 leading-relaxed">
                            Recomendado por: {m.reason}. Histórico de 100% de cumprimento de prazos.
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Análise de Clima Local</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <CloudRain className="w-4 h-4 text-blue-600" />
                          <span className="text-[10px] font-bold text-blue-400 uppercase">Chuva</span>
                        </div>
                        <p className="text-xl font-black text-blue-900">8mm</p>
                        <p className="text-[9px] text-blue-600 font-bold mt-1">Favorável</p>
                      </div>
                      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Thermometer className="w-4 h-4 text-rose-600" />
                          <span className="text-[10px] font-bold text-rose-400 uppercase">Temp</span>
                        </div>
                        <p className="text-xl font-black text-rose-900">24°C</p>
                        <p className="text-[9px] text-rose-600 font-bold mt-1">Estável</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Insights de Mercado</h4>
                    <div className="p-6 bg-emerald-900 text-white rounded-[2rem] shadow-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Zap className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs font-black uppercase tracking-wider">Oportunidade</span>
                      </div>
                      <p className="text-xs text-emerald-100 leading-relaxed">
                        A concentração de produtores no Huambo sugere a criação de um hub logístico temporário para reduzir custos de consolidação em 18%.
                      </p>
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
