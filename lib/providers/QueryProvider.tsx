import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configuración del QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo de vida de los datos en caché (5 minutos)
      staleTime: 5 * 60 * 1000,
      // Tiempo de vida en caché (10 minutos)
      gcTime: 10 * 60 * 1000,
      // Reintentar automáticamente en caso de error
      retry: (failureCount, error: any) => {
        // No reintentar en errores 401 (no autorizado) o 403 (prohibido)
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        // Reintentar hasta 3 veces para otros errores
        return failureCount < 3;
      },
      // No refetch automático cuando la ventana vuelve a tener foco
      refetchOnWindowFocus: false,
      // No refetch automático al reconectar
      refetchOnReconnect: false,
    },
    mutations: {
      // Reintentar mutaciones en caso de error de red
      retry: (failureCount, error: any) => {
        // No reintentar en errores 401, 403, 400 (errores del cliente)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Reintentar hasta 2 veces para errores de servidor
        return failureCount < 2;
      },
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export { queryClient };
