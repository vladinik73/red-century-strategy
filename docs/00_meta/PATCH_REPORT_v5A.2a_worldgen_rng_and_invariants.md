# PATCH REPORT v5A.2a — WorldGen RNG Fix + Missing Invariants

## Summary

Fixes critical P0 bugs in `@redage/core` runtime worldgen discovered during Phase 5A.2 deep audit:

1. **RNG normalization** — `createSeededRng()` returned raw uint32 `[0, 2^32)` but was consumed as float `[0, 1)` in 6+ call sites, causing broken land generation, empty resource maps, and identical worlds regardless of config.
2. **Missing WILD PLAIN constraint** — `validateWorld` did not enforce Canon §3.5 (PLAIN ≥ 25% of LAND for WILD world type).
3. **Missing continent/island count validation** — `validateWorld` did not check `meta.continentCount` / `meta.islandCount` against config ranges.

No gameplay mechanics, docs, or schemas were changed.

## Root Cause

`createSeededRng()` implemented Mulberry32 correctly (returns uint32), but the return type was `() => number` with no `.uint32()` method. All callers — noise permutation, shuffle, lerp, threshold comparisons — used the raw uint32 output as if it were a float in [0, 1). Since `rng() > 0.35` was always true (uint32 >> 1), every tile was LAND, every threshold passed, and world type configs had zero effect.

Two workarounds in `generateWorld.ts` masked the bug:
- `if (true)` center fallback (always ran, regardless of landmask quality)
- `edgeDist(x, y) >= 5` catch-all (forced all interior tiles to LAND)

## Files Modified

| Path | Change |
|------|--------|
| `packages/core/src/rng/createSeededRng.ts` | New `SeededRng` interface: `rng()` → float `[0,1)`, `rng.uint32()` → raw uint32 |
| `packages/core/src/worldgen/generateWorld.ts` | Fixed all call sites: `createNoise2D(rng.uint32)`, `shuffle(arr, rng.uint32)`, `rng()` for float ops, `rng.uint32()` for modulo; removed `edgeDist` catch-all; conditional center fallback |
| `packages/core/src/worldgen/deriveWorldType.ts` | `rng.uint32() % 100` instead of `(rng() >>> 0) % 100` |
| `packages/core/src/worldgen/validateWorld.ts` | Added `ValidateWorldOptions`, `ValidateWorldResult` types; WILD PLAIN ≥ 25% (hard); continent/island range (soft warnings) |
| `packages/core/src/createMatch.ts` | Pass `{ worldType, config }` to `validateWorld` |
| `packages/core/src/index.ts` | Export `SeededRng` type |

## Tests Modified / Added

| Path | Description |
|------|-------------|
| `tests/worldgen.determinism.test.ts` | 4 tests: same-seed hash, different-seed divergence, seed=0, stability |
| `tests/worldgen.invariants.test.ts` | 4 tests: capitals, resources, China edge, city count |
| `tests/worldgen.retry.test.ts` | 2 tests: basic retry + range of seeds |
| `tests/worldgen.worldtype_variation.test.ts` | **NEW** — 5 tests: config differentiation, PANGAEA≠ARCHIPELAGO, deriveWorldType distribution, WILD override, resource placement |
| `tests/worldgen.wild_constraint.test.ts` | **NEW** — 7 tests: WILD PLAIN reject/accept/skip, createMatch WILD, continent/island warnings |

## Call Site Classification

| Pattern | Was | Now | Why |
|---------|-----|-----|-----|
| `createNoise2D(rng)` | uint32 as permutation | `createNoise2D(rng.uint32)` | Noise permutation needs integer |
| `shuffle(arr, rng)` | uint32 as Fisher-Yates | `shuffle(arr, rng.uint32)` | Shuffle needs integer modulo |
| `lerp(a, b, rng())` | uint32 as interpolant | `lerp(a, b, rng())` | Now correct: float [0,1) |
| `rng() < threshold` | uint32 > any float | `rng() < threshold` | Now correct: float comparison |
| `(rng() >>> 0) % N` | Worked but misleading | `rng.uint32() % N` | Explicit uint32 for modulo |

## Validation Changes

| Constraint | Type | Trigger |
|-----------|------|---------|
| WILD PLAIN ≥ 25% | **Hard** (causes retry) | `worldType === "WILD"` |
| Continent count in config range | **Soft** (warning only) | `config` provided |
| Island count in config range | **Soft** (warning only) | `config` provided |

Continent/island counts are soft because the current value-noise generator cannot reliably produce 4–6 separate continents within MAX_RETRIES=5. These will become hard constraints once the generator gains multi-octave continent seeding.

## Known Issues (Not Fixed — Separate Tasks)

1. **World config `landThreshold` inversion**: PANGAEA `[0.55, 0.7]` produces LESS land than ARCHIPELAGO `[0.25, 0.45]` because the comparison is `noise > threshold` (higher threshold = less land). Config values need to be swapped for intended behavior. This is a game design decision, not a code bug.
2. **Noise quality**: Value noise at current frequencies produces 1–2 large blobs, not the 4–6 distinct continents expected by BALANCED/CONTINENTAL configs. Perlin/Simplex noise or multi-octave seeding would improve geographic variety.

## Verification

```
pnpm -C packages/core typecheck  ✅ clean
pnpm -C packages/core test       ✅ 30/30 passed
pnpm -C packages/core build      ✅ clean
```
