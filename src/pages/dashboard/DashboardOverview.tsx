import React, { useState, useRef, useEffect } from "react";
import { KPIStats, ProductionData, FilterContext } from "../../types";
import { useFetch } from "../../services/hooks";
import { mockAPI } from "../../services/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Truck,
  ShieldCheck,
  Zap,
  Info,
  Loader2,
  Download,
  FileText,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react";
import {
  exportToPDF,
  exportToExcel,
  ExportMetadata,
  TableData,
} from "../../utils/exportUtils";

const DashboardOverview: React.FC<{
  filters: FilterContext;
  isDarkMode: boolean;
}> = ({ filters, isDarkMode }) => {
  const { data: producaoData, loading: loadingProducao } = useFetch(
    () => mockAPI.estatisticas.getProducaoRegional(),
    [],
  );

  const { data: kpisData, loading: loadingKPIs } = useFetch(
    () => mockAPI.estatisticas.getKPIs(),
    [],
  );

  const mockData: ProductionData[] = producaoData || [];
  const kpis: KPIStats[] = kpisData || [];
  const chartTextColor = isDarkMode ? "#94a3b8" : "#64748b";
  const chartGridColor = isDarkMode ? "#1e293b" : "#f1f5f9";

  // Estados para controle do dropdown de exportação
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target as Node)
      ) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Preparar dados para exportação
  const prepareDashboardData = (): {
    metadata: ExportMetadata;
    content: string;
    tables: TableData[];
  } => {
    const metadata: ExportMetadata = {
      title: "Relatório de Dashboard - Visão Geral",
      category: "Business Intelligence",
      province: filters.province,
      municipality: filters.municipality,
      additionalInfo: {
        Período: filters.timeRange.toUpperCase(),
        "Data de Geração": new Date().toLocaleDateString("pt-AO"),
      },
    };

    // Conteúdo textual
    let content = "RESUMO EXECUTIVO\n\n";
    content +=
      "Este relatório apresenta uma visão consolidada dos principais indicadores ";
    content +=
      "de desempenho (KPIs) e análise de produção regional do sistema AGRI-CONNECT. ";
    content +=
      "Os dados reflectem a situação actual da cadeia agrícola na região seleccionada.\n\n";
    content += "INDICADORES-CHAVE DE DESEMPENHO:\n\n";

    kpis.forEach((kpi) => {
      content += `${kpi.label}: ${kpi.value}\n`;
      if (kpi.subValue) {
        content += `  Variação: ${kpi.subValue} (${kpi.trend === "up" ? "Crescimento" : kpi.trend === "down" ? "Decréscimo" : "Estável"})\n`;
      }
      content += "\n";
    });

    // Tabelas de dados
    const tables: TableData[] = [];

    // Tabela 1: KPIs
    if (kpis.length > 0) {
      tables.push({
        headers: ["Indicador", "Valor", "Variação", "Tendência"],
        rows: kpis.map((kpi) => [
          kpi.label,
          kpi.value,
          kpi.subValue || "N/A",
          kpi.trend === "up"
            ? "↑ Crescimento"
            : kpi.trend === "down"
              ? "↓ Decréscimo"
              : "→ Estável",
        ]),
      });
    }

    // Tabela 2: Produção Regional
    if (mockData.length > 0) {
      tables.push({
        headers: ["Região", "Milho (ton)", "Mandioca (ton)", "Feijão (ton)"],
        rows: mockData.map((item) => [
          item.name,
          item.milho?.toString() || "0",
          item.mandioca?.toString() || "0",
          item.feijao?.toString() || "0",
        ]),
      });
    }

    return { metadata, content, tables };
  };

  // Handler para exportação PDF
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { metadata, content, tables } = prepareDashboardData();
      exportToPDF(metadata, content, tables);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Erro ao gerar arquivo PDF. Tente novamente.");
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  // Handler para exportação Excel
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const { metadata, content, tables } = prepareDashboardData();
      exportToExcel(metadata, content, tables);
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      alert("Erro ao gerar arquivo Excel. Tente novamente.");
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Active Filter Info */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 border-2 border-emerald-200/50 dark:border-emerald-900/30 px-5 py-3 rounded-2xl w-fit shadow-lg shadow-emerald-100/50 dark:shadow-emerald-900/20">
        <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <p className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest leading-none">
          Contexto:{" "}
          <span className="text-emerald-600 dark:text-emerald-400">
            {filters.province}
          </span>
          {filters.municipality !== "todos" && ` / ${filters.municipality}`}
          <span className="mx-3 opacity-30">|</span>
          Temporalidade:{" "}
          <span className="text-emerald-600 dark:text-emerald-400">
            {filters.timeRange.toUpperCase()}
          </span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="relative glass-card p-6 rounded-[28px] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border-2 border-slate-200/50 dark:border-slate-800/50 overflow-hidden"
          >
            {/* Gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-${kpi.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
            />

            <div className="relative">
              <div className="flex justify-between items-start mb-5">
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-br from-${kpi.color}-50 to-${kpi.color}-100/50 dark:from-${kpi.color}-950/30 dark:to-${kpi.color}-900/20 text-${kpi.color}-600 dark:text-${kpi.color}-400 group-hover:scale-110 transition-transform shadow-lg border border-${kpi.color}-200/50 dark:border-${kpi.color}-800/50`}
                >
                  {kpi.icon === "package" && <Package className="w-5 h-5" />}
                  {kpi.icon === "truck" && <Truck className="w-5 h-5" />}
                  {kpi.icon === "shield" && <ShieldCheck className="w-5 h-5" />}
                  {kpi.icon === "zap" && <Zap className="w-5 h-5" />}
                </div>
                <div
                  className={`flex items-center text-[10px] font-black px-2.5 py-1.5 rounded-full shadow-inner ${kpi.trend === "up" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" : kpi.trend === "down" ? "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400" : "bg-slate-50 dark:bg-slate-800 text-slate-400"}`}
                >
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  ) : kpi.trend === "down" ? (
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  ) : null}
                  {kpi.subValue}
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-2">
                {kpi.label}
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                {kpi.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-[28px] shadow-lg hover:shadow-xl transition-all border-2 border-slate-200/50 dark:border-slate-800/50">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">
                Pipeline de Produção Regional
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-tighter mt-1">
                Análise volumétrica por tipo de cultura
              </p>
            </div>
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:from-slate-400 disabled:to-slate-300 rounded-xl text-[10px] font-black text-white uppercase transition-all shadow-lg hover:shadow-xl flex items-center gap-2 border border-emerald-700"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    Exportar BI
                    <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              {showExportMenu && !isExporting && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={handleExportPDF}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                          Exportar PDF
                        </p>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                          Relatório completo formatado
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={handleExportExcel}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                          Exportar Excel
                        </p>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">
                          Dados para análise avançada
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={chartGridColor}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: chartTextColor }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: chartTextColor }}
                />
                <Tooltip
                  cursor={{
                    fill: isDarkMode ? "#1e293b" : "#f8fafc",
                    opacity: 0.5,
                  }}
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                    borderRadius: "20px",
                    border: "1px solid " + chartGridColor,
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                    padding: "12px",
                  }}
                  labelStyle={{
                    fontWeight: 900,
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: "30px",
                    fontSize: "10px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: chartTextColor,
                  }}
                />
                <Bar
                  dataKey="milho"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="mandioca"
                  fill="#fbbf24"
                  radius={[8, 8, 0, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="feijao"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-agriGreen p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Truck className="w-32 h-32" />
          </div>

          <div className="relative z-10">
            <h3 className="text-xl font-black mb-1.5 leading-tight">
              Estado da Logística
            </h3>
            <p className="text-emerald-300 text-[10px] mb-8 font-black uppercase tracking-[0.2em]">
              {filters.province} • {filters.timeRange}
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-emerald-100 font-black uppercase tracking-widest">
                    Escoamento Ativo
                  </span>
                  <span className="text-3xl font-black text-agriYellow">
                    78%
                  </span>
                </div>
                <div className="h-2.5 bg-white/10 rounded-full shadow-inner">
                  <div
                    className="h-full bg-agriYellow rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)] transition-all duration-1000"
                    style={{ width: "78%" }}
                  ></div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                <p className="text-[10px] text-emerald-200 leading-relaxed font-medium">
                  "Fluxo intenso detectado no Porto de Lobito. Recomenda-se
                  priorizar cargas de milho para o Hub Benguela nas próximas
                  12h."
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 relative z-10 flex justify-between items-center">
            <div>
              <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">
                Camiões em Rota
              </p>
              <p className="text-2xl font-black">124</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-agriYellow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
