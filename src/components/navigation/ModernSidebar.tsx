import React from "react";
import { AppTab, UserRole } from "../../types";
import { cn, navigationStyles } from "../../design";
import { Badge, Button, IconButton } from "../ui";
import {
  BarChart3,
  Users,
  TrendingUp,
  Globe,
  Cpu,
  AlertTriangle,
  Truck,
  MapPin,
  Menu,
  FileText,
  Boxes,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  CreditCard,
  HelpCircle,
  Zap,
  Link,
  PieChart,
  Activity,
  Building2,
  UserCog,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bell,
  User,
} from "lucide-react";

// ========================
// NAVIGATION TYPES
// ========================

export interface NavItemProps {
  tab: AppTab;
  icon: React.ComponentType<any>;
  label: string;
  badge?: number;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface NavSectionProps {
  label: string;
  isCollapsed?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface ModernSidebarProps {
  userRole: UserRole;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
  userProfile?: {
    name: string;
    email?: string;
    avatar?: string;
    company?: string;
  };
}

// ========================
// NAV ITEM COMPONENT
// ========================

export const NavItem: React.FC<NavItemProps> = ({
  tab,
  icon: Icon,
  label,
  badge,
  isActive = false,
  isCollapsed = false,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        navigationStyles.navItem.base,
        navigationStyles.navItem.padding,
        isActive
          ? navigationStyles.navItem.active
          : navigationStyles.navItem.inactive,
        "group relative overflow-hidden",
        className,
      )}
      title={isCollapsed ? label : undefined}
    >
      {/* Background highlight for active state */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-agriYellow-400/10 to-agriYellow-400/5" />
      )}

      {/* Icon */}
      <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
        <Icon
          className={cn(
            "w-5 h-5 transition-all duration-200",
            isActive
              ? "text-slate-900 scale-110"
              : "text-surface-400 group-hover:text-agriYellow-400 group-hover:scale-105",
          )}
        />
      </div>

      {/* Label and Badge */}
      {!isCollapsed && (
        <div className="flex items-center justify-between flex-1 min-w-0 ml-3">
          <span
            className={cn(
              "font-medium text-sm tracking-wide transition-colors truncate",
              isActive
                ? "text-slate-900"
                : "text-surface-300 group-hover:text-white",
            )}
          >
            {label}
          </span>

          {badge && badge > 0 && (
            <Badge
              variant="danger"
              size="xs"
              className="ml-2 flex-shrink-0 animate-pulse-subtle"
            >
              {badge > 99 ? "99+" : badge}
            </Badge>
          )}
        </div>
      )}

      {/* Collapsed state badge */}
      {isCollapsed && badge && badge > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">
            {badge > 9 ? "9+" : badge}
          </span>
        </div>
      )}

      {/* Hover effect */}
      {!isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-agriYellow-400/0 to-agriYellow-400/0 group-hover:from-agriYellow-400/5 group-hover:to-transparent transition-all duration-300" />
      )}
    </button>
  );
};

// ========================
// NAV SECTION COMPONENT
// ========================

export const NavSection: React.FC<NavSectionProps> = ({
  label,
  isCollapsed = false,
  children,
  className,
}) => {
  if (isCollapsed) {
    return (
      <div className={cn("my-4", className)}>
        <div className="mx-4 border-t border-surface-700" />
        <div className="mt-4 space-y-1">{children}</div>
      </div>
    );
  }

  return (
    <div className={cn("my-6", className)}>
      <div className="px-6 py-3">
        <h3 className="text-xs font-black text-surface-500 uppercase tracking-[0.25em] select-none">
          {label}
        </h3>
      </div>
      <div className="space-y-1 px-2">{children}</div>
    </div>
  );
};

// ========================
// USER PROFILE SECTION
// ========================

const UserProfileSection: React.FC<{
  userProfile?: ModernSidebarProps["userProfile"];
  isCollapsed: boolean;
  onProfileClick?: () => void;
}> = ({ userProfile, isCollapsed, onProfileClick }) => {
  if (!userProfile) return null;

  if (isCollapsed) {
    return (
      <div className="p-4 border-b border-surface-700">
        <button
          onClick={onProfileClick}
          className="w-12 h-12 rounded-xl bg-agriYellow-400 flex items-center justify-center text-slate-900 font-bold text-lg hover:scale-105 transition-transform"
        >
          {userProfile.avatar ? (
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            userProfile.name.charAt(0).toUpperCase()
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 border-b border-surface-700">
      <button
        onClick={onProfileClick}
        className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-surface-800 transition-colors group"
      >
        <div className="w-10 h-10 rounded-lg bg-agriYellow-400 flex items-center justify-center text-slate-900 font-bold flex-shrink-0">
          {userProfile.avatar ? (
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            userProfile.name.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-white truncate group-hover:text-agriYellow-400 transition-colors">
            {userProfile.name}
          </p>
          {userProfile.company && (
            <p className="text-xs text-surface-400 truncate">
              {userProfile.company}
            </p>
          )}
        </div>

        <Settings className="w-4 h-4 text-surface-500 group-hover:text-agriYellow-400 transition-colors" />
      </button>
    </div>
  );
};

// ========================
// MODERN SIDEBAR COMPONENT
// ========================

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  userRole,
  activeTab,
  setActiveTab,
  isOpen,
  toggleSidebar,
  onLogout,
  userProfile,
}) => {
  // Mock notification counts
  const notifications = {
    [AppTab.LOGISTICA_RADAR]: 3,
    [AppTab.MARKETPLACE]: 5,
    [AppTab.STARTUP_VERIFICATION]: 7,
    [AppTab.STARTUP_SUPPORT]: 2,
  };

  const handleNavClick = (tab: AppTab) => {
    setActiveTab(tab);
  };

  return (
    <aside
      className={cn(
        navigationStyles.sidebar.base,
        isOpen
          ? navigationStyles.sidebar.open
          : navigationStyles.sidebar.closed,
        "border-r border-surface-800/50 backdrop-blur-xl relative overflow-hidden",
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-agriYellow-500/5 via-transparent to-agriGreen-500/5 pointer-events-none" />

      {/* Header */}
      <div className="relative p-5 border-b border-surface-800/50 bg-surface-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          {/* Logo */}
          <div
            className={cn(
              "flex items-center",
              !isOpen && "justify-center w-full",
            )}
          >
            <div className="w-10 h-10 bg-agriYellow-400 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-slate-900" />
            </div>

            {isOpen && (
              <div className="ml-3">
                <div className="text-2xl font-black tracking-tighter leading-none">
                  <span className="text-white">Agri</span>
                  <span className="text-agriYellow-400">Connect</span>
                </div>
                <p className="text-xs text-surface-400 font-bold uppercase tracking-[0.18em] mt-1">
                  {userRole === UserRole.STARTUP
                    ? "Management & Ops"
                    : "Portal Governação"}
                </p>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <IconButton
            icon={isOpen ? ChevronLeft : ChevronRight}
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            aria-label={isOpen ? "Fechar sidebar" : "Abrir sidebar"}
            className="text-agriYellow-400 hover:bg-agriYellow-400/10 p-2"
          />
        </div>

        {/* User Profile */}
        <UserProfileSection userProfile={userProfile} isCollapsed={!isOpen} />
      </div>

      {/* Navigation */}
      <nav className="flex-grow overflow-y-auto custom-scrollbar py-4">
        {userRole === UserRole.GOVERNMENT ? (
          <>
            <NavSection label="Governação" isCollapsed={!isOpen}>
              <NavItem
                tab={AppTab.VISAO_ESTRATEGICA}
                icon={BarChart3}
                label="Visão Estratégica"
                isActive={activeTab === AppTab.VISAO_ESTRATEGICA}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.VISAO_ESTRATEGICA)}
              />
            </NavSection>

            <NavSection label="Mercado & Lotes" isCollapsed={!isOpen}>
              <NavItem
                tab={AppTab.MARKETPLACE}
                icon={ShoppingBag}
                label="Marketplace de Lotes"
                badge={notifications[AppTab.MARKETPLACE]}
                isActive={activeTab === AppTab.MARKETPLACE}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.MARKETPLACE)}
              />
            </NavSection>

            <NavSection label="Produção" isCollapsed={!isOpen}>
              <NavItem
                tab={AppTab.FAZENDAS}
                icon={Users}
                label="Fazendas & Produtores"
                isActive={activeTab === AppTab.FAZENDAS}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.FAZENDAS)}
              />
              <NavItem
                tab={AppTab.RANKING_COMUNAS}
                icon={TrendingUp}
                label="Ranking de Comunas"
                isActive={activeTab === AppTab.RANKING_COMUNAS}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.RANKING_COMUNAS)}
              />
              <NavItem
                tab={AppTab.FLUXO_PRODUCAO}
                icon={Link}
                label="Fluxo Blockchain"
                isActive={activeTab === AppTab.FLUXO_PRODUCAO}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.FLUXO_PRODUCAO)}
              />
            </NavSection>

            <NavSection label="Inteligência" isCollapsed={!isOpen}>
              <NavItem
                tab={AppTab.GEOINTELIGENCIA}
                icon={Globe}
                label="Geointeligência"
                isActive={activeTab === AppTab.GEOINTELIGENCIA}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.GEOINTELIGENCIA)}
              />
              <NavItem
                tab={AppTab.PREDICOES_IA}
                icon={Cpu}
                label="Predições IA"
                isActive={activeTab === AppTab.PREDICOES_IA}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.PREDICOES_IA)}
              />
              <NavItem
                tab={AppTab.RISCO}
                icon={AlertTriangle}
                label="Análise de Risco"
                isActive={activeTab === AppTab.RISCO}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.RISCO)}
              />
            </NavSection>

            <NavSection label="Operações" isCollapsed={!isOpen}>
              <NavItem
                tab={AppTab.LOGISTICA_RADAR}
                icon={Truck}
                label="Logística Radar"
                badge={notifications[AppTab.LOGISTICA_RADAR]}
                isActive={activeTab === AppTab.LOGISTICA_RADAR}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.LOGISTICA_RADAR)}
              />
              <NavItem
                tab={AppTab.HUBS}
                icon={Boxes}
                label="Status de Hubs"
                isActive={activeTab === AppTab.HUBS}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.HUBS)}
              />
              <NavItem
                tab={AppTab.MICRO_AGREGADORES}
                icon={MapPin}
                label="Micro-Agregadores"
                isActive={activeTab === AppTab.MICRO_AGREGADORES}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.MICRO_AGREGADORES)}
              />
            </NavSection>

            <NavSection label="Estratégico & Admin" isCollapsed={!isOpen}>
              <NavItem
                tab={AppTab.RELATORIOS}
                icon={PieChart}
                label="Relatórios & BI"
                isActive={activeTab === AppTab.RELATORIOS}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.RELATORIOS)}
              />
              <NavItem
                tab={AppTab.UTILIZADORES}
                icon={UserCog}
                label="Minha Equipa"
                isActive={activeTab === AppTab.UTILIZADORES}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.UTILIZADORES)}
              />
            </NavSection>
          </>
        ) : (
          <>
            <NavSection label="Administração Startup" isCollapsed={!isOpen}>
              <NavItem
                tab={AppTab.STARTUP_DASHBOARD}
                icon={LayoutDashboard}
                label="Dashboard Ops"
                isActive={activeTab === AppTab.STARTUP_DASHBOARD}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.STARTUP_DASHBOARD)}
              />
              <NavItem
                tab={AppTab.STARTUP_COMPANIES_MGMT}
                icon={Building2}
                label="Empresas Parceiras"
                isActive={activeTab === AppTab.STARTUP_COMPANIES_MGMT}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.STARTUP_COMPANIES_MGMT)}
              />
              <NavItem
                tab={AppTab.STARTUP_HUBS_MGMT}
                icon={Boxes}
                label="Gestão de Hubs"
                isActive={activeTab === AppTab.STARTUP_HUBS_MGMT}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.STARTUP_HUBS_MGMT)}
              />
              <NavItem
                tab={AppTab.STARTUP_MICRO_AGREGADORES_MGMT}
                icon={MapPin}
                label="Gestão Agregadores"
                isActive={activeTab === AppTab.STARTUP_MICRO_AGREGADORES_MGMT}
                isCollapsed={!isOpen}
                onClick={() =>
                  handleNavClick(AppTab.STARTUP_MICRO_AGREGADORES_MGMT)
                }
              />
              <NavItem
                tab={AppTab.STARTUP_USERS}
                icon={Users}
                label="Utilizadores"
                isActive={activeTab === AppTab.STARTUP_USERS}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.STARTUP_USERS)}
              />
              <NavItem
                tab={AppTab.STARTUP_TEAM}
                icon={UserCog}
                label="Minha Equipa"
                isActive={activeTab === AppTab.STARTUP_TEAM}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.STARTUP_TEAM)}
              />
              <NavItem
                tab={AppTab.STARTUP_FREIGHTS}
                icon={Truck}
                label="Fretes e Cargas"
                isActive={activeTab === AppTab.STARTUP_FREIGHTS}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.STARTUP_FREIGHTS)}
              />
              <NavItem
                tab={AppTab.STARTUP_VERIFICATION}
                icon={ShieldCheck}
                label="Verificação"
                badge={notifications[AppTab.STARTUP_VERIFICATION]}
                isActive={activeTab === AppTab.STARTUP_VERIFICATION}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.STARTUP_VERIFICATION)}
              />
              <NavItem
                tab={AppTab.STARTUP_TRANSACTIONS}
                icon={CreditCard}
                label="Transações"
                isActive={activeTab === AppTab.STARTUP_TRANSACTIONS}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.STARTUP_TRANSACTIONS)}
              />
              <NavItem
                tab={AppTab.STARTUP_SUPPORT}
                icon={HelpCircle}
                label="Suporte"
                badge={notifications[AppTab.STARTUP_SUPPORT]}
                isActive={activeTab === AppTab.STARTUP_SUPPORT}
                isCollapsed={!isOpen}
                onClick={() => handleNavClick(AppTab.STARTUP_SUPPORT)}
              />
            </NavSection>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 bg-surface-950/50 mt-auto border-t border-surface-800/50 relative backdrop-blur-sm">
        <Button
          onClick={onLogout}
          variant="ghost"
          size={isOpen ? "md" : "sm"}
          leftIcon={LogOut}
          fullWidth
          className={cn(
            "text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent hover:border-rose-500/20 font-bold",
            !isOpen && "px-0 justify-center",
          )}
        >
          {isOpen && "Terminar Sessão"}
        </Button>
      </div>
    </aside>
  );
};
