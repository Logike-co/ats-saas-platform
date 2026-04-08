# Flujo de Desarrollo LTI ATS

Este diagrama representa el ciclo de desarrollo y los roles involucrados en el proyecto, siguiendo la arquitectura de Simon Brown y la estructura de 13 puntos establecida.

```mermaid
sequenceDiagram
    autonumber
    participant A as Arquitecto de Software
    participant PM as Project Manager
    participant BD as Backend Developer
    participant FD as Frontend Developer
    participant D as Documenter

    Note over A: Fase 1: Definición y Estructura
    A->>A: Documenta Arquitectura (Simon Brown - 13 Puntos)
    Note right of A: Contexto, Funcional, Calidad, ADRs, etc.
    A->>A: Genera Estructura de Carpetas (Baseline)
    Note right of A: Monorepo: ATS/ (Next.js + NestJS)

    Note over PM: Fase 2: Gestión de Producto
    PM->>PM: Crea Product Backlog
    PM->>PM: Define Épicas e Historias de Usuario (US)
    PM->>D: Ejecuta 'enrich-us'
    D-->>D: Refina y enriquece las US
    PM->>D: Ejecuta 'plan-backend-ticket' / 'plan-frontend-ticket'
    D-->>D: Genera Tickets detallados (Backend y Frontend) en nuevos archivos
    PM->>BD: Asigna Tickets detallados de Backend
    PM->>FD: Asigna Tickets detallados de Frontend

    Note over BD,FD: Fase 3: Desarrollo Iterativo
    par Implementación en Paralelo
        BD->>BD: Ejecuta 'develop-backend-ticket'
        Note right of BD: Agente Backend Developer
        FD->>FD: Ejecuta 'develop-frontend-ticket'
        Note right of FD: Agente Frontend Developer
    end
    
    BD->>BD: Ejecuta 'commit'
    Note right of BD: 1. Inspección 2. Resolución de Scope<br/>3. Mensaje 4. Push 5. PR (gh)
    FD->>FD: Ejecuta 'commit'
    Note right of FD: 1. Inspección 2. Resolución de Scope<br/>3. Mensaje 4. Push 5. PR (gh)

    Note over A,D: Fase 4: Integración y Calidad
    A->>A: Revisa y aprueba PR (Pull Request)
    A-->>D: Sincroniza cambios finales
    D->>D: Actualiza y Mantiene Documentación (docs/)
```

## Roles y Responsabilidades

- **Arquitecto de Software**: Responsable de la visión técnica inicial, los 13 puntos de documentación y el **visto bueno final (aprobación de PRs)** creados por el comando `commit`.
- **Project Manager**: Gestiona el backlog y coordina el refinamiento de tareas.
- **Documenter**: Agente transversal que:
    1. Enriquece las Historias de Usuario mediante el comando `enrich-us`.
    2. Genera tickets técnicos detallados para Backend y Frontend mediante los comandos `plan-backend-ticket` y `plan-frontend-ticket`.
    3. Mantiene la documentación técnica en `docs/` sincronizada.
- **Backend Developer / Frontend Developer**: Agentes que implementan servicios/UI y utilizan el comando **`commit`** para:
  - **Resolver el alcance**: Identificar qué archivos pertenecen a qué funcionalidad.
  - **Garantizar estándares**: Generar mensajes de commit descriptivos en inglés.
  - **Automatizar entrega**: Realizar push y crear/actualizar la Pull Request para revisión.
