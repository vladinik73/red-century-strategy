# Schemas

Здесь можно хранить JSON-черновики сущностей для синхронизации между docs и кодом.

## Schema Sync Notes (v4.22)

- **match.schema / units**: `has_acted_this_turn: boolean` is canonical. Replaces legacy `has_moved` + `has_attacked`.
- **match.schema / cities**: `territory_radius: 1..5` (default 1, MaxTerritoryRadius=5).
- **player.schema**: `stability_boost_used_this_turn: boolean` (per-turn flag, reset at start of civ turn).
- **tile.schema / ports**: `port_level: 0..3` is canonical; `has_port` removed. `port_level >= 1` means port exists.
- **tile.schema / roads**: `road_damaged_turns_left: 0..2` (max=2 enforced).

## tile.schema.json (v4.14)

Назначение: формальная структура одной клетки карты (tile) для генерации/хранения match state.

Ключевые поля:
- coords: `x`, `y`
- terrain: `terrain_base` (LAND/WATER), `terrain_type` (T1: PLAIN/FOREST/MOUNTAIN/DESERT/WATER)
- `is_river`: boolean (WATER+is_river=true = river tile)
- resources: `resource_type` (MONEY/SCIENCE), `resource_remaining`, `resource_yield_per_turn`, `harvest_started`, `harvest_owner_civ_id`
- infrastructure: `road_level`, `road_owner_civ_id`, `road_damaged_turns_left`, `port_level`, `port_owner_civ_id`
- city/territory: `city_id`, `territory_city_id`, `territory_owner_civ_id`
- visibility: `visibility[10]` (0=UNEXPLORED, 1=VISIBLE)

Примечания:
- Мост — это дорога на WATER-тайле (`terrain_base=WATER` и `road_level>0`). Ограничение «мост можно строить только если между сушей 1 тайл воды» — правило геймплея (см. Map_Generation.md), не схема.
- Видимость — permanent reveal (см. `docs/03_map/Visibility.md`).

## player.schema.json (v4.11)

Схема состояния игрока/цивилизации (Player State), достаточная для:
- расчёта экономики (money/science/stability),
- выдачи и учёта ОД/AP,
- дипломатии (WAR/NEUTRAL/ALLIANCE + cooldown),
- победных таймеров,
- глобальных эффектов (например, «Сбой»).

Файл: `schemas/player.schema.json`

## unit.schema.json (v4.14)

Схема типа юнита. Добавлено поле `sight` (per unit type).

## match.schema.json (v4.25)

Canonical State Container для состояния партии (полный game state) + `events[]` как replay-log.

Ключевые решения:
- Карта: `tiles_flat` длиной 6400, индекс `i = y*80 + x`
- Отдельные массивы `cities[]` и `units[]`
- Дипломатия: список отношений `relations[]` (state/timers)
- Победа: отдельный раздел `victory`
- Только живые юниты (история — в `events[]`)

### events[] (v4.25) — типизированный replay-log

- Каждое событие: `event_id`, `turn_index`, `acting_civ_id`, `event_type`, `payload`.
- `event_type` — enum (MOVE, ATTACK, SERIAL_ATTACK, PRODUCE, BUILD_ROAD, UPGRADE_ROAD, BUILD_PORT, UPGRADE_PORT, UPGRADE_CITY, HEAL, DISBAND, CAPTURE_CITY, START_HARVEST, REPAIR_ROAD, BOOST_SCIENCE, BOOST_STABILITY, TECH_UNLOCK, DECLARE_WAR, MAKE_PEACE, FORM_ALLIANCE, BREAK_ALLIANCE, REBELLION, ELIMINATION, VICTORY_TRIGGER, VICTORY_COMPLETE, HIDDEN_CIV_SPAWN).
- Payload specs: `docs/01_overview/Action_Catalog.md`.
