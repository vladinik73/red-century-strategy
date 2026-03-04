# PATCH REPORT — Map_Design_Spec.md v5.0 → v5.1

**Date:** 2026-03-04
**Author:** Claude (automated spec hardening)
**Target file:** `docs/03_map/Map_Design_Spec.md`
**Previous version:** v5.0
**New version:** v5.1

---

## What Changed

### Fix 1: BASE_TILE_SIZE canonicalized (96px)

- **Removed** "open question" status from §2.1. The note now states `BASE_TILE_SIZE = 96` as canonical.
- **Removed** Open Question #1 ("Финальный BASE_TILE_SIZE") from the Open Questions section.
- All dependent values (safe zones, prop margins, border thickness, LOD thresholds) reference `BASE_TILE_SIZE` as the single source of truth.

### Fix 2: River visual stroke width

- **Replaced** `"Ширина реки | 1 тайл"` with a visual stroke specification in §8.2.
- River data remains 1 tile (`is_river = true` on WATER tile), but **visually** the river is rendered as a centerline stroke with width = 0.25–0.35 × BASE_TILE_SIZE.
- Added LOD scaling rules: thinner at LOD-1 (14–24px), wider at LOD-2 (24–34px).
- Updated `overlay_river.png` asset description in §5.1 to match.
- Bridge/road layering confirmed: RoadLayer [3] > RiverLayer [2].

### Fix 3: Coastline bitmask simplified

- **Replaced** the 256-variant plan in §7.4 with an **8-fragment MVP** approach.
- 4 cardinal edge strips + 4 diagonal corner fills = 8 sprite fragments.
- 4-bit edge mask (N/E/S/W) → 16 possible combinations, all covered by compositing fragments.
- Added explicit acceptance criteria for coastline quality.
- Added `coast/` subfolder to asset naming conventions (§5.2).
- Post-MVP upgrade path: 16 pre-rendered combinations or 47 marching-squares variants.

### Fix 4: Prop density safety (≤30% coverage)

- **Added** rule in §4.2: "Total prop coverage area per tile MUST NOT exceed 30% of tile area."
- Added `Max prop size` column to props table with per-terrain pixel limits.
- Added compile-time assertion formula for asset validation.
- Updated safe zone (§4.4) to explicitly exclude badge zone and road centerline from prop placement.

### Fix 5: Territory border visual hardened

- **Updated** §3.2 palette entries: border alpha → 60–80%, territory fill alpha → 8–15% (strict ceiling).
- **Added** §3.5 "Territory border rendering rules" with:
  - Thickness formula: `max(1, round(BASE_TILE_SIZE / 48))` px
  - Alpha ranges per state (normal, selected)
  - Anti-mush rule (no duplicate edges)
  - Per-terrain alpha recommendation (80% on DESERT for amber faction contrast)
- Updated territory border asset description in §5.1.

### Fix 6: NEW §11 — Tile Variants

- **Added** complete section defining 16 terrain variants (4+4+3+3+2).
- Deterministic variant selection via `fnv1a(tileIndex * 31 + seed * 17 + 0xBEEF) % variantCount`.
- Atlas impact: ~147 KB (7% of 2048×2048 budget).
- No additional draw calls (same atlas, batching preserved).
- Updated terrain base assets in §5.1 from single sprites to variant patterns.
- Updated naming conventions in §5.2.

### Fix 7: NEW §12 — Edge Blending / Transitions

- **Added** complete section defining 5 terrain transition types + 12 overlay sprites.
- MVP approach: 8px strips along cardinal edges, determined by neighbor terrain type.
- LOD-0: disabled. LOD-1+: rendered in CoastlineLayer.
- Batching impact: +1 draw call (~11–16 total, within budget).
- Added `blends/` subfolder to asset naming conventions.

### Additional changes

- Acceptance criteria expanded: #16 (prop coverage), #17 (territory borders), #18 (coastline smooth), #19 (tile variants), #20 (edge blending).
- Open Questions renumbered (§11 → §13). Resolved: tile size (OQ #1), river style (OQ #3), coastline scope (OQ #9). 7 remaining.
- Version bumped from v5.0 → v5.1.
- Change Log section added at end of document.

---

## Why It Changed

| Fix | Root Cause | Impact |
|-----|-----------|--------|
| 1 (Tile size) | "Open question" status blocked implementation — every dependent metric was uncertain | All layout math now deterministic |
| 2 (River width) | "1 tile wide" river = entire 96px square flooded = visually wrong for a narrow river | Rivers now look like water arteries, not lakes |
| 3 (Coastline) | 256-variant plan was unimplementable in MVP timeline | 8 fragments = feasible first pass, smooth enough for Polytopia style |
| 4 (Prop density) | No explicit cap → artists could create props that obscure gameplay elements | 30% ceiling protects unit/resource readability |
| 5 (Territory borders) | No alpha spec → risk of "color mush" where borders overpower terrain | Strict 60–80% alpha + thickness formula prevents mush |
| 6 (Tile variants) | Single sprite per terrain → visible tiling repetition on large maps | 16 variants break the pattern at negligible atlas cost |
| 7 (Edge blending) | Hard 1px terrain boundaries → visible stair-stepping at LOD-1 | 8px gradient strips smooth transitions, Polytopia-appropriate |

---

## Remaining Open Questions (max 3)

| # | Question | Risk | Recommendation |
|---|---------|------|---------------|
| 1 | **River stroke width calibration:** 0.25–0.35 range may need adjustment after first art pass. Is the range too wide? | Low — adjustable at runtime | Keep range. Let art lead pick exact value. |
| 2 | **Edge blending: diagonal transitions?** MVP skips diagonals. Will corner stitching artifacts be noticeable? | Medium — visible at LOD-2 on PLAIN↔WATER corners | Monitor during art pass. Add diagonal blends in v5.2 if needed. |
| 3 | **Prop coverage 30%: FOREST trees overlap.** 3 trees at 32×50 each may exceed 30% visible area. Rely on Z-overlap or reduce to 2 max? | Low — overlap naturally reduces visible area | Cap at 2 trees + 1 small prop for FOREST. Validate with rendered test. |

---

## Checklist: Required Fix → Section Updated

| Fix # | Description | Sections Updated | Status |
|-------|------------|-----------------|--------|
| 1 | Canonicalize BASE_TILE_SIZE = 96px | §2.1 (note rewritten), §13 (OQ #1 removed) | ✅ DONE |
| 2 | River visual stroke width | §8.2 (full rewrite), §5.1 (river overlay asset) | ✅ DONE |
| 3 | Simplify coastline to 8-fragment MVP | §7.4 (full rewrite + sprite table + acceptance criteria) | ✅ DONE |
| 4 | Prop density ≤30% rule | §4.2 (rule + max sizes), §4.4 (safe zone update + badge/road exclusion) | ✅ DONE |
| 5 | Territory border alpha/thickness | §3.2 (palette), §3.5 (new), §5.1 (border asset) | ✅ DONE |
| 6 | Add Tile Variants section | §11 (new), §5.1 (terrain assets → variants), §5.2 (naming) | ✅ DONE |
| 7 | Add Edge Blending section | §12 (new), §5.2 (naming + blends/ folder) | ✅ DONE |

---

## Consistency Notes

- **No gameplay changes.** Document remains visual/rendering only.
- **No schema changes.** tile.schema.json, city.schema.json unmodified.
- **No contradictions** with World_Generation_Spec.md, Map_Visual_Spec.md, Territory_Rules.md, Visibility.md, Map_Generation.md.
- **Performance budget preserved:** additional sprites fit within 2048×2048 atlas, draw calls within 11–16 range.
- **Polytopia style preserved:** flat shading, bright colors, minimal textures, clean silhouettes.
