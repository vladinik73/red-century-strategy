## Phase 4.12 (v4.19) — Movement costs by terrain

### Canon: Base MoveCost table
Movement uses **Move points** (unit stat `Move`).
Moving into an adjacent tile spends `MoveCost(terrain)`.

| Terrain | MoveCost |
|---------|----------|
| PLAIN   | 1 |
| FOREST  | 2 |
| MOUNTAIN| 2 |
| DESERT  | 1 |
| WATER   | 1 (naval only) |

### Notes
- There is **no** separate river terrain. River is `WATER + is_river=true` and uses the WATER row.
- Roads do **not** change `MoveCost`; they provide a `MoveBonus` (see Network rules).
- If a unit has insufficient remaining Move points to pay the next tile’s MoveCost, it cannot enter that tile.

### Where to place
Insert this as a dedicated subsection in `docs/03_map/Map_Generation.md` (terrain rules section).
