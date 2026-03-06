# Jerarquía de Roles Basada en Pesos Matemáticos (`typeWeight`)

En aplicaciones empresariales Multi-Tenant, el manejo de permisos basado exclusivamente en strings (ej. `if (role === 'Admin' || role === 'Manager')`) rápidamente se vuelve insostenible a medida que el sistema crece. Para solucionar esto y mantener la integridad del Directorio de Usuarios de manera robusta y de bajo costo algorítmico, implementamos una **Estrategia de Seguridad basada en Pesos (Weights)**.

## 🔢 La Escala Matemática
Se ha asignado un valor entero constante a cada rol dentro del ecosistema, ordenado de mayor a menor privilegio:

* **SuperAdmin (Sanjigen) = 4**
* **Admin = 3**
* **Manager = 2**
* **User = 1**
* *Desconocido / Sin Sesión = 0*

## ¿Cómo Funciona la Regla de Edición?
Para determinar si un usuario logueado *(Actor)* tiene permitido modificar, eliminar o desactivar a otro usuario de la base de datos *(Objetivo)*, simplemente evaluamos matemáticamente los pesos mediante una función helper `canEditUser(target)`:

1. **Auto-Preservación Absoluta:** `if (Actor.id === Objetivo.id) return false;`
   -  Es imposible para un usuario desactivarse o eliminarse a sí mismo, eliminando el riesgo de dejar una empresa sin administradores por accidente o suicidio digital.

2. **Supremacía:** `if (Actor.weight === 4) return true;`
   - Los dueños de la plataforma (Sanjigen) pueden modificar cualquier cuenta del sistema.

3. **Limitación de Jerarquía Menor o Igual:** `if (Actor.weight >= Objetivo.weight) return true;`
   - Un Administrador (3) puede modificar perfiles Administradores (3), Managers (2) y Usuarios (1). Sin embargo, un Administrador (3) jamás logrará que su peso sea matemáticamente mayor o igual a un SuperAdmin (4). 
   - Un Manager (2) está matemáticamente encapsulado a modificar únicamente a sus compañeros Managers (2) e inferiores (1). Nunca podrá tocar la tarjeta de un Admin (3) ni de Sanjigen (4).

## 🚀 Ventajas de la Estrategia Matemática
- **Extensibilidad a Futuro:** Si mañana la empresa demanda crear un "Manager Financiero" que tiene más poder que un Manager Normal pero menos que un Admin, simplemente le asignamos un peso de `2.5`. La lógica del código base (los `>` y `<`) funcionará perfectamente de manera inmediata, sin necesidad de reprogramar cientos de condicionales.
- **Rendimiento UI:** Pintar listas y filtros (ej. ocultar el botón *Eliminar* a lo largo de un FlatList de 5,000 usuarios) se vuelve extremadamente rápido usando operaciones aritméticas simples que el CPU puede calcular instantáneamente.
- **Seguridad Inviolable:** Al combinarse con las Restricciones de Redirección (Dashboard Boundaries), este sistema impide que un atacante inyecte a través del Frontend rutas no correspondientes a su nivel operacional.

## ⚠️ Desventajas y Consideraciones
Aunque es un sistema eficiente, requiere disciplina en su mantenimiento:
- **Rigidez Inicial:** Si se asignan pesos sin espacio entre ellos (ej. 1, 2, 3), insertar un rol intermedio requiere reasignar los valores. *Solución: Usar saltos amplios o permitir decimales como implementamos aquí.*
- **Abstracción:** Para un desarrollador nuevo, no es obvio por qué un `3` puede editar a un `2`. *Solución: Esta documentación y el uso de constantes descriptivas en el código.*
- **Dependencia del Backend:** El Frontend puede ocultar botones, pero el Backend DEBE validar estos mismos pesos en cada endpoint para evitar ataques de manipulación de API (Insecure Direct Object Reference).
