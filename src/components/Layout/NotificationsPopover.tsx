import React from 'react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock,
  Package,
  Truck,
  UserPlus,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, maskData } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  icon: React.ElementType;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nova Carga Publicada',
    description: 'Um novo produtor publicou 500kg de Milho em Huambo.',
    time: '2 min atrás',
    type: 'info',
    icon: Package,
    read: false
  },
  {
    id: '2',
    title: 'Frete Aceite',
    description: 'O motorista João Manuel aceitou o frete para Luanda.',
    time: '15 min atrás',
    type: 'success',
    icon: Truck,
    read: false
  },
  {
    id: '3',
    title: 'Novo Pedido de Suporte',
    description: 'Ticket #452: Problema com pagamento na carteira digital.',
    time: '1 hora atrás',
    type: 'warning',
    icon: MessageSquare,
    read: true
  },
  {
    id: '4',
    title: 'Novo Colaborador',
    description: 'Ana Paula foi adicionada à equipa como Gestora.',
    time: '3 horas atrás',
    type: 'info',
    icon: UserPlus,
    read: true
  }
];

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPopover({ isOpen, onClose }: NotificationsPopoverProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications);

  const maskDescription = (desc: string) => {
    if (user?.role === 'COMPANY') {
      return desc
        .replace(/João Manuel/g, '*** PROTEGIDO ***')
        .replace(/Ana Paula/g, '*** PROTEGIDO ***');
    }
    return desc;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-full mt-4 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#dcfce7] rounded-xl text-[#16a34a]">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Notificações</h3>
                  <p className="text-[10px] text-gray-500 font-medium">
                    {unreadCount > 0 ? `Tens ${unreadCount} novas notificações` : 'Estás atualizado'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-[#16a34a] hover:text-[#15803d] transition-colors"
                  >
                    Marcar todas como lidas
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      "p-4 flex gap-4 hover:bg-gray-50 transition-all cursor-pointer relative group",
                      !notification.read && "bg-[#f0fdf4]"
                    )}
                  >
                    {!notification.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#22c55e]" />
                    )}
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      notification.type === 'info' && "bg-blue-100 text-blue-600",
                      notification.type === 'success' && "bg-[#dcfce7] text-[#16a34a]",
                      notification.type === 'warning' && "bg-amber-100 text-amber-600",
                      notification.type === 'error' && "bg-rose-100 text-rose-600"
                    )}>
                      <notification.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={cn(
                          "text-xs font-bold truncate pr-2",
                          notification.read ? "text-gray-700" : "text-gray-900"
                        )}>
                          {notification.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                        {maskDescription(notification.description)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-sm font-bold text-gray-400">Sem notificações</p>
                  <p className="text-xs text-gray-300">Tudo limpo por aqui!</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
              <button className="text-[11px] font-bold text-gray-500 hover:text-[#16a34a] transition-colors">
                Ver todo o histórico
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
