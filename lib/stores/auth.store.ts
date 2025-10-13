import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storageService, STORAGE_KEYS } from '../storage/storage.service';

// Tipos para el usuario y autenticación
export interface User {
  id: number;
  email: string;
  name: string;
  type: string;
  active: boolean;
}

export interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Acciones
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

// Storage personalizado para Zustand que usa nuestro servicio
const createSecureStorage = () => ({
  getItem: async (name: string): Promise<string | null> => {
    return await storageService.getItem(name, true);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await storageService.setItem(name, value, true);
  },
  removeItem: async (name: string): Promise<void> => {
    await storageService.removeItem(name, true);
  },
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Acciones
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Login - guarda usuario y token
      login: async (user, token) => {
        try {
          set({ isLoading: true, error: null });
          
          // Guardar en almacenamiento seguro
          await storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, token, true);
          await storageService.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user), true);
          
          // Actualizar estado
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          console.error('Error en login:', error);
          set({ 
            error: 'Error al guardar datos de autenticación',
            isLoading: false 
          });
          throw error;
        }
      },

      // Logout - limpia todo
      logout: async () => {
        try {
          set({ isLoading: true });
          
          // Limpiar almacenamiento
          await storageService.removeItem(STORAGE_KEYS.AUTH_TOKEN, true);
          await storageService.removeItem(STORAGE_KEYS.USER_DATA, true);
          
          // Limpiar estado
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          console.error('Error en logout:', error);
          set({ 
            error: 'Error al cerrar sesión',
            isLoading: false 
          });
        }
      },

      // Limpiar errores
      clearError: () => set({ error: null }),

      // Inicializar autenticación desde almacenamiento
      initializeAuth: async () => {
        try {
          set({ isLoading: true });
          
          const token = await storageService.getItem(STORAGE_KEYS.AUTH_TOKEN, true);
          const userData = await storageService.getItem(STORAGE_KEYS.USER_DATA, true);
          
          if (token && userData) {
            const user = JSON.parse(userData);
            set({ 
              user, 
              token, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            set({ 
              user: null, 
              token: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
          }
        } catch (error) {
          console.error('Error al inicializar autenticación:', error);
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: 'Error al cargar datos de autenticación'
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => createSecureStorage()),
      // Solo persistir estos campos
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectores útiles
export const useAuth = () => useAuthStore((state) => ({
  user: state.user,
  token: state.token,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  error: state.error,
}));

export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  logout: state.logout,
  setError: state.setError,
  clearError: state.clearError,
  initializeAuth: state.initializeAuth,
}));
