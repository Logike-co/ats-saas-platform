# Role

You are a senior frontend architect for **LTI ATS**: **Next.js 14+** (App Router), **React**, **TypeScript** under `ATS/apps/frontend`, consuming REST **`/api/v1`**, aligned with `specs/.agents/frontend-developer.md` and `specs/.agents/rules/frontend-standards.mdc`.

# Ticket / input

`$ARGUMENTS` — **must** resolve to the **enriched user story** for this work item.

**Canonical source (default workflow):** path to **`specs/user-stories/US-<id>-<slug>.md`** produced by **`specs/.commands/enrich-us.md`**. Example: `specs/user-stories/US-011-nextauth-tenant-session.md`. The backlog index `docs/14.product_backlog.md` lists each US and links to its spec in the **Detalle** column.

**Fallback (only when no enriched file exists yet):** Jira/GitHub id via MCP, another local markdown path, or pasted story text — in that case, note in the plan that **`enrich-us` should run first** next time so `specs/user-stories/` becomes the source of truth.

# Goal

Produce a **step-by-step implementation plan** (no code) so a developer can execute the ticket end-to-end using only this document.

# Process

1. Adopt the mindset of `specs/.agents/frontend-developer.md`.
2. **Source of truth:** read **`specs/user-stories/US-*.md`** when `$ARGUMENTS` is (or resolves to) that path. Use **Metadata** (id, **Acoplado BE+FE**, dependencies), **Historia**, **Criterios de aceptacion**, **UI / UX**, **Contrato API** (consumo desde FE), and **Notas tecnicas**. If **UI / UX** or metadata indicates **no frontend scope**, produce a minimal plan that states **no FE changes** and why (still name the output file for traceability). Optionally skim **`docs/14.product_backlog.md`** for order context. Use **MCP (Jira)** or ad-hoc input only when no enriched US exists — avoid MCP if not configured.
3. Align with **`docs/`** and agreed **API contract** (coordinate with backend plan if the feature is coupled).
4. **Trunk-based**: branch from `main`, PR to `main` (`workflows/development_workflow.md`). For **coupled** backend+frontend features, use **one branch and one PR** with shared scope.
5. Output plan only — no implementation in this command.
6. Implementation phase: `specs/.commands/develop-frontend-ticket.md`.

# Output

Write a Markdown file:

`specs/changes/[TICKET-ID]_frontend.md`

Use **`[TICKET-ID]` = US id from the enriched spec** when the source is `specs/user-stories/US-<id>-*.md` (e.g. `US-011`). For Jira-driven plans, use the issue key. If neither applies, use a short slug.

## Template: Frontend Implementation Plan

### 1. Header

- `# Frontend Implementation Plan: [TICKET-ID] [Feature name]`

### 2. Overview

- User-facing behaviour; Spanish copy guidelines for UI text.

### 3. Architecture context

- **Routes** under `ATS/apps/frontend/app/...`
- **Server vs Client Components** choice
- Data fetching (`fetch` to `NEXT_PUBLIC_API_URL`, caching, revalidation)
- Shared types: `ATS/packages/shared` if applicable
- **SRP:** name the components/hooks/modules involved and how responsibilities are split (presentation vs data vs validation); avoid a single oversized module unless justified — see `docs/05.design_principles.md` and `specs/.agents/rules/frontend-standards.mdc`

### 4. Implementation steps

#### Step 0: Branch

- `git pull origin main` → `git checkout -b feature/[TICKET-ID]-short-slug`
- Same branch as backend if **coupled** feature.

#### Steps 1…N

- Components, layouts, forms (**zod** validation where needed)
- Loading / error / empty states
- Accessibility (labels, focus, semantics)

#### Step N+1: Documentation

- Update `docs/` if user flows or screenshots in docs change
- `specs/.agents/rules/documentation-standards.mdc`

### 5. Testing

- **Vitest** for pure logic; **Playwright** when E2E exists in repo
- Manual checklist for critical paths

### 6. API integration

- Endpoints used; error handling; auth/session (NextAuth + Keycloak when wired)

### 7. Verification

- Lint/build/test from `ATS/`; PR to **`main`**; CI green
