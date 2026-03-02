## Phase 4.12 (v4.19) — Roads: MaxRoadLevel + movement bonus

### Canon constants
- `MaxRoadLevel = 3`
- Road levels are **L1..L3** (no levels above 3).
- If a tile has `DamagedRoad`, it is treated as **no road** for **both**:
  - movement bonus
  - NetworkBonus connectivity / RoadLevelSum

### Road movement bonus (chosen rule: +1 Move per road level)
When a unit **starts a movement action** from a tile with an **undamaged road**:
- it receives a temporary movement bonus for that action:
  - `MoveBonus = RoadLevel` (L1=+1, L2=+2, L3=+3)
- Effective movement for that action:
  - `EffectiveMove = BaseMove + MoveBonus`

Constraints:
- Bonus applies **only** if the **start tile** has an undamaged road.
- Bonus does **not** stack across steps; it is computed once at the start of that movement action.
- Bonus does not change terrain `MoveCost`; it only increases available Move points for the action.
- If the unit starts on a non-road tile (or DamagedRoad), `MoveBonus = 0`.

### Where to place
Add a subsection in `docs/04_economy/Network.md`:
- near the definition of roads / RoadLevelSum / DamagedRoad
- and cross-link to `docs/04_economy/Infrastructure_Costs.md`
