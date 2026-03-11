import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import L from "leaflet";
import "leaflet.heat";
import {
  Globe,
  Wind,
  Thermometer,
  Droplets,
  Plus,
  Minus,
  X,
  RefreshCw,
  Activity,
  Leaf,
  ShieldAlert,
  ChevronRight,
  Layout,
  Map as MapIcon,
  Sun,
  Droplet,
  Microscope,
  Download,
  Orbit,
  Radio,
  Layers,
  TrendingUp,
  Filter,
  Calendar,
  GitCompare,
} from "lucide-react";
import {
  fetchProvinceWeather,
  WeatherData,
} from "../../services/weatherService";
import {
  fetchAgriHealthInsights,
  AgriHealthData,
  fetch7DayIntel,
  DailyIntel,
  fetchMultiYearIntel,
  YearlyIntel,
} from "../../services/agriIntelService";
import { geoData } from "../../components/shared/FilterStrip";
import { exportReport } from "../../utils/exportUtils";

interface GeointelligenceProps {
  filters: {
    province: string;
    municipality: string;
    commune: string;
  };
}

interface POI {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: "farm" | "hub" | "risk";
  ndvi: number;
  pestLevel: number;
  moisture: number;
  elevation: number;
  status: string;
  cropType?: string;
  area?: number;
  lastUpdate?: string;
}

interface AdvancedFilters {
  cropType: string;
  statusFilter: string;
  ndviMin: number;
  ndviMax: number;
  pestLevelMax: number;
  showHeatmap: boolean;
}

interface ComparisonPeriod {
  label: string;
  data: DailyIntel | YearlyIntel;
}

const locationAtlas: Record<
  string,
  { lat: number; lng: number; zoom: number }
> = {
  nacional: { lat: -12.33, lng: 17.53, zoom: 6 },
  bengo: { lat: -8.58, lng: 13.66, zoom: 9 },
  benguela: { lat: -12.58, lng: 13.41, zoom: 9 },
  bie: { lat: -12.38, lng: 16.94, zoom: 9 },
  cabinda: { lat: -5.55, lng: 12.19, zoom: 10 },
  cuando_cubango: { lat: -14.65, lng: 17.68, zoom: 8 },
  cuanza_norte: { lat: -9.28, lng: 14.91, zoom: 9 },
  cuanza_sul: { lat: -11.19, lng: 15.01, zoom: 9 },
  cunene: { lat: -16.45, lng: 15.75, zoom: 9 },
  huambo: { lat: -12.77, lng: 15.74, zoom: 10 },
  huila: { lat: -14.91, lng: 13.49, zoom: 9 },
  luanda: { lat: -8.83, lng: 13.23, zoom: 11 },
  lunda_norte: { lat: -8.42, lng: 20.57, zoom: 8 },
  lunda_sul: { lat: -10.33, lng: 20.4, zoom: 9 },
  malanje: { lat: -9.54, lng: 16.34, zoom: 9 },
  moxico: { lat: -11.78, lng: 19.92, zoom: 8 },
  namibe: { lat: -15.2, lng: 12.15, zoom: 9 },
  uige: { lat: -7.61, lng: 15.06, zoom: 9 },
  zaire: { lat: -6.27, lng: 14.24, zoom: 9 },
};

// Função para buscar POIs reais da API
const fetchPOIsFromAPI = async (
  _province: string,
  _municipality?: string,
  _commune?: string,
): Promise<POI[]> => {
  try {
    // Simulação de chamada API - substitua por endpoint real
    await new Promise((resolve) => setTimeout(resolve, 600));

    const baseData = [
      {
        id: "F-001",
        lat: -12.85,
        lng: 15.51,
        name: "Fazenda Caála Sul",
        type: "farm" as const,
        cropType: "Milho",
        area: 45,
      },
      {
        id: "F-002",
        lat: -13.05,
        lng: 15.45,
        name: "Unidade Catata I",
        type: "farm" as const,
        cropType: "Mandioca",
        area: 32,
      },
      {
        id: "F-003",
        lat: -12.95,
        lng: 15.65,
        name: "Agro Huambo Norte",
        type: "farm" as const,
        cropType: "Feijão",
        area: 28,
      },
      {
        id: "F-004",
        lat: -12.7,
        lng: 15.55,
        name: "Quinta São Miguel",
        type: "farm" as const,
        cropType: "Milho",
        area: 52,
      },
      {
        id: "H-001",
        lat: -9.42,
        lng: 16.03,
        name: "Hub Logístico Cacuso",
        type: "hub" as const,
        area: 0,
      },
      {
        id: "H-002",
        lat: -12.77,
        lng: 15.74,
        name: "Hub Central Huambo",
        type: "hub" as const,
        area: 0,
      },
      {
        id: "R-001",
        lat: -12.9,
        lng: 15.6,
        name: "Zona de Risco - Praga Detectada",
        type: "risk" as const,
        area: 0,
      },
    ];

    return baseData.map((poi) => ({
      ...poi,
      ndvi: 0.55 + Math.random() * 0.35,
      pestLevel: Math.floor(Math.random() * 60),
      moisture: 30 + Math.floor(Math.random() * 50),
      elevation: 1100 + Math.floor(Math.random() * 800),
      status:
        poi.type === "hub"
          ? "Operacional"
          : Math.random() > 0.7
            ? "Alerta"
            : "Normal",
      lastUpdate: new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Erro ao buscar POIs:", error);
    return [];
  }
};

const Geointelligence: React.FC<GeointelligenceProps> = ({ filters }) => {
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [selectedTemporalDetail, setSelectedTemporalDetail] = useState<
    DailyIntel | YearlyIntel | null
  >(null);
  const [is3DMode, setIs3DMode] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [agriHealth, setAgriHealth] = useState<AgriHealthData | null>(null);
  const [temporalData, setTemporalData] = useState<DailyIntel[]>([]);
  const [forecastData, setForecastData] = useState<DailyIntel[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyIntel[]>([]);
  const [viewScope, setViewScope] = useState<"weekly" | "yearly">("weekly");
  const [forecastMode, setForecastMode] = useState<"history" | "forecast">(
    "history",
  );
  const [loading, setLoading] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(6);
  const [pois, setPois] = useState<POI[]>([]);
  const [solarRadiation, setSolarRadiation] = useState<number>(512);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPeriods, setComparisonPeriods] = useState<
    ComparisonPeriod[]
  >([]);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    cropType: "todos",
    statusFilter: "todos",
    ndviMin: 0,
    ndviMax: 1,
    pestLevelMax: 100,
    showHeatmap: false,
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const labelsRef = useRef<L.LayerGroup | null>(null);
  const heatmapRef = useRef<L.Layer | null>(null);
  const tile3DRef = useRef<L.TileLayer | null>(null);

  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Otimização: Filtrar POIs com useMemo
  const filteredPOIs = useMemo(() => {
    return pois.filter((poi) => {
      if (
        advancedFilters.cropType !== "todos" &&
        poi.cropType !== advancedFilters.cropType
      )
        return false;
      if (
        advancedFilters.statusFilter !== "todos" &&
        poi.status !== advancedFilters.statusFilter
      )
        return false;
      if (
        poi.ndvi < advancedFilters.ndviMin ||
        poi.ndvi > advancedFilters.ndviMax
      )
        return false;
      if (poi.pestLevel > advancedFilters.pestLevelMax) return false;
      return true;
    });
  }, [pois, advancedFilters]);

  // Otimização: Calcular estatísticas com useMemo
  const statistics = useMemo(() => {
    const total = filteredPOIs.length;
    const avgNDVI =
      total > 0
        ? filteredPOIs.reduce((sum, poi) => sum + poi.ndvi, 0) / total
        : 0;
    const highRisk = filteredPOIs.filter((poi) => poi.pestLevel > 50).length;
    const avgMoisture =
      total > 0
        ? filteredPOIs.reduce((sum, poi) => sum + poi.moisture, 0) / total
        : 0;
    return { total, avgNDVI, highRisk, avgMoisture };
  }, [filteredPOIs]);

  // Função para atualizar heatmap de pragas
  const updateHeatmap = useCallback(
    (show: boolean) => {
      if (!mapRef.current) return;

      if (heatmapRef.current) {
        mapRef.current.removeLayer(heatmapRef.current);
        heatmapRef.current = null;
      }

      if (show && filteredPOIs.length > 0) {
        const heatData = filteredPOIs
          .filter((poi) => poi.type === "farm" && poi.pestLevel > 20)
          .map(
            (poi) =>
              [poi.lat, poi.lng, poi.pestLevel / 100] as [
                number,
                number,
                number,
              ],
          );

        if (heatData.length > 0 && "heatLayer" in L) {
          heatmapRef.current = L.heatLayer(heatData, {
            radius: 35,
            blur: 25,
            maxZoom: 13,
            max: 1.0,
            gradient: {
              0.0: "#00ff00",
              0.5: "#ffff00",
              0.7: "#ff9900",
              1.0: "#ff0000",
            },
          }).addTo(mapRef.current);
        }
      }
    },
    [filteredPOIs],
  );

  const updateLabels = useCallback((zoom: number) => {
    if (!labelsRef.current) return;
    labelsRef.current.clearLayers();

    const currentProvince = filtersRef.current.province;

    if (zoom <= 8) {
      Object.entries(locationAtlas).forEach(([key, data]) => {
        if (key === "nacional") return;
        const labelIcon = L.divIcon({
          className: "province-label",
          html: `
            <div class="flex flex-col items-center">
              <div class="bg-slate-900/90 backdrop-blur-md border border-agriYellow/40 px-3 py-1.5 rounded-xl shadow-2xl transition-all hover:scale-110">
                <span class="text-[10px] font-black text-agriYellow uppercase tracking-[0.2em] whitespace-nowrap">${key.replace("_", " ")}</span>
              </div>
            </div>
          `,
          iconSize: [120, 40],
          iconAnchor: [60, 20],
        });
        L.marker([data.lat, data.lng], {
          icon: labelIcon,
          interactive: false,
        }).addTo(labelsRef.current!);
      });
    }

    if (zoom > 8 && zoom <= 11) {
      const prov =
        currentProvince !== "nacional" ? geoData[currentProvince] : null;
      if (prov) {
        const provBase = locationAtlas[currentProvince];
        Object.keys(prov.municipalities).forEach((m, idx) => {
          const offsetLat =
            (idx % 2 === 0 ? 0.2 : -0.2) * (Math.floor(idx / 2) + 1) * 0.15;
          const offsetLng =
            (idx % 3 === 0 ? 0.2 : -0.2) * (Math.floor(idx / 3) + 1) * 0.15;

          const mIcon = L.divIcon({
            className: "municipality-label",
            html: `<div class="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-xl shadow-2xl ring-1 ring-white/5"><span class="text-[9px] font-black text-white uppercase tracking-[0.15em]">${m}</span></div>`,
            iconSize: [100, 24],
          });
          L.marker([provBase.lat + offsetLat, provBase.lng + offsetLng], {
            icon: mIcon,
            interactive: false,
          }).addTo(labelsRef.current!);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initial = locationAtlas.nacional;
    const map = L.map(mapContainerRef.current, {
      center: [initial.lat, initial.lng],
      zoom: initial.zoom,
      zoomControl: false,
      preferCanvas: true, // Performance boost
    });

    // Camada satelital principal
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "ESRI World Imagery" },
    ).addTo(map);

    // Camada de labels
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
      {
        pane: "shadowPane",
        opacity: 0.7,
      },
    ).addTo(map);

    // Camada 3D de terreno (opcional)
    tile3DRef.current = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
      { opacity: 0 },
    ).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    labelsRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    const handleZoom = () => {
      const zoom = map.getZoom();
      setCurrentZoom(zoom);
      updateLabels(zoom);
    };

    map.on("zoomend", handleZoom);
    updateLabels(initial.zoom);

    return () => {
      map.off("zoomend", handleZoom);
      map.remove();
      mapRef.current = null;
    };
  }, [updateLabels]);

  useEffect(() => {
    const updateIntel = async () => {
      setLoading(true);
      const locLabel = `${filters.commune !== "todas" ? filters.commune : filters.municipality !== "todos" ? filters.municipality : filters.province}`;

      try {
        const [w, h, t, f, y, p] = await Promise.all([
          fetchProvinceWeather(
            filters.province,
            filters.municipality,
            filters.commune,
          ),
          fetchAgriHealthInsights(
            filters.province,
            filters.municipality,
            filters.commune,
          ),
          fetch7DayIntel(locLabel, "history"),
          fetch7DayIntel(locLabel, "forecast"),
          fetchMultiYearIntel(locLabel),
          fetchPOIsFromAPI(
            filters.province,
            filters.municipality,
            filters.commune,
          ),
        ]);

        setWeatherData(w);
        setAgriHealth(h);
        setTemporalData(t);
        setForecastData(f);
        setYearlyData(y);
        setPois(p);

        // Calcular radiação solar dinâmica baseada na temperatura e hora do dia
        const hour = new Date().getHours();
        const solarFactor = Math.sin(((hour - 6) * Math.PI) / 12); // Pico ao meio-dia
        const baseSolar = 450 + (w.temp - 20) * 5; // Base ajustada pela temperatura
        setSolarRadiation(
          Math.max(0, Math.round(baseSolar * Math.max(0, solarFactor))),
        );
      } catch (e) {
        console.error("Erro na telemetria:", e);
      } finally {
        setLoading(false);
      }

      if (mapRef.current) {
        const target =
          locationAtlas[filters.province.toLowerCase()] ||
          locationAtlas.nacional;
        let targetZoom = target.zoom;
        if (filters.commune !== "todas") targetZoom = 13;
        else if (filters.municipality !== "todos") targetZoom = 11;

        mapRef.current.flyTo([target.lat, target.lng], targetZoom, {
          duration: 1.5,
          easeLinearity: 0.35,
        });
      }
    };
    updateIntel();
  }, [filters.province, filters.municipality, filters.commune]);

  // Atualizar heatmap quando filtros mudarem
  useEffect(() => {
    updateHeatmap(advancedFilters.showHeatmap);
  }, [advancedFilters.showHeatmap, updateHeatmap]);

  // Alternar modo 3D
  useEffect(() => {
    if (!tile3DRef.current) return;
    tile3DRef.current.setOpacity(is3DMode ? 0.6 : 0);
  }, [is3DMode]);

  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;
    markersRef.current.clearLayers();

    filteredPOIs.forEach((poi) => {
      const color =
        poi.type === "farm"
          ? poi.pestLevel > 25
            ? "#f59e0b"
            : "#10b981"
          : "#3b82f6";
      const icon = L.divIcon({
        className: "custom-poi",
        html: `<div class="w-10 h-10 rounded-2xl border-2 border-white shadow-2xl flex items-center justify-center bg-white overflow-hidden transition-all hover:scale-125 hover:rotate-12"><div class="w-full h-full flex items-center justify-center" style="background-color: ${color}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M12 2L15 8L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8L12 2Z"/></svg></div></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      const marker = L.marker([poi.lat, poi.lng], { icon });

      // Funcionalidade de Zoom ao clicar no ícone
      marker.on("click", () => {
        setSelectedPOI(poi);
        if (mapRef.current) {
          mapRef.current.flyTo([poi.lat, poi.lng], 14, {
            duration: 1.5,
            easeLinearity: 0.25,
          });
        }
      });

      markersRef.current?.addLayer(marker);
    });
  }, [filteredPOIs]);

  const handleExportGeoReport = () => {
    const content = `
SUMÁRIO EXECUTIVO DE GEOINTELIGÊNCIA

Dados Meteorológicos:
• Temperatura: ${weatherData?.temp}°C
• Humidade: ${weatherData?.humidity}%
• Velocidade do Vento: ${weatherData?.windSpeed} km/h
• Radiação Solar: ${solarRadiation} W/m²

Indicadores Agronómicos:
• Score de Saúde: ${agriHealth?.healthScore || "N/A"}
• Risco de Pragas: ${agriHealth?.pestRisk || "N/A"}
• Pragas Dominantes: ${agriHealth?.dominantPests?.join(", ") || "N/A"}

Estatísticas de POIs:
• Total de Pontos Monitorados: ${statistics.total}
• NDVI Médio: ${statistics.avgNDVI.toFixed(2)}
• Pontos de Alto Risco: ${statistics.highRisk}
• Humidade Média do Solo: ${statistics.avgMoisture.toFixed(1)}%

RECOMENDAÇÕES TÉCNICAS:
${agriHealth?.recommendations?.map((rec, i) => `${i + 1}. ${rec}`).join("\n") || "Sem recomendações disponíveis"}

PARECER GEO-TÉCNICO IA:
"A assinatura espectral para este período em ${filters.province.toUpperCase()} sugere uma maturação uniforme das culturas. A predição de humidade aponta para uma colheita antecipada em 4.2% da área monitorizada."

AÇÕES RECOMENDADAS:
1. Continuar monitoramento regular via satélite Landsat-9
2. Aplicar irrigação complementar em áreas com NDVI < 0.5
3. Iniciar controle preventivo de pragas nas zonas identificadas
4. Avaliar antecipação de colheita nas áreas de alta maturação
`;

    const tables = [
      {
        headers: ["Data", "NDVI", "Temperatura", "Risco Pragas"],
        rows: temporalData.map((d) => [
          d.date,
          d.ndvi.toString(),
          `${d.temp}°C`,
          `${d.pestRisk}%`,
        ]),
      },
    ];

    exportReport(
      "pdf",
      {
        title: "Relatório de Geointeligência",
        category: "Monitoramento Satelital",
        province: filters.province,
        municipality: filters.municipality,
        commune: filters.commune,
        additionalInfo: {
          "Sistema de Captura": "Landsat-9 + Agri-Intelligence",
          "Score de Saúde": agriHealth?.healthScore.toString() || "N/A",
          "Pontos Monitorados": statistics.total.toString(),
          "Status de Risco": `${statistics.highRisk} Alto Risco`,
          "Risco de Pragas": agriHealth?.pestRisk || "N/A",
        },
      },
      content,
      tables,
    );
  };

  return (
    <div className="relative h-full animate-fluid flex flex-col gap-8 pb-10">
      <div className="h-[650px] w-full relative rounded-[48px] overflow-hidden bg-slate-950 shadow-2xl border-4 border-white dark:border-slate-800 group shrink-0">
        <div
          ref={mapContainerRef}
          className={`w-full h-full absolute inset-0 transition-all duration-1000 ${is3DMode ? "scale-105 perspective-[1200px] rotate-x-[12deg]" : "scale-100"}`}
        />

        <div className="absolute top-8 left-8 z-[1001] w-[340px] pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-2xl p-6 rounded-[40px] border border-white/10 shadow-2xl pointer-events-auto max-h-[80vh] overflow-hidden flex flex-col gap-6">
            <div className="flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-agriGreen rounded-xl flex items-center justify-center">
                  <Radio className="w-4 h-4 text-agriYellow animate-pulse" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">
                    Agro-Intelligence
                  </h4>
                  <p className="text-[8px] text-agriYellow font-black uppercase tracking-widest mt-1">
                    Sincronismo SIG Ativo
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                  Camada Zoom
                </span>
                <span className="text-[11px] font-black text-white font-mono">
                  {currentZoom.toFixed(1)}x
                </span>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4 py-10 flex flex-col items-center justify-center text-center">
                <RefreshCw className="w-8 h-8 text-agriYellow animate-spin mb-2" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Sincronizando Satélite...
                </p>
              </div>
            ) : (
              weatherData && (
                <div className="flex flex-col gap-5 flex-grow overflow-y-auto custom-scrollbar pr-1">
                  <div className="grid grid-cols-2 gap-3 shrink-0">
                    {[
                      {
                        icon: Thermometer,
                        color: "text-agriYellow",
                        label: "Temp",
                        val: `${weatherData.temp}°C`,
                      },
                      {
                        icon: Droplets,
                        color: "text-blue-400",
                        label: "Humi",
                        val: `${weatherData.humidity}%`,
                      },
                      {
                        icon: Sun,
                        color: "text-orange-400",
                        label: "Radiação",
                        val: `${solarRadiation} W/m²`,
                      },
                      {
                        icon: Wind,
                        color: "text-slate-300",
                        label: "Vento",
                        val: `${weatherData.windSpeed} km/h`,
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1"
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-sm font-black text-white">
                          {item.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 bg-white/5 p-5 rounded-[32px] border border-white/5 shrink-0">
                    <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Orbit className="w-3.5 h-3.5 text-agriYellow" />{" "}
                      Monitoramento Sentinel-2
                    </h5>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black">
                          <span className="text-white uppercase tracking-tighter">
                            Índice NDVI (Vigor)
                          </span>
                          <span className="text-emerald-500">0.82 High</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-emerald-500 w-[82%] shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black">
                          <span className="text-white uppercase tracking-tighter">
                            EVI (Maturidade)
                          </span>
                          <span className="text-blue-400">0.74 Opt</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-blue-500 w-[74%] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-blue-500/10 rounded-[32px] border border-blue-500/20 shrink-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                        Estatísticas Ativas
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">
                          POIs
                        </p>
                        <p className="text-lg font-black text-white">
                          {statistics.total}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">
                          NDVI Médio
                        </p>
                        <p className="text-lg font-black text-emerald-400">
                          {statistics.avgNDVI.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">
                          Alto Risco
                        </p>
                        <p className="text-lg font-black text-rose-400">
                          {statistics.highRisk}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">
                          Hum. Média
                        </p>
                        <p className="text-lg font-black text-blue-400">
                          {statistics.avgMoisture.toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-rose-500/10 rounded-[32px] border border-rose-500/20 shrink-0">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">
                        Alerta Biótico IA
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] text-white font-black uppercase tracking-tight">
                        Status: {agriHealth?.pestRisk || "Moderado"}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {agriHealth?.dominantPests.slice(0, 2).map((p, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-rose-500/20 text-rose-400 text-[8px] font-black rounded-lg border border-rose-500/10 uppercase tracking-widest"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            <div className="flex gap-3 shrink-0">
              <button
                onClick={() =>
                  setAdvancedFilters((prev) => ({
                    ...prev,
                    showHeatmap: !prev.showHeatmap,
                  }))
                }
                className={`flex-1 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-[0.25em] transition-all border flex items-center justify-center gap-2 ${
                  advancedFilters.showHeatmap
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-white/5 hover:bg-rose-500/20 text-white border-white/5"
                }`}
              >
                <Activity className="w-4 h-4" /> Heatmap
              </button>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex-1 py-4 bg-white/5 hover:bg-agriYellow hover:text-slate-900 rounded-[24px] text-[10px] font-black text-white uppercase tracking-[0.25em] transition-all border border-white/5 flex items-center justify-center gap-2"
              >
                <Filter className="w-4 h-4" /> Filtros
              </button>
            </div>
            <button
              onClick={handleExportGeoReport}
              className="w-full py-4 bg-white/5 hover:bg-agriYellow hover:text-slate-900 rounded-[24px] text-[10px] font-black text-white uppercase tracking-[0.25em] transition-all border border-white/5 shrink-0 flex items-center justify-center gap-3"
            >
              <Download className="w-4 h-4" /> Dossier Geo-Técnico
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 right-10 z-[1001] flex flex-col gap-4">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-[30px] p-2 border border-white/10 flex flex-col gap-2 shadow-2xl">
            <button
              onClick={() => mapRef.current?.zoomIn()}
              className="p-4 hover:bg-agriYellow hover:text-slate-900 text-white rounded-2xl transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => mapRef.current?.zoomOut()}
              className="p-4 hover:bg-agriYellow hover:text-slate-900 text-white rounded-2xl transition-all"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setIs3DMode(!is3DMode)}
            className={`p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-2xl ${is3DMode ? "bg-agriYellow text-slate-900" : "bg-slate-900/90 text-white border border-white/10"}`}
          >
            Vista 3D
          </button>
        </div>
      </div>

      <div className="space-y-8 px-2">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase flex items-center gap-4">
              <Activity className="w-9 h-9 text-agriYellow" /> Telemetria
              Temporal
            </h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
              Sincronização Landsat-9 e Safra Local em{" "}
              {filters.province.toUpperCase()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-2 rounded-2xl border dark:border-slate-800">
              <button
                onClick={() => setViewScope("weekly")}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewScope === "weekly" ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-agriYellow shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
              >
                7 Dias
              </button>
              <button
                onClick={() => setViewScope("yearly")}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewScope === "yearly" ? "bg-agriYellow text-slate-900 shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
              >
                Anual
              </button>
            </div>

            {viewScope === "weekly" && (
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-2 rounded-2xl border dark:border-slate-800">
                <button
                  onClick={() => setForecastMode("history")}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${forecastMode === "history" ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-agriYellow shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <Calendar className="w-3 h-3 inline mr-1" /> Histórico
                </button>
                <button
                  onClick={() => setForecastMode("forecast")}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${forecastMode === "forecast" ? "bg-blue-500 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <TrendingUp className="w-3 h-3 inline mr-1" /> Previsão
                </button>
              </div>
            )}

            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${
                showComparison
                  ? "bg-agriYellow text-slate-900 border-agriYellow"
                  : "bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-agriYellow"
              }`}
            >
              <GitCompare className="w-4 h-4" /> Comparar
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start relative min-h-[600px]">
          <div
            className={`bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-500 ease-in-out ${selectedTemporalDetail ? "w-full xl:w-[55%]" : "w-full"}`}
          >
            <div className="p-10 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-agriYellow/10 rounded-[24px] flex items-center justify-center">
                  <Layout className="w-7 h-7 text-agriYellow" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-[0.2em]">
                    Fluxo de Telemetria Master
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Registos Imutáveis Verificados
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/30 dark:bg-slate-800/30 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
                    <th className="px-10 py-7 border-b dark:border-slate-800">
                      {viewScope === "weekly" ? "Período" : "Ano"}
                    </th>
                    <th className="px-8 py-7 border-b dark:border-slate-800">
                      {viewScope === "weekly" ? "Temperatura" : "Precipitação"}
                    </th>
                    <th className="px-8 py-7 border-b dark:border-slate-800">
                      Saúde Vegetal
                    </th>
                    <th className="px-10 py-7 border-b dark:border-slate-800 text-right">
                      Acções
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[13px] font-bold text-slate-700 dark:text-slate-300 divide-y dark:divide-slate-800">
                  {(viewScope === "weekly"
                    ? forecastMode === "history"
                      ? temporalData
                      : forecastData
                    : yearlyData
                  ).map((item: DailyIntel | YearlyIntel, i: number) => (
                    <tr
                      key={i}
                      onClick={() => {
                        setSelectedTemporalDetail(item);
                        // Adicionar à comparação quando o painel está aberto
                        if (showComparison && comparisonPeriods.length < 3) {
                          const label =
                            "date" in item ? item.date : item.year.toString();
                          if (
                            !comparisonPeriods.find((p) => p.label === label)
                          ) {
                            setComparisonPeriods((prev) => [
                              ...prev,
                              { label, data: item },
                            ]);
                          }
                        }
                      }}
                      className={`hover:bg-agriYellow/5 dark:hover:bg-slate-800/60 transition-all cursor-pointer group ${
                        selectedTemporalDetail &&
                        (("date" in selectedTemporalDetail &&
                          "date" in item &&
                          selectedTemporalDetail.date === item.date) ||
                          ("year" in selectedTemporalDetail &&
                            "year" in item &&
                            selectedTemporalDetail.year === item.year))
                          ? "bg-agriYellow/10 border-l-8 border-agriYellow"
                          : ""
                      }`}
                    >
                      <td className="px-10 py-8 font-black uppercase tracking-tight text-slate-800 dark:text-white group-hover:text-agriYellow transition-colors">
                        {"date" in item ? item.date : item.year}
                      </td>
                      <td className="px-8 py-8">
                        {"temp" in item
                          ? `${item.temp}°C`
                          : `${item.rain}mm avg`}
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                            <div
                              className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                              style={{ width: `${item.ndvi * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-emerald-500 font-black font-mono">
                            {item.ndvi.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <ChevronRight
                          className={`w-6 h-6 inline-block transition-transform ${
                            selectedTemporalDetail &&
                            (("date" in selectedTemporalDetail &&
                              "date" in item &&
                              selectedTemporalDetail.date === item.date) ||
                              ("year" in selectedTemporalDetail &&
                                "year" in item &&
                                selectedTemporalDetail.year === item.year))
                              ? "translate-x-2 text-agriYellow"
                              : "text-slate-300"
                          }`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            className={`transition-all duration-500 ease-in-out shrink-0 sticky top-[100px] ${selectedTemporalDetail ? "w-full xl:w-[45%] opacity-100 translate-x-0" : "w-0 opacity-0 translate-x-12 overflow-hidden pointer-events-none"}`}
          >
            {selectedTemporalDetail && (
              <div className="bg-white dark:bg-slate-900 rounded-[48px] border-x border-t border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full overflow-hidden border-b-[15px] border-b-agriYellow">
                <div className="p-12 bg-slate-950 text-white relative overflow-hidden">
                  <button
                    onClick={() => setSelectedTemporalDetail(null)}
                    className="absolute top-10 right-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/50 hover:text-white z-20"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-agriYellow rounded-[20px] flex items-center justify-center text-slate-900 shadow-2xl">
                        <Radio className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] text-agriYellow font-black uppercase tracking-[0.4em]">
                        Auditoria Contextual Master
                      </span>
                    </div>
                    <h4 className="text-5xl font-black uppercase tracking-tighter mb-3 leading-none">
                      {"date" in selectedTemporalDetail
                        ? selectedTemporalDetail.date
                        : selectedTemporalDetail.year}
                    </h4>
                    <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.25em] flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Zona Agro-Industrial:{" "}
                      {filters.province.toUpperCase()}
                    </p>
                  </div>
                  <Layers className="absolute -right-16 -bottom-16 w-64 h-64 text-white/5 rotate-12" />
                </div>

                <div className="p-12 space-y-12 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-900/30 flex-grow">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 bg-white dark:bg-slate-950 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:border-agriYellow transition-all group">
                      <Sun className="w-8 h-8 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Insolação (Média)
                      </p>
                      <p className="text-3xl font-black text-slate-800 dark:text-white leading-none font-mono">
                        245{" "}
                        <span className="text-xs opacity-40 uppercase">
                          W/m²
                        </span>
                      </p>
                    </div>
                    <div className="p-8 bg-white dark:bg-slate-950 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all group">
                      <Droplet className="w-8 h-8 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Humidade Solo
                      </p>
                      <p className="text-3xl font-black text-slate-800 dark:text-white leading-none font-mono">
                        68.4%
                      </p>
                    </div>
                  </div>

                  <div className="p-10 bg-agriGreen/5 dark:bg-agriYellow/5 rounded-[48px] border border-agriGreen/10 dark:border-agriYellow/10 relative overflow-hidden">
                    <div className="flex items-center gap-5 mb-6 relative z-10">
                      <div className="w-12 h-12 bg-agriGreen text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <Microscope className="w-6 h-6" />
                      </div>
                      <h5 className="text-[12px] font-black text-agriGreen dark:text-agriYellow uppercase tracking-widest">
                        Parecer Geo-Técnico IA
                      </h5>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic relative z-10">
                      "A assinatura espectral para este período em{" "}
                      {filters.province.toUpperCase()} sugere uma maturação
                      uniforme das culturas. A predição de humidade aponta para
                      uma colheita antecipada em 4.2% da área monitorizada."
                    </p>
                  </div>

                  <button
                    onClick={handleExportGeoReport}
                    className="w-full py-6 bg-slate-950 text-agriYellow rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 border border-agriYellow/20"
                  >
                    <Download className="w-5 h-5" /> Exportar Relatório Master
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Painel de Filtros Avançados */}
      <div
        className={`fixed top-0 left-0 h-full w-[420px] z-[2003] transition-transform duration-500 ease-in-out transform ${showAdvancedFilters ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          <div className="p-10 bg-agriYellow relative overflow-hidden border-b-4 border-agriGreen">
            <button
              onClick={() => setShowAdvancedFilters(false)}
              className="absolute top-8 right-8 p-3 bg-slate-900/10 hover:bg-slate-900/20 rounded-full transition-all"
            >
              <X className="w-6 h-6 text-slate-900" />
            </button>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-900 rounded-[20px] flex items-center justify-center">
                  <Filter className="w-6 h-6 text-agriYellow" />
                </div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                  Filtros Avançados
                </h4>
              </div>
              <p className="text-slate-700 text-xs font-black uppercase tracking-widest">
                Refine a visualização por critérios específicos
              </p>
            </div>
          </div>

          <div className="flex-grow p-8 space-y-8 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-3 block">
                  Tipo de Cultura
                </span>
                <select
                  value={advancedFilters.cropType}
                  onChange={(e) =>
                    setAdvancedFilters((prev) => ({
                      ...prev,
                      cropType: e.target.value,
                    }))
                  }
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-agriYellow"
                >
                  <option value="todos">Todas as Culturas</option>
                  <option value="Milho">Milho</option>
                  <option value="Mandioca">Mandioca</option>
                  <option value="Feijão">Feijão</option>
                  <option value="Batata">Batata</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-3 block">
                  Status da Fazenda
                </span>
                <select
                  value={advancedFilters.statusFilter}
                  onChange={(e) =>
                    setAdvancedFilters((prev) => ({
                      ...prev,
                      statusFilter: e.target.value,
                    }))
                  }
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-agriYellow"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="Normal">Normal</option>
                  <option value="Alerta">Alerta</option>
                  <option value="Operacional">Operacional</option>
                </select>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                    NDVI Mínimo
                  </span>
                  <span className="text-sm font-black text-agriYellow">
                    {advancedFilters.ndviMin.toFixed(2)}
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={advancedFilters.ndviMin}
                  onChange={(e) =>
                    setAdvancedFilters((prev) => ({
                      ...prev,
                      ndviMin: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-agriYellow"
                />
              </div>

              <div>
                <label className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                    NDVI Máximo
                  </span>
                  <span className="text-sm font-black text-agriYellow">
                    {advancedFilters.ndviMax.toFixed(2)}
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={advancedFilters.ndviMax}
                  onChange={(e) =>
                    setAdvancedFilters((prev) => ({
                      ...prev,
                      ndviMax: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-agriYellow"
                />
              </div>

              <div>
                <label className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                    Nível Máx. de Pragas
                  </span>
                  <span className="text-sm font-black text-rose-500">
                    {advancedFilters.pestLevelMax}%
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={advancedFilters.pestLevelMax}
                  onChange={(e) =>
                    setAdvancedFilters((prev) => ({
                      ...prev,
                      pestLevelMax: parseInt(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                  Resultados
                </span>
                <span className="text-2xl font-black text-agriYellow">
                  {statistics.total}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">
                    NDVI
                  </p>
                  <p className="text-sm font-black text-emerald-500">
                    {statistics.avgNDVI.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">
                    Riscos
                  </p>
                  <p className="text-sm font-black text-rose-500">
                    {statistics.highRisk}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">
                    Humidade
                  </p>
                  <p className="text-sm font-black text-blue-500">
                    {statistics.avgMoisture.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
            <button
              onClick={() => {
                setAdvancedFilters({
                  cropType: "todos",
                  statusFilter: "todos",
                  ndviMin: 0,
                  ndviMax: 1,
                  pestLevelMax: 100,
                  showHeatmap: false,
                });
              }}
              className="w-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black py-5 rounded-2xl uppercase tracking-[0.2em] hover:bg-slate-300 dark:hover:bg-slate-700 transition-all text-xs"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Painel de Comparação de Períodos */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-[400px] z-[2004] transition-transform duration-500 ease-in-out transform ${showComparison ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="h-full bg-white dark:bg-slate-900 border-t-4 border-agriYellow shadow-2xl flex flex-col">
          <div className="p-8 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-agriYellow rounded-2xl flex items-center justify-center">
                <GitCompare className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                  Comparação de Períodos
                </h4>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  Selecione até 3 períodos para análise comparativa
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowComparison(false)}
              className="p-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full transition-all"
            >
              <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
          </div>

          <div className="flex-grow p-8 overflow-x-auto">
            {comparisonPeriods.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  Clique em períodos na tabela acima para comparar
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6 h-full">
                {comparisonPeriods.map((period, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 dark:bg-slate-950 rounded-3xl border-2 border-agriYellow p-6 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h5 className="text-2xl font-black text-slate-800 dark:text-white mb-1">
                          {period.label}
                        </h5>
                        <span className="text-[10px] font-black text-agriYellow uppercase tracking-widest">
                          Período {idx + 1}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setComparisonPeriods((prev) =>
                            prev.filter((_, i) => i !== idx),
                          );
                        }}
                        className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4 flex-grow">
                      <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 rounded-2xl">
                        <span className="text-xs font-black text-slate-500 uppercase">
                          NDVI
                        </span>
                        <span className="text-xl font-black text-emerald-500">
                          {period.data.ndvi.toFixed(2)}
                        </span>
                      </div>
                      {"temp" in period.data && (
                        <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 rounded-2xl">
                          <span className="text-xs font-black text-slate-500 uppercase">
                            Temp
                          </span>
                          <span className="text-xl font-black text-orange-500">
                            {(period.data as DailyIntel).temp}°C
                          </span>
                        </div>
                      )}
                      {"rain" in period.data && (
                        <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 rounded-2xl">
                          <span className="text-xs font-black text-slate-500 uppercase">
                            Chuva
                          </span>
                          <span className="text-xl font-black text-blue-500">
                            {period.data.rain}mm
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-[460px] z-[2005] transition-transform duration-700 ease-in-out transform ${selectedPOI ? "translate-x-0" : "translate-x-full"}`}
      >
        {selectedPOI && (
          <div className="h-full bg-slate-950 text-white border-l border-white/10 shadow-2xl flex flex-col border-b-[15px] border-agriYellow">
            <div
              className={`p-12 relative overflow-hidden border-b-4 ${selectedPOI.pestLevel > 25 ? "border-amber-500 bg-amber-500/10" : "border-agriGreen bg-agriGreen/10"}`}
            >
              <button
                onClick={() => setSelectedPOI(null)}
                className="absolute top-10 right-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/50 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <MapIcon className="w-6 h-6 text-agriYellow" />
                  <span className="text-[11px] font-black text-agriYellow uppercase tracking-widest">
                    Ativo Geolocalizado v4.0
                  </span>
                </div>
                <h4 className="text-4xl font-black text-white tracking-tighter uppercase mb-2 leading-none">
                  {selectedPOI.name}
                </h4>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center gap-3">
                  <Activity className="w-4 h-4 text-agriYellow" />{" "}
                  MONITORIZAÇÃO: {selectedPOI.status}
                </p>
              </div>
            </div>
            <div className="flex-grow p-12 space-y-12 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 shadow-inner">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">
                    Saúde NDVI
                  </p>
                  <p className="text-5xl font-black text-white leading-none font-mono">
                    {selectedPOI.ndvi.toFixed(2)}
                  </p>
                </div>
                <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 shadow-inner">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">
                    Humidade Solo
                  </p>
                  <p className="text-5xl font-black text-white leading-none font-mono">
                    {selectedPOI.moisture}%
                  </p>
                </div>
              </div>

              {selectedPOI.cropType && (
                <div className="bg-agriYellow/10 border border-agriYellow/20 rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Leaf className="w-5 h-5 text-agriYellow" />
                    <span className="text-[10px] font-black text-agriYellow uppercase tracking-widest">
                      Tipo de Cultura
                    </span>
                  </div>
                  <p className="text-2xl font-black text-white">
                    {selectedPOI.cropType}
                  </p>
                  {selectedPOI.area && selectedPOI.area > 0 && (
                    <p className="text-sm text-slate-400 font-bold mt-2">
                      Área: {selectedPOI.area} hectares
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-6">
                <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">
                  Análise Topográfica
                </h5>
                <div className="flex justify-between items-center bg-white/5 p-6 rounded-[28px] border border-white/5">
                  <span className="text-[12px] font-black uppercase text-slate-400">
                    Altitude GPS
                  </span>
                  <span className="text-xl font-black text-white">
                    {selectedPOI.elevation}m
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-6 rounded-[28px] border border-white/5">
                  <span className="text-[12px] font-black uppercase text-slate-400">
                    Coordenadas
                  </span>
                  <span className="text-sm font-black text-white font-mono">
                    {selectedPOI.lat.toFixed(4)}, {selectedPOI.lng.toFixed(4)}
                  </span>
                </div>
                {selectedPOI.lastUpdate && (
                  <div className="flex justify-between items-center bg-white/5 p-6 rounded-[28px] border border-white/5">
                    <span className="text-[12px] font-black uppercase text-slate-400">
                      Última Atualização
                    </span>
                    <span className="text-xs font-black text-emerald-400">
                      {new Date(selectedPOI.lastUpdate).toLocaleString("pt-AO")}
                    </span>
                  </div>
                )}
              </div>

              {selectedPOI.pestLevel > 0 && (
                <div
                  className={`p-6 rounded-3xl border-2 ${
                    selectedPOI.pestLevel > 50
                      ? "bg-rose-500/20 border-rose-500"
                      : selectedPOI.pestLevel > 25
                        ? "bg-amber-500/20 border-amber-500"
                        : "bg-emerald-500/20 border-emerald-500"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert
                      className={`w-5 h-5 ${
                        selectedPOI.pestLevel > 50
                          ? "text-rose-500"
                          : selectedPOI.pestLevel > 25
                            ? "text-amber-500"
                            : "text-emerald-500"
                      }`}
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      Nível de Pragas
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-grow mr-4">
                      <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            selectedPOI.pestLevel > 50
                              ? "bg-rose-500"
                              : selectedPOI.pestLevel > 25
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }`}
                          style={{ width: `${selectedPOI.pestLevel}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-2xl font-black text-white font-mono">
                      {selectedPOI.pestLevel}%
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-12 border-t border-white/10 bg-slate-900/50 shrink-0">
              <button className="w-full bg-agriYellow text-slate-900 font-black py-6 rounded-3xl uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xs">
                Sincronizar Telemetria Realtime
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Geointelligence;
