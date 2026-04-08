# Flujo de Desarrollo LTI ATS

Este documento describe el ciclo de desarrollo, los roles y los **gates de calidad**, alineado con la arquitectura Simon Brown (13 puntos), el monorepo `ATS/` y un modelo **trunk-based**: ramas cortas `feature/*` que integran en **`main`** mediante Pull Request.

---

## Modelo de ramas (trunk-based)

| Regla | Descripción |
| :--- | :--- |
| **Tronco** | `main` es la rama de integración y referencia; debe permanecer mergeable. |
| **Features** | Ramas cortas `feature/<id-o-slug>` creadas desde `main` actualizado. |
| **PR** | Toda integración a `main` es vía **Pull Request** (no push directo salvo excepción acordada). |
| **Hotfix** | `hotfix/<slug>` desde `main`, PR a `main`, mismo rigor de CI. |
| **Objetivo** | Integraciones pequeñas y frecuentes; evitar ramas largas y divergencia prolongada. |

---

## Integración Backend y Frontend

### Contrato antes de implementar

Antes o al inicio de la Fase 3, debe existir un **acuerdo de contrato** explícito cuando BD y FD tocan la misma capacidad:

- API REST (`/api/v1/...`), esquemas o **OpenAPI** generado/acordado.
- Tipos o contratos compartidos en `packages/shared` (cuando aplique).
- Orden lógico si hay dependencia fuerte: **backend primero** (endpoint stub o contrato congelado) y luego frontend, o desarrollo en paralelo sobre contrato fijado.

### Una rama, un PR cuando el feature está acoplado

Si backend, frontend y/o `packages/shared` **no pueden entregarse de forma independiente** (misma historia de usuario, mismo despliegue):

- Trabajar en **una sola rama** `feature/...` compartida (o un único responsable que consolide).
- Al cerrar: **un único PR hacia `main`** que incluya todos los cambios acoplados.
- El comando `commit` se ejecuta con **alcance unificado** (todos los paths del feature en un solo PR).

### PRs separados cuando está desacoplado

Si el cambio es **independiente** (por ejemplo, solo UI sin API nueva, o solo API sin cambio de UI inmediato):

- Ramas y **PRs separados** hacia `main`, idealmente en orden que minimice rotura (p. ej. API mergeada antes que el consumidor en FE si no hay feature flag).

---

## Gates de calidad (CI y DoD)

- **CI obligatorio** en el PR: lint, build y tests del workspace (ver `ATS/.github/workflows/ci.yml`). **No se mergea** con checks en rojo.
- **Definition of Done** alineada con `docs/12.development_and_contribution.md`: código revisado, pruebas actualizadas, impacto en BD/seguridad evaluado, documentación tocada cuando aplique.
- En equipos **muy pequeños o unipersonales**, la “aprobación” del PR es **autorevisión con checklist explícito** (mismo estándar de calidad, sin bypass de CI).

---

## Documentación continua (no solo al final)

- **Siempre** actualizar `docs/` cuando el cambio afecte comportamiento acordado, datos, despliegue o operación.
- **ADR** (`docs/13.architecture_decision_records.md` o ficheros dedicados) cuando haya decisión arquitectónica o de stack relevante, **en la misma entrega** que el código, no solo al cierre de épica.
- Tras **merge a `main`**, el Documenter **sincroniza** diagramas o secciones afectadas y enlaza el PR o el issue.

---

## Excepciones (segunda línea del proceso)

| Caso | Tratamiento |
| :--- | :--- |
| **Hotfix** | Rama `hotfix/*` desde `main`, PR pequeño, CI completo, merge rápido; valorar cherry-pick si hubo divergencia. |
| **Spike / investigación** | Rama o PR marcado como spike, sin obligación de producto completo; timebox; documentar hallazgos en issue o `docs/`. |
| **Solo documentación** | PR directo a `main` con prefijo `docs:`; CI debe seguir pasando si el pipeline aplica al repo completo. |

---

## Diagrama de secuencia (flujo principal)

```mermaid
sequenceDiagram
    autonumber
    participant A as Arquitecto de Software
    participant PM as Project Manager
    participant BD as Backend Developer
    participant FD as Frontend Developer
    participant D as Documenter
    participant CI as CI (GitHub Actions)

    Note over A: Fase 1: Definición y estructura
    A->>A: Documenta arquitectura (Simon Brown · 13 puntos)
    Note right of A: Contexto, funcional, calidad, ADRs, etc.
    A->>A: Baseline de repo / monorepo ATS/
    Note right of A: Next.js + NestJS + shared + Docker

    Note over PM: Fase 2: Gestión de producto
    PM->>PM: Product Backlog · épicas · historias de usuario (US)
    PM->>D: Comando enrich-us
    D-->>D: Refina y enriquece US
    PM->>D: plan-backend-ticket / plan-frontend-ticket
    D-->>D: Genera tickets técnicos (archivos / specs)
    PM->>BD: Asigna ticket backend (si aplica)
    PM->>FD: Asigna ticket frontend (si aplica)

    Note over BD,FD: Fase 3: Desarrollo (trunk-based)
    BD->>FD: Acuerdo de contrato API / shared types
    Note right of BD,FD: Antes o al inicio de implementación

    alt Feature acoplado (BD + FE mismo entregable)
        Note over BD,FD: Una rama feature/* · un solo PR → main
        par Implementación en paralelo (misma rama)
            BD->>BD: develop-backend-ticket
            FD->>FD: develop-frontend-ticket
        end
        BD->>BD: commit (alcance unificado: BE + FE + shared)
        Note right of BD: Inspección, mensaje EN, push, PR único (gh)
    else Feature desacoplado
        par Implementación en paralelo
            BD->>BD: develop-backend-ticket
            FD->>FD: develop-frontend-ticket
        end
        BD->>BD: commit → PR → main
        FD->>FD: commit → PR → main
        Note right of BD: Orden: API antes que consumidor si hay dependencia
    end

    Note over A,CI: Fase 4: Integración y calidad
    CI-->>CI: Pipeline: install, lint, build, test
    Note right of CI: Obligatorio en verde antes del merge
    A->>A: Revisión y aprobación del PR (checklist / auto-revisión si 1 persona)
    A->>A: Merge a main
    PM->>D: Feature integrada (notificación explícita o convención de equipo)
    D->>D: Actualiza docs/ y ADRs si aplica
    Note right of D: También durante la US si hubo decisión arquitectónica
```

---

## Roles y responsabilidades

- **Arquitecto de software**: visión técnica, 13 puntos de documentación, revisión de PRs y coherencia con ADRs. En equipo mínimo, coincide con quien implementa pero mantiene el **rol de revisión** y el checklist.
- **Project Manager**: backlog, priorización, refinamiento y asignación de tickets; asegura que el criterio de aceptación de la US esté claro antes del desarrollo.
- **Documenter** (transversal):
  1. `enrich-us` sobre historias de usuario.
  2. `plan-backend-ticket` / `plan-frontend-ticket` para planes ejecutables.
  3. Mantenimiento de `docs/` y ADRs **durante y después** del merge, según impacto.
- **Backend / Frontend Developer**: implementación con `develop-backend-ticket` / `develop-frontend-ticket` y **`commit`** para alcance, mensaje en inglés, push y PR hacia **`main`**.

---

## Comandos del repositorio (`specs/.commands/`)

| Comando (invocación) | Archivo |
| :--- | :--- |
| `enrich-us` | [`specs/.commands/enrich-us.md`](../specs/.commands/enrich-us.md) |
| `plan-backend-ticket` | [`specs/.commands/plan-backend-ticket.md`](../specs/.commands/plan-backend-ticket.md) |
| `plan-frontend-ticket` | [`specs/.commands/plan-frontend-ticket.md`](../specs/.commands/plan-frontend-ticket.md) |
| `develop-backend-ticket` | [`specs/.commands/develop-backend-ticket.md`](../specs/.commands/develop-backend-ticket.md) |
| `develop-frontend-ticket` | [`specs/.commands/develop-frontend-ticket.md`](../specs/.commands/develop-frontend-ticket.md) |
| `commit` | [`specs/.commands/commit.md`](../specs/.commands/commit.md) |
| `update-docs` | [`specs/.commands/update-docs.md`](../specs/.commands/update-docs.md) |

*(Las rutas relativas asumen que abres este fichero desde el repo; si tu herramienta usa otro cwd, antepone la raíz del proyecto.)*

---

## Referencias

- Índice de arquitectura: [`docs/00.index.md`](../docs/00.index.md)
- Contribución y DoD: [`docs/12.development_and_contribution.md`](../docs/12.development_and_contribution.md)
- ADRs: [`docs/13.architecture_decision_records.md`](../docs/13.architecture_decision_records.md)
