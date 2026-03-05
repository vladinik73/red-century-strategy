# PATCH REPORT v5A.2b — WorldGen Landmask Quality

## Summary

Improves worldgen landmask quality and fixes landThreshold inversion:

1. **landThreshold inversion fix** — ARCHIPELAGO now has higher threshold (more water), PANGAEA lower (more land). Added comment: "higher threshold => less land".
2. **fBm (multi-octave) noise** — Replaced single-octave value noise with `fbm2` (5 octaves, lacunarity 2.0, gain 0.5) for landmask. Deterministic, fast, pure TS.
3. **Majority-neighbors smoothing** — 1 iteration on binary LAND/WATER mask (≥4 of 8 neighbors => land).
4. **Removed forcing fallback** — No more center-forcing when preFilterLand < MIN_LAND; retry handles bad seeds.
5. **Tests** — ARCHIPELAGO waterShare > CONTINENTAL; BALANCED createMatch succeeds for 20 seeds.

No gameplay mechanics changed. Continent/island counts remain soft (warnings) until generator reliably hits ranges.

## Files Modified

| Path | Change |
|------|--------|
| `packages/core/src/worldgen/worldConfigs.ts` | Fixed landThreshold: BALANCED [0.4,0.55], CONTINENTAL [0.3,0.5], ARCHIPELAGO [0.45,0.6], PANGAEA [0.25,0.45]; added "higher threshold => less land" comment |
| `packages/core/src/worldgen/generateWorld.ts` | Added `fbm2` helper; use fbm2 for landmask; normalized noise input; 1-iter majority smoothing; removed MIN_LAND center fallback |
| `packages/core/tests/worldgen.worldtype_variation.test.ts` | ARCHIPELAGO waterShare > CONTINENTAL; removed inversion NOTE; added BALANCED 20-seed test |

## landThreshold Logic

`isLand = noise > threshold` → higher threshold = less land.

| Type | landThreshold | Target land % |
|------|---------------|---------------|
| ARCHIPELAGO | [0.45, 0.6] | 30–45% (more water) |
| BALANCED | [0.4, 0.55] | 45–60% |
| CONTINENTAL | [0.3, 0.5] | 60–75% |
| PANGAEA | [0.25, 0.45] | 60–70% |
| WILD | [0.35, 0.65] | 35–70% (wide) |

## fBm Parameters

- Octaves: 5
- Lacunarity: 2.0
- Gain: 0.5
- Normalized to [0, 1]

## Deferred

- **Strict continent/island validation**: Generator does not yet reliably produce 4–6 continents / 5–10 islands for BALANCED within MAX_RETRIES. Kept as soft warnings. Can be made hard once landmask quality is further tuned.

## Verification

```
pnpm -r typecheck  ✅
pnpm -r test       ✅ 31/31 passed
pnpm -r build      ✅
```
