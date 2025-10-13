# Configuración de Variables de Entorno

## Variables Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000

# Database Configuration (if needed for direct access)
DATABASE_URL=your-database-url-here

# JWT Secret (for server-side, not needed in client)
JWT_SECRET=your-jwt-secret-here
```

## Explicación de Variables

### `EXPO_PUBLIC_API_URL`
- **Descripción**: URL base de tu API de autenticación
- **Ejemplo**: `http://localhost:3000` (desarrollo) o `https://tu-api.com` (producción)
- **Requerido**: Sí
- **Nota**: El prefijo `EXPO_PUBLIC_` es necesario para que la variable esté disponible en el cliente

### `DATABASE_URL`
- **Descripción**: URL de conexión a la base de datos (solo si necesitas acceso directo desde el cliente)
- **Ejemplo**: `postgresql://user:password@localhost:5432/database`
- **Requerido**: No (solo si usas acceso directo a BD desde el cliente)

### `JWT_SECRET`
- **Descripción**: Clave secreta para firmar JWT tokens (solo para el servidor)
- **Ejemplo**: `mi-clave-super-secreta-123`
- **Requerido**: No (solo en el servidor)

## Configuración por Entorno

### Desarrollo
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Producción
```env
EXPO_PUBLIC_API_URL=https://tu-api-produccion.com
```

## Notas Importantes

1. **Nunca commitees el archivo `.env`** - está en `.gitignore`
2. **Usa `EXPO_PUBLIC_`** para variables que necesites en el cliente
3. **Las variables sin `EXPO_PUBLIC_`** solo están disponibles en el servidor
4. **Cambia las URLs** según tu entorno de desarrollo/producción
