# Schemas

Здесь можно хранить JSON-черновики сущностей для синхронизации между docs и кодом.

## Список схем (v4.32)

- `match.schema.json` — состояние партии (Match State, Canonical Container + replay-log)
- `tile.schema.json` — структура тайла карты
- `player.schema.json` — состояние игрока/цивилизации (Player State)
- `unit.schema.json` — схема типа юнита
- `city.schema.json` — объект города (выровнен с match.schema city object, v4.27)

## Schema Sync Notes (v4.22)

- **match.schema / units**: `has_acted_this_turn: boolean` is canonical. Replaces legacy `has_moved` + `has_attacked`.
- **match.schema / cities**: `territory_radius: 1..5` (default 1, MaxTerritoryRadius=5).
- **player.schema**: `stability_boost_used_this_turn: boolean` (per-turn flag, reset at start of civ turn).
- **tile.schema / ports**: `port_level: 0..3` is canonical; `has_port` removed. `port_level >= 1` means port exists.
- **tile.schema / roads**: `road_damaged_turns_left: 0..2` (max=2 enforced).

## tile.schema.json (v4.32)

Назначение: формальная структура одной клетки карты (tile) для генерации/хранения match state.

Ключевые поля:
- coords: `x`, `y`
- terrain: `terrain_base` (LAND/WATER), `terrain_type` (T1: PLAIN/FOREST/MOUNTAIN/DESERT/WATER)
- `is_river`: boolean (WATER+is_river=true = river tile)
- resources: `resource_type` (MONEY/SCIENCE), `resource_remaining`, `resource_yield_per_turn`, `harvest_started`, `harvest_owner_player_id`
- infrastructure: `road_level`, `road_owner_player_id`, `road_damaged_turns_left`, `port_level`, `port_owner_player_id`
- city/territory: `city_id`, `territory_city_id`, `territory_owner_player_id`
- visibility: `visibility[10]` (0=UNEXPLORED, 1=VISIBLE)

Примечания:
- Мост — это дорога на WATER-тайле (`terrain_base=WATER` и `road_level>0`). Ограничение «мост можно строить только если между сушей 1 тайл воды» — правило геймплея (см. Map_Generation.md), не схема.
- Видимость — permanent reveal (см. `docs/03_map/Visibility.md`).

## player.schema.json (v4.32)

Схема состояния игрока/цивилизации (Player State), достаточная для:
- расчёта экономики (money/science/stability),
- выдачи и учёта ОД/AP,
- победных таймеров,
- глобальных эффектов (например, «Сбой»).

**Diplomacy:** НЕ хранится в player schema. Канон: `match.diplomacy.relations[]` (v4.30).

Файл: `schemas/player.schema.json`

## unit.schema.json (v4.32)

Схема определения типа юнита (UnitType). Не описывает состояние юнитов в match — см. match.schema units[].

Ключевые поля: unit_type_id, name, domain (GROUND|NAVAL|AIR), range, base_damage, base_max_hp, ap_cost, move; опционально: sight, is_unique, unlock_tech. Файл: `schemas/unit.schema.json`.

## city.schema.json (v4.32)

Схема объекта города. Выровнена с match.schema city object (match.cities[]). Канон: `schemas/match.schema.json`. Файл: `schemas/city.schema.json`.

Ключевые поля: city_id, x, y, owner_player_id, is_capital, level, defense_level, integration_turns_left, territory_radius (1..5), territory_tile_indices.

## match.schema.json (v4.32)

Canonical State Container для состояния партии (полный game state) + `events[]` как replay-log.

Ключевые решения:
- Карта: `tiles_flat` длиной 6400, индекс `i = y*80 + x`
- Отдельные массивы `cities[]` и `units[]`
- **Дипломатия:** единственный источник истины — `match.diplomacy.relations[]` (a_player_id, b_player_id, state, timers). Player schema не хранит diplomacy.
- Победа: отдельный раздел `victory`
- Только живые юниты (история — в `events[]`)

### events[] (v4.32) — discriminated union replay-log

- GameEvent: `oneOf` с 28 вариантами (Event_MOVE … Event_HIDDEN_CIV_SPAWN), включая CYBER_DISRUPT, CYBER_DAMAGE_ROAD.
- EventBase: `event_id`, `round_index`, `civ_turn_index`, `acting_player_id`, `event_type`, `payload`; опционально `seq`; `turn_index` deprecated.
- Payload для каждого event_type — строгая схема (additionalProperties: false).
- Payload specs: `docs/01_overview/Action_Catalog.md`.
