# Guía de Configuración: Google Cloud Storage (GCS)

Esta guía detalla los pasos para configurar un bucket en Google Cloud Storage para el almacenamiento de archivos de documentos, con un enfoque en la seguridad y organización por empresa.

## 1. Crear un Proyecto en Google Cloud
Si aún no tienes un proyecto:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Haz clic en el selector de proyectos (arriba a la izquierda) y selecciona **Nuevo Proyecto**.
3. Asígnale un nombre (ej. `logistica-storage`) y créalo.

## 2. Crear el Bucket de Almacenamiento
1. En el menú hamburguesa (izquierda), busca **Cloud Storage** > **Buckets**.
2. Haz clic en **CREAR**.
3. **Nombre del bucket:** Debe ser único globalmente (ej. `logisticaint-documents-prod`).
4. **Tipo de ubicación:** 
   - Selecciona **Region** para menor latencia y costo (ej. `us-east1` o la más cercana a tus usuarios).
5. **Clase de almacenamiento:** Selecciona **Standard** (ideal para acceso frecuente a fotos/PDFs).
6. **Control de acceso:**
   - Selecciona **Uniforme** (Recomendado por Google para simplificar permisos).
   - Asegúrate de que "Aplicar la prevención del acceso público" esté **marcado** inicialmente por seguridad.
7. Haz clic en **CREAR**.

## 3. Configuración de Acceso y Claves (Lectura/Escritura)

A diferencia de AWS IAM Users, en Google Cloud usamos **Service Accounts**.

### Crear la Cuenta de Servicio
1. Ve a **IAM y administración** > **Cuentas de servicio**.
2. Haz clic en **CREAR CUENTA DE SERVICIO**.
3. **Nombre:** `gcs-app-connector`.
4. **Permisos (Roles):**
   - Agrega el rol: `Storage Object Admin` (permite leer, escribir y borrar objetos en el bucket).
   - *Tip:* Si quieres ser más restrictivo, puedes usar `Storage Object Creator` para subir y `Storage Object Viewer` para leer.
5. Finaliza la creación.

### Generar la Clave JSON
1. En la lista de Cuentas de Servicio, haz clic en la que acabas de crear.
2. Ve a la pestaña **CLAVES**.
3. Haz clic en **AGREGAR CLAVE** > **Crear clave nueva**.
4. Selecciona el formato **JSON** y descárgalo.
   > [!CAUTION]
   > Este archivo JSON es tu credencial de acceso. **NUNCA** lo subas a GitHub. Úsalo para configurar tus variables de entorno.

## 4. Estructura de Carpetas e Identidad de Empresa

Para asegurar que una empresa solo vea sus propios documentos, la lógica debe implementarse tanto en la estructura como en la aplicación.

### Estructura sugerida
GCS no tiene "carpetas" reales, sino prefijos en los nombres de archivo. Se recomienda usar:
`gs://tu-bucket/[company_id]/[document_type]/nombre-archivo.pdf`

Ejemplos:
- `gs://bucket-app/empresa_123/facturas/bl-001.pdf`
- `gs://bucket-app/empresa_456/photos/contenedor-A1.jpg`

### Control de Acceso (Lógica de App)
Dado que el bucket es privado:
1. **Lectura:** La aplicación genera una **Signed URL** (URL firmada) temporal. Antes de generarla, el backend verifica en la base de datos que el usuario pertenezca a la `company_id` de esa carpeta.
2. **Escritura:**  **Subida Directa** (ver sección 6).

## 6. Estrategia de Subida: Evitando los límites de Vercel

Vercel tiene un límite estricto de **4.5 MB** para el cuerpo de las peticiones (payload) en Serverless Functions. Para subir PDFs pesados o fotos de alta resolución, **el archivo NO debe pasar por el backend**.

### El Flujo de "Direct Upload"

1. **Frontend**: El usuario selecciona el archivo. El front extrae el nombre y tipo (ej. `documento.pdf`, `application/pdf`).
2. **Frontend -> Backend**: Envía una petición "metadatos": *“Quiero subir un PDF de la Empresa A”*.
3. **Backend**: 
   - Valida que el usuario tenga permiso para esa Empresa A.
   - Usa la librería de Google Cloud para generar una **Signed URL de escritura** (PUT). Esta URL es temporal (vive ej. 5 minutos) y apunta directamente al bucket.
   - Devuelve la URL al Frontend.
4. **Frontend -> Google Storage**: El front hace un `PUT` directamente a la URL recibida enviando el archivo. 
   - **Resultado**: El archivo viaja del navegador del usuario a los servidores de Google.
5. **Frontend -> Backend**: Una vez terminada la subida (status 200), el front le avisa al backend: *“Ya subí el archivo, aquí está la ruta final para guardar en la DDBB”*.

### Beneficios
- **Cero carga en el servidor**: No consume CPU ni RAM procesando bytes de archivos.
- **Sin límites de peso**: Se pueden subir archivos de GBs si fuera necesario.
- **Seguridad**: El token de acceso solo sirve para ese archivo específico y expira rápido.
---
*Documentación generada por Luis Miño*
