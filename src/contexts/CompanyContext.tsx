/**
 * @fileoverview Context de Empresa
 * Gerencia estado da empresa selecionada e suas permissões
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { empresasAPI } from "../services/apiWrapper";
import type { Empresa, UsuarioEmpresa, PlanoEmpresa } from "../types";
import { PapelEmpresa } from "../types";
import { useAuth } from "./AuthContext";

interface CompanyContextType {
  currentCompany: Empresa | null;
  userRole: PapelEmpresa | null;
  userCompanies: UsuarioEmpresa[];
  isLoading: boolean;
  error: string | null;
  setCurrentCompany: (company: Empresa) => void;
  refreshCompanyData: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
  canEdit: boolean;
  canView: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

interface CompanyProviderProps {
  children: ReactNode;
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [currentCompany, setCurrentCompanyState] = useState<Empresa | null>(
    null,
  );
  const [userRole, setUserRole] = useState<PapelEmpresa | null>(null);
  const [userCompanies, setUserCompanies] = useState<UsuarioEmpresa[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar empresas do usuário
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setCurrentCompanyState(null);
      setUserRole(null);
      setUserCompanies([]);
      return;
    }

    loadUserCompanies();
  }, [user, isAuthenticated]);

  const loadUserCompanies = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Criar endpoint para buscar empresas do usuário
      // Por enquanto, usar dados mock ou localStorage
      const savedCompany = localStorage.getItem("current_company");
      const savedRole = localStorage.getItem("user_role");

      if (savedCompany) {
        setCurrentCompanyState(JSON.parse(savedCompany));
      }

      if (savedRole) {
        setUserRole(savedRole as PapelEmpresa);
      }
    } catch (err) {
      console.error("Erro ao carregar empresas:", err);
      setError("Erro ao carregar dados da empresa");
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentCompany = (company: Empresa) => {
    setCurrentCompanyState(company);
    localStorage.setItem("current_company", JSON.stringify(company));

    // TODO: Buscar papel do usuário nesta empresa
    // Por enquanto, assumir ADMIN se for a primeira empresa
    const role: PapelEmpresa = PapelEmpresa.ADMIN;
    setUserRole(role);
    localStorage.setItem("user_role", role);
  };

  const refreshCompanyData = async () => {
    if (!currentCompany) return;

    setIsLoading(true);
    try {
      const response = await empresasAPI.getById(currentCompany.id);
      if (response.success && response.data) {
        setCurrentCompanyState(response.data);
        localStorage.setItem("current_company", JSON.stringify(response.data));
      }
    } catch (err) {
      console.error("Erro ao atualizar empresa:", err);
      setError("Erro ao atualizar dados da empresa");
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!userRole) return false;

    // ADMIN tem todas as permissões
    if (userRole === "ADMIN") return true;

    // GESTOR pode editar e visualizar
    if (userRole === "GESTOR") {
      return ["view", "edit", "create"].includes(permission);
    }

    // AUDITOR pode visualizar
    if (userRole === "AUDITOR") {
      return permission === "view";
    }

    // VISUALIZADOR só pode visualizar
    if (userRole === "VISUALIZADOR") {
      return permission === "view";
    }

    return false;
  };

  const isAdmin = userRole === "ADMIN";
  const canEdit = userRole === "ADMIN" || userRole === "GESTOR";
  const canView = !!userRole; // Todos os papéis podem visualizar

  const value: CompanyContextType = {
    currentCompany,
    userRole,
    userCompanies,
    isLoading,
    error,
    setCurrentCompany,
    refreshCompanyData,
    hasPermission,
    isAdmin,
    canEdit,
    canView,
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany deve ser usado dentro de um CompanyProvider");
  }
  return context;
};
