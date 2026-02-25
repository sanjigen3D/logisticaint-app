# API Master Documentation - Logistics App

Esta es la documentación centralizada de todos los endpoints disponibles en la API del sistema logístico.

---

## 🔒 1. Autenticación y Autorización

Todas las rutas privadas requieren un token JWT enviado en el header:
`Authorization: Bearer <tu_token>`

### Endpoints de Auth

#### **Login**
Autentica un usuario y devuelve un token.
* **POST** `/auth/login`
* **Body:**
  ```json
  {
      "email": "usuario@ejemplo.com",
      "password": "contraseña123"
  }
  ```

#### **Registro (Solo Admin/Manager)**
Crea un nuevo usuario desde el módulo de autenticación. (También puedes usar el CRUD de Users).
* **POST** `/auth/register`
* **Body:**
  ```json
  {
      "email": "nuevo@ejemplo.com",
      "password": "contraseña123",
      "name": "Juan Pérez",
      "type": "User",
      "company_id": 1
  }
  ```

#### **Verificar Token**
* **POST** `/auth/verify`

#### **Obtener Perfil Actual**
* **GET** `/auth/profile`

#### **Logout**
* **POST** `/auth/logout`

---

## 👥 2. Gestión de Usuarios (Users CRUD)

**Importante:** Estos endpoints requieren permisos de **Manager o superior** (`Admin`).
Las eliminaciones son **lógicas** (Soft Delete), cambiando el estado `active` a `false`.

* **Crear Usuario**: `POST /users`
  * Body: `name`, `email`, `password`, `type_id`, `active`, `company_id`
* **Obtener Todos**: `GET /users`
* **Obtener por ID**: `GET /users/:id`
* **Obtener por ID de Empresa**: `GET /users/company/:companyId`
* **Actualizar Usuario**: `PUT /users/:id`
  * Body (opcional): `name`, `email`, `password`, `type_id`, `active`, `company_id`
* **Desactivar Usuario (Soft Delete)**: `DELETE /users/:id`

Ejemplo GET /users/:id:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin Principal",
    "email": "admin@empresa.com",
    "active": true,
    "type": "Admin",
    "company_id": 1
  }
}
```

---

## 🏢 3. Gestión de Empresas (Companies CRUD)

La creación de Empresas y Contactos ha sido **separada**. `POST /companies` solo crea la Empresa. Los contactos asociados se adjuntan en las respuestas `GET`.

* **Crear Empresa**: `POST /companies`
  * Body: `name`, `razon_social`, `rut`, `direccion`, `alias`
* **Obtener Todas**: `GET /companies` (Retorna empresas + un array `contacts` con sus contactos asociados).
* **Obtener por ID**: `GET /companies/:id`
* **Actualizar Empresa**: `PUT /companies/:id`
  * Body (opcionales): `name`, `razon_social`, `rut`, `direccion`, `alias`
* **Eliminar Empresa**: `DELETE /companies/:id` (Elimina la empresa y físicamente sus contactos asociados).

Ejemplo GET /companies/:id:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Nombre de la Empresa",
    "razon_social": "Razón Social S.A.",
    "rut": "12.345.678-9",
    "direccion": "Calle Falsa 123",
    "alias": "EmpresaAlias",
    "contacts": [
      {
        "id": 1,
        "name": "Juan Contacto",
        "phone": "987654321",
        "email": "juan@empresa.com"
      }
    ]
  }
}
```

---

## 📞 4. Gestión de Contactos (Contacts CRUD)

Un contacto pertenece obligatoriamente a una Empresa (`company_id`).

* **Crear Contacto**: `POST /contacts`
  * Body: `name`, `phone`, `email`, `company_id` (ID de la empresa existente).
* **Obtener Todos**: `GET /contacts`
* **Obtener por ID**: `GET /contacts/:id`
* **Actualizar Contacto**: `PUT /contacts/:id`
  * Body (opcionales): `name`, `phone`, `email`, `company_id`
* **Eliminar Contacto**: `DELETE /contacts/:id`

Ejemplo POST /contacts:
```json
{
  "name": "Pedro Logística",
  "phone": "+56912345678",
  "email": "pedro@otraempresa.com",
  "company_id": 2
}
```

---

## 🚢 5. Servicios Marítimos (Itinerarios y Tracking)

### Búsqueda de Itinerarios
* **ZIM (Real)**: `GET /itinerary/Zim?origin=USNYC&destination=CLVAP`
* **Hapag-Lloyd (Mock)**: `GET /itinerary/Hapag?origin=DEHAM&destination=USNYC`
* **MSC (Mock)**: `GET /itinerary/MSC?origin=ITGOA&destination=USLAX`
* **Maersk (Mock)**: `GET /itinerary/Maersk?origin=DKCPH&destination=CNQIN`

### Tracking de Contenedores
* **ZIM (Mock)**: `GET /tracking/Zim?trackingNumber=ZIMU1234567`
* **Hapag-Lloyd (Mock)**: `GET /tracking/Hapag?trackingNumber=HLBU1234567`

---

## 🛠️ 6. Servicios Adicionales

### Emails
* **Solicitud de Registro**: `POST /email/register`
  * Body: `firstName`, `lastName`, `company`, `email`

### Búsquedas Auxiliares de Ubicación
* **Buscar Códigos de País**: `GET /countrySearch?country_code=US`
* **Buscar Puertos Marítimos**: `GET /portSearch?name=New York`

---

## ⚠️ Manejo de Errores (Zod)

Todas las rutas de creación (`POST`) y actualización (`PUT`) validan los datos. En caso de error, devuelven HTTP 400:

```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "email",
      "message": "Email de contacto inválido"
    }
  ]
}
```
