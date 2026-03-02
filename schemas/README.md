# Schemas

Здесь можно хранить JSON-черновики сущностей для синхронизации между docs и кодом.

## tile.schema.json (v4.10)

Назначение: формальная структура одной клетки карты (tile) для генерации/хранения match state.

Ключевые поля:
- coords: `x`, `y`
- terrain: `terrain_base` (LAND/WATER), `terrain_type` (вода без разделения на COAST)
- resources: `resource_type` (MONEY/SCIENCE), `resource_remaining`, `resource_yield_per_turn`, `harvest_started`, `harvest_owner_civ_id`
- infrastructure: `road_level`, `road_owner_civ_id`, `road_damaged_turns_left`, `has_port`, `port_owner_civ_id`
- city/territory: `city_id`, `territory_city_id`, `territory_owner_civ_id`
- visibility: `visibility[10]` (0=UNEXPLORED, 1=VISIBLE)

Примечания:
- Мост — это дорога на WATER-тайле (`terrain_base=WATER` и `road_level>0`). Ограничение «мост можно строить только если между сушей 1 тайл воды» — правило геймплея (см. Map_Generation.md), не схема.
- Видимость — permanent reveal (см. `docs/03_map/Visibility.md`).
