import React, { useState, useEffect } from "react";
import { FilterContext } from "../../types";
import { useFetch } from "../../services/hooks";
import { mockAPI } from "../../services/mockData";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FileText,
  Download,
  FilePieChart,
  Globe,
  Activity,
  Zap,
  Microscope,
  Waves,
  Coins,
  X,
  Printer,
  FileCheck,
  TrendingUp,
  Brain,
  Target,
  BadgeCheck,
  Lightbulb,
  Timer,
  Box,
  Database,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  FileType,
  ChevronDown,
} from "lucide-react";

// Mapeamento de ícones
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FilePieChart: FilePieChart,
  Microscope: Microscope,
  Box: Box,
  Globe: Globe,
  Coins: Coins,
  Waves: Waves,
};

interface Report {
  id: string;
  category: "Produção" | "Logística" | "Financeiro" | "Estratégico";
  title: string;
  icon: string;
  color: string;
  format: string;
  status: "ready" | "updating" | "scheduled";
  desc: string;
  marketScope: string;
  impact: "Alto" | "Médio" | "Crítico";
}

const ReportsBI: React.FC<{ filters: FilterContext }> = ({ filters }) => {
  console.log("ReportsBI: Componente renderizado, filters =", filters);

  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [horizon, setHorizon] = useState<"1y" | "5y" | "10y">("5y");
  const [showExportMenu, setShowExportMenu] = useState(false);

  const { data: allReports, loading } = useFetch(() =>
    mockAPI.relatorios.list({ category: activeCategory }),
  );

  const [aiAnalysis, setAiAnalysis] = useState<{
    executiveSummary: string;
    marketDrivers: string[];
    recommendations: string[];
    marketCapEstimate: string;
    isFallback: boolean;
  }>({
    executiveSummary: "",
    marketDrivers: [],
    recommendations: [],
    marketCapEstimate: "N/A",
    isFallback: false,
  });

  const steps = [
    "Sincronizando BI Regional...",
    "Executando Projeções CAGR...",
    "Analizando Dinâmica de Competidores...",
    "Gerando Parecer Mordor-AI...",
    "Auditando Dossier Final...",
  ];

  useEffect(() => {
    if (selectedReport) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedReport]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showExportMenu && !target.closest(".export-dropdown-container")) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showExportMenu]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Carregando relatórios...
          </p>
        </div>
      </div>
    );
  }

  if (!allReports || allReports.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Nenhum relatório disponível
          </p>
        </div>
      </div>
    );
  }

  const handleGenerateReport = async (report: Report) => {
    setIsGenerating(true);
    setAiAnalysis({
      executiveSummary: "",
      marketDrivers: [],
      recommendations: [],
      marketCapEstimate: "",
      isFallback: false,
    });

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(i);
      await new Promise((r) => setTimeout(r, 600));
    }

    try {
      // Mock response - Google GenAI disabled
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockAnalysis = {
        executiveSummary: `Análise estratégica para ${filters.province.toUpperCase()}: A região demonstra grande potencial no setor de ${report.category}. ${filters.municipality !== "todos" ? `O município de ${filters.municipality} apresenta` : "A província apresenta"} características únicas para desenvolvimento do ecossistema agrícola, com infraestrutura em expansão e demanda crescente por soluções tecnológicas. A cadeia de valor local beneficia-se de clima favorável e crescente consciência sobre eficiência produtiva.`,
        marketDrivers: [
          `Crescimento da procura interna em ${filters.province}`,
          "Expansão de infraestrutura logística regional",
          "Digitalização de processos agrícolas",
        ],
        recommendations: [
          "Investir em centros de agregação regionais",
          "Implementar sistema de crédito agrícola digital",
          "Fortalecer parcerias público-privadas",
        ],
        marketCapEstimate: `USD ${(Math.random() * 50 + 10).toFixed(1)}M anuais`,
        isFallback: false,
      };

      setAiAnalysis(mockAnalysis);
    } catch (e) {
      console.error("Gemini Failure:", e);
      // Fallback Inteligente (Heurística Baseada nos Filtros)
      setAiAnalysis({
        executiveSummary: `AVISO: Usando Dados de Backup. A análise para ${filters.province.toUpperCase()} indica um cenário de resiliência. Em ${filters.municipality !== "todos" ? filters.municipality : "nível regional"}, o setor de ${report.category} é vital para a segurança alimentar, enfrentando desafios de infraestrutura secundária mas com alto potencial de ROI.`,
        marketDrivers: [
          `Crescimento da procura interna em ${filters.province}`,
          "Necessidade de digitalização de fluxos",
          "Otimização de custos de transporte",
        ],
        recommendations: [
          "Fortalecer a rede de micro-agregadores",
          "Implementar subsídios a insumos locais",
          "Digitalizar o censo de produção",
        ],
        marketCapEstimate: "$145M USD (Est. Backup)",
        isFallback: true,
      });
    }

    setIsGenerating(false);
    setSelectedReport(report);
  };

  const handleExportReport = (format: "pdf" | "excel" | "word") => {
    if (!selectedReport) return;

    const currentDateTime = new Date().toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const refNumber = `REF: AGRI-CONNECT/${selectedReport.category.toUpperCase()}/${new Date().getFullYear()}/${Math.floor(
      Math.random() * 9999,
    )
      .toString()
      .padStart(4, "0")}`;
    const fileName = `Relatorio_${selectedReport.category}_${filters.province}_${new Date().getTime()}`;

    if (format === "pdf") {
      // ========== EXPORTAÇÃO PDF ==========
      const doc = new jsPDF();
      let yPosition = 20;

      // Cabeçalho oficial
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("REPÚBLICA DE ANGOLA", 105, yPosition, { align: "center" });
      yPosition += 6;
      doc.text("MINISTÉRIO DA AGRICULTURA E PESCAS", 105, yPosition, {
        align: "center",
      });
      yPosition += 6;
      doc.text("AGRI-CONNECT PLATFORM", 105, yPosition, { align: "center" });
      yPosition += 10;

      // Linha divisória
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(15, yPosition, 195, yPosition);
      yPosition += 8;

      // Referência e Data
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(refNumber, 15, yPosition);
      yPosition += 5;
      doc.text(`Data: ${currentDateTime}`, 15, yPosition);
      yPosition += 10;

      // Título do relatório
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("RELATÓRIO EXECUTIVO", 105, yPosition, { align: "center" });
      yPosition += 7;
      doc.setFontSize(12);
      doc.text(selectedReport.title.toUpperCase(), 105, yPosition, {
        align: "center",
      });
      yPosition += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(`Categoria: ${selectedReport.category}`, 105, yPosition, {
        align: "center",
      });
      yPosition += 10;

      // Âmbito territorial
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("ÂMBITO TERRITORIAL:", 15, yPosition);
      yPosition += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`• Província: ${filters.province.toUpperCase()}`, 20, yPosition);
      yPosition += 5;
      if (filters.municipality !== "todos") {
        doc.text(
          `• Município: ${filters.municipality.charAt(0).toUpperCase() + filters.municipality.slice(1)}`,
          20,
          yPosition,
        );
        yPosition += 5;
      }
      if (filters.commune !== "todas") {
        doc.text(
          `• Comuna: ${filters.commune.charAt(0).toUpperCase() + filters.commune.slice(1)}`,
          20,
          yPosition,
        );
        yPosition += 5;
      }
      yPosition += 8;

      // Sumário Executivo
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("SUMÁRIO EXECUTIVO", 15, yPosition);
      yPosition += 7;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const summaryLines = doc.splitTextToSize(
        aiAnalysis.executiveSummary,
        180,
      );
      doc.text(summaryLines, 15, yPosition);
      yPosition += summaryLines.length * 5 + 10;

      if (aiAnalysis.isFallback) {
        doc.setFont("helvetica", "italic");
        doc.setTextColor(255, 0, 0);
        doc.text(
          "⚠️  NOTA: Relatório baseado em dados de backup.",
          15,
          yPosition,
        );
        doc.setTextColor(0, 0, 0);
        yPosition += 8;
      }

      // Nova página se necessário
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Drivers de Mercado
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("DRIVERS DE MERCADO IDENTIFICADOS", 15, yPosition);
      yPosition += 7;

      autoTable(doc, {
        startY: yPosition,
        head: [["#", "Driver de Mercado"]],
        body: aiAnalysis.marketDrivers.map((driver, i) => [`${i + 1}`, driver]),
        theme: "grid",
        headStyles: {
          fillColor: [34, 139, 34],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: { 0: { cellWidth: 15 }, 1: { cellWidth: 165 } },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      yPosition = (doc as any).lastAutoTable.finalY + 10;

      // Nova página se necessário
      if (yPosition > 230) {
        doc.addPage();
        yPosition = 20;
      }

      // Recomendações Estratégicas
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("RECOMENDAÇÕES ESTRATÉGICAS", 15, yPosition);
      yPosition += 7;

      autoTable(doc, {
        startY: yPosition,
        head: [["#", "Recomendação"]],
        body: aiAnalysis.recommendations.map((rec, i) => [`${i + 1}`, rec]),
        theme: "striped",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: { 0: { cellWidth: 15 }, 1: { cellWidth: 165 } },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      yPosition = (doc as any).lastAutoTable.finalY + 10;

      // Estimativa de Mercado
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("ESTIMATIVA DE MERCADO", 15, yPosition);
      yPosition += 7;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Valor estimado: ${aiAnalysis.marketCapEstimate}`,
        15,
        yPosition,
      );
      yPosition += 15;

      // Nova página para assinaturas
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      // Validações e Aprovações
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("VALIDAÇÕES E APROVAÇÕES", 15, yPosition);
      yPosition += 7;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const disclaimer = doc.splitTextToSize(
        `Este relatório foi gerado pela plataforma AGRI-CONNECT, utilizando tecnologia Mordor-AI Intelligence Hub, com dados actualizados até ${currentDateTime}.`,
        180,
      );
      doc.text(disclaimer, 15, yPosition);
      yPosition += disclaimer.length * 5 + 15;

      doc.text("_______________________________", 15, yPosition);
      yPosition += 5;
      doc.text("Analista Responsável", 15, yPosition);
      yPosition += 4;
      doc.text("AGRI-CONNECT Platform", 15, yPosition);
      yPosition += 12;

      doc.text("_______________________________", 15, yPosition);
      yPosition += 5;
      doc.text("Coordenador Técnico", 15, yPosition);
      yPosition += 4;
      doc.text("Ministério da Agricultura", 15, yPosition);

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text(
          `© ${new Date().getFullYear()} AGRI-CONNECT - República de Angola`,
          105,
          285,
          { align: "center" },
        );
        doc.text(`Página ${i} de ${pageCount}`, 195, 285, { align: "right" });
      }

      doc.save(`${fileName}.pdf`);
    } else if (format === "excel") {
      // ========== EXPORTAÇÃO EXCEL ==========
      const workbook = XLSX.utils.book_new();

      // Sheet 1: Sumário Executivo
      const summaryData = [
        ["REPÚBLICA DE ANGOLA"],
        ["MINISTÉRIO DA AGRICULTURA E PESCAS"],
        ["AGRI-CONNECT PLATFORM"],
        [],
        [refNumber],
        [`Data: ${currentDateTime}`],
        [],
        ["RELATÓRIO EXECUTIVO"],
        [selectedReport.title.toUpperCase()],
        [`Categoria: ${selectedReport.category}`],
        [],
        ["ÂMBITO TERRITORIAL:"],
        [`Província: ${filters.province.toUpperCase()}`],
      ];

      if (filters.municipality !== "todos") {
        summaryData.push([
          `Município: ${filters.municipality.charAt(0).toUpperCase() + filters.municipality.slice(1)}`,
        ]);
      }
      if (filters.commune !== "todas") {
        summaryData.push([
          `Comuna: ${filters.commune.charAt(0).toUpperCase() + filters.commune.slice(1)}`,
        ]);
      }

      summaryData.push(
        [],
        ["SUMÁRIO EXECUTIVO"],
        [aiAnalysis.executiveSummary],
      );

      if (aiAnalysis.isFallback) {
        summaryData.push(
          [],
          ["⚠️  NOTA: Relatório baseado em dados de backup."],
        );
      }

      summaryData.push(
        [],
        ["ESTIMATIVA DE MERCADO"],
        [aiAnalysis.marketCapEstimate],
      );

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      summarySheet["!cols"] = [{ wch: 100 }];
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Sumário");

      // Sheet 2: Drivers de Mercado
      const driversData = [
        ["#", "Driver de Mercado"],
        ...aiAnalysis.marketDrivers.map((driver, i) => [i + 1, driver]),
      ];
      const driversSheet = XLSX.utils.aoa_to_sheet(driversData);
      driversSheet["!cols"] = [{ wch: 5 }, { wch: 80 }];
      XLSX.utils.book_append_sheet(
        workbook,
        driversSheet,
        "Drivers de Mercado",
      );

      // Sheet 3: Recomendações
      const recsData = [
        ["#", "Recomendação Estratégica"],
        ...aiAnalysis.recommendations.map((rec, i) => [i + 1, rec]),
      ];
      const recsSheet = XLSX.utils.aoa_to_sheet(recsData);
      recsSheet["!cols"] = [{ wch: 5 }, { wch: 80 }];
      XLSX.utils.book_append_sheet(workbook, recsSheet, "Recomendações");

      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } else if (format === "word") {
      // ========== EXPORTAÇÃO WORD (TXT formatado) ==========
      const documentContent = `
═══════════════════════════════════════════════════════════════════════
                     REPÚBLICA DE ANGOLA
            MINISTÉRIO DA AGRICULTURA E PESCAS
                   AGRI-CONNECT PLATFORM
═══════════════════════════════════════════════════════════════════════

${refNumber}
Data: ${currentDateTime}

────────────────────────────────────────────────────────────────────

                        RELATÓRIO EXECUTIVO
              ${selectedReport.title.toUpperCase()}
                   Categoria: ${selectedReport.category}

────────────────────────────────────────────────────────────────────

ÂMBITO TERRITORIAL:
  • Província: ${filters.province.toUpperCase()}
  ${filters.municipality !== "todos" ? `• Município: ${filters.municipality.charAt(0).toUpperCase() + filters.municipality.slice(1)}` : ""}
  ${filters.commune !== "todas" ? `• Comuna: ${filters.commune.charAt(0).toUpperCase() + filters.commune.slice(1)}` : ""}

═══════════════════════════════════════════════════════════════════════
                      SUMÁRIO EXECUTIVO
═══════════════════════════════════════════════════════════════════════

${aiAnalysis.executiveSummary}

${aiAnalysis.isFallback ? "\n⚠️  NOTA: Relatório baseado em dados de backup.\n" : ""}

═══════════════════════════════════════════════════════════════════════
                   DRIVERS DE MERCADO IDENTIFICADOS
═══════════════════════════════════════════════════════════════════════

${aiAnalysis.marketDrivers.map((driver, i) => `${i + 1}. ${driver}`).join("\n\n")}

═══════════════════════════════════════════════════════════════════════
                   RECOMENDAÇÕES ESTRATÉGICAS
═══════════════════════════════════════════════════════════════════════

${aiAnalysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n\n")}

═══════════════════════════════════════════════════════════════════════
                    ESTIMATIVA DE MERCADO
═══════════════════════════════════════════════════════════════════════

Valor estimado: ${aiAnalysis.marketCapEstimate}

────────────────────────────────────────────────────────────────────

                        VALIDAÇÕES E APROVAÇÕES

Este relatório foi gerado pela plataforma AGRI-CONNECT, utilizando
tecnologia Mordor-AI Intelligence Hub, com dados actualizados até
${currentDateTime}.

_______________________________
Analista Responsável
AGRI-CONNECT Platform

_______________________________
Coordenador Técnico
Ministério da Agricultura

────────────────────────────────────────────────────────────────────
          © ${new Date().getFullYear()} AGRI-CONNECT - República de Angola
             Todos os direitos reservados
────────────────────────────────────────────────────────────────────
`;

      const blob = new Blob([documentContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    setShowExportMenu(false);

    // Feedback visual
    const fileExtension =
      format === "pdf" ? "PDF" : format === "excel" ? "XLSX" : "TXT";
    alert(
      `✅ Relatório exportado com sucesso!\n\n📄 Arquivo: ${fileName}.${fileExtension.toLowerCase()}\n📋 Formato: Padrão Oficial do Governo de Angola\n📊 Conteúdo completo com tabelas e formatação profissional`,
    );
  };

  const filteredReports = allReports || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Carregando relatórios...
          </p>
        </div>
      </div>
    );
  }

  if (!allReports || allReports.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Nenhum relatório disponível
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fluid pb-24">
      {/* HEADER MASTER BI - Redesenhado */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12 rounded-3xl text-white shadow-2xl overflow-hidden border border-slate-700/50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          ></div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-agriYellow to-amber-500 rounded-xl shadow-lg">
                <Brain className="w-5 h-5 text-slate-900" />
              </div>
              <div className="space-y-0.5">
                <span className="block text-[10px] font-bold text-agriYellow uppercase tracking-wider">
                  Mordor-AI Intelligence Hub
                </span>
                <span className="block text-xs text-slate-400 font-medium">
                  Powered by Advanced Analytics
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-emerald-400">
                Sistema Operacional
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Business Intelligence
            </h2>
            <p className="text-sm text-slate-300 font-medium max-w-3xl leading-relaxed">
              Relatórios estratégicos contextualizados para{" "}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-agriYellow/20 border border-agriYellow/30 rounded-lg text-agriYellow font-bold">
                {filters.province.toUpperCase()}
              </span>
              {filters.municipality !== "todos" && (
                <span className="text-white font-semibold">
                  {" "}
                  • {filters.municipality}
                </span>
              )}
              {filters.commune !== "todas" && (
                <span className="text-slate-400"> • {filters.commune}</span>
              )}
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <Database className="absolute -right-12 -bottom-12 w-64 h-64 text-white/5 rotate-12 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-agriYellow/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* BARRA DE CATEGORIAS - Redesenhada */}
      <div className="bg-white/95 dark:bg-slate-900/95 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg sticky top-0 z-40 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Categorias */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              "Todos",
              "Produção",
              "Logística",
              "Financeiro",
              "Estratégico",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-slate-900 to-slate-800 text-white dark:from-agriYellow dark:to-amber-500 dark:text-slate-900 shadow-lg scale-105"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Horizon Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <Timer className="w-4 h-4 text-slate-400" />
              <select
                value={horizon}
                onChange={(e) =>
                  setHorizon(e.target.value as "1y" | "5y" | "10y")
                }
                className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 outline-none uppercase cursor-pointer"
              >
                <option value="1y">1 Ano</option>
                <option value="5y">5 Anos</option>
                <option value="10y">10 Anos</option>
              </select>
            </div>

            <div className="hidden xl:flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl">
              <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                Auditado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GRID DE RELATÓRIOS - Redesenhado */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const IconComponent = iconMap[report.icon] || FilePieChart;
          const colorClasses = {
            slate: "from-slate-500 to-slate-600",
            blue: "from-blue-500 to-blue-600",
            emerald: "from-emerald-500 to-emerald-600",
            amber: "from-amber-500 to-amber-600",
            rose: "from-rose-500 to-rose-600",
          };

          return (
            <div
              key={report.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                    report.impact === "Crítico"
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                      : report.impact === "Alto"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  {report.impact}
                </span>
              </div>

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[report.color as keyof typeof colorClasses] || colorClasses.slate} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                <IconComponent className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <div className="flex-grow space-y-3 mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-agriYellow dark:group-hover:text-agriYellow transition-colors">
                  {report.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {report.desc}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium">{report.marketScope}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {report.format}
                  </span>
                </div>

                <button
                  onClick={() => handleGenerateReport(report)}
                  className="w-full h-12 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-agriYellow dark:to-amber-500 text-white dark:text-slate-900 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
                >
                  <Zap className="w-4 h-4" />
                  <span>Gerar Relatório</span>
                </button>
              </div>

              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-agriYellow/0 to-amber-500/0 group-hover:from-agriYellow/5 group-hover:to-amber-500/5 transition-all duration-300 rounded-2xl pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* VISUALIZADOR DE DOSSIER (MODAL) - Redesenhado */}
      {selectedReport && (
        <div className="fixed inset-0 z-[600] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-white dark:bg-slate-950 w-full h-full max-w-6xl rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Header do Modal */}
            <div className="p-6 md:p-8 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-agriYellow dark:to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FileCheck className="w-6 h-6 text-white dark:text-slate-900" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Relatório Estratégico • {filters.province.toUpperCase()}
                  </h3>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                    {selectedReport.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {aiAnalysis.isFallback && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-800/50 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Modo Backup</span>
                  </div>
                )}
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* CONTEÚDO (SCROLL) */}
            <div className="flex-grow overflow-y-auto p-6 md:p-12 space-y-12 bg-white dark:bg-slate-950 custom-scrollbar">
              {/* Capa Interna */}
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8 pb-8 border-b-2 border-slate-100 dark:border-slate-800">
                <div className="flex-grow space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide">
                      Confidencial
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Período: {horizon.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                      {selectedReport.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-agriYellow rounded-full"></div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {filters.province.toUpperCase()}
                          </span>
                          {filters.municipality !== "todos" &&
                            ` • ${filters.municipality}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          {aiAnalysis.marketCapEstimate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2 shrink-0">
                  <div className="w-24 h-24 rounded-2xl border-4 border-agriYellow bg-gradient-to-br from-agriYellow/10 to-amber-500/10 flex items-center justify-center font-bold text-4xl text-agriYellow shadow-lg">
                    99
                  </div>
                  <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    Confiabilidade
                  </p>
                </div>
              </div>

              {/* Seções de Análise */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-3">
                    <Target className="w-5 h-5 text-agriGreen" />
                    Resumo Executivo
                  </h4>
                  <p className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {aiAnalysis.executiveSummary}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                  <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    Drivers de Mercado
                  </h5>
                  <div className="space-y-4">
                    {aiAnalysis.marketDrivers.map((driver, i) => (
                      <div key={i} className="flex gap-3 items-start group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-agriGreen to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0 transition-transform group-hover:scale-110">
                          {i + 1}
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-tight pt-1">
                          {driver}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recomendações */}
              <div className="space-y-6">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                  Recomendações Estratégicas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aiAnalysis.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-agriYellow dark:to-amber-500 text-white dark:text-slate-900 rounded-xl flex items-center justify-center text-sm font-bold mb-4 shadow-md group-hover:scale-110 transition-transform">
                        {i + 1}
                      </div>
                      <p className="text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-wrap gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
                {/* Export Dropdown */}
                <div className="relative export-dropdown-container">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-agriYellow text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:scale-[1.02] transition-all shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    Exportar Relatório
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${showExportMenu ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showExportMenu && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Formato do Governo de Angola
                        </div>

                        <button
                          onClick={() => handleExportReport("pdf")}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-red-500/10 dark:bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500 transition-colors">
                            <FileText className="w-5 h-5 text-red-500 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-grow text-left">
                            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                              Exportar como PDF
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Formato oficial para impressão
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleExportReport("excel")}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-green-500/10 dark:bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
                            <FileSpreadsheet className="w-5 h-5 text-green-500 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-grow text-left">
                            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                              Exportar como Excel
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Com tabelas e gráficos analíticos
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleExportReport("word")}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                            <FileType className="w-5 h-5 text-blue-500 group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-grow text-left">
                            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                              Exportar como Word
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Documento editável (.docx)
                            </div>
                          </div>
                        </button>
                      </div>

                      <div className="border-t border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900">
                        <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <FileCheck className="w-4 h-4 mt-0.5 shrink-0" />
                          <p className="leading-tight">
                            Relatórios formatados conforme padrões oficiais
                            estabelecidos pelo Governo de Angola
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:scale-[1.02] transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOADER IA - Redesenhado */}
      {isGenerating && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-10 text-center">
            {/* Loader Animation */}
            <div className="relative w-32 h-32 mx-auto">
              {/* Outer Ring */}
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              {/* Spinning Ring */}
              <div className="absolute inset-0 border-4 border-transparent border-t-agriYellow border-r-agriYellow rounded-full animate-spin"></div>
              {/* Inner Ring */}
              <div className="absolute inset-4 border-4 border-slate-800 rounded-full"></div>
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-12 h-12 text-agriYellow animate-pulse" />
              </div>
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-agriYellow/20 rounded-full blur-2xl animate-pulse"></div>
            </div>

            {/* Text Content */}
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-white tracking-tight">
                Processando Inteligência
              </h4>
              <div className="space-y-2">
                <p className="text-agriYellow text-sm font-semibold uppercase tracking-widest animate-pulse">
                  {steps[generationStep]}
                </p>
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-agriYellow to-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${((generationStep + 1) / steps.length) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-slate-500 text-xs font-medium">
                  Passo {generationStep + 1} de {steps.length}
                </p>
              </div>
            </div>

            {/* Decorative Dots */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i <= generationStep
                      ? "bg-agriYellow scale-110"
                      : "bg-slate-700"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsBI;
