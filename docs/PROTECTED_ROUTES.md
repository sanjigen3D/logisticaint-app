# Guía de Rutas Protegidas

Esta guía te ayudará a implementar autenticación y protección de rutas en tu aplicación Expo.

## Tabla de Contenidos

- [Configuración Inicial](#configuración-inicial)
- [Uso del Hook useAuth](#uso-del-hook-useauth)
- [Proteger Rutas con ProtectedRoute](#proteger-rutas-con-protectedroute)
- [Proteger Rutas con useRequireAuth](#proteger-rutas-con-userequireauth)
- [Ejemplo de Implementación Completa](#ejemplo-de-implementación-completa)
- [Roles de Usuario](#roles-de-usuario)
- [Ejemplos Avanzados](#ejemplos-avanzados)

---

## Configuración Inicial

### 1. Estructura de Archivos

La autenticación está compuesta por:

```
lib/
├── stores/
│   └── authStore.ts          # Store de Zustand para autenticación
├── services/
│   └── storageService.ts     # Servicio para persistir datos
├── hooks/
│   ├── useAuth.ts            # Hook principal de autenticación
│   └── useRequireAuth.ts     # Hook para proteger rutas
└── types/
    └── authTypes.ts          # Tipos de TypeScript

components/
└── auth/
    └── ProtectedRoute.tsx    # Componente para proteger rutas
```

### 2. Inicialización

El store de autenticación se inicializa automáticamente al usar el hook `useAuth()`. No necesitas configuración adicional.

---

## Uso del Hook useAuth

El hook `useAuth` te da acceso a toda la funcionalidad de autenticación:

### Importación

```typescript
import { useAuth } from '@/lib/hooks/useAuth';
```

### Propiedades Disponibles

```typescript
const {
  user,           // Usuario autenticado (null si no está autenticado)
  token,          // Token JWT (null si no está autenticado)
  isAuthenticated,// Boolean que indica si el usuario está autenticado
  isLoading,      // Boolean que indica si se está verificando la sesión
  error,          // Mensaje de error (null si no hay error)
  login,          // Función para iniciar sesión
  logout,         // Función para cerrar sesión
  clearError,     // Función para limpiar errores
  isAdmin,        // Boolean: true si el usuario es Admin
  isManager,      // Boolean: true si el usuario es Manager o Admin
  isUser,         // Boolean: true si el usuario es User
} = useAuth();
```

### Ejemplo Básico

```typescript
import { useAuth } from '@/lib/hooks/useAuth';
import { View, Text, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <View>
      <Text>Bienvenido, {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
      <Text>Tipo: {user?.type}</Text>

      {isAdmin && (
        <Text>Tienes permisos de administrador</Text>
      )}

      <TouchableOpacity onPress={logout}>
        <Text>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## Proteger Rutas con ProtectedRoute

El componente `ProtectedRoute` envuelve tus componentes para restringir el acceso.

### Importación

```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
```

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `requireAuth` | `boolean` | `true` | Si es `true`, requiere que el usuario esté autenticado |
| `requiredRole` | `'Admin' \| 'Manager' \| 'User'` | `undefined` | Rol específico requerido para acceder |
| `redirectTo` | `string` | `ROUTES.LOGIN` | Ruta a la que redirigir si no tiene acceso |
| `children` | `ReactNode` | - | Contenido protegido |

### Ejemplo 1: Ruta que Requiere Autenticación

```typescript
// app/dashboard.tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { View, Text } from 'react-native';

export default function DashboardScreen() {
  return (
    <ProtectedRoute>
      <View>
        <Text>Este contenido solo lo ven usuarios autenticados</Text>
      </View>
    </ProtectedRoute>
  );
}
```

### Ejemplo 2: Ruta Solo para Administradores

```typescript
// app/admin.tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { View, Text } from 'react-native';

export default function AdminScreen() {
  return (
    <ProtectedRoute requiredRole="Admin">
      <View>
        <Text>Panel de Administración</Text>
      </View>
    </ProtectedRoute>
  );
}
```

### Ejemplo 3: Ruta Solo para Managers y Admins

```typescript
// app/management.tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { View, Text } from 'react-native';

export default function ManagementScreen() {
  return (
    <ProtectedRoute requiredRole="Manager">
      <View>
        <Text>Panel de Gestión</Text>
        <Text>Accesible para Manager y Admin</Text>
      </View>
    </ProtectedRoute>
  );
}
```

### Ejemplo 4: Ruta con Redirección Personalizada

```typescript
// app/settings.tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { View, Text } from 'react-native';
import { ROUTES } from '@/lib/Routes';

export default function SettingsScreen() {
  return (
    <ProtectedRoute redirectTo={ROUTES.HOME}>
      <View>
        <Text>Configuración</Text>
      </View>
    </ProtectedRoute>
  );
}
```

---

## Proteger Rutas con useRequireAuth

El hook `useRequireAuth` es una alternativa ligera a `ProtectedRoute` que puedes usar directamente en tus componentes.

### Importación

```typescript
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
```

### Props

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `requireAuth` | `boolean` | `true` | Si es `true`, requiere que el usuario esté autenticado |
| `requiredRole` | `'Admin' \| 'Manager' \| 'User'` | `undefined` | Rol específico requerido |
| `redirectTo` | `string` | `ROUTES.LOGIN` | Ruta de redirección |

### Ejemplo

```typescript
// app/profile.tsx
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';
import { View, Text, ActivityIndicator } from 'react-native';

export default function ProfileScreen() {
  const { isLoading, user, hasRequiredRole } = useRequireAuth({
    requireAuth: true,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <Text>Perfil de {user?.name}</Text>
    </View>
  );
}
```

---

## Ejemplo de Implementación Completa

### Pantalla de Login

```typescript
// app/(accounts)/login.tsx
import { View, StyleSheet } from 'react-native';
import { LoginForm } from '@/components/forms/login/LoginForm';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <LoginForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 1024,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
});
```

### Pantalla Protegida con Navegación

```typescript
// app/dashboard/_layout.tsx
import { Stack } from 'expo-router';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DashboardLayout() {
  return (
    <ProtectedRoute>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: 'Dashboard' }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: 'Configuración' }}
        />
      </Stack>
    </ProtectedRoute>
  );
}
```

### Componente con Lógica Condicional

```typescript
// components/UserMenu.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@/lib/hooks/useAuth';
import { router } from 'expo-router';
import { ROUTES } from '@/lib/Routes';

export const UserMenu = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <TouchableOpacity
        onPress={() => router.push(ROUTES.LOGIN)}
        style={styles.button}
      >
        <Text>Iniciar Sesión</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Hola, {user?.name}</Text>

      {isAdmin && (
        <TouchableOpacity
          onPress={() => router.push('/admin')}
          style={styles.button}
        >
          <Text>Panel Admin</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={logout}
        style={styles.button}
      >
        <Text>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    padding: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    marginVertical: 4,
  },
});
```

---

## Roles de Usuario

La aplicación soporta tres tipos de roles:

### User

- Rol básico con acceso limitado
- No puede crear otros usuarios
- No puede acceder a rutas de Manager o Admin

```typescript
<ProtectedRoute requiredRole="User">
  {/* Solo usuarios con rol User */}
</ProtectedRoute>
```

### Manager

- Puede crear usuarios de tipo User
- Tiene permisos de gestión
- **Nota:** Los Admins también tienen acceso a rutas de Manager

```typescript
<ProtectedRoute requiredRole="Manager">
  {/* Manager y Admin pueden acceder */}
</ProtectedRoute>
```

### Admin

- Máximo nivel de permisos
- Puede crear usuarios de cualquier tipo
- Acceso a todas las rutas

```typescript
<ProtectedRoute requiredRole="Admin">
  {/* Solo Admins */}
</ProtectedRoute>
```

### Verificación de Roles en el Código

```typescript
const { user, isAdmin, isManager, isUser } = useAuth();

if (isAdmin) {
  // Lógica exclusiva para Admin
}

if (isManager) {
  // Lógica para Manager y Admin
}

if (isUser) {
  // Lógica para User
}
```

---

## Ejemplos Avanzados

### 1. Mostrar Diferentes Componentes según el Rol

```typescript
import { useAuth } from '@/lib/hooks/useAuth';

export default function HomeScreen() {
  const { isAdmin, isManager, isUser } = useAuth();

  return (
    <View>
      {isAdmin && <AdminDashboard />}
      {isManager && !isAdmin && <ManagerDashboard />}
      {isUser && <UserDashboard />}
    </View>
  );
}
```

### 2. Proteger Layouts Completos

```typescript
// app/(protected)/_layout.tsx
import { Stack } from 'expo-router';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
      </Stack>
    </ProtectedRoute>
  );
}
```

### 3. Redirección Condicional

```typescript
import { useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated]);

  return (
    <View>
      <Text>Bienvenido</Text>
    </View>
  );
}
```

### 4. Llamadas API Autenticadas

```typescript
import { useAuth } from '@/lib/hooks/useAuth';

export default function DataScreen() {
  const { token } = useAuth();

  const fetchProtectedData = async () => {
    const response = await fetch('https://api.example.com/data', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  };

  // Usar fetchProtectedData en tu lógica
}
```

### 5. Botón Condicional de Logout

```typescript
import { useAuth } from '@/lib/hooks/useAuth';
import { TouchableOpacity, Text } from 'react-native';

export const LogoutButton = () => {
  const { isAuthenticated, logout, isLoading } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={logout}
      disabled={isLoading}
    >
      <Text>{isLoading ? 'Cerrando...' : 'Cerrar Sesión'}</Text>
    </TouchableOpacity>
  );
};
```

---

## Mejores Prácticas

### 1. Siempre Verifica la Autenticación en el Servidor

La protección del lado del cliente es solo para UX. Siempre valida en el servidor:

```typescript
const response = await fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

### 2. Maneja Estados de Carga

```typescript
const { isLoading } = useAuth();

if (isLoading) {
  return <LoadingScreen />;
}
```

### 3. Limpia Errores después de Mostrarlos

```typescript
const { error, clearError } = useAuth();

useEffect(() => {
  if (error) {
    Alert.alert('Error', error);
    clearError();
  }
}, [error]);
```

### 4. Usa ProtectedRoute en Layouts

Para proteger múltiples pantallas a la vez, envuelve el layout:

```typescript
// app/(admin)/_layout.tsx
export default function AdminLayout() {
  return (
    <ProtectedRoute requiredRole="Admin">
      <Stack>
        {/* Todas estas pantallas están protegidas */}
        <Stack.Screen name="users" />
        <Stack.Screen name="settings" />
      </Stack>
    </ProtectedRoute>
  );
}
```

---

## Troubleshooting

### El usuario se redirige inmediatamente después de login

Verifica que estés usando `router.replace()` en lugar de `router.push()` después del login:

```typescript
await login(email, password);
router.replace(ROUTES.HOME);
```

### Los roles no se verifican correctamente

Asegúrate de que la API devuelva el campo `type` en la respuesta del usuario:

```json
{
  "user": {
    "id": 1,
    "name": "Usuario",
    "email": "user@example.com",
    "type": "Admin",  // Debe ser exactamente "Admin", "Manager" o "User"
    "active": true
  }
}
```

### El token no persiste después de cerrar la app

Verifica que AsyncStorage esté correctamente instalado y configurado:

```bash
npm install @react-native-async-storage/async-storage
```

---

## Resumen

- Usa `useAuth()` para acceder al estado de autenticación
- Usa `<ProtectedRoute>` para proteger componentes completos
- Usa `useRequireAuth()` para protección ligera dentro de componentes
- Los Admins tienen acceso a rutas de Manager automáticamente
- Siempre valida en el servidor además de la protección cliente

Para más información sobre la API de autenticación, consulta `auth_api.md`.
