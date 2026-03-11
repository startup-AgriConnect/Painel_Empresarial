/**
 * @fileoverview Serviços de API para integração com backend
 * Este arquivo contém funções para comunicação com a API REST
 * 
 * @note Para produção, configure a variável API_BASE_URL
 */

import type {
  APIResponse,
  QueryFilters,
  Empresa,
  Utilizador,
  UsuarioEmpresa,
  Fazenda,
  LoteProducao,
  Hub,
  MicroAgregador,
  Frete,
  Transacao,
  Notificacao,
  EstatisticaComuna,
  Produto,
  Produtor
} from '../types';

// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Classe helper para requisições HTTP
 */
class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string, params?: QueryFilters): Promise<APIResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<APIResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return response.json();
  }

  async put<T>(endpoint: string, data: any): Promise<APIResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return response.json();
  }

  async patch<T>(endpoint: string, data: any): Promise<APIResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return response.json();
  }
}

// Instância global do cliente
const apiClient = new APIClient(API_BASE_URL);

// ========================
// AUTENTICAÇÃO
// ========================

export const authAPI = {
  /**
   * Login de usuário
   */
  login: async (credentials: { telefone: string; senha: string }) => {
    return apiClient.post<{ token: string; usuario: Utilizador }>('/auth/login', credentials);
  },

  /**
   * Logout
   */
  logout: async () => {
    const response = await apiClient.post('/auth/logout', {});
    apiClient.clearToken();
    return response;
  },

  /**
   * Verificar OTP
   */
  verifyOTP: async (data: { telefone: string; otp: string }) => {
    return apiClient.post<{ token: string; usuario: Utilizador }>('/auth/verify-otp', data);
  },

  /**
   * Refresh token
   */
  refreshToken: async () => {
    return apiClient.post<{ token: string }>('/auth/refresh', {});
  },

  /**
   * Obter perfil do usuário autenticado
   */
  getProfile: async () => {
    return apiClient.get<Utilizador>('/auth/me');
  },
};

// ========================
// EMPRESAS
// ========================

export const empresasAPI = {
  /**
   * Listar empresas
   */
  list: async (filters?: QueryFilters) => {
    return apiClient.get<Empresa[]>('/empresas', filters);
  },

  /**
   * Obter empresa por ID
   */
  getById: async (id: string) => {
    return apiClient.get<Empresa>(`/empresas/${id}`);
  },

  /**
   * Criar empresa
   */
  create: async (data: Partial<Empresa>) => {
    return apiClient.post<Empresa>('/empresas', data);
  },

  /**
   * Atualizar empresa
   */
  update: async (id: string, data: Partial<Empresa>) => {
    return apiClient.put<Empresa>(`/empresas/${id}`, data);
  },

  /**
   * Deletar empresa (soft delete)
   */
  delete: async (id: string) => {
    return apiClient.delete(`/empresas/${id}`);
  },

  /**
   * Obter usuários da empresa
   */
  getUsers: async (empresaId: string, filters?: QueryFilters) => {
    return apiClient.get<UsuarioEmpresa[]>(`/empresas/${empresaId}/usuarios`, filters);
  },

  /**
   * Adicionar usuário à empresa
   */
  addUser: async (empresaId: string, data: { usuario_id: string; papel: string }) => {
    return apiClient.post<UsuarioEmpresa>(`/empresas/${empresaId}/usuarios`, data);
  },

  /**
   * Remover usuário da empresa
   */
  removeUser: async (empresaId: string, usuarioId: string) => {
    return apiClient.delete(`/empresas/${empresaId}/usuarios/${usuarioId}`);
  },
};

// ========================
// UTILIZADORES
// ========================

export const utilizadoresAPI = {
  /**
   * Listar utilizadores
   */
  list: async (filters?: QueryFilters) => {
    return apiClient.get<Utilizador[]>('/utilizadores', filters);
  },

  /**
   * Obter utilizador por ID
   */
  getById: async (id: string) => {
    return apiClient.get<Utilizador>(`/utilizadores/${id}`);
  },

  /**
   * Criar utilizador
   */
  create: async (data: Partial<Utilizador>) => {
    return apiClient.post<Utilizador>('/utilizadores', data);
  },

  /**
   * Atualizar utilizador
   */
  update: async (id: string, data: Partial<Utilizador>) => {
    return apiClient.put<Utilizador>(`/utilizadores/${id}`, data);
  },
};

// ========================
// FAZENDAS
// ========================

export const fazendasAPI = {
  /**
   * Listar fazendas
   */
  list: async (filters?: QueryFilters) => {
    return apiClient.get<Fazenda[]>('/fazendas', filters);
  },

  /**
   * Obter fazenda por ID
   */
  getById: async (id: string) => {
    return apiClient.get<Fazenda>(`/fazendas/${id}`);
  },

  /**
   * Criar fazenda
   */
  create: async (data: Partial<Fazenda>) => {
    return apiClient.post<Fazenda>('/fazendas', data);
  },

  /**
   * Atualizar fazenda
   */
  update: async (id: string, data: Partial<Fazenda>) => {
    return apiClient.patch<Fazenda>(`/fazendas/${id}`, data);
  },

  /**
   * Aprovar fazenda
   */
  approve: async (id: string) => {
    return apiClient.post<Fazenda>(`/fazendas/${id}/aprovar`, {});
  },

  /**
   * Rejeitar fazenda
   */
  reject: async (id: string, motivo: string) => {
    return apiClient.post<Fazenda>(`/fazendas/${id}/rejeitar`, { motivo });
  },
};

// ========================
// LOTES DE PRODUÇÃO (MARKETPLACE)
// ========================

export const lotesAPI = {
  /**
   * Listar lotes no marketplace
   */
  list: async (filters?: QueryFilters) => {
    return apiClient.get<LoteProducao[]>('/lotes', filters);
  },

  /**
   * Obter lote por ID
   */
  getById: async (id: string) => {
    return apiClient.get<LoteProducao>(`/lotes/${id}`);
  },

  /**
   * Criar lote
   */
  create: async (data: Partial<LoteProducao>) => {
    return apiClient.post<LoteProducao>('/lotes', data);
  },

  /**
   * Atualizar lote
   */
  update: async (id: string, data: Partial<LoteProducao>) => {
    return apiClient.patch<LoteProducao>(`/lotes/${id}`, data);
  },

  /**
   * Publicar lote no marketplace
   */
  publish: async (id: string) => {
    return apiClient.post<LoteProducao>(`/lotes/${id}/publicar`, {});
  },

  /**
   * Despublicar lote do marketplace
   */
  unpublish: async (id: string) => {
    return apiClient.post<LoteProducao>(`/lotes/${id}/despublicar`, {});
  },
};

// ========================
// HUBS
// ========================

export const hubsAPI = {
  /**
   * Listar hubs
   */
  list: async (filters?: QueryFilters) => {
    return apiClient.get<Hub[]>('/hubs', filters);
  },

  /**
   * Obter hub por ID
   */
  getById: async (id: string) => {
    return apiClient.get<Hub>(`/hubs/${id}`);
  },

  /**
   * Criar hub
   */
  create: async (data: Partial<Hub>) => {
    return apiClient.post<Hub>('/hubs', data);
  },

  /**
   * Atualizar hub
   */
  update: async (id: string, data: Partial<Hub>) => {
    return apiClient.patch<Hub>(`/hubs/${id}`, data);
  },

  /**
   * Obter estatísticas do hub
   */
  getStats: async (id: string) => {
    return apiClient.get(`/hubs/${id}/estatisticas`);
  },
};

// ========================
// FRETES
// ========================

export const fretesAPI = {
  /**
   * Listar fretes
   */
  list: async (filters?: QueryFilters) => {
    return apiClient.get<Frete[]>('/fretes', filters);
  },

  /**
   * Obter frete por ID
   */
  getById: async (id: string) => {
    return apiClient.get<Frete>(`/fretes/${id}`);
  },

  /**
   * Criar frete
   */
  create: async (data: Partial<Frete>) => {
    return apiClient.post<Frete>('/fretes', data);
  },

  /**
   * Atualizar frete
   */
  update: async (id: string, data: Partial<Frete>) => {
    return apiClient.patch<Frete>(`/fretes/${id}`, data);
  },

  /**
   * Rastreamento GPS do frete
   */
  getTracking: async (id: string) => {
    return apiClient.get(`/fretes/${id}/rastreamento`);
  },
};

// ========================
// TRANSAÇÕES (BLOCKCHAIN)
// ========================

export const transacoesAPI = {
  /**
   * Listar transações
   */
  list: async (filters?: QueryFilters) => {
    return apiClient.get<Transacao[]>('/transacoes', filters);
  },

  /**
   * Obter transação por ID
   */
  getById: async (id: string) => {
    return apiClient.get<Transacao>(`/transacoes/${id}`);
  },

  /**
   * Obter transação por hash
   */
  getByHash: async (hash: string) => {
    return apiClient.get<Transacao>(`/transacoes/hash/${hash}`);
  },
};

// ========================
// NOTIFICAÇÕES
// ========================

export const notificacoesAPI = {
  /**
   * Listar notificações
   */
  list: async (filters?: QueryFilters) => {
    return apiClient.get<Notificacao[]>('/notificacoes', filters);
  },

  /**
   * Marcar como lida
   */
  markAsRead: async (id: string) => {
    return apiClient.patch(`/notificacoes/${id}/ler`, {});
  },

  /**
   * Marcar todas como lidas
   */
  markAllAsRead: async () => {
    return apiClient.post('/notificacoes/ler-todas', {});
  },

  /**
   * Obter contagem de não lidas
   */
  getUnreadCount: async () => {
    return apiClient.get<{ count: number }>('/notificacoes/nao-lidas/count');
  },
};

// ========================
// ESTATÍSTICAS
// ========================

export const estatisticasAPI = {
  /**
   * Obter estatísticas do dashboard
   */
  getDashboard: async (filters?: { provincia?: string; periodo?: string }) => {
    return apiClient.get('/estatisticas/dashboard', filters);
  },

  /**
   * Obter estatísticas de comunas
   */
  getComunas: async (filters?: QueryFilters) => {
    return apiClient.get<EstatisticaComuna[]>('/estatisticas/comunas', filters);
  },

  /**
   * Obter ranking de comunas
   */
  getRankingComunas: async (filters?: { ano?: number; provincia?: string }) => {
    return apiClient.get('/estatisticas/comunas/ranking', filters);
  },
};

// ========================
// PRODUTOS
// ========================

export const produtosAPI = {
  /**
   * Listar produtos
   */
  list: async (filters?: QueryFilters) => {
    return apiClient.get<Produto[]>('/produtos', filters);
  },

  /**
   * Obter produto por ID
   */
  getById: async (id: string) => {
    return apiClient.get<Produto>(`/produtos/${id}`);
  },

  /**
   * Obter histórico de preços
   */
  getPriceHistory: async (id: string, dias?: number) => {
    return apiClient.get(`/produtos/${id}/historico-precos`, { dias });
  },
};

// Exportar cliente para uso direto se necessário
export { apiClient };
export default apiClient;
