# PATCH REPORT v5A.2 — Runtime WorldGen MVP

## Summary

Phase 5A.2 implements runtime world generation (Option A) in `@redage/core`. `createMatch({ seed, worldTypeOverride? })` produces a valid `MatchState` with 80×80 map, terrain, cities, and resources.

## Files

| Path | Description |
|------|-------------|
| packages/core/src/worldgen/types.ts | WorldTypeId, WorldConfig, WorldGenResult |
| packages/core/src/worldgen/attemptSeed.ts | FNV-1a Hash32 |
| packages/core/src/worldgen/deriveWorldType.ts | CDF weighted selection |
| packages/core/src/worldgen/worldConfigs.ts | Per-world-type configs |
| packages/core/src/worldgen/generateWorld.ts | Full pipeline |
| packages/core/src/worldgen/validateWorld.ts | Invariant checks |
| packages/core/src/createMatch.ts | createMatch with retry |
| packages/core/tests/worldgen.*.test.ts | Determinism, invariants, retry |

## Pipeline

Landmask → Regions → Terrain → Rivers → Cities → Resources → Validate

## Invariants

- tiles_flat.length === 6400, LAND ≥ 2000
- 8 capitals, Chebyshev ≥ 10, cities ≥ 50
- ≥1 MONEY + ≥1 SCIENCE per capital territory

## Verification

pnpm -r typecheck && pnpm -r test && pnpm -r build
