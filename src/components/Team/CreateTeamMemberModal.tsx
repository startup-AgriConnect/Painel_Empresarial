import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import FeedbackBanner from '../Common/FeedbackBanner';
import { useAccessibleModal } from '../../hooks/useAccessibleModal';

interface CreateTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newMember: any) => void;
}

export default function CreateTeamMemberModal({ isOpen, onClose, onSuccess }: CreateTeamMemberModalProps) {
  const modalRef = useAccessibleModal(isOpen, onClose);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'VISUALIZADOR',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('A senha temporária deve ter pelo menos 8 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('A confirmação da senha não coincide com a senha temporária.');
      return;
    }

    setIsSubmitting(true);

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newMember = {
      id: `TM-00${Math.floor(Math.random() * 100)}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: 'ATIVO',
      lastLogin: 'Nunca',
      permissions: formData.role === 'ADMIN' ? ['all'] : ['dashboard']
    };

    onSuccess(newMember);
    setIsSubmitting(false);
    onClose();
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'VISUALIZADOR',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Novo Membro da Equipa</h3>
                  <p className="text-xs text-gray-500 font-medium">Registar um novo colaborador interno</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <FeedbackBanner
                  type="error"
                  title="Não foi possível criar o membro"
                  message={error}
                  onDismiss={() => setError('')}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      required
                      type="text" 
                      placeholder="Ex: Manuel dos Santos"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Corporativo</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      required
                      type="email" 
                      placeholder="email@agriconnect.ao"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      required
                      type="tel" 
                      placeholder="+244 9XX XXX XXX"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cargo / Papel</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select 
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all appearance-none"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="VISUALIZADOR">Visualizador</option>
                      <option value="GESTOR">Gestor</option>
                      <option value="AUDITOR">Auditor</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-gray-100 my-2" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha Temporária</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      required
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmar Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      required
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:border-emerald-500 focus:bg-white outline-none transition-all"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                  O novo membro receberá um email com as credenciais de acesso. 
                  Por defeito, a conta será criada com o estado <strong>ATIVO</strong>.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className={cn(
                    "px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2",
                    isSubmitting && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      A processar...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Criar Conta
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
