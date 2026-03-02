## Phase 4.12 (v4.19) — Schema caps for roads/ports

Update `schemas/tile.schema.json` to enforce numeric caps:

- `road_level` must be an integer in **[0..3]**.
- If you have `port_level` on tile: it must be an integer in **[0..3]**.
- If `port_level` is not a tile field (but a city field), instead ensure the **city** schema caps it to 3.

Also ensure schemas align with docs:
- If `DamagedRoad` is represented via `road_damaged_turns_left` (0..2), keep as-is.

Self-check:
- Validate JSON
- Ensure `additionalProperties: false` remains.
