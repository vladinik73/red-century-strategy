## Schemas — sync notes (v4.22)
- Match Unit per-turn action flag: `has_acted_this_turn: boolean` is canonical schema field.
  - It **replaces** legacy `has_moved` + `has_attacked`.
  - This matches gameplay canon: **1 action per unit per turn** (move/attack/heal/disband/etc).
- Player per-turn counter: `stability_boost_used_this_turn: boolean` (reset at start of civ turn).
- City territory: `territory_radius` is stored in match city object (1..5). Canon cap: `MaxTerritoryRadius = 5`.
- Tile ports: use `port_level: 0..3`. Do **not** keep a separate `has_port` boolean.
- Tile damaged road timer: `road_damaged_turns_left: 0..2`.
