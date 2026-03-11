/**
 * @fileoverview Hooks customizados para integração com API
 */

import { useState, useEffect, useCallback } from 'react';
import type { APIResponse, QueryFilters } from '../types';

/**
 * Hook para gerenciar estado de loading/error para chamadas API
 */
export function useAPIState<T>(initialData: T | null = null) {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  return {
    data,
    setData,
    loading,
    setLoading,
    error,
    setError,
    reset,
  };
}

/**
 * Hook para fazer requisições GET com cache
 */
export function useFetch<T>(
  fetchFunction: (filters?: QueryFilters) => Promise<APIResponse<T>>,
  filters?: QueryFilters,
  options?: { skip?: boolean; cacheTime?: number }
) {
  const { data, setData, loading, setLoading, error, setError } = useAPIState<T>();
  const [lastFetch, setLastFetch] = useState<number>(0);

  const refetch = useCallback(async () => {
    if (options?.skip) return;

    const now = Date.now();
    const cacheTime = options?.cacheTime || 5 * 60 * 1000; // 5 minutos padrão

    // Se temos cache válido, não refazer requisição
    if (data && lastFetch && (now - lastFetch) < cacheTime) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchFunction(filters);

      if (response.success && response.data) {
        setData(response.data);
        setLastFetch(now);
      } else {
        setError(response.error?.message || 'Erro desconhecido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na requisição');
      console.error('useFetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, filters, options?.skip, options?.cacheTime, data, lastFetch, setData, setLoading, setError]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

/**
 * Hook para mutações (POST, PUT, DELETE)
 */
export function useMutation<TData, TVariables = any>(
  mutationFunction: (variables: TVariables) => Promise<APIResponse<TData>>
) {
  const { data, setData, loading, setLoading, error, setError, reset } = useAPIState<TData>();
  const [success, setSuccess] = useState<boolean>(false);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const response = await mutationFunction(variables);

        if (response.success && response.data) {
          setData(response.data);
          setSuccess(true);
          return { success: true, data: response.data };
        } else {
          const errorMsg = response.error?.message || 'Erro na operação';
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro na requisição';
        setError(errorMsg);
        console.error('useMutation error:', err);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [mutationFunction, setData, setLoading, setError]
  );

  return { mutate, data, loading, error, success, reset };
}

/**
 * Hook para paginação
 */
export function usePagination<T>(
  fetchFunction: (filters?: QueryFilters) => Promise<APIResponse<T[]>>,
  initialPage: number = 1,
  pageSize: number = 20
) {
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { data, loading, error, refetch } = useFetch(
    () => fetchFunction({ page, limit: pageSize }),
    { page, limit: pageSize }
  );

  // Extrair metadados de paginação da resposta
  useEffect(() => {
    if (data && typeof data === 'object' && 'metadata' in data) {
      const metadata = (data as any).metadata;
      if (metadata) {
        setTotalPages(metadata.totalPages || 1);
        setTotalItems(metadata.totalItems || 0);
      }
    }
  }, [data]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(page + 1), [page, goToPage]);
  const previousPage = useCallback(() => goToPage(page - 1), [page, goToPage]);

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    totalItems,
    pageSize,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    refetch,
  };
}

/**
 * Hook para autenticação
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se há token no localStorage
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback((newToken: string) => {
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    token,
    login,
    logout,
  };
}

/**
 * Hook para polling (atualização automática)
 */
export function usePolling<T>(
  fetchFunction: () => Promise<APIResponse<T>>,
  interval: number = 30000, // 30 segundos
  options?: { enabled?: boolean }
) {
  const { data, setData, loading, setLoading, error, setError } = useAPIState<T>();

  useEffect(() => {
    if (options?.enabled === false) return;

    const poll = async () => {
      setLoading(true);
      try {
        const response = await fetchFunction();
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.error?.message || 'Erro no polling');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro no polling');
      } finally {
        setLoading(false);
      }
    };

    // Fazer primeira requisição imediatamente
    poll();

    // Configurar polling
    const intervalId = setInterval(poll, interval);

    return () => clearInterval(intervalId);
  }, [fetchFunction, interval, options?.enabled, setData, setLoading, setError]);

  return { data, loading, error };
}
