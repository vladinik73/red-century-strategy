# PATCH REPORT v5A.2b — WorldGen Landmask Quality + PANGAEA Single Continent

## Summary

Improves worldgen landmask quality, fixes landThreshold inversion, and enforces PANGAEA single-continent canon:

1. **landThreshold inversion fix** — ARCHIPELAGO higher threshold (more water), PANGAEA lower (more land). Comment: "higher threshold => less land (when using noise > threshold)".
2. **fBm (multi-octave) noise** — `fbm2` (5 octaves, lacunarity 2.0, gain 0.5) for landmask. Deterministic, pure TS.
3. **World-type shape params** — `edgeFalloffStrength`, `landmaskSmoothIterations`, `landmaskSmoothMajority` in WorldConfig. PANGAEA: low edge falloff, 0 smoothing. ARCHIPELAGO: stronger edge falloff, 0 smoothing.
4. **PANGAEA post-process** — Exactly 1 mainland (largest region ≥ minContinentSize) + islands. Fallback never adds continent-sized regions.
5. **validateWorld** — PANGAEA continents=1 HARD FAIL. Islands [5,10] soft for PANGAEA. Others soft.
6. **Tests** — `worldgen.pangaea_shape.test.ts`; PANGAEA landShare > ARCHIPELAGO; ARCHIPELAGO waterShare > BALANCED.

No gameplay mechanics changed. No forcing.

## Files Modified

| Path | Change |
|------|--------|
| `packages/core/src/worldgen/types.ts` | Added `edgeFalloffStrength`, `landmaskSmoothIterations`, `landmaskSmoothMajority` |
| `packages/core/src/worldgen/worldConfigs.ts` | Shape params per type; PANGAEA continentRange [1,1], islandRange [5,10], minIslandSize 5 |
| `packages/core/src/worldgen/generateWorld.ts` | Config-driven edge/smoothing; PANGAEA-specific region selection (1 mainland + islands) |
| `packages/core/src/worldgen/validateWorld.ts` | PANGAEA continents=1 HARD; others + islands soft |
| `packages/core/tests/worldgen.pangaea_shape.test.ts` | **NEW** — PANGAEA createMatch 10 seeds, generateWorld continents=1 |
| `packages/core/tests/worldgen.worldtype_variation.test.ts` | PANGAEA landShare > ARCHIPELAGO; ARCHIPELAGO waterShare > BALANCED |

## Verification

```
pnpm -r typecheck  ✅
pnpm -r test       ✅ 35/35 passed
pnpm -r build      ✅
```
