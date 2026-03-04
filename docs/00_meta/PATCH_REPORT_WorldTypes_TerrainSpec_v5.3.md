# PATCH REPORT — World_Types_and_Terrain_Distribution_Spec v5.2 → v5.3

**Date:** 2026-03-04
**Scope:** OQ closure, weight locking, WILD constraint enforcement, Tile_Style_Bible cross-references
**Schema changes:** NONE
**Mechanics changes:** NONE

---

## 1) What Changed

### OQ#2 — UI choice for world_type (RESOLVED)

**Decision:** MVP has **no dropdown** for world type. Player always gets Random.

**Changes:**
- §1.2: replaced "Альтернативный режим: игрок может выбрать" with "UI flow (MVP): нет выбора". Loading/Briefing screen reveals world type name + tooltip.
- §12.3: updated to reference Loading/Briefing instead of HUD.
- §13: OQ#2 struck through with rationale.

**Why:** Reduces UI complexity for MVP. World type is a surprise that adds replayability. Explicit choice deferred to post-MVP "Advanced Settings".

### OQ#3 — Spawn fairness weights (RESOLVED)

**Decision:** Balanced MVP profile, single set of weights for all world_types.

**Changes:**
- §9.2: expanded with `BALANCED_MVP` profile table (7 components × weight). Clearly labeled as "MVP defaults, calibrate after playtest".
- §13: OQ#3 struck through.

**Weights locked:**

| Component | Weight |
|-----------|--------|
| PLAIN in 3×3 | +3 |
| FOREST in 3×3 | +2 |
| DESERT in 3×3 | +1 |
| MOUNTAIN in 3×3 | −2 |
| WATER in 3×3 | −1 |
| Resources in 3×3 | +2 |
| Neutral cities ≤5 | +3 |

### OQ#5 — WILD PLAIN ≥ 25% (RESOLVED)

**Decision:** Hard constraint with retry + BALANCED fallback.

**Changes:**
- §2.6 WILD table: added `HARD MIN 25%` annotation on PLAIN row.
- §3.3 WILD: added "Hard constraint" + cross-ref to §3.5.
- NEW §3.5: full enforcement algorithm with pseudocode:
  1. After terrain assignment, check `PLAIN/LAND ≥ 0.25`
  2. If violated → retry with `seed = match_seed + retryCount`
  3. After MAX_RETRIES (5) → fallback to BALANCED config with `seed = match_seed + 6`
  4. Warning logged on fallback
- §13: OQ#5 struck through.

**Why:** PLAIN tiles are required for city placement and movement. Without hard minimum, WILD maps could be unplayable.

### OQ#6 — World type probabilities (RESOLVED)

**Decision:** Keep 30/20/20/15/15 for MVP.

**Changes:**
- §1.2: replaced simple `rng.next() % WORLD_TYPE_COUNT` with explicit weighted CDF algorithm:
  ```
  WEIGHTS = [30, 20, 20, 15, 15]
  CDF     = [30, 50, 70, 85, 100]
  roll = (rng.next() >>> 0) % 100
  world_type = WORLD_TYPES[ CDF.findIndex(c => roll < c) ]
  ```
- Added note: changing weights requires no schema changes.
- §12.3: updated pseudocode to match CDF.
- §13: OQ#6 struck through.

### Tile_Style_Bible cross-references (3 docs)

| Document | Change |
|----------|--------|
| `docs/03_map/Map_Design_Spec.md` | Added `Tile_Style_Bible.md` to canon line + "Tile visuals source of truth" callout |
| `docs/03_map/World_Generation_Spec.md` | Added reference in §7 (rendering) + Appendix cross-ref table |
| `docs/10_uiux/Map_Visual_Spec.md` | Added "Tile visuals" callout with links to Tile_Style_Bible + Map_Design_Spec |

---

## 2) Why It Changed

All changes close Open Questions from architect review. No new mechanics, terrain types, or schema modifications introduced.

- **OQ#2:** Simplifies MVP UI; world type surprise increases replayability
- **OQ#3:** Locks spawn fairness formula for implementation; single profile avoids over-engineering
- **OQ#5:** Prevents unplayable WILD maps; deterministic fallback preserves seed reproducibility
- **OQ#6:** Provides clear implementation spec for weighted random; easy to recalibrate post-playtest
- **Tile_Style_Bible links:** Ensures visual spec discoverability across 3 interconnected docs

---

## 3) Files Modified

| File | Change type |
|------|------------|
| `docs/03_map/World_Types_and_Terrain_Distribution_Spec.md` | v5.2 → v5.3. OQ closures, weights, §3.5, CDF algorithm |
| `docs/03_map/Map_Design_Spec.md` | Canon line + callout (Tile_Style_Bible ref) |
| `docs/03_map/World_Generation_Spec.md` | §7 + Appendix (Tile_Style_Bible ref) |
| `docs/10_uiux/Map_Visual_Spec.md` | Canon area callout (Tile_Style_Bible ref) |
| `docs/00_meta/CHANGELOG.md` | v5.3 entry |
| `docs/00_meta/PATCH_REPORT_WorldTypes_TerrainSpec_v5.3.md` | This file (NEW) |

---

## 4) Verification

### PASS/FAIL Table

| # | Check | Result |
|---|-------|--------|
| 1 | OQ#2 resolved (UI = Random only, Loading/Briefing reveal) | ✅ PASS |
| 2 | OQ#3 resolved (BALANCED_MVP weights locked in §9.2) | ✅ PASS |
| 3 | OQ#5 resolved (WILD PLAIN ≥ 25% hard constraint + fallback in §3.5) | ✅ PASS |
| 4 | OQ#6 resolved (30/20/20/15/15 + CDF in §1.2) | ✅ PASS |
| 5 | No schema files changed | ✅ PASS |
| 6 | Tile_Style_Bible ref in Map_Design_Spec.md | ✅ PASS |
| 7 | Tile_Style_Bible ref in World_Generation_Spec.md | ✅ PASS |
| 8 | Tile_Style_Bible ref in Map_Visual_Spec.md | ✅ PASS |
| 9 | No "tropical/volcanic/atoll" implying new terrain types | ✅ PASS |
| 10 | PANGAEA keeps Chebyshev distance ≥ 10 | ✅ PASS |
| 11 | All 6 OQs in §13 are struck through / resolved | ✅ PASS |
| 12 | Version bumped v5.2 → v5.3 | ✅ PASS |
| 13 | Change Log updated | ✅ PASS |

### Grep Checklist

| Command | Expected | Actual |
|---------|----------|--------|
| `grep -c "тропическ\|вулканическ\|fertile\|атолл" World_Types_and_Terrain_Distribution_Spec.md` | 0 | 0 ✅ |
| `grep -c "distance ≥ 8" World_Types_and_Terrain_Distribution_Spec.md` (live text, not strikethrough) | 0 | 0 ✅ |
| `grep -c "Tile_Style_Bible" Map_Design_Spec.md` | ≥ 1 | ✅ |
| `grep -c "Tile_Style_Bible" World_Generation_Spec.md` | ≥ 1 | ✅ |
| `grep -c "Tile_Style_Bible" Map_Visual_Spec.md` | ≥ 1 | ✅ |
| `grep "OQ.*Resolved" World_Types_and_Terrain_Distribution_Spec.md` | 6 resolved entries | ✅ |
| `grep -r "world_type" schemas/` | 0 matches (no schema changes) | ✅ |
| `grep "PLAIN.*25%" World_Types_and_Terrain_Distribution_Spec.md` | ≥ 2 (§2.6 + §3.3/§3.5) | ✅ |
| `grep "BALANCED_MVP" World_Types_and_Terrain_Distribution_Spec.md` | ≥ 1 | ✅ |
| `grep "CDF" World_Types_and_Terrain_Distribution_Spec.md` | ≥ 2 (§1.2 + §12.3) | ✅ |
