import React from "react";
import { AppTab, UserRole } from "../../types";
import {
  BarChart3,
  Users,
  TrendingUp,
  Globe,
  Cpu,
  AlertTriangle,
  Truck,
  MapPin,
  FileText,
  Boxes,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  HelpCircle,
  Link,
  PieChart,
  Building2,
  UserCog,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  userRole: UserRole;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  userRole,
  activeTab,
  setActiveTab,
  isOpen,
  toggleSidebar,
  onLogout,
}) => {
  const NavItem = ({
    tab,
    icon: Icon,
    label,
  }: {
    tab: AppTab;
    icon: any;
    label: string;
  }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`w-full flex items-center px-3 py-2.5 text-sm transition-all group relative ${
          isActive
            ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 font-medium border-r-2 border-primary-600 dark:border-primary-400"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <Icon
          className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? "text-primary-600 dark:text-primary-400" : ""}`}
        />
        <span className={`${isOpen ? "block" : "hidden"} transition-all`}>
          {label}
        </span>
      </button>
    );
  };

  const SectionHeader = ({ label }: { label: string }) => (
    <div
      className={`px-3 pt-5 pb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${!isOpen && "hidden"}`}
    >
      {label}
    </div>
  );

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-16"} bg-white dark:bg-slate-900 flex-shrink-0 flex flex-col transition-all duration-300 border-r border-slate-200 dark:border-slate-800 relative`}
    >
      {/* Logo & Toggle */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className={`${!isOpen && "hidden"} flex items-center gap-2`}>
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AC</span>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              AgriConnect
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {userRole === UserRole.STARTUP ? "Management" : "Governação"}
            </p>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400"
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow overflow-y-auto py-4">
        {userRole === UserRole.GOVERNMENT ? (
          <>
            <SectionHeader label="Visão Geral" />
            <NavItem
              tab={AppTab.VISAO_ESTRATEGICA}
              icon={BarChart3}
              label="Dashboard"
            />

            <SectionHeader label="Mercado" />
            <NavItem
              tab={AppTab.MARKETPLACE}
              icon={ShoppingBag}
              label="Marketplace"
            />

            <SectionHeader label="Produção" />
            <NavItem tab={AppTab.FAZENDAS} icon={Users} label="Fazendas" />
            <NavItem
              tab={AppTab.RANKING_COMUNAS}
              icon={TrendingUp}
              label="Rankings"
            />
            <NavItem
              tab={AppTab.FLUXO_PRODUCAO}
              icon={Link}
              label="Blockchain"
            />

            <SectionHeader label="Inteligência" />
            <NavItem
              tab={AppTab.GEOINTELIGENCIA}
              icon={Globe}
              label="Geointeligência"
            />
            <NavItem
              tab={AppTab.PREDICOES_IA}
              icon={Cpu}
              label="Predições IA"
            />
            <NavItem
              tab={AppTab.RISCO}
              icon={AlertTriangle}
              label="Análise de Risco"
            />

            <SectionHeader label="Operações" />
            <NavItem
              tab={AppTab.LOGISTICA_RADAR}
              icon={Truck}
              label="Logística"
            />
            <NavItem tab={AppTab.HUBS} icon={Boxes} label="Hubs" />
            <NavItem
              tab={AppTab.MICRO_AGREGADORES}
              icon={MapPin}
              label="Agregadores"
            />

            <SectionHeader label="Gestão" />
            <NavItem
              tab={AppTab.RELATORIOS}
              icon={PieChart}
              label="Relatórios"
            />
            <NavItem tab={AppTab.UTILIZADORES} icon={UserCog} label="Equipa" />
          </>
        ) : (
          <>
            <SectionHeader label="Dashboard" />
            <NavItem
              tab={AppTab.STARTUP_DASHBOARD}
              icon={LayoutDashboard}
              label="Visão Geral"
            />

            <SectionHeader label="Gestão" />
            <NavItem
              tab={AppTab.STARTUP_COMPANIES_MGMT}
              icon={Building2}
              label="Empresas"
            />
            <NavItem tab={AppTab.STARTUP_HUBS_MGMT} icon={Boxes} label="Hubs" />
            <NavItem
              tab={AppTab.STARTUP_MICRO_AGREGADORES_MGMT}
              icon={MapPin}
              label="Agregadores"
            />
            <NavItem
              tab={AppTab.STARTUP_USERS}
              icon={Users}
              label="Utilizadores"
            />
            <NavItem tab={AppTab.STARTUP_TEAM} icon={UserCog} label="Equipa" />

            <SectionHeader label="Operações" />
            <NavItem
              tab={AppTab.STARTUP_FREIGHTS}
              icon={Truck}
              label="Fretes"
            />
            <NavItem
              tab={AppTab.STARTUP_VERIFICATION}
              icon={ShieldCheck}
              label="Verificação"
            />
            <NavItem
              tab={AppTab.STARTUP_TRANSACTIONS}
              icon={CreditCard}
              label="Transações"
            />
            <NavItem
              tab={AppTab.STARTUP_SUPPORT}
              icon={HelpCircle}
              label="Suporte"
            />
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          <span className={isOpen ? "block" : "hidden"}>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
