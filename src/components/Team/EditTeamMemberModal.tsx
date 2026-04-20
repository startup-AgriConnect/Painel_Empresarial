import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  CheckCircle2,
  AlertCircle,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import FeedbackBanner from '../Common/FeedbackBanner';
import { useAccessibleModal } from '../../hooks/useAccessibleModal';

interface EditTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedMember: any) => void;
  member: any;
}

export default function EditTeamMemberModal({ isOpen, onClose, onSuccess, member }: EditTeamMemberModalProps) {
  const modalRef = useAccessibleModal(isOpen, onClose);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'VISUALIZADOR'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        role: member.role || 'VISUALIZADOR'
      });
    }
  }, [member, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Nome e email corporativo são obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedMember = {
      ...member,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
    };

    onSuccess(updatedMember);
    setIsSubmitting(false);
    onClose();
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
                <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Editar Perfil</h3>
                  <p className="text-xs text-gray-500 font-medium">Atualizar dados do colaborador</p>
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
                  title="Corrija os dados antes de guardar"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:border-blue-500 focus:bg-white outline-none transition-all"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:border-blue-500 focus:bg-white outline-none transition-all"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:border-blue-500 focus:bg-white outline-none transition-all"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl text-sm focus:border-blue-500 focus:bg-white outline-none transition-all appearance-none"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                    >
                      <option value="VISUALIZADOR">Visualizador</option>
                      <option value="GESTOR">Gestor</option>
                      <option value="AUDITOR">Auditor</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                  Alterar o cargo pode afetar as permissões de acesso do utilizador. 
                  Certifique-se de que o colaborador foi informado sobre estas alterações.
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
                    "px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2",
                    isSubmitting && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      A guardar...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar Alterações
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
