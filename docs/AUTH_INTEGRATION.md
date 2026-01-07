# Integración de Autenticación

Sistema completo de autenticación integrado con Zustand, AsyncStorage y protección de rutas.

## Características

- Autenticación con JWT
- Persistencia de sesión con AsyncStorage
- Gestión de estado con Zustand
- Protección de rutas por autenticación y roles
- Soporte para roles: Admin, Manager, User
- Sin re-renders infinitos

## Archivos Creados

### 1. Servicios

**`lib/services/storageService.ts`**
Maneja la persistencia de tokens y datos de usuario usando AsyncStorage.

### 2. Tipos

**`lib/types/authTypes.ts`**
Definiciones de TypeScript para:
- User
- AuthState
- AuthActions
- LoginResponse
- VerifyResponse

### 3. Store

**`lib/stores/authStore.ts`**
Store de Zustand que maneja:
- Estado de autenticación
- Login/Logout
- Verificación de token
- Inicialización desde storage

### 4. Hooks

**`lib/hooks/useAuth.ts`**
Hook principal que proporciona:
- Datos del usuario
- Estados de autenticación
- Funciones de login/logout
- Validadores de roles (isAdmin, isManager, isUser)

**`lib/hooks/useRequireAuth.ts`**
Hook para proteger componentes directamente sin wrapper.

### 5. Componentes

**`components/auth/ProtectedRoute.tsx`**
Componente wrapper para proteger rutas completas.

### 6. Formularios

**`components/forms/login/LoginForm.tsx`** (Actualizado)
Formulario de login integrado con el store de autenticación.

### 7. Pantallas

**`app/(accounts)/account.tsx`** (Actualizado)
Pantalla que muestra:
- Perfil de usuario si está autenticado
- Opciones de login/registro si no está autenticado

## Uso Rápido

### 1. Login

```typescript
import { useAuth } from '@/lib/hooks/useAuth';

function LoginScreen() {
  const { login, error, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
      // Usuario autenticado
    } catch (error) {
      // Manejar error
    }
  };
}
```

### 2. Proteger Ruta

```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProtectedScreen() {
  return (
    <ProtectedRoute>
      <View>
        <Text>Contenido protegido</Text>
      </View>
    </ProtectedRoute>
  );
}
```

### 3. Verificar Rol

```typescript
import { useAuth } from '@/lib/hooks/useAuth';

function AdminPanel() {
  const { isAdmin, user } = useAuth();

  if (!isAdmin) {
    return <Text>No tienes permisos</Text>;
  }

  return <Text>Bienvenido Admin {user?.name}</Text>;
}
```

### 4. Logout

```typescript
import { useAuth } from '@/lib/hooks/useAuth';

function LogoutButton() {
  const { logout, isLoading } = useAuth();

  return (
    <TouchableOpacity onPress={logout} disabled={isLoading}>
      <Text>Cerrar Sesión</Text>
    </TouchableOpacity>
  );
}
```

## Flujo de Autenticación

### 1. Inicialización

Cuando la app inicia:
1. `useAuth()` se llama en el componente
2. `initializeAuth()` se ejecuta automáticamente
3. Se busca el token en AsyncStorage
4. Si existe, se verifica con el servidor
5. Si es válido, el usuario queda autenticado

### 2. Login

1. Usuario completa formulario
2. Se llama a `login(email, password)`
3. Se hace petición POST a `/auth/login`
4. Si es exitoso:
   - Token se guarda en AsyncStorage
   - Usuario se guarda en AsyncStorage
   - Estado se actualiza en Zustand
   - Usuario es redirigido

### 3. Logout

1. Usuario presiona logout
2. Se llama a `logout()`
3. Se hace petición POST a `/auth/logout`
4. Se limpia AsyncStorage
5. Estado de Zustand se resetea
6. Usuario es redirigido

### 4. Verificación Automática

El token se verifica automáticamente:
- Al iniciar la app
- Al hacer login
- Cuando se llama a `verifyToken()`

Si el token es inválido o expiró:
- Se limpia la sesión automáticamente
- Usuario debe volver a autenticarse

## Protección de Rutas

### Método 1: Componente Wrapper

```typescript
// Ruta que requiere autenticación
<ProtectedRoute>
  <MyComponent />
</ProtectedRoute>

// Ruta que requiere rol específico
<ProtectedRoute requiredRole="Admin">
  <AdminPanel />
</ProtectedRoute>

// Manager (incluye Admin)
<ProtectedRoute requiredRole="Manager">
  <ManagerPanel />
</ProtectedRoute>
```

### Método 2: Hook

```typescript
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';

function ProtectedScreen() {
  const { isLoading } = useRequireAuth({
    requireAuth: true,
    requiredRole: 'Admin',
  });

  if (isLoading) return <Loading />;

  return <View>...</View>;
}
```

### Método 3: Layout Protegido

```typescript
// app/(protected)/_layout.tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Stack } from 'expo-router';

export default function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Stack>
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="settings" />
      </Stack>
    </ProtectedRoute>
  );
}
```

## Roles y Permisos

### Jerarquía de Roles

```
Admin > Manager > User
```

### Comportamiento

- **User**: Solo acceso básico
- **Manager**: Acceso de gestión + puede crear usuarios
- **Admin**: Acceso completo + hereda permisos de Manager

### Verificación de Roles

```typescript
const { isAdmin, isManager, isUser } = useAuth();

// Admin exclusivo
if (isAdmin) { /* ... */ }

// Manager o Admin
if (isManager) { /* ... */ }

// Cualquier rol
if (isUser) { /* ... */ }
```

## Prevención de Re-renders

### Store Optimizado

El store de Zustand está diseñado para evitar re-renders innecesarios:

```typescript
// Solo se actualiza cuando cambia isAuthenticated
const isAuthenticated = useAuthStore(state => state.isAuthenticated);

// Se actualiza cuando cambia cualquier parte del state
const { isAuthenticated, user } = useAuthStore();
```

### Selectores Específicos

```typescript
// Mejor - Solo re-render cuando cambia el nombre
const userName = useAuthStore(state => state.user?.name);

// Evitar - Re-render cuando cambia cualquier cosa del usuario
const user = useAuthStore(state => state.user);
```

## Manejo de Errores

### En el Store

Los errores se capturan y guardan en el estado:

```typescript
const { error, clearError } = useAuth();

// Mostrar error
if (error) {
  Alert.alert('Error', error);
  clearError();
}
```

### En el Formulario

El LoginForm muestra errores automáticamente:

```typescript
{error && (
  <View style={styles.errorContainer}>
    <Text>{error}</Text>
  </View>
)}
```

## Seguridad

### Consideraciones

1. **Token en AsyncStorage**: Seguro para aplicaciones móviles
2. **Validación en servidor**: Siempre valida el token en el backend
3. **HTTPS**: Usa HTTPS en producción
4. **Expiración**: Los tokens expiran en 24 horas

### Recomendaciones

1. No guardes contraseñas en el cliente
2. Limpia el storage al logout
3. Verifica el token antes de operaciones sensibles
4. Implementa refresh tokens para mejor UX

## Ejemplos Completos

Ver `docs/PROTECTED_ROUTES.md` para:
- Ejemplos detallados de uso
- Casos de uso avanzados
- Mejores prácticas
- Troubleshooting

## API Backend

La documentación completa de la API está en `auth_api.md`, incluyendo:
- Endpoints disponibles
- Estructura de respuestas
- Códigos de error
- Ejemplos de peticiones
