### Patch: schemas/README.md — add v4.22 notes

Append a short note under match/tile/player schema sections:
- match: `has_acted_this_turn` replaces `has_moved` + `has_attacked`
- cities: `territory_radius` present (1..5)
- player: `stability_boost_used_this_turn`
- tile: `port_level` is canonical; `has_port` removed; `road_damaged_turns_left` max=2
