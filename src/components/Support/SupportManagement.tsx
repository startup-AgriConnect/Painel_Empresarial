import React, { useState } from 'react';
import { 
  MessageSquare, 
  AlertTriangle, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  Phone, 
  MapPin, 
  MoreVertical, 
  MessageCircle, 
  ShieldAlert,
  ChevronRight,
  LifeBuoy,
  Truck,
  AlertCircle,
  Activity,
  ArrowUpRight,
  Headphones,
  History,
  Send
} from 'lucide-react';
import { cn, maskData } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

const initialSosAlerts = [
  {
    id: 'SOS-001',
    driver: 'Mateus Kiala',
    phone: '+244 923 456 789',
    location: 'Estrada Nacional 230 - Próximo a Lucala',
    type: 'AVARIA_MECANICA',
    severity: 'ALTA',
    status: 'EM_ATENDIMENTO',
    timestamp: '2026-04-07T11:05:00Z',
    vehicle: 'Volvo FH 460 - LD-45-22-AG'
  },
  {
    id: 'SOS-002',
    driver: 'António José',
    phone: '+244 912 334 556',
    location: 'Serra da Leba, Huíla',
    type: 'ACIDENTE',
    severity: 'CRITICA',
    status: 'PENDENTE',
    timestamp: '2026-04-07T11:15:00Z',
    vehicle: 'Scania R450 - LD-11-99-BC'
  }
];

const initialTickets = [
  {
    id: 'TKT-1024',
    subject: 'Dificuldade no levantamento de carga',
    user: 'Fazenda Girassol (João Manuel)',
    category: 'LOGISTICA',
    priority: 'MEDIA',
    status: 'ABERTO',
    lastUpdate: '2026-04-07T09:30:00Z',
    messages: 3
  },
  {
    id: 'TKT-1025',
    subject: 'Erro na validação do NIF',
    user: 'Cooperativa Agro-Huambo',
    category: 'CADASTRO',
    priority: 'BAIXA',
    status: 'EM_ANALISE',
    lastUpdate: '2026-04-07T10:45:00Z',
    messages: 1
  },
  {
    id: 'TKT-1026',
    subject: 'Pagamento não refletido na carteira',
    user: 'Carlos Alberto (Motorista)',
    category: 'FINANCEIRO',
    priority: 'ALTA',
    status: 'ABERTO',
    lastUpdate: '2026-04-07T11:10:00Z',
    messages: 2
  }
];

interface SupportManagementProps {
  onLocate?: (driverName: string) => void;
}

export default function SupportManagement({ onLocate }: SupportManagementProps) {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'SOS' | 'TICKETS'>('SOS');
  const [sosAlerts, setSosAlerts] = useState(initialSosAlerts);
  const [tickets, setTickets] = useState(initialTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [sosFilter, setSosFilter] = useState<'ALL' | 'PENDENTE' | 'RESOLVIDO'>('ALL');
  const [ticketFilter, setTicketFilter] = useState<'ALL' | 'ABERTO' | 'FECHADO'>('ALL');

  const filteredSos = sosAlerts.filter(sos => {
    const matchesSearch = sos.driver.toLowerCase().includes(searchTerm.toLowerCase()) || 
      sos.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sos.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = sosFilter === 'ALL' || sos.status === sosFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredTickets = tickets.filter(tkt => {
    const matchesSearch = tkt.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tkt.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tkt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = ticketFilter === 'ALL' || tkt.status === ticketFilter;
    return matchesSearch && matchesFilter;
  });

  const handleResolveSos = (id: string) => {
    setSosAlerts(prev => prev.map(sos => 
      sos.id === id ? { ...sos, status: 'RESOLVIDO' } : sos
    ));
  };

  const stats = {
    avgResponse: '14 min',
    resolutionRate: '92.4%',
    activeSos: sosAlerts.filter(s => s.status === 'PENDENTE').length,
    openTickets: tickets.filter(t => t.status === 'ABERTO').length
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-muted rounded-lg">
              <Headphones className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">Centro de Comando & Suporte</h2>
          </div>
          <p className="text-muted-foreground text-sm">Gestão de emergências em tempo real e assistência ao utilizador.</p>
        </div>

        <div className="flex bg-muted/80 p-1 rounded-lg border border-border backdrop-blur-sm">
          <button
            onClick={() => { setActiveView('SOS'); setSelectedTicket(null); }}
            className={cn(
              "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
              activeView === 'SOS' ? "bg-card text-destructive shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ShieldAlert className={cn("w-4 h-4", activeView === 'SOS' && "animate-pulse")} />
            Emergências (SOS)
            {stats.activeSos > 0 && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveView('TICKETS')}
            className={cn(
              "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
              activeView === 'TICKETS' ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MessageSquare className="w-4 h-4" />
            Tickets de Suporte
            <span className="bg-secondary text-muted-foreground px-1.5 py-0.5 rounded text-[10px]">
              {tickets.length}
            </span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Search and Quick Filters */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={activeView === 'SOS' ? "Filtrar por motorista, ID ou localização..." : "Filtrar por assunto, utilizador ou ID..."}
                className="w-full h-9 pl-9 pr-3 bg-background border border-input rounded-md text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border">
              {activeView === 'SOS' ? (
                <>
                  <button
                    onClick={() => setSosFilter('ALL')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      sosFilter === 'ALL' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setSosFilter('PENDENTE')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      sosFilter === 'PENDENTE' ? "bg-destructive text-destructive-foreground shadow-sm" : "text-muted-foreground hover:text-destructive"
                    )}
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full", sosFilter === 'PENDENTE' ? "bg-destructive-foreground" : "bg-destructive")} />
                    Pendentes
                  </button>
                  <button
                    onClick={() => setSosFilter('RESOLVIDO')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      sosFilter === 'RESOLVIDO' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full", sosFilter === 'RESOLVIDO' ? "bg-primary-foreground" : "bg-success")} />
                    Resolvidos
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setTicketFilter('ALL')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      ticketFilter === 'ALL' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setTicketFilter('ABERTO')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      ticketFilter === 'ABERTO' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full", ticketFilter === 'ABERTO' ? "bg-primary-foreground" : "bg-success")} />
                    Abertos
                  </button>
                </>
              )}
            </div>

            <button className="p-2 text-muted-foreground hover:bg-accent rounded-lg transition-colors">
              <History className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeView === 'SOS' ? (
              <motion.div 
                key="sos-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar"
              >
                {filteredSos.length > 0 ? filteredSos.map((sos) => (
                  <div key={sos.id} className={cn(
                    "bg-card rounded-lg border-2 overflow-hidden transition-all group relative",
                    sos.severity === 'CRITICA' ? "border-destructive/20 hover:border-destructive/30" : "border-warning/20 hover:border-warning/30"
                  )}>
                    {sos.status === 'PENDENTE' && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-destructive" />
                    )}
                    <div className="p-5 flex flex-col lg:flex-row gap-6">
                      <div className={cn(
                        "w-16 h-16 rounded-lg shrink-0 flex items-center justify-center shadow-inner",
                        sos.severity === 'CRITICA' ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                      )}>
                        <ShieldAlert className={cn("w-8 h-8", sos.status === 'PENDENTE' && "animate-pulse")} />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-black text-foreground tracking-tight">{maskData(sos.driver, user?.role)}</h3>
                              <div className={cn(
                                "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest",
                                sos.severity === 'CRITICA' ? "bg-destructive text-destructive-foreground" : "bg-warning text-warning-foreground"
                              )}>
                                {sos.severity}
                              </div>
                              <span className="text-[10px] font-mono font-semibold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border">{sos.id}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="font-semibold text-foreground">{maskData(sos.phone, user?.role)}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="font-medium">{maskData(sos.vehicle, user?.role)}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="font-medium">Há {Math.floor((new Date().getTime() - new Date(sos.timestamp).getTime()) / 60000)} min</span>
                              </div>
                            </div>
                          </div>
                          <div className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border-2",
                            sos.status === 'PENDENTE' ? "bg-destructive/10 text-destructive border-destructive/20" :
                            sos.status === 'RESOLVIDO' ? "bg-success/10 text-success border-success/20" :
                            "bg-info/10 text-info border-info/20"
                          )}>
                            {sos.status.replace('_', ' ')}
                          </div>
                        </div>

                        <div className="p-3 bg-muted/50 rounded-lg flex items-start gap-3 border border-border group-hover:bg-card transition-colors">
                          <div className="p-1.5 bg-card rounded-lg shadow-sm">
                            <MapPin className="w-4 h-4 text-destructive" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Localização do Incidente</p>
                            <p className="text-xs font-semibold text-foreground leading-tight">{sos.location}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            onClick={() => onLocate?.(sos.driver)}
                            className="px-4 py-2 bg-card border border-border text-foreground rounded-lg text-xs font-black uppercase tracking-widest hover:bg-accent transition-all flex items-center gap-2"
                          >
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                            Localizar
                          </button>
                          {sos.status !== 'RESOLVIDO' && (
                            <button
                              onClick={() => handleResolveSos(sos.id)}
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-2 ml-auto shadow-lg"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Resolver
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 py-20">
                    <div className="p-6 bg-muted/50 rounded-full">
                      <Search className="w-12 h-12 opacity-20" />
                    </div>
                    <p className="font-semibold">Nenhum alerta SOS encontrado.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="tickets-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col bg-card rounded-lg border border-border shadow-sm overflow-hidden"
              >
                <div className="flex-1 overflow-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-muted/80 backdrop-blur-md border-b border-border">
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ticket / Assunto</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Utilizador</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Prioridade</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredTickets.length > 0 ? filteredTickets.map((tkt) => (
                        <tr
                          key={tkt.id}
                          onClick={() => setSelectedTicket(tkt)}
                          className={cn(
                            "hover:bg-accent/30 transition-all cursor-pointer group",
                            selectedTicket?.id === tkt.id && "bg-accent/50"
                          )}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                tkt.status === 'ABERTO' ? "bg-muted/50 text-primary" : "bg-muted/50 text-muted-foreground"
                              )}>
                                <MessageCircle className="w-5 h-5" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{tkt.subject}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase">{tkt.id}</span>
                                  <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tighter">{tkt.category}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center border border-background shadow-sm overflow-hidden">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <span className="text-xs font-semibold text-foreground">{maskData(tkt.user, user?.role)}</span>
                              </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <div className={cn(
                                "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border",
                                tkt.priority === 'ALTA' ? "bg-destructive/10 text-destructive border-destructive/20" :
                                tkt.priority === 'MEDIA' ? "bg-warning/10 text-warning border-warning/20" :
                                "bg-success/10 text-success border-success/20"
                              )}>
                                {tkt.priority}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5",
                                tkt.status === 'ABERTO' ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                              )}>
                                <div className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  tkt.status === 'ABERTO' ? "bg-success animate-pulse" : "bg-muted-foreground"
                                )} />
                                {tkt.status.replace('_', ' ')}
                              </span>
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                                <Clock className="w-3 h-3" />
                                {new Date(tkt.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {tkt.messages > 0 && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 text-primary rounded-lg text-[10px] font-black">
                                  <MessageSquare className="w-3 h-3" />
                                  {tkt.messages}
                                </div>
                              )}
                              <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="py-20 text-center text-muted-foreground">
                             <div className="flex flex-col items-center gap-4">
                               <div className="p-6 bg-muted/50 rounded-full">
                                 <MessageSquare className="w-12 h-12 opacity-20" />
                               </div>
                               <p className="font-semibold">Nenhum ticket encontrado.</p>
                             </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar - Stats & Details */}
        <div className="w-80 flex flex-col gap-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-card p-5 rounded-lg border border-border shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity className="w-16 h-16" />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Tempo de Resposta
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-foreground">{stats.avgResponse}</span>
                <span className="text-[10px] font-semibold text-success flex items-center">
                  <ArrowUpRight className="w-3 h-3 rotate-180" />
                  -2m
                </span>
              </div>
            </div>

            <div className="bg-card p-5 rounded-lg border border-border shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <CheckCircle2 className="w-16 h-16" />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                <Activity className="w-3 h-3" />
                Taxa de Resolução
              </p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-black text-foreground">{stats.resolutionRate}</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: stats.resolutionRate }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Contextual Panel */}
          <div className="flex-1 bg-primary rounded-xl p-6 text-primary-foreground relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-primary/80 rounded-full blur-3xl opacity-50" />

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/80 rounded-lg">
                  <ShieldAlert className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Protocolo SOS</h3>
              </div>

              <div className="space-y-4 flex-1">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
                  <p className="text-xs font-semibold text-primary-foreground uppercase tracking-widest mb-2">Ação Automática</p>
                  <p className="text-xs text-primary-foreground/80 leading-relaxed">
                    Alertas <span className="text-primary-foreground font-semibold">CRÍTICOS</span> ativam imediatamente a rede de emergência local e notificam a equipa de intervenção.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-primary-foreground/70 uppercase tracking-widest">Contactos Rápidos</p>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <span className="text-xs font-semibold">Polícia Nacional</span>
                    <span className="text-xs font-mono text-primary-foreground">113</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <span className="text-xs font-semibold">INEMA (Ambulância)</span>
                    <span className="text-xs font-mono text-primary-foreground">112</span>
                  </div>
                </div>
              </div>

              <button className="mt-auto w-full py-3 bg-background text-primary rounded-lg text-xs font-black uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center gap-2">
                Ver Manuais de Segurança
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Detail Modal / Overlay */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm p-4"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-lg h-full bg-card rounded-xl shadow-lg flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex justify-between items-center bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-card rounded-lg shadow-sm">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground tracking-tight">{selectedTicket.id}</h3>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{selectedTicket.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-foreground leading-tight">{selectedTicket.subject}</h4>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                      selectedTicket.priority === 'ALTA' ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                    )}>
                      Prioridade {selectedTicket.priority}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">Aberto em {new Date(selectedTicket.lastUpdate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border border-border flex items-center gap-4">
                  <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center shadow-sm border border-border">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Utilizador</p>
                    <p className="text-sm font-semibold text-foreground">{maskData(selectedTicket.user, user?.role)}</p>
                  </div>
                  <button className="ml-auto p-2 text-primary hover:bg-accent rounded-lg transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Histórico de Mensagens</p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg rounded-tl-none text-sm text-foreground max-w-[80%]">
                        Olá, estou com dificuldades em validar o meu NIF no sistema. Podem ajudar?
                      </div>
                    </div>
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                        <Headphones className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="bg-primary p-3 rounded-lg rounded-tr-none text-sm text-primary-foreground max-w-[80%]">
                        Olá! Com certeza. Por favor, confirme se o NIF inserido tem 9 dígitos e se corresponde ao nome da empresa.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-card">
                <div className="relative">
                  <textarea
                    placeholder="Escreva a sua resposta..."
                    className="w-full pl-4 pr-12 py-3 bg-muted/50 border border-border rounded-lg text-sm focus:ring-2 focus:ring-ring outline-none resize-none min-h-[100px]"
                  />
                  <button className="absolute right-3 bottom-3 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-lg">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
