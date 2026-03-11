import React, { useState } from "react";
import { useFetch } from "../../services/hooks";
import { mockAPI } from "../../services/mockData";
import { exportReport } from "../../utils/exportUtils";
import {
  ShieldAlert,
  TrendingUp,
  CloudRain,
  CreditCard,
  FileCheck,
  Search,
  UserCheck,
  AlertTriangle,
  BarChart4,
  History,
  Info,
  ChevronRight,
  Landmark,
  ShieldCheck,
  Zap,
  Microscope,
  Waves,
  Scale,
  Award,
  ArrowUpRight,
  Download,
  Eye,
  Activity,
  Loader2,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

// ========================
// COMPONENTES AUXILIARES
// ========================

const BugIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m8 2 1.88 1.88" />
    <path d="M14.12 3.88 16 2" />
    <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
    <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
    <path d="M12 20v-9" />
    <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
    <path d="M17.47 9c1.93-.2 3.53-1.9 3.53-4" />
    <path d="M4.8 13H3" />
    <path d="M21 13h-1.8" />
    <path d="M4.5 18.6 3 20" />
    <path d="M19.5 18.6 21 20" />
  </svg>
);

// ========================
// DADOS ESTÁTICOS
// ========================

const MACRO_RISK_STATS = [
  {
    label: "Risco Logístico",
    val: "Estável",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Inadimplência Regional",
    val: "4.2%",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Procura por Crédito",
    val: "+24%",
    color: "text-agriYellow",
    bg: "bg-agriYellow/10",
  },
];

const COLLATERAL_INDICATORS = (profile: any) => [
  {
    label: "Garantia Estimada (Safra)",
    val: profile.collateral,
    icon: Scale,
    color: "text-emerald-500",
  },
  {
    label: "Área Validada (Landsat)",
    val: profile.validatedArea,
    icon: Microscope,
    color: "text-blue-500",
  },
  {
    label: "Última Produtividade",
    val: profile.lastYield,
    icon: Activity,
    color: "text-agriYellow",
  },
  {
    label: "Confiabilidade Safra",
    val: profile.harvestReliability,
    icon: ShieldCheck,
    color: "text-purple-500",
  },
];

const RISK_MATRIX_DATA = [
  {
    type: "Pragas Migratórias",
    prob: "Alta",
    impact: "Crítico",
    color: "rose",
    icon: BugIcon,
  },
  {
    type: "Stress Hídrico",
    prob: "Média",
    impact: "Alto",
    color: "amber",
    icon: Waves,
  },
  {
    type: "Inflação Insumos",
    prob: "Baixa",
    impact: "Médio",
    color: "blue",
    icon: Scale,
  },
  {
    type: "Degradação Solo",
    prob: "Média",
    impact: "Médio",
    color: "emerald",
    icon: Microscope,
  },
];

// ========================
// COMPONENTE PRINCIPAL
// ========================

const RiskAnalysis: React.FC = () => {
  // ========================
  // HOOKS E ESTADO
  // ========================

  const { data: creditScoreData, loading: loadingCredit } = useFetch(
    () => mockAPI.risco.getCreditScore(),
    [],
  );

  const { data: farmerProfiles, loading: loadingProfiles } = useFetch(
    () => mockAPI.risco.getFarmerProfiles(),
    [],
  );

  const loading = loadingCredit || loadingProfiles;

  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [activeRiskTab, setActiveRiskTab] = useState<
    "financial" | "climate" | "biotic"
  >("financial");

  // ========================
  // EFEITOS
  // ========================

  // Inicializar selectedProfile quando os dados forem carregados
  React.useEffect(() => {
    if (farmerProfiles && farmerProfiles.length > 0 && !selectedProfile) {
      setSelectedProfile(farmerProfiles[0]);
    }
  }, [farmerProfiles, selectedProfile]);

  const handleExportRiskReport = () => {
    if (!selectedProfile) return;

    const content = `
ANÁLISE DE RISCO CREDITÍCIO E OPERACIONAL

Perfil do Agricultor:
• Nome: ${selectedProfile.name}
• Fazenda: ${selectedProfile.farm}
• Localização: ${selectedProfile.location}
• Status de Crédito: ${selectedProfile.status}
• Score de Crédito: ${selectedProfile.creditScore}/1000

Análise de Risco Financeiro:
• Histórico de Pagamentos: ${selectedProfile.paymentHistory}
• Capacidade de Endividamento: Adequada
• Garantias Disponíveis: Verificadas
• Risco de Inadimplência: ${selectedProfile.status === "Premium" ? "Baixo" : selectedProfile.status === "Standard" ? "Médio" : "Alto"}

Análise de Risco Climático:
• Exposição a Secas: Moderada
• Vulnerabilidade a Cheias: Baixa
• Sistemas de Irrigação: Implementados
• Seguros Climáticos: ${selectedProfile.status === "Premium" ? "Activos" : "Recomendados"}

Análise de Risco Biótico:
• Histórico de Pragas: Controlado
• Medidas Preventivas: Em vigor
• Certificações Fitossanitárias: Válidas
• Programa de Monitoramento: Activo

RECOMENDAÇÕES:
1. ${selectedProfile.status === "Premium" ? "Manter linha de crédito preferencial" : "Melhorar score através de pagamentos regulares"}
2. Implementar sistemas de mitigação de riscos climáticos
3. Manter programa de controle fitossanitário activo
4. Renovar certificações e seguros periodicamente

PARECER FINAL:
Produtor classificado como ${selectedProfile.status}, apresentando ${selectedProfile.status === "Premium" ? "excelente" : selectedProfile.status === "Standard" ? "bom" : "razoável"} histórico de pagamentos e gestão operacional. ${selectedProfile.status === "Premium" ? "Recomenda-se aprovação de crédito com condições preferenciais." : "Recomenda-se aprovação de crédito com garantias adequadas."}
`;

    const tables = [
      {
        headers: ["Indicador", "Score", "Classificação"],
        rows: creditScoreData
          ? creditScoreData.map((item: any) => [
              item.subject,
              item.A.toString(),
              item.A >= 80 ? "Excelente" : item.A >= 60 ? "Bom" : "Regular",
            ])
          : [],
      },
    ];

    exportReport(
      "pdf",
      {
        title: "Análise de Risco e Crédito Agrícola",
        category: "Avaliação de Risco",
        additionalInfo: {
          Agricultor: selectedProfile.name,
          Fazenda: selectedProfile.farm,
          "Score de Crédito": `${selectedProfile.creditScore}/1000`,
          Status: selectedProfile.status,
          "Data da Análise": new Date().toLocaleDateString("pt-AO"),
        },
      },
      content,
      tables,
    );
  };

  // ========================
  // RENDERIZAÇÃO CONDICIONAL
  // ========================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Carregando análise de risco...
          </p>
        </div>
      </div>
    );
  }

  // Verificar se há dados disponíveis
  if (!farmerProfiles || farmerProfiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Nenhum perfil de agricultor disponível
          </p>
        </div>
      </div>
    );
  }

  // Garantir que selectedProfile está definido
  if (!selectedProfile) {
    return null;
  }

  // ========================
  // RENDERIZAÇÃO PRINCIPAL
  // ========================

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* ============================================ */}
      {/* SEÇÃO 1: INDICADORES MACRO DE RISCO */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Painel Principal de Inteligência */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-10">
          <div className="flex-grow space-y-8">
            {/* Título da Seção */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-[24px]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">
                  Inteligência de Risco & Crédito
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
                  Análise Preditiva de Solvabilidade Agro-Financeira
                </p>
              </div>
            </div>

            {/* Grid de Estatísticas Macro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MACRO_RISK_STATS.map((stat, i) => (
                <div
                  key={i}
                  className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all hover:border-agriYellow group"
                >
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    {stat.label}
                  </p>
                  <p className={`text-xl font-black ${stat.color} uppercase`}>
                    {stat.val}
                  </p>
                  <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
                    <div
                      className={`h-full ${stat.bg.replace("/10", "")} w-2/3 group-hover:w-full transition-all duration-700`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selo de Garantia SIG */}
          <div className="md:w-72 bg-agriGreen p-8 rounded-[35px] shadow-2xl text-white relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <Landmark className="w-40 h-48" />
            </div>
            <div className="relative z-10">
              <h4 className="text-lg font-black mb-2 uppercase tracking-tighter">
                Selo de Garantia <span className="text-agriYellow">SIG</span>
              </h4>
              <p className="text-emerald-200 text-[10px] font-medium leading-relaxed uppercase tracking-wide opacity-80">
                Dados certificados para o BNA e instituições bancárias.
              </p>
            </div>
            <button className="w-full mt-8 bg-agriYellow text-agriGreen font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl hover:bg-white transition-all active:scale-95 relative z-10">
              Auditória Bancária
            </button>
          </div>
        </div>

        {/* Alerta IA de Risco Imediato */}
        <div className="bg-rose-50 dark:bg-rose-950/20 p-8 rounded-[40px] border border-rose-100 dark:border-rose-900/30 flex flex-col justify-between relative overflow-hidden">
          <AlertTriangle className="absolute -right-4 -top-4 w-24 h-24 text-rose-500 opacity-10" />
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-rose-600 animate-pulse" />
              <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">
                Alerta Biótico IA
              </h5>
            </div>
            <p className="text-xs font-bold text-rose-800 dark:text-rose-400 leading-relaxed uppercase">
              Risco de Pragas Migratórias: ALTO
            </p>
            <p className="text-[10px] text-rose-600/70 dark:text-rose-500 mt-2 font-medium">
              Detectado padrão anómalo de calor em Malanje compatível com o
              surgimento de Lagarta do Funil.
            </p>
          </div>
          <button className="text-[9px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2 hover:underline">
            Ver Mapa de Dispersão <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* SEÇÃO 2: ANÁLISE DE CRÉDITO DETALHADA */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Painel Esquerdo: Lista de Agricultores */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-fit">
          {/* Barra de Pesquisa */}
          <div className="mb-10 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar por NIF ou Nome..."
              className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl text-xs font-bold focus:ring-2 focus:ring-agriYellow outline-none transition-all dark:text-white"
            />
          </div>

          {/* Lista de Produtores */}
          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-2">
            Carteira de Produtores para Crédito
          </h5>
          <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {(farmerProfiles || []).map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProfile(p)}
                className={`w-full p-6 rounded-[30px] border transition-all flex items-center justify-between group ${selectedProfile.id === p.id ? "bg-agriGreen dark:bg-slate-800 border-agriGreen shadow-2xl" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}
              >
                <div className="flex items-center gap-4 text-left">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner ${selectedProfile.id === p.id ? "bg-agriYellow text-slate-900" : "bg-slate-100 dark:bg-slate-950 text-slate-400"}`}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-black uppercase tracking-tight ${selectedProfile.id === p.id ? "text-white" : "text-slate-800 dark:text-slate-200"}`}
                    >
                      {p.name}
                    </p>
                    <p
                      className={`text-[9px] font-bold uppercase tracking-widest ${selectedProfile.id === p.id ? "text-emerald-300" : "text-slate-400"}`}
                    >
                      {p.location} • {p.status}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-black ${selectedProfile.id === p.id ? "text-agriYellow" : p.score > 700 ? "text-emerald-600" : p.score > 500 ? "text-amber-600" : "text-rose-600"}`}
                  >
                    {p.score}
                  </p>
                  <p
                    className={`text-[8px] font-black uppercase tracking-tighter ${selectedProfile.id === p.id ? "text-white/40" : "text-slate-300"}`}
                  >
                    Credit Score
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Info Box sobre Score */}
          <div className="mt-10 p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-[30px] flex gap-4">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-[10px] text-blue-700 dark:text-blue-400 leading-relaxed font-black uppercase italic">
              O Score é calculado fundindo dados de NDVI de 5 anos com o
              histórico de escoamento logístico.
            </p>
          </div>
        </div>

        {/* Painel Direito: Passaporte Agrícola Detalhado */}
        <div className="lg:col-span-3 space-y-8">
          {/* Passaporte Agrícola Digital */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <Award className="w-64 h-64" />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10">
              <div>
                <h4 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                  Passaporte Agrícola Digital
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                  Certificado AC-{selectedProfile.id}0024 •{" "}
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />{" "}
                  Verificado via Blockchain
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                    selectedProfile.status === "Premium"
                      ? "bg-emerald-100 text-emerald-700"
                      : selectedProfile.status === "Standard"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {selectedProfile.status}
                </div>
                <button
                  onClick={handleExportRiskReport}
                  className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-agriYellow transition-all"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              {/* Radar Chart do Score */}
              <div className="space-y-6">
                <div className="h-64 bg-slate-50 dark:bg-slate-950 rounded-[40px] border border-slate-100 dark:border-slate-800 p-4 relative overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="75%"
                      data={creditScoreData || []}
                    >
                      <PolarGrid
                        stroke={
                          selectedProfile.status === "Premium"
                            ? "#10b98133"
                            : "#33415522"
                        }
                      />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fontSize: 9, fontWeight: 900, fill: "#64748b" }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 150]}
                        tick={false}
                        axisLine={false}
                      />
                      <Radar
                        name={selectedProfile.name}
                        dataKey="A"
                        stroke={
                          selectedProfile.status === "Premium"
                            ? "#10b981"
                            : "#fbbf24"
                        }
                        fill={
                          selectedProfile.status === "Premium"
                            ? "#10b981"
                            : "#fbbf24"
                        }
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="absolute top-4 right-4 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Análise Multilateral
                  </div>
                </div>

                <div className="p-6 bg-agriYellow/5 rounded-3xl border border-agriYellow/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Microscope className="w-5 h-5 text-agriYellow" />
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Parecer IA de Garantia
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
                    "A análise geoespacial de {selectedProfile.validatedArea}{" "}
                    confirma vigor acima da média histórica. O colateral
                    estimado em {selectedProfile.collateral} possui risco de
                    liquidez residual baixo devido ao acesso privilegiado ao Hub{" "}
                    {selectedProfile.location}."
                  </p>
                </div>
              </div>

              {/* Métricas de Garantia e Realidade */}
              <div className="flex flex-col justify-between">
                <div className="space-y-6">
                  <h5 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] border-b dark:border-slate-800 pb-4">
                    Indicadores de Colateral (Garantia)
                  </h5>

                  <div className="grid grid-cols-1 gap-4">
                    {COLLATERAL_INDICATORS(selectedProfile).map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 rounded-[24px] border border-slate-100 dark:border-slate-800 hover:border-agriYellow transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm ${item.color}`}
                          >
                            <item.icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-sm font-black text-slate-800 dark:text-white uppercase">
                          {item.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-agriYellow hover:text-slate-900 transition-all flex items-center justify-center gap-3 shadow-2xl mt-8">
                  <ArrowUpRight className="w-5 h-5" /> Enviar para Análise
                  Bancária
                </button>
              </div>
            </div>
          </div>

          {/* Matriz de Risco Territorial */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            {/* Header com Filtros */}
            <div className="flex justify-between items-center mb-10">
              <div>
                <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                  Matriz de Risco Territorial
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
                  Análise de Probabilidade vs Impacto {selectedProfile.location}
                </p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border dark:border-slate-700">
                {(["financial", "climate", "biotic"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveRiskTab(tab)}
                    className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeRiskTab === tab ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-agriYellow shadow-lg" : "text-slate-400"}`}
                  >
                    {tab === "financial"
                      ? "Financeiro"
                      : tab === "climate"
                        ? "Climático"
                        : "Biótico"}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Riscos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {RISK_MATRIX_DATA.map((risk, i) => (
                <div
                  key={i}
                  className={`p-8 rounded-[35px] border relative overflow-hidden group transition-all hover:scale-[1.03] ${
                    risk.color === "rose"
                      ? "bg-rose-50/50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30"
                      : risk.color === "amber"
                        ? "bg-amber-50/50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30"
                        : risk.color === "blue"
                          ? "bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30"
                          : "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30"
                  }`}
                >
                  <risk.icon
                    className={`w-8 h-8 mb-6 ${
                      risk.color === "rose"
                        ? "text-rose-500"
                        : risk.color === "amber"
                          ? "text-amber-500"
                          : risk.color === "blue"
                            ? "text-blue-500"
                            : "text-emerald-500"
                    }`}
                  />
                  <h5 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-widest mb-4">
                    {risk.type}
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[9px] font-black uppercase">
                      <span className="text-slate-400">Probabilidade</span>
                      <span
                        className={
                          risk.prob === "Alta"
                            ? "text-rose-500"
                            : "text-slate-500"
                        }
                      >
                        {risk.prob}
                      </span>
                    </div>
                    <div className="flex justify-between text-[9px] font-black uppercase">
                      <span className="text-slate-400">Impacto</span>
                      <span
                        className={
                          risk.impact === "Crítico"
                            ? "text-rose-500"
                            : "text-slate-500"
                        }
                      >
                        {risk.impact}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* SEÇÃO 3: BANNER DE ENGAJAMENTO */}
      {/* ============================================ */}
      <div className="bg-agriGreen p-12 rounded-[50px] shadow-2xl text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group">
        <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <TrendingUp className="w-80 h-80" />
        </div>
        <div className="w-24 h-24 bg-agriYellow rounded-[35px] flex-shrink-0 flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.3)] border-4 border-white">
          <Award className="w-12 h-12 text-agriGreen" />
        </div>
        <div className="flex-grow text-center md:text-left space-y-2">
          <h4 className="text-3xl font-black uppercase tracking-tighter">
            Deseja Construir o Seu Histórico de Crédito?
          </h4>
          <p className="text-emerald-200 text-xs font-medium leading-relaxed max-w-2xl opacity-80 uppercase tracking-widest">
            Agricultores que utilizam os Hubs AgriConnect e registam as
            colheitas via GPS possuem 3x mais probabilidade de obter
            financiamento bancário com taxas reduzidas.
          </p>
        </div>
        <div className="flex-shrink-0 relative z-10">
          <button className="bg-white text-agriGreen px-10 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-agriYellow hover:scale-[1.05] transition-all shadow-2xl active:scale-95">
            Registar Safra Digital
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;
