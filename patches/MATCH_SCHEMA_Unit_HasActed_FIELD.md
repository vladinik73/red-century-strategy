### Patch: Unit action flags → `has_acted_this_turn` (v4.22)

In `schemas/match.schema.json`, inside the unit object:
1) Remove legacy fields (if present):
- `has_moved`
- `has_attacked`

2) Add:
```json
"has_acted_this_turn": {
  "type": "boolean",
  "default": false,
  "description": "Per-unit per-turn action flag. True after the unit performs its single action for the turn (move, attack, heal, disband, special). Replaces legacy has_moved/has_attacked."
}
```

3) Ensure any unit reset logic in schema comments/docs refers to `has_acted_this_turn`.
