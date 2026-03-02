## Phase 4.12 (v4.19) — Numeric P0 closure (SOT)

Add / update the following constants in `docs/00_meta/SOURCE_OF_TRUTH.md`:

### Roads & Ports
- `MaxRoadLevel = 3`
- Road movement bonus: **+1 Move per road level** (L1=+1, L2=+2, L3=+3), applied **only if** the unit starts the movement action on an undamaged road tile.
- `MaxPortLevel = 3`

### Movement costs
- MoveCost: PLAIN=1, FOREST=2, MOUNTAIN=2, DESERT=1, WATER=1 (naval only)
- River is `WATER + is_river=true`

### Veterancy
- Tier-up at **3 total kills** → `MaxHP +2` (single tier in MVP)

Keep links to canonical docs:
- `docs/04_economy/Network.md`
- `docs/04_economy/Infrastructure_Costs.md`
- `docs/03_map/Map_Generation.md`
- `docs/06_combat/Veterancy_and_Serial.md`
