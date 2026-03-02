## v4.14 — Phase 4.7 (Terrain T1+R1, Infrastructure Costs, Unit Sight)

- Terrain приведён к T1: PLAIN/FOREST/MOUNTAIN/DESERT/WATER; реки = WATER + `is_river=true` (R1).
- Добавлен канон стоимости инфраструктуры: `docs/04_economy/Infrastructure_Costs.md` (дороги/мосты/порт).
- Введён параметр `Sight` для типов юнитов; определён стартовый юнит A2 (StarterScout) с Sight=2.
- Schemas синхронизированы с каноном (terrain enum, unit.sight, city level max=5, diplomacy casing).
---
