import React, { useState } from 'react';
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
import { cn } from './lib/utils';

import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import { useHashRoute } from './hooks/useHashRoute';
import { DEFAULT_APP_HASH, isLoginHash, isProtectedHash } from './lib/routes';

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
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={navigateToTab} userRole={user?.role || 'COMPANY'} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
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
    </AuthProvider>
  );
}
