# Enrich user story

Improve a user story or ticket so it is **ready for planning and implementation** on **LTI ATS**.

# Where detail lives (PMV backlog)

The **Product Backlog index** is `docs/14.product_backlog.md` (epics, order, one-line summaries, dependencies). **Do not** paste full acceptance criteria, API contracts, and Gherkin for every US into that file: it becomes hard to review and merge.

**Recommended model (hybrid):**

1. **Persist** the enriched story to **`specs/user-stories/US-<id>-<slug>.md`** (see `specs/user-stories/README.md` and `_template.md`).
2. **Optionally sync the index:** when the user asks to **update the backlog** / **link from 14** / **sync Detalle**, update **only** the matching row in `docs/14.product_backlog.md`: set the **Detalle** column to `[Spec](../specs/user-stories/US-xxx-slug.md)` (replace `—` for that US id).

**Other options (when to use):**

| Approach | When |
| :--- | :--- |
| **Only edit `docs/14`** | Rare: quick one-line tweak to summary or dependency; never the full enriched spec. |
| **Tracker only (Jira)** | Team uses Jira as source of truth; paste Markdown description there and keep `docs/14` Detalle linking to Jira or leave `—`. |
| **Batch: “enrich all MVP US”** | Still one file per US; run enrich per id or epic in order of dependencies (Wave 0 → 1 → …). |

# Input

`$ARGUMENTS` — one or more of:

- **Path** to an existing spec: `specs/user-stories/US-020-gestionar-vacantes-abm.md`
- **Backlog + id:** e.g. `docs/14.product_backlog.md US-020` or `US-020` with explicit instruction to load context from `docs/14.product_backlog.md`
- **Jira** (or similar) ticket id when MCP is available
- **Pasted** story text in the chat

# Steps

1. **Load context**
   - If a **local path** to `specs/user-stories/*.md` is given, read it as the base to improve.
   - If **`docs/14.product_backlog.md` + US id**, read the backlog, locate the row for that id, and treat the table row as the **skeleton** (title, epic, dependencies).
   - If **Jira** MCP is available and the user gave an id, fetch the ticket.
   - Always use `docs/01.context.md`, `docs/02.functional_summary.md`, `docs/08.data.md` when the story touches domain or data, and `docs/07.code_and_technical_design.md` for API/CRUD patterns.
   - Use `workflows/development_workflow.md` for coupled BE+FE and trunk-based notes.

2. **Product + technical clarity**
   - Ensure **actors** (recruiter, hiring manager, admin, candidate) and **goal** are explicit.
   - Add **acceptance criteria** (Given / When / Then) where useful.
   - For data-heavy stories, reference **fields**, **states**, and **tenant** expectations (`docs/08.data.md`).
   - For UI stories, describe **screens**, empty/loading/error states, and **Spanish** copy expectations (stack is **Next.js**).
   - For API-dependent stories, add a **Contrato API** section: `/api/v1`, methods, stable error codes, tenant rules (align with `docs/02.functional_summary.md` and `docs/07`).
   - For **admin CRUD** stories, state that backend follows the **five use cases** profile; for **Kanban**, keep board behavior and transitions explicit and separate from ABM wording (`docs/14.product_backlog.md` troceo section).

3. **Autonomy**
   - The enriched story must be enough for **`plan-backend-ticket`** / **`plan-frontend-ticket`** when passed **`specs/user-stories/US-….md`** as input, without guesswork.

4. **Output and persist**
   - Always produce the **improved story in Markdown** in the response (clear headings, lists).
   - **If the user asked to persist** (or did not forbid writing files):
     - **Write or update** `specs/user-stories/US-<id>-<slug>.md` using structure aligned with `specs/user-stories/_template.md`.
     - **Naming:** `US-020-gestionar-vacantes-abm.md` — id from backlog, `slug` in kebab-case, ASCII preferred for filenames.
   - **If the user asked to sync the backlog / update Detalle in 14:** edit `docs/14.product_backlog.md` so the row for that **US id** has `Detalle` = `[Spec](../specs/user-stories/US-xxx-slug.md)` (path relative to `docs/`).
   - Optional legacy path: append-only or one-off notes under `specs/changes/` **only** if the user explicitly requests that location instead of `specs/user-stories/`.

5. **Optional mockup**
   - Only if the user explicitly wants a visual: generate or attach a simple mockup; use neutral / product-appropriate UI. Skip if no image tooling is available.

6. **Workflow**
   - If your tracker has columns, move the item according to team rules (e.g. from “To refine” to “Ready for planning”) when that was requested.

# Notes

- **Multi-tenant** and **audit** requirements should be called out when the story touches candidate data or status changes.
- Coupled backend+frontend work should be **flagged** in metadata so planning uses **one branch / one PR** (`workflows/development_workflow.md`).
- **Project Manager** agent: keep `docs/14` and `specs/user-stories/` aligned when priorities or dependencies change (`specs/.agents/project-manager.md`).
