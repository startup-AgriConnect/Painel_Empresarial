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
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Headphones className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Centro de Comando & Suporte</h2>
          </div>
          <p className="text-gray-500 text-sm">Gestão de emergências em tempo real e assistência ao utilizador.</p>
        </div>
        
        <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-200 backdrop-blur-sm">
          <button 
            onClick={() => { setActiveView('SOS'); setSelectedTicket(null); }}
            className={cn(
              "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
              activeView === 'SOS' ? "bg-white text-rose-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <ShieldAlert className={cn("w-4 h-4", activeView === 'SOS' && "animate-pulse")} />
            Emergências (SOS)
            {stats.activeSos > 0 && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveView('TICKETS')}
            className={cn(
              "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
              activeView === 'TICKETS' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <MessageSquare className="w-4 h-4" />
            Tickets de Suporte
            <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">
              {tickets.length}
            </span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Search and Quick Filters */}
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder={activeView === 'SOS' ? "Filtrar por motorista, ID ou localização..." : "Filtrar por assunto, utilizador ou ID..."}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="h-8 w-[1px] bg-gray-100 mx-1" />
            
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
              {activeView === 'SOS' ? (
                <>
                  <button 
                    onClick={() => setSosFilter('ALL')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      sosFilter === 'ALL' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setSosFilter('PENDENTE')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      sosFilter === 'PENDENTE' ? "bg-rose-600 text-white shadow-sm" : "text-gray-400 hover:text-rose-600"
                    )}
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full", sosFilter === 'PENDENTE' ? "bg-white" : "bg-rose-500")} />
                    Pendentes
                  </button>
                  <button 
                    onClick={() => setSosFilter('RESOLVIDO')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      sosFilter === 'RESOLVIDO' ? "bg-emerald-600 text-white shadow-sm" : "text-gray-400 hover:text-emerald-600"
                    )}
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full", sosFilter === 'RESOLVIDO' ? "bg-white" : "bg-emerald-500")} />
                    Resolvidos
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setTicketFilter('ALL')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      ticketFilter === 'ALL' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setTicketFilter('ABERTO')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      ticketFilter === 'ABERTO' ? "bg-emerald-600 text-white shadow-sm" : "text-gray-400 hover:text-emerald-600"
                    )}
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full", ticketFilter === 'ABERTO' ? "bg-white" : "bg-emerald-500")} />
                    Abertos
                  </button>
                </>
              )}
            </div>

            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors">
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
                    "bg-white rounded-2xl border-2 overflow-hidden transition-all group relative",
                    sos.severity === 'CRITICA' ? "border-rose-100 hover:border-rose-200" : "border-amber-100 hover:border-amber-200"
                  )}>
                    {sos.status === 'PENDENTE' && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                    )}
                    <div className="p-5 flex flex-col lg:flex-row gap-6">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center shadow-inner",
                        sos.severity === 'CRITICA' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                      )}>
                        <ShieldAlert className={cn("w-8 h-8", sos.status === 'PENDENTE' && "animate-pulse")} />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-black text-gray-900 tracking-tight">{maskData(sos.driver, user?.role)}</h3>
                              <div className={cn(
                                "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest",
                                sos.severity === 'CRITICA' ? "bg-rose-600 text-white" : "bg-amber-500 text-white"
                              )}>
                                {sos.severity}
                              </div>
                              <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{sos.id}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-gray-500">
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                <span className="font-bold text-gray-700">{maskData(sos.phone, user?.role)}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-gray-400" />
                                <span className="font-medium">{maskData(sos.vehicle, user?.role)}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                <span className="font-medium">Há {Math.floor((new Date().getTime() - new Date(sos.timestamp).getTime()) / 60000)} min</span>
                              </div>
                            </div>
                          </div>
                          <div className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border-2",
                            sos.status === 'PENDENTE' ? "bg-rose-50 text-rose-600 border-rose-100" : 
                            sos.status === 'RESOLVIDO' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            "bg-blue-50 text-blue-600 border-blue-100"
                          )}>
                            {sos.status.replace('_', ' ')}
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50/50 rounded-xl flex items-start gap-3 border border-gray-100 group-hover:bg-white transition-colors">
                          <div className="p-1.5 bg-white rounded-lg shadow-sm">
                            <MapPin className="w-4 h-4 text-rose-500" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Localização do Incidente</p>
                            <p className="text-xs font-bold text-gray-700 leading-tight">{sos.location}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <button 
                            onClick={() => onLocate?.(sos.driver)}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2"
                          >
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            Localizar
                          </button>
                          {sos.status !== 'RESOLVIDO' && (
                            <button 
                              onClick={() => handleResolveSos(sos.id)}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2 ml-auto shadow-lg shadow-emerald-600/20"
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
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 py-20">
                    <div className="p-6 bg-gray-50 rounded-full">
                      <Search className="w-12 h-12 opacity-20" />
                    </div>
                    <p className="font-bold">Nenhum alerta SOS encontrado.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="tickets-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="flex-1 overflow-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gray-50/80 backdrop-blur-md border-b border-gray-100">
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ticket / Assunto</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilizador</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Prioridade</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredTickets.length > 0 ? filteredTickets.map((tkt) => (
                        <tr 
                          key={tkt.id} 
                          onClick={() => setSelectedTicket(tkt)}
                          className={cn(
                            "hover:bg-emerald-50/30 transition-all cursor-pointer group",
                            selectedTicket?.id === tkt.id && "bg-emerald-50/50"
                          )}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                tkt.status === 'ABERTO' ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"
                              )}>
                                <MessageCircle className="w-5 h-5" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{tkt.subject}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">{tkt.id}</span>
                                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{tkt.category}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-white shadow-sm overflow-hidden">
                                  <User className="w-4 h-4 text-gray-500" />
                                </div>
                                <span className="text-xs font-bold text-gray-700">{maskData(tkt.user, user?.role)}</span>
                              </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <div className={cn(
                                "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border",
                                tkt.priority === 'ALTA' ? "bg-rose-50 text-rose-600 border-rose-100" : 
                                tkt.priority === 'MEDIA' ? "bg-amber-50 text-amber-600 border-amber-100" : 
                                "bg-emerald-50 text-emerald-600 border-emerald-100"
                              )}>
                                {tkt.priority}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5",
                                tkt.status === 'ABERTO' ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                              )}>
                                <div className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  tkt.status === 'ABERTO' ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                                )} />
                                {tkt.status.replace('_', ' ')}
                              </span>
                              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                                <Clock className="w-3 h-3" />
                                {new Date(tkt.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {tkt.messages > 0 && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black">
                                  <MessageSquare className="w-3 h-3" />
                                  {tkt.messages}
                                </div>
                              )}
                              <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="py-20 text-center text-gray-400">
                             <div className="flex flex-col items-center gap-4">
                               <div className="p-6 bg-gray-50 rounded-full">
                                 <MessageSquare className="w-12 h-12 opacity-20" />
                               </div>
                               <p className="font-bold">Nenhum ticket encontrado.</p>
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
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity className="w-16 h-16" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Tempo de Resposta
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">{stats.avgResponse}</span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3 rotate-180" />
                  -2m
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <CheckCircle2 className="w-16 h-16" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Activity className="w-3 h-3" />
                Taxa de Resolução
              </p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-black text-gray-900">{stats.resolutionRate}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: stats.resolutionRate }}
                  className="h-full bg-emerald-500 rounded-full" 
                />
              </div>
            </div>
          </div>

          {/* Contextual Panel */}
          <div className="flex-1 bg-emerald-900 rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-emerald-800 rounded-full blur-3xl opacity-50" />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-800 rounded-xl">
                  <ShieldAlert className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold">Protocolo SOS</h3>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Ação Automática</p>
                  <p className="text-xs text-emerald-100 leading-relaxed">
                    Alertas <span className="text-white font-bold">CRÍTICOS</span> ativam imediatamente a rede de emergência local e notificam a equipa de intervenção.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Contactos Rápidos</p>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs font-bold">Polícia Nacional</span>
                    <span className="text-xs font-mono text-emerald-400">113</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-xs font-bold">INEMA (Ambulância)</span>
                    <span className="text-xs font-mono text-emerald-400">112</span>
                  </div>
                </div>
              </div>

              <button className="mt-auto w-full py-3 bg-white text-emerald-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
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
              className="w-full max-w-lg h-full bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 tracking-tight">{selectedTicket.id}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedTicket.category}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-gray-900 leading-tight">{selectedTicket.subject}</h4>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                      selectedTicket.priority === 'ALTA' ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                    )}>
                      Prioridade {selectedTicket.priority}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">Aberto em {new Date(selectedTicket.lastUpdate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilizador</p>
                    <p className="text-sm font-bold text-gray-900">{maskData(selectedTicket.user, user?.role)}</p>
                  </div>
                  <button className="ml-auto p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Histórico de Mensagens</p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-sm text-gray-700 max-w-[80%]">
                        Olá, estou com dificuldades em validar o meu NIF no sistema. Podem ajudar?
                      </div>
                    </div>
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="w-8 h-8 rounded-lg bg-emerald-900 flex items-center justify-center shrink-0">
                        <Headphones className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="bg-emerald-900 p-3 rounded-2xl rounded-tr-none text-sm text-white max-w-[80%]">
                        Olá! Com certeza. Por favor, confirme se o NIF inserido tem 9 dígitos e se corresponde ao nome da empresa.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-white">
                <div className="relative">
                  <textarea 
                    placeholder="Escreva a sua resposta..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none min-h-[100px]"
                  />
                  <button className="absolute right-3 bottom-3 p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
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
