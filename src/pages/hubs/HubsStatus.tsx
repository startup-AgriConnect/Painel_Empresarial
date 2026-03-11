import React, { useState, useRef, useEffect } from "react";
import L from "leaflet";
import { useFetch } from "../../services/hooks";
import { mockAPI } from "../../services/mockData";
import { Hub as HubType } from "../../types";
import {
  Boxes,
  Truck,
  Navigation,
  Weight,
  Clock,
  Map as MapIcon,
  Maximize2,
  X,
  LocateFixed,
  Plus,
  Minus,
  Activity,
  AlertTriangle,
  Search,
  Zap,
  LayoutGrid,
  TrendingUp,
  Package,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const HubsStatus: React.FC<{ province: string }> = ({ province }) => {
  const [selectedHub, setSelectedHub] = useState<HubType | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "grid">("map");

  const { data: hubsResponse, loading } = useFetch(
    () => mockAPI.hubs.list(),
    [],
  );

  const hubsData: HubType[] = hubsResponse || [];

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const filteredHubs =
    province === "nacional"
      ? hubsData
      : hubsData.filter(
          (h) => h.location?.toLowerCase() === province.toLowerCase(),
        );

  // Inicialização do Mapa (Estilo Radar)
  useEffect(() => {
    if (viewMode !== "map" || !mapContainerRef.current || mapRef.current)
      return;

    mapRef.current = L.map(mapContainerRef.current, {
      center: [-10.5, 17.5],
      zoom: 6,
      zoomControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "&copy; CARTO",
        subdomains: "abcd",
        maxZoom: 20,
      },
    ).addTo(mapRef.current);

    markersRef.current = L.layerGroup().addTo(mapRef.current);
    renderMarkers();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [viewMode]);

  // Re-renderizar marcadores quando a seleção ou filtros mudam
  useEffect(() => {
    renderMarkers();
    if (selectedHub && mapRef.current && selectedHub.lat && selectedHub.lng) {
      mapRef.current.flyTo([selectedHub.lat, selectedHub.lng], 10, {
        duration: 1.2,
      });
    }
  }, [selectedHub, filteredHubs]);

  const renderMarkers = () => {
    if (!markersRef.current || !mapRef.current) return;
    markersRef.current.clearLayers();

    filteredHubs.forEach((hub) => {
      const isSelected = selectedHub?.id === hub.id;
      const isCritical = (hub.capacity ?? 100) < 50;

      const icon = L.divIcon({
        className: "custom-hub-icon",
        html: `
          <div class="relative w-12 h-12 flex items-center justify-center transition-all ${isSelected ? "scale-125" : "hover:scale-110"}">
            ${isCritical ? '<div class="absolute inset-0 bg-rose-500 rounded-2xl animate-ping opacity-30"></div>' : ""}
            <div class="absolute inset-0 bg-slate-900 border-2 rounded-2xl transition-all shadow-2xl ${
              isSelected
                ? "border-agriYellow bg-agriYellow shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                : isCritical
                  ? "border-rose-500 bg-slate-900"
                  : "border-slate-700 bg-slate-800"
            }"></div>
            <div class="relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                stroke="${isSelected ? "#0f172a" : isCritical ? "#f43f5e" : "#fbbf24"}" 
                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44476 22 3 21.5501 3 20.9932V8L11 2L21 8Z"/>
                <path d="M3 8L11 14L21 8"/>
                <path d="M11 14V22"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });

      if (hub.lat && hub.lng) {
        const marker = L.marker([hub.lat, hub.lng], { icon });
        marker.on("click", () => setSelectedHub(hub));
        markersRef.current?.addLayer(marker);
      }
    });
  };

  const resetView = () => {
    mapRef.current?.flyTo([-10.5, 17.5], 6, { duration: 1.5 });
    setSelectedHub(null);
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-700">
      {/* Toolbar Superior Estratégica */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl transition-colors shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-agriGreen rounded-2xl flex items-center justify-center text-agriYellow shadow-lg">
            <Boxes className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none mb-1">
              Status de Hubs Logísticos
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
              {province === "nacional"
                ? "Rede Nacional de Angola"
                : `Província: ${province}`}{" "}
              • Monitorização SIG
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode("map")}
            className={`px-6 py-2.5 text-[10px] font-black rounded-xl transition-all flex items-center gap-2 uppercase tracking-widest ${viewMode === "map" ? "bg-white dark:bg-slate-700 text-agriGreen dark:text-agriYellow shadow-md" : "text-slate-500 hover:text-slate-700"}`}
          >
            <MapIcon className="w-4 h-4" /> Mapa Tático
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-6 py-2.5 text-[10px] font-black rounded-xl transition-all flex items-center gap-2 uppercase tracking-widest ${viewMode === "grid" ? "bg-white dark:bg-slate-700 text-agriGreen dark:text-agriYellow shadow-md" : "text-slate-500 hover:text-slate-700"}`}
          >
            <LayoutGrid className="w-4 h-4" /> Grelha Operacional
          </button>
        </div>
      </div>

      <div className="flex-grow relative min-h-[500px]">
        {/* VIEW 1: MAPA TÁTICO INTERATIVO (LEAFLET) - LAYOUT DIVIDIDO */}
        {viewMode === "map" && (
          <div className="h-full flex flex-col lg:flex-row gap-6">
            {/* MAPA - 65% da tela */}
            <div className="w-full lg:w-[65%] h-[400px] lg:h-full bg-slate-950 rounded-[32px] border-4 border-white dark:border-slate-800 shadow-2xl relative overflow-hidden group">
              <div
                ref={mapContainerRef}
                className="w-full h-full absolute inset-0 z-0"
              />

              {/* Floating HUD Controls */}
              <div className="absolute bottom-6 left-6 flex flex-col space-y-2 z-[1001]">
                <button
                  onClick={() => mapRef.current?.zoomIn()}
                  className="p-3 bg-slate-900/90 backdrop-blur-xl hover:bg-agriYellow hover:text-slate-900 text-white rounded-xl border border-white/10 shadow-xl transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => mapRef.current?.zoomOut()}
                  className="p-3 bg-slate-900/90 backdrop-blur-xl hover:bg-agriYellow hover:text-slate-900 text-white rounded-xl border border-white/10 shadow-xl transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="h-px bg-white/10 w-full my-1"></div>
                <button
                  onClick={resetView}
                  className="p-3 bg-agriYellow text-slate-900 rounded-xl border border-white/20 shadow-xl hover:bg-yellow-500 transition-all"
                >
                  <LocateFixed className="w-4 h-4" />
                </button>
              </div>

              {/* Legenda Flutuante */}
              <div className="absolute top-6 right-6 z-[1001] bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-agriYellow rounded-full"></div>
                    <span className="text-[9px] font-black text-white uppercase tracking-wider">
                      Operação Normal
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-black text-white uppercase tracking-wider">
                      Capacidade Crítica
                    </span>
                  </div>
                </div>
              </div>

              {/* Counter Badge */}
              <div className="absolute bottom-6 right-6 z-[1001] bg-slate-900/90 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 shadow-xl">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-agriYellow" />
                  <span className="text-white font-black text-sm">
                    {filteredHubs.length}
                  </span>
                  <span className="text-white/60 text-xs font-bold uppercase">
                    Hubs
                  </span>
                </div>
              </div>
            </div>

            {/* LISTA DE HUBS - 35% da tela */}
            <div className="w-full lg:w-[35%] h-[600px] lg:h-full">
              <div className="h-full bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
                {/* Header da Lista */}
                <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-agriGreen dark:to-emerald-800 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-agriYellow rounded-lg">
                        <LayoutGrid className="w-5 h-5 text-slate-900" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">
                          Hubs Instalados
                        </h4>
                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">
                          {filteredHubs.length} instalações ativas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase">
                        Online
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lista Scrollável */}
                <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-3">
                  {filteredHubs.map((hub) => (
                    <div
                      key={hub.id}
                      onClick={() => setSelectedHub(hub)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer group hover:shadow-lg hover:-translate-y-0.5 ${
                        selectedHub?.id === hub.id
                          ? "bg-agriYellow/10 border-agriYellow dark:bg-agriYellow/5"
                          : (hub.capacity ?? 100) < 50
                            ? "bg-rose-50 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/30 hover:border-rose-400"
                            : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-agriYellow/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-xl ${
                              selectedHub?.id === hub.id
                                ? "bg-agriYellow"
                                : (hub.capacity ?? 100) < 50
                                  ? "bg-rose-500"
                                  : "bg-emerald-500"
                            }`}
                          >
                            <Boxes className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h5 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none mb-1">
                              {hub.name}
                            </h5>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                              <MapIcon className="w-3 h-3" /> {hub.location}
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] font-black px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg uppercase">
                          {hub.id}
                        </span>
                      </div>

                      {/* Barra de Capacidade */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                            Ocupação
                          </span>
                          <span
                            className={`text-sm font-black ${
                              (hub.capacity ?? 100) < 50
                                ? "text-rose-500"
                                : "text-emerald-500"
                            }`}
                          >
                            {hub.capacity ?? 0}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              (hub.capacity ?? 100) < 50
                                ? "bg-rose-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${hub.capacity ?? 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Info Adicional */}
                      <div className="mt-3 flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                          <Weight className="w-3.5 h-3.5" />
                          <span className="font-bold">{hub.cargo} Ton</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-bold">{hub.nextTruck}</span>
                        </div>
                      </div>

                      {(hub.capacity ?? 100) < 50 && (
                        <div className="mt-3 flex items-center gap-2 p-2 bg-rose-100 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-900/50">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse flex-shrink-0" />
                          <p className="text-[9px] text-rose-700 dark:text-rose-400 font-bold uppercase">
                            Capacidade Crítica
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer da Lista com Stats */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-xl font-black text-emerald-500">
                        {
                          filteredHubs.filter((h) => (h.capacity ?? 100) >= 50)
                            .length
                        }
                      </div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                        Normal
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-black text-rose-500">
                        {
                          filteredHubs.filter((h) => (h.capacity ?? 100) < 50)
                            .length
                        }
                      </div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                        Crítico
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-black text-slate-700 dark:text-white">
                        {filteredHubs.reduce(
                          (sum, h) => sum + (h.cargo || 0),
                          0,
                        )}
                      </div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                        Ton Total
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: GRELHA OPERACIONAL (CARDS) */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto custom-scrollbar pb-10">
            {filteredHubs.map((hub) => (
              <div
                key={hub.id}
                onClick={() => setSelectedHub(hub)}
                className={`bg-white dark:bg-slate-900 p-8 rounded-[40px] border transition-all cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 ${(hub.capacity ?? 100) < 50 ? "border-rose-100 dark:border-rose-900/30" : "border-slate-200 dark:border-slate-800"}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-4 rounded-2xl ${(hub.capacity ?? 100) < 50 ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600" : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600"}`}
                  >
                    <Boxes className="w-6 h-6" />
                  </div>
                  <div
                    className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${(hub.capacity ?? 100) < 50 ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {hub.id}
                  </div>
                </div>

                <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2 group-hover:text-agriGreen dark:group-hover:text-agriYellow transition-colors">
                  {hub.name}
                </h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <MapIcon className="w-3.5 h-3.5 text-agriYellow" />{" "}
                  {hub.location}
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Ocupação do Hub
                    </span>
                    <span
                      className={`text-lg font-black ${(hub.capacity ?? 100) < 50 ? "text-rose-500" : "text-emerald-500"}`}
                    >
                      {hub.capacity ?? 0}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full transition-all duration-1000 ${(hub.capacity ?? 100) < 50 ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"}`}
                      style={{ width: `${hub.capacity ?? 0}%` }}
                    ></div>
                  </div>
                </div>

                {(hub.capacity ?? 100) < 50 && (
                  <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/30 flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
                    <p className="text-[10px] text-rose-700 dark:text-rose-400 font-bold uppercase">
                      Atenção: Capacidade Crítica.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* PAINEL LATERAL DE DETALHES (DRAWER) */}
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-[450px] bg-white dark:bg-slate-950 z-[2000] shadow-[0_0_80px_rgba(0,0,0,0.4)] transition-transform duration-500 ease-in-out transform flex flex-col border-l border-slate-200 dark:border-slate-800 ${selectedHub ? "translate-x-0" : "translate-x-full"}`}
        >
          {selectedHub && (
            <>
              {/* Header do Drawer */}
              <div
                className={`p-10 relative overflow-hidden border-b-4 ${(selectedHub.capacity ?? 100) < 50 ? "bg-rose-600 border-agriYellow" : "bg-slate-900 border-agriYellow"} text-white`}
              >
                <button
                  onClick={() => setSelectedHub(null)}
                  className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/70 hover:text-white z-20"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="relative z-10">
                  <span className="text-[10px] font-black px-3 py-1 bg-white/10 rounded-lg uppercase tracking-widest mb-4 inline-block">
                    {selectedHub.id}
                  </span>
                  <h4 className="text-4xl font-black tracking-tighter uppercase mb-2 leading-none">
                    {selectedHub.name}
                  </h4>
                  <div className="flex items-center gap-2 text-white/70 text-xs font-bold uppercase tracking-widest">
                    <MapIcon className="w-4 h-4 text-agriYellow" />{" "}
                    {selectedHub.location}, Angola
                  </div>
                </div>
                <Boxes className="absolute -right-12 -bottom-12 w-48 h-48 opacity-10 rotate-12" />
              </div>

              {/* Conteúdo do Drawer */}
              <div className="flex-grow overflow-y-auto p-10 space-y-10 custom-scrollbar">
                {/* Stats de Capacidade */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Ocupação Actual
                    </h5>
                    <span
                      className={`text-3xl font-black ${(selectedHub.capacity ?? 100) < 50 ? "text-rose-500" : "text-emerald-500"}`}
                    >
                      {selectedHub.capacity ?? 0}%
                    </span>
                  </div>
                  <div className="h-5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner p-1">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${(selectedHub.capacity ?? 100) < 50 ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]" : "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"}`}
                      style={{ width: `${selectedHub.capacity ?? 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* KPIs Cards */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-agriYellow">
                    <Weight className="w-6 h-6 text-agriYellow mb-4" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Carga em Stock
                    </p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">
                      {selectedHub.cargo}{" "}
                      <span className="text-xs opacity-40 uppercase">Ton</span>
                    </p>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-blue-500">
                    <Clock className="w-6 h-6 text-blue-500 mb-4" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Janela de Saída
                    </p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">
                      {selectedHub.nextTruck}
                    </p>
                  </div>
                </div>

                {/* Lista de Produtos */}
                <div className="space-y-6">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b dark:border-slate-800 pb-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-agriYellow" /> Commodities
                    Disponíveis
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {(selectedHub.products ?? []).map((p, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black text-slate-700 dark:text-agriYellow uppercase tracking-widest border border-slate-200 dark:border-slate-700"
                      >
                        {p.name} ({p.quantity} {p.unit})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Micro-Agregadores Section */}
                <div className="p-8 bg-agriGreen/5 dark:bg-agriYellow/5 rounded-[40px] border border-agriGreen/10 dark:border-agriYellow/10 relative group">
                  <div className="flex items-center gap-3 mb-4">
                    <Navigation className="w-6 h-6 text-agriGreen dark:text-agriYellow" />
                    <h5 className="text-[11px] font-black text-agriGreen dark:text-agriYellow uppercase tracking-widest">
                      Micro-Agregadores Ativos
                    </h5>
                  </div>
                  <p className="text-3xl font-black text-slate-800 dark:text-white leading-none">
                    {selectedHub.microAgents ?? 0}{" "}
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Agentes
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-3 font-medium italic leading-relaxed">
                    Cruzamento de dados SIG sugere alta eficiência de captação
                    rural.
                  </p>
                  <TrendingUp className="absolute right-8 bottom-8 w-12 h-12 text-agriGreen/10 group-hover:text-agriGreen/30 transition-colors" />
                </div>
              </div>

              {/* Botões de Acção do Drawer */}
              <div className="p-10 border-t dark:border-slate-800 bg-white dark:bg-slate-950 flex gap-4 shrink-0">
                <button className="flex-grow bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10">
                  <Maximize2 className="w-5 h-5 text-agriYellow" /> Telemetria
                  Master
                </button>
                <button className="p-5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-agriYellow transition-all shadow-lg">
                  <ShieldCheck className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HubsStatus;
