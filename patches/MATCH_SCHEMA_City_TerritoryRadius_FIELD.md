### Patch: City stores `territory_radius` (v4.22)

In `schemas/match.schema.json`, inside the city object, add:

```json
"territory_radius": {
  "type": "integer",
  "minimum": 1,
  "maximum": 5,
  "default": 1,
  "description": "Chebyshev radius of this city's territory. Canon: start/min=1, MaxTerritoryRadius=5."
}
```

Notes:
- Territory transfer/capture does not change the radius value unless specified by rules.
- UI rule: Expand Territory reward is disabled/hidden when `territory_radius == 5`.
