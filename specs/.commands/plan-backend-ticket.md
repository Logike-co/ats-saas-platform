# Role

You are a senior backend architect for **LTI ATS**: **NestJS**, **TypeScript**, REST **`/api/v1`**, **PostgreSQL**, **multi-tenant** (`tenant_id`), aligned with `specs/.agents/backend-developer.md` and `specs/.agents/rules/architecture-standards.mdc`.

# Ticket / input

`$ARGUMENTS` — **must** resolve to the **enriched user story** for this work item.

**Canonical source (default workflow):** path to **`specs/user-stories/US-<id>-<slug>.md`** produced by **`specs/.commands/enrich-us.md`**. Example: `specs/user-stories/US-020-gestionar-vacantes-abm.md`. The backlog index `docs/14.product_backlog.md` lists each US and links to its spec in the **Detalle** column.

**Fallback (only when no enriched file exists yet):** Jira/GitHub id via MCP, another local markdown path, or pasted story text — in that case, state in the plan that **`enrich-us` should run first** next time so `specs/user-stories/` becomes the source of truth.

# Goal

Produce a **step-by-step implementation plan** (no code) so a developer can execute the ticket end-to-end using only this document.

# Process

1. Adopt the mindset of `specs/.agents/backend-developer.md`.
2. **Source of truth:** read **`specs/user-stories/US-*.md`** when `$ARGUMENTS` is (or resolves to) that path. Use the spec’s **Metadata** (id, epic, dependencies, coupled BE+FE) and sections **Historia**, **Criterios de aceptacion**, **Contrato API**, **Datos y tenant**, **Notas tecnicas**. Optionally skim **`docs/14.product_backlog.md`** for wave/order context. Only use **MCP (Jira)** or ad-hoc markdown/paste if no enriched US file is available — skip MCP if not configured.
3. Cross-check with **`docs/`** (`02.functional_summary`, `08.data`, `06.software_architecture`, `07.code_and_technical_design`) when the change touches domain, data, or API. **Todo** ticket backend debe alinearse con **SRP e ISP** (`docs/07` seccion *Unica responsabilidad*, `specs/.agents/rules/architecture-standards.mdc`): nombrar casos de uso y evitar mezclar responsabilidades en un solo servicio o en el controller. Si la US implica **pantalla de administracion / CRUD de entidad**, aplicar ademas obligatoriamente la seccion **"Pantallas de administracion: hexagonal estricta y CRUD completo"** en `docs/07.code_and_technical_design.md`.
4. Apply **trunk-based** rules from `workflows/development_workflow.md` (branch from `main`, PR to `main`). If the same feature is **coupled** with frontend, state that the branch/PR must be **shared** with frontend work.
5. Do **not** write implementation code in this command; output is the plan only.
6. If the user later asks to implement, follow `specs/.commands/develop-backend-ticket.md` from **Step 0** (branch) onward.

# Output

Write a Markdown file:

`specs/changes/[TICKET-ID]_backend.md`

Use **`[TICKET-ID]` = US id from the enriched spec** when the source is `specs/user-stories/US-<id>-*.md` (e.g. `US-001`, `US-020`). For Jira-driven plans, use the issue key. If neither applies, use a short slug (e.g. `SPEC-local-auth`).

## Template: Backend Implementation Plan

### 1. Header

- Title: `# Backend Implementation Plan: [TICKET-ID] [Feature name]`

### 2. Overview

- Scope, out-of-scope, relation to ATS domain (vacancies, applications, etc.).

### 3. Architecture context

- NestJS **module(s)** affected under `ATS/apps/backend` (e.g. `jobs`, `applications`).
- New/changed **controllers**, **services**, **DTOs**, **guards**, **Prisma/schema** (if applicable).
- Multi-tenant: how `tenant_id` is enforced on every read/write.
- **SRP (always):** list the **inbound use cases** (interfaces / tokens) this ticket introduces or changes and confirm **one service class per use case** (or justify exception). Controllers must depend only on those use cases, not on Prisma.

### 3.1 Admin / CRUD entity checklist (mandatory when the story asks for an admin screen)

If the ticket describes **admin UI**, **CRUD**, **ABM**, or **entity maintenance**, the plan **must** include:

1. **All five use cases** with exact **TypeScript interface names** and method style (`execute` vs `query`):
   - `Create{Entity}UseCase`, `Update{Entity}UseCase`, `Delete{Entity}UseCase`, `Find{Entity}ByIdUseCase`, `Search{Entities}UseCase`.
2. **All outbound ports** (ISP): at minimum separate ports for create/update/delete/findById/search persistence (names must be listed).
3. **One service class per use case** implementing exactly one inbound port.
4. **File tree** listing **every file to create or modify** under `ATS/apps/backend`, following:
   - `api/`, `application/ports/in`, `application/ports/out`, `application/services`, `domain/`, `infrastructure/persistence/`
   - kebab-case file names, PascalCase types (see `docs/07`).
5. **REST mapping table**: HTTP method + path → use case for each of the five operations.
6. **Search contract**: document every **filter query param**, **pagination** (`page`, `pageSize` or cursor), **sort** fields, and response shape (items + total or next cursor).

Skip this subsection only if the ticket explicitly **does not** introduce an admin-managed entity (document why in one line).

### 4. API contract

- Method, path under `/api/v1/...`, request/response shapes, status codes, error shape (reference `docs/07`).

### 5. Implementation steps

#### Step 0: Branch (mandatory)

- From latest `main`: `git pull origin main` → `git checkout -b feature/[TICKET-ID]-short-slug`
- If **coupled feature**: use **one shared branch** name agreed with frontend (see workflow).

#### Steps 1…N

For each step:

- **Files** under `ATS/apps/backend/...` (and `ATS/packages/shared` if types are shared).
- **Action** (what to implement).
- **Tests** (Jest): cases to cover (happy path, validation, auth/tenant isolation, errors).

#### Step N+1: Documentation (mandatory)

- Update **`docs/08.data.md`** if the schema changes.
- Update **`docs/06` / `docs/07`** if architecture or API contract changes.
- Add **ADR** snippet or update **`docs/13.architecture_decision_records.md`** if the decision is structural.
- Follow `specs/.agents/rules/documentation-standards.mdc` (Spanish for product docs is OK).

### 6. Testing checklist

- `pnpm` commands from `ATS/` (lint, test, build for affected packages).
- Manual checks if any (e.g. Keycloak role).

### 7. Security and compliance

- AuthZ, tenant isolation, PII/logging.

### 8. Dependencies / migrations

- New npm packages (justify); Prisma migrations order if used.

### 9. Verification

- CI must pass; no secrets committed; PR targets **`main`**.
