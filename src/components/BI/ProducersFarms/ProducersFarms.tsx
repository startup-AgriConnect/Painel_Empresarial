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
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Select } from '../../ui/select';

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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="py-0">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                      <Users className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-success">
                      <ArrowUpRight className="w-3 h-3" /> +12
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">Total de Produtores</p>
                  <h3 className="text-2xl font-semibold text-foreground tracking-tight">1,284</h3>
                </CardContent>
              </Card>
              <Card className="py-0">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                      <Package className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-success">
                      <ArrowUpRight className="w-3 h-3" /> +5.4%
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">Volume Total Estimado</p>
                  <h3 className="text-2xl font-semibold text-foreground tracking-tight">45.2kt</h3>
                </CardContent>
              </Card>
              <Card className="py-0">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                      <ShieldCheck className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-info">
                      Confiança Alta
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">Score Médio de Confiança</p>
                  <h3 className="text-2xl font-semibold text-foreground tracking-tight">84/100</h3>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-8 py-0 overflow-hidden h-[400px] relative">
                <div className="absolute inset-0 bg-muted/30 flex items-center justify-center gap-2">
                  <MapPin className="w-12 h-12 text-muted-foreground opacity-30" />
                  <p className="text-muted-foreground font-medium">Preview do Mapa de Produção</p>
                </div>
                <div className="absolute top-4 left-4 bg-card/90 backdrop-blur p-3 rounded-md border border-border shadow-sm z-10">
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Concentração</h4>
                  <p className="text-sm font-medium text-foreground">Alta concentração no Huambo</p>
                </div>
              </Card>
              <div className="lg:col-span-4 space-y-4">
                <Card className="py-0">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-muted-foreground" />
                      <h3 className="text-xs font-medium text-muted-foreground">Matching IA</h3>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed mb-4">3 novos produtores no Bié atendem aos seus critérios de qualidade e volume.</p>
                    <Button
                      onClick={() => setIsDrawerOpen(true)}
                      size="sm"
                      className="w-full"
                    >
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
                <Card className="py-0">
                  <CardContent className="p-5">
                    <h4 className="text-xs font-medium text-muted-foreground mb-3">Alertas de Risco</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="size-8 bg-warning/15 rounded-md flex items-center justify-center text-warning shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <p className="text-xs text-foreground">Baixa atividade logística detectada em Benguela.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      case 'list':
        return (
          <Card className="py-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-5 border-b border-border space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <h3 className="text-base font-semibold text-foreground tracking-tight">Base de Dados de Produtores</h3>
                  <div className="relative w-full lg:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Filtrar por nome ou ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 bg-background border border-input rounded-md text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Tipo</Label>
                    <Select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full text-sm"
                    >
                      {types.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Província</Label>
                    <Select
                      value={filterProvince}
                      onChange={(e) => {
                        setFilterProvince(e.target.value);
                        setFilterMunicipality('Todos');
                        setFilterCommune('Todas');
                      }}
                      className="w-full text-sm"
                    >
                      {provinces.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Município</Label>
                    <Select
                      value={filterMunicipality}
                      onChange={(e) => {
                        setFilterMunicipality(e.target.value);
                        setFilterCommune('Todas');
                      }}
                      disabled={filterProvince === 'Todas'}
                      className="w-full text-sm disabled:opacity-50"
                    >
                      <option value="Todos">Todos</option>
                      {filterProvince !== 'Todas' && municipalitiesByProvince[filterProvince].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Comuna</Label>
                    <Select
                      value={filterCommune}
                      onChange={(e) => setFilterCommune(e.target.value)}
                      disabled={filterMunicipality === 'Todos'}
                      className="w-full text-sm disabled:opacity-50"
                    >
                      <option value="Todas">Todas</option>
                      {filterMunicipality !== 'Todos' && communesByMunicipality[filterMunicipality]?.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Cultura</Label>
                    <Select
                      value={filterCulture}
                      onChange={(e) => setFilterCulture(e.target.value)}
                      className="w-full text-sm"
                    >
                      {cultures.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">ID/Nome</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Localização</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Cultura Principal</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Volume Est.</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Fretes</th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredProducers.length > 0 ? (
                      filteredProducers.map(p => (
                        <tr key={p.id} className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedProducer(p)}>
                          <td className="px-5 py-3">
                            <p className="font-medium text-foreground text-sm">{maskData(p.name, user?.role)}</p>
                            <p className="text-xs text-muted-foreground">{p.id}</p>
                          </td>
                          <td className="px-5 py-3 text-xs text-muted-foreground">{p.location}</td>
                          <td className="px-5 py-3">
                            <Badge variant="success">{p.product}</Badge>
                          </td>
                          <td className="px-5 py-3 text-sm font-medium text-foreground">{p.volume}</td>
                          <td className="px-5 py-3 text-sm font-medium text-foreground">{p.freights}</td>
                          <td className="px-5 py-3 text-right">
                            <Badge variant={p.score > 90 ? "success" : "info"}>{p.score}/100</Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center">
                          <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                          <p className="text-foreground font-medium">Nenhum produtor encontrado com os filtros selecionados.</p>
                          <Button
                            onClick={() => {
                              setSearchQuery('');
                              setFilterType('Todos');
                              setFilterProvince('Todas');
                              setFilterMunicipality('Todos');
                              setFilterCommune('Todas');
                              setFilterCulture('Todas');
                            }}
                            variant="link"
                            size="sm"
                            className="mt-3"
                          >
                            Limpar Filtros
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      case 'scores':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="py-0">
                <CardContent className="p-6">
                  <h3 className="text-base font-semibold text-foreground tracking-tight mb-4">Ranking de Confiabilidade</h3>
                  <div className="space-y-2">
                    {producersData.sort((a,b) => b.score - a.score).map((p, i) => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md border border-border">
                        <div className="flex items-center gap-3">
                          <span className="text-base font-semibold text-muted-foreground w-6">0{i+1}</span>
                          <div>
                            <p className="font-medium text-foreground text-sm">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-semibold text-foreground">{p.score}</p>
                          <p className="text-xs text-muted-foreground">Pontos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="py-0">
                <CardContent className="p-6">
                  <h3 className="text-base font-semibold text-foreground tracking-tight mb-4">Critérios do Score</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Regularidade', desc: 'Frequência constante de produção e oferta.', weight: '35%' },
                      { label: 'Volume', desc: 'Capacidade de escala e entrega de grandes lotes.', weight: '25%' },
                      { label: 'Cumprimento', desc: 'Histórico de pontualidade e integridade da carga.', weight: '30%' },
                      { label: 'Histórico', desc: 'Tempo de atividade na plataforma AgriConnect.', weight: '10%' },
                    ].map(c => (
                      <div key={c.label} className="flex items-start gap-3">
                        <div className="size-10 bg-muted rounded-md flex items-center justify-center text-foreground font-medium text-xs shrink-0">{c.weight}</div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{c.label}</p>
                          <p className="text-xs text-muted-foreground">{c.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-3 bg-muted rounded-md border border-border">
                    <p className="text-xs italic text-muted-foreground">"O Score AgriConnect é utilizado por bancos para facilitar o acesso ao crédito agrícola."</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'activity':
        return (
          <div className="space-y-6">
            <Card className="py-0">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <h3 className="text-base font-semibold text-foreground tracking-tight">Filtros de Atividade</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Activity className="w-3.5 h-3.5" /> Monitoramento em Tempo Real
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Tipo</Label>
                    <Select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full text-sm"
                    >
                      {types.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Província</Label>
                    <Select
                      value={filterProvince}
                      onChange={(e) => {
                        setFilterProvince(e.target.value);
                        setFilterMunicipality('Todos');
                        setFilterCommune('Todas');
                      }}
                      className="w-full text-sm"
                    >
                      {provinces.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Município</Label>
                    <Select
                      value={filterMunicipality}
                      onChange={(e) => {
                        setFilterMunicipality(e.target.value);
                        setFilterCommune('Todas');
                      }}
                      disabled={filterProvince === 'Todas'}
                      className="w-full text-sm disabled:opacity-50"
                    >
                      <option value="Todos">Todos</option>
                      {filterProvince !== 'Todas' && municipalitiesByProvince[filterProvince].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Comuna</Label>
                    <Select
                      value={filterCommune}
                      onChange={(e) => setFilterCommune(e.target.value)}
                      disabled={filterMunicipality === 'Todos'}
                      className="w-full text-sm disabled:opacity-50"
                    >
                      <option value="Todas">Todas</option>
                      {filterMunicipality !== 'Todos' && communesByMunicipality[filterMunicipality]?.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Cultura</Label>
                    <Select
                      value={filterCulture}
                      onChange={(e) => setFilterCulture(e.target.value)}
                      className="w-full text-sm"
                    >
                      {cultures.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="py-0">
              <CardContent className="p-6">
                <h3 className="text-base font-semibold text-foreground tracking-tight mb-4">Fluxo Logístico dos Produtores</h3>
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
                          <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                      <Area type="monotone" dataKey="value" stroke="var(--foreground)" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-md border border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Média de Fretes</p>
                    <p className="text-lg font-semibold text-foreground tracking-tight">12.4 / dia</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-md border border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Rotas Ativas</p>
                    <p className="text-lg font-semibold text-foreground tracking-tight">48 rotas</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-md border border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Conectividade Hubs</p>
                    <p className="text-lg font-semibold text-foreground tracking-tight">82%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'predictions':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-8 py-0">
                <CardContent className="p-6">
                  <h3 className="text-base font-semibold text-foreground tracking-tight mb-4">Previsão de Produção Futura</h3>
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
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                        <Line type="monotone" dataKey="real" stroke="var(--foreground)" strokeWidth={2} dot={{ r: 4, fill: 'var(--foreground)' }} />
                        <Line type="monotone" dataKey="prev" stroke="var(--chart-1)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-4 bg-success/10 rounded-md border border-border">
                    <div className="flex items-center gap-2 text-success font-medium text-sm">
                      <Info className="w-4 h-4" /> Tendência de crescimento de 15% para o próximo trimestre.
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="lg:col-span-4 space-y-4">
                <Card className="py-0">
                  <CardContent className="p-5">
                    <h4 className="text-xs font-medium text-muted-foreground mb-4">Segmentação de Produtores</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Grande Porte', count: 124, color: 'var(--chart-1)' },
                        { label: 'Médio Porte', count: 456, color: 'var(--chart-2)' },
                        { label: 'Pequeno Porte', count: 704, color: 'var(--chart-3)' },
                      ].map(s => (
                        <div key={s.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                            <span className="text-sm text-foreground">{s.label}</span>
                          </div>
                          <span className="text-sm font-medium text-foreground">{s.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="py-0">
                  <CardContent className="p-5">
                    <h4 className="text-xs font-medium text-muted-foreground mb-3">Produtores em Risco</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-destructive/10 rounded-md border border-border flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <p className="text-xs text-foreground">12 produtores com queda brusca de atividade no Huambo.</p>
                      </div>
                      <div className="p-3 bg-warning/15 rounded-md border border-border flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        <p className="text-xs text-foreground">8 produtores isolados logisticamente no Bié.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Produtores / Fazendas</h2>
          <p className="text-sm text-muted-foreground">Inteligência de Origem: Quem produz, onde e com que confiabilidade.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="inline-flex items-center gap-1 rounded-md bg-muted p-1 overflow-x-auto no-scrollbar">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <Button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 whitespace-nowrap rounded-sm px-3 text-xs font-medium",
                isActive
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </Button>
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
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-card shadow-md z-[2001] overflow-y-auto no-scrollbar border-l border-border"
            >
              <div className="relative">
                <div className="bg-muted/50 p-6 pt-8 relative overflow-hidden border-b border-border">
                  <Button
                    onClick={() => setSelectedProducer(null)}
                    size="icon"
                    variant="ghost"
                    className="absolute top-4 right-4 z-20"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Tractor className="absolute -right-8 -bottom-8 w-48 h-48 opacity-5 text-foreground" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="size-16 bg-card rounded-md flex items-center justify-center text-foreground border border-border">
                        <Tractor className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold tracking-tight text-foreground leading-tight">{maskData(selectedProducer.name, user?.role)}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                            <MapPin className="w-3.5 h-3.5" /> {selectedProducer.location}
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                            <User className="w-3.5 h-3.5" /> {maskData(selectedProducer.responsible, user?.role)}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                            <Phone className="w-3 h-3" /> {maskData(selectedProducer.phone, user?.role)}
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                            <Mail className="w-3 h-3" /> {maskData(selectedProducer.email, user?.role)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-card p-3 rounded-md border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Score</p>
                        <p className="text-xl font-semibold text-foreground tracking-tight">{selectedProducer.score}</p>
                      </div>
                      <div className="bg-card p-3 rounded-md border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Volume</p>
                        <p className="text-xl font-semibold text-foreground tracking-tight">{selectedProducer.volume}</p>
                      </div>
                      <div className="bg-card p-3 rounded-md border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Fretes</p>
                        <p className="text-xl font-semibold text-foreground tracking-tight">{selectedProducer.freights}</p>
                      </div>
                      <div className="bg-card p-3 rounded-md border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                        <p className="text-xl font-semibold text-foreground tracking-tight">{selectedProducer.status}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-md border border-border">
                      <h5 className="text-xs font-medium text-muted-foreground mb-3">Culturas Cultivadas</h5>
                      <div className="flex flex-wrap gap-2">
                        {['Milho', 'Feijão', 'Soja'].map(c => (
                          <Badge key={c} variant="outline">{c}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-md border border-border">
                      <h5 className="text-xs font-medium text-muted-foreground mb-3">Frequência de Atividade</h5>
                      <p className="text-sm font-medium text-foreground">Média de 4.5 transportes/mês</p>
                      <p className="text-xs text-muted-foreground mt-1">Consistência de entrega: 98%</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-semibold text-foreground tracking-tight mb-3">Histórico de Produção</h4>
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
                              <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                          <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                          <Area type="monotone" dataKey="value" stroke="var(--muted-foreground)" strokeWidth={2} fillOpacity={1} fill="url(#colorProfile)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <Card className="py-0">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <Brain className="w-5 h-5 text-muted-foreground" />
                        <h3 className="text-base font-semibold text-foreground tracking-tight">Análise de Matching IA</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Este produtor possui uma correlação de 94% com suas necessidades logísticas atuais.
                        A regularidade de entrega nos últimos 6 meses é superior à média regional.
                      </p>
                      <Button size="sm" className="w-full">
                        Gerar Relatório de Due Diligence
                      </Button>
                    </CardContent>
                  </Card>
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
              className="fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-md z-[2001] overflow-y-auto no-scrollbar border-l border-border"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                      <Brain className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground tracking-tight">Matching Estratégico</h3>
                      <p className="text-xs text-muted-foreground">Inteligência de Origem</p>
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
                    <h4 className="text-xs font-medium text-muted-foreground mb-3">Produtores Recomendados</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Fazenda Boa Vista', region: 'Bié', match: '98%', reason: 'Volume e Qualidade' },
                        { name: 'Cooperativa Agrícola', region: 'Huambo', match: '94%', reason: 'Logística Facilitada' },
                      ].map((m, i) => (
                        <div key={i} className="p-4 bg-muted/50 rounded-md border border-border">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">{m.name}</span>
                            <Badge variant="success">{m.match} MATCH</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{m.region}</p>
                          <p className="text-xs text-foreground leading-relaxed">
                            Recomendado por: {m.reason}. Histórico de 100% de cumprimento de prazos.
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-medium text-muted-foreground mb-3">Análise de Clima Local</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-info/10 rounded-md border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <CloudRain className="w-4 h-4 text-info" />
                          <span className="text-xs font-medium text-muted-foreground">Chuva</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground tracking-tight">8mm</p>
                        <p className="text-xs text-info mt-1">Favorável</p>
                      </div>
                      <div className="p-4 bg-destructive/10 rounded-md border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Thermometer className="w-4 h-4 text-destructive" />
                          <span className="text-xs font-medium text-muted-foreground">Temp</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground tracking-tight">24°C</p>
                        <p className="text-xs text-destructive mt-1">Estável</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-medium text-muted-foreground mb-3">Insights de Mercado</h4>
                    <Card className="py-0">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">Oportunidade</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          A concentração de produtores no Huambo sugere a criação de um hub logístico temporário para reduzir custos de consolidação em 18%.
                        </p>
                      </CardContent>
                    </Card>
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
