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

  return (
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

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#166534] rounded-full flex items-center justify-center text-[#86efac] shadow-lg hover:bg-[#15803d] transition-colors z-30 border border-[#86efac]/30",
            isCollapsed && "right-[-12px]"
          )}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
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
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-2xl transition-all duration-200 group relative",
                  isActive 
                    ? "text-[#86efac]" 
                    : "text-[#dcfce7] hover:bg-[#166534]/30 hover:text-[#f0fdf4]"
                )}
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
              </button>
            );
          })}
        </div>

        {/* BI Section */}
        <div className="space-y-1">
          {!isCollapsed ? (
            <button 
              onClick={() => setIsBICategoryOpen(!isBICategoryOpen)}
              className="w-full flex items-center justify-between px-4 mb-2 group"
            >
              <p className="text-[11px] font-bold text-[#86efac] uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">Inteligência Estratégica</p>
              <ChevronDown className={cn("w-3 h-3 text-[#86efac] transition-transform", !isBICategoryOpen && "-rotate-90")} />
            </button>
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
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-2xl transition-all duration-200 group relative",
                        isActive 
                          ? "text-[#86efac]" 
                          : "text-[#dcfce7] hover:bg-[#166534]/30 hover:text-[#f0fdf4]"
                      )}
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
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <div className="p-4 border-t border-[#166534]/30 space-y-1">
        <button className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 text-[#dcfce7] hover:text-[#f0fdf4] hover:bg-[#166534]/30 rounded-2xl transition-all group",
          isCollapsed && "justify-center"
        )}>
          <Settings className="w-5 h-5 shrink-0 group-hover:rotate-90 transition-transform duration-500" />
          <span className={cn(
            "font-bold text-sm transition-all duration-300 overflow-hidden whitespace-nowrap",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            Configurações
          </span>
        </button>
        <button 
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 text-[#ffb4ab] hover:text-[#ffdad6] hover:bg-[#93000a]/20 rounded-2xl transition-all group",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
          <span className={cn(
            "font-bold text-sm transition-all duration-300 overflow-hidden whitespace-nowrap",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            Sair
          </span>
        </button>
      </div>
    </motion.aside>
  );
}
