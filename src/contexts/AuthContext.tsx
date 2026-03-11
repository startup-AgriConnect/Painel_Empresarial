/**
 * @fileoverview Context de Autenticação
 * Gerencia estado global de autenticação do usuário
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI } from "../services/apiWrapper";
import type { Utilizador, UserRole } from "../types";

interface AuthContextType {
  user: Utilizador | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (telefone: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Utilizador | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar usuário do localStorage na inicialização
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("user_data");

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));

          // Tentar buscar dados atualizados do backend
          const response = await authAPI.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
            localStorage.setItem("user_data", JSON.stringify(response.data));
          }
        } catch (err) {
          console.error("Erro ao carregar usuário:", err);
          // Se falhar, manter dados do localStorage
        }
      }

      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (telefone: string, senha: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login({ telefone, senha });

      if (response.success && response.data) {
        const { token, usuario } = response.data;

        // Salvar token e usuário
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_data", JSON.stringify(usuario));
        setUser(usuario);

        return true;
      } else {
        setError(response.error?.message || "Erro ao fazer login");
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro de conexão";
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    } finally {
      // Limpar dados locais independente do resultado
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authAPI.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem("user_data", JSON.stringify(response.data));
      }
    } catch (err) {
      console.error("Erro ao atualizar dados do usuário:", err);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
