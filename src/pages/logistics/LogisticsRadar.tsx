import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import { useFetch } from "../../services/hooks";
import { mockAPI } from "../../services/mockData";
import {
  Truck,
  Navigation,
  AlertCircle,
  Clock,
  X,
  Package,
  User,
  MapPin,
  TrendingUp,
  Weight,
  ShieldCheck,
  Navigation2,
  Activity,
  Maximize2,
  Plus,
  Minus,
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

interface Vehicle {
  id: string;
  type: "truck" | "kupapata";
  cargo: string;
  weight: string;
  driver: string;
  origin: string;
  destination: string;
  eta: string;
  status: string;
  lat: number;
  lng: number;
  rotation: number;
}

const LogisticsRadar: React.FC = () => {
  const { data: veiculosData, loading } = useFetch(
    () => mockAPI.veiculos.getAtivos(),
    [],
  );

  const activeVehicles: Vehicle[] = veiculosData || [];

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

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
  const prepareLogisticsData = (): {
    metadata: ExportMetadata;
    content: string;
    tables: TableData[];
  } => {
    const metadata: ExportMetadata = {
      title: "Relatório de Logística - Radar de Veículos",
      category: "Gestão Logística e Transporte",
      additionalInfo: {
        "Veículos Ativos": activeVehicles.length.toString(),
        "Veículos Online": "142",
        Sincronismo: "98.4%",
        "Data de Geração": new Date().toLocaleDateString("pt-AO"),
      },
    };

    // Conteúdo textual
    let content = "RESUMO EXECUTIVO - LOGÍSTICA\n\n";
    content +=
      "Este relatório apresenta o estado atual da frota de veículos no ";
    content +=
      "sistema AGRI-CONNECT, incluindo localização em tempo real, status ";
    content += "de entregas e rotas em andamento.\n\n";
    content += "ESTATÍSTICAS GERAIS:\n";
    content += `Total de Veículos Rastreados: ${activeVehicles.length}\n`;
    content += "Veículos Online: 142\n";
    content += "Otimizações de Rota: 38\n";
    content += "Índice de Sincronismo: 98.4%\n\n";

    // Análise por tipo de veículo
    const trucks = activeVehicles.filter((v) => v.type === "truck").length;
    const kupapatas = activeVehicles.filter(
      (v) => v.type === "kupapata",
    ).length;
    content += "DISTRIBUIÇÃO DA FROTA:\n";
    content += `Camiões: ${trucks}\n`;
    content += `Kupapatas: ${kupapatas}\n\n`;

    // Tabelas de dados
    const tables: TableData[] = [];

    // Tabela 1: Veículos Ativos
    if (activeVehicles.length > 0) {
      tables.push({
        headers: [
          "ID",
          "Tipo",
          "Carga",
          "Peso",
          "Condutor",
          "Origem",
          "Destino",
          "ETA",
          "Status",
        ],
        rows: activeVehicles.map((v) => [
          v.id,
          v.type === "truck" ? "Camião" : "Kupapata",
          v.cargo,
          v.weight,
          v.driver,
          v.origin,
          v.destination,
          v.eta,
          v.status,
        ]),
      });
    }

    // Tabela 2: Resumo Estatístico
    tables.push({
      headers: ["Métrica", "Valor", "Unidade"],
      rows: [
        ["Veículos Online", "142", "unidades"],
        ["Otimizações de Rota", "38", "processos"],
        ["Sincronismo GPS", "98.4", "%"],
        ["Camiões Ativos", trucks.toString(), "unidades"],
        ["Kupapatas Ativos", kupapatas.toString(), "unidades"],
      ],
    });

    return { metadata, content, tables };
  };

  // Handler para exportação PDF
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { metadata, content, tables } = prepareLogisticsData();
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
      const { metadata, content, tables } = prepareLogisticsData();
      exportToExcel(metadata, content, tables);
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      alert("Erro ao gerar arquivo Excel. Tente novamente.");
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      center: [-11.0, 16.0],
      zoom: 6,
      zoomControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      },
    ).addTo(mapRef.current);

    markersRef.current = L.layerGroup().addTo(mapRef.current);

    updateMarkers();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    updateMarkers();
  }, [selectedVehicle]);

  const updateMarkers = () => {
    if (!mapRef.current || !markersRef.current) return;
    markersRef.current.clearLayers();

    activeVehicles.forEach((v) => {
      const isSelected = selectedVehicle?.id === v.id;
      const icon = L.divIcon({
        className: "custom-vehicle-icon",
        html: `
          <div class="relative w-10 h-10 flex items-center justify-center transition-all ${isSelected ? "scale-125" : ""}">
            <div class="absolute inset-0 bg-slate-900 border-2 rounded-xl transition-all ${isSelected ? "border-agriYellow bg-agriYellow" : "border-slate-700 bg-slate-800"}"></div>
            <div class="relative z-10" style="transform: rotate(${v.rotation}deg)">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${isSelected ? "#0f172a" : v.type === "truck" ? "#94a3b8" : "#fbbf24"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${v.type === "truck" ? '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>' : '<polygon points="3 11 22 2 13 21 11 13 3 11"/>'}
              </svg>
            </div>
            ${isSelected ? '<div class="absolute inset-0 bg-agriYellow rounded-xl animate-ping opacity-30"></div>' : ""}
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([v.lat, v.lng], { icon });
      marker.on("click", () => setSelectedVehicle(v));
      markersRef.current?.addLayer(marker);
    });
  };

  const focusVehicle = (v: Vehicle) => {
    setSelectedVehicle(v);
    mapRef.current?.flyTo([v.lat, v.lng], 12, { duration: 1.5 });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full animate-in slide-in-from-bottom-4 duration-500">
      {/* Map Column */}
      <div className="lg:col-span-2 flex flex-col space-y-4">
        <div className="flex-grow bg-slate-950 rounded-[32px] border-4 border-white dark:border-slate-800 relative overflow-hidden shadow-2xl transition-colors min-h-[500px]">
          <div
            ref={mapContainerRef}
            className="w-full h-full absolute inset-0"
          />

          {/* Selected Vehicle Detail Overlay */}
          {selectedVehicle && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[450px] z-[1000] animate-in slide-in-from-top-4 duration-300">
              <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-white dark:border-slate-700 rounded-[32px] p-6 shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-agriYellow rounded-2xl flex items-center justify-center text-slate-900">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">
                        {selectedVehicle.cargo}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        {selectedVehicle.id} • {selectedVehicle.weight}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVehicle(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <User className="w-3 h-3" /> Condutor
                    </p>
                    <p className="text-xs font-black text-slate-700 dark:text-slate-200">
                      {selectedVehicle.driver}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Chegada Est.
                    </p>
                    <p className="text-xs font-black text-emerald-500">
                      {selectedVehicle.eta}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <MapPin className="w-4 h-4 text-agriYellow" />
                    <div className="flex-grow">
                      <p className="text-[8px] font-black text-slate-400 uppercase">
                        Percurso
                      </p>
                      <p className="text-[10px] font-black dark:text-slate-200">
                        {selectedVehicle.origin} → {selectedVehicle.destination}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase">
                      {selectedVehicle.status}
                    </span>
                  </div>
                  <button className="text-[9px] font-black text-agriYellow uppercase tracking-widest hover:underline">
                    Ver Telemetria
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-[1000]">
            <button
              onClick={() => mapRef.current?.zoomIn()}
              className="p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl shadow-xl hover:bg-agriYellow transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => mapRef.current?.zoomOut()}
              className="p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl shadow-xl hover:bg-agriYellow transition-all"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center text-emerald-600">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Veículos Online
              </p>
              <p className="text-xl font-black text-slate-800 dark:text-white leading-none">
                142
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex items-center justify-center text-blue-600">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Otimizações
              </p>
              <p className="text-xl font-black text-slate-800 dark:text-white leading-none">
                38
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/30 rounded-2xl flex items-center justify-center text-amber-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Sincronismo
              </p>
              <p className="text-xl font-black text-slate-800 dark:text-white leading-none">
                98.4%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Column */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
        <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h3 className="font-black text-xs text-slate-800 dark:text-white uppercase tracking-[0.2em]">
              Logística Live Feed
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
              Mapeamento em Tempo Real
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-3 py-1 rounded-full font-black flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>{" "}
              GPS ATIVO
            </span>

            {/* Botão de Exportação */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting}
                className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:from-slate-400 disabled:to-slate-300 rounded-xl text-[9px] font-black text-white uppercase transition-all shadow-lg hover:shadow-xl flex items-center gap-1.5 border border-emerald-700"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="hidden sm:inline">Exportando...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3 h-3" />
                    <span className="hidden sm:inline">Exportar</span>
                    <ChevronDown className="w-2.5 h-2.5" />
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
                          Relatório de logística completo
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
                          Dados de veículos e rotas
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {activeVehicles.map((v) => (
            <div
              key={v.id}
              onClick={() => focusVehicle(v)}
              className={`flex space-x-4 relative pb-2 group cursor-pointer transition-all ${selectedVehicle?.id === v.id ? "scale-[1.02]" : ""}`}
            >
              <div className="flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${selectedVehicle?.id === v.id ? "bg-agriYellow text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}
                >
                  {v.type === "truck" ? (
                    <Truck className="w-5 h-5" />
                  ) : (
                    <Navigation2 className="w-5 h-5" />
                  )}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h4
                    className={`text-xs font-black uppercase tracking-tight transition-colors ${selectedVehicle?.id === v.id ? "text-agriYellow" : "text-slate-800 dark:text-slate-100"}`}
                  >
                    {v.cargo}
                  </h4>
                  <span className="text-[9px] text-slate-400 font-black">
                    {v.eta}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  {v.origin} → {v.destination}
                </p>
              </div>
            </div>
          ))}

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-5 rounded-3xl flex items-start space-x-4">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-[10px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest mb-1">
                Alerta de Rota
              </h5>
              <p className="text-[11px] text-amber-600 dark:text-amber-500/80 leading-relaxed font-medium">
                Lentidão detectada na EN-230. Sugestão de desvio via Lucala
                disponível.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsRadar;
