## tile.schema.json — Terrain enum + River feature (T1+R1)

**Goal:** minimal terrain set + river as non-gameplay visual/seed feature.

### Required terrain_type enum (T1)
- `PLAIN`
- `FOREST`
- `MOUNTAIN`
- `DESERT`
- `WATER`

### River (R1)
Add boolean field:
- `is_river` (default false)

Rule:
- A "river tile" is a `WATER` tile with `is_river = true`.
- No gameplay impact (movement/combat/resources) beyond being water; used for generation + visuals.
