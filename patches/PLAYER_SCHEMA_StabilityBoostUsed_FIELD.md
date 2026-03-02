### Patch: Player per-turn counter `stability_boost_used_this_turn` (v4.22)

In `schemas/player.schema.json`, add:

```json
"stability_boost_used_this_turn": {
  "type": "boolean",
  "default": false,
  "description": "Per-turn flag: Stability boost (50→+2 or 100→+5) can be used at most once per civ turn. Reset at start of civ turn."
}
```
