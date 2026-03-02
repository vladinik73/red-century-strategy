## v4.22 — Phase 4.14 (Schema Sync)
- Schema sync: unit action flags → `has_acted_this_turn` (replaces `has_moved` + `has_attacked`) in match state.
- Schema: cities include `territory_radius` (1..5) to match Territory rules.
- Schema: player state includes `stability_boost_used_this_turn` (per-turn counter).
- Schema: tile ports use `port_level` (0..3); remove redundant `has_port`.
- Schema: `road_damaged_turns_left` constrained to max 2.
