# LTI ATS

Repositorio del **Applicant Tracking System (ATS)** de **LTI**: gestión del ciclo de vida de ofertas de empleo y postulaciones, con foco en trazabilidad y simplicidad para PYMEs.

Este proyecto incluye **documentación de arquitectura** (guía Simon Brown), el **código base** del producto y material de especificación.

---

## Contenido del repositorio

| Ruta | Descripción |
| :--- | :--- |
| [`docs/`](docs/) | Arquitectura y contexto del producto (13 temas + guía y plantilla). |
| [`ATS/`](ATS/) | Monorepo aplicación: frontend (Next.js), backend (NestJS), paquete compartido, Docker y CI. |
| [`specs/`](specs/) | Especificaciones y agentes de apoyo al desarrollo. |

Índice principal de arquitectura: [`docs/00.index.md`](docs/00.index.md).

Plantilla reutilizable para otros proyectos: [`guides/template_architecture_documentation_simon_brown.md`](guides/template_architecture_documentation_simon_brown.md).

---

## Stack (aplicación)

- **Frontend:** Next.js (React), TypeScript.
- **Backend:** NestJS (Node.js), TypeScript.
- **Base de datos:** PostgreSQL.
- **Colas:** Redis + BullMQ (preparado para tareas asíncronas).
- **Identidad:** Keycloak (OIDC/OAuth2), integración prevista con NextAuth en frontend.
- **Monorepo:** `pnpm` workspaces.

---

## Requisitos

- **Node.js** 20 o superior.
- **pnpm** 9 (o usar `npx pnpm@9.12.0` sin instalación global).
- **Docker** y **Docker Compose** (PostgreSQL, Redis, Keycloak en local).

---

## Inicio rápido (desarrollo local)

Desde la carpeta [`ATS/`](ATS/):

```bash
cp .env.example .env
docker compose up -d postgres redis
npx pnpm@9.12.0 install
npx pnpm@9.12.0 dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **API health:** [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health)

Más detalle: [`ATS/README.md`](ATS/README.md).

### Comandos útiles (raíz del monorepo `ATS/`)

```bash
npx pnpm@9.12.0 -C ATS build    # compilar frontend, backend y shared
npx pnpm@9.12.0 -C ATS lint     # lint (backend configurado; frontend en evolución)
npx pnpm@9.12.0 -C ATS test     # tests (workspace)
```

---

## Documentación de arquitectura

La documentación sigue la **guía de Simon Brown** ([`guides/guia_simon_brown.md`](guides/guia_simon_brown.md)):

1. Contexto y objetivo  
2. Resumen funcional  
3. Atributos de calidad  
4. Restricciones  
5. Principios de diseño  
6. Arquitectura de software  
7. Código y diseño técnico  
8. Datos  
9. Arquitectura de infraestructura  
10. Contenerización y despliegue  
11. Operación y soporte  
12. Ambiente de desarrollo y contribución  
13. Registro de decisiones (ADRs)  

---

## Estado del proyecto

Fase inicial: **esqueleto ejecutable** (frontend + backend + infra Docker) listo para iterar en funcionalidades de negocio. La especificación funcional y técnica vive en `docs/`.

---

## Contribución

- Flujo de ramas y calidad: [`docs/12.development_and_contribution.md`](docs/12.development_and_contribution.md).
- No subir secretos: usar `.env` local (ver [`.gitignore`](.gitignore)).

---

## Licencia

Sin especificar en este repositorio; definir según política de LTI.
