# US-002: Persistencia de `tenant` y `tenant_id` fiable por request

## Metadata

| Campo | Valor |
| :--- | :--- |
| **Id** | US-002 |
| **Epica** | E0 — Plataforma y datos base |
| **Dependencias** | US-001 (API `/api/v1` operativa). |
| **Acoplado BE+FE** | no |
| **Estado refinamiento** | listo para planificar |

## Historia

Como **sistema** quiero **persistir organizaciones cliente (`tenant`)** y **resolver un `tenant_id` fiable en cada solicitud de negocio** mediante **guards y contexto de request**, para que **toda lectura y escritura multi-tenant** quede acotada al tenant correcto y alineada con `docs/08.data.md`.

## Alcance

1. **Modelo de datos:** tabla `tenant` segun diccionario en `docs/08.data.md` (`id` uuid PK, `name`, `plan` enum `free` \| `pro`, `created_at`, `updated_at`, `deleted_at` soft delete si el equipo adopta borrado logico desde el inicio).
2. **ORM:** introducir **Prisma** en `ATS/apps/backend` (schema, cliente, migraciones, servicio injectable) alineado con stack de `docs/07.code_and_technical_design.md`.
3. **Contexto de request:** mecanismo **por solicitud** (p. ej. `AsyncLocalStorage` o `@nestjs/cls` / middleware) que expone **`tenantId: string | null`** de forma accesible a casos de uso y repositorios **sin** pasar el id en cada parametro explicito del controller salvo que el patron del modulo lo exija.
4. **Guard(s):** proteger rutas de negocio futuras: si la ruta requiere tenant, **401/403** o **400** documentado cuando no se pueda resolver un tenant valido; **`GET /api/v1/health`** y rutas explicitamente publicas **sin** tenant.
5. **Extraccion del tenant en esta US:** implementar una **estrategia inicial** suficiente para desarrollo y pruebas hasta US-010:
   - Documentar el **claim JWT** objetivo (p. ej. `tenant_id` o namespace acordado) como contrato hacia **US-010**.
   - Mientras no exista validacion Keycloak completa, permitir una **estrategia de desarrollo** acotada: p. ej. cabecera `X-Tenant-Id` **solo** si `NODE_ENV=development` (o flag `TENANT_DEV_HEADER=true`) **y** validacion de que el UUID **existe** en tabla `tenant` — **nunca** confiar en cabecera de cliente en produccion sin pasar por JWT/API gateway.

## Fuera de alcance

- **US-010:** validacion completa de JWT Keycloak, roles, emision del claim de tenant en el token.
- **ABM REST de tenants** para onboarding self-service (puede ser epica posterior); basta **seed / migracion** con al menos un `tenant` para desarrollo.
- **Row-level enforcement en Prisma** (middleware que inyecta `where tenant_id`) puede quedar como mejora; esta US exige **contexto + guard + modelo persistido**.

## Criterios de aceptacion

1. **Dado** el esquema migrado, **cuando** se consulta la tabla `tenant`, **entonces** existen columnas acordes a `docs/08.data.md` y al menos **un** registro de prueba disponible via seed o migracion de datos.
2. **Dado** una solicitud a una ruta **protegida** de ejemplo (p. ej. `GET /api/v1/internal/tenant-context` temporal o primer modulo de negocio), **cuando** la estrategia dev activa recibe un `X-Tenant-Id` valido que existe en BD, **entonces** el contexto de request expone ese `tenant_id` y la respuesta lo confirma sin exponer otros tenants.
3. **Dado** la misma ruta protegida, **cuando** falta identificador de tenant o el UUID no existe en `tenant`, **entonces** la API responde con error **documentado** (4xx) y cuerpo alineado a convencion de errores cuando aplique (`docs/07`).
4. **Dado** `GET /api/v1/health`, **cuando** se invoca sin cabeceras de tenant, **entonces** responde **200** como en US-001 (sin requerir contexto tenant).
5. **Dado** el contrato hacia US-010, **cuando** se documenta en esta entrega el **nombre del claim** y el flujo deseado, **entonces** `plan-backend-ticket` para US-010 puede sustituir la estrategia dev por extraccion desde JWT sin redisenar el contexto global.

## Contrato API (referencia)

| Elemento | Descripcion |
| :--- | :--- |
| Claim JWT (futuro US-010) | Documentar nombre exacto, tipo string UUID, obligatorio en tokens de usuario de negocio. |
| Dev only | Cabecera `X-Tenant-Id: <uuid>` solo con flag/entorno de desarrollo; validar existencia en `tenant`. |
| Errores | Respuestas 4xx con mensaje estable; opcional `code` (ej. `TENANT_REQUIRED`, `TENANT_INVALID`) para clientes. |

No se exige en esta US un CRUD publico de tenants bajo `/api/v1/tenants` salvo que el plan tecnico lo proponga como stub interno; prioridad es **persistencia + contexto + guard**.

## Datos y tenant

- Entidad **`tenant`:** `docs/08.data.md`.
- Todas las tablas de negocio futuras llevaran `tenant_id` FK; esta US **no** crea aun `job` / `candidate`, solo **`tenant`** y plomeria.

## UI / UX

- No aplica.

## Seguridad

- La estrategia por cabecera es **solo desarrollo**; en **produccion** el `tenant_id` debe provenir de **identidad verificada** (JWT US-010) o de confianza zero en el cliente.
- No loguear tokens ni cabeceras completas en produccion.

## Notas tecnicas

- **No** aplica perfil CRUD admin de cinco casos de uso para `tenant` en esta US si no hay pantalla ABM; si se expone CRUD interno, entonces aplicar `docs/07` seccion administracion.
- Coordinar con **ADR** si se introduce Prisma por primera vez (actualizar `docs/13.architecture_decision_records.md` si no existe ADR de persistencia).
- Tras implementar, actualizar **`docs/08.data.md`** solo si el esquema real difiere del diccionario (deberia coincidir).

## Referencias

- `docs/08.data.md` — modelo `tenant`, MER.
- `docs/07.code_and_technical_design.md` — multi-tenant, API, errores.
- `docs/14.product_backlog.md` — US-010 depende de contexto tenant.
- `specs/user-stories/US-001-api-version-health.md` — health sin tenant.
