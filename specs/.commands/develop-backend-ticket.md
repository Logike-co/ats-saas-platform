# Develop backend ticket

Implement a backend ticket for **LTI ATS** in **`ATS/apps/backend`** (NestJS).

# Input

`$ARGUMENTS` — ticket id, link to issue, or path to `specs/changes/*_backend.md` plan.

# Rules

1. Understand the problem from the ticket and/or the plan in `specs/changes/`.
2. Search the codebase under **`ATS/`**; respect `specs/.agents/rules/architecture-standards.mdc`.
3. **Branch**: from latest **`main`** — `git pull origin main` → `git checkout -b feature/[id]-slug`. For a **coupled** feature, use the **same branch** as frontend.
4. Implement with **TDD** where practical; run **`pnpm`** lint/test/build from **`ATS/`** for the backend package (`@lti-ats/backend`).
5. Update **`docs/`** when behaviour, data model, or API contract changes (see `specs/.commands/update-docs.md`).
6. Stage only files belonging to this ticket; **commit message in English** (Conventional Commits).
7. Push and open a **PR to `main`** with **`gh`**. Title/description should reference the ticket id.
8. Ensure **CI** passes (`ATS/.github/workflows/ci.yml`).

# Deliverables

- Code + tests + doc updates as needed.
- PR link reported to the user.
