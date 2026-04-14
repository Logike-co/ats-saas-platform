# Backend Implementation Plan: US-002 Tenant persistence and request context

## 1. Header

Fuente: `specs/user-stories/US-002-tenant-persistence-and-request-context.md`.

## 2. Overview

- **Alcance:** Introducir **Prisma + PostgreSQL** para la tabla **`tenant`**, **seed** minimo, **contexto de request** con `tenantId` accesible al codigo de aplicacion, **estrategia dev** (`X-Tenant-Id` validada contra BD bajo condiciones estrictas), **ruta de prueba** protegida que demuestra el contexto, y **documentacion del claim JWT** para US-010. `GET /api/v1/health` permanece **sin** tenant.
- **Fuera de alcance:** Keycloak/JWT completo (US-010), CRUD publico de tenants, middleware global Prisma que inyecte `tenant_id` en todas las queries.
- **Dominio:** Cimiento multi-tenant; sin `job` / `candidate` aun.

## 3. Architecture context

- **Modulos nuevos sugeridos** (nombres ajustables; mantener SRP):
  - **`PrismaModule` / `PrismaService`:** cliente singleton, `onModuleInit` `$connect`, shutdown hook.
  - **`TenancyModule`:** contexto, resolucion dev, puerto de lectura de tenant, guard, controlador de demostracion.
- **Archivos existentes:** `AppModule` importa `PrismaModule`, `TenancyModule`; `HealthController` sin guard de tenant.
- **Multi-tenant:** en esta US el **aislamiento** se demuestra por **contexto + validacion de existencia** del tenant; las tablas de negocio futuras anadiran `tenant_id` FK y usaran el contexto en repositorios.

### SRP — casos de uso y puertos (inbound / outbound)

| Componente | Rol |
| :--- | :--- |
| **`FindTenantByIdPort`** (out) | `findById(id: string): Promise<Tenant \| null>` (o boolean exists). |
| **`FindTenantByIdService`** | Implementa la unica operacion de lectura necesaria para validar el UUID (equivalente a un **query use case** acotado). |
| **`TenantContextService`** | Lee/escribe `tenantId` en almacenamiento **por request** (`@nestjs/cls` recomendado: `ClsModule.forRoot`, `ClsService.set/get`). Una responsabilidad: **estado de tenant en la solicitud**. |
| **`ResolveDevTenantGuard`** (o middleware injectable) | Orquesta: si ruta no es publica y modo dev habilitado, lee cabecera, delega en `FindTenantByIdService`, asigna contexto o lanza excepcion HTTP. **No** inyectar `PrismaService` en el controller de demostracion. |
| **`GetTenantContextController`** | Depende de **`GetCurrentTenantContextUseCase`** (in) que solo lee `TenantContextService` y devuelve DTO — evita logica en el controller. |

**Excepcion justificada:** no hace falta el paquete de **cinco** casos de uso CRUD para `tenant` (sin ABM en esta US). Si mas adelante hay pantalla admin de tenants, aplicar `docs/07` admin.

### 3.1 Admin / CRUD entity checklist

No hay ABM de entidad administrada en US-002. **Omitido.**

## 4. API contract

### Rutas

| Metodo | Ruta | Auth / tenant | Exito | Errores |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Ninguno | 200 JSON US-001 | — |
| `GET` | `/api/v1/tenancy/context` | Requiere tenant resuelto (guard) | `200` `{ "tenantId": "<uuid>" }` | `400` / `403` con `code`: `TENANT_REQUIRED`, `TENANT_INVALID` (mensaje controlado, opcional `traceId` si ya existe interceptor) |

**Desarrollo (solo si `NODE_ENV=development` o `TENANT_DEV_HEADER=true`):**

- Cabecera `X-Tenant-Id: <uuid>` obligatoria para `/api/v1/tenancy/context`.
- Validar formato UUID y existencia en tabla `tenant`.

**Produccion (hasta US-010):**

- Comportamiento documentado: si no hay JWT, el guard debe **rechazar** con `403` / `401` (elegir uno y documentar) **sin** aceptar `X-Tenant-Id`, salvo que un **API gateway** de confianza inyecte el header (fuera de alcance MVP) — la US pide no confiar en cliente en prod.

### Contrato JWT (US-010) — documentar en codigo + `docs/07` o comentario en `tenancy/README`

- **Claim:** `tenant_id` (string UUID), presente en **access token** de usuarios de negocio tras US-010.
- **Extractor futuro:** implementacion alternativa del mismo `TenantContextService` / guard que lea del payload JWT verificado en lugar de la cabecera dev.

## 5. Datos (Prisma)

**Modelo `Tenant`** (mapear a snake_case en BD con `@map`):

- `id` `Uuid` `@id @default(uuid())`
- `name` `String`
- `plan` enum `FREE` \| `PRO` (`@map` a `free`/`pro` si se usa enum nativo Postgres)
- `createdAt`, `updatedAt` `DateTime`
- `deletedAt` `DateTime?` opcional soft delete alineado a `docs/08.data.md`

**Seed:** al menos un tenant fijo (UUID conocido para documentacion en `ATS/README.md` o `.env.example` comentado) para pruebas locales.

**Migracion inicial:** `prisma migrate dev` nombre sugerido `init_tenant`.

## 6. Estructura de carpetas sugerida (`ATS/apps/backend/src`)

```text
prisma/
  schema.prisma
  seed.ts
  migrations/...
src/
  prisma/
    prisma.module.ts
    prisma.service.ts
  tenancy/
    tenancy.module.ts
    api/
      get-tenant-context.controller.ts
      tenancy.constants.ts
    application/
      ports/
        in/
          get-current-tenant-context.use-case.ts
        out/
          find-tenant-by-id.port.ts
      services/
        find-tenant-by-id.service.ts
        get-current-tenant-context.service.ts
      tenant-context.service.ts   # wrapper ClsService + key simbolica
    infrastructure/
      persistence/
        tenant.prisma-adapter.ts
    guards/
      resolve-dev-tenant.guard.ts
    decorators/
      public-route.decorator.ts   # opcional si se usa guard global mas tarde
  app.module.ts
  main.ts
```

Ajustar imports y nombres a convencion del repo (kebab-case archivos).

## 7. Implementation steps

### Step 0: Branch

- `git pull origin main` → `git checkout -b feature/US-002-tenant-prisma-context`

### Step 1: Prisma y BD

- Anadir dependencias: `prisma`, `@prisma/client`.
- `DATABASE_URL` en `ATS/.env.example` (y documentar en `ATS/README.md`).
- Definir `schema.prisma` con modelo `Tenant`; generar migracion y **seed**.
- Scripts en `package.json` del backend: `prisma:generate`, `prisma:migrate`, `prisma:seed` (segun estandar Prisma).

### Step 2: PrismaModule

- `PrismaService` extendiendo `PrismaClient`, lifecycle hooks Nest.

### Step 3: Tenancy — puertos y servicios

- Implementar `FindTenantByIdPort` + adapter Prisma + `FindTenantByIdService`.
- Configurar `ClsModule.forRoot({ global: true })` en `AppModule` o `TenancyModule`.
- `TenantContextService` con metodos `setTenantId` / `getTenantIdOrThrow` / `runWithTenant` si hace falta.

### Step 4: Guard + controller

- `ResolveDevTenantGuard` aplicado solo a `GetTenantContextController` (o rutas bajo `TenancyModule`).
- Logica: si `TENANT_DEV_HEADER` o `NODE_ENV===development`, leer y validar header; si no, responder error explicito (prod sin JWT).
- `GetCurrentTenantContextUseCase` + implementacion que devuelve `{ tenantId }`.

### Step 5: AppModule

- Importar `PrismaModule`, `TenancyModule`, `ClsModule`.
- Asegurar **HealthController** no pasa por el guard de tenant (no registrar guard global que lo afecte; solo `@UseGuards` en el controller de tenancy).

### Step 6: Tests (Jest)

- **Unit:** `FindTenantByIdService` con Prisma mock.
- **Integration (recomendado):** `ResolveDevTenantGuard` + controller con `supertest` y BD de test o `PrismaService` sustituido — o documentar dependencia de Docker Postgres para CI.
- **Regresion:** `health.controller.spec.ts` sigue verde.

### Step 7: Documentacion

- **`docs/08.data.md`:** solo si el esquema real difiere (ideal: sin cambios).
- **`docs/07.code_and_technical_design.md`:** breve subseccion **Multi-tenant request context** + claim `tenant_id` para US-010 + ruta dev `/api/v1/tenancy/context`.
- **`docs/13.architecture_decision_records.md`:** referenciar **ADR-005** (Prisma ya aceptada); anadir nota bajo ADR-003 o nueva entrada **ADR-0xx** si se fija formalmente el uso de **CLS + claim `tenant_id`** (opcional si queda en docs/07).
- **`ATS/README.md`:** arranque con Docker Postgres, migraciones, seed, ejemplo `curl` con `X-Tenant-Id` para `/api/v1/tenancy/context`.

### Step 8: CI

- Asegurar pipeline: `prisma generate` antes de `build`; si CI no tiene Postgres, usar **job** con servicio Postgres o `migrate deploy` en contenedor — si no es viable en esta iteracion, documentar limitacion y ejecutar tests unitarios sin BD en CI hasta configurar servicio.

## 8. Testing checklist

- [ ] Migraciones aplican en entorno limpio.
- [ ] Seed crea tenant verificable.
- [ ] `curl /api/v1/health` sin header → 200.
- [ ] `curl /api/v1/tenancy/context` con `X-Tenant-Id` valido (dev) → 200 y `tenantId` correcto.
- [ ] UUID inexistente o sin header (dev) → 4xx con `code` estable.
- [ ] `pnpm --filter @lti-ats/backend test` y `build` OK.

## 9. Security and compliance

- Cabecera `X-Tenant-Id` **solo** con flag/entorno dev; produccion sin JWT debe **fallar** de forma clara en rutas protegidas.
- No registrar valores de cabecera en logs en produccion.

## 10. Dependencies / migrations

- Nuevas: `prisma`, `@prisma/client`, `@nestjs/cls` (si se elige CLS).
- Primera migracion SQL para `tenant`.

## 11. Verification

- PR a `main`; CI verde; sin secretos en repo (solo `.env.example`).
