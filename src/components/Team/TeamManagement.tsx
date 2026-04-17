import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  User,
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  MoreVertical, 
  Search, 
  Filter,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import CreateTeamMemberModal from './CreateTeamMemberModal';
import EditTeamMemberModal from './EditTeamMemberModal';

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
  {
    id: 'TM-001',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@agriconnect.ao',
    role: 'ADMIN',
    status: 'ATIVO',
    lastLogin: '2026-04-10 09:30',
    permissions: ['all']
  },
  {
    id: 'TM-002',
    name: 'Ana Paula',
    email: 'ana.paula@agriconnect.ao',
    role: 'GESTOR',
    status: 'ATIVO',
    lastLogin: '2026-04-10 08:15',
    permissions: ['dashboard', 'loads', 'freights']
  },
  {
    id: 'TM-003',
    name: 'João Manuel',
    email: 'joao.manuel@agriconnect.ao',
    role: 'AUDITOR',
    status: 'SUSPENSO',
    lastLogin: '2026-04-08 14:20',
    permissions: ['support', 'freights']
  },
  {
    id: 'TM-004',
    name: 'Maria Antónia',
    email: 'maria.antonia@agriconnect.ao',
    role: 'VISUALIZADOR',
    status: 'ATIVO',
    lastLogin: '2026-04-10 10:05',
    permissions: ['loads', 'hubs', 'marketplace']
  }
];

const availableMenus = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Utilizadores' },
  { id: 'companies', label: 'Empresas' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'micro-aggregators', label: 'Micro-Agregadores' },
  { id: 'hubs', label: 'Hubs de Consolidação' },
  { id: 'freights', label: 'Monitorização' },
  { id: 'loads', label: 'Gestão de Cargas' },
  { id: 'support', label: 'Suporte' },
  { id: 'team', label: 'Equipa' },
];

export default function TeamManagement() {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const currentMember = team.find(m => m.id === selectedMemberId);

  const filteredTeam = team.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setTeam(prev => prev.map(member => {
      if (member.id === id) {
        return { ...member, status: member.status === 'ATIVO' ? 'SUSPENSO' : 'ATIVO' };
      }
      return member;
    }));
  };

  const handleUpdatePermissions = (id: string, menuId: string) => {
    setTeam(prev => prev.map(member => {
      if (member.id === id) {
        const hasPermission = member.permissions.includes(menuId);
        const newPermissions = hasPermission 
          ? member.permissions.filter(p => p !== menuId)
          : [...member.permissions, menuId];
        return { ...member, permissions: newPermissions };
      }
      return member;
    }));
  };

  const handleCreateSuccess = (newMember: any) => {
    setTeam(prev => [newMember, ...prev]);
  };

  const handleEditSuccess = (updatedMember: any) => {
    setTeam(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Gestão da Equipa Interna</h2>
          <p className="text-gray-500 text-sm">Controle de acessos, permissões e estado das contas dos colaboradores.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
        >
          <UserPlus className="w-4 h-4" />
          Adicionar Membro
        </button>
      </header>

      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por nome, email ou cargo..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-8 w-[1px] bg-gray-100" />
        <button className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors text-xs font-bold">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Membro / Email</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cargo</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Último Acesso</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredTeam.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{member.role.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    member.status === 'ATIVO' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  )}>
                    {member.status === 'ATIVO' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {member.status}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-gray-500 font-medium">{member.lastLogin}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end relative">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                      className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {openMenuId === member.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setOpenMenuId(null)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 py-2 overflow-hidden"
                          >
                            <button 
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => { 
                                setSelectedMemberId(member.id);
                                setIsEditModalOpen(true);
                                setOpenMenuId(null); 
                              }}
                            >
                              <User className="w-4 h-4 text-gray-400" />
                              Editar Perfil
                            </button>
                            <button 
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                              onClick={() => { 
                                setSelectedMemberId(member.id); 
                                setIsAccessModalOpen(true); 
                                setOpenMenuId(null);
                              }}
                            >
                              <Lock className="w-4 h-4" />
                              Controlo de Acesso
                            </button>
                            <div className="h-[1px] bg-gray-50 my-1" />
                            <button 
                              className={cn(
                                "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors",
                                member.status === 'ATIVO' ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"
                              )}
                              onClick={() => { 
                                handleToggleStatus(member.id);
                                setOpenMenuId(null);
                              }}
                            >
                              {member.status === 'ATIVO' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              {member.status === 'ATIVO' ? 'Suspender Conta' : 'Ativar Conta'}
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Controlo de Acesso */}
      <AnimatePresence>
        {isAccessModalOpen && currentMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Controlo de Acesso</h3>
                    <p className="text-xs text-gray-500 font-medium">Gerir permissões de menu para {currentMember.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAccessModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {availableMenus.map((menu) => {
                    const hasAccess = currentMember.permissions.includes('all') || currentMember.permissions.includes(menu.id);
                    const isAll = currentMember.permissions.includes('all');

                    return (
                      <button
                        key={menu.id}
                        onClick={() => handleUpdatePermissions(currentMember.id, menu.id)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left group",
                          hasAccess 
                            ? "border-emerald-500 bg-emerald-50/50" 
                            : "border-gray-100 bg-white hover:border-gray-200"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg transition-colors",
                            hasAccess ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                          )}>
                            {hasAccess ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                          </div>
                          <span className={cn(
                            "text-sm font-bold",
                            hasAccess ? "text-emerald-900" : "text-gray-500"
                          )}>
                            {menu.label}
                          </span>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                          hasAccess ? "bg-emerald-500 border-emerald-500" : "border-gray-200"
                        )}>
                          {hasAccess && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    <strong>Atenção:</strong> As alterações de permissões entram em vigor imediatamente. 
                    Membros com cargo <strong>ADMIN</strong> têm acesso total por defeito e não podem ter restrições individuais sem alteração de cargo.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  onClick={() => setIsAccessModalOpen(false)}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                >
                  Fechar
                </button>
                <button 
                  onClick={() => setIsAccessModalOpen(false)}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                  Guardar Alterações
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CreateTeamMemberModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditTeamMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        member={currentMember}
      />
    </div>
  );
}
