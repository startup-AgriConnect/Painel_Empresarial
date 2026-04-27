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
  DollarSign,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import ConfirmationModal from '../Common/ConfirmationModal';
import { LOGIN_HASH } from '../../lib/routes';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

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

  const renderItem = (item: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    const button = (
      <Button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        variant="ghost"
        className={cn(
          'h-9 w-full justify-start gap-2 px-3 font-medium',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          isCollapsed && 'justify-center px-0'
        )}
      >
        <Icon className="size-4 shrink-0" />
        {!isCollapsed && <span className="truncate">{item.label}</span>}
      </Button>
    );
    if (isCollapsed) {
      return (
        <Tooltip key={item.id}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      );
    }
    return button;
  };

  return (
    <TooltipProvider delayDuration={100}>
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
        animate={{ width: isCollapsed ? 72 : 256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-sidebar text-sidebar-foreground border-sidebar-border sticky top-0 z-20 flex h-screen flex-col border-r"
      >
        <div
          className={cn(
            'flex h-16 items-center px-4',
            isCollapsed ? 'justify-center' : 'justify-between'
          )}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
                <img
                  src="/Assets/Logos/logo_simples_branca.png"
                  alt="AgriConnect"
                  className="size-5 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-none">AgriConnect</span>
                <span className="text-muted-foreground mt-1 text-[10px] uppercase tracking-wider">
                  {user?.companyName || (user?.role === 'STARTUP' ? 'Startup Panel' : 'BI')}
                </span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <img
                src="/Assets/Logos/logo_simples_branca.png"
                alt="AgriConnect"
                className="size-5 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>

        <Separator className="bg-sidebar-border" />

        <nav className="custom-scrollbar flex-1 overflow-y-auto p-2 space-y-4">
          <div className="space-y-0.5">
            {!isCollapsed && (
              <p className="text-muted-foreground px-3 py-2 text-[10px] font-medium uppercase tracking-wider">
                Operacional
              </p>
            )}
            {operationalItems.map(renderItem)}
          </div>

          <div className="space-y-0.5">
            {!isCollapsed ? (
              <button
                type="button"
                onClick={() => setIsBICategoryOpen(!isBICategoryOpen)}
                className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between px-3 py-2 text-[10px] font-medium uppercase tracking-wider transition-colors"
              >
                <span>Inteligência Estratégica</span>
                <ChevronDown
                  className={cn('size-3 transition-transform', !isBICategoryOpen && '-rotate-90')}
                />
              </button>
            ) : (
              <div className="my-2 h-px bg-sidebar-border mx-2" />
            )}

            <AnimatePresence initial={false}>
              {(isBICategoryOpen || isCollapsed) && (
                <motion.div
                  initial={isCollapsed ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-0.5 overflow-hidden"
                >
                  {biItems.map(renderItem)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <Separator className="bg-sidebar-border" />

        <div className="space-y-0.5 p-2">
          <Button
            variant="ghost"
            className={cn(
              'h-9 w-full justify-start gap-2 px-3 font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              isCollapsed && 'justify-center px-0'
            )}
          >
            <Settings className="size-4 shrink-0" />
            {!isCollapsed && <span>Configurações</span>}
          </Button>
          <Button
            onClick={() => setIsLogoutModalOpen(true)}
            variant="ghost"
            className={cn(
              'h-9 w-full justify-start gap-2 px-3 font-medium text-destructive hover:bg-destructive/10 hover:text-destructive',
              isCollapsed && 'justify-center px-0'
            )}
          >
            <LogOut className="size-4 shrink-0" />
            {!isCollapsed && <span>Sair</span>}
          </Button>
        </div>

        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          size="icon"
          variant="outline"
          className="absolute -right-3 top-16 size-6 rounded-full shadow-sm"
        >
          {isCollapsed ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
        </Button>
      </motion.aside>
    </TooltipProvider>
  );
}
