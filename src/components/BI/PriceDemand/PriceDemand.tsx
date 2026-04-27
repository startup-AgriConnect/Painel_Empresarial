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
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';

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
  { name: 'Milho', value: 45, color: 'var(--chart-1)' },
  { name: 'Mandioca', value: 25, color: 'var(--chart-2)' },
  { name: 'Feijão', value: 15, color: 'var(--chart-3)' },
  { name: 'Soja', value: 10, color: 'var(--chart-4)' },
  { name: 'Outros', value: 5, color: 'var(--chart-5)' },
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
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Preços & Demanda</h2>
          <p className="text-sm text-muted-foreground">Análise de custos logísticos, equilíbrio de mercado e oportunidades de negócio.</p>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="inline-flex items-center gap-1 rounded-md bg-muted p-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 whitespace-nowrap rounded-sm px-3 text-xs font-medium",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Preço Médio / Km', value: '420 Kz', trend: '+12%', icon: DollarSign, trendUp: true },
          { label: 'Preço Médio / Ton', value: '15.400 Kz', trend: '+5.2%', icon: Coins, trendUp: true },
          { label: 'Variação (30d)', value: '+8.4%', trend: 'Alta', icon: TrendingUp, trendUp: true },
          { label: 'Região Mais Cara', value: 'Luanda', trend: '850 Kz/km', icon: MapPin, trendUp: false },
        ].map((kpi, i) => (
          <Card key={i} className="py-0">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <kpi.icon className="w-4 h-4 text-foreground" />
                </div>
                {kpi.trend && (
                  <span className={cn(
                    "text-xs font-medium",
                    kpi.trendUp ? "text-success" : "text-muted-foreground"
                  )}>
                    {kpi.trend}
                  </span>
                )}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{kpi.label}</p>
              <h3 className="text-2xl font-semibold text-foreground tracking-tight">{kpi.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Price Chart */}
        <Card className="lg:col-span-2 py-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <TrendingUp className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground tracking-tight">Evolução do Preço de Frete</h3>
                  <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
                </div>
              </div>
              <Select className="w-auto text-xs">
                <option>Últimos 6 Meses</option>
                <option>Último Ano</option>
              </Select>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceHistory}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--popover)',
                      color: 'var(--popover-foreground)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area type="monotone" dataKey="price" stroke="var(--foreground)" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Insights & Alerts */}
        <div className="space-y-6">
          <Card className="py-0">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Insight de Mercado</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">
                "Preço de frete subiu <span className="text-success font-medium">12%</span> em Luanda devido à alta demanda. Oportunidade de frete premium em Benguela."
              </p>
              <Button size="sm" className="w-full">
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>

          <Card className="py-0">
            <CardContent className="p-5">
              <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                Alertas Ativos
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-md border border-border">
                  <div className="p-1.5 bg-card rounded-md">
                    <TrendingUp className="w-3 h-3 text-destructive" />
                  </div>
                  <p className="text-xs font-medium text-foreground">Alta demanda crítica em Luanda</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-success/10 rounded-md border border-border">
                  <div className="p-1.5 bg-card rounded-md">
                    <TrendingDown className="w-3 h-3 text-success" />
                  </div>
                  <p className="text-xs font-medium text-foreground">Queda de preço no Huambo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SupplyDemandTab() {
  return (
    <div className="space-y-6">
      <Card className="py-0">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-semibold text-foreground tracking-tight">Equilíbrio de Mercado por Região</h3>
              <p className="text-xs text-muted-foreground">Análise de escassez vs excesso de oferta</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-foreground" />
                <span className="text-xs text-muted-foreground">Oferta</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: 'var(--chart-1)' }} />
                <span className="text-xs text-muted-foreground">Demanda</span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplyDemandByRegion} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{fill: 'var(--foreground)', fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} />
                <Tooltip cursor={{fill: 'var(--muted)'}} contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="supply" fill="var(--foreground)" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="demand" fill="var(--chart-1)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="py-0">
          <CardContent className="p-6">
            <h4 className="text-sm font-semibold text-foreground tracking-tight mb-4">Status Regional</h4>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="pb-3 text-xs text-muted-foreground">Região</TableHead>
                    <TableHead className="pb-3 text-xs text-muted-foreground">Status</TableHead>
                    <TableHead className="pb-3 text-xs text-muted-foreground">Preço</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplyDemandByRegion.map((row, i) => (
                    <TableRow key={i} className="group transition-all hover:bg-muted/50 border-b border-border">
                      <TableCell className="py-3 text-xs font-medium text-foreground">{row.region}</TableCell>
                      <TableCell className="py-3">
                        <Badge variant={
                          row.status === 'Escassez' ? 'destructive' :
                          row.status === 'Excesso' ? 'success' : 'secondary'
                        }>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground">{row.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardContent className="p-6">
            <h4 className="text-sm font-semibold text-foreground tracking-tight mb-4">Demanda por Produto</h4>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandByProduct} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: 'var(--foreground)', fontSize: 12, fontWeight: 600}} width={100} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {demandByProduct.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RoutesTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 py-0">
          <CardContent className="p-6">
            <h3 className="text-base font-semibold text-foreground tracking-tight mb-6">Análise de Rotas e Rentabilidade</h3>
            <div className="space-y-3">
              {routePrices.map((route) => (
                <div key={route.id} className="p-4 bg-muted/50 rounded-md border border-border hover:border-ring transition-all group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-md bg-card border border-border">
                        <Truck className="w-4 h-4 text-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">{route.from}</span>
                          <ArrowRightLeft className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">{route.to}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" /> {route.time}
                          </span>
                          <Badge variant={route.profit === 'Alta' ? 'success' : 'warning'}>
                            Rentabilidade {route.profit}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold text-foreground tracking-tight">{route.price}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        {route.trend === 'up' ? <TrendingUp className="w-3 h-3 text-destructive" /> :
                         route.trend === 'down' ? <TrendingDown className="w-3 h-3 text-success" /> :
                         <Activity className="w-3 h-3 text-muted-foreground" />}
                        <span className="text-xs text-muted-foreground">Tendência</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-xs font-medium text-muted-foreground">Insight de Rota</h4>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              "A rota Bié → Luanda está com custo 15% acima da média, porém o tempo de trânsito reduziu em 2h devido a melhorias na EN230."
            </p>
            <div className="p-3 bg-muted rounded-md border border-border">
              <p className="text-xs font-medium text-muted-foreground mb-1">Recomendação</p>
              <p className="text-xs text-foreground">Priorizar cargas de alto valor perecível nesta rota.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TrendsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 py-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <TrendingUp className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground tracking-tight">Previsão de Preços (ML)</h3>
                  <p className="text-xs text-muted-foreground">Modelo preditivo</p>
                </div>
              </div>
              <Badge variant="outline" className="gap-1">
                <Brain className="w-3 h-3" /> IA Preditiva
              </Badge>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="price" stroke="var(--foreground)" strokeWidth={2} dot={{ r: 4, fill: 'var(--foreground)', strokeWidth: 2, stroke: 'var(--background)' }} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-success/10 rounded-md border border-border">
              <p className="text-sm text-foreground leading-relaxed">
                "Nossa IA prevê um aumento de <span className="text-success font-medium">15%</span> nos preços de frete nas próximas 3 semanas devido ao início da colheita de milho no Planalto Central."
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardContent className="p-6">
            <h4 className="text-sm font-semibold text-foreground tracking-tight mb-6">Dinâmica de Mercado</h4>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground">Relação Oferta/Preço</span>
                  <span className="text-xs font-medium text-destructive">Inversa</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-destructive w-[85%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground">Sazonalidade</span>
                  <span className="text-xs font-medium text-success">Alta</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[70%]" />
                </div>
              </div>
              <div className="pt-6 border-t border-border">
                <h5 className="text-xs font-medium text-muted-foreground mb-3">Próximos Eventos</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                    <p className="text-xs text-foreground">Início Colheita Milho (15 dias)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-info" />
                    <p className="text-xs text-foreground">Aumento Demanda Luanda (7 dias)</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
