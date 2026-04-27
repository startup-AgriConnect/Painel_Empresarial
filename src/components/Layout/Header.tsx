import React, { useState } from 'react';
import { Bell, Download, FileSpreadsheet, FileText, LogOut, Settings, User } from 'lucide-react';
import NotificationsPopover from './NotificationsPopover';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { LOGIN_HASH } from '../../lib/routes';
import ConfirmationModal from '../Common/ConfirmationModal';

export default function Header() {
  const { user, logout } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'STARTUP':
        return 'Equipa AgriConnect';
      case 'COMPANY':
        return 'Cliente / Parceiro';
      default:
        return 'Utilizador';
    }
  };

  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    logout();
    window.location.hash = LOGIN_HASH;
    setIsLogoutOpen(false);
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
        title="Terminar sessão"
        message="Tem a certeza de que deseja sair agora?"
        confirmText="Terminar sessão"
        cancelText="Cancelar"
        variant="warning"
      />
      <header className="bg-background sticky top-0 z-10 flex h-16 items-center justify-between border-b px-6">
        <div className="flex flex-1 items-center">
          <div className="bg-muted/50 inline-flex items-center gap-1 rounded-md border p-1">
            <div className="text-muted-foreground flex items-center gap-1.5 px-2">
              <Download className="size-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Exportar</span>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <FileSpreadsheet className="size-3.5" />
              CSV
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <FileText className="size-3.5" />
              PDF
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell className="size-4" />
              <span className="bg-destructive absolute right-1.5 top-1.5 size-2 rounded-full ring-2 ring-background" />
            </Button>
            <NotificationsPopover
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          <Separator orientation="vertical" className="h-6" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto gap-2 px-2 py-1.5">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium leading-none">{user?.name || 'Utilizador'}</p>
                  <p className="text-muted-foreground mt-1 text-xs">{getRoleLabel(user?.role)}</p>
                </div>
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name || 'Utilizador'}</span>
                  <span className="text-muted-foreground text-xs">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="size-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setIsLogoutOpen(true)}>
                <LogOut className="size-4" />
                Terminar sessão
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
