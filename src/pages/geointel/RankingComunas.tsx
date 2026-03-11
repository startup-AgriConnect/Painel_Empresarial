import React, { useState, useMemo } from "react";
import { useFetch } from "../../services/hooks";
import { mockAPI } from "../../services/mockData";
import { FilterContext } from "../../types";
import {
  Trophy,
  TrendingUp,
  Award,
  MapPin,
  ChevronRight,
  Star,
  X,
  Boxes,
  Zap,
  Activity,
  ArrowUpRight,
  Info,
  BarChart as BarChartIcon,
  Package,
  Layers,
  Truck,
  ShieldCheck,
  Droplets,
  Leaf,
  Navigation,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  CartesianGrid,
} from "recharts";

// Dados detalhados fixos para cada comuna (mantidos para UI rica)
const comunaDetails: Record<string, any> = {
  Catumbela: {
    province: "Huambo",
    volume: 8500,
    efficiency: 94,
    growth: 12,
    producers: 452,
    ndvi: 0.88,
    humidity: 72,
    description:
      "Maior polo de produção de batata e milho do planalto central. Solo altamente fértil com irrigação perene.",
    associatedHubs: [
      {
        name: "Hub Caála Central",
        status: "Operacional",
        dist: "12km",
        load: "42%",
      },
      {
        name: "Terminal Logístico Huambo",
        status: "Saturado",
        dist: "45km",
        load: "95%",
      },
    ],
    productionMix: [
      { name: "Milho Branco", value: 45, color: "#fbbf24", vol: 3825 },
      { name: "Batata Rena", value: 35, color: "#f59e0b", vol: 2975 },
      { name: "Feijão Catarino", value: 20, color: "#10b981", vol: 1700 },
    ],
  },
  "Cacuso Sede": {
    province: "Malanje",
    volume: 7200,
    efficiency: 89,
    growth: 8,
    producers: 215,
    ndvi: 0.74,
    humidity: 58,
    description:
      "Polo estratégico para a indústria de transformação de mandioca e cereais do corredor leste.",
    associatedHubs: [
      {
        name: "Hub Cacuso Alpha",
        status: "Operacional",
        dist: "5km",
        load: "65%",
      },
      {
        name: "Hub Malanje Sede",
        status: "Operacional",
        dist: "78km",
        load: "30%",
      },
    ],
    productionMix: [
      { name: "Mandioca", value: 60, color: "#fbbf24", vol: 4320 },
      { name: "Milho", value: 30, color: "#10b981", vol: 2160 },
      { name: "Soja", value: 10, color: "#8b5cf6", vol: 720 },
    ],
  },
  "Baía Farta": {
    province: "Benguela",
    volume: 6800,
    efficiency: 91,
    growth: 15,
    producers: 128,
    ndvi: 0.62,
    humidity: 45,
    description:
      "Especializada em culturas de regadio e fruticultura tropical de alto valor agregado para exportação.",
    associatedHubs: [
      {
        name: "Hub Catumbela Log",
        status: "Operacional",
        dist: "32km",
        load: "88%",
      },
      {
        name: "Porto de Lobito (Agro)",
        status: "Operacional",
        dist: "55km",
        load: "72%",
      },
    ],
    productionMix: [
      { name: "Banana de Mesa", value: 40, color: "#fbbf24", vol: 2720 },
      { name: "Tomate Industrial", value: 35, color: "#ef4444", vol: 2380 },
      { name: "Cebola", value: 25, color: "#f97316", vol: 1700 },
    ],
  },
};

const CustomTooltip = ({ active, payload, totalVolume }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentageOfTotal = ((data.volume / totalVolume) * 100).toFixed(1);

    return (
      <div className="bg-slate-900/98 backdrop-blur-2xl border border-white/10 p-6 rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200 min-w-[300px]">
        <div className="flex justify-between items-start mb-5 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-3 h-3 text-agriYellow" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Detalhe Regional
              </p>
            </div>
            <h4 className="text-xl font-black text-white uppercase tracking-tighter">
              {data.name}
            </h4>
          </div>
          <div className="bg-agriYellow/20 px-3 py-1.5 rounded-xl border border-agriYellow/20">
            <span className="text-[10px] font-black text-agriYellow">
              {percentageOfTotal}% do Top 3
            </span>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-agriYellow" /> Contribuição
              por Commodity
            </p>
            <div className="space-y-3">
              {data.productionMix.map((commodity: any, idx: number) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-end text-[10px] font-black">
                    <span className="text-slate-300 uppercase tracking-tight">
                      {commodity.name}
                    </span>
                    <span className="text-white font-mono">
                      {commodity.vol.toLocaleString()} Ton ({commodity.value}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(251,191,36,0.2)]"
                      style={{
                        width: `${commodity.value}%`,
                        backgroundColor: commodity.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Performance Global
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
              <span className="text-sm font-black text-emerald-400">
                +{data.growth}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const RankingComunas: React.FC<{
  filters: FilterContext;
  isDarkMode: boolean;
}> = ({ filters, isDarkMode }) => {
  const [selectedCommune, setSelectedCommune] = useState<any | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Buscar dados do ranking do mockAPI
  const { data: rankingDataFromAPI, loading } = useFetch(() =>
    mockAPI.estatisticas.getRankingComunas(),
  );

  // Combinar dados da API com detalhes fixos para UI rica
  const rankingData = useMemo(() => {
    if (!rankingDataFromAPI || !Array.isArray(rankingDataFromAPI)) {
      return [];
    }

    return rankingDataFromAPI.map((item) => {
      const details = comunaDetails[item.nome] || {
        associatedHubs: [],
        productionMix: [],
        ndvi: 0.75,
        humidity: 60,
      };
      return {
        ...item,
        name: item.nome,
        province: item.provincia,
        volume: item.producao,
        efficiency: item.eficiencia,
        growth: item.crescimento,
        associatedHubs: details.associatedHubs || [],
        productionMix: details.productionMix || [],
        ndvi: details.ndvi || 0.75,
        humidity: details.humidity || 60,
        ...details, // Adiciona detalhes extras se existirem
      };
    });
  }, [rankingDataFromAPI]);

  const chartTextColor = isDarkMode ? "#94a3b8" : "#64748b";
  const chartGridColor = isDarkMode ? "#1e293b" : "#f1f5f9";

  const totalVolume = useMemo(
    () => rankingData.reduce((acc, curr) => acc + curr.volume, 0),
    [rankingData],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Carregando ranking...
          </p>
        </div>
      </div>
    );
  }

  if (!rankingData || rankingData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Trophy className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Nenhum dado de ranking disponível
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full animate-in fade-in duration-500">
      <div
        className={`space-y-8 transition-all duration-300 ${selectedCommune ? "pr-[450px]" : ""}`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-agriYellow/20 blur-xl rounded-full animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-agriYellow to-yellow-600 rounded-[28px] flex items-center justify-center shadow-xl shadow-agriYellow/30">
                <Trophy className="w-9 h-9 text-slate-900" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3 mb-1">
                Ranking de Comunas
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.15em] flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-agriYellow" />
                Desempenho de Produtividade • {filters.province.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/20 px-5 py-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/30 shadow-sm flex items-center gap-3">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">
                Telemetria Ativa
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-agriYellow rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  {rankingData.length} Comunas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Barras Aprimorado */}
        <div className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 rounded-[40px] p-10 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 transition-all hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-agriYellow/5 overflow-hidden relative group">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-tr from-agriYellow/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="relative z-10 flex justify-between items-start mb-10">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-agriYellow/20 to-yellow-600/20 rounded-2xl flex items-center justify-center border border-agriYellow/30">
                  <BarChartIcon className="w-6 h-6 text-agriYellow" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-[0.15em]">
                    Produtividade por Comuna
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-0.5 tracking-tight">
                    Análise de Fluxo Volumétrico por Commodity
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-gradient-to-r from-agriYellow/10 to-yellow-600/10 px-4 py-2.5 rounded-xl border border-agriYellow/20">
                <div className="w-3 h-3 bg-agriYellow rounded-full shadow-sm shadow-agriYellow/50"></div>
                <span className="text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                  Top Performance
                </span>
              </div>
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-3 h-3 bg-slate-400 dark:bg-slate-600 rounded-full"></div>
                <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                  Demais Comunas
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rankingData}
                layout="vertical"
                margin={{ left: 20, right: 60, top: 0, bottom: 0 }}
                onMouseMove={(state) => {
                  if (state && state.activeTooltipIndex !== undefined) {
                    setHoveredIndex(state.activeTooltipIndex);
                  } else {
                    setHoveredIndex(null);
                  }
                }}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={(data) => {
                  if (data && data.activePayload) {
                    setSelectedCommune(data.activePayload[0].payload);
                  }
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke={chartGridColor}
                  opacity={0.3}
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 900, fill: chartTextColor }}
                  width={100}
                />
                <Tooltip
                  cursor={{ fill: "rgba(251, 191, 36, 0.05)", radius: 16 }}
                  content={<CustomTooltip totalVolume={totalVolume} />}
                  allowEscapeViewBox={{ x: false, y: true }}
                />
                <Bar
                  dataKey="volume"
                  radius={[0, 20, 20, 0]}
                  barSize={42}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {rankingData.map((entry, index) => {
                    const isHovered = hoveredIndex === index;
                    const isSelected = selectedCommune?.name === entry.name;
                    const isTopRank = index === 0;

                    return (
                      <Cell
                        key={`cell-${index}`}
                        className="cursor-pointer transition-all duration-300"
                        fill={
                          isHovered || isSelected
                            ? "#fbbf24"
                            : isTopRank
                              ? "#fbbf24"
                              : isDarkMode
                                ? "#1e293b"
                                : "#f1f5f9"
                        }
                        stroke={
                          isHovered || isSelected
                            ? "#f59e0b"
                            : isTopRank
                              ? "#f59e0b"
                              : isDarkMode
                                ? "#334155"
                                : "#e2e8f0"
                        }
                        strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                        fillOpacity={
                          isHovered || isSelected ? 1 : isTopRank ? 0.95 : 0.85
                        }
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden transition-colors hover:shadow-xl">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50/80 via-slate-50/50 to-slate-50/30 dark:from-slate-800/50 dark:via-slate-800/30 dark:to-slate-800/10 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-agriYellow/20 to-yellow-600/20 rounded-xl flex items-center justify-center border border-agriYellow/30">
                  <Award className="w-5 h-5 text-agriYellow" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-[0.2em]">
                    Classificação Safra 2024
                  </h3>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    Validado por Sistema BI
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-agriYellow/15 to-yellow-600/10 px-3 py-2 rounded-xl border border-agriYellow/20">
                <Package className="w-4 h-4 text-agriYellow" />
                <span className="text-[9px] font-black text-agriYellow uppercase tracking-widest">
                  BI Certificado
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {rankingData.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedCommune(item)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`p-8 flex items-center justify-between transition-all duration-300 group cursor-pointer relative ${
                    selectedCommune?.name === item.name
                      ? "bg-gradient-to-r from-agriYellow/10 via-yellow-500/5 to-transparent border-l-[6px] border-agriYellow shadow-inner"
                      : "hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent dark:hover:from-slate-800/30 dark:hover:to-transparent"
                  }`}
                >
                  {/* Position Badge - Melhorado */}
                  <div className="flex items-center gap-8">
                    <div
                      className={`relative w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-xl shadow-lg transition-all duration-500 ${
                        idx === 0
                          ? "bg-gradient-to-br from-agriYellow to-yellow-600 text-slate-900 scale-110 shadow-agriYellow/30"
                          : hoveredIndex === idx
                            ? "bg-gradient-to-br from-agriYellow/80 to-yellow-600/80 text-slate-900 scale-105"
                            : "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {idx === 0 && (
                        <div className="absolute -top-1 -right-1">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-pulse" />
                        </div>
                      )}
                      {idx + 1}
                    </div>
                    <div>
                      <h4
                        className={`text-xl font-black uppercase tracking-tighter transition-colors duration-300 ${
                          selectedCommune?.name === item.name
                            ? "text-agriYellow"
                            : hoveredIndex === idx
                              ? "text-agriYellow"
                              : "text-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          <MapPin className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                            {item.province}
                          </span>
                        </div>
                        {item.efficiency && (
                          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg">
                            <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider">
                              {item.efficiency}% Eficiente
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Métricas - Melhoradas */}
                  <div className="hidden md:flex items-center gap-12 text-right">
                    <div className="w-32">
                      <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2 tracking-widest flex items-center justify-end gap-1.5">
                        <TrendingUp className="w-3 h-3" />
                        Crescimento
                      </p>
                      <div className="flex items-center justify-end gap-2">
                        <div className="flex items-center gap-1 text-base font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-xl">
                          <ArrowUpRight className="w-4 h-4" />
                          {item.growth}%
                        </div>
                      </div>
                    </div>
                    <div className="w-40">
                      <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-2 tracking-widest flex items-center justify-end gap-1.5">
                        <Package className="w-3 h-3" />
                        Volume Acumulado
                      </p>
                      <p className="text-xl font-black text-slate-900 dark:text-slate-100">
                        {item.volume.toLocaleString()}
                        <span className="text-xs text-slate-400 font-bold uppercase ml-1.5">
                          Ton
                        </span>
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-7 h-7 transition-all duration-300 ${
                        selectedCommune?.name === item.name ||
                        hoveredIndex === idx
                          ? "text-agriYellow translate-x-2 scale-125"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-10 rounded-[40px] shadow-2xl text-white overflow-hidden group border border-slate-800 h-full flex flex-col justify-between">
              {/* Animated background elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-agriYellow/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <Star className="absolute -right-8 -top-8 w-48 h-48 text-white/5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700" />
              <Trophy className="absolute -left-6 -bottom-6 w-32 h-32 text-agriYellow/5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700" />

              <div className="relative z-10">
                {/* Icon and badge */}
                <div className="flex items-start justify-between mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-agriYellow blur-2xl opacity-30 animate-pulse"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-agriYellow to-yellow-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-agriYellow/30 border-4 border-slate-800">
                      <Award className="w-10 h-10 text-slate-900" />
                    </div>
                  </div>
                  <div className="bg-agriYellow/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-agriYellow/30">
                    <span className="text-[9px] font-black text-agriYellow uppercase tracking-widest">
                      2024
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-3xl font-black mb-3 leading-tight uppercase tracking-tighter">
                  Comuna Modelo
                </h3>
                <p className="text-agriYellow/70 text-[10px] font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Padrão de Excelência SIG
                </p>

                {/* Stats */}
                <div className="space-y-5 mb-10 bg-slate-800/30 backdrop-blur-sm p-6 rounded-3xl border border-slate-700/50">
                  <div className="flex justify-between items-center group/item">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 bg-agriYellow rounded-full animate-pulse"></div>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest group-hover/item:text-slate-200 transition-colors">
                        Volume Liderança
                      </span>
                    </div>
                    <span className="font-black text-white text-2xl font-mono">
                      8.5k
                      <span className="text-sm text-slate-400 ml-1">Ton</span>
                    </span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                  <div className="flex justify-between items-center group/item">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest group-hover/item:text-slate-200 transition-colors">
                        Eficiência Logística
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-agriYellow text-2xl font-mono">
                        94
                      </span>
                      <span className="text-sm text-slate-400">%</span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() =>
                    rankingData.length > 0 && setSelectedCommune(rankingData[0])
                  }
                  disabled={rankingData.length === 0}
                  className="w-full py-5 bg-gradient-to-r from-agriYellow to-yellow-600 text-slate-900 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-agriYellow/30 hover:shadow-agriYellow/50 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group/btn"
                >
                  <Zap className="w-4 h-4 group-hover/btn:animate-pulse" />
                  Abrir Auditoria IA
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side Detail Panel for Commune - Melhores Detalhes de Produção e Logística */}
      <div
        className={`fixed top-0 right-0 h-full w-[480px] bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 border-l-2 border-slate-200 dark:border-slate-800 shadow-2xl z-50 transition-transform duration-500 ease-in-out transform flex flex-col ${selectedCommune ? "translate-x-0" : "translate-x-full"}`}
      >
        {selectedCommune && (
          <div className="flex flex-col h-full">
            {/* Enhanced Header */}
            <div className="relative p-10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border-b-[6px] border-agriYellow shrink-0 overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-agriYellow/10 via-transparent to-transparent animate-pulse"></div>
              <Trophy className="absolute -right-10 -top-10 w-52 h-52 text-white/5 rotate-12" />

              <button
                onClick={() => setSelectedCommune(null)}
                className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-white/50 hover:text-white z-20 backdrop-blur-sm border border-white/10 group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-agriYellow to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-agriYellow/30">
                    <Trophy className="w-6 h-6 text-slate-900" />
                  </div>
                  <span className="text-[10px] text-agriYellow font-black uppercase tracking-[0.3em]">
                    Auditoria de Comuna
                  </span>
                </div>
                <h4 className="text-5xl font-black leading-none mb-4 uppercase tracking-tighter">
                  {selectedCommune.name}
                </h4>
                <div className="flex items-center gap-4">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                    <MapPin className="w-3.5 h-3.5" />{" "}
                    {selectedCommune.province}, Angola
                  </p>
                  {selectedCommune.efficiency && (
                    <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] text-emerald-300 font-black uppercase tracking-wider">
                        {selectedCommune.efficiency}% Eficiente
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-10 space-y-10 custom-scrollbar">
              {/* Secção de Mix de Produção - Melhorada */}
              {selectedCommune.productionMix &&
              selectedCommune.productionMix.length > 0 ? (
                <div className="space-y-6">
                  <h5 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em] border-b-2 border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-agriYellow/20 to-yellow-600/10 rounded-xl flex items-center justify-center border border-agriYellow/30">
                        <Package className="w-5 h-5 text-agriYellow" />
                      </div>
                      <span>Matriz Produtiva</span>
                    </div>
                    <div className="text-[9px] font-black text-agriYellow bg-agriYellow/10 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                      {selectedCommune.productionMix.length} Commodities
                    </div>
                  </h5>

                  <div className="h-64 relative bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-[40px] border-2 border-slate-200 dark:border-slate-800 p-6 shadow-inner">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={selectedCommune.productionMix}
                          innerRadius={70}
                          outerRadius={95}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                        >
                          {selectedCommune.productionMix.map(
                            (entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ),
                          )}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "24px",
                            border: "none",
                            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                            background: "#0f172a",
                            padding: "20px",
                          }}
                          itemStyle={{
                            color: "#fff",
                            fontSize: "11px",
                            fontWeight: "black",
                            textTransform: "uppercase",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none bg-white dark:bg-slate-900 w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 border-slate-100 dark:border-slate-800 shadow-lg">
                      <p className="text-[11px] font-black text-agriYellow uppercase leading-none tracking-widest">
                        Total
                      </p>
                      <p className="text-2xl font-black text-slate-800 dark:text-white mt-1 font-mono">
                        {(selectedCommune.volume / 1000).toFixed(1)}k
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        Toneladas
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {selectedCommune.productionMix.map(
                      (item: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-6 rounded-[24px] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 hover:border-agriYellow dark:hover:border-agriYellow transition-all hover:shadow-lg hover:shadow-agriYellow/10 group"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-4 h-4 rounded-lg shadow-md group-hover:scale-110 transition-transform"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                              {item.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-slate-900 dark:text-white block">
                              {item.vol.toLocaleString()}{" "}
                              <span className="text-[10px] text-slate-400">
                                Ton
                              </span>
                            </span>
                            <span className="text-[9px] font-bold text-agriYellow uppercase tracking-widest">
                              {item.value}% do total
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-[40px] border-2 border-slate-200 dark:border-slate-800">
                  <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-bold">
                    Dados de produção não disponíveis
                  </p>
                </div>
              )}

              {/* Secção de Hubs Logísticos - Melhorada */}
              {selectedCommune.associatedHubs &&
              selectedCommune.associatedHubs.length > 0 ? (
                <div className="space-y-6">
                  <h5 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-[0.2em] border-b-2 border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/30">
                        <Truck className="w-5 h-5 text-blue-500" />
                      </div>
                      <span>Infraestrutura de Escoamento</span>
                    </div>
                    <div className="text-[9px] font-black text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                      {selectedCommune.associatedHubs.length} Hubs
                    </div>
                  </h5>

                  <div className="space-y-5">
                    {selectedCommune.associatedHubs.map(
                      (hub: any, i: number) => (
                        <div
                          key={i}
                          className="p-7 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-[32px] border-2 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-lg hover:border-blue-500/30 transition-all"
                        >
                          {/* Background gradient on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-5">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 text-blue-600 dark:text-blue-400 rounded-[20px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-2 border-blue-200 dark:border-blue-800/50">
                                  <Boxes className="w-7 h-7" />
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                    {hub.name}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1.5">
                                    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                                      <Navigation className="w-3 h-3" />
                                      {hub.dist} da Comuna
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <span
                                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase shadow-sm border-2 ${
                                  hub.status === "Operacional"
                                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50"
                                    : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50"
                                }`}
                              >
                                {hub.status}
                              </span>
                            </div>

                            <div className="space-y-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                              <div className="flex justify-between items-center text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase">
                                <span className="flex items-center gap-2">
                                  <Activity className="w-3.5 h-3.5" />
                                  Capacidade Livre
                                </span>
                                <span
                                  className={`text-sm font-mono ${
                                    parseInt(hub.load) > 80
                                      ? "text-rose-600 dark:text-rose-400"
                                      : "text-emerald-600 dark:text-emerald-400"
                                  }`}
                                >
                                  {100 - parseInt(hub.load)}%
                                </span>
                              </div>
                              <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                <div
                                  className={`h-full transition-all duration-700 rounded-full ${
                                    parseInt(hub.load) > 80
                                      ? "bg-gradient-to-r from-rose-500 to-rose-600"
                                      : "bg-gradient-to-r from-blue-500 to-blue-600"
                                  }`}
                                  style={{ width: hub.load }}
                                />
                              </div>
                              <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase mt-2">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-[40px] border-2 border-slate-200 dark:border-slate-800">
                  <Truck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-bold">
                    Dados de hubs não disponíveis
                  </p>
                </div>
              )}

              {/* Inteligência de Vigor Vegetal (IA) - Melhorada */}
              <div className="relative p-8 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 dark:from-emerald-950/30 dark:via-green-950/20 dark:to-lime-950/10 rounded-[40px] border-2 border-emerald-200 dark:border-emerald-800/30 overflow-hidden group shadow-lg shadow-emerald-100 dark:shadow-none">
                {/* Animated background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-agriYellow/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Leaf className="absolute -right-8 -bottom-8 w-40 h-40 text-emerald-200/20 dark:text-emerald-900/20 rotate-45 group-hover:rotate-90 transition-transform duration-700" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-agriYellow blur-xl opacity-30 animate-pulse"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-agriYellow to-yellow-600 rounded-[24px] flex items-center justify-center text-slate-950 shadow-2xl shadow-agriYellow/30 border-4 border-white dark:border-slate-900">
                        <Zap className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wide leading-tight">
                        Análise de Solo & Vigor IA
                      </h5>
                      <p className="text-[9px] text-emerald-600 dark:text-emerald-500 font-black uppercase tracking-widest mt-1 flex items-center gap-1.5">
                        <Activity className="w-3 h-3 animate-pulse" />
                        Sincronismo Sentinel-2
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5 mb-8">
                    <div className="space-y-3 bg-white dark:bg-slate-900 p-5 rounded-[24px] border-2 border-emerald-200 dark:border-emerald-800/30 shadow-sm">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/30 rounded-xl flex items-center justify-center">
                          <Leaf className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tight">
                          Índice NDVI
                        </span>
                      </div>
                      <p className="text-4xl font-black text-slate-800 dark:text-white font-mono">
                        {selectedCommune.ndvi}
                      </p>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                          style={{ width: `${selectedCommune.ndvi * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-3 bg-white dark:bg-slate-900 p-5 rounded-[24px] border-2 border-blue-200 dark:border-blue-800/30 shadow-sm">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/30 rounded-xl flex items-center justify-center">
                          <Droplets className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tight">
                          Humidade Solo
                        </span>
                      </div>
                      <p className="text-4xl font-black text-slate-800 dark:text-white font-mono">
                        {selectedCommune.humidity}
                        <span className="text-xl ml-1">%</span>
                      </p>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                          style={{ width: `${selectedCommune.humidity}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 rounded-[24px] border-2 border-emerald-200/50 dark:border-emerald-800/20">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-agriYellow/20 to-yellow-600/10 rounded-xl flex items-center justify-center shrink-0 mt-1">
                        <Info className="w-4 h-4 text-agriYellow" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-agriYellow uppercase tracking-widest mb-2">
                          Recomendação IA • Análise Preditiva
                        </p>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                          "O vigor espectral sugere maturidade óptima para
                          colheita em{" "}
                          <span className="font-black text-agriYellow">
                            14 dias
                          </span>
                          . Recomenda-se alocação antecipada de camiões nos
                          corredores adjacentes."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Footer Actions */}
            <div className="p-10 border-t-2 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 grid grid-cols-2 gap-5 shrink-0">
              <button className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-lg hover:shadow-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex items-center justify-center gap-3 group/btn hover:scale-105 active:scale-95">
                <Navigation className="w-5 h-5 group-hover/btn:rotate-45 transition-transform" />
                Traçar Rota
              </button>
              <button className="bg-gradient-to-r from-slate-900 to-slate-950 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:shadow-agriYellow/30 hover:from-agriYellow hover:to-yellow-600 transition-all flex items-center justify-center gap-3 group/btn hover:scale-105 active:scale-95">
                <ShieldCheck className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                Certificar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingComunas;
