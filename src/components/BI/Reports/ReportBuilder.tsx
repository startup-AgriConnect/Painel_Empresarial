import React, { useState } from 'react';
import {
  ArrowLeft,
  Database,
  Filter,
  BarChart3,
  Eye,
  Download,
  ChevronRight,
  Check,
  X,
  Plus,
  Table as TableIcon,
  LineChart as LineIcon,
  PieChart as PieIcon,
  BarChart as BarIcon,
  FileText,
  FileSpreadsheet,
  FileJson,
  Layers,
  MapPin,
  Calendar,
  Leaf,
  DollarSign,
  Truck
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';

const dataSources = [
  { id: 'prices', name: 'Preços de Mercado', icon: DollarSign },
  { id: 'production', name: 'Produção Agrícola', icon: Leaf },
  { id: 'producers', name: 'Rede de Produtores', icon: Database },
  { id: 'logistics', name: 'Fluxo Logístico', icon: Truck },
];

const visualizationTypes = [
  { id: 'table', name: 'Tabela de Dados', icon: TableIcon },
  { id: 'bar', name: 'Gráfico de Barras', icon: BarIcon },
  { id: 'line', name: 'Gráfico de Linha', icon: LineIcon },
  { id: 'pie', name: 'Gráfico de Torta', icon: PieIcon },
];

const provinces = ['Todas', 'Huambo', 'Bié', 'Benguela', 'Malanje', 'Uíge', 'Huíla'];
const cultures = ['Todas', 'Milho', 'Feijão', 'Batata Doce', 'Mandioca', 'Café', 'Hortícolas'];

export default function ReportBuilder({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    province: 'Todas',
    culture: 'Todas',
    period: 'Este Mês',
  });
  const [vizType, setVizType] = useState('table');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const toggleSource = (id: string) => {
    setSelectedSources(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 1500);
  };

  const mockPreviewData = [
    { name: 'Huambo', volume: 450, price: 1200, growth: 12 },
    { name: 'Bié', volume: 320, price: 1150, growth: 8 },
    { name: 'Benguela', volume: 280, price: 1300, growth: -5 },
    { name: 'Malanje', volume: 510, price: 1100, growth: 15 },
    { name: 'Uíge', volume: 190, price: 1450, growth: 3 },
  ];

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center gap-3">
        <Button onClick={onBack} variant="outline" size="icon">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Construtor de Relatórios BI</h2>
          <p className="text-sm text-muted-foreground">Ambiente de cruzamento de dados personalizado</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Steps */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { s: 1, t: 'Fontes de Dados', i: Database },
            { s: 2, t: 'Filtros & Segmentos', i: Filter },
            { s: 3, t: 'Visualização', i: BarChart3 },
            { s: 4, t: 'Pré-visualização', i: Eye },
          ].map((item) => (
            <button
              key={item.s}
              onClick={() => step > item.s && setStep(item.s)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-md border transition-all text-left",
                step === item.s
                  ? "bg-primary border-primary text-primary-foreground shadow-xs"
                  : step > item.s
                    ? "bg-card border-border text-foreground hover:bg-accent"
                    : "bg-muted/40 border-border text-muted-foreground cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold",
                step === item.s ? "bg-primary-foreground/20" : "bg-muted"
              )}>
                {step > item.s ? <Check className="w-3.5 h-3.5" /> : item.s}
              </div>
              <span className="text-sm font-medium">{item.t}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Card className="py-0">
                  <CardContent className="p-6">
                    <h3 className="text-base font-semibold text-foreground mb-5">Selecione as Fontes de Dados</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {dataSources.map((source) => (
                        <button
                          key={source.id}
                          onClick={() => toggleSource(source.id)}
                          className={cn(
                            "p-4 rounded-md border-2 transition-all flex items-center gap-3 text-left",
                            selectedSources.includes(source.id)
                              ? "border-ring bg-accent"
                              : "border-border bg-card hover:bg-accent/50"
                          )}
                        >
                          <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                            <source.icon className="w-5 h-5 text-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{source.name}</p>
                            <p className="text-xs text-muted-foreground">Cruzar dados de {source.id}</p>
                          </div>
                          {selectedSources.includes(source.id) && (
                            <div className="flex size-6 items-center justify-center bg-primary rounded-full text-primary-foreground">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-end">
                  <Button
                    disabled={selectedSources.length === 0}
                    onClick={() => setStep(2)}
                  >
                    Próximo Passo
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Card className="py-0">
                  <CardContent className="p-6">
                    <h3 className="text-base font-semibold text-foreground mb-5">Defina os Filtros do Relatório</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-3 h-3" /> Província
                        </label>
                        <select
                          value={filters.province}
                          onChange={(e) => setFilters({...filters, province: e.target.value})}
                          className="w-full h-9 px-3 bg-background border border-input rounded-md text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        >
                          {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground flex items-center gap-2">
                          <Leaf className="w-3 h-3" /> Cultura
                        </label>
                        <select
                          value={filters.culture}
                          onChange={(e) => setFilters({...filters, culture: e.target.value})}
                          className="w-full h-9 px-3 bg-background border border-input rounded-md text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        >
                          {cultures.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> Período
                        </label>
                        <select
                          value={filters.period}
                          onChange={(e) => setFilters({...filters, period: e.target.value})}
                          className="w-full h-9 px-3 bg-background border border-input rounded-md text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        >
                          <option value="Hoje">Hoje</option>
                          <option value="Esta Semana">Esta Semana</option>
                          <option value="Este Mês">Este Mês</option>
                          <option value="Este Ano">Este Ano</option>
                          <option value="Personalizado">Personalizado</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-between">
                  <Button onClick={() => setStep(1)} variant="outline">
                    Voltar
                  </Button>
                  <Button onClick={() => setStep(3)}>
                    Próximo Passo
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Card className="py-0">
                  <CardContent className="p-6">
                    <h3 className="text-base font-semibold text-foreground mb-5">Escolha o Tipo de Visualização</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {visualizationTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setVizType(type.id)}
                          className={cn(
                            "p-6 rounded-md border-2 transition-all flex flex-col items-center gap-3 text-center",
                            vizType === type.id
                              ? "border-ring bg-accent"
                              : "border-border bg-card hover:bg-accent/50"
                          )}
                        >
                          <div className={cn(
                            "flex size-12 items-center justify-center rounded-md transition-all",
                            vizType === type.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                          )}>
                            <type.icon className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-medium text-foreground">{type.name}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-between">
                  <Button onClick={() => setStep(2)} variant="outline">
                    Voltar
                  </Button>
                  <Button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        Gerar Relatório
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <Card className="py-0">
                  <CardContent className="p-6 min-h-[500px]">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-base font-semibold text-foreground">Pré-visualização do Relatório</h3>
                        <p className="text-xs text-muted-foreground">Cruzamento: {selectedSources.join(' + ')}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4" /> PDF
                        </Button>
                        <Button size="sm">
                          <FileSpreadsheet className="w-4 h-4" /> Excel
                        </Button>
                      </div>
                    </div>

                    <div className="bg-muted/40 rounded-lg p-6 border border-border">
                      {vizType === 'table' && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="pb-3 text-xs font-medium text-muted-foreground">Região</th>
                                <th className="pb-3 text-xs font-medium text-muted-foreground">Volume (Ton)</th>
                                <th className="pb-3 text-xs font-medium text-muted-foreground">Preço Médio (AKZ)</th>
                                <th className="pb-3 text-xs font-medium text-muted-foreground">Crescimento</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {mockPreviewData.map((row, i) => (
                                <tr key={i}>
                                  <td className="py-3 text-sm font-medium text-foreground">{row.name}</td>
                                  <td className="py-3 text-sm text-muted-foreground">{row.volume}</td>
                                  <td className="py-3 text-sm text-muted-foreground">{row.price}</td>
                                  <td className={cn("py-3 text-sm font-medium", row.growth > 0 ? "text-success" : "text-destructive")}>
                                    {row.growth > 0 ? '+' : ''}{row.growth}%
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {vizType === 'bar' && (
                        <div className="h-[350px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockPreviewData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} />
                              <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                              <Bar dataKey="volume" fill="var(--foreground)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {vizType === 'line' && (
                        <div className="h-[350px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockPreviewData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} />
                              <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                              <Line type="monotone" dataKey="price" stroke="var(--foreground)" strokeWidth={2} dot={{ r: 4, fill: 'var(--foreground)', strokeWidth: 2, stroke: 'var(--background)' }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {vizType === 'pie' && (
                        <div className="h-[350px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={mockPreviewData} dataKey="volume" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={8}>
                                {mockPreviewData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'][index % 5]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: 'var(--popover)', color: 'var(--popover-foreground)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-between">
                  <Button onClick={() => setStep(3)} variant="outline">
                    Editar Configurações
                  </Button>
                  <Button onClick={onBack}>
                    Salvar Relatório
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
