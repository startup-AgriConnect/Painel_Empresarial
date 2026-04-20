import React, { useEffect, useState } from 'react';
import { AlertCircle, Mail, Phone, Save, Shield, User } from 'lucide-react';
import FeedbackBanner from '../Common/FeedbackBanner';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';

interface EditTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedMember: any) => void;
  member: any;
}

export default function EditTeamMemberModal({ isOpen, onClose, onSuccess, member }: EditTeamMemberModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'VISUALIZADOR',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        role: member.role || 'VISUALIZADOR',
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSuccess({ ...member, ...formData });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>Atualizar dados do colaborador.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <FeedbackBanner
              type="error"
              title="Corrija os dados antes de guardar"
              message={error}
              onDismiss={() => setError('')}
            />
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-edit-team-name">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input id="company-edit-team-name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-edit-team-email">Email Corporativo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input id="company-edit-team-email" required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-edit-team-phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input id="company-edit-team-phone" required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-edit-team-role">Cargo / Papel</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Select id="company-edit-team-role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="pl-10">
                  <option value="VISUALIZADOR">Visualizador</option>
                  <option value="GESTOR">Gestor</option>
                  <option value="AUDITOR">Auditor</option>
                  <option value="ADMIN">Administrador</option>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <p>Alterar o cargo pode afetar as permissões de acesso do utilizador. Confirme o impacto antes de guardar.</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save className="h-4 w-4" />}
              {isSubmitting ? 'A guardar...' : 'Guardar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
