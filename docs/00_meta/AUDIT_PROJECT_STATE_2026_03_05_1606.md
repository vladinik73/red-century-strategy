# Project Audit — Thu Mar  5 16:06:34 EET 2026

## Repo
- pwd: /Users/vladimirnikolsky/Documents/GitHub/red-century-strategy
- git toplevel: /Users/vladimirnikolsky/Documents/GitHub/red-century-strategy
- branch: main
- head: 250c7be

## Git status
```
## main...origin/main
?? docs/00_meta/AUDIT_PROJECT_STATE_2026_03_05_1606.md
```

## Last 10 commits
```
250c7be (HEAD -> main, origin/main, origin/HEAD) core: v5A.2 runtime worldgen MVP (Option A)
2f9d9e3 map 5.4
e020a76 map 5.3
192443f map 5.2
c7ffa3d maps 5.1
8f787dc 5.1с
3a04efb core: stabilize public type API
64ccfba code 5.2
4709bc5 code 6.1
600e9f3 coding
```

## Workspace checks (pnpm)
```
v22.12.0
9.15.0

npm warn exec The following package was not found and will be installed: pnpm@10.30.3
Scope: 5 of 6 workspace projects
packages/core typecheck$ tsc -p tsconfig.json --noEmit
packages/core typecheck: Done
packages/ai typecheck$ tsc -p tsconfig.json --noEmit
packages/server typecheck$ tsc -p tsconfig.json --noEmit
packages/server typecheck: Done
packages/ai typecheck: Done
packages/web typecheck$ tsc -p tsconfig.json --noEmit
packages/web typecheck: Done

npm warn exec The following package was not found and will be installed: pnpm@10.30.3
Scope: 5 of 6 workspace projects
packages/core test$ vitest run
packages/core test:  RUN  v2.1.9 /Users/vladimirnikolsky/Documents/GitHub/red-century-strategy/packages/core
packages/core test:  ✓ tests/public_api_types.test.ts (1 test) 6ms
packages/core test:  ✓ tests/determinism.test.ts (1 test) 2ms
packages/core test:  ✓ tests/validateMatchState.test.ts (6 tests) 65ms
packages/core test:  ✓ tests/worldgen.retry.test.ts (1 test) 80ms
packages/core test:  ✓ tests/worldgen.invariants.test.ts (1 test) 89ms
packages/core test:  ✓ tests/worldgen.determinism.test.ts (1 test) 215ms
packages/core test:  Test Files  6 passed (6)
packages/core test:       Tests  11 passed (11)
packages/core test:    Start at  16:06:46
packages/core test:    Duration  1.29s (transform 496ms, setup 0ms, collect 3.23s, tests 458ms, environment 1ms, prepare 852ms)
packages/core test: Done
packages/server test$ vitest run
packages/ai test$ vitest run
packages/ai test:  RUN  v2.1.9 /Users/vladimirnikolsky/Documents/GitHub/red-century-strategy/packages/ai
packages/server test:  RUN  v2.1.9 /Users/vladimirnikolsky/Documents/GitHub/red-century-strategy/packages/server
packages/ai test:  ✓ tests/smoke.test.ts (1 test) 4ms
packages/server test:  ✓ tests/smoke.test.ts (1 test) 4ms
packages/ai test:  Test Files  1 passed (1)
packages/ai test:       Tests  1 passed (1)
packages/ai test:    Start at  16:06:48
packages/ai test:    Duration  872ms (transform 77ms, setup 0ms, collect 47ms, tests 4ms, environment 0ms, prepare 148ms)
packages/server test:  Test Files  1 passed (1)
packages/server test:       Tests  1 passed (1)
packages/server test:    Start at  16:06:48
packages/server test:    Duration  873ms (transform 50ms, setup 0ms, collect 46ms, tests 4ms, environment 0ms, prepare 197ms)
packages/server test: Done
packages/ai test: Done
packages/web test$ vitest run
packages/web test:  RUN  v2.1.9 /Users/vladimirnikolsky/Documents/GitHub/red-century-strategy/packages/web
packages/web test:  ✓ tests/smoke.test.ts (1 test) 2ms
packages/web test:  Test Files  1 passed (1)
packages/web test:       Tests  1 passed (1)
packages/web test:    Start at  16:06:49
packages/web test:    Duration  715ms (transform 131ms, setup 0ms, collect 285ms, tests 2ms, environment 0ms, prepare 72ms)
packages/web test: Done

npm warn exec The following package was not found and will be installed: pnpm@10.30.3
Scope: 5 of 6 workspace projects
packages/core build$ tsc -p tsconfig.json
packages/core build: Done
packages/server build$ tsc -p tsconfig.json
packages/ai build$ tsc -p tsconfig.json
packages/server build: Done
packages/ai build: Done
packages/web build$ vite build
packages/web build: vite v6.4.1 building for production...
packages/web build: transforming...
packages/web build: ✓ 896 modules transformed.
packages/web build: rendering chunks...
packages/web build: computing gzip size...
packages/web build: dist/index.html                               0.32 kB │ gzip:   0.24 kB
packages/web build: dist/assets/Filter-GHvoie3L.js                0.90 kB │ gzip:   0.48 kB
packages/web build: dist/assets/BufferResource-YaSHyPlC.js       10.60 kB │ gzip:   2.79 kB
packages/web build: dist/assets/webworkerAll-CajBOlNz.js         11.97 kB │ gzip:   3.96 kB
packages/web build: dist/assets/CanvasRenderer-B8i8Zhqv.js       23.34 kB │ gzip:   7.28 kB
packages/web build: dist/assets/WebGPURenderer-B_r5SE22.js       39.09 kB │ gzip:  10.96 kB
packages/web build: dist/assets/browserAll-DDGDtUaf.js           41.49 kB │ gzip:  10.90 kB
packages/web build: dist/assets/RenderTargetSystem-tkeGtRGI.js   46.33 kB │ gzip:  12.81 kB
packages/web build: dist/assets/WebGLRenderer-DL8JbL52.js        68.60 kB │ gzip:  18.82 kB
packages/web build: dist/assets/index-B8E_F1B8.js               581.39 kB │ gzip: 178.81 kB
packages/web build: ✓ built in 4.69s
packages/web build: (!) Some chunks are larger than 500 kB after minification. Consider:
packages/web build: - Using dynamic import() to code-split the application
packages/web build: - Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
packages/web build: - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
packages/web build: Done
```

## Key file presence
```
OK  docs/03_map/Tile_Style_Bible.md
OK  docs/03_map/Tile_Asset_List.md
OK  docs/03_map/Tile_Asset_Production_Spec.md
OK  docs/03_map/Tile_Generation_Prompts.md
OK  docs/03_map/World_Types_and_Terrain_Distribution_Spec.md
OK  docs/03_map/Map_Design_Spec.md
OK  docs/03_map/World_Generation_Spec.md
OK  docs/10_uiux/Map_Visual_Spec.md
OK  docs/13_engine/Map_Generator_Architecture.md
OK  packages/core/src/createMatch.ts
```

## Reference checks (Tile_Style_Bible links)
```

FILE: docs/03_map/World_Types_and_Terrain_Distribution_Spec.md
841:| docs/03_map/Tile_Style_Bible.md | Canonical visual style, palette and tile design rules |

FILE: docs/03_map/Map_Design_Spec.md
3:Канон: `World_Generation_Spec.md`, `Map_Visual_Spec.md`, `Map_Overlays.md`, `Visibility.md`, `Territory_Rules.md`, `Design_System.md`, `PROJECT_IDENTITY.md`, `Tile_Style_Bible.md`.
5:> **Tile visuals source of truth:** Конкретные правила визуального стиля тайлов (палитра, пропы, silhouettes, shading) — в [`docs/03_map/Tile_Style_Bible.md`](Tile_Style_Bible.md). Данный документ определяет rendering pipeline и layout; Tile_Style_Bible определяет *look*.

FILE: docs/03_map/World_Generation_Spec.md
609:- Визуальные токены terrain и пропы определяются в `Map_Design_Spec.md` и `Map_Visual_Spec.md`. Конкретный стиль тайлов (палитра, shading, silhouettes) — в `Tile_Style_Bible.md`.
896:| `Tile_Style_Bible.md` | Tile visual style rules: palette, shading, props, silhouettes |

FILE: docs/10_uiux/Map_Visual_Spec.md
5:> **Tile visuals:** Конкретный стиль тайлов (палитра, пропы, shading, silhouettes) — см. [`docs/03_map/Tile_Style_Bible.md`](../03_map/Tile_Style_Bible.md). Rendering pipeline и layout — в [`docs/03_map/Map_Design_Spec.md`](../03_map/Map_Design_Spec.md).
```

## World types spec: attemptSeed sanity
```
46:> **Примечание (post-MVP):** явный выбор world_type может быть добавлен позже в «Advanced Settings». Если реализован — CDF-выбор пропускается, world_type передаётся как **input parameter** к генератору (не сохраняется в schema). Seed генерации: `attemptSeed(match_seed, world_type_id, attempt_index)` (§3.5.1) — полностью детерминирован.
315:function attemptSeed(match_seed: u32, world_type_id: u8, attempt_index: u8): u32 {
330:- Одинаковые `match_seed` + `world_type_id` + `attempt_index` → **всегда одинаковый** attemptSeed → идентичная карта.
342:  seed = attemptSeed(match_seed, world_type_id, attempt_index)
352:  // else: retry with next attempt_index → different attemptSeed
357:  seed = attemptSeed(match_seed, world_type_id, MAX_RETRIES + 1)
791:**Deterministic generation seed:** world_type_id (index 0–4) передаётся в `attemptSeed(match_seed, world_type_id, attempt_index)` (§3.5.1). Тот же match_seed + тот же world_type → тот же attemptSeed → идентичная карта.
807:| ~~5~~ | ~~WILD: нижний предел PLAIN (≥ 25%)?~~ | **Resolved (v5.3, refined v5.4):** Hard constraint. Post-validation после terrain assignment: `PLAIN/LAND ≥ 0.25`. Нарушение → retry с `attemptSeed(match_seed, world_type_id, attempt_index)` (до 5), затем fallback на BALANCED config (§3.5) |
831:| v5.4 | 2026-03-04 | Deterministic attemptSeed: replaced magic `seed = match_seed + retryCount` with `attemptSeed = Hash32(match_seed, world_type_id, attempt_index)` via FNV-1a (§3.5.1). WILD constraint clarified: post-validation + full regen (not in-place adjustment) (§3.5). Post-MVP override clarified as input parameter (§1.2, §12.3). No schema/mechanics changes |
```

## Schemas: ensure world_type not stored
```
```

## Engine worldgen entrypoints
```
32:export function createMatch(input: CreateMatchInput): MatchState {
packages/core/src/worldgen/attemptSeed.ts
packages/core/src/worldgen/deriveWorldType.ts
packages/core/src/worldgen/generateWorld.ts
packages/core/src/worldgen/index.ts
packages/core/src/worldgen/types.ts
packages/core/src/worldgen/validateWorld.ts
packages/core/src/worldgen/worldConfigs.ts
```

## Done
- Report: docs/00_meta/AUDIT_PROJECT_STATE_2026_03_05_1606.md
