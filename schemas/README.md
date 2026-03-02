# Schemas

Здесь можно хранить JSON-черновики сущностей для синхронизации между docs и кодом.

## tile.schema.json (v4.14)

Назначение: формальная структура одной клетки карты (tile) для генерации/хранения match state.

Ключевые поля:
- coords: `x`, `y`
- terrain: `terrain_base` (LAND/WATER), `terrain_type` (T1: PLAIN/FOREST/MOUNTAIN/DESERT/WATER)
- `is_river`: boolean (WATER+is_river=true = river tile)
- resources: `resource_type` (MONEY/SCIENCE), `resource_remaining`, `resource_yield_per_turn`, `harvest_started`, `harvest_owner_civ_id`
- infrastructure: `road_level`, `road_owner_civ_id`, `road_damaged_turns_left`, `has_port`, `port_owner_civ_id`
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

## match.schema.json (v4.12)

Canonical State Container для состояния партии (полный game state) + `events[]` как replay-log.

Ключевые решения:
- Карта: `tiles_flat` длиной 6400, индекс `i = y*80 + x`
- Отдельные массивы `cities[]` и `units[]`
- Дипломатия: список отношений `relations[]` (state/timers)
- Победа: отдельный раздел `victory`
- Только живые юниты (история — в `events[]`)
