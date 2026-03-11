import React, { useState } from "react";
import { Company, CompanyUser, AppTab } from "../../types";
import { useFetch } from "../../services/hooks";
import { mockAPI } from "../../services/mockData";
import {
  Users,
  UserPlus,
  Trash2,
  Mail,
  ShieldCheck,
  Settings2,
  X,
  CheckCircle2,
  Lock,
  Globe,
  BarChart3,
  TrendingUp,
  Cpu,
  Truck,
  Boxes,
  PieChart,
  Link as LinkIcon,
  UserCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const menuIcons: Record<string, any> = {
  [AppTab.VISAO_ESTRATEGICA]: BarChart3,
  [AppTab.FAZENDAS]: Users,
  [AppTab.RANKING_COMUNAS]: TrendingUp,
  [AppTab.FLUXO_PRODUCAO]: LinkIcon,
  [AppTab.GEOINTELIGENCIA]: Globe,
  [AppTab.PREDICOES_IA]: Cpu,
  [AppTab.LOGISTICA_RADAR]: Truck,
  [AppTab.HUBS]: Boxes,
  [AppTab.RELATORIOS]: PieChart,
};

const CompanyUsersMgmt: React.FC = () => {
  const { data: companyData, loading } = useFetch(
    () => mockAPI.company.getData(),
    [],
  );

  // Inicializar company com dados mockados ou dados da API
  const [company, setCompany] = useState<Company>({
    ...companyData,
    permissions: [
      AppTab.VISAO_ESTRATEGICA,
      AppTab.FAZENDAS,
      AppTab.RANKING_COMUNAS,
      AppTab.FLUXO_PRODUCAO,
      AppTab.GEOINTELIGENCIA,
      AppTab.PREDICOES_IA,
      AppTab.LOGISTICA_RADAR,
      AppTab.HUBS,
      AppTab.RELATORIOS,
    ],
    users: [
      {
        id: "CU-01",
        name: "João Manuel",
        email: "joao.m@minagrip.ao",
        role: "Admin",
        status: "Ativo",
        permissions: [
          AppTab.VISAO_ESTRATEGICA,
          AppTab.FAZENDAS,
          AppTab.RANKING_COMUNAS,
        ],
      },
      {
        id: "CU-02",
        name: "Ana Silva",
        email: "ana.s@minagrip.ao",
        role: "Auditor",
        status: "Ativo",
        permissions: [AppTab.VISAO_ESTRATEGICA, AppTab.RELATORIOS],
      },
      {
        id: "CU-03",
        name: "Carlos Bento",
        email: "c.bento@minagrip.ao",
        role: "Gestor",
        status: "Ativo",
        permissions: [AppTab.FAZENDAS, AppTab.HUBS, AppTab.LOGISTICA_RADAR],
      },
    ],
  } as Company);

  React.useEffect(() => {
    if (companyData) {
      setCompany((prev) => ({ ...prev, ...companyData }));
    }
  }, [companyData]);

  const [selectedUser, setSelectedUser] = useState<CompanyUser | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Visualizador" as CompanyUser["role"],
  });

  const seatsUsed = company.users?.length || 0;
  const seatsTotal = company.maxUsers || 25;
  const usagePercentage = (seatsUsed / seatsTotal) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-agriYellow animate-spin" />
      </div>
    );
  }

  const handleAddUser = () => {
    if (seatsUsed >= seatsTotal) return;
    if (!newUser.name || !newUser.email) return;

    const user: CompanyUser = {
      id: `CU-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "Ativo",
      permissions: [AppTab.VISAO_ESTRATEGICA],
    };

    setCompany({ ...company, users: [...company.users, user] });
    setIsAdding(false);
    setNewUser({ name: "", email: "", role: "Visualizador" });
  };

  const removeUser = (id: string) => {
    if (window.confirm("Tem certeza que deseja remover este colaborador?")) {
      setCompany({
        ...company,
        users: company.users.filter((u) => u.id !== id),
      });
      if (selectedUser?.id === id) setSelectedUser(null);
    }
  };

  const toggleUserPermission = (tab: AppTab) => {
    if (!selectedUser) return;

    const userPermissions = selectedUser.permissions || [];
    const hasPermission = userPermissions.includes(tab);

    const newPermissions = hasPermission
      ? userPermissions.filter((p) => p !== tab)
      : [...userPermissions, tab];

    const updatedUser = { ...selectedUser, permissions: newPermissions };
    setSelectedUser(updatedUser);
    setCompany({
      ...company,
      users: company.users.map((u) =>
        u.id === updatedUser.id ? updatedUser : u,
      ),
    });
  };

  return (
    <div className="space-y-8 animate-fluid pb-24">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
            Minha Equipa
          </h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
            Gestão de Colaboradores e Privilégios
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* Seat Counter - Estritamente Informativo (Bloqueado) */}
          <div className="bg-slate-900 text-white px-6 py-4 rounded-[24px] shadow-xl flex items-center gap-6 border-b-4 border-agriYellow group">
            <div className="relative">
              <p className="text-[8px] font-black text-agriYellow uppercase tracking-[0.2em] mb-1">
                Quota de Licença
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xl font-black">
                  {seatsUsed} / {seatsTotal}
                </span>
                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-agriYellow"
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center">
              <Lock className="w-4 h-4 text-slate-500 mb-1" />
              <span className="text-[7px] font-black text-slate-600 uppercase">
                Fixed
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            disabled={seatsUsed >= seatsTotal}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all ${
              seatsUsed >= seatsTotal
                ? "bg-slate-100 text-slate-400 cursor-not-allowed grayscale"
                : "bg-agriYellow text-slate-900 hover:scale-105 active:scale-95"
            }`}
          >
            <UserPlus className="w-5 h-5" /> Adicionar Membro
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border-4 border-agriYellow/20 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-start mb-8">
            <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white">
              Convidar Colaborador
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="p-2 text-slate-400 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Nome Completo
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-agriYellow outline-none dark:text-white"
                placeholder="Ex: Manuel Kaputo"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Email Corporativo
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-agriYellow outline-none dark:text-white"
                placeholder="email@entidade.ao"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Cargo
              </label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value as any })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-agriYellow outline-none dark:text-white"
              >
                <option value="Visualizador">Visualizador</option>
                <option value="Gestor">Gestor Operacional</option>
                <option value="Auditor">Auditor de BI</option>
                <option value="Admin">Co-Administrador</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleAddUser}
            className="mt-8 w-full py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl hover:bg-agriYellow hover:text-slate-900 transition-all flex items-center justify-center gap-3"
          >
            <ShieldCheck className="w-5 h-5" /> Autorizar e Ativar Conta
          </button>
        </div>
      )}

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ${selectedUser ? "lg:pr-[500px]" : ""}`}
      >
        {company.users.map((user) => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`bg-white dark:bg-slate-900 p-8 rounded-[40px] border transition-all cursor-pointer group relative overflow-hidden ${selectedUser?.id === user.id ? "border-agriYellow bg-agriYellow/5 ring-2 ring-agriYellow/20 shadow-2xl" : "border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl"}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black shadow-inner transition-colors ${selectedUser?.id === user.id ? "bg-agriYellow text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}
              >
                {user.name.charAt(0)}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest">
                  {user.status}
                </span>
                <span className="text-[9px] font-black text-agriYellow uppercase tracking-widest">
                  {user.role}
                </span>
              </div>
            </div>

            <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-1 group-hover:text-agriYellow transition-colors">
              {user.name}
            </h4>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">
              <Mail className="w-3 h-3" /> {user.email}
            </div>

            <div className="pt-6 border-t dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Settings2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[9px] font-black text-slate-500 uppercase">
                  {(user.permissions || []).length} Módulos Ativos
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeUser(user.id);
                }}
                className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-full lg:w-[500px] bg-white dark:bg-slate-950 z-[1001] shadow-2xl transition-transform duration-500 border-l border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col ${selectedUser ? "translate-x-0" : "translate-x-full"}`}
      >
        {selectedUser && (
          <>
            <div className="p-10 bg-slate-900 text-white relative">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/50 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-agriYellow rounded-[30px] flex items-center justify-center font-black text-3xl text-slate-900 shadow-2xl">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">
                    {selectedUser.name}
                  </h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    {selectedUser.role} • {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar p-10 space-y-10">
              <div>
                <div className="flex items-center justify-between border-b dark:border-slate-800 pb-4 mb-8">
                  <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3">
                    <Lock className="w-5 h-5 text-agriYellow" /> Privilégios da
                    Empresa
                  </h5>
                </div>

                <div className="space-y-3">
                  {company.permissions.map((tab) => {
                    const isActive = (selectedUser.permissions || []).includes(
                      tab,
                    );
                    const Icon = menuIcons[tab] || Globe;

                    return (
                      <div
                        key={tab}
                        onClick={() => toggleUserPermission(tab)}
                        className={`p-6 rounded-[32px] border transition-all cursor-pointer flex items-center justify-between group ${isActive ? "bg-emerald-50/30 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30" : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-60"}`}
                      >
                        <div className="flex items-center gap-5">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isActive ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h6
                              className={`text-sm font-black uppercase tracking-tight ${isActive ? "text-slate-800 dark:text-emerald-400" : "text-slate-400"}`}
                            >
                              {tab.replace("-", " ")}
                            </h6>
                            <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">
                              {isActive ? "Módulo Visível" : "Bloqueado"}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`w-12 h-7 rounded-full relative transition-all duration-300 ${isActive ? "bg-emerald-500 shadow-inner" : "bg-slate-300 dark:bg-slate-800"}`}
                        >
                          <div
                            className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-md ${isActive ? "right-1" : "left-1"}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-8 rounded-[40px] border border-blue-100 dark:border-blue-900/30 flex gap-4">
                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-[10px] text-blue-700 dark:text-blue-400 leading-relaxed font-black uppercase italic">
                  Atenção: A empresa só pode conceder acesso a módulos que a
                  Startup ativou previamente para a sua organização.
                </p>
              </div>
            </div>

            <div className="p-10 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col gap-3 shrink-0">
              <button className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-agriYellow hover:text-slate-950 transition-all flex items-center justify-center gap-3">
                <CheckCircle2 className="w-5 h-5" /> Guardar Definições de
                Equipa
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyUsersMgmt;
