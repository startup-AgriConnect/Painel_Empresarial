import React, { useState, useMemo } from "react";
import { useFetch } from "../../services/hooks";
import { mockAPI } from "../../services/mockData";
import { MicroAgregador } from "../../types";
import {
  Navigation,
  MapPin,
  Truck,
  Zap,
  Users,
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  MoreVertical,
  Activity,
  Locate,
  Navigation2,
  ChevronDown,
  ChevronUp,
  Weight,
  Cpu,
  X,
  Loader2,
} from "lucide-react";

// Função para mapear status do BD para formato UI
const mapStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    EM_TRANSITO: "In Transit",
    DISPONIVEL: "Idle",
    CARREGANDO: "Loading",
    MANUTENCAO: "Maintenance",
    INATIVO: "Inactive",
  };
  return statusMap[status] || "Idle";
};

// Função para gerar coordenadas simuladas para o mapa (baseado na posição real)
const generateCoords = (ma: MicroAgregador) => {
  // Simular coordenadas start/current/end com base no status
  const baseX = ((ma.longitude || 0) + 180) / 3.6; // Normalizar longitude para %
  const baseY = ((ma.latitude || 0) + 90) / 1.8; // Normalizar latitude para %

  if (ma.status === "EM_TRANSITO") {
    return {
      start: [Math.max(5, baseX - 20), Math.max(5, baseY - 10)],
      current: [baseX, baseY],
      end: [Math.min(95, baseX + 25), Math.min(95, baseY + 20)],
    };
  } else if (ma.status === "CARREGANDO") {
    return {
      start: [baseX, baseY],
      current: [Math.min(95, baseX + 2), Math.min(95, baseY + 1)],
      end: [Math.min(95, baseX + 30), Math.min(95, baseY + 25)],
    };
  } else {
    // Idle/Disponível - mesmo ponto
    return {
      start: [baseX, baseY],
      current: [baseX, baseY],
      end: [baseX, baseY],
    };
  }
};

const MicroAgregadores: React.FC = () => {
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const { data: microAgregadoresData, loading } = useFetch<MicroAgregador[]>(
    () => mockAPI.microAgregadores.list(),
    [],
  );

  // Transformar dados do BD para formato usado no componente
  const microFleet = useMemo(() => {
    if (!microAgregadoresData) return [];

    return microAgregadoresData.map((ma) => ({
      id: ma.codigo,
      name: ma.nome || `Agregador ${ma.codigo}`,
      vehicle: ma.modelo_veiculo || "N/A",
      status: mapStatus(ma.status),
      location: ma.localizacao_atual || "Localização desconhecida",
      load: ma.carga_atual || "0kg",
      efficiency: ma.eficiencia || "N/A",
      coords: generateCoords(ma),
      battery: ma.bateria_percentual ? `${ma.bateria_percentual}%` : "N/A",
      speed: ma.velocidade_atual ? `${ma.velocidade_atual} km/h` : "0 km/h",
    }));
  }, [microAgregadoresData]);

  const toggleTracking = (id: string) => {
    setTrackingId(trackingId === id ? null : id);
  };

  const selectedAgregador = microFleet.find((m) => m.id === trackingId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-agriYellow animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Micro-Agregadores",
            val: "124",
            icon: Users,
            color: "blue",
          },
          {
            label: "Volume Captado/Dia",
            val: "18.4 Ton",
            icon: TrendingUp,
            color: "emerald",
          },
          {
            label: "Aldeias Atendidas",
            val: "42",
            icon: MapPin,
            color: "amber",
          },
          {
            label: "Eficiência Rede",
            val: "92.4%",
            icon: Activity,
            color: "purple",
          },
        ].map((m, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors"
          >
            <div
              className={`p-3 bg-${m.color}-50 dark:bg-${m.color}-950/30 text-${m.color}-600 dark:text-${m.color}-400 rounded-2xl`}
            >
              <m.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {m.label}
              </p>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">
                {m.val}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fleet List with Integrated Map Tracking */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors flex flex-col">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                  <Truck className="w-4 h-4 text-agriYellow" /> Operações de
                  Captação Rural
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                  Sincronização GPS v2.4 Ativa
                </p>
              </div>
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="ID ou Agregador..."
                  className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-bold w-full md:w-64 focus:ring-2 focus:ring-agriYellow outline-none transition-all dark:text-slate-200"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {microFleet.map((ma) => (
                <div
                  key={ma.id}
                  className={`transition-all duration-300 ${trackingId === ma.id ? "bg-agriYellow/5 dark:bg-agriYellow/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}
                >
                  <div
                    onClick={() => toggleTracking(ma.id)}
                    className="p-6 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs text-slate-500 group-hover:bg-agriYellow group-hover:text-slate-900 transition-colors">
                          {ma.name.charAt(0)}
                        </div>
                        {ma.status === "In Transit" && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                          {ma.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          {ma.vehicle} •{" "}
                          <span className="text-agriYellow">{ma.id}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="hidden md:block text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Carga
                        </p>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                          {ma.load}
                        </p>
                      </div>
                      <div className="hidden md:block text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Status
                        </p>
                        <span
                          className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${
                            ma.status === "In Transit"
                              ? "bg-emerald-100 text-emerald-700"
                              : ma.status === "Loading"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {ma.status}
                        </span>
                      </div>
                      {trackingId === ma.id ? (
                        <ChevronUp className="w-5 h-5 text-agriYellow" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                  </div>

                  {/* Expanded GPS Tracking View */}
                  {trackingId === ma.id && (
                    <div className="px-6 pb-8 animate-in slide-in-from-top-4 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Mini Tactical Map */}
                        <div className="md:col-span-2 h-64 bg-slate-900 rounded-[28px] relative overflow-hidden border border-slate-800 group/map shadow-2xl">
                          <img
                            src="https://picsum.photos/seed/tracking-map-rural/800/600"
                            className="w-full h-full object-cover opacity-20 grayscale saturate-50"
                            alt="Tracking Map"
                          />
                          {/* Animated Path Simulation */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <line
                              x1={`${ma.coords.start[0]}%`}
                              y1={`${ma.coords.start[1]}%`}
                              x2={`${ma.coords.current[0]}%`}
                              y2={`${ma.coords.current[1]}%`}
                              stroke="#fbbf24"
                              strokeWidth="2"
                              strokeDasharray="4 4"
                            />
                            <line
                              x1={`${ma.coords.current[0]}%`}
                              y1={`${ma.coords.current[1]}%`}
                              x2={`${ma.coords.end[0]}%`}
                              y2={`${ma.coords.end[1]}%`}
                              stroke="#334155"
                              strokeWidth="2"
                              strokeDasharray="4 4"
                            />
                          </svg>

                          {/* Origin Point */}
                          <div
                            className="absolute w-4 h-4 bg-slate-500 rounded-full border-2 border-white -ml-2 -mt-2 shadow-lg"
                            style={{
                              left: `${ma.coords.start[0]}%`,
                              top: `${ma.coords.start[1]}%`,
                            }}
                          >
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-500 uppercase whitespace-nowrap">
                              Origem
                            </div>
                          </div>

                          {/* Destination Point */}
                          <div
                            className="absolute w-6 h-6 bg-slate-800 rounded-lg border-2 border-white -ml-3 -mt-3 shadow-lg flex items-center justify-center"
                            style={{
                              left: `${ma.coords.end[0]}%`,
                              top: `${ma.coords.end[1]}%`,
                            }}
                          >
                            <MapPin className="w-3 h-3 text-agriYellow" />
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[8px] font-black text-agriYellow uppercase whitespace-nowrap">
                              HUB DESTINO
                            </div>
                          </div>

                          {/* Current Position Marker */}
                          <div
                            className="absolute w-10 h-10 -ml-5 -mt-5 z-20 group/marker"
                            style={{
                              left: `${ma.coords.current[0]}%`,
                              top: `${ma.coords.current[1]}%`,
                            }}
                          >
                            <div className="absolute inset-0 bg-agriYellow/20 rounded-full animate-ping"></div>
                            <div className="relative w-full h-full bg-agriYellow rounded-2xl flex items-center justify-center text-slate-900 shadow-2xl border-2 border-white transition-transform group-hover/marker:scale-125">
                              <Navigation2
                                className="w-5 h-5 fill-current"
                                style={{ transform: "rotate(45deg)" }}
                              />
                            </div>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase whitespace-nowrap border border-white/10 shadow-2xl">
                              {ma.speed}
                            </div>
                          </div>

                          <div className="absolute bottom-4 left-4 p-3 bg-black/60 backdrop-blur rounded-2xl border border-white/10 text-white">
                            <div className="flex items-center gap-3">
                              <Locate className="w-4 h-4 text-agriYellow animate-pulse" />
                              <span className="text-[9px] font-black uppercase tracking-widest">
                                Sinal GPS Forte (1.2m Accuracy)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Telemetry Data Card */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[28px] p-6 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                          <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b dark:border-slate-700 pb-2 flex items-center gap-2">
                              <Activity className="w-3 h-3" /> Telemetria de
                              Bordo
                            </h5>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase">
                                  Bateria
                                </p>
                                <p className="text-sm font-black text-emerald-500">
                                  {ma.battery}
                                </p>
                              </div>
                              <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase">
                                  Carga Atual
                                </p>
                                <p className="text-sm font-black text-slate-800 dark:text-white">
                                  {ma.load}
                                </p>
                              </div>
                              <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase">
                                  Tempo Est.
                                </p>
                                <p className="text-sm font-black text-slate-800 dark:text-white">
                                  18 min
                                </p>
                              </div>
                              <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase">
                                  Distância
                                </p>
                                <p className="text-sm font-black text-slate-800 dark:text-white">
                                  4.2 km
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 mt-4 border-t dark:border-slate-700">
                            <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-agriYellow hover:text-slate-900 transition-all flex items-center justify-center gap-2">
                              <Zap className="w-3.5 h-3.5" /> Forçar
                              Sincronização
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <div className="bg-[#064e3b] p-8 rounded-[32px] text-white relative overflow-hidden shadow-2xl group transition-all">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform">
              <Cpu className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <h4 className="text-lg font-black mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-agriYellow" /> Otimizador de
                Rotas IA
              </h4>
              <div className="space-y-6">
                <div className="p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                  <p className="text-[11px] text-emerald-100 leading-relaxed font-medium italic">
                    "A rede de Micro-Agregadores em Huambo reduziu o tempo de
                    escoamento rural em 22% este mês através da consolidação
                    dinâmica de rotas via IA."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">
                      Carga Média
                    </p>
                    <p className="text-2xl font-black">450kg</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">
                      Alertas Rota
                    </p>
                    <p className="text-2xl font-black text-agriYellow">02</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest mb-6 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" /> Hotspots de Captação
              Rural
            </h4>
            <div className="space-y-4">
              {[
                {
                  zone: "Sector Leste Malanje",
                  demand: "Crítico",
                  color: "rose",
                },
                {
                  zone: "Planalto de Huambo",
                  demand: "Estável",
                  color: "emerald",
                },
                { zone: "Vale do Kwanza", demand: "Alto", color: "amber" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                >
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">
                    {item.zone}
                  </span>
                  <span
                    className={`text-[8px] font-black px-2 py-1 rounded-full uppercase bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-700 dark:text-${item.color}-400`}
                  >
                    {item.demand}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all border border-slate-100 dark:border-slate-800">
              Gerar Mapa de Demanda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroAgregadores;
