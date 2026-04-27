import React from 'react';
import {
  Bell,
  X,
  Clock,
  Package,
  Truck,
  UserPlus,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

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
    read: false,
  },
  {
    id: '2',
    title: 'Frete Aceite',
    description: 'O motorista João Manuel aceitou o frete para Luanda.',
    time: '15 min atrás',
    type: 'success',
    icon: Truck,
    read: false,
  },
  {
    id: '3',
    title: 'Novo Pedido de Suporte',
    description: 'Ticket #452: Problema com pagamento na carteira digital.',
    time: '1 hora atrás',
    type: 'warning',
    icon: MessageSquare,
    read: true,
  },
  {
    id: '4',
    title: 'Novo Colaborador',
    description: 'Ana Paula foi adicionada à equipa como Gestora.',
    time: '3 horas atrás',
    type: 'info',
    icon: UserPlus,
    read: true,
  },
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const typeClass: Record<Notification['type'], string> = {
    info: 'bg-info/10 text-info',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/15 text-warning',
    error: 'bg-destructive/10 text-destructive',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="bg-popover text-popover-foreground absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-md border shadow-lg sm:w-96"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <div className="bg-muted text-foreground flex size-8 items-center justify-center rounded-md">
                  <Bell className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Notificações</h3>
                  <p className="text-muted-foreground text-xs">
                    {unreadCount > 0 ? `${unreadCount} novas` : 'Estás atualizado'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button onClick={markAllAsRead} variant="ghost" size="sm" className="text-xs">
                    Marcar lidas
                  </Button>
                )}
                <Button onClick={onClose} variant="ghost" size="icon" className="size-7">
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      'hover:bg-accent flex w-full cursor-pointer gap-3 border-b p-4 text-left transition-colors last:border-b-0',
                      !notification.read && 'bg-muted/50'
                    )}
                  >
                    <div
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-md',
                        typeClass[notification.type]
                      )}
                    >
                      <notification.icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h4
                          className={cn(
                            'truncate text-sm',
                            notification.read ? 'font-medium' : 'font-semibold'
                          )}
                        >
                          {notification.title}
                        </h4>
                        <span className="text-muted-foreground flex shrink-0 items-center gap-1 whitespace-nowrap text-[10px]">
                          <Clock className="size-3" />
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-xs">
                        {maskDescription(notification.description)}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="bg-muted mx-auto mb-3 flex size-12 items-center justify-center rounded-full">
                    <Bell className="text-muted-foreground size-5" />
                  </div>
                  <p className="text-sm font-medium">Sem notificações</p>
                  <p className="text-muted-foreground text-xs">Tudo limpo por aqui</p>
                </div>
              )}
            </div>

            <Separator />
            <div className="p-2 text-center">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                Ver todo o histórico
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
