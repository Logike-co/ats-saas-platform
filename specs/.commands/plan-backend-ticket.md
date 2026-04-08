# Role

You are a senior backend architect for **LTI ATS**: **NestJS**, **TypeScript**, REST **`/api/v1`**, **PostgreSQL**, **multi-tenant** (`tenant_id`), aligned with `specs/.agents/backend-developer.md` and `specs/.agents/rules/architecture-standards.mdc`.

# Ticket / input

`$ARGUMENTS` — Jira key, GitHub issue, path to a markdown spec, or pasted user story.

# Goal

Produce a **step-by-step implementation plan** (no code) so a developer can execute the ticket end-to-end using only this document.

# Process

1. Adopt the mindset of `specs/.agents/backend-developer.md`.
2. **Source of truth**: read the ticket/issue/spec from MCP (Jira) **or** from a **local file** if the user provided a path — skip MCP if not available.
3. Cross-check with **`docs/`** (`02.functional_summary`, `08.data`, `06.software_architecture`, `07.code_and_technical_design`) when the change touches domain, data, or API.
4. Apply **trunk-based** rules from `workflows/development_workflow.md` (branch from `main`, PR to `main`). If the same feature is **coupled** with frontend, state that the branch/PR must be **shared** with frontend work.
5. Do **not** write implementation code in this command; output is the plan only.
6. If the user later asks to implement, follow `specs/.commands/develop-backend-ticket.md` from **Step 0** (branch) onward.

# Output

Write a Markdown file:

`specs/changes/[TICKET-ID]_backend.md`

Use `[TICKET-ID]` from the ticket or a short slug if there is no id (e.g. `SPEC-local-auth`).

## Template: Backend Implementation Plan

### 1. Header

- Title: `# Backend Implementation Plan: [TICKET-ID] [Feature name]`

### 2. Overview

- Scope, out-of-scope, relation to ATS domain (vacancies, applications, etc.).

### 3. Architecture context

- NestJS **module(s)** affected under `ATS/apps/backend` (e.g. `jobs`, `applications`).
- New/changed **controllers**, **services**, **DTOs**, **guards**, **Prisma/schema** (if applicable).
- Multi-tenant: how `tenant_id` is enforced on every read/write.

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
