# Historias de usuario enriquecidas (LTI ATS)

Cada historia del backlog documentado (`docs/14.product_backlog.md`) puede tener **especificacion detallada** en un fichero Markdown bajo esta carpeta.

## Convencion de nombres

`US-<id>-<slug-kebab>.md`

Ejemplos:

- `US-001-api-version-health.md`
- `US-020-gestionar-vacantes-abm.md`

El `<id>` coincide con el identificador del backlog (US-001, US-020, …). El `slug` resume la capacidad en ingles o espanol, **kebab-case**, sin espacios.

## Contenido minimo recomendado (plantilla)

Cada fichero debe permitir `plan-backend-ticket` / `plan-frontend-ticket` **sin ambiguedad**:

1. **Titulo** y **metadata** (id, epica, dependencias, si el trabajo es acoplado BE+FE).
2. **Historia** (*Como … quiero … para …*).
3. **Criterios de aceptacion** (Given / When / Then o lista verificable).
4. **Contrato API** (`/api/v1`, metodos, errores estables, tenant) si aplica.
5. **Datos / estados** (referencia a `docs/08.data.md` y reglas de negocio).
6. **UI / UX** (pantallas, estados vacio/carga/error, accesibilidad minima) si aplica.
7. **Observaciones** para arquitectura (CRUD admin → cinco casos de uso, Kanban separado, etc.).

## Flujo

- **Origen:** `docs/14.product_backlog.md` (indice PMV).
- **Enriquecimiento:** comando `specs/.commands/enrich-us.md` crea o actualiza el fichero aqui y, si se pide, enlaza desde la tabla del backlog.
