import React, { useState } from "react";
import { AppTab } from "../../types";
import { cn, navigationStyles } from "../../design";
import { Button, IconButton, Badge, Input } from "../ui";
import {
  Search,
  Bell,
  Settings,
  Filter,
  Sparkles,
  Sun,
  Moon,
  Menu,
  User,
  ChevronDown,
  Globe,
  Calendar,
  HelpCircle,
  Zap,
  MoreVertical,
} from "lucide-react";

// ========================
// HEADER TYPES
// ========================

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

export interface ModernHeaderProps {
  activeTab: AppTab;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  openNotifications: () => void;
  openSettings: () => void;
  breadcrumbs?: BreadcrumbItem[];
  notifications?: NotificationItem[];
  userName?: string;
  className?: string;
}

// ========================
// BREADCRUMB COMPONENT
// ========================

const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-surface-400 dark:text-surface-500">/</span>
          )}
          {item.href ? (
            <a
              href={item.href}
              className="text-surface-600 dark:text-surface-400 hover:text-agriYellow-600 dark:hover:text-agriYellow-400 transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span
              className={cn(
                item.active
                  ? "text-surface-900 dark:text-surface-100 font-medium"
                  : "text-surface-600 dark:text-surface-400",
              )}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// ========================
// NOTIFICATIONS DROPDOWN
// ========================

const NotificationsDropdown: React.FC<{
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
}> = ({ notifications, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-surface-800 rounded-2xl shadow-lg border border-surface-200 dark:border-surface-700 z-50 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100">
            Notificações
          </h3>
          <Badge variant="primary" size="xs">
            {notifications.filter((n) => !n.read).length}
          </Badge>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-8 h-8 text-surface-400 mx-auto mb-2" />
            <p className="text-surface-500 text-sm">Nenhuma notificação</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-4 border-b border-surface-100 dark:border-surface-700 last:border-0 hover:bg-surface-50 dark:hover:bg-surface-700 cursor-pointer transition-colors",
                !notification.read &&
                  "bg-agriYellow-50 dark:bg-agriYellow-950/20",
              )}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                    notification.type === "info" && "bg-info-500",
                    notification.type === "success" && "bg-success-500",
                    notification.type === "warning" && "bg-warning-500",
                    notification.type === "error" && "bg-danger-500",
                  )}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                    {notification.title}
                  </p>
                  <p className="text-xs text-surface-600 dark:text-surface-400 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-500 mt-2">
                    {notification.time}
                  </p>
                </div>

                {!notification.read && (
                  <div className="w-2 h-2 bg-agriYellow-500 rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-surface-200 dark:border-surface-700">
          <Button variant="ghost" size="sm" fullWidth>
            Ver todas as notificações
          </Button>
        </div>
      )}
    </div>
  );
};

// ========================
// QUICK ACTIONS COMPONENT
// ========================

const QuickActions: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <IconButton
        icon={Globe}
        variant="ghost"
        size="sm"
        aria-label="Idioma"
        className="text-surface-600 dark:text-surface-400 hover:text-agriYellow-600 dark:hover:text-agriYellow-400"
      />

      <IconButton
        icon={Calendar}
        variant="ghost"
        size="sm"
        aria-label="Calendário"
        className="text-surface-600 dark:text-surface-400 hover:text-agriYellow-600 dark:hover:text-agriYellow-400"
      />

      <IconButton
        icon={HelpCircle}
        variant="ghost"
        size="sm"
        aria-label="Ajuda"
        className="text-surface-600 dark:text-surface-400 hover:text-agriYellow-600 dark:hover:text-agriYellow-400"
      />
    </div>
  );
};

// ========================
// MODERN HEADER COMPONENT
// ========================

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  activeTab,
  isSidebarOpen,
  toggleSidebar,
  toggleTheme,
  isDarkMode,
  openNotifications,
  openSettings,
  breadcrumbs = [],
  notifications = [],
  userName = "Usuário",
  className,
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case AppTab.VISAO_ESTRATEGICA:
        return "Visão Estratégica Nacional";
      case AppTab.LOGISTICA_RADAR:
        return "Radar Logístico em Tempo Real";
      case AppTab.PREDICOES_IA:
        return "Inteligência Preditiva (IA)";
      case AppTab.FAZENDAS:
        return "Censo de Fazendas & Produtores";
      case AppTab.GEOINTELIGENCIA:
        return "Geointeligência Territorial (GEE)";
      case AppTab.RANKING_COMUNAS:
        return "Ranking de Comunas";
      case AppTab.FLUXO_PRODUCAO:
        return "Fluxo de Produção Blockchain";
      case AppTab.RELATORIOS:
        return "Reports & Business Intelligence";
      case AppTab.MARKETPLACE:
        return "Marketplace de Lotes";
      case AppTab.HUBS:
        return "Status de Hubs Logísticos";
      case AppTab.MICRO_AGREGADORES:
        return "Gestão de Micro-Agregadores";
      case AppTab.RISCO:
        return "Análise de Risco Climático";
      case AppTab.UTILIZADORES:
        return "Gestão de Utilizadores";
      default:
        return "Portal AgriConnect";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={cn(
        navigationStyles.header.base,
        "shadow-lg shadow-surface-200/50 dark:shadow-surface-900/50",
        className,
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-agriYellow-400/5 to-transparent pointer-events-none" />

      <div className={cn(navigationStyles.header.content, "relative z-10")}>
        {/* Left Section */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <IconButton
              icon={Menu}
              variant="ghost"
              size="md"
              onClick={toggleSidebar}
              aria-label="Menu"
              className="text-surface-700 dark:text-surface-300"
            />
          </div>

          {/* Title and Breadcrumbs */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-3 mb-1">
              <div className="hidden sm:flex p-3 bg-gradient-to-br from-agriYellow-400 to-agriYellow-500 rounded-2xl shadow-lg shadow-agriYellow-400/20 group">
                <Sparkles className="w-5 h-5 text-slate-900 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-agriYellow-400/30 blur-xl rounded-2xl group-hover:blur-2xl transition-all" />
              </div>

              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold text-surface-900 dark:text-surface-100 truncate">
                  {getTitle()}
                </h1>
                {breadcrumbs.length > 0 && (
                  <div className="mt-1 hidden sm:block">
                    <Breadcrumb items={breadcrumbs} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="hidden lg:flex items-center">
            {showSearch ? (
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Pesquisar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={Search}
                  className="w-64"
                  autoFocus
                />
                <IconButton
                  icon={MoreVertical}
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearch(false)}
                  aria-label="Fechar pesquisa"
                />
              </div>
            ) : (
              <IconButton
                icon={Search}
                variant="ghost"
                size="md"
                onClick={() => setShowSearch(true)}
                aria-label="Pesquisar"
                className="text-surface-600 dark:text-surface-400 hover:text-agriYellow-600 dark:hover:text-agriYellow-400"
              />
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Quick Actions - Hidden on mobile */}
          <div className="hidden xl:flex">
            <QuickActions />
          </div>

          {/* Theme Toggle */}
          <IconButton
            icon={isDarkMode ? Sun : Moon}
            variant="ghost"
            size="md"
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Modo claro" : "Modo escuro"}
            className="text-surface-600 dark:text-surface-400 hover:text-agriYellow-600 dark:hover:text-agriYellow-400"
          />

          {/* Notifications */}
          <div className="relative">
            <IconButton
              icon={Bell}
              variant="ghost"
              size="md"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notificações"
              className="text-surface-600 dark:text-surface-400 hover:text-agriYellow-600 dark:hover:text-agriYellow-400"
            />

            {unreadCount > 0 && (
              <Badge
                variant="danger"
                size="xs"
                className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 text-xs font-bold"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}

            <NotificationsDropdown
              notifications={notifications}
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          {/* Settings */}
          <IconButton
            icon={Settings}
            variant="ghost"
            size="md"
            onClick={openSettings}
            aria-label="Configurações"
            className="text-surface-600 dark:text-surface-400 hover:text-agriYellow-600 dark:hover:text-agriYellow-400"
          />

          {/* User Menu */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-surface-100 dark:bg-surface-800 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-agriYellow-400 rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-slate-900">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300 hidden md:block">
              {userName}
            </span>
            <ChevronDown className="w-4 h-4 text-surface-500 hidden md:block" />
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="lg:hidden px-6 py-3 border-t border-surface-200 dark:border-surface-700">
          <Input
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={Search}
            rightIcon={MoreVertical}
            className="w-full"
          />
        </div>
      )}
    </header>
  );
};
