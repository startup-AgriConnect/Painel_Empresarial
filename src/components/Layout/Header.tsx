import React, { useState } from 'react';
import { Bell, Download, FileSpreadsheet, FileText, User } from 'lucide-react';
import NotificationsPopover from './NotificationsPopover';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';

export default function Header() {
  const { user } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-8">
      <div className="flex flex-1 items-center gap-4">
        <Card className="flex items-center rounded-xl border-gray-200 bg-gray-50 p-1 shadow-none">
          <div className="flex items-center gap-2 px-3 py-1.5">
            <Download className="h-4 w-4 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Exportar</span>
          </div>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button variant="ghost" size="sm" className="text-xs font-bold text-gray-600 hover:text-emerald-700">
            <FileSpreadsheet className="h-4 w-4" />
            CSV
          </Button>
          <Button variant="ghost" size="sm" className="text-xs font-bold text-gray-600 hover:text-emerald-700">
            <FileText className="h-4 w-4" />
            PDF
          </Button>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative rounded-full text-gray-500" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
          </Button>
          <NotificationsPopover isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold leading-none text-gray-900">{user?.name || 'Utilizador'}</p>
            <p className="mt-1 text-xs text-gray-500">{getRoleLabel(user?.role)}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
            <User className="h-5 w-5 text-emerald-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
