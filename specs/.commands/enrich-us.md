# Enrich user story

Improve a user story or ticket so it is **ready for planning and implementation** on **LTI ATS**.

# Input

`$ARGUMENTS` — ticket id, link, **path to a markdown file** in the repo, or pasted story text.

# Steps

1. **Load context**
   - If Jira (or similar) MCP is available and the user gave an id, fetch the ticket.
   - If the user gave a **local path** (e.g. `docs/...`, `specs/...`), read that file and **do not** require MCP.
   - Use `docs/01.context.md`, `docs/02.functional_summary.md`, and `workflows/development_workflow.md` as product references.

2. **Product + technical clarity**
   - Ensure **actors** (recruiter, hiring manager, admin, candidate) and **goal** are explicit.
   - Add **acceptance criteria** (Given / When / Then) where useful.
   - For data-heavy stories, reference or list **fields**, **states**, and **tenant** expectations (see `docs/08.data.md`).
   - For UI stories, describe **screens**, empty/loading/error states, and **Spanish** copy expectations (no Vaadin — stack is **Next.js**).
   - For API-dependent stories, list **endpoints** or contract expectations under `/api/v1` (coordinate with backend).

3. **Autonomy**
   - The enriched story must be enough for `plan-backend-ticket` / `plan-frontend-ticket` without guesswork.

4. **Output**
   - Return the **improved story in Markdown** (clear headings, lists).
   - If the user asked to **persist** the result, write to a file under `specs/changes/` or append to the ticket description in the tracking tool **using standard Markdown only** (no Jira wiki macros if the tool breaks formatting).

5. **Optional mockup**
   - Only if the user explicitly wants a visual: generate or attach a simple mockup; **do not** assume Vaadin theming — use neutral / product-appropriate UI. Skip if no image tooling is available.

6. **Workflow**
   - If your tracker has columns, move the item according to team rules (e.g. from “To refine” to “Ready for planning”) when that was requested.

# Notes

- **Multi-tenant** and **audit** requirements should be called out when the story touches candidate data or status changes.
- Coupled backend+frontend work should be **flagged** so planning uses **one branch / one PR** (see `workflows/development_workflow.md`).
