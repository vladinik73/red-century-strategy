# PATCH REPORT — World-Type Topology: Soft Targets Clarification (docs-only)

## Summary

Corrects the hard/soft classification of continent and island count constraints across all world types. Previously (v5.5) PANGAEA islands were marked as "hard" (retry on violation). Now:

- **PANGAEA continents = 1** remains **HARD** (retry on violation)
- **All island counts** (every world type, including PANGAEA 5–10) are **SOFT targets** (warning only, no retry)
- **All continent counts** (except PANGAEA = 1) are **SOFT targets** (warning only, no retry)

This is a **docs-only** change. No code, schemas, or game mechanics modified.

## Motivation

- Island counts are **flavor variability** — the generator should not fail/retry because it produced 4 islands instead of 5. Retrying on island mismatch slows generation without meaningful gameplay benefit.
- Continent ranges for non-PANGAEA types (BALANCED 4–6, CONTINENTAL 3–4, etc.) are also flexible targets — minor deviations don't break gameplay.
- Only PANGAEA continents = 1 is a true identity constraint: if there are 2 continents, it's not PANGAEA.
- Code (`validateWorld.ts`) already implements this correctly: continent/island counts produce `warnings` (soft), and PANGAEA continents=1 produces a hard `reason` (retry). Docs were inconsistent.

## Files Modified

| File | Section(s) | Change |
|------|-----------|--------|
| `docs/03_map/World_Types_and_Terrain_Distribution_Spec.md` | §2.5, §4.2, §4.3, §10, version, changelog | Islands: `(hard)` → `(soft)` everywhere. Continents: `(soft)` added to non-PANGAEA rows. Note rewritten: only PANGAEA continents=1 is hard. v5.5 → v5.6 |
| `docs/03_map/World_Generation_Spec.md` | §2.2, §2.4, §3.2, §3.9 | Topology table: continent/island → soft target (except PANGAEA=1 hard). §3.2 validation pseudocode: FAIL → WARN for soft. §3.9: continent/island counts moved from HARD to SOFT section, PANGAEA=1 stays hard |
| `docs/03_map/Map_Generation.md` | PvE params, §6 Validate | PvE params: soft/hard labels. §6: separated HARD (PANGAEA=1) from SOFT (all other counts) |

## Canon Locations

| Claim | Document | Section |
|-------|----------|---------|
| PANGAEA continents=1 is HARD | World_Types_and_Terrain_Distribution_Spec.md | §2.5, §4.2, §4.3 |
| All island counts are SOFT | World_Types_and_Terrain_Distribution_Spec.md | §4.2 note, §4.3 |
| Non-PANGAEA continent counts are SOFT | World_Types_and_Terrain_Distribution_Spec.md | §4.2 |
| Validation: hard vs soft split | World_Generation_Spec.md | §3.2, §3.9 |
| Map_Generation sync | Map_Generation.md | PvE params, §6 |

## Not Changed

- `validateWorld.ts` (code) — already implements this correctly (soft warnings for counts, hard for PANGAEA=1)
- `worldConfigs.ts` (code) — ranges unchanged
- `SOURCE_OF_TRUTH.md` — does not mention continent/island ranges directly
- No schema changes
- No game mechanics changes

## Verification

All three target docs updated. Language is consistent: "soft target" for all island/continent ranges, "HARD" only for PANGAEA continents=1. Matches existing code behavior.
