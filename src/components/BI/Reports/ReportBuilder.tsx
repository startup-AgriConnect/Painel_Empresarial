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

const dataSources = [
  { id: 'prices', name: 'Preços de Mercado', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'production', name: 'Produção Agrícola', icon: Leaf, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'producers', name: 'Rede de Produtores', icon: Database, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'logistics', name: 'Fluxo Logístico', icon: Truck, color: 'text-rose-600', bg: 'bg-rose-50' },
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
    <div className="space-y-8 pb-20">
      <header className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Construtor de Relatórios BI</h2>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-widest text-[10px]">Ambiente de Cruzamento de Dados Personalizado</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Steps */}
        <div className="lg:col-span-3 space-y-4">
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
                "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                step === item.s 
                  ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                  : step > item.s
                    ? "bg-white border-emerald-100 text-emerald-600"
                    : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black",
                step === item.s ? "bg-white/20" : "bg-gray-100"
              )}>
                {step > item.s ? <Check className="w-4 h-4" /> : item.s}
              </div>
              <span className="text-xs font-black uppercase tracking-widest">{item.t}</span>
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
                className="space-y-6"
              >
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-black text-gray-900 mb-6">Selecione as Fontes de Dados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dataSources.map((source) => (
                      <button
                        key={source.id}
                        onClick={() => toggleSource(source.id)}
                        className={cn(
                          "p-6 rounded-[2rem] border-2 transition-all flex items-center gap-4 text-left",
                          selectedSources.includes(source.id)
                            ? "border-emerald-500 bg-emerald-50/50"
                            : "border-gray-50 bg-gray-50/30 hover:border-gray-200"
                        )}
                      >
                        <div className={cn("p-4 rounded-2xl", source.bg, source.color)}>
                          <source.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-black text-gray-900">{source.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cruzar dados de {source.id}</p>
                        </div>
                        {selectedSources.includes(source.id) && (
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    disabled={selectedSources.length === 0}
                    onClick={() => setStep(2)}
                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Próximo Passo
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-black text-gray-900 mb-6">Defina os Filtros do Relatório</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Província
                      </label>
                      <select 
                        value={filters.province}
                        onChange={(e) => setFilters({...filters, province: e.target.value})}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Leaf className="w-3 h-3" /> Cultura
                      </label>
                      <select 
                        value={filters.culture}
                        onChange={(e) => setFilters({...filters, culture: e.target.value})}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        {cultures.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Período
                      </label>
                      <select 
                        value={filters.period}
                        onChange={(e) => setFilters({...filters, period: e.target.value})}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        <option value="Hoje">Hoje</option>
                        <option value="Esta Semana">Esta Semana</option>
                        <option value="Este Mês">Este Mês</option>
                        <option value="Este Ano">Este Ano</option>
                        <option value="Personalizado">Personalizado</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-8 py-4 bg-white border border-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:text-gray-600 transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all flex items-center gap-2"
                  >
                    Próximo Passo
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-black text-gray-900 mb-6">Escolha o Tipo de Visualização</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {visualizationTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setVizType(type.id)}
                        className={cn(
                          "p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 text-center group",
                          vizType === type.id
                            ? "border-emerald-500 bg-emerald-50/50"
                            : "border-gray-50 bg-gray-50/30 hover:border-gray-200"
                        )}
                      >
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                          vizType === type.id ? "bg-emerald-500 text-white" : "bg-white text-gray-400 group-hover:text-emerald-600"
                        )}>
                          <type.icon className="w-8 h-8" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">{type.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-8 py-4 bg-white border border-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:text-gray-600 transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        Gerar Relatório
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm min-h-[500px]">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">Pré-visualização do Relatório</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cruzamento: {selectedSources.join(' + ')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">
                        <FileText className="w-3.5 h-3.5" /> PDF
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">
                        <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100">
                    {vizType === 'table' && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Região</th>
                              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Volume (Ton)</th>
                              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço Médio (AKZ)</th>
                              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Crescimento</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {mockPreviewData.map((row, i) => (
                              <tr key={i}>
                                <td className="py-4 text-sm font-bold text-gray-900">{row.name}</td>
                                <td className="py-4 text-sm font-bold text-gray-600">{row.volume}</td>
                                <td className="py-4 text-sm font-bold text-gray-600">{row.price}</td>
                                <td className={cn("py-4 text-sm font-black", row.growth > 0 ? "text-emerald-600" : "text-rose-600")}>
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
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="volume" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {vizType === 'line' && (
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={mockPreviewData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} />
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
                                <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(3)}
                    className="px-8 py-4 bg-white border border-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:text-gray-600 transition-all"
                  >
                    Editar Configurações
                  </button>
                  <button
                    onClick={onBack}
                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all flex items-center gap-2"
                  >
                    Salvar Relatório
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
