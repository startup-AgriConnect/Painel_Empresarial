import React from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import LoadsManagement from './components/Loads/LoadsManagement';
import HubsManagement from './components/Hubs/HubsManagement';
import MarketplaceManagement from './components/Marketplace/MarketplaceManagement';
import MonitoringManagement from './components/Monitoring/MonitoringManagement';
import TeamManagement from './components/Team/TeamManagement';
import BIOverview from './components/BI/Overview/BIOverview';
import AgriculturalProduction from './components/BI/AgriculturalProduction/AgriculturalProduction';
import Geointelligence from './components/BI/Geointelligence/Geointelligence';
import ProducersFarms from './components/BI/ProducersFarms/ProducersFarms';
import PriceDemand from './components/BI/PriceDemand/PriceDemand';
import Reports from './components/BI/Reports/Reports';
import { motion, AnimatePresence } from 'motion/react';

import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import { useHashRoute } from './hooks/useHashRoute';
import { DEFAULT_APP_HASH, isLoginHash, isProtectedHash } from './lib/routes';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const { activeTab, navigateToTab } = useHashRoute();

  React.useEffect(() => {
    if (!isAuthenticated && isProtectedHash(window.location.hash)) {
      window.history.replaceState(null, '', '#/login');
    }

    if (isAuthenticated && isLoginHash(window.location.hash)) {
      window.history.replaceState(null, '', DEFAULT_APP_HASH);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'marketplace':
        return <MarketplaceManagement />;
      case 'hubs':
        return <HubsManagement />;
      case 'loads':
        return <LoadsManagement />;
      case 'freights':
        return <MonitoringManagement />;
      case 'team':
        return <TeamManagement />;
      case 'bi-overview':
        return <BIOverview />;
      case 'agricultural-production':
        return <AgriculturalProduction />;
      case 'geointelligence':
        return <Geointelligence />;
      case 'producers-farms':
        return <ProducersFarms />;
      case 'price-demand':
        return <PriceDemand />;
      case 'reports':
        return <Reports />;
      default:
        return <BIOverview />;
    }
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={navigateToTab} userRole={user?.role || 'COMPANY'} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="custom-scrollbar flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
