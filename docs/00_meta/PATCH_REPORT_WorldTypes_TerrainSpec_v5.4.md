# PATCH REPORT — World_Types_and_Terrain_Distribution_Spec v5.3 → v5.4

**Date:** 2026-03-04
**Scope:** Deterministic attemptSeed derivation, WILD constraint enforcement clarification, post-MVP override clarification
**Schema changes:** NONE
**Mechanics changes:** NONE

---

## 1) What Changed

### Deterministic attemptSeed (§3.5.1 — NEW)

**Problem:** v5.3 used magic seed offsets: `seed = match_seed + retryCount` and `seed = match_seed + MAX_RETRIES + 1`. These are simple but not cryptographically robust — adjacent seeds may produce correlated maps.

**Solution:** Replaced with deterministic hash-based derivation:

```
attemptSeed = Hash32(match_seed, world_type_id, attempt_index)
```

Using FNV-1a 32-bit hash. Properties:
- Same `match_seed` + same `world_type_id` + same `attempt_index` → always identical seed → identical map.
- No hidden randomness, no nondeterministic fallback.
- `attempt_index` starts at 0 (main generation) and increments on retry.
- Fallback (BALANCED config) uses `attempt_index = MAX_RETRIES + 1`.

### WILD constraint enforcement clarified (§3.5)

**Problem:** v5.3 specified WILD PLAIN >= 25% retry logic but didn't explicitly state the enforcement mechanism type.

**Decision:** Post-validation + full regeneration (option b from task spec).

**Rationale:**
- Generator does NOT modify terrain in-place (no tile swapping).
- After terrain assignment (Step 3), `plainRatio = PLAIN_tiles / LAND_tiles` is checked.
- If violated → full regeneration with next `attemptSeed`.
- In-place adjustment would break LAND connectivity and cluster shapes.
- Post-validation + retry = simplest, most deterministic approach.

### Post-MVP override clarified (§1.2, §12.3)

**Change:** Clarified that world_type override (post-MVP "Advanced Settings") is an **input parameter** to the generation function, NOT stored in MatchState. Uses same `attemptSeed(match_seed, world_type_id, attempt_index)` derivation.

---

## 2) Why It Changed

- **attemptSeed:** Original `match_seed + offset` formula was fragile. Hash-based derivation ensures uncorrelated seeds across attempts. Explicit pseudocode enables exact implementation without ambiguity.
- **WILD enforcement:** Making the mechanism explicit (post-validation, not pre-constraint or in-place) prevents implementer confusion. Documents the design decision and rationale.
- **Override:** Clarifying "input parameter, not stored" prevents future schema creep.

---

## 3) Sections Changed

| Section | Change |
|---------|--------|
| §1.2 (post-MVP note) | Updated to reference attemptSeed §3.5.1 |
| §3.5 (WILD enforcement) | Rewritten: added mechanism description, rationale for post-validation |
| §3.5.1 (NEW) | attemptSeed function: FNV-1a pseudocode, properties, determinism guarantees |
| §3.5.2 (NEW) | Validation + retry algorithm with attemptSeed |
| §12.3 | Added attemptSeed reference, clarified post-MVP override as input parameter |
| Change Log | Added v5.4 entry |

---

## 4) Files Modified

| File | Change type |
|------|------------|
| `docs/03_map/World_Types_and_Terrain_Distribution_Spec.md` | v5.3 → v5.4. attemptSeed, WILD enforcement, override clarification |
| `docs/00_meta/CHANGELOG.md` | v5.4 entry |
| `docs/00_meta/PATCH_REPORT_WorldTypes_TerrainSpec_v5.4.md` | This file (NEW) |

---

## 5) Verification

### PASS/FAIL Table

| # | Check | Result |
|---|-------|--------|
| 1 | attemptSeed pseudocode present in §3.5.1 | PASS |
| 2 | FNV-1a hash used (not simple addition) | PASS |
| 3 | No magic `seed = match_seed + retryCount` remaining | PASS |
| 4 | WILD enforcement explicitly stated as post-validation | PASS |
| 5 | No in-place terrain modification mentioned | PASS |
| 6 | world_type is derived, not stored (§12.3 confirmed) | PASS |
| 7 | Post-MVP override = input parameter, not schema field | PASS |
| 8 | No schema files changed | PASS |
| 9 | No new terrain types introduced | PASS |
| 10 | Tile_Style_Bible ref in Map_Design_Spec.md | PASS |
| 11 | Tile_Style_Bible ref in World_Generation_Spec.md | PASS |
| 12 | Tile_Style_Bible ref in Map_Visual_Spec.md | PASS |
| 13 | Version bumped v5.3 → v5.4 | PASS |
| 14 | Change Log updated | PASS |

### Grep Checklist

| Command | Expected | Actual |
|---------|----------|--------|
| `grep "attemptSeed" World_Types_and_Terrain_Distribution_Spec.md` | >= 4 | 8 matches |
| `grep "match_seed + retryCount" World_Types_and_Terrain_Distribution_Spec.md` (live code, not changelog) | 0 | 0 (1 in changelog = historical ref, OK) |
| `grep "match_seed + MAX_RETRIES" World_Types_and_Terrain_Distribution_Spec.md` | 0 | 0 |
| `grep "FNV-1a" World_Types_and_Terrain_Distribution_Spec.md` | >= 1 | 2 |
| `grep "post-validation" World_Types_and_Terrain_Distribution_Spec.md` | >= 1 | 3 |
| `grep -r "world_type" schemas/` | 0 | 0 |
| `grep "tropical\|volcanic\|atoll\|fertile" World_Types_and_Terrain_Distribution_Spec.md` | 0 | 0 |
| `grep "Tile_Style_Bible" Map_Design_Spec.md` | >= 1 | 2 |
| `grep "Tile_Style_Bible" World_Generation_Spec.md` | >= 1 | 2 |
| `grep "Tile_Style_Bible" Map_Visual_Spec.md` | >= 1 | 1 |
