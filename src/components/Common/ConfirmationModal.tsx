import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

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
  const colors = {
    danger: 'destructive' as const,
    warning: 'secondary' as const,
    info: 'default' as const,
  };

  const iconColors = {
    danger: 'text-rose-600 bg-rose-50',
    warning: 'text-amber-600 bg-amber-50',
    info: 'text-emerald-600 bg-emerald-50',
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <div className="p-6 text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${iconColors[variant]}`}>
            <AlertTriangle className="h-8 w-8" />
          </div>
          <DialogHeader className="items-center text-center">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className="border-t border-gray-100 bg-gray-50 px-6 py-4 sm:justify-center">
          <Button type="button" variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button type="button" variant={colors[variant]} onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
