# PATCH REPORT v5A.2_prep — Fix Ajv validation + hygiene cleanup

**Date:** 2026-03-04  
**Repository:** /Users/vladimirnikolsky/Documents/GitHub/red-century-strategy

---

## Why

- Replace stub validation with real Ajv-based schema validation against `schemas/match.schema.json`
- Add tests proving invalid state fails and valid state passes
- Remove legacy root `src/` (placeholders only)
- Stop tracking test build artifacts in `packages/ai/tests/`
- Add minimal repo hygiene markers for generated files

---

## What changed

### A) Ajv-based validator

- **packages/core/src/validation/validateMatchState.ts**
  - Uses Ajv v8 + ajv-formats
  - Loads schemas via JSON import (bundleable for browser; no Node fs at runtime)
  - Adds player and tile schemas with `$id` for `$ref` resolution
  - Returns `{ ok: true } | { ok: false; errors: string[] }`
  - Fast precheck: state is object and not null

### B) Tests

- **packages/core/tests/validateMatchState.test.ts**
  - Valid minimal MatchState passes
  - Invalid: tiles_flat length ≠ 6400, missing players, invalid event_type in events
  - Null and non-object fail with clear errors

### C) Root src/ hygiene

- **Deleted:** entire `src/` directory (README placeholders only; no real code)

### D) AI test artifacts

- **.gitignore:** added `**/tests/*.js`, `**/tests/*.js.map`, `**/tests/*.d.ts`, `**/tests/*.d.ts.map`
- **git rm --cached:** removed tracked `packages/ai/tests/smoke.test.js`, `.js.map`, `.d.ts`, `.d.ts.map`
- Physical artifact files removed from disk

### E) Generated file markers

- **.gitattributes:** `packages/core/src/types/generated/** linguist-generated=true`

### F) Dependencies

- **packages/core/package.json:** added `ajv-formats: ^3.0.0`

### G) Web store

- **packages/web/src/store/gameStore.ts:** updated to use valid MatchState shape (meta, turn, players, map, etc.) instead of legacy placeholder

---

## Verification summary

| Command | Result |
|---------|--------|
| pnpm install | PASS |
| pnpm -r typecheck | PASS |
| pnpm -r test | PASS |
| pnpm -r build | PASS |

---

## Files changed (summary)

- Modified: `packages/core/src/validation/validateMatchState.ts`, `packages/core/package.json`, `packages/web/src/store/gameStore.ts`, `.gitignore`
- Created: `packages/core/tests/validateMatchState.test.ts`, `.gitattributes`, `docs/00_meta/PATCH_REPORT_v5A.2_prep.md`
- Deleted: `src/` (entire directory)
- Removed from git: `packages/ai/tests/smoke.test.{js,js.map,d.ts,d.ts.map}`
