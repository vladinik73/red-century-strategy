## Schemas sync (v4.14)

### 1) tile.schema.json
- terrain_type enum → T1: PLAIN/FOREST/MOUNTAIN/DESERT/WATER
- add `is_river: boolean` (default false)

### 2) unit.schema.json
- add required integer field `sight` (min 1, max 4)

### 3) match.schema.json
- city.level.maximum → 5 (канон City_Levels / SOT)
- diplomacy state enum casing привести к единому виду (рекомендуется UPPERCASE: WAR/NEUTRAL/ALLIANCE), синхронизировать с player.schema.json.

### 4) player.schema.json
- если отличается casing — синхронизировать с match.schema.json (UPPERCASE).
