import { useState, useEffect } from "react";
import { UserRole, AppTab, FilterContext } from "./types";
import { AuthProvider } from "./contexts/AuthContext";
import { CompanyProvider } from "./contexts/CompanyContext";
import LoginScreen from "./pages/auth/LoginScreen";
import RegisterScreen from "./pages/auth/RegisterScreen";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import FilterStrip from "./components/shared/FilterStrip";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import LogisticsRadar from "./pages/logistics/LogisticsRadar";
import AIPredictions from "./pages/reports/AIPredictions";
import FarmsCensus from "./pages/farms/FarmsCensus";
import Geointeligencia from "./pages/geointel/Geointeligencia";
import RankingComunas from "./pages/geointel/RankingComunas";
import ProductionFlow from "./pages/logistics/ProductionFlow";
import ReportsBI from "./pages/reports/ReportsBI";
import RiskAnalysis from "./pages/reports/RiskAnalysis";
import HubsStatus from "./pages/hubs/HubsStatus";
import MicroAgregadores from "./pages/hubs/MicroAgregadores";
import Marketplace from "./pages/marketplace/Marketplace";
import CompanyUsersMgmt from "./pages/companies/CompanyUsersMgmt";
import NotificationsPanel from "./components/shared/NotificationsPanel";
import SettingsPanel from "./components/shared/SettingsPanel";

function AppContent() {
  // Estado de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  // Estado da interface
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.VISAO_ESTRATEGICA);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Estado de filtros
  const [filters, setFilters] = useState<FilterContext>({
    province: "nacional",
    municipality: "todos",
    commune: "todos",
    timeRange: "30d",
  });

  // Carregar preferências do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("agriconnect-theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    const savedSidebar = localStorage.getItem("agriconnect-sidebar");
    if (savedSidebar === "closed") {
      setIsSidebarOpen(false);
    }
  }, []);

  // Handlers de autenticação
  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);

    // Define tab inicial baseado no role
    if (role === UserRole.STARTUP) {
      setActiveTab(AppTab.STARTUP_DASHBOARD);
    } else if (role === UserRole.GOVERNMENT) {
      setActiveTab(AppTab.VISAO_ESTRATEGICA);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      setIsAuthenticated(false);
      setUserRole(null);
      setActiveTab(AppTab.VISAO_ESTRATEGICA);
      setShowNotifications(false);
      setShowSettings(false);
    }
  };

  const handleRegister = (role: UserRole) => {
    setShowRegister(false);
    handleLogin(role);
  };

  // Handlers de UI
  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("agriconnect-sidebar", newState ? "open" : "closed");
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("agriconnect-theme", newMode ? "dark" : "light");
  };

  const updateFilter = (key: keyof FilterContext, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const setProvince = (province: string) => {
    setFilters((prev) => ({
      ...prev,
      province,
      municipality: "todos",
      commune: "todos",
    }));
  };

  // Renderização condicional de telas
  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <RegisterScreen
          onRegisterSuccess={handleRegister}
          onBackToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <LoginScreen
        onLogin={handleLogin}
        onGoToRegister={() => setShowRegister(true)}
      />
    );
  }

  // Renderizar conteúdo da tab ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case AppTab.VISAO_ESTRATEGICA:
        return <DashboardOverview filters={filters} isDarkMode={isDarkMode} />;

      case AppTab.MARKETPLACE:
        return <Marketplace filters={filters} />;

      case AppTab.FAZENDAS:
        return <FarmsCensus filters={filters} />;

      case AppTab.RANKING_COMUNAS:
        return <RankingComunas filters={filters} isDarkMode={isDarkMode} />;

      case AppTab.FLUXO_PRODUCAO:
        return <ProductionFlow filters={filters} />;

      case AppTab.GEOINTELIGENCIA:
        return <Geointeligencia filters={filters} />;

      case AppTab.PREDICOES_IA:
        return <AIPredictions />;

      case AppTab.RISCO:
        return <RiskAnalysis />;

      case AppTab.LOGISTICA_RADAR:
        return <LogisticsRadar />;

      case AppTab.HUBS:
        return <HubsStatus province={filters.province} />;

      case AppTab.MICRO_AGREGADORES:
        return <MicroAgregadores />;

      case AppTab.RELATORIOS:
        return <ReportsBI filters={filters} />;

      case AppTab.UTILIZADORES:
        return <CompanyUsersMgmt />;

      // Tabs da Startup (podem ser implementadas posteriormente)
      case AppTab.STARTUP_DASHBOARD:
        return (
          <div className="p-8">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
              Dashboard Operacional
            </h2>
            <p className="text-slate-500 mt-2">
              Painel administrativo da startup em desenvolvimento...
            </p>
          </div>
        );

      default:
        return (
          <div className="p-8">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
              Módulo em Desenvolvimento
            </h2>
            <p className="text-slate-500 mt-2">
              Esta funcionalidade estará disponível em breve.
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className={`flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 ${isDarkMode ? "dark" : ""}`}
    >
      {/* Sidebar */}
      <Sidebar
        userRole={userRole!}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          activeTab={activeTab}
          province={filters.province}
          setProvince={setProvince}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
          openNotifications={() => setShowNotifications(true)}
          openSettings={() => setShowSettings(true)}
        />

        {/* Filter Strip - Only show in certain tabs */}
        {[
          AppTab.VISAO_ESTRATEGICA,
          AppTab.FAZENDAS,
          AppTab.RANKING_COMUNAS,
          AppTab.GEOINTELIGENCIA,
          AppTab.PREDICOES_IA,
          AppTab.RISCO,
          AppTab.LOGISTICA_RADAR,
          AppTab.HUBS,
          AppTab.MICRO_AGREGADORES,
          AppTab.MARKETPLACE,
          AppTab.RELATORIOS,
        ].includes(activeTab) && (
          <FilterStrip filters={filters} updateFilter={updateFilter} />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900">
          {renderTabContent()}
        </main>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <NotificationsPanel
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}

// Wrapper com Providers
function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <AppContent />
      </CompanyProvider>
    </AuthProvider>
  );
}

export default App;
