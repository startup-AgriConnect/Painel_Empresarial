import React from "react";
import {
  X,
  Bell,
  Truck,
  Coins,
  Cpu,
  Trash2,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useFetch } from "../../services/hooks";
import { mockAPI } from "../../services/mockData";
import {
  TipoNotificacao,
  CategoriaNotificacao,
  Notificacao,
} from "../../types";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: notificacoesData, loading } = useFetch(
    () => mockAPI.notificacoes.list(),
    [isOpen],
  );

  const notifications = notificacoesData || [];

  const getNotificationIcon = (
    tipo: TipoNotificacao,
    categoria: CategoriaNotificacao,
  ) => {
    if (categoria === CategoriaNotificacao.FRETE)
      return <Truck className="w-4 h-4 text-agriYellow" />;
    if (tipo === TipoNotificacao.ALERTA)
      return <Cpu className="w-4 h-4 text-purple-500" />;
    return <Coins className="w-4 h-4 text-emerald-500" />;
  };

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 60000,
    );
    if (minutes < 60) return `${minutes}m atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    return `${Math.floor(hours / 24)}d atrás`;
  };
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white dark:bg-slate-950 z-[101] shadow-2xl transition-transform duration-500 transform ${isOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}
      >
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-agriYellow rounded-xl flex items-center justify-center text-slate-900 shadow-lg">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
              Notificações
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-agriYellow animate-spin" />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((n: Notificacao) => (
              <div
                key={n.id}
                className={`p-5 rounded-[24px] border transition-all cursor-pointer group ${!n.lida ? "bg-agriYellow/5 border-agriYellow/20 dark:bg-agriYellow/10" : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {getNotificationIcon(n.tipo, n.categoria)}
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      {getTimeAgo(n.created_at)}
                    </span>
                  </div>
                  {!n.lida && (
                    <div className="w-2 h-2 bg-agriYellow rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div>
                  )}
                </div>
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-1 group-hover:text-agriYellow transition-colors">
                  {n.titulo}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  {n.mensagem}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm font-bold uppercase">Sem notificações</p>
            </div>
          )}
        </div>

        <div className="p-8 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all">
            <CheckCircle className="w-4 h-4 text-agriYellow" /> Marcar todas
            como lidas
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;
