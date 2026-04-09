# Backend Implementation Plan: US-001 API versionada y health check

## 1. Header

Fuente: `specs/user-stories/US-001-api-version-health.md`.

## 2. Overview

- **Alcance:** Exponer `GET /api/v1/health` sin autenticacion, respuesta JSON estable (`status`, `service`, `timestamp`), prefijo `/api/v1` como ancla de version para el producto. Opcional: campo `apiVersion: "v1"` en el cuerpo.
- **Fuera de alcance:** readiness con DB/Redis/Keycloak; autenticacion en health.
- **Dominio ATS:** capa transversal de operacion; sin entidades de negocio ni `tenant_id`.

**Estado actual:** `HealthController` en `ATS/apps/backend/src/health.controller.ts` ya implementa la ruta y los tres campos obligatorios. El trabajo restante es **cerrar el contrato** (opcional `apiVersion`), **tests automatizados** y **documentacion operativa** minima.

## 3. Architecture context

- **Modulo:** `AppModule` existente; sin nuevo feature module obligatorio para esta US.
- **Componentes:** `HealthController` (`@Controller("api/v1/health")`), metodo `GET` → objeto plano JSON.
- **SRP / casos de uso:** endpoint de **liveness** sin persistencia ni reglas de negocio complejas. **No** aplica el perfil de cinco casos de uso CRUD admin. Es aceptable mantener un **controller delgado** sin puerto UseCase dedicado; si se desea mayor testabilidad pura, extraer un `HealthCheckService` (una clase, una responsabilidad: construir el DTO de salud) e inyectarlo en el controller — opcional, no obligatorio para US-001.
- **Prisma / DTOs:** no.
- **Multi-tenant:** no aplica en este endpoint.

### 3.1 Admin / CRUD entity checklist

No introduce entidad administrada ni ABM. **Omitido** a proposito.

## 4. API contract

| Metodo | Ruta | Auth | Exito |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Ninguna | `200`, `application/json` |

**Cuerpo (minimo):**

```json
{
  "status": "ok",
  "service": "backend",
  "timestamp": "<ISO-8601>"
}
```

**Recomendado en implementacion:** anadir `"apiVersion": "v1"` para alinear con la US enriquecida.

**Errores:** 5xx si el proceso no puede atender (no se exige cuerpo estandar `code`/`traceId` en esta US).

**Convencion futura:** nuevos controllers de negocio bajo prefijo `/api/v1/...` (globalPrefix en `main.ts` o ruta explicita por controller — documentar la eleccion en Step 1 para consistencia con modulos posteriores).

## 5. Implementation steps

### Step 0: Branch (mandatory)

- `git pull origin main` → `git checkout -b feature/US-001-health-api`

### Step 1: Ajustar respuesta de health (si se acuerda en PR)

- **Archivo:** `ATS/apps/backend/src/health.controller.ts`
- **Accion:** Anadir `apiVersion: "v1"` al objeto de respuesta (o equivalente documentado).
- **Tests:** actualizar expectativas en Step 2.

### Step 2: Tests (Jest) — obligatorio para TDD/cobertura de la US

- **Archivo nuevo sugerido:** `ATS/apps/backend/src/health.controller.spec.ts`
- **Accion:** Usar `@nestjs/testing` + `Test.createTestingModule` con `HealthController` (y `HealthCheckService` solo si se introduce en Step 1).
- **Casos:**
  - `GET` (invocar metodo del controller o request HTTP con `supertest` si se cablea `INestApplication` en e2e) devuelve `status`, `service`, `timestamp`; `timestamp` parseable como ISO 8601.
  - Si se anade `apiVersion`, assert del valor `"v1"`.
- **Alternativa e2e:** `test/app.e2e-spec.ts` a nivel raiz del app con `supertest` — valida ruta real `GET /api/v1/health`; preferible si el equipo quiere probar stack HTTP completo. El repo hoy no tiene e2e backend; **controller unit + opcional e2e** es suficiente para US-001.

### Step 3: Convencion `/api/v1` (documentacion en codigo o README)

- **Archivo:** `ATS/README.md` (o comentario breve en `main.ts`)
- **Accion:** Una linea para operadores: URL base local del health (ej. `http://localhost:3001/api/v1/health` con `BACKEND_PORT`). Opcional segun US.

### Step 4: Lint y CI

- **Comando:** desde `ATS/`: `pnpm --filter @lti-ats/backend lint`, `pnpm --filter @lti-ats/backend test`, `pnpm --filter @lti-ats/backend build`.
- Verificar que CI (`ATS/.github/workflows/ci.yml`) sigue en verde.

### Step N+1: Documentation (mandatory)

- **No** requiere cambios en `docs/08.data.md`.
- Si se formaliza `apiVersion` o convencion de `globalPrefix`, anadir una frase en `docs/07.code_and_technical_design.md` (seccion API) solo si el equipo quiere reflejar el campo en contrato global; **opcional** para US-001 cerrada con solo health.

## 6. Testing checklist

- [ ] `pnpm --filter @lti-ats/backend test` pasa con nuevo spec.
- [ ] Manual: `curl -sS http://localhost:<PORT>/api/v1/health | jq` valida JSON.

## 7. Security and compliance

- Endpoint **publico** a proposito (probes/CI). No exponer datos sensibles, stack traces ni variables de entorno en la respuesta.

## 8. Dependencies / migrations

- Ninguna nueva dependencia obligatoria. `supertest` solo si se elige e2e HTTP (evaluar como devDependency).

## 9. Verification

- PR a `main`; CI verde; sin secretos en el repo.
