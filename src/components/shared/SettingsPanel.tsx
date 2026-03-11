
import React from 'react';
import { X, User, Globe, Shield, Bell, Moon, Sun, Smartphone, Database, Check } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, isDarkMode, toggleTheme }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-[450px] bg-white dark:bg-slate-950 z-[101] shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
           <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Definições</h3>
           <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400" />
           </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
           {/* Profile Section */}
           <section className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <User className="w-4 h-4 text-agriYellow" /> Perfil de Acesso
              </h4>
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-agriYellow flex items-center justify-center font-black text-2xl text-slate-950 shadow-xl">GA</div>
                 <div>
                    <p className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Governo de Angola</p>
                    <p className="text-xs text-slate-400 font-bold">Min. Agricultura e Pescas</p>
                 </div>
              </div>
           </section>

           {/* Appearance Section */}
           <section className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Sun className="w-4 h-4 text-agriYellow" /> Aparência e Interface
              </h4>
              <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800">
                 <div className="flex items-center gap-3">
                    {isDarkMode ? <Moon className="w-5 h-5 text-agriYellow" /> : <Sun className="w-5 h-5 text-agriYellow" />}
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase">Modo Escuro</span>
                 </div>
                 <button 
                  onClick={toggleTheme}
                  className={`w-14 h-8 rounded-full transition-all relative ${isDarkMode ? 'bg-agriYellow' : 'bg-slate-300'}`}
                 >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${isDarkMode ? 'right-1 shadow-inner' : 'left-1 shadow-sm'}`}></div>
                 </button>
              </div>
           </section>

           {/* Data Section */}
           <section className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Database className="w-4 h-4 text-agriYellow" /> Inteligência de Dados
              </h4>
              <div className="space-y-3">
                 {[
                   { label: 'Sincronização GEE Realtime', icon: Globe, active: true },
                   { label: 'Alertas IA Predictiva', icon: Bell, active: true },
                   { label: 'Validação Blockchain', icon: Shield, active: false },
                   { label: 'Comunicação SMS Campesina', icon: Smartphone, active: true },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                         <item.icon className="w-4 h-4 text-slate-400" />
                         <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">{item.label}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${item.active ? 'bg-agriYellow border-agriYellow' : 'border-slate-300 dark:border-slate-700'}`}>
                         {item.active && <Check className="w-3 h-3 text-slate-900" />}
                      </div>
                   </div>
                 ))}
              </div>
           </section>
        </div>

        <div className="p-8 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center mb-2 italic">AgriConnect Central v4.0.21 (Production)</p>
           <button className="w-full bg-rose-50 text-rose-600 dark:bg-rose-950/20 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all">
              Terminar Sessão
           </button>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
