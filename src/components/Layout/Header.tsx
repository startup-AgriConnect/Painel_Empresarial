import React, { useState } from 'react';
import { Bell, User, FileText, FileSpreadsheet, Download } from 'lucide-react';
import NotificationsPopover from './NotificationsPopover';
import { useAuth } from '../../context/AuthContext';

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

  const handleExport = (type: 'csv' | 'pdf') => {
    // Simulação de exportação
    const timestamp = new Date().toLocaleDateString('pt-AO');
    console.log(`Exportando relatório ${type.toUpperCase()} - ${timestamp}`);
    // Feedback visual via console ou toast (se houvesse)
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-sm">
          <div className="px-3 py-1.5 flex items-center gap-2 border-r border-gray-200">
            <Download className="w-4 h-4 text-[#16a34a]" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Exportar</span>
          </div>
          
          <button 
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-gray-600 hover:text-[#16a34a] hover:bg-white rounded-lg transition-all"
            title="Exportar para Excel/CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>CSV</span>
          </button>

          <button 
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-gray-600 hover:text-[#16a34a] hover:bg-white rounded-lg transition-all"
            title="Exportar para PDF"
          >
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          
          <NotificationsPopover 
            isOpen={isNotificationsOpen} 
            onClose={() => setIsNotificationsOpen(false)} 
          />
        </div>
        
        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-none">{user?.name || 'Utilizador'}</p>
            <p className="text-xs text-gray-500 mt-1">{getRoleLabel(user?.role)}</p>
          </div>
          <div className="w-10 h-10 bg-[#f0fdf4] rounded-full flex items-center justify-center border border-[#dcfce7]">
            <User className="w-6 h-6 text-[#16a34a]" />
          </div>
        </div>
      </div>
    </header>
  );
}
