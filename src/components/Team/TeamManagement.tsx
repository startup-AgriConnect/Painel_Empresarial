import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Filter,
  Lock,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  UserPlus,
  XCircle,
} from 'lucide-react';
import CreateTeamMemberModal from './CreateTeamMemberModal';
import EditTeamMemberModal from './EditTeamMemberModal';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'GESTOR' | 'AUDITOR' | 'VISUALIZADOR';
  status: 'ATIVO' | 'SUSPENSO';
  lastLogin: string;
  permissions: string[];
}

const initialTeam: TeamMember[] = [
  { id: 'TM-001', name: 'Carlos Oliveira', email: 'carlos.oliveira@agriconnect.ao', role: 'ADMIN', status: 'ATIVO', lastLogin: '2026-04-10 09:30', permissions: ['all'] },
  { id: 'TM-002', name: 'Ana Paula', email: 'ana.paula@agriconnect.ao', role: 'GESTOR', status: 'ATIVO', lastLogin: '2026-04-10 08:15', permissions: ['dashboard', 'loads', 'freights'] },
  { id: 'TM-003', name: 'João Manuel', email: 'joao.manuel@agriconnect.ao', role: 'AUDITOR', status: 'SUSPENSO', lastLogin: '2026-04-08 14:20', permissions: ['support', 'freights'] },
  { id: 'TM-004', name: 'Maria Antónia', email: 'maria.antonia@agriconnect.ao', role: 'VISUALIZADOR', status: 'ATIVO', lastLogin: '2026-04-10 10:05', permissions: ['loads', 'hubs', 'marketplace'] },
];

const availableMenus = [
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'hubs', label: 'Hubs de Consolidação' },
  { id: 'freights', label: 'Monitorização' },
  { id: 'loads', label: 'Gestão de Cargas' },
  { id: 'team', label: 'Equipa' },
  { id: 'bi-overview', label: 'Visão Geral BI' },
  { id: 'agricultural-production', label: 'Produção Agrícola' },
  { id: 'geointelligence', label: 'Geointeligência' },
  { id: 'producers-farms', label: 'Produtores / Fazendas' },
  { id: 'price-demand', label: 'Preços e Demanda' },
  { id: 'reports', label: 'Relatórios' },
];

export default function TeamManagement() {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const currentMember = team.find((m) => m.id === selectedMemberId) ?? null;

  const filteredTeam = team.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setTeam((prev) =>
      prev.map((member) => (member.id === id ? { ...member, status: member.status === 'ATIVO' ? 'SUSPENSO' : 'ATIVO' } : member))
    );
  };

  const handleUpdatePermissions = (id: string, menuId: string) => {
    setTeam((prev) =>
      prev.map((member) => {
        if (member.id !== id) return member;
        const hasPermission = member.permissions.includes(menuId);
        return {
          ...member,
          permissions: hasPermission ? member.permissions.filter((p) => p !== menuId) : [...member.permissions, menuId],
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Gestão da Equipa Interna</h2>
          <p className="text-sm text-gray-500">Controle de acessos, permissões e estado das contas dos colaboradores.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <UserPlus className="h-4 w-4" />
          Adicionar Membro
        </Button>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Pesquisar por nome, email ou cargo..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membro / Email</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeam.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-xs font-bold uppercase tracking-wide text-gray-700">{member.role.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.status === 'ATIVO' ? 'success' : 'destructive'}>
                      {member.status === 'ATIVO' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">{member.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedMemberId(member.id); setIsEditModalOpen(true); }}>
                        <User className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedMemberId(member.id); setIsAccessModalOpen(true); }}>
                        <Lock className="h-4 w-4" />
                        Acessos
                      </Button>
                      <Button variant={member.status === 'ATIVO' ? 'outline' : 'default'} size="sm" onClick={() => handleToggleStatus(member.id)}>
                        {member.status === 'ATIVO' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {member.status === 'ATIVO' ? 'Suspender' : 'Ativar'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAccessModalOpen} onOpenChange={(open) => !open && setIsAccessModalOpen(false)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Controlo de Acesso</DialogTitle>
            <DialogDescription>Gerir permissões de menu para {currentMember?.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {currentMember && availableMenus.map((menu) => {
              const hasAccess = currentMember.permissions.includes('all') || currentMember.permissions.includes(menu.id);
              return (
                <Button
                  key={menu.id}
                  type="button"
                  variant="outline"
                  className={`h-auto justify-between p-4 ${hasAccess ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : ''}`}
                  onClick={() => handleUpdatePermissions(currentMember.id, menu.id)}
                >
                  <div className="flex items-center gap-3">
                    {hasAccess ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                    <span>{menu.label}</span>
                  </div>
                  {hasAccess && <CheckCircle2 className="h-4 w-4" />}
                </Button>
              );
            })}
          </div>
          <Card className="border-amber-100 bg-amber-50 shadow-none">
            <CardContent className="flex gap-3 p-4 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <p>As alterações de permissões entram em vigor imediatamente. Membros com cargo <strong>ADMIN</strong> têm acesso total por defeito.</p>
            </CardContent>
          </Card>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAccessModalOpen(false)}>Fechar</Button>
            <Button onClick={() => setIsAccessModalOpen(false)}>Guardar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateTeamMemberModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={(newMember) => setTeam((prev) => [newMember, ...prev])} />
      <EditTeamMemberModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSuccess={(updatedMember) => setTeam((prev) => prev.map((m) => m.id === updatedMember.id ? updatedMember : m))} member={currentMember} />
    </div>
  );
}
