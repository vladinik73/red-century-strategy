### Patch: road_damaged_turns_left constrained to max 2 (v4.22)

In `schemas/tile.schema.json`, ensure:

```json
"road_damaged_turns_left": {
  "type": "integer",
  "minimum": 0,
  "maximum": 2,
  "default": 0
}
```
