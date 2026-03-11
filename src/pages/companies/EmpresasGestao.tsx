/**
 * @fileoverview Componente exemplo: Gestão de Empresas
 * Demonstra o uso correto dos serviços de API e hooks
 */

import React, { useState } from "react";
import { mockAPI } from "../../services/mockData";
import { useFetch, useMutation, usePagination } from "../../services/hooks";
import type { Empresa, PlanoEmpresa, StatusEmpresa } from "../../types";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Users,
  Search,
  Filter,
} from "lucide-react";

interface EmpresasGestaoProps {
  isDarkMode?: boolean;
}

const EmpresasGestao: React.FC<EmpresasGestaoProps> = ({
  isDarkMode = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlano, setSelectedPlano] = useState<PlanoEmpresa | "all">(
    "all",
  );
  const [selectedStatus, setSelectedStatus] = useState<StatusEmpresa | "all">(
    "all",
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Paginação de empresas
  const {
    data: empresas,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
    refetch,
  } = usePagination(
    (filters) =>
      mockAPI.empresas.list({
        ...filters,
        search: searchTerm || undefined,
        plano: selectedPlano !== "all" ? selectedPlano : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
      }),
    1,
    10,
  );

  // Mutation para deletar empresa
  const { mutate: deleteEmpresa, loading: deleting } = useMutation(
    (id: string) => mockAPI.empresas.delete(id),
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta empresa?")) return;

    const result = await deleteEmpresa(id);
    if (result.success) {
      alert("Empresa deletada com sucesso!");
      refetch(); // Recarregar lista
    } else {
      alert(`Erro ao deletar: ${result.error}`);
    }
  };

  const getPlanoColor = (plano: PlanoEmpresa) => {
    switch (plano) {
      case "BASIC":
        return "slate";
      case "PRO":
        return "agriYellow";
      case "ENTERPRISE":
        return "emerald";
      default:
        return "gray";
    }
  };

  const getStatusColor = (status: StatusEmpresa) => {
    switch (status) {
      case "ATIVO":
        return "emerald";
      case "SUSPENSO":
        return "amber";
      case "INATIVO":
        return "rose";
      default:
        return "gray";
    }
  };

  if (loading && !empresas) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agriYellow"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 rounded-2xl border-2 border-rose-200 dark:border-rose-800">
        <p className="text-rose-600 dark:text-rose-400">
          Erro ao carregar empresas: {error}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Gestão de Empresas
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {totalItems} empresas registradas
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-agriYellow to-amber-500 hover:from-amber-500 hover:to-agriYellow text-slate-900 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          Nova Empresa
        </button>
      </div>

      {/* Filtros */}
      <div className="glass-card p-6 rounded-[28px] border-2 border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300">
            Filtros
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-agriYellow focus:ring-2 focus:ring-agriYellow/20 transition-all"
            />
          </div>

          {/* Filtro Plano */}
          <select
            value={selectedPlano}
            onChange={(e) =>
              setSelectedPlano(e.target.value as PlanoEmpresa | "all")
            }
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-agriYellow focus:ring-2 focus:ring-agriYellow/20 transition-all"
          >
            <option value="all">Todos os Planos</option>
            <option value="BASIC">Basic</option>
            <option value="PRO">Pro</option>
            <option value="ENTERPRISE">Enterprise</option>
          </select>

          {/* Filtro Status */}
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as StatusEmpresa | "all")
            }
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-agriYellow focus:ring-2 focus:ring-agriYellow/20 transition-all"
          >
            <option value="all">Todos os Status</option>
            <option value="ATIVO">Ativo</option>
            <option value="SUSPENSO">Suspenso</option>
            <option value="INATIVO">Inativo</option>
          </select>
        </div>
      </div>

      {/* Lista de Empresas */}
      <div className="grid grid-cols-1 gap-4">
        {empresas && empresas.length > 0 ? (
          empresas.map((empresa) => (
            <div
              key={empresa.id}
              className="glass-card p-6 rounded-[28px] border-2 border-slate-200/50 dark:border-slate-800/50 hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Logo */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center border-2 border-slate-300/50 dark:border-slate-600/50">
                    {empresa.logo_url ? (
                      <img
                        src={empresa.logo_url}
                        alt={empresa.nome}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {empresa.nome}
                      </h3>

                      {/* Badge Plano */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold bg-${getPlanoColor(empresa.plano)}-100 dark:bg-${getPlanoColor(empresa.plano)}-950/30 text-${getPlanoColor(empresa.plano)}-700 dark:text-${getPlanoColor(empresa.plano)}-400 border border-${getPlanoColor(empresa.plano)}-200 dark:border-${getPlanoColor(empresa.plano)}-800`}
                      >
                        {empresa.plano}
                      </span>

                      {/* Badge Status */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold bg-${getStatusColor(empresa.status)}-100 dark:bg-${getStatusColor(empresa.status)}-950/30 text-${getStatusColor(empresa.status)}-700 dark:text-${getStatusColor(empresa.status)}-400 border border-${getStatusColor(empresa.status)}-200 dark:border-${getStatusColor(empresa.status)}-800`}
                      >
                        {empresa.status}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      NIF: {empresa.nif} • {empresa.tipo || "N/A"}
                    </p>

                    <div className="flex items-center gap-6 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{empresa.limite_usuarios || 0} usuários</span>
                      </div>
                      {empresa.provincia && (
                        <span>
                          📍 {empresa.provincia}, {empresa.municipio || "N/A"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <button
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(empresa.id)}
                    disabled={deleting}
                    className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                    title="Deletar"
                  >
                    <Trash2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-12 rounded-[28px] text-center">
            <Building2 className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              Nenhuma empresa encontrada
            </p>
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between glass-card p-4 rounded-2xl border-2 border-slate-200/50 dark:border-slate-800/50">
          <button
            onClick={previousPage}
            disabled={!hasPreviousPage || loading}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors font-bold text-sm"
          >
            ← Anterior
          </button>

          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
            Página {page} de {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={!hasNextPage || loading}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors font-bold text-sm"
          >
            Próxima →
          </button>
        </div>
      )}

      {/* Loading overlay durante delete */}
      {deleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agriYellow mx-auto"></div>
            <p className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">
              Deletando...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresasGestao;
