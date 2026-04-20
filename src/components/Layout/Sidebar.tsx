import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  Settings,
  LogOut,
  Package,
  Warehouse,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Satellite,
  Tractor,
  FileText,
  ChevronDown,
  DollarSign
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import ConfirmationModal from '../Common/ConfirmationModal';
import { LOGIN_HASH } from '../../lib/routes';
import { Button } from '../ui/button';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: 'STARTUP' | 'COMPANY';
}

const operationalItems = [
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  { id: 'hubs', label: 'Hubs de Consolidação', icon: Warehouse },
  { id: 'freights', label: 'Monitorização', icon: Truck },
  { id: 'loads', label: 'Gestão de Cargas', icon: Package },
  { id: 'team', label: 'Equipa', icon: Users },
];

const biItems = [
  { id: 'bi-overview', label: 'Visão Geral BI', icon: LayoutDashboard },
  { id: 'agricultural-production', label: 'Produção Agrícola', icon: Leaf },
  { id: 'geointelligence', label: 'Geointeligência', icon: Satellite },
  { id: 'producers-farms', label: 'Produtores / Fazendas', icon: Tractor },
  { id: 'price-demand', label: 'Preços e Demanda', icon: DollarSign },
  { id: 'reports', label: 'Relatórios', icon: FileText },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isBICategoryOpen, setIsBICategoryOpen] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.hash = LOGIN_HASH;
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Terminar sessão"
        message="Tem a certeza de que deseja sair agora? Será redirecionado para a página de login."
        confirmText="Terminar sessão"
        cancelText="Continuar no painel"
        variant="warning"
      />
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-[#052e16] text-[#f0fdf4] h-screen flex flex-col sticky top-0 z-20 shadow-2xl border-r border-[#166534]/30"
      >
      <div className={cn(
        "p-6 flex items-center relative",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
          <div className="w-10 h-10 bg-[#166534] rounded-xl flex items-center justify-center shrink-0 shadow-lg border border-[#86efac]/20">
            <img 
              src="/Assets/Logos/logo_simples_branca.png" 
              alt="AgriConnect Logo" 
              className="w-6 h-6 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-max">
            <h1 className="text-lg font-bold tracking-tight text-[#f0fdf4]">AgriConnect</h1>
            <p className="text-[#86efac] text-[10px] font-bold uppercase tracking-widest">
              {user?.companyName || (user?.role === 'STARTUP' ? 'Startup Panel' : 'Business Intelligence')}
            </p>
          </div>
        </div>

        {isCollapsed && (
          <div className="w-10 h-10 bg-[#166534] rounded-xl flex items-center justify-center shadow-lg border border-[#86efac]/20">
            <img 
              src="/Assets/Logos/logo_simples_branca.png" 
              alt="AgriConnect Logo" 
              className="w-6 h-6 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-3 top-1/2 z-30 h-6 w-6 -translate-y-1/2 rounded-full border border-[#86efac]/30 bg-[#166534] p-0 text-[#86efac] shadow-lg hover:bg-[#15803d]",
            isCollapsed && "right-[-12px]"
          )}
          size="icon"
          variant="ghost"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto custom-scrollbar">
        {/* Operational Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-4 text-[11px] font-bold text-[#86efac] uppercase tracking-wider mb-2 opacity-60">Operacional Partilhado</p>
          )}
          {operationalItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "relative flex h-auto w-full items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-200 group",
                  isActive 
                    ? "text-[#86efac]" 
                    : "text-[#dcfce7] hover:bg-[#166534]/30 hover:text-[#f0fdf4]"
                )}
                variant="ghost"
                title={isCollapsed ? item.label : undefined}
              >
                <div className={cn(
                  "flex items-center gap-3 w-full px-1 py-1 rounded-full transition-all duration-300",
                  isActive && !isCollapsed && "bg-[#166534]"
                )}>
                  <div className={cn(
                    "w-10 h-8 flex items-center justify-center rounded-full transition-all duration-300",
                    isActive && isCollapsed && "bg-[#166534]"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                      isActive ? "text-[#86efac]" : "text-[#dcfce7]"
                    )} />
                  </div>
                  <span className={cn(
                    "font-bold text-sm transition-all duration-300 overflow-hidden whitespace-nowrap",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  )}>
                    {item.label}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>

        {/* BI Section */}
        <div className="space-y-1">
          {!isCollapsed ? (
            <Button 
              onClick={() => setIsBICategoryOpen(!isBICategoryOpen)}
              className="mb-2 flex h-auto w-full items-center justify-between px-4 group"
              variant="ghost"
            >
              <p className="text-[11px] font-bold text-[#86efac] uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">Inteligência Estratégica</p>
              <ChevronDown className={cn("w-3 h-3 text-[#86efac] transition-transform", !isBICategoryOpen && "-rotate-90")} />
            </Button>
          ) : (
            <div className="h-[1px] bg-[#166534]/30 mx-4 my-4" />
          )}
          
          <AnimatePresence>
            {(isBICategoryOpen || isCollapsed) && (
              <motion.div
                initial={isCollapsed ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1 overflow-hidden"
              >
                {biItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <Button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "relative flex h-auto w-full items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-200 group",
                        isActive 
                          ? "text-[#86efac]" 
                          : "text-[#dcfce7] hover:bg-[#166534]/30 hover:text-[#f0fdf4]"
                      )}
                      variant="ghost"
                      title={isCollapsed ? item.label : undefined}
                    >
                      <div className={cn(
                        "flex items-center gap-3 w-full px-1 py-1 rounded-full transition-all duration-300",
                        isActive && !isCollapsed && "bg-[#166534]"
                      )}>
                        <div className={cn(
                          "w-10 h-8 flex items-center justify-center rounded-full transition-all duration-300",
                          isActive && isCollapsed && "bg-[#166534]"
                        )}>
                          <Icon className={cn(
                            "w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                            isActive ? "text-[#86efac]" : "text-[#dcfce7]"
                          )} />
                        </div>
                        <span className={cn(
                          "font-bold text-sm transition-all duration-300 overflow-hidden whitespace-nowrap",
                          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                        )}>
                          {item.label}
                        </span>
                      </div>
                    </Button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <div className="p-4 border-t border-[#166534]/30 space-y-1">
        <Button className={cn(
          "h-auto w-full justify-start gap-3 rounded-2xl px-3 py-2.5 text-[#dcfce7] transition-all group hover:bg-[#166534]/30 hover:text-[#f0fdf4]",
          isCollapsed && "justify-center"
        )} variant="ghost">
          <Settings className="w-5 h-5 shrink-0 group-hover:rotate-90 transition-transform duration-500" />
          <span className={cn(
            "font-bold text-sm transition-all duration-300 overflow-hidden whitespace-nowrap",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            Configurações
          </span>
        </Button>
        <Button 
          onClick={() => setIsLogoutModalOpen(true)}
          className={cn(
            "h-auto w-full justify-start gap-3 rounded-2xl px-3 py-2.5 text-[#ffb4ab] transition-all group hover:bg-[#93000a]/20 hover:text-[#ffdad6]",
            isCollapsed && "justify-center"
          )}
          variant="ghost"
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
          <span className={cn(
            "font-bold text-sm transition-all duration-300 overflow-hidden whitespace-nowrap",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            Sair
          </span>
        </Button>
      </div>
      </motion.aside>
    </>
  );
}
