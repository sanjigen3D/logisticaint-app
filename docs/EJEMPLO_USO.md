# Ejemplo de Uso - Sistema de Autenticación

Este documento muestra ejemplos prácticos de cómo usar el sistema de autenticación en diferentes escenarios.

## Ejemplo 1: Pantalla Protegida Simple

Crea una pantalla que solo usuarios autenticados pueden ver.

```typescript
// app/dashboard.tsx
import { View, Text, StyleSheet } from 'react-native';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DashboardScreen() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>
          Bienvenido, {user?.name}
        </Text>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});
```

## Ejemplo 2: Panel de Administración

Solo accesible para usuarios con rol Admin.

```typescript
// app/admin/index.tsx
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/hooks/useAuth';

export default function AdminPanel() {
  const { user } = useAuth();

  const adminActions = [
    { id: '1', title: 'Gestionar Usuarios', route: '/admin/users' },
    { id: '2', title: 'Configuración Sistema', route: '/admin/settings' },
    { id: '3', title: 'Reportes', route: '/admin/reports' },
  ];

  return (
    <ProtectedRoute requiredRole="Admin">
      <View style={styles.container}>
        <Text style={styles.title}>Panel de Administración</Text>
        <Text style={styles.subtitle}>Admin: {user?.name}</Text>

        <FlatList
          data={adminActions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.actionCard}>
              <Text style={styles.actionTitle}>{item.title}</Text>
            </View>
          )}
        />
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
```

## Ejemplo 3: Layout Protegido con Múltiples Pantallas

Protege un grupo completo de pantallas.

```typescript
// app/(protected)/_layout.tsx
import { Stack } from 'expo-router';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="dashboard"
          options={{ title: 'Dashboard' }}
        />
        <Stack.Screen
          name="profile"
          options={{ title: 'Perfil' }}
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

## Ejemplo 4: Componente con Lógica Condicional por Rol

Muestra diferentes contenidos según el rol del usuario.

```typescript
// components/DashboardContent.tsx
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/lib/hooks/useAuth';

export const DashboardContent = () => {
  const { user, isAdmin, isManager, isUser } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hola, {user?.name}</Text>

      {isAdmin && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Panel de Administrador</Text>
          <Text style={styles.sectionText}>
            Tienes acceso completo a todas las funciones del sistema.
          </Text>
        </View>
      )}

      {isManager && !isAdmin && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Panel de Manager</Text>
          <Text style={styles.sectionText}>
            Puedes gestionar usuarios y ver reportes.
          </Text>
        </View>
      )}

      {isUser && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Panel de Usuario</Text>
          <Text style={styles.sectionText}>
            Bienvenido a tu panel personal.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
});
```

## Ejemplo 5: Menú de Navegación con Autenticación

```typescript
// components/NavigationMenu.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@/lib/hooks/useAuth';
import { router } from 'expo-router';
import { Home, User, Settings, Shield, LogOut } from 'lucide-react-native';

export const NavigationMenu = () => {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/login')}
        >
          <User size={20} color="#3b82f6" />
          <Text style={styles.menuText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userRole}>{user?.type}</Text>
      </View>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push('/')}
      >
        <Home size={20} color="#3b82f6" />
        <Text style={styles.menuText}>Inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push('/dashboard')}
      >
        <User size={20} color="#3b82f6" />
        <Text style={styles.menuText}>Dashboard</Text>
      </TouchableOpacity>

      {isAdmin && (
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/admin')}
        >
          <Shield size={20} color="#ef4444" />
          <Text style={styles.menuText}>Admin</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push('/settings')}
      >
        <Settings size={20} color="#3b82f6" />
        <Text style={styles.menuText}>Configuración</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, styles.logoutItem]}
        onPress={logout}
      >
        <LogOut size={20} color="#ef4444" />
        <Text style={[styles.menuText, styles.logoutText]}>
          Cerrar Sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  userInfo: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 12,
    color: '#1e293b',
  },
  logoutItem: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    color: '#ef4444',
  },
});
```

## Ejemplo 6: Hook Personalizado para Peticiones API

```typescript
// lib/hooks/useAuthenticatedFetch.ts
import { useAuth } from '@/lib/hooks/useAuth';
import { useCallback } from 'react';

export const useAuthenticatedFetch = () => {
  const { token, logout } = useAuth();

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        await logout();
        throw new Error('Sesión expirada');
      }

      if (!response.ok) {
        throw new Error('Error en la petición');
      }

      return response.json();
    },
    [token, logout]
  );

  return { authenticatedFetch };
};

// Uso
import { useAuthenticatedFetch } from '@/lib/hooks/useAuthenticatedFetch';

function DataScreen() {
  const { authenticatedFetch } = useAuthenticatedFetch();

  const fetchData = async () => {
    try {
      const data = await authenticatedFetch('/api/protected-data');
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TouchableOpacity onPress={fetchData}>
      <Text>Cargar Datos</Text>
    </TouchableOpacity>
  );
}
```

## Ejemplo 7: Redirección Automática

```typescript
// app/index.tsx
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/lib/hooks/useAuth';
import { router } from 'expo-router';

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}
```

## Ejemplo 8: Formulario para Crear Usuario (Solo Managers/Admins)

```typescript
// app/admin/create-user.tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';

export default function CreateUserScreen() {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'User',
  });

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Usuario creado exitosamente');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error al crear usuario');
    }
  };

  return (
    <ProtectedRoute requiredRole="Manager">
      <View style={styles.container}>
        <Text style={styles.title}>Crear Nuevo Usuario</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateUser}
        >
          <LinearGradient
            colors={['#3b82f6', '#1e40af']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Crear Usuario</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
```

## Resumen

Estos ejemplos muestran cómo:

1. Proteger pantallas individuales
2. Proteger layouts completos
3. Mostrar contenido condicional por rol
4. Crear menús de navegación dinámicos
5. Hacer peticiones autenticadas a APIs
6. Implementar redirección automática
7. Crear formularios protegidos por rol

Para más detalles, consulta:
- `docs/PROTECTED_ROUTES.md` - Guía completa de rutas protegidas
- `docs/AUTH_INTEGRATION.md` - Documentación de integración
- `auth_api.md` - Documentación de la API
