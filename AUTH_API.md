# API de Autenticación

## Configuración

### Variables de Entorno Requeridas

Agrega estas variables a tu archivo `.env`:

```env
# JWT Secret (cambia por una clave segura en producción)
JWT_SECRET=tu-clave-super-secreta-aqui

# Base de datos (ya configurada)
DATABASE_URL=tu-url-de-neon-database
```

### Base de Datos

El sistema utiliza dos tablas principales:

1. **Tabla `usuario`**: Almacena la información de los usuarios
2. **Tabla `user_type`**: Almacena los tipos de usuario disponibles

**Estructura de la tabla `usuario`:**

- `id` (int, primary key)
- `name` (varchar)
- `email` (varchar, unique)
- `password` (varchar, hasheada con bcrypt)
- `active` (boolean)
- `type_id` (int, foreign key a user_type)

**Estructura de la tabla `user_type`:**

- `id` (int, primary key)
- `type` (varchar, unique)

**Tipos de usuario por defecto:**

- Admin
- Manager
- User

> **Nota**: El sistema es dinámico, puedes agregar nuevos tipos de usuario directamente en la tabla `user_type` sin modificar el código.

## Endpoints Disponibles

### 1. Registro de Usuario

**POST** `/auth/register`

Registra un nuevo usuario en el sistema. **Este endpoint es privado y requiere permisos de Manager o superior.**

> **⚠️ Importante**: Solo usuarios con nivel Manager o Admin pueden crear nuevas cuentas.

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**

```json
{
	"email": "usuario@ejemplo.com",
	"password": "contraseña123",
	"name": "Juan Pérez",
	"type": "Admin"
}
```

> **Nota**: El campo `type` debe ser uno de los tipos disponibles en la tabla `user_type` (Admin, Manager, User, etc.)

**Respuesta Exitosa (201):**

```json
{
	"success": true,
	"message": "Usuario registrado exitosamente",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"user": {
		"id": 1,
		"email": "usuario@ejemplo.com",
		"name": "Juan Pérez",
		"type": "Admin",
		"active": true
	}
}
```

**Respuesta de Error (400):**

```json
{
	"success": false,
	"message": "El usuario ya existe con este email"
}
```

**Otros errores posibles:**

- `"Token de autorización requerido"` - No se proporcionó token de autenticación (401)
- `"Token inválido o expirado"` - Token de autenticación inválido (401)
- `"Permisos insuficientes. Se requiere nivel Manager o superior"` - Usuario sin permisos (403)
- `"Datos Requeridos Faltantes"` - Faltan campos obligatorios (400)
- `"La contraseña invalida"` - Contraseña menor a 6 caracteres (400)
- `"Tipo de usuario inválido"` - El tipo especificado no existe en la tabla user_type (400)

### 2. Login de Usuario

**POST** `/auth/login`

Autentica un usuario existente.

**Body:**

```json
{
	"email": "usuario@ejemplo.com",
	"password": "contraseña123"
}
```

**Respuesta Exitosa (200):**

```json
{
	"success": true,
	"message": "Login exitoso",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"user": {
		"id": 1,
		"email": "usuario@ejemplo.com",
		"name": "Juan Pérez",
		"type": "Admin",
		"active": true
	}
}
```

**Respuesta de Error (401):**

```json
{
	"success": false,
	"message": "Credenciales inválidas"
}
```

### 3. Verificar Token

**POST** `/auth/verify`

Verifica si un token es válido y obtiene información del usuario.

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta Exitosa (200):**

```json
{
	"success": true,
	"message": "Token válido",
	"user": {
		"id": 1,
		"email": "usuario@ejemplo.com",
		"name": "Juan Pérez",
		"type": "Admin",
		"active": true
	}
}
```

### 4. Obtener Perfil

**GET** `/auth/profile`

Obtiene el perfil del usuario autenticado.

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta Exitosa (200):**

```json
{
	"success": true,
	"message": "Perfil obtenido exitosamente",
	"user": {
		"id": 1,
		"email": "usuario@ejemplo.com",
		"name": "Juan Pérez",
		"type": "Admin",
		"active": true
	}
}
```

### 5. Logout

**POST** `/auth/logout`

Cierra la sesión del usuario (el token se invalida del lado del cliente).

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta Exitosa (200):**

```json
{
	"success": true,
	"message": "Logout exitoso"
}
```

## Middleware de Autenticación

### Proteger Rutas

Para proteger una ruta, importa y usa el middleware `authenticateToken`:

```typescript
import { authenticateToken } from "../middleware/auth.middleware.js";

// Ruta protegida
router.get("/protected-route", authenticateToken, (req, res) => {
	// req.user contiene la información del usuario autenticado
	res.json({ user: req.user });
});
```

### Proteger Rutas con Permisos Específicos

Para rutas que requieren permisos de Manager o superior:

```typescript
import { authenticateToken, requireManagerOrHigher } from "../middleware/auth.middleware.js";

// Ruta que requiere permisos de Manager o superior
router.post("/admin-only-route", authenticateToken, requireManagerOrHigher, (req, res) => {
	// Solo usuarios con tipo "Admin" o "Manager" pueden acceder
	res.json({ message: "Acceso autorizado", user: req.user });
});
```

### Middleware Disponibles

- **`authenticateToken`**: Verifica que el usuario esté autenticado
- **`requireManagerOrHigher`**: Verifica que el usuario tenga permisos de Manager o superior (debe usarse después de `authenticateToken`)
- **`optionalAuth`**: Autenticación opcional (no falla si no hay token)

### Autenticación Opcional

Para rutas que pueden funcionar con o sin autenticación:

```typescript
import { optionalAuth } from "../middleware/auth.middleware.js";

router.get("/optional-auth-route", optionalAuth, (req, res) => {
	if (req.user) {
		// Usuario autenticado
		res.json({ message: "Hola usuario autenticado", user: req.user });
	} else {
		// Usuario no autenticado
		res.json({ message: "Hola usuario anónimo" });
	}
});
```

## Ejemplos de Uso con JavaScript/Fetch

### Registro (Requiere autenticación de Manager o superior)

```javascript
const registerUser = async (userData, authToken) => {
	const response = await fetch("/auth/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${authToken}`,
		},
		body: JSON.stringify(userData),
	});

	return await response.json();
};

// Uso (requiere que el usuario esté autenticado como Manager o Admin)
const token = localStorage.getItem("token"); // Token del usuario Manager/Admin
const result = await registerUser(
	{
		email: "nuevo@ejemplo.com",
		password: "contraseña123",
		name: "Juan Pérez",
		type: "User", // El Manager puede crear usuarios de cualquier tipo
	},
	token
);
```

### Login

```javascript
const loginUser = async (credentials) => {
	const response = await fetch("/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(credentials),
	});

	const data = await response.json();

	if (data.success) {
		// Guardar token en localStorage
		localStorage.setItem("token", data.token);
	}

	return data;
};
```

### Petición Autenticada

```javascript
const getProfile = async () => {
	const token = localStorage.getItem("token");

	const response = await fetch("/auth/profile", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	return await response.json();
};
```

## Seguridad

### Características Implementadas

- ✅ **Contraseñas hasheadas** con bcrypt (10 salt rounds)
- ✅ **JWT tokens** con expiración (24 horas)
- ✅ **Sistema de tipos de usuario dinámico** - Los tipos se obtienen de la base de datos
- ✅ **Validación de entrada** en todos los endpoints
- ✅ **Manejo de errores** consistente
- ✅ **CORS** configurado

### Recomendaciones Adicionales

1. **Cambiar JWT_SECRET** en producción por una clave segura
2. **Implementar rate limiting** para prevenir ataques de fuerza bruta
3. **Agregar validación de email** más estricta
4. **Considerar refresh tokens** para mayor seguridad
5. **Implementar logging** de intentos de login fallidos

## Estructura de Archivos

```
api/
├── controllers/
│   └── auth.controller.ts      # Controladores de autenticación
├── middleware/
│   └── auth.middleware.ts      # Middleware de autenticación
├── routes/
│   └── auth.routes.ts          # Rutas de autenticación
├── services/
│   ├── auth.service.ts         # Lógica de negocio de autenticación
│   └── database.service.ts     # Servicio de conexión a base de datos
└── AUTH_API.md                 # Esta documentación
```

## Ventajas del Sistema Dinámico

### ✅ **Escalabilidad**

- Puedes agregar nuevos tipos de usuario sin modificar código
- Solo necesitas insertar un nuevo registro en la tabla `user_type`

### ✅ **Mantenimiento**

- No hay mapeos hardcodeados que mantener
- Los tipos se validan automáticamente contra la base de datos

### ✅ **Flexibilidad**

- El sistema se adapta automáticamente a nuevos tipos
- No requiere despliegues para agregar tipos de usuario

### Ejemplo: Agregar un nuevo tipo de usuario

```sql
-- Solo necesitas ejecutar esta consulta en tu base de datos
INSERT INTO user_type (type) VALUES ('Supervisor');
```

¡Y listo! El sistema automáticamente reconocerá el nuevo tipo "Supervisor" sin necesidad de modificar código.

## Flujo de Creación de Usuarios

### 🔐 **Proceso Seguro de Registro**

Dado que el endpoint de registro es privado, el flujo típico es:

1. **Usuario Admin/Manager se autentica**:

   ```javascript
   const loginResult = await loginUser({
   	email: "admin@sanjigen.cl",
   	password: "admin123",
   });
   ```

2. **Admin/Manager crea nuevos usuarios**:

   ```javascript
   const newUser = await registerUser(
   	{
   		email: "nuevo@empresa.com",
   		password: "temp123",
   		name: "Nuevo Usuario",
   		type: "User",
   	},
   	loginResult.token
   );
   ```

3. **El nuevo usuario puede hacer login**:
   ```javascript
   const userLogin = await loginUser({
   	email: "nuevo@empresa.com",
   	password: "temp123",
   });
   ```

### 🛡️ **Beneficios de Seguridad**

- ✅ **Control de acceso**: Solo personal autorizado puede crear cuentas
- ✅ **Auditoría**: Se puede rastrear quién creó cada usuario
- ✅ **Prevención de spam**: Evita registros masivos no autorizados
- ✅ **Cumplimiento**: Cumple con políticas de seguridad empresariales
