# Ejemplos de Uso del Sistema de Autenticación

## 1. Uso Básico en Componentes

### Obtener Estado de Autenticación
```tsx
import { useAuthContext } from '@/lib/contexts/AuthContext';

export const MyComponent = () => {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <div>Por favor, inicia sesión</div>;
  }

  return (
    <div>
      <h1>Bienvenido, {user?.name}!</h1>
      <p>Tipo de usuario: {user?.type}</p>
    </div>
  );
};
```

### Login Manual
```tsx
import { useLogin } from '@/lib/services/auth.service';

export const LoginComponent = () => {
  const loginMutation = useLogin();

  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync({
        email: 'usuario@ejemplo.com',
        password: 'contraseña123'
      });
      // El login se maneja automáticamente
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  return (
    <button 
      onClick={handleLogin}
      disabled={loginMutation.isPending}
    >
      {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
    </button>
  );
};
```

### Logout
```tsx
import { useLogout } from '@/lib/services/auth.service';

export const LogoutButton = () => {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? 'Cerrando sesión...' : 'Cerrar Sesión'}
    </button>
  );
};
```

## 2. Protección de Rutas

### Proteger Rutas Completas
```tsx
import { ProtectedRoute } from '@/lib/contexts/AuthContext';

export const App = () => {
  return (
    <Router>
      <Route path="/login" component={LoginPage} />
      <ProtectedRoute path="/dashboard">
        <DashboardPage />
      </ProtectedRoute>
      <ProtectedRoute 
        path="/admin" 
        requiredPermission="Admin"
        fallback={<div>No tienes permisos para acceder</div>}
      >
        <AdminPage />
      </ProtectedRoute>
    </Router>
  );
};
```

### Mostrar Contenido Condicional
```tsx
import { 
  AuthenticatedOnly, 
  UnauthenticatedOnly,
  usePermissions 
} from '@/lib/contexts/AuthContext';

export const Navigation = () => {
  const { isAdmin, isManager } = usePermissions();

  return (
    <nav>
      <UnauthenticatedOnly>
        <Link to="/login">Iniciar Sesión</Link>
      </UnauthenticatedOnly>
      
      <AuthenticatedOnly>
        <Link to="/dashboard">Dashboard</Link>
        
        {isManager && (
          <Link to="/management">Gestión</Link>
        )}
        
        {isAdmin && (
          <Link to="/admin">Administración</Link>
        )}
      </AuthenticatedOnly>
    </nav>
  );
};
```

## 3. Verificación de Permisos

### Hook de Permisos
```tsx
import { usePermissions } from '@/lib/contexts/AuthContext';

export const UserActions = () => {
  const { hasPermission, isAdmin, isManager, userType } = usePermissions();

  return (
    <div>
      <h2>Acciones Disponibles</h2>
      
      {hasPermission('User') && (
        <button>Ver Perfil</button>
      )}
      
      {hasPermission('Manager') && (
        <button>Gestionar Usuarios</button>
      )}
      
      {hasPermission('Admin') && (
        <button>Configuración del Sistema</button>
      )}
      
      <p>Tipo de usuario actual: {userType}</p>
    </div>
  );
};
```

## 4. Registro de Usuarios (Solo Managers/Admins)

### Formulario de Registro
```tsx
import { useRegister } from '@/lib/services/auth.service';
import { useAuthContext } from '@/lib/contexts/AuthContext';

export const RegisterForm = () => {
  const { token } = useAuthContext();
  const registerMutation = useRegister();

  const handleRegister = async (userData) => {
    try {
      await registerMutation.mutateAsync({
        userData,
        token: token!
      });
      alert('Usuario registrado exitosamente');
    } catch (error) {
      alert('Error al registrar usuario: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      {/* Campos del formulario */}
    </form>
  );
};
```

## 5. Verificación Automática de Token

### Componente de Verificación
```tsx
import { useAuthCheck } from '@/lib/services/auth.service';

export const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading, error } = useAuthCheck();

  if (isLoading) {
    return <div>Verificando autenticación...</div>;
  }

  if (error) {
    return <div>Error de autenticación: {error.message}</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};
```

## 6. Manejo de Errores

### Interceptor de Errores de Autenticación
```tsx
import { useEffect } from 'react';
import { useAuthContext } from '@/lib/contexts/AuthContext';

export const ErrorHandler = () => {
  const { error, clearError } = useAuthContext();

  useEffect(() => {
    if (error) {
      // Mostrar error al usuario
      alert('Error de autenticación: ' + error);
      // Limpiar error después de mostrarlo
      clearError();
    }
  }, [error, clearError]);

  return null;
};
```

## 7. Persistencia de Sesión

### Inicialización de la App
```tsx
import { useEffect } from 'react';
import { useAuthActions } from '@/lib/stores/auth.store';

export const App = () => {
  const { initializeAuth } = useAuthActions();

  useEffect(() => {
    // Inicializar autenticación al cargar la app
    initializeAuth();
  }, [initializeAuth]);

  return (
    // Tu app aquí
  );
};
```

## 8. Almacenamiento Seguro

### Acceso Directo al Almacenamiento
```tsx
import { storageService, STORAGE_KEYS } from '@/lib/storage/storage.service';

export const StorageExample = () => {
  const saveData = async () => {
    // Guardar datos sensibles (usa SecureStore en móvil)
    await storageService.setItem('sensitive_data', 'valor', true);
    
    // Guardar datos normales (usa AsyncStorage en móvil)
    await storageService.setItem('normal_data', 'valor', false);
  };

  const loadData = async () => {
    const sensitive = await storageService.getItem('sensitive_data', true);
    const normal = await storageService.getItem('normal_data', false);
    
    console.log('Datos sensibles:', sensitive);
    console.log('Datos normales:', normal);
  };

  return (
    <div>
      <button onClick={saveData}>Guardar Datos</button>
      <button onClick={loadData}>Cargar Datos</button>
    </div>
  );
};
```

## 9. Configuración de React Query

### Query Personalizada
```tsx
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/lib/contexts/AuthContext';

export const useUserProfile = () => {
  const { token } = useAuthContext();

  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => fetchUserProfile(token),
    enabled: !!token, // Solo ejecutar si hay token
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
```

## 10. Testing

### Mock del Store de Autenticación
```tsx
// En tus tests
import { useAuthStore } from '@/lib/stores/auth.store';

// Mock del store
const mockAuthStore = {
  user: { id: 1, email: 'test@test.com', name: 'Test User', type: 'User' },
  token: 'mock-token',
  isAuthenticated: true,
  isLoading: false,
  error: null,
  login: jest.fn(),
  logout: jest.fn(),
  clearError: jest.fn(),
  initializeAuth: jest.fn(),
};

// Usar en tus tests
jest.mock('@/lib/stores/auth.store', () => ({
  useAuthStore: () => mockAuthStore,
}));
```

## Comandos para Testing

Una vez que hayas probado todo, puedes hacer el merge con estos comandos:

```bash
# Verificar que todo funciona
npm run build
npm test

# Hacer commit de los cambios
git add .
git commit -m "feat: implementar sistema de autenticación completo

- Agregar Zustand para manejo de estado
- Implementar almacenamiento seguro con Platform.OS
- Integrar React Query para llamadas a API
- Crear contexto de autenticación y protección de rutas
- Actualizar LoginForm con nuevo sistema
- Agregar documentación y ejemplos de uso"

# Cambiar a main y hacer merge
git checkout main
git merge feature/auth-implementation

# Eliminar la branch de feature
git branch -d feature/auth-implementation
```
