import React, { useState, useEffect } from "react";
import {
  generateAgriInsights,
  AgriInsight,
} from "../../services/geminiService";
import { mockAPI } from "../../services/mockData";
import {
  Cpu,
  Sparkles,
  TrendingUp,
  RefreshCw,
  BrainCircuit,
  Activity,
  BarChart4,
  Zap,
  ShieldCheck,
  ChevronRight,
  Database,
  Globe,
  Truck,
} from "lucide-react";
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
  Cell,
  ComposedChart,
  Line,
} from "recharts";

const AIPredictions: React.FC = () => {
  const [insights, setInsights] = useState<AgriInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeModel, setActiveModel] = useState("demand-forecast");
  const [hybridModelData, setHybridModelData] = useState<any[]>([]);
  const [mlFeatures, setMlFeatures] = useState<any[]>([]);

  // Carregar dados do modelo ML
  useEffect(() => {
    const loadModelData = async () => {
      const modelDataRes = await mockAPI.ia.getModelData();
      const featuresRes = await mockAPI.ia.getFeatures();

      if (modelDataRes.success && modelDataRes.data) {
        setHybridModelData(modelDataRes.data);
      }

      if (featuresRes.success && featuresRes.data) {
        setMlFeatures(featuresRes.data);
      }
    };

    loadModelData();
  }, []);

  const runInference = async () => {
    setLoading(true);
    const result = await generateAgriInsights({
      gee_data:
        "NDVI em ascensão (0.82) indicando maturidade precoce em Malanje.",
      logistics_data:
        "Aumento de 40% na demanda de camiões via aplicativo em Cacuso nas últimas 48h.",
      prediction_target:
        "Probabilidade de flutuação de preço e saturação de Hubs.",
    });
    setInsights(result);
    setLoading(false);
  };

  useEffect(() => {
    runInference();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* AI Control Center Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center border-2 border-agriYellow shadow-[0_0_20px_rgba(251,191,36,0.2)]">
            <BrainCircuit className="w-8 h-8 text-agriYellow" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">
              Motor de Previsão Híbrido{" "}
              <span className="text-agriYellow">v4.0</span>
            </h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em]">
              Fusão de Dados Geoespaciais e Transações em Tempo Real
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={runInference}
            disabled={loading}
            className="px-6 py-3 bg-agriYellow text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-lg hover:shadow-yellow-500/20 active:scale-95 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading && "animate-spin"}`} />
            Recalibrar Modelos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Convergent Analysis Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-4 h-4 text-agriYellow" /> Correlação GEE vs.
                Logística
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                Sincronismo entre Saúde da Cultura e Demanda de Frete
              </p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-agriYellow rounded-full"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase">
                  Transações Uber
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase">
                  Índice NDVI
                </span>
              </div>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={hybridModelData}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 800, fill: "#64748b" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 800, fill: "#64748b" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                  }}
                  itemStyle={{
                    fontSize: "10px",
                    fontWeight: "900",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="transacoes"
                  fill="#fbbf24"
                  fillOpacity={0.15}
                  stroke="#fbbf24"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#64748b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Bar
                  dataKey="ndvi"
                  barSize={10}
                  fill="#64748b33"
                  radius={[5, 5, 0, 0]}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Weights & Confidence */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[32px] border border-white/5 shadow-2xl">
            <h4 className="text-[10px] font-black text-agriYellow uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <Database className="w-4 h-4" /> Feature Importance (ML)
            </h4>
            <div className="space-y-6">
              {mlFeatures.map((f, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2 group-hover:text-white transition-colors">
                    <span>{f.name}</span>
                    <span className="text-agriYellow">{f.weight}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-agriYellow rounded-full shadow-[0_0_10px_rgba(251,191,36,0.4)]"
                      style={{ width: `${f.weight}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Confiança do Modelo
                </p>
                <h5 className="text-2xl font-black text-slate-800 dark:text-white">
                  94.2%
                </h5>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              O modelo atual cruzou dados históricos de 12 safras com os fluxos
              logísticos da última semana em Angola.
            </p>
          </div>
        </div>
      </div>

      {/* Gemini Strategic AI Assistant */}
      <div className="bg-slate-950 rounded-[40px] p-10 border border-white/5 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-6 transition-transform">
          <Sparkles className="w-48 h-48 text-agriYellow" />
        </div>

        <div className="flex flex-col md:flex-row gap-10 relative z-10">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-agriYellow rounded-3xl flex items-center justify-center text-slate-950 shadow-[0_0_40px_rgba(251,191,36,0.3)]">
              <Zap className="w-10 h-10" />
            </div>
          </div>
          <div className="flex-grow space-y-6">
            <div>
              <h4 className="text-2xl font-black text-white uppercase tracking-tighter">
                Insights do Estrategista{" "}
                <span className="text-agriYellow">IA</span>
              </h4>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                Análise Deep Learning: GEE + Transações Logísticas
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 min-h-[160px]">
              {loading ? (
                <div className="flex flex-col gap-4">
                  <div className="h-4 bg-white/10 rounded-full w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-white/10 rounded-full w-full animate-pulse"></div>
                  <div className="h-4 bg-white/10 rounded-full w-1/2 animate-pulse"></div>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed font-medium italic">
                  {insights
                    ? insights.content
                    : "Inicie a recalibragem para obter os novos insights estratégicos baseados nos fluxos de hoje."}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Risco de Gargalo",
                  val: "Alto",
                  icon: Truck,
                  color: "text-amber-500",
                },
                {
                  label: "Previsão de Preço",
                  val: "+12%",
                  icon: TrendingUp,
                  color: "text-emerald-500",
                },
                {
                  label: "Status da Rede",
                  val: "Otimizado",
                  icon: Activity,
                  color: "text-blue-500",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5"
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <p className="text-sm font-black text-white uppercase">
                      {stat.val}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictions;
