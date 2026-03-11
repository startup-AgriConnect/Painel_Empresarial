import React from "react";
import { FilterContext } from "../../types";
import { Map, MapPin, Clock, Globe, ChevronDown } from "lucide-react";

interface FilterStripProps {
  filters: FilterContext;
  updateFilter: (key: keyof FilterContext, value: string) => void;
}

// Mapeamento Integral de Angola (18 Províncias)
export const geoData: Record<
  string,
  { label: string; municipalities: Record<string, string[]> }
> = {
  nacional: { label: "ANGOLA (Nacional)", municipalities: {} },
  bengo: {
    label: "BENGO",
    municipalities: {
      Dande: ["Caxito", "Mabubas"],
      Ambriz: ["Sede"],
      Nambuangongo: ["Muxaluando"],
    },
  },
  benguela: {
    label: "BENGUELA",
    municipalities: {
      Benguela: ["Sede", "Baía Farta"],
      Lobito: ["Sede", "Canjala"],
      Catumbela: ["Sede"],
      Ganda: ["Sede"],
    },
  },
  bie: {
    label: "BIÉ",
    municipalities: {
      Kuito: ["Sede", "Kunje"],
      Andulo: ["Sede"],
      Camacupa: ["Sede"],
    },
  },
  cabinda: {
    label: "CABINDA",
    municipalities: {
      Cabinda: ["Sede", "Malembo"],
      Cacongo: ["Lândana"],
      "Buco-Zau": ["Sede"],
    },
  },
  cuando_cubango: {
    label: "CUANDO CUBANGO",
    municipalities: {
      Menongue: ["Sede"],
      "Cuito Cuanavale": ["Sede"],
      Mavinga: ["Sede"],
    },
  },
  cuanza_norte: {
    label: "CUANZA NORTE",
    municipalities: {
      Cazengo: ["Ndalatando"],
      Ambaca: ["Camabatela"],
      Lucala: ["Sede"],
    },
  },
  cuanza_sul: {
    label: "CUANZA SUL",
    municipalities: {
      Sumbe: ["Sede"],
      "Porto Amboim": ["Sede"],
      "Waku Kungo": ["Sede"],
      Cela: ["Sede"],
    },
  },
  cunene: {
    label: "CUNENE",
    municipalities: {
      Cuanhama: ["Ondjiva"],
      Namacunde: ["Sede"],
      Cahama: ["Sede"],
    },
  },
  huambo: {
    label: "HUAMBO",
    municipalities: {
      Huambo: ["Sede", "Calenga"],
      Caála: ["Sede", "Catata"],
      Bailundo: ["Sede", "Lunge"],
      Longonjo: ["Sede"],
    },
  },
  huila: {
    label: "HUÍLA",
    municipalities: {
      Lubango: ["Sede", "Hoque"],
      Chibia: ["Sede"],
      Matala: ["Sede"],
      Humpata: ["Sede"],
    },
  },
  luanda: {
    label: "LUANDA",
    municipalities: {
      Belas: ["Quenguela"],
      Viana: ["Sede", "Zango"],
      Cacuaco: ["Sede"],
      Talatona: ["Sede"],
      "Kilamba Kiaxi": ["Sede"],
    },
  },
  lunda_norte: {
    label: "LUNDA NORTE",
    municipalities: { Chitato: ["Dundo"], Cambulo: ["Sede"], Cuilo: ["Sede"] },
  },
  lunda_sul: {
    label: "LUNDA SUL",
    municipalities: { Saurimo: ["Sede", "Mona Quimbundo"], Dala: ["Sede"] },
  },
  malanje: {
    label: "MALANJE",
    municipalities: {
      Malanje: ["Sede", "Ngola Luije"],
      Cacuso: ["Sede", "Lombe"],
      Calandula: ["Sede"],
      Quela: ["Sede"],
    },
  },
  moxico: {
    label: "MOXICO",
    municipalities: { Luena: ["Sede"], Luau: ["Sede"], Cameia: ["Sede"] },
  },
  namibe: {
    label: "NAMIBE",
    municipalities: { Moçâmedes: ["Sede"], Bibala: ["Sede"], Virei: ["Sede"] },
  },
  uige: {
    label: "UÍGE",
    municipalities: {
      Uíge: ["Sede"],
      Negage: ["Sede", "Dimuca"],
      "Sanza Pombo": ["Sede"],
      Puri: ["Sede"],
    },
  },
  zaire: {
    label: "ZAIRE",
    municipalities: {
      "Mbanza Kongo": ["Sede"],
      Soyo: ["Sede"],
      Nzeto: ["Sede"],
    },
  },
};

const FilterStrip: React.FC<FilterStripProps> = ({ filters, updateFilter }) => {
  const currentProvinceData = geoData[filters.province];
  const municipalities = currentProvinceData
    ? Object.keys(currentProvinceData.municipalities)
    : [];
  const communes =
    currentProvinceData && filters.municipality !== "todos"
      ? currentProvinceData.municipalities[filters.municipality] || []
      : [];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex flex-wrap items-center gap-3">
      {/* Província */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-all">
        <Globe className="w-4 h-4 text-primary-500" />
        <select
          value={filters.province}
          onChange={(e) => updateFilter("province", e.target.value)}
          className="bg-transparent border-none text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-0 cursor-pointer"
        >
          {Object.entries(geoData).map(([key, data]) => (
            <option key={key} value={key} className="text-slate-900 bg-white">
              {data.label}
            </option>
          ))}
        </select>
      </div>

      {/* Município */}
      <div
        className={`flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-all ${filters.province === "nacional" ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Map className="w-4 h-4 text-slate-400" />
        <select
          value={filters.municipality}
          disabled={filters.province === "nacional"}
          onChange={(e) => updateFilter("municipality", e.target.value)}
          className="bg-transparent border-none text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-0 cursor-pointer"
        >
          <option value="todos">Todos os Municípios</option>
          {municipalities.map((m) => (
            <option key={m} value={m} className="text-slate-900 bg-white">
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Comuna */}
      <div
        className={`flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-all ${filters.municipality === "todos" ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <MapPin className="w-4 h-4 text-slate-400" />
        <select
          value={filters.commune}
          disabled={filters.municipality === "todos"}
          onChange={(e) => updateFilter("commune", e.target.value)}
          className="bg-transparent border-none text-xs font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-0 cursor-pointer"
        >
          <option value="todas">Todas as Comunas</option>
          {communes.map((c) => (
            <option key={c} value={c} className="text-slate-900 bg-white">
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-grow"></div>

      {/* Período */}
      <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 hover:border-primary-500 transition-all">
        <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        <select
          value={filters.timeRange}
          onChange={(e) => updateFilter("timeRange", e.target.value as any)}
          className="bg-transparent border-none text-xs font-medium text-primary-700 dark:text-primary-300 outline-none focus:ring-0 cursor-pointer"
        >
          <option value="hoje">Hoje</option>
          <option value="semana">Esta Semana</option>
          <option value="mes">Mês Anterior</option>
          <option value="trimestre">Trimestre</option>
          <option value="safra">Safra 24/25</option>
        </select>
      </div>
    </div>
  );
};

export default FilterStrip;
