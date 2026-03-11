import React from "react";
import { AppTab } from "../../types";
import { Search, Bell, Settings, Sun, Moon, MapPin } from "lucide-react";
import { geoData } from "../shared/FilterStrip";

interface HeaderProps {
  activeTab: AppTab;
  province: string;
  setProvince: (p: string) => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  toggleTheme: () => void;
  isDarkMode: boolean;
  openNotifications: () => void;
  openSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  province,
  setProvince,
  toggleTheme,
  isDarkMode,
  openNotifications,
  openSettings,
}) => {
  const getTitle = () => {
    switch (activeTab) {
      case AppTab.VISAO_ESTRATEGICA:
        return "Visão Estratégica";
      case AppTab.LOGISTICA_RADAR:
        return "Radar Logístico";
      case AppTab.PREDICOES_IA:
        return "Inteligência Preditiva";
      case AppTab.FAZENDAS:
        return "Censo de Fazendas";
      case AppTab.GEOINTELIGENCIA:
        return "Geointeligência";
      case AppTab.RANKING_COMUNAS:
        return "Ranking de Comunas";
      case AppTab.FLUXO_PRODUCAO:
        return "Fluxo de Produção";
      case AppTab.RELATORIOS:
        return "Relatórios & BI";
      case AppTab.MARKETPLACE:
        return "Marketplace";
      case AppTab.HUBS:
        return "Hubs Logísticos";
      case AppTab.UTILIZADORES:
        return "Utilizadores";
      default:
        return "Portal AgriConnect";
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between z-50 transition-colors">
      {/* Left Section - Title */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
            {getTitle()}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            AgriConnect Business Platform
          </p>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/20 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="bg-transparent border-none outline-none text-sm w-40 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:ring-0"
          />
        </div>

        {/* Province Selector */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-all">
          <MapPin className="w-4 h-4 text-primary-500" />
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="bg-transparent border-none text-xs font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer focus:ring-0"
          >
            {Object.entries(geoData).map(([key, data]) => (
              <option key={key} value={key} className="text-slate-900 bg-white">
                {data.label}
              </option>
            ))}
          </select>
        </div>

        {/* Icon Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={openNotifications}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all relative"
            title="Notificações"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full"></span>
          </button>

          <button
            onClick={openSettings}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            title="Configurações"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
