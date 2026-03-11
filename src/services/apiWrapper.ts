/**
 * @fileoverview Wrapper da API que alterna entre mock e API real
 * Facilita desenvolvimento e testes
 */

import { 
  authAPI as realAuthAPI,
  empresasAPI as realEmpresasAPI,
  utilizadoresAPI as realUtilizadoresAPI,
  fazendasAPI as realFazendasAPI,
  lotesAPI as realLotesAPI,
  hubsAPI as realHubsAPI,
  fretesAPI as realFretesAPI,
  transacoesAPI as realTransacoesAPI,
  notificacoesAPI as realNotificacoesAPI,
  estatisticasAPI as realEstatisticasAPI,
  produtosAPI as realProdutosAPI,
} from './api';

import { mockAPI, mockSuccess, mockError, USE_MOCK_API } from './mockData';
import type { APIResponse, Utilizador } from '../types';

// ========================
// WRAPPER: AUTH API
// ========================

export const authAPI = {
  login: async (credentials: { telefone: string; senha: string }) => {
    if (USE_MOCK_API) {
      // Mock login
      console.log('[MOCK] Login com:', credentials);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return mockSuccess({
        token: 'mock_jwt_token_' + Date.now(),
        usuario: {
          id: 'user1',
          nome_completo: 'Admin Empresa',
          email: 'admin@empresa.ao',
          telefone: credentials.telefone,
          tipo_usuario: 'GOVERNMENT',
          status: 'APROVADO',
          verificado: true,
          avaliacao: 5.0,
          localizacao_id: null,
          aldeia_localidade: null,
          endereco_completo: null,
          latitude: null,
          longitude: null,
          saldo_wallet: 0,
          ultima_atividade: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        } as Utilizador,
      });
    }
    
    return realAuthAPI.login(credentials);
  },

  logout: async () => {
    if (USE_MOCK_API) {
      console.log('[MOCK] Logout');
      return mockSuccess(null);
    }
    return realAuthAPI.logout();
  },

  verifyOTP: async (data: { telefone: string; otp: string }) => {
    if (USE_MOCK_API) {
      console.log('[MOCK] Verify OTP:', data);
      return mockSuccess({
        token: 'mock_jwt_token_' + Date.now(),
        usuario: {} as Utilizador,
      });
    }
    return realAuthAPI.verifyOTP(data);
  },

  refreshToken: async () => {
    if (USE_MOCK_API) {
      console.log('[MOCK] Refresh token');
      return mockSuccess({ token: 'mock_jwt_token_' + Date.now() });
    }
    return realAuthAPI.refreshToken();
  },

  getProfile: async () => {
    if (USE_MOCK_API) {
      console.log('[MOCK] Get profile');
      const savedUser = localStorage.getItem('user_data');
      if (savedUser) {
        return mockSuccess(JSON.parse(savedUser));
      }
      return mockError('Usuário não autenticado', 'UNAUTHORIZED');
    }
    return realAuthAPI.getProfile();
  },
};

// ========================
// WRAPPER: EMPRESAS API
// ========================

export const empresasAPI = USE_MOCK_API ? mockAPI.empresas : realEmpresasAPI;

// ========================
// WRAPPER: OUTRAS APIs
// ========================

export const utilizadoresAPI = USE_MOCK_API 
  ? { list: async () => mockSuccess([]), getById: async () => mockSuccess(null), create: async () => mockSuccess(null), update: async () => mockSuccess(null) }
  : realUtilizadoresAPI;

export const fazendasAPI = USE_MOCK_API ? mockAPI.fazendas : realFazendasAPI;
export const lotesAPI = USE_MOCK_API ? mockAPI.lotes : realLotesAPI;
export const hubsAPI = USE_MOCK_API ? mockAPI.hubs : realHubsAPI;
export const fretesAPI = USE_MOCK_API ? mockAPI.fretes : realFretesAPI;
export const transacoesAPI = USE_MOCK_API
  ? { list: async () => mockSuccess([]), getById: async () => mockSuccess(null), getByHash: async () => mockSuccess(null) }
  : realTransacoesAPI;
export const notificacoesAPI = USE_MOCK_API ? mockAPI.notificacoes : realNotificacoesAPI;
export const estatisticasAPI = USE_MOCK_API
  ? { getDashboard: async () => mockSuccess({}), getComunas: async () => mockSuccess([]), getRankingComunas: async () => mockSuccess([]) }
  : realEstatisticasAPI;
export const produtosAPI = USE_MOCK_API
  ? { list: async () => mockSuccess([]), getById: async () => mockSuccess(null), getPriceHistory: async () => mockSuccess([]) }
  : realProdutosAPI;

// Log do modo atual
console.log(`[API] Modo: ${USE_MOCK_API ? 'MOCK (desenvolvimento)' : 'REAL (produção)'}`);

// Exportar flag para componentes
export { USE_MOCK_API };
