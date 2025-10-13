import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, User } from '../stores/auth.store';

// Tipos para las respuestas de la API
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  type: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// URL base de la API (ajusta según tu configuración)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Cliente HTTP personalizado
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// Funciones de API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  register: async (userData: RegisterRequest, token: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', userData, token);
  },

  verify: async (token: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/verify', {}, token);
  },

  getProfile: async (token: string): Promise<AuthResponse> => {
    return apiClient.get<AuthResponse>('/auth/profile', token);
  },

  logout: async (token: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/logout', {}, token);
  },
};

// Hooks de React Query para autenticación
export const useLogin = () => {
  const { login: setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.success && data.token && data.user) {
        setAuth(data.user, data.token);
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['auth'] });
      }
    },
    onError: (error) => {
      console.error('Error en login:', error);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userData, token }: { userData: RegisterRequest; token: string }) =>
      authApi.register(userData, token),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error) => {
      console.error('Error en registro:', error);
    },
  });
};

export const useVerifyToken = (token: string | null) => {
  return useQuery({
    queryKey: ['auth', 'verify', token],
    queryFn: () => token ? authApi.verify(token) : null,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useProfile = (token: string | null) => {
  return useQuery({
    queryKey: ['auth', 'profile', token],
    queryFn: () => token ? authApi.getProfile(token) : null,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useLogout = () => {
  const { logout: clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      // Limpiar todas las queries
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Error en logout:', error);
      // Aún así limpiar el estado local
      clearAuth();
      queryClient.clear();
    },
  });
};

// Hook para verificar autenticación automáticamente
export const useAuthCheck = () => {
  const { token, isAuthenticated, initializeAuth } = useAuthStore();
  const { data: verifyData, isLoading, error } = useVerifyToken(token);

  // Inicializar autenticación al montar el componente
  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Si el token no es válido, limpiar autenticación
  React.useEffect(() => {
    if (token && verifyData && !verifyData.success) {
      const { logout } = useAuthStore.getState();
      logout();
    }
  }, [verifyData, token]);

  return {
    isAuthenticated,
    isLoading,
    error,
    user: verifyData?.user || null,
  };
};
