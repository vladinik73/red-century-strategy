# Engineering Guardrails (Cursor)

## 1) No mechanics invention
Cursor must not invent or “complete” rules. Missing pieces are blocking issues to raise.

## 2) Prefer validation over assumptions
If a rule is stated as an invariant, implement runtime validation and fail fast in dev/test.

## 3) Determinism
Where outcomes depend on randomness:
- Use seeded RNG where possible
- Keep RNG isolated and testable
- Document seed handling in code comments

## 4) Data boundaries
- Do not hardcode balance values in code unless docs say so.
- Prefer data-driven configs (json/yaml) **only if repo already uses them**.

## 5) Backwards compatibility
If you must change save formats / schemas:
- version them
- provide migration
- add tests

## 6) Performance notes
Avoid premature optimization; add profiling hooks if requested.

## 7) Turn pipeline integrity
Any change that touches turn order or victory checks must:
- reference `docs/01_overview/Turn_Pipeline.md`
- include an integration test that simulates a full round
