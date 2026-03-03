# Генерация карты

## PvE параметры
- Размер: 80x80
- Континенты: минимум 4 (цель: 4–6)
- Острова: минимум 5 (цель: 5–10)
- Города: 50–100 (жёстко)
- Минимальная дистанция столиц: ≥10 клеток по любой оси
- Дистанция между городами: ≥2 клетки (может быть больше)

---

## Generation Algorithm (MVP) (v4.34)

Канон: terrain T1 (PLAIN/FOREST/MOUNTAIN/DESERT/WATER), MoveCost table, neutral city params v4.23. Карта 80×80 = 6400 тайлов, индекс `i = y*80 + x`.

### Pseudocode steps

```
1. SEED HANDLING
   - rng = seeded_rng(match_seed)  // deterministic; same seed → same map
   - retry_count = 0; max_retries = 5

2. GENERATE LANDMASK
   - Approach: Perlin/simplex noise (or similar) over 80×80 grid
   - threshold = sample from [0.35..0.55] using rng (controls land fraction)
   - For each tile (x,y): noise_value = noise(x, y, seed)
     - if noise_value > threshold → LAND (terrain_base = LAND)
     - else → WATER (terrain_base = WATER)
   - Floodfill to identify connected LAND regions:
     - Label each LAND tile with region_id
     - Sort regions by size (largest first)
   - Continent blobs: take 4–6 largest regions (rng choice within range)
   - Island blobs: take 5–10 next-largest regions (isolated, not touching continents)
   - Discard tiny regions (< N tiles) as noise; merge into nearest water or land

3. ASSIGN TERRAIN TYPES (T1)
   - For each LAND tile, assign terrain_type from { PLAIN, FOREST, MOUNTAIN, DESERT }
   - Target ratios (approximate): PLAIN 45%, FOREST 25%, MOUNTAIN 15%, DESERT 15%
   - Use secondary noise or rng per tile; ensure MOUNTAIN often at elevation-like clusters
   - WATER tiles: terrain_type = WATER (terrain_base already WATER)

4. PLACE RIVERS
   - Rivers = WATER tiles with is_river = true
   - Simple rule: pick 3–8 "river start" LAND tiles adjacent to WATER (coast)
   - Trace path: from start, step toward lower "elevation" (noise) until hitting WATER
   - Mark all WATER tiles along path as is_river = true
   - No gameplay difference (R1); used for visuals

5. PLACE CITIES (50–100)
   - candidate_tiles = LAND tiles, excluding MOUNTAIN (or allow MOUNTAIN with lower weight)
   - Shuffle candidates with rng; pick N cities where N = clamp(rng(50,100), 50, 100)
   - Enforce min spacing: for each new city, distance to any existing city >= 2 (Chebyshev)
   - Capitals: first 8 cities (7 civs + 1 hidden) chosen as capitals
     - For each capital: ensure Chebyshev distance to every other capital >= 10 (max(|dx|,|dy|) >= 10 per canon)
     - China capital: additionally enforce min 7 tiles from map edge (v4.7)
   - Assign owner_player_id: capitals get civ player_id; remaining cities = null (neutral)
   - Neutral city params (v4.23): level=1, defense_level=0, territory_radius=1, garrison=none

6. VALIDATE CONSTRAINTS
   - Check: 4–6 continent blobs, 5–10 island blobs
   - Check: 50–100 cities placed
   - Check: all capitals >= 10 apart; China >= 7 from edge
   - Check: each capital on LAND
   - If any check fails AND retry_count < max_retries: seed = seed + 1; retry_count++; goto 1
   - If retries exhausted: use last attempt (log warning)
```

### Output
- `tiles_flat[6400]` — each tile: terrain_base, terrain_type, is_river, x, y, visibility, etc. (per tile.schema)
- `cities[]` — city_id, x, y, owner_player_id, is_capital, level, defense_level, integration_turns_left, territory_radius, territory_tile_indices
- Deterministic: same seed → same map (reproducible replays)

---

### Стартовая позиция Китайской Народной Гармонии (v4.7)

При генерации карты стартовая позиция Китая:
- не может находиться на внешней границе карты,
- минимальное расстояние до края карты: **≥ 7 клеток**.

## Нейтральные города (v4.23)

- Города заранее предопределены при генерации.
- Изначально часть городов нейтральные (как в Polytopia).
- **Стартовые параметры нейтрального города при генерации:**
  - `level = 1`
  - `defense_level = 0`
  - `territory_radius = 1`
  - `garrison = none` (0 юнитов)
- При захвате применяется стандартная интеграция 4 хода (канон `docs/02_cities/City_Capture.md`).

## «Первый контакт»
- Генератор стремится обеспечить первые столкновения **до 20 хода** (за счёт плотности городов/географии)

## Типы клеток (T1)
- Равнина (PLAIN)
- Лес (FOREST) (защита +1). FOREST и MOUNTAIN имеют MoveCost = 2 (см. таблицу MoveCost ниже).
- Горы (MOUNTAIN) (видимость +1 для юнита на горе; боевые бонусы ниже)
- Вода (WATER)
- Пустыня (DESERT) (низкая ресурсная плотность)

### Базовая стоимость перемещения (MoveCost) (v4.19)

Перемещение расходует очки перемещения юнита (`Move`). Вход на соседний тайл стоит `MoveCost(terrain)`:

| Terrain  | MoveCost | Примечание |
|----------|----------|------------|
| PLAIN    | 1        | |
| FOREST   | 2        | |
| MOUNTAIN | 2        | |
| DESERT   | 1        | |
| WATER    | 1        | только для морских юнитов |

- Реки — это `WATER + is_river=true`; используют строку WATER.
- Дороги **не** изменяют `MoveCost`; они дают `MoveBonus` (см. `docs/04_economy/Network.md`).
- Если оставшихся очков перемещения недостаточно для оплаты `MoveCost` следующего тайла, юнит не может войти на этот тайл.

### Реки (v4.14, T1+R1)
- **Река не является отдельным типом местности.**
- Река — это **водный тайл** (`WATER`) с флагом `is_river = true`, используемым для генерации/визуализации.
- Игровых отличий от обычной воды **нет** (R1).

## Горы — боевые правила
- Юнит на горе: видимость +1
- Атака с горы: урон +1
- Атака на гору с равнины: урон -1
- Вход на горы открывается технологией (Военная ветка, уровень 2)

## Мосты
- Если между сушей 1 клетка воды — можно строить мост
- Мост считается дорогой по стоимости и уровню

## Стартовые территории (v4.13)
- Любой новый город (стартовый, нейтральный, основанный позднее) создаётся с:
  - `TerritoryRadius = 1`.
  - Территория города — квадрат `(2R+1)×(2R+1)` вокруг центра города (см. `docs/03_map/Territory_Rules.md`).

## Стартовая видимость
- В начале матча игрок видит:
  - территорию стартового города (радиус 1),
  - территорию, раскрытую стартовым юнитом согласно его параметру `Sight`.

## Захват города
- При захвате города территория этого города раскрывается полностью (все тайлы его территории становятся VISIBLE для захватчика) — см. `docs/03_map/Visibility.md`.
