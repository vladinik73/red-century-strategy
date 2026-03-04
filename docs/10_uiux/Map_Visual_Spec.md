# Map Visual Spec (v4.40)

Канон: `docs/03_map/Map_Generation.md`, `docs/03_map/Visibility.md`, `docs/03_map/Territory_Rules.md`, `docs/04_economy/Network.md`, `schemas/tile.schema.json`.

**Build Bridge:** визуал моста — дорога на WATER тайле. Событие `BUILD_ROAD` с `is_bridge: true`. Отдельного BUILD_BRIDGE нет.

---

## 1) Terrain rendering

| terrain_type | Semantic token | Placeholder-friendly |
|--------------|----------------|---------------------|
| PLAIN   | terrain_plain   | Светло-зелёный / бежевый |
| FOREST  | terrain_forest  | Тёмно-зелёный |
| MOUNTAIN| terrain_mountain| Серый / коричневый |
| DESERT  | terrain_desert  | Жёлтый / песочный |
| WATER   | terrain_water   | Синий / голубой |

- Реки: `is_river = true` на WATER. Визуальное отличие: более светлый/контрастный оттенок или анимация течения (опционально). Gameplay = WATER.

---

## 2) Roads and ports

### 2.1 Road levels (road_level 1–3)

| Level | Token | Визуал |
|-------|-------|--------|
| L1 | road_l1 | Тонкая линия, светлее земли |
| L2 | road_l2 | Средняя толщина |
| L3 | road_l3 | Широкая / магистраль |

### 2.2 Bridge

- `road_level > 0` на `terrain_base = WATER` → **мост**.
- Визуал: дорога пересекает воду (мостик). Толщина по road_level.
- Канон: `BUILD_ROAD` payload `is_bridge: true` на WATER тайле.

### 2.3 Port levels (port_level 1–3)

| Level | Token | Визуал |
|-------|-------|--------|
| L1 | port_l1 | Маленький причал |
| L2 | port_l2 | Средний |
| L3 | port_l3 | Крупный порт |

- Порт только на WATER тайлах в территории города.

---

## 3) Territory borders

- **Граница города:** тонкий контур цвета владельца (`territory_owner_player_id` → faction color).
- **При выборе города:** контур усиливается, территория подсвечивается (fill с низкой opacity).
- Нет границ стран — только границы городов.

---

## 4) Visibility states

| State | Token | Визуал |
|-------|-------|--------|
| UNEXPLORED | visibility_unexplored | Затемнение (fog), скрыты объекты |
| VISIBLE | visibility_visible | Полная видимость |

- **UNEXPLORED:** тайл затемнён; юниты, города, дороги/порты **не отображаются** (или показываются как «неизвестно»).
- **VISIBLE:** полный рендер по данным тайла.
- Канон: `docs/03_map/Visibility.md` — 2-state, permanent reveal.

---

## 5) Status indicators on map

| Статус | Где | Иконка/маркер |
|--------|-----|---------------|
| Siege | Город | Иконка осады на клетке города |
| Disruption | Город | Иконка сбоя |
| Integration | Город | Badge с числом (integration_turns_left) |
| DamagedRoad | Тайл | Иконка/маркер на дороге; road_damaged_turns_left |

---

## 6) City and unit representation

- **Город:** см. `docs/10_uiux/City_Visual_Spec.md`.
- **Юнит:** см. `docs/10_uiux/Unit_Visual_Spec.md`.

---

## 7) Map overlays

См. `docs/10_uiux/Map_Overlays.md` для Network, Resources, Military Threat, Integration.
