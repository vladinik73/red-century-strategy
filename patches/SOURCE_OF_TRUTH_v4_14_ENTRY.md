# Source of Truth (v4.14 — Phase 4.7 Terrain+Infra+Sight)

## Terrain (T1+R1)
- `terrain_type` (T1): PLAIN / FOREST / MOUNTAIN / DESERT / WATER.
- River (R1): `is_river = true` на `WATER` тайле; gameplay-отличий от воды нет.

## Infrastructure Costs (v4.14)
Канон: `docs/04_economy/Infrastructure_Costs.md`
- Road L1: `1 ОД + 25 денег` за тайл.
- Road upgrade (per level): `1 ОД + 25 денег` за тайл.
- Bridge (1 WATER тайл): ×2 от дороги → `2 ОД + 50 денег`.
- Port L1: `3 ОД + 200 денег` (фикс).
- Port upgrade per level: `2 ОД + 150 денег` (фикс).

## Unit Sight (v4.14)
- У каждого типа юнита есть параметр `Sight` (видимость).
- StarterScout (A2) Sight = 2.
Канон: таблицы юнитов в `docs/07_units/*`.
