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
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Select } from '../../ui/select';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';

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

export default function BIOverview() {
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

  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Visão Geral BI</h2>
          <p className="text-sm text-muted-foreground">Painel estratégico de inteligência de mercado e dinâmica agrícola.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-md bg-muted p-1">
            {['Hoje', 'Semana', 'Mês'].map((period) => (
              <Button
                key={period}
                onClick={() => setActivePeriod(period)}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 rounded-sm px-3 text-xs font-medium",
                  activePeriod === period
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {period}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" /> Exportar
          </Button>
        </div>
      </header>

      {/* Global Filters */}
      <Card className="py-0">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Filter className="w-3.5 h-3.5" /> Filtros Globais de Inteligência
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
        />
        <StatCard
          title="Nível de Demanda"
          value="Alta"
          icon={Activity}
        />
        <StatCard
          title="Risco Logístico"
          value="Baixo"
          icon={ShieldAlert}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Trend Chart */}
        <Card className="py-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <TrendingUp className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground tracking-tight">Tendência de Produção</h3>
                  <p className="text-xs text-muted-foreground">Últimos 30 dias (Toneladas)</p>
                </div>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productionTrend}>
                  <defs>
                    <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: 'var(--muted-foreground)', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: 'var(--muted-foreground)', fontSize: 12}}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--popover)',
                      color: 'var(--popover-foreground)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="var(--foreground)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProd)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Freight Price Evolution */}
        <Card className="py-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <DollarSign className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground tracking-tight">Evolução de Preços</h3>
                  <p className="text-xs text-muted-foreground">Custo médio de frete por Km</p>
                </div>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={freightPriceEvolution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: 'var(--muted-foreground)', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: 'var(--muted-foreground)', fontSize: 12}}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="var(--foreground)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: 'var(--foreground)', strokeWidth: 2, stroke: 'var(--background)' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Supply vs Demand */}
        <Card className="lg:col-span-2 py-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <BarChart3 className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground tracking-tight">Oferta vs Demanda por Região</h3>
                  <p className="text-xs text-muted-foreground">Equilíbrio entre cargas disponíveis e veículos</p>
                </div>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplyDemandData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="region"
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: 'var(--foreground)', fontSize: 12, fontWeight: 600}}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: 'var(--muted-foreground)', fontSize: 12}}
                  />
                  <Tooltip
                    cursor={{fill: 'var(--muted)'}}
                    contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    height={36}
                    formatter={(value) => <span className="text-xs text-muted-foreground">{value === 'supply' ? 'Oferta' : 'Demanda'}</span>}
                  />
                  <Bar dataKey="supply" fill="var(--foreground)" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="demand" fill="var(--chart-1)" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insight Banner - compact version */}
      <Card className="py-0">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-md bg-muted shrink-0">
              <Brain className="w-5 h-5 text-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Insight Automático (IA)</span>
              </div>
              <h3 className="text-base font-semibold text-foreground leading-tight">
                "A produção de milho aumentou <span className="text-success">20%</span> no Cuanza Norte — oportunidade de compra antecipada"
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Baseado em dados de satélite e transações recentes na plataforma.</p>
            </div>
            <Button onClick={() => setIsDrawerOpen(true)} size="sm">
              Ver Detalhes
            </Button>
          </div>
        </CardContent>
      </Card>

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
                      <p className="text-xs text-muted-foreground">Inteligência de Mercado</p>
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
                    <h4 className="text-xs font-medium text-muted-foreground mb-3">Previsão Climática</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="py-0">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CloudRain className="w-4 h-4 text-info" />
                            <span className="text-xs text-muted-foreground">Precipitação</span>
                          </div>
                          <p className="text-xl font-semibold text-foreground">12mm</p>
                          <p className="text-xs text-info mt-1">Ideal para colheita</p>
                        </CardContent>
                      </Card>
                      <Card className="py-0">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Thermometer className="w-4 h-4 text-destructive" />
                            <span className="text-xs text-muted-foreground">Temperatura</span>
                          </div>
                          <p className="text-xl font-semibold text-foreground">26°C</p>
                          <p className="text-xs text-destructive mt-1">Estável</p>
                        </CardContent>
                      </Card>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-medium text-muted-foreground mb-3">Oportunidades Detalhadas</h4>
                    <div className="space-y-3">
                      <Card className="py-0">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="success">Cuanza Norte - Milho</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            O aumento de 20% na produção local cria uma janela de oportunidade para aquisição com preços 15% abaixo da média de Luanda.
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="py-0">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="info">Logística de Retorno</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Alta disponibilidade de veículos retornando vazios de Luanda para o Huambo. Potencial de redução de 25% no custo de frete de insumos.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-medium text-muted-foreground mb-3">Tendência de Preços (Próximos 15 dias)</h4>
                    <div className="h-40 bg-muted rounded-lg border border-border flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">Gráfico de Projeção IA</p>
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
