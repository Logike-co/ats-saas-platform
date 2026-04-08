# Guía de Simon Brown para la Documentación Técnica

## Recomendaciones Generales
- No debería ser un documento estático.
- Debe ser un punto de partida para explorar el código.
- Requiere pequeñas actualizaciones continuas.
- Está bien documentar un proyecto, pero también es importante documentar el producto.
- La documentación debería contar la historia de la arquitectura.

---

## Elementos a Documentar (Los 13 Puntos)

### 1. Contexto
- ¿De qué trata el sistema que se está documentando?
- Debe ser breve (una o dos páginas).
- Incluir un **Diagrama de Contexto** (ej. C4 Model).

### 2. Resumen funcional
- ¿Cuáles son las funciones principales que hace el sistema?
- Referenciar historias de usuario y wireframes relevantes.
- No debe ser muy extenso, es solo un resumen de lo que el sistema logra funcionalmente.

### 3. Atributos de calidad
- Listar los atributos de calidad relevantes (escalabilidad, seguridad, rendimiento, mantenibilidad, etc.).
- Definir los atributos de forma precisa y cómo deben ser medidos o garantizados.

### 4. Restricciones
- Listar las restricciones que afectan y condicionan el diseño del sistema.
- **Ejemplos:** Tiempo, presupuesto, estándares corporativos, ambientes obligatorios, tamaño y habilidades del equipo de desarrollo, propiedad intelectual.

### 5. Principios
- Prácticas, convenciones o reglas que guían el diseño y desarrollo del software.
- **Ejemplos:** Usar principios SOLID, Arquitectura Hexagonal, "No usar procedimientos almacenados", "Comprar en vez de desarrollar".

### 6. Arquitectura de Software
- Presentar el patrón de arquitectura utilizado (ej. Monolito Modular, Microservicios).
- Incluir diagramas estructurales como el **Diagrama de Contenedores** y el **Diagrama de Componentes**.
- Incluir diagramas dinámicos (como un diagrama de secuencia o actividades) si es necesario explicar el flujo.

### 7. Código*
- Presentar detalles de bajo nivel para algunas partes críticas o excepcionalmente complejas del sistema.
- Mantenerlos simples y relevantes (no documentar todo el código, solo la guía representativa).
- Apoyarse en diagramas de clases y diagramas de secuencia a nivel de implementación.

### 8. Datos
- Documentar los aspectos más relevantes en cuanto al manejo de la información persistida.
- **Ejemplos:** Modelo Entidad-Relación, motor de base de datos, lugar de almacenamiento estratégico, formato de intercambio de archivos (XML, JSON), estrategias y políticas de backups.

### 9. Arquitectura de Infraestructura*
- Detallar la topología de red y el hardware (físico y virtual) sobre el cual correrá el software en los ambientes de producción (nodos, nubes, balanceadores, firewalls).

### 10. Despliegue*
- Conectar y mapear la arquitectura de software (contenedores) con la de infraestructura física/virtual.
- Usar un **Diagrama de Despliegue** para graficar dónde vivirá cada artefacto de software.

### 11. Operación y soporte
- Describir cómo se puede monitorear la salud del sistema, operar en vivo y brindar la primera línea de soporte.
- **Ejemplos:** Ubicación y acceso a los logs, instrucciones para realizar cambios de configuración dinámica en caliente, manual para tareas de mantenimiento temporal.

### 12. Ambiente de desarrollo
- Describir de forma pragmática cómo las personas nuevas (onboarding en el equipo) instalan su máquina local para poder compilar y programar.
- **Ejemplos:** Herramientas y versiones requeridas (JDKs, Node, Docker), variables de entorno esenciales, scripts de automatización de bases de datos de prueba locales.

### 13. Registro de decisiones* (ADRs)
- Llevar una bitácora o registro inmutable de las decisiones arquitectónicas importantes adoptadas a lo largo de la vida del sistema.
- **Ejemplos:** Justificación de la selección de una tecnología específica, cambio rotundo de un framework o giro en los patrones de arquitectura adoptados y por qué se decidió en ese momento histórico.

---
> **Nota:** Según la guía, los puntos marcados con un asterisco (`*`) indican que *no siempre son estrictamente requeridos* en su máxima expresión, y cuya necesidad de documentación exhaustiva dependerá invariablemente del tamaño y la naturaleza específica del proyecto.
