### Documentación de Nuevos Endpoints CRUD

Este documento describe cómo utilizar los nuevos endpoints integrados para la gestión de Empresas y Usuarios.

---

### Autenticación

Todos los endpoints requieren un token JWT vigente enviado en el header de la solicitud:
`Authorization: Bearer <tu_token>`

#### **Manejo de Errores de Validación (Zod)**

A partir de la integración de Zod, las peticiones que no cumplan con el esquema devolverán un `400 Bad Request` con el
siguiente formato:

```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    {
      "field": "contact.email",
      "message": "Email de contacto inválido"
    },
    {
      "field": "name",
      "message": "El nombre de la empresa es requerido"
    }
  ]
}
```

---

### 1. Gestión de Empresas (Companies)

#### **Crear Empresa**

Crea una nueva empresa en la tabla `company` y su contacto asociado en la tabla `contact`.

* **URL:** `/companies`
* **Método:** `POST`
* **Cuerpo de la petición (JSON):**
  ```json
  {
    "name": "Nombre de la Empresa",
    "razon_social": "Razón Social S.A.",
    "rut": "12.345.678-9",
    "direccion": "Calle Falsa 123, Ciudad",
    "alias": "EmpresaAlias",
    "contact": {
      "name": "Nombre del Contacto",
      "phone": "987654321",
      "email": "contacto@empresa.com"
    }
  }
  ```
* **Respuesta Exitosa (201 Created):**
  ```json
  {
    "success": true,
    "message": "Empresa y contacto creados exitosamente",
    "data": {
      "companyId": 1,
      "contactId": 1
    }
  }
  ```

#### **Listar Empresas**

Obtiene todas las empresas con su información de contacto.

* **URL:** `/companies`
* **Método:** `GET`
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Nombre de la Empresa",
        "razon_social": "Razón Social S.A.",
        "rut": "12.345.678-9",
        "direccion": "Calle Falsa 123",
        "alias": "EmpresaAlias",
        "contact_name": "Nombre del Contacto",
        "contact_phone": "987654321",
        "contact_email": "contacto@empresa.com"
      }
    ]
  }
  ```

---

### 2. Gestión de Usuarios (Users)

Estos endpoints tienen reglas de jerarquía:

* **Admin:** Puede crear cualquier tipo de usuario (Admin, Manager, User).
* **Manager:** Solo puede crear usuarios de tipo Manager o User.
* **User:** No tiene acceso a estos endpoints.

#### **Tipos de Usuario (type_id):**

1. **Admin**
2. **Manager**
3. **User**

#### **Crear Usuario**

Crea un nuevo usuario en la tabla `usuario`.

* **URL:** `/users`
* **Método:** `POST`
* **Cuerpo de la petición (JSON):**
  ```json
  {
    "name": "Nuevo Usuario",
    "email": "usuario@correo.com",
    "password": "password123",
    "type_id": 2,
    "active": true
  }
  ```
* **Respuesta Exitosa (201 Created):**
  ```json
  {
    "success": true,
    "message": "Usuario creado exitosamente",
    "user": {
      "id": 5,
      "name": "Nuevo Usuario",
      "email": "usuario@correo.com",
      "active": true,
      "type_id": 2
    }
  }
  ```
* **Errores Comunes:**
    * `403 Forbidden`: Si un Manager intenta crear un Admin.
    * `400 Bad Request`: Si el email ya existe o faltan datos.

#### **Listar Usuarios**

Obtiene la lista de todos los usuarios registrados.

* **URL:** `/users`
* **Método:** `GET`
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Admin Principal",
        "email": "admin@empresa.com",
        "active": true,
        "type": "Admin"
      }
    ]
  }
  ```
