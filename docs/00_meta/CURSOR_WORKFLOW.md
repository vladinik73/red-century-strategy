# Cursor Workflow — “Claude designs, Cursor ships”

This repo is developed with a two-layer AI workflow:
- **Claude**: designs & audits rules, updates canon docs
- **Cursor**: implements code that matches canon, adds tests and tooling

## A) Operating model

### A1. Canon first
1. Claude writes/updates docs in `docs/`
2. Cursor implements code to match docs

### A2. PR-based development
- Branch naming:
  - `feature/<short-name>`
  - `fix/<short-name>`
  - `refactor/<short-name>`
  - `chore/<short-name>`
- Every branch ends in a PR to `development` (then merged to `main` by release cadence).

### A3. What goes where
- Rules, mechanics, formulas, invariants: `docs/`
- Serialization/contracts: `schemas/`
- Implementation: `src/`
- Tests: `tests/`
- Design decisions (if needed): `docs/00_meta/ADR_###.md` (only when asked)

## B) “Definition of Done” for Cursor tasks
A task is done only if:
- Code matches canon docs (cite doc paths + headers)
- Tests cover the change (unit or integration)
- Invariants validation exists where appropriate
- No unrelated changes in the same PR

## C) How to handle ambiguity
If docs do not specify:
- formulas
- constraints
- ordering of operations
- tie-breakers
- edge cases

Then Cursor must:
1. Report the ambiguity with exact doc path and heading
2. Propose 2–3 safe options
3. Implement only after canon is clarified (or implement behind a feature flag if explicitly requested)

## D) Change hygiene
### D1. Commit messages (suggested)
- `feat: ...`
- `fix: ...`
- `refactor: ...`
- `test: ...`
- `chore: ...`
- `docs: ...`

### D2. PR description template
Use `.github/PULL_REQUEST_TEMPLATE.md`.

## E) Quick checklist
- [ ] Linked canon docs
- [ ] No rule invention
- [ ] Tests included
- [ ] Validation for invariants where needed
- [ ] Changelog entry if your process requires it
