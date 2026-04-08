# Develop frontend ticket

Implement a frontend ticket for **LTI ATS** in **`ATS/apps/frontend`** (Next.js App Router).

# Input

`$ARGUMENTS` — ticket id, issue link, optional **Figma URL**, and/or path to `specs/changes/*_frontend.md`.

# Rules

1. Read the ticket and/or plan in `specs/changes/`. If a **Figma URL** is provided, use it as the visual reference; if not, follow the written spec and existing UI patterns in the repo.
2. Follow `specs/.agents/rules/frontend-standards.mdc` and `specs/.agents/frontend-developer.md`.
3. **Branch**: from **`main`** (`git pull origin main` → `git checkout -b feature/[id]-slug`). Use the **shared branch** for **coupled** backend+frontend features.
4. Prefer **Server Components** when possible; **Client Components** when interactivity or browser APIs are required.
5. Call the API via **`NEXT_PUBLIC_API_URL`** → `/api/v1/...`; handle loading and errors; **Spanish** user-visible strings.
6. Run lint/test/build for the frontend workspace from **`ATS/`** (`pnpm` filters as documented in `ATS/README.md`).
7. Update **`docs/`** if user-facing flows documented there change.
8. Stage only ticket-related files; **commit message in English**; push; **PR to `main`** via **`gh`**.
9. **CI** must be green.

# Optional: feedback on rules

If the user gives process feedback, propose updates to `specs/.agents/rules/frontend-standards.mdc` **only after explicit approval** (same spirit as the previous Figma-focused version).

# Deliverables

- UI implementation + tests if applicable.
- PR link for review.
