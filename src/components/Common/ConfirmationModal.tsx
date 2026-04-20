import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccessibleModal } from '../../hooks/useAccessibleModal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning',
  loading = false,
}: ConfirmationModalProps) {
  const modalRef = useAccessibleModal(isOpen, onClose);

  const colors = {
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    info: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  };

  const iconColors = {
    danger: 'text-rose-600 bg-rose-50',
    warning: 'text-amber-600 bg-amber-50',
    info: 'text-emerald-600 bg-emerald-50',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-modal-title"
            aria-describedby="confirmation-modal-message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className={`p-4 rounded-full mb-4 ${iconColors[variant]}`}>
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 id="confirmation-modal-title" className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <p id="confirmation-modal-message" className="text-gray-500 text-sm mb-8">{message}</p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 px-4 py-2 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${colors[variant]}`}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
