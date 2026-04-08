# Update documentation

After code or architecture changes, update the **canonical docs** in this repository.

## Follow

1. Read **`specs/.agents/rules/documentation-standards.mdc`** for paths and language rules.
2. Map changes to files:
   - Architecture / decisions → `docs/06.*`, `docs/07.*`, `docs/13.architecture_decision_records.md`
   - Data model → `docs/08.data.md`
   - Infra / deploy → `docs/09.*`, `docs/10.*`, `ATS/README.md`
   - Process / branches → `workflows/development_workflow.md`, `docs/12.development_and_contribution.md`
   - Reusable template / Simon Brown guide → `guides/`
3. Keep **Mermaid** diagrams valid; link related PRs or issues in prose when useful.
4. Do not duplicate: prefer one source of truth and cross-links.

If the change is small, a single focused edit is enough; if it is structural, add or update an **ADR**.
