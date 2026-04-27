import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Shield,
  User,
} from 'lucide-react';
import FeedbackBanner from '../Common/FeedbackBanner';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';

interface CreateTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newMember: any) => void;
}

export default function CreateTeamMemberModal({ isOpen, onClose, onSuccess }: CreateTeamMemberModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'VISUALIZADOR',
    password: '',
    confirmPassword: '',
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
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSuccess({
      id: `TM-00${Math.floor(Math.random() * 100)}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: 'ATIVO',
      lastLogin: 'Nunca',
      permissions: formData.role === 'ADMIN' ? ['all'] : ['dashboard'],
    });

    setIsSubmitting(false);
    onClose();
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'VISUALIZADOR',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Membro da Equipa</DialogTitle>
          <DialogDescription>Registar um novo colaborador interno.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <FeedbackBanner
              type="error"
              title="Não foi possível criar o membro"
              message={error}
              onDismiss={() => setError('')}
            />
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="team-name">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="team-name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Manuel dos Santos"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-email">Email Corporativo</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="team-email"
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@agriconnect.ao"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="team-phone"
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+244 9XX XXX XXX"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-role">Cargo / Papel</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Select
                  id="team-role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="pl-10"
                >
                  <option value="VISUALIZADOR">Visualizador</option>
                  <option value="GESTOR">Gestor</option>
                  <option value="AUDITOR">Auditor</option>
                  <option value="ADMIN">Administrador</option>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-border pt-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="team-password">Senha Temporária</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="team-password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-confirm-password">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="team-confirm-password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-900">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
              <p>
                O novo membro receberá um email com as credenciais de acesso. Por defeito, a conta será criada com o
                estado <strong>ATIVO</strong>.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <CheckCircle2 className="h-4 w-4" />}
              {isSubmitting ? 'A processar...' : 'Criar Conta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
