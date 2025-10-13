# API de Servicios Marítimos

## Configuración

### Variables de Entorno Requeridas

```env
# Base de datos
DATABASE_URL=tu-url-de-neon-database

# ZIM API (para itinerarios reales)
ZIM_CLIENT_ID=tu-zim-client-id
ZIM_CLIENT_SECRET=tu-zim-client-secret
OCP_APIM_SUBSCRIPTION_KEY=tu-ocp-apim-key

# Email service
RESEND_API_KEY=tu-resend-api-key

# JWT (para autenticación)
JWT_SECRET=tu-clave-super-secreta-aqui
```

## Endpoints Disponibles

### 1. Búsqueda de Itinerarios

#### 1.1 Itinerarios ZIM

**GET** `/itinerary/Zim`

Busca itinerarios de la naviera ZIM entre dos puertos.

**Query Parameters:**

- `origin` (string, requerido): Código del puerto de origen
- `destination` (string, requerido): Código del puerto de destino

**Ejemplo:**

```
GET /itinerary/Zim?origin=USNYC&destination=CLVAP
```

**Respuesta Exitosa (200):**

```json
{
	"data": [
		{
			"vesselName": "ZIM CONSTANZA",
			"voyage": "001E",
			"originPort": "USNYC",
			"destinationPort": "CLVAP",
			"departureDate": "2024-01-15T10:00:00Z",
			"arrivalDate": "2024-01-25T14:00:00Z",
			"transitTime": "10 days"
		}
	]
}
```

#### 1.2 Itinerarios Hapag-Lloyd

**GET** `/itinerary/Hapag`

Busca itinerarios de Hapag-Lloyd (datos mock).

**Query Parameters:**

- `origin` (string, requerido): Código del puerto de origen
- `destination` (string, requerido): Código del puerto de destino

**Ejemplo:**

```
GET /itinerary/Hapag?origin=DEHAM&destination=USNYC
```

#### 1.3 Itinerarios MSC

**GET** `/itinerary/MSC`

Busca itinerarios de MSC (datos mock).

**Query Parameters:**

- `origin` (string, requerido): Código del puerto de origen
- `destination` (string, requerido): Código del puerto de destino

**Ejemplo:**

```
GET /itinerary/MSC?origin=ITGOA&destination=USLAX
```

#### 1.4 Itinerarios Maersk

**GET** `/itinerary/Maersk`

Busca itinerarios de Maersk (datos mock).

**Query Parameters:**

- `origin` (string, requerido): Código del puerto de origen
- `destination` (string, requerido): Código del puerto de destino

**Ejemplo:**

```
GET /itinerary/Maersk?origin=DKCPH&destination=CNQIN
```

### 2. Tracking de Contenedores

#### 2.1 Tracking ZIM

**GET** `/tracking/Zim`

Rastrea un contenedor de ZIM (datos mock).

**Query Parameters:**

- `trackingNumber` (string, requerido): Número de tracking del contenedor

**Ejemplo:**

```
GET /tracking/Zim?trackingNumber=ZIMU1234567
```

**Respuesta Exitosa (200):**

```json
{
	"containerNumber": "ZIMU1234567",
	"status": "In Transit",
	"currentLocation": "Port of Los Angeles",
	"lastUpdate": "2024-01-15T10:30:00Z",
	"events": [
		{
			"date": "2024-01-10T08:00:00Z",
			"location": "Port of Shanghai",
			"status": "Loaded",
			"description": "Container loaded on vessel"
		},
		{
			"date": "2024-01-15T10:30:00Z",
			"location": "Port of Los Angeles",
			"status": "In Transit",
			"description": "Vessel arrived at port"
		}
	]
}
```

#### 2.2 Tracking Hapag-Lloyd

**GET** `/tracking/Hapag`

Rastrea un contenedor de Hapag-Lloyd (datos mock).

**Query Parameters:**

- `trackingNumber` (string, requerido): Número de tracking del contenedor

**Ejemplo:**

```
GET /tracking/Hapag?trackingNumber=HLBU1234567
```

### 3. Servicios de Email

#### 3.1 Registro de Usuario

**POST** `/email/register`

Envía un email de solicitud de registro al administrador.

**Body:**

```json
{
	"firstName": "Juan",
	"lastName": "Pérez",
	"company": "Empresa ABC",
	"email": "juan.perez@empresa.com"
}
```

**Respuesta Exitosa (200):**

```json
{
	"message": "Email enviado correctamente",
	"data": {
		"firstName": "Juan",
		"lastName": "Pérez",
		"company": "Empresa ABC",
		"email": "juan.perez@empresa.com"
	}
}
```

**Respuesta de Error (400):**

```json
{
	"error": "Datos Obligatorios faltantes"
}
```

### 4. Búsquedas Auxiliares

#### 4.1 Búsqueda de Códigos de País

**GET** `/countrySearch`

Busca códigos de países por código.

**Query Parameters:**

- `country_code` (string, requerido): Código del país a buscar

**Ejemplo:**

```
GET /countrySearch?country_code=US
```

**Respuesta Exitosa (200):**

```json
[
	{
		"country_code": "US",
		"country_name": "United States",
		"iso_code": "840"
	}
]
```

#### 4.2 Búsqueda de Puertos

**GET** `/portSearch`

Busca puertos marítimos por nombre.

**Query Parameters:**

- `name` (string, requerido): Nombre del puerto (mínimo 3 caracteres)

**Ejemplo:**

```
GET /portSearch?name=New York
```

**Respuesta Exitosa (200):**

```json
[
	{
		"port_code": "USNYC",
		"name": "New York",
		"country": "United States",
		"coordinates": {
			"lat": 40.6892,
			"lng": -74.0445
		}
	}
]
```

**Respuesta de Error (400):**

```json
"La busqueda debe ser de mas de 2 caracteres"
```

## Ejemplos de Uso con JavaScript/Fetch

### Búsqueda de Itinerarios

```javascript
const searchItinerary = async (company, origin, destination) => {
	const response = await fetch(`/itinerary/${company}?origin=${origin}&destination=${destination}`);
	return await response.json();
};

// Ejemplos de uso
const zimItinerary = await searchItinerary("Zim", "USNYC", "CLVAP");
const hapagItinerary = await searchItinerary("Hapag", "DEHAM", "USNYC");
```

### Tracking de Contenedores

```javascript
const trackContainer = async (company, trackingNumber) => {
	const response = await fetch(`/tracking/${company}?trackingNumber=${trackingNumber}`);
	return await response.json();
};

// Ejemplos de uso
const zimTracking = await trackContainer("Zim", "ZIMU1234567");
const hapagTracking = await trackContainer("Hapag", "HLBU1234567");
```

### Envío de Email de Registro

```javascript
const sendRegisterEmail = async (userData) => {
	const response = await fetch("/email/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userData),
	});

	return await response.json();
};

// Uso
const result = await sendRegisterEmail({
	firstName: "Juan",
	lastName: "Pérez",
	company: "Empresa ABC",
	email: "juan.perez@empresa.com",
});
```

### Búsquedas Auxiliares

```javascript
const searchCountries = async (countryCode) => {
	const response = await fetch(`/countrySearch?country_code=${countryCode}`);
	return await response.json();
};

const searchPorts = async (portName) => {
	const response = await fetch(`/portSearch?name=${portName}`);
	return await response.json();
};

// Ejemplos de uso
const countries = await searchCountries("US");
const ports = await searchPorts("New York");
```

## Códigos de Estado HTTP

- **200**: Solicitud exitosa
- **400**: Error en los parámetros de entrada
- **401**: No autorizado (solo para rutas protegidas)
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

## Notas Importantes

### Datos Mock vs Reales

- **ZIM Itinerarios**: Utiliza la API real de ZIM (requiere credenciales)
- **Otras navieras**: Utilizan datos mock para desarrollo
- **Tracking**: Todos los endpoints de tracking usan datos mock

### CORS

La API está configurada para aceptar requests desde:

- `https://logisticaint-app.vercel.app/`
- `http://localhost:8081` (desarrollo React Native)
- `https://logisticaint-app.vercel.app`

### Seguridad

- ✅ **Helmet** configurado para seguridad HTTP
- ✅ **CORS** configurado apropiadamente
- ✅ **Validación de entrada** en todos los endpoints
- ✅ **Manejo de errores** consistente

## Estructura de Archivos

```
api/
├── controllers/
│   ├── itinerary.controller.ts    # Controladores de itinerarios
│   ├── tracking.controller.ts     # Controladores de tracking
│   ├── mail.controller.ts         # Controladores de email
│   └── auth.controller.ts         # Controladores de autenticación
├── services/
│   ├── itinerary.service.ts       # Lógica de itinerarios
│   ├── tracking.service.ts        # Lógica de tracking
│   ├── mail.service.ts            # Lógica de email
│   └── auth.service.ts            # Lógica de autenticación
├── routes/
│   ├── itenirary.routes.ts        # Rutas de itinerarios
│   ├── tracking.routes.ts         # Rutas de tracking
│   ├── mail.routes.ts             # Rutas de email
│   └── auth.routes.ts             # Rutas de autenticación
├── middleware/
│   └── auth.middleware.ts         # Middleware de autenticación
├── utils/
│   └── dateUtils.ts               # Utilidades de fecha
├── mockData/                      # Datos mock para desarrollo
├── *.js                          # Archivos mock de navieras
└── index.ts                       # Punto de entrada de la aplicación
```

## Próximas Mejoras

1. **Integración con APIs reales** de todas las navieras
2. **Rate limiting** para prevenir abuso
3. **Caché** para mejorar rendimiento
4. **Logging** estructurado
5. **Métricas** y monitoreo
6. **Documentación OpenAPI/Swagger**
