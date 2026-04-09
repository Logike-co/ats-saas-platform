# LTI ATS Monorepo

Base de proyecto para ATS con frontend, backend y base de datos.

## Stack

- Frontend: Next.js
- Backend: NestJS
- DB: PostgreSQL
- Queue: Redis
- Auth ready: Keycloak (infra)

## Requisitos

- Node 20+
- pnpm 9+
- Docker + Docker Compose

## Arranque local

1. Copiar variables:
   - `cp .env.example .env`
2. Instalar dependencias:
   - `pnpm install`
3. Levantar DB y Redis:
   - `docker compose up -d postgres redis`
4. **Migraciones y seed (backend / Prisma):**
   - `pnpm --filter @lti-ats/backend exec prisma migrate deploy`
   - `pnpm --filter @lti-ats/backend run prisma:seed`
   - Tenant de desarrollo fijo (US-002): UUID `00000000-0000-4000-8000-000000000001`.
5. Levantar apps:
   - `pnpm dev`

Frontend: `http://localhost:3000`  
Backend health (liveness): `http://localhost:<BACKEND_PORT>/api/v1/health` — por defecto `BACKEND_PORT=3001` en el paquete backend; respuesta JSON incluye `apiVersion: "v1"`.

### Probar contexto multi-tenant (dev)

Con backend en marcha y `NODE_ENV=development` (o `TENANT_DEV_HEADER=true` en `.env`):

```bash
curl -sS -H "X-Tenant-Id: 00000000-0000-4000-8000-000000000001" \
  http://localhost:3001/api/v1/tenancy/context
```

Respuesta esperada: `{"tenantId":"00000000-0000-4000-8000-000000000001"}`.
