import React, { useState, useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import { FilterContext, Fazenda, StatusFazenda } from "../../types";
import { useFetch } from "../../services/hooks";
import { mockAPI } from "../../services/mockData";
import {
  Search,
  Plus,
  MapPin,
  CheckCircle2,
  Clock,
  Filter,
  X,
  Phone,
  Mail,
  Maximize2,
  MessageSquare,
  UserCheck,
  Loader2,
} from "lucide-react";

const FarmsCensus: React.FC<{ filters: FilterContext }> = ({ filters }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | StatusFazenda>(
    "all",
  );
  const [selectedFarm, setSelectedFarm] = useState<Fazenda | null>(null);

  const { data: fazendasData, loading } = useFetch(
    () => mockAPI.fazendas.list(),
    [],
  );

  const producers: Fazenda[] = fazendasData || [];

  const miniMapContainerRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const filteredProducers = useMemo(() => {
    return producers.filter((p) => {
      const provinceMatch =
        filters.province === "nacional" ||
        p.localizacao?.provincia === filters.province;
      const municipalityMatch =
        filters.municipality === "todos" ||
        p.localizacao?.municipio === filters.municipality;
      return provinceMatch && municipalityMatch;
    });
  }, [filters]);

  useEffect(() => {
    if (selectedFarm && miniMapContainerRef.current) {
      if (!miniMapRef.current) {
        miniMapRef.current = L.map(miniMapContainerRef.current, {
          center: [
            selectedFarm.latitude || -8.8383,
            selectedFarm.longitude || 13.2344,
          ],
          zoom: 13,
          zoomControl: false,
          attributionControl: false,
        });
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        ).addTo(miniMapRef.current);
        markerRef.current = L.marker([
          selectedFarm.latitude || -8.8383,
          selectedFarm.longitude || 13.2344,
        ]).addTo(miniMapRef.current);
      } else {
        miniMapRef.current.setView(
          [selectedFarm.latitude || -8.8383, selectedFarm.longitude || 13.2344],
          13,
        );
        markerRef.current?.setLatLng([
          selectedFarm.latitude || -8.8383,
          selectedFarm.longitude || 13.2344,
        ]);
      }
    }
  }, [selectedFarm]);

  return (
    <div className="relative h-full animate-in fade-in duration-500">
      <div
        className={`space-y-6 transition-all duration-300 ${selectedFarm ? "pr-[400px]" : ""}`}
      >
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">
                Registo de Produtores
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Filter className="w-3 h-3 text-agriYellow" />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">
                  Localidade:{" "}
                  <span className="text-agriYellow">
                    {filters.province.toUpperCase()}
                  </span>
                  {filters.municipality !== "todos" && (
                    <span className="text-slate-300">
                      {" "}
                      / {filters.municipality.toUpperCase()}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filtrar nesta lista..."
                  className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-bold w-full md:w-64 focus:ring-2 focus:ring-agriYellow outline-none transition-all dark:text-slate-200"
                />
              </div>
              <button className="flex items-center space-x-2 bg-slate-900 dark:bg-agriYellow text-white dark:text-slate-900 px-5 py-2.5 rounded-xl shadow-lg hover:scale-105 transition-all active:scale-95">
                <Plus className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">
                  Novo Registo
                </span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest">
                  <th className="px-8 py-4">Fazenda / Produtor</th>
                  <th className="px-6 py-4">Localização</th>
                  <th className="px-6 py-4 text-center">Área</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-bold text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducers.length > 0 ? (
                  filteredProducers.map((farm) => (
                    <tr
                      key={farm.id}
                      onClick={() => setSelectedFarm(farm)}
                      className={`cursor-pointer transition-colors group ${selectedFarm?.id === farm.id ? "bg-agriYellow/5 border-l-4 border-agriYellow" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"}`}
                    >
                      <td className="px-8 py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 dark:text-slate-100 group-hover:text-agriYellow transition-colors uppercase">
                            {farm.nome}
                          </span>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500">
                            {farm.produtor?.utilizador?.nome_completo || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                        {farm.localizacao?.provincia || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center font-black text-slate-800 dark:text-white">
                        {farm.area_total}
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`flex items-center space-x-1 px-2 py-1 rounded-full w-fit ${farm.status === StatusFazenda.VALIDADO ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" : "text-amber-600 bg-amber-50 dark:bg-amber-950/30"}`}
                        >
                          {farm.status === StatusFazenda.VALIDADO ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span className="font-black uppercase text-[8px]">
                            {farm.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Maximize2 className="w-4 h-4 text-agriYellow" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-8 py-20 text-center text-slate-400 italic"
                    >
                      Nenhum produtor encontrado para esta seleção geográfica.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-[100] transition-transform duration-500 ease-in-out transform flex flex-col ${selectedFarm ? "translate-x-0" : "translate-x-full"}`}
      >
        {selectedFarm && (
          <div className="flex flex-col h-full">
            <div className="p-10 bg-slate-950 text-white relative border-b-8 border-agriYellow">
              <button
                onClick={() => setSelectedFarm(null)}
                className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-all text-agriYellow"
              >
                <X className="w-6 h-6" />
              </button>
              <span className="text-[10px] font-black text-agriYellow/60 uppercase tracking-widest mb-4 inline-block">
                ID: {selectedFarm.id}
              </span>
              <h4 className="text-3xl font-black uppercase tracking-tight mb-2 leading-none">
                {selectedFarm.nome}
              </h4>
              <p className="text-agriYellow text-xs flex items-center gap-2 uppercase font-bold tracking-tight opacity-70">
                <MapPin className="w-3 h-3" />{" "}
                {selectedFarm.localizacao?.provincia || "N/A"}
              </p>
            </div>

            <div className="flex-grow overflow-y-auto p-10 space-y-10 custom-scrollbar">
              <div className="h-48 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 overflow-hidden shadow-inner relative">
                <div ref={miniMapContainerRef} className="w-full h-full" />
                <div className="absolute top-4 left-4 bg-slate-900/80 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest z-[1000] border border-white/10 backdrop-blur-sm text-white">
                  Vigilância SIG Ativa
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b dark:border-slate-800 pb-2">
                  Proprietário
                </h5>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 text-agriYellow flex items-center justify-center text-xl font-black shadow-lg">
                    {selectedFarm.produtor?.utilizador?.nome_completo?.charAt(
                      0,
                    ) || "P"}
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight">
                      {selectedFarm.produtor?.utilizador?.nome_completo ||
                        "Produtor"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Contribuinte Registado
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <a
                  href={`tel:${selectedFarm.produtor?.utilizador?.telefone || "#"}`}
                  className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-agriYellow transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-agriYellow text-slate-900 flex items-center justify-center shadow-md">
                    <Phone className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-black dark:text-slate-200">
                    {selectedFarm.produtor?.utilizador?.telefone || "N/A"}
                  </p>
                </a>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md">
                    <Mail className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-black dark:text-slate-200 uppercase truncate">
                    {selectedFarm.produtor?.utilizador?.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b dark:border-slate-800 pb-2">
                  Estatísticas de Produtividade
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border dark:border-slate-800">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Cultura Base
                    </p>
                    <p className="text-sm font-black text-slate-800 dark:text-white uppercase">
                      {selectedFarm.cultura_principal || "N/A"}
                    </p>
                  </div>
                  <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border dark:border-slate-800">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Rendimento
                    </p>
                    <p className="text-sm font-black text-emerald-500 uppercase">
                      {selectedFarm.produtividade_media
                        ? `${selectedFarm.produtividade_media}t/ha`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <button className="w-full bg-slate-950 text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-agriYellow hover:text-slate-900 transition-all flex items-center justify-center gap-3 border border-white/10">
                <MessageSquare className="w-5 h-5" /> BI-Connect Direto
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmsCensus;
