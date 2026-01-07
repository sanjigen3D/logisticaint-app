# Sistema de Autenticación - Logisticaint App

Sistema completo de autenticación integrado con Zustand, AsyncStorage y protección de rutas para Expo Web.

## Características Principales

- Autenticación con JWT
- Persistencia de sesión con AsyncStorage
- Gestión de estado global con Zustand
- Protección de rutas por autenticación y roles
- Sistema de roles: Admin, Manager, User
- Sin re-renders infinitos
- Formulario de login integrado

## Instalación

No se requiere instalación adicional. Todos los paquetes necesarios ya están incluidos:

- `zustand` - Gestión de estado
- `@react-native-async-storage/async-storage` - Persistencia
- `expo-router` - Navegación

## Estructura de Archivos

```
lib/
├── stores/
│   └── authStore.ts              # Store de Zustand
├── services/
│   └── storageService.ts         # Servicio de persistencia
├── hooks/
│   ├── useAuth.ts                # Hook principal de auth
│   └── useRequireAuth.ts         # Hook para proteger rutas
└── types/
    └── authTypes.ts              # Tipos de TypeScript

components/
├── auth/
│   └── ProtectedRoute.tsx        # Componente para proteger rutas
└── forms/
    └── login/
        └── LoginForm.tsx         # Formulario de login (actualizado)

docs/
├── AUTH_INTEGRATION.md           # Guía de integración
├── PROTECTED_ROUTES.md           # Guía de rutas protegidas
└── EJEMPLO_USO.md                # Ejemplos prácticos
```

## Uso Rápido

### 1. Login

```typescript
import { useAuth } from '@/lib/hooks/useAuth';

function MyComponent() {
  const { login, error, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
      router.replace('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };
}
```

### 2. Proteger una Ruta

```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DashboardScreen() {
  return (
    <ProtectedRoute>
      <View>
        <Text>Contenido protegido</Text>
      </View>
    </ProtectedRoute>
  );
}
```

### 3. Proteger por Rol

```typescript
// Solo Admin
<ProtectedRoute requiredRole="Admin">
  <AdminPanel />
</ProtectedRoute>

// Manager y Admin
<ProtectedRoute requiredRole="Manager">
  <ManagerPanel />
</ProtectedRoute>

// Solo User
<ProtectedRoute requiredRole="User">
  <UserPanel />
</ProtectedRoute>
```

### 4. Verificar Estado de Autenticación

```typescript
import { useAuth } from '@/lib/hooks/useAuth';

function MyComponent() {
  const {
    isAuthenticated,
    user,
    isAdmin,
    isManager,
    isUser
  } = useAuth();

  if (!isAuthenticated) {
    return <Text>Por favor inicia sesión</Text>;
  }

  return (
    <View>
      <Text>Hola {user?.name}</Text>
      {isAdmin && <Text>Eres administrador</Text>}
    </View>
  );
}
```

### 5. Logout

```typescript
import { useAuth } from '@/lib/hooks/useAuth';

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <TouchableOpacity onPress={logout}>
      <Text>Cerrar Sesión</Text>
    </TouchableOpacity>
  );
}
```

## Documentación Completa

### Guías Principales

1. **[AUTH_INTEGRATION.md](./docs/AUTH_INTEGRATION.md)**
   - Arquitectura del sistema
   - Flujo de autenticación
   - Manejo de errores
   - Prevención de re-renders
   - Consideraciones de seguridad

2. **[PROTECTED_ROUTES.md](./docs/PROTECTED_ROUTES.md)**
   - Cómo proteger rutas
   - Uso del hook `useAuth`
   - Uso del componente `ProtectedRoute`
   - Uso del hook `useRequireAuth`
   - Roles y permisos
   - Ejemplos avanzados
   - Mejores prácticas
   - Troubleshooting

3. **[EJEMPLO_USO.md](./docs/EJEMPLO_USO.md)**
   - 8 ejemplos prácticos completos
   - Código copy-paste listo para usar
   - Casos de uso comunes
   - Patrones recomendados

4. **[auth_api.md](./auth_api.md)**
   - Documentación completa de la API
   - Endpoints disponibles
   - Estructura de respuestas
   - Códigos de error
   - Ejemplos de peticiones

## Roles y Jerarquía

```
Admin > Manager > User
```

- **User**: Acceso básico
- **Manager**: Gestión + puede crear usuarios User
- **Admin**: Acceso completo + hereda permisos de Manager

### Verificación de Roles en Código

```typescript
const { isAdmin, isManager, isUser } = useAuth();

// Solo Admin
if (isAdmin) { /* ... */ }

// Manager o Admin
if (isManager) { /* ... */ }

// Cualquier usuario autenticado
if (isUser) { /* ... */ }
```

## API del Hook useAuth

```typescript
const {
  // Estado
  user,              // Usuario actual (null si no auth)
  token,             // JWT token (null si no auth)
  isAuthenticated,   // boolean
  isLoading,         // boolean
  error,             // string | null

  // Acciones
  login,             // (email, password) => Promise<void>
  logout,            // () => Promise<void>
  clearError,        // () => void

  // Validadores de roles
  isAdmin,           // boolean
  isManager,         // boolean - incluye Admin
  isUser,            // boolean
} = useAuth();
```

## Componente ProtectedRoute

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Contenido a proteger |
| `requireAuth` | `boolean` | `true` | Requiere autenticación |
| `requiredRole` | `'Admin' \| 'Manager' \| 'User'` | `undefined` | Rol requerido |
| `redirectTo` | `string` | `/login` | Ruta de redirección |

### Ejemplos

```typescript
// Requiere solo autenticación
<ProtectedRoute>
  <MyComponent />
</ProtectedRoute>

// Requiere rol específico
<ProtectedRoute requiredRole="Admin">
  <AdminComponent />
</ProtectedRoute>

// Redirección personalizada
<ProtectedRoute redirectTo="/home">
  <MyComponent />
</ProtectedRoute>
```

## Flujo de Autenticación

### 1. Inicio de Sesión

```
Usuario → LoginForm → authStore.login()
    ↓
API /auth/login
    ↓
Token + Usuario → AsyncStorage
    ↓
Estado actualizado en Zustand
    ↓
Redirección a Dashboard
```

### 2. Cierre de Sesión

```
Usuario → logout()
    ↓
API /auth/logout
    ↓
AsyncStorage limpiado
    ↓
Estado reseteado en Zustand
    ↓
Redirección a Home
```

### 3. Verificación Automática

Al iniciar la app:
```
App inicia → useAuth()
    ↓
initializeAuth()
    ↓
Token de AsyncStorage
    ↓
API /auth/verify
    ↓
Token válido: Usuario autenticado
Token inválido: Sesión limpiada
```

## Seguridad

### Implementado

- Contraseñas hasheadas con bcrypt
- JWT con expiración (24 horas)
- Tokens almacenados de forma segura en AsyncStorage
- Validación en servidor de todos los endpoints protegidos
- Verificación automática de token

### Recomendaciones

1. Siempre usa HTTPS en producción
2. No almacenes información sensible en el cliente
3. Implementa rate limiting en el servidor
4. Considera usar refresh tokens para mejor UX
5. Valida siempre en el servidor además del cliente

## Endpoints de la API

### POST /auth/login
Login de usuario

### POST /auth/logout
Cierre de sesión

### POST /auth/verify
Verificar validez del token

### GET /auth/profile
Obtener perfil del usuario autenticado

### POST /auth/register (Requiere Manager/Admin)
Crear nuevo usuario

Ver `auth_api.md` para documentación completa.

## Ejemplos de Uso Común

### Proteger un Layout Completo

```typescript
// app/(protected)/_layout.tsx
import { Stack } from 'expo-router';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Stack>
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
      </Stack>
    </ProtectedRoute>
  );
}
```

### Petición Autenticada

```typescript
const { token } = useAuth();

const fetchData = async () => {
  const response = await fetch('/api/data', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};
```

### Menú Condicional

```typescript
const { isAuthenticated, isAdmin } = useAuth();

return (
  <View>
    {isAuthenticated ? (
      <>
        <MenuItem title="Dashboard" />
        {isAdmin && <MenuItem title="Admin Panel" />}
        <LogoutButton />
      </>
    ) : (
      <LoginButton />
    )}
  </View>
);
```

## Troubleshooting

### El usuario se desloguea automáticamente

- Verifica que el token no haya expirado (24 horas)
- Revisa la conexión con el backend
- Verifica que AsyncStorage funcione correctamente

### Los roles no se validan correctamente

- Asegúrate que la API devuelva `type: "Admin" | "Manager" | "User"`
- Verifica que el usuario esté en el store: `console.log(user)`

### Re-renders infinitos

- Usa selectores específicos en lugar del objeto completo:
  ```typescript
  // Bien
  const userName = useAuthStore(state => state.user?.name);

  // Evitar
  const { user } = useAuthStore();
  ```

## Testing

Para probar el sistema:

1. Usa las credenciales de prueba de tu backend
2. Verifica que el login funcione
3. Verifica que el token persista al recargar
4. Prueba el logout
5. Intenta acceder a rutas protegidas sin auth
6. Verifica la protección por roles

## Próximos Pasos

1. Implementa refresh tokens para mejor UX
2. Agrega recuperación de contraseña
3. Implementa cambio de contraseña
4. Agrega verificación de email
5. Implementa 2FA (autenticación de dos factores)

## Soporte

Para más información consulta:

- `docs/AUTH_INTEGRATION.md` - Guía técnica completa
- `docs/PROTECTED_ROUTES.md` - Guía de rutas protegidas
- `docs/EJEMPLO_USO.md` - Ejemplos prácticos
- `auth_api.md` - Documentación de la API

## Licencia

Este código es parte de Logisticaint App.
