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
4. Levantar apps:
   - `pnpm dev`

Frontend: `http://localhost:3000`  
Backend health: `http://localhost:3001/api/v1/health`
