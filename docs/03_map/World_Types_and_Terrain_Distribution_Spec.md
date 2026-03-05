# World Types & Terrain Distribution Spec (v5.6)

Канон: `World_Generation_Spec.md` (v5.0), `Map_Generation.md` (v4.34), `Map_Design_Spec.md` (v5.1), `SOURCE_OF_TRUTH.md` (v4.42), `tile.schema.json` (v4.42).

> Этот документ определяет **систему типов мира** и **правила распределения террейна** для генератора карт. Он НЕ вводит новых механик, типов местности или ресурсов — только параметризует существующий алгоритм генерации из `World_Generation_Spec.md`.

See also: [`Map_Generator_Architecture.md`](../04_engine/Map_Generator_Architecture.md) — архитектура генератора (Option A, retry/attemptSeed, separation from rendering).

---

## 1) Система типов мира (World Type System)

### 1.1 Концепция

При создании партии генератор **сначала** выбирает тип мира (`world_type`), а **затем** применяет параметры этого типа ко всем шагам генерации (landmask, terrain, реки, города, ресурсы).

Это позволяет:
- Создавать **заметно разные** географии при разных партиях
- Влиять на стиль игры (морская экспансия vs сухопутный захват)
- Повышать реиграбельность без изменения правил

### 1.2 Выбор типа мира

**Детерминизм:** тип мира определяется из `match_seed` до начала генерации. **world_type не хранится** в MatchState — он вычисляется из seed (см. §12.3):

```
WEIGHTS = [30, 20, 20, 15, 15]   // BALANCED, CONTINENTAL, ARCHIPELAGO, PANGAEA, WILD
CDF     = [30, 50, 70, 85, 100]  // cumulative

rng = Mulberry32(match_seed)
roll = (rng.next() >>> 0) % 100   // uniform [0..99]

world_type = WORLD_TYPES[ CDF.findIndex(c => roll < c) ]
// roll  0–29 → BALANCED  (30%)
// roll 30–49 → CONTINENTAL (20%)
// roll 50–69 → ARCHIPELAGO (20%)
// roll 70–84 → PANGAEA    (15%)
// roll 85–99 → WILD       (15%)
```

> **Вероятности зафиксированы (MVP):** 30/20/20/15/15. Калибровка после плейтеста. Менять веса НЕ требует schema-изменений — только обновить WEIGHTS/CDF в коде генератора.

**UI flow (MVP):** В «New Game Setup» **нет выбора** конкретного world_type. Игрок всегда получает случайный тип мира, определённый из seed. Тип мира раскрывается на **Loading / Briefing Screen**:
- Отображается название типа мира (UI name из §2.1) + короткий tooltip-описание географии (1 строка из столбца «Описание»).
- Пример: *«Пангея — один суперконтинент. Все рядом, ранний контакт, конфликты неизбежны.»*
- Тип мира **не меняется** после старта. Кнопки «сменить тип» нет.

> **Примечание (post-MVP):** явный выбор world_type может быть добавлен позже в «Advanced Settings». Если реализован — CDF-выбор пропускается, world_type передаётся как **input parameter** к генератору (не сохраняется в schema). Seed генерации: `attemptSeed(match_seed, world_type_id, attempt_index)` (§3.5.1) — полностью детерминирован.

### 1.3 Инварианты (не зависят от world_type)

Следующие параметры **фиксированы** для всех типов мира и НЕ модифицируются:

| Параметр | Значение | Источник |
|----------|----------|----------|
| Размер карты | 80 × 80 = 6400 | World_Generation_Spec §2.1 |
| Сетка | Квадратная, 8-connected | World_Generation_Spec §2.1 |
| Terrain types | PLAIN, FOREST, MOUNTAIN, DESERT, WATER | tile.schema.json |
| Resource types | MONEY, SCIENCE | tile.schema.json |
| Столицы | 8 (7 + 1 hidden) | SOT |
| Min capital distance | ≥ 10 Chebyshev | SOT |
| Min city distance | ≥ 2 Chebyshev | SOT |
| China edge distance | ≥ 7 Chebyshev | SOT |
| Города | 50–100 | Map_Generation.md |
| Resource stock | 10 | Resources.md |
| Resource yield | 2/ход → 1/ход | Resources.md |
| Max retries | 5 | World_Generation_Spec §3.0 |
| Стартовые ресурсы | ≥ 1 MONEY + ≥ 1 SCIENCE в территории столицы | World_Generation_Spec §5.3 |

---

## 2) Типы мира (World Types)

### 2.1 Перечень

| # | world_type | Название (UI) | Вес (вероятность) | Описание |
|---|-----------|--------------|-------------------|----------|
| 0 | `BALANCED` | Сбалансированный мир | 30% | Базовый тип. Несколько континентов, умеренное количество островов. Классическая география |
| 1 | `CONTINENTAL` | Континентальный мир | 20% | Крупные континенты, мало воды. Сухопутные войны, длинные дороги |
| 2 | `ARCHIPELAGO` | Архипелаг | 20% | Много островов, мало крупной суши. Морская экспансия, порты критичны |
| 3 | `PANGAEA` | Пангея | 15% | Один суперконтинент. Все рядом, ранний контакт, конфликты неизбежны |
| 4 | `WILD` | Дикий мир | 15% | Экстремальные параметры, непредсказуемая география. Много гор, рек, контрасты |

### 2.2 BALANCED — Сбалансированный мир

Стандартная география. Параметры совпадают с baseline из `World_Generation_Spec.md`.

| Параметр | Значение |
|----------|----------|
| **Доля воды** | 40–55% |
| **Доля суши** | 45–60% |
| **Континенты** | 4–6 |
| **Min continent size** | 200 тайлов |
| **Острова** | 5–10 |
| **Min island size** | 8 тайлов |
| **Noise frequency** | 0.04–0.08 |
| **Edge falloff** | smoothstep(0, 8) — стандартные океанические края |
| **Озёра** | MIN_LAKE_SIZE = 6 (меньше — заполняются) |
| **Coastline complexity** | Средняя (fractal noise, 4 octaves) |
| **Biome randomness** | Средний (thresholds ± 0.04–0.05) |
| **Terrain: PLAIN** | 45% |
| **Terrain: FOREST** | 25% |
| **Terrain: MOUNTAIN** | 15% |
| **Terrain: DESERT** | 15% |
| **Рек** | 3–8 |
| **Длина реки** | 5–20 тайлов |
| **Mountain clusters** | Стандартные хребты (elevation noise freq=0.06, isolate removal 50%) |
| **Forest clusters** | Средние (moisture noise freq=0.06) |
| **Resource density (normal)** | 25% |
| **Resource density (desert)** | 12% |
| **MONEY : SCIENCE ratio** | 50 : 50 (±5%) |
| **Города** | 50–100 |
| **Стиль игры** | Универсальный. Все стратегии жизнеспособны |

### 2.3 CONTINENTAL — Континентальный мир

Большие массивы суши, мало воды. Доминируют сухопутные маршруты и длинные дороги.

| Параметр | Значение | Отличие от BALANCED |
|----------|----------|---------------------|
| **Доля воды** | 25–40% | ↓ меньше воды |
| **Доля суши** | 60–75% | ↑ больше суши |
| **Континенты** | 3–4 | ↓ меньше, но крупнее |
| **Min continent size** | 400 тайлов | ↑ крупнее |
| **Острова** | 3–6 | ↓ меньше |
| **Min island size** | 12 тайлов | ↑ крупнее |
| **Noise frequency** | 0.03–0.05 | ↓ низкочастотный шум → крупные блобы |
| **Edge falloff** | smoothstep(0, 5) | ↓ тоньше океанический край |
| **Озёра** | MIN_LAKE_SIZE = 10 | ↑ больше внутренних водоёмов заполняется |
| **Coastline complexity** | Низкая (3 octaves, высокий persistence) |  |
| **Biome randomness** | Низкий (thresholds ± 0.02) | ↓ более предсказуемые биомы |
| **Terrain: PLAIN** | 50% | ↑ больше равнин |
| **Terrain: FOREST** | 22% | ↓ |
| **Terrain: MOUNTAIN** | 15% | = |
| **Terrain: DESERT** | 13% | ↓ |
| **Рек** | 5–10 | ↑ больше — компенсация малого количества воды |
| **Длина реки** | 8–20 тайлов | ↑ длиннее |
| **Mountain clusters** | Крупные хребты (freq=0.04, isolate removal 70%) | ↑ длиннее цепи, меньше одиноких гор |
| **Forest clusters** | Крупные (moisture freq=0.04) | ↑ большие леса |
| **Resource density (normal)** | 23% | ↓ слегка ниже (компенсация больших территорий) |
| **Resource density (desert)** | 10% | ↓ |
| **MONEY : SCIENCE ratio** | 55 : 45 | ↑ чуть больше денег (дороги дорогие) |
| **Города** | 60–100 | ↑ больше (больше суши) |
| **Стиль игры** | Сухопутная экспансия. Магистраль критична. Порты менее важны |

### 2.4 ARCHIPELAGO — Архипелаг

Много воды, островная география. Морская логистика и порты — ключевые.

| Параметр | Значение | Отличие от BALANCED |
|----------|----------|---------------------|
| **Доля воды** | 55–70% | ↑ гораздо больше воды |
| **Доля суши** | 30–45% | ↓ меньше суши |
| **Континенты** | 2–3 | ↓ мало крупной суши |
| **Min continent size** | 150 тайлов | ↓ допускаются мелкие «большие острова» |
| **Острова** | 8–15 | ↑ много островов |
| **Min island size** | 6 тайлов | ↓ мелкие острова допускаются |
| **Noise frequency** | 0.06–0.10 | ↑ высокочастотный шум → фрагментация |
| **Edge falloff** | smoothstep(0, 4) | ↓ тонкий край (вода повсюду) |
| **Озёра** | MIN_LAKE_SIZE = 4 | ↓ мелкие озёра сохраняются |
| **Coastline complexity** | Высокая (5 octaves, средний persistence) |  |
| **Biome randomness** | Высокий (thresholds ± 0.06) | ↑ разнообразие |
| **Terrain: PLAIN** | 40% | ↓ |
| **Terrain: FOREST** | 30% | ↑ больше леса на островах |
| **Terrain: MOUNTAIN** | 12% | ↓ мало гор (острова невысокие) |
| **Terrain: DESERT** | 18% | ↑ больше пустынных тайлов на островах |
| **Рек** | 2–5 | ↓ мало суши → мало рек |
| **Длина реки** | 3–12 тайлов | ↓ короткие |
| **Mountain clusters** | Мелкие (freq=0.08, isolate removal 30%) | ↓ одиночные пики |
| **Forest clusters** | Мелкие (moisture freq=0.08) | ↓ рощи, не массивы |
| **Resource density (normal)** | 28% | ↑ плотнее (компенсация малой территории) |
| **Resource density (desert)** | 15% | ↑ |
| **MONEY : SCIENCE ratio** | 50 : 50 | = |
| **Города** | 50–80 | ↓ меньше суши → меньше мест |
| **Стиль игры** | Морской. Порты обязательны. Мосты — стратегические узлы. Изоляция → поздний контакт |

### 2.5 PANGAEA — Пангея

Один гигантский суперконтинент. Все цивилизации на одном массиве суши.

| Параметр | Значение | Отличие от BALANCED |
|----------|----------|---------------------|
| **Доля воды** | 30–40% | ↓ |
| **Доля суши** | 60–70% | ↑ |
| **Континенты** | **1 (hard)** | ↓↓ ровно один суперконтинент — каноническая черта PANGAEA (см. §4.3) |
| **Min continent size** | 2000 тайлов | ↑↑ суперконтинент ≥ 2000 тайлов |
| **Острова** | target 5–10 (soft) | Островное кольцо — рекомендация; генератор не фейлится по островам (см. §4.3) |
| **Min island size** | 8 тайлов | = |
| **Noise frequency** | 0.02–0.04 | ↓↓ очень низкая → один крупный блоб |
| **Edge falloff** | smoothstep(0, 10) | ↑ широкий океанический край (суша в центре) |
| **Озёра** | MIN_LAKE_SIZE = 8 | ↑ внутренние моря заполняются |
| **Coastline complexity** | Низкая (3 octaves) | |
| **Biome randomness** | Низкий (thresholds ± 0.03) | ↓ чёткие биомные зоны |
| **Terrain: PLAIN** | 48% | ↑ |
| **Terrain: FOREST** | 23% | ↓ |
| **Terrain: MOUNTAIN** | 16% | ↑ горные хребты делят суперконтинент |
| **Terrain: DESERT** | 13% | ↓ |
| **Рек** | 6–10 | ↑ большой континент → много рек |
| **Длина реки** | 10–20 тайлов | ↑ длинные реки |
| **Mountain clusters** | Длинные хребты (freq=0.03, isolate removal 80%) | ↑↑ горные цепи как естественные границы |
| **Forest clusters** | Крупные (moisture freq=0.04) | ↑ |
| **Resource density (normal)** | 22% | ↓ слегка ниже (много территории) |
| **Resource density (desert)** | 10% | ↓ |
| **MONEY : SCIENCE ratio** | 50 : 50 | = |
| **Города** | 70–100 | ↑ больше (много суши) |
| **Стиль игры** | Ранний контакт. Границы = горные хребты. Войны с 1 хода. Дипломатия критична |

### 2.6 WILD — Дикий мир

Экстремальная, непредсказуемая география. Высокая вариативность всех параметров.

| Параметр | Значение | Отличие от BALANCED |
|----------|----------|---------------------|
| **Доля воды** | 30–65% (rng-wide) | ↕ широкий разброс |
| **Доля суши** | 35–70% | ↕ |
| **Континенты** | 2–6 | ↕ любое количество |
| **Min continent size** | 100 тайлов | ↓ мелкие «континенты» допускаются |
| **Острова** | 5–15 | ↑ может быть много |
| **Min island size** | 5 тайлов | ↓ мельчайшие |
| **Noise frequency** | 0.03–0.12 (rng-wide) | ↕ от крупных до мелких структур |
| **Edge falloff** | smoothstep(0, rng(3,12)) | ↕ непредсказуемый край |
| **Озёра** | MIN_LAKE_SIZE = 4 | ↓ озёра сохраняются |
| **Coastline complexity** | Высокая (5 octaves, rng persistence) |  |
| **Biome randomness** | Максимальный (thresholds ± 0.08) | ↑↑ хаотичное распределение |
| **Terrain: PLAIN** | 30–55% (rng), **HARD MIN 25%** | ↕ см. §3.5 |
| **Terrain: FOREST** | 15–35% (rng) | ↕ |
| **Terrain: MOUNTAIN** | 10–25% (rng) | ↕ может быть много гор |
| **Terrain: DESERT** | 8–25% (rng) | ↕ может быть много пустынь |
| **Рек** | 3–12 | ↕ |
| **Длина реки** | 3–20 тайлов | ↕ |
| **Mountain clusters** | Рандомизированные (freq=rng(0.03,0.10), isolate removal rng(20%,80%)) | ↕ от хребтов до хаоса |
| **Forest clusters** | Рандомизированные (moisture freq=rng(0.04,0.10)) | ↕ |
| **Resource density (normal)** | 20–30% (rng) | ↕ |
| **Resource density (desert)** | 8–18% (rng) | ↕ |
| **MONEY : SCIENCE ratio** | 40–60 : 60–40 (rng) | ↕ может быть перекос |
| **Города** | 50–100 | = |
| **Стиль игры** | Непредсказуемый. Адаптация — ключ. Каждая партия уникальна |

---

## 3) Правила распределения террейна (Terrain Distribution Rules)

### 3.1 Базовые пропорции (baseline)

Из `World_Generation_Spec.md` §2.4 — пропорции на LAND-тайлах:

| terrain_type | Baseline | Назначение |
|-------------|----------|-----------|
| PLAIN | 45% | Основная «проходимая» местность. MoveCost=1. Города и ресурсы |
| FOREST | 25% | Защитная местность. MoveCost=2, DefenseModifier +1 |
| MOUNTAIN | 15% | Барьеры и стратегические позиции. Непроходимы без Military L2 |
| DESERT | 15% | Проходимая, но бедная. MoveCost=1, пониженные ресурсы |

### 3.2 Модификаторы по типам мира

| terrain_type | BALANCED | CONTINENTAL | ARCHIPELAGO | PANGAEA | WILD |
|-------------|----------|------------|-------------|---------|------|
| PLAIN | 45% | 50% (+5) | 40% (-5) | 48% (+3) | 30–55% |
| FOREST | 25% | 22% (-3) | 30% (+5) | 23% (-2) | 15–35% |
| MOUNTAIN | 15% | 15% (=) | 12% (-3) | 16% (+1) | 10–25% |
| DESERT | 15% | 13% (-2) | 18% (+3) | 13% (-2) | 8–25% |

### 3.3 Логика модификаторов

**CONTINENTAL (+PLAIN, -FOREST, -DESERT):**
Большие равнины = длинные дороги и быстрое перемещение. Меньше леса = меньше оборонительных позиций → агрессивная мета. Меньше пустыни = меньше «мёртвых» зон.

**ARCHIPELAGO (-PLAIN, +FOREST, -MOUNTAIN, +DESERT):**
FOREST доминирует на островах. MOUNTAIN редки (острова невысокие). Больше DESERT-тайлов (засушливые острова). Ресурсы плотнее (маленькие острова должны быть ценными).

**PANGAEA (+PLAIN, +MOUNTAIN, -FOREST, -DESERT):**
Равнины и горы делят суперконтинент. Горные хребты — естественные границы между цивилизациями. Меньше леса = меньше «безопасных» углов.

**WILD (всё рандомизировано):**
Пропорции terrains определяются rng в широких пределах. **Hard constraint: PLAIN ≥ 25%** (минимум проходимой местности для размещения городов). Enforcement: см. §3.5.

### 3.4 Механизм применения

При генерации (World_Generation_Spec §3.3) пороги terrain assignment модифицируются:

```
Стандартные пороги (BALANCED):
  MOUNTAIN_THRESHOLD = 0.78
  FOREST_THRESHOLD   = 0.55
  DESERT_THRESHOLD   = 0.25

Модификация для world_type:
  MOUNTAIN_THRESHOLD += worldConfig.mountainThresholdDelta
  FOREST_THRESHOLD   += worldConfig.forestThresholdDelta
  DESERT_THRESHOLD   += worldConfig.desertThresholdDelta

Пример для CONTINENTAL:
  MOUNTAIN_THRESHOLD = 0.78 + 0.00 = 0.78 (same)
  FOREST_THRESHOLD   = 0.55 + 0.04 = 0.59 (higher → less forest)
  DESERT_THRESHOLD   = 0.25 - 0.03 = 0.22 (lower → less desert)
  Результат: больше PLAIN
```

Постобработка (World_Generation_Spec §3.3) применяется после модификации, чтобы привести пропорции к целевым с допуском ≤ 5%.

### 3.5 WILD constraint enforcement: PLAIN ≥ 25%

**Тип:** hard constraint (WILD world_type only).

**Механизм:** post-validation после terrain assignment (Step 3). Генератор **не модифицирует** terrain in-place (без перестановки тайлов). Вместо этого: если constraint нарушен — полная перегенерация карты с новым детерминированным seed.

**Почему post-validation, а не pre-constraint на target ratios:**
- WILD пропорции рандомизированы (PLAIN 30–55%, rng). Даже при target ≥ 25%, noise может сдвинуть результат ниже.
- Post-validation + retry = простая, детерминированная, предсказуемая логика.
- In-place adjustment нарушает LAND connectivity и cluster shapes.

#### 3.5.1 Deterministic attempt seed

Для обеспечения **полной детерминированности** каждая попытка генерации использует seed, вычисленный хеш-функцией:

```
function attemptSeed(match_seed: u32, world_type_id: u8, attempt_index: u8): u32 {
  // FNV-1a 32-bit hash
  h = 0x811c9dc5
  h = (h ^ (match_seed & 0xFF))        * 0x01000193
  h = (h ^ ((match_seed >> 8) & 0xFF)) * 0x01000193
  h = (h ^ ((match_seed >> 16) & 0xFF))* 0x01000193
  h = (h ^ ((match_seed >> 24) & 0xFF))* 0x01000193
  h = (h ^ world_type_id)              * 0x01000193
  h = (h ^ attempt_index)              * 0x01000193
  return h >>> 0
}
```

**Свойства:**
- `attempt_index = 0` — первая попытка (основная генерация).
- Одинаковые `match_seed` + `world_type_id` + `attempt_index` → **всегда одинаковый** attemptSeed → идентичная карта.
- Нет скрытой случайности, нет nondeterministic fallback.
- Если world_type выбран случайно (§1.2), `world_type_id` = индекс из enum (0–4). Если задан явно (post-MVP override) — тот же индекс, передаётся как входной параметр генерации, **не сохраняется** в MatchState.

#### 3.5.2 Validation + retry algorithm

**Проверка:** после terrain assignment (Step 3) считаем `plainRatio = PLAIN_tiles / LAND_tiles`.

```
MAX_RETRIES = 5        // канон World_Generation_Spec §3.0

for (attempt_index = 0; attempt_index <= MAX_RETRIES; attempt_index++) {
  seed = attemptSeed(match_seed, world_type_id, attempt_index)
  rng  = Mulberry32(seed)

  // Full generation: Steps 1-3 (landmask → regions → terrain)
  map = generateTerrain(rng, worldConfig)

  plainRatio = countPlain(map) / countLand(map)
  if (world_type !== WILD || plainRatio >= 0.25) {
    break   // constraint satisfied (or not WILD)
  }
  // else: retry with next attempt_index → different attemptSeed
}

if (attempt_index > MAX_RETRIES) {
  // fallback: use BALANCED config with attempt_index = MAX_RETRIES + 1
  seed = attemptSeed(match_seed, world_type_id, MAX_RETRIES + 1)
  rng  = Mulberry32(seed)
  worldConfig = WORLD_CONFIGS['BALANCED']
  map = generateTerrain(rng, worldConfig)
  warn("WILD→BALANCED fallback triggered, attempt_index=" + (MAX_RETRIES + 1))
}
```

**Гарантии:**
- **Determinism:** same `match_seed` + same `world_type_id` (or override) → identical `attempt_index` sequence → identical final map. No hidden randomness.
- **Fallback safety:** BALANCED config has PLAIN baseline 45% → constraint (≥ 25%) always satisfied after fallback.
- **Reproducibility:** replay reconstructs `world_type_id` from seed (§12.3), then re-runs the same attempt loop → identical map.

---

## 4) Континенты и острова (Continents & Islands)

### 4.1 Определения (из World_Generation_Spec §2.3)

| Термин | Определение |
|--------|-----------|
| **Континент** | Связный регион LAND (4-connected) с площадью ≥ `minContinentSize` |
| **Остров** | Связный регион LAND, НЕ являющийся континентом, с площадью ≥ `minIslandSize` |
| **Шум** | Регион LAND < `minIslandSize`. Удаляется (→ WATER) |
| **Озеро** | Замкнутый регион WATER внутри суши < `minLakeSize`. Заполняется (→ LAND) |

### 4.2 Параметры по типам мира

| Параметр | BALANCED | CONTINENTAL | ARCHIPELAGO | PANGAEA | WILD |
|----------|----------|------------|-------------|---------|------|
| Continents (min–max) | 4–6 (soft) | 3–4 (soft) | 2–3 (soft) | **1** (hard) | 2–6 (soft) |
| Min continent size | 200 | 400 | 150 | 2000 | 100 |
| Islands (min–max) | 5–10 (soft) | 3–6 (soft) | 8–15 (soft) | 5–10 (soft) | 5–15 (soft) |
| Min island size | 8 | 12 | 6 | 8 | 5 |
| Min lake size | 6 | 10 | 4 | 8 | 4 |

> **Hard vs soft:** PANGAEA continents = 1 — **единственное hard-ограничение** по топологии (нарушение → retry). Все остальные диапазоны (continents и islands для всех world types, включая PANGAEA islands 5–10) — **soft targets**: генератор стремится попасть, но не фейлится при отклонении. Причина: острова и количество континентов — вкусовая вариативность; retry по ним избыточен и замедляет генерацию.

### 4.3 Специальные правила

**PANGAEA — суперконтинент (mainland_count = 1, islands = target 5–10):**

Каноническая география PANGAEA — **один суперконтинент**, окружённый кольцом из ~5–10 островов.

- **Континентов: ровно 1 (HARD).** После floodfill и классификации регионов должен быть ровно один регион с `area ≥ minContinentSize (2000)`. Если больше одного → retry. Если ни одного → retry.
- **Островов: target 5–10 (SOFT).** Генератор стремится к 5–10, но не фейлится при отклонении. Острова — вкусовая вариативность; допустимо 0..N. Кольцо островов вокруг суперконтинента — рекомендация, а не hard constraint.
- Самый крупный регион LAND должен содержать ≥ 60% всей суши.
- Если после landmask нет региона ≥ 2000 тайлов → retry.
- Генератор пытается разместить все 7 основных столиц на суперконтиненте.
- Если distance ≥ 10 невозможна для всех 7 на суперконтиненте → 1–2 столицы размещаются на **сателлитных островах** (близких к суперконтиненту, ≥ 15 LAND-тайлов). Hard constraint ≥ 10 Chebyshev **не ослабляется**.
- Скрытая столица — может быть на любом острове.

> **Исключение из глобального правила «4–6 континентов»:** диапазон 4–6 из `World_Generation_Spec.md` §2.2 применим к BALANCED, а не ко всем типам мира. Для PANGAEA каноническое значение — 1. Для каждого world_type используются значения из таблицы §4.2.

**ARCHIPELAGO — островная раскладка:**
- Ни один регион LAND не должен содержать > 40% всей суши.
- Если есть регион > 40% → увеличить noise frequency и retry.
- Минимум 3 острова должны быть пригодны для столицы (≥ 15 LAND-тайлов, не MOUNTAIN).

**CONTINENTAL — крупные блоки:**
- Каждый континент должен быть пригоден для ≥ 2 столиц (площадь ≥ 400 тайлов).
- Если какой-то континент < 400 → перевести в категорию «остров».

---

## 5) Реки (Rivers)

### 5.1 Параметры по типам мира

| Параметр | BALANCED | CONTINENTAL | ARCHIPELAGO | PANGAEA | WILD |
|----------|----------|------------|-------------|---------|------|
| Количество | 3–8 | 5–10 | 2–5 | 6–10 | 3–12 |
| Длина (min–max тайлов) | 5–20 | 8–20 | 3–12 | 10–20 | 3–20 |
| Max длина (hard) | 20 | 20 | 15 | 20 | 20 |
| Исток: рядом с MOUNTAIN | ≤ 3 Chebyshev | ≤ 3 | ≤ 2 | ≤ 4 | ≤ 5 |
| Исток: elevation top % | 20% | 20% | 25% | 15% | 10–30% |

### 5.2 Общие правила (не зависят от world_type)

Канон: World_Generation_Spec §3.4, §4.3.

- Река = конвертированные LAND-тайлы → `terrain_base = WATER`, `terrain_type = WATER`, `is_river = true`.
- Трассировка: greedy descent по elevation_map к ближайшему WATER.
- Тупик (все соседи выше): случайное смещение (rng) на 1 шаг. Если 3 тупика подряд → прервать.
- Река не достигла воды за max длину → отбросить.
- Реки размещаются ПОСЛЕ terrain assignment, но ДО городов.
- Ширина реки: всегда 1 тайл.
- Река НЕ является отдельным типом местности. Геймплейных отличий от обычной воды нет (R1).

### 5.3 Специальные правила

**CONTINENTAL:** реки длиннее, компенсируют малое количество воды. Предпочтение: реки пересекают равнины (визуально красиво + создают мосты).

**PANGAEA:** реки играют роль «внутренних водных путей» суперконтинента. Предпочтение: реки делят суперконтинент на «зоны влияния».

**ARCHIPELAGO:** реки короткие (острова маленькие). Минимум 1 река на каждый континент (если есть горы).

---

## 6) Горы (Mountains)

### 6.1 Параметры по типам мира

| Параметр | BALANCED | CONTINENTAL | ARCHIPELAGO | PANGAEA | WILD |
|----------|----------|------------|-------------|---------|------|
| Доля от LAND | 15% | 15% | 12% | 16% | 10–25% |
| Elevation noise freq | 0.06 | 0.04 | 0.08 | 0.03 | 0.03–0.10 |
| Cluster style | Хребты | Длинные хребты | Одиночные пики | Горные цепи-стены | Рандом |
| Isolate removal % | 50% | 70% | 30% | 80% | 20–80% |
| Min cluster size | 3 | 5 | 1 | 6 | 1 |

### 6.2 Стиль горных формаций

**BALANCED — хребты:**
Стандартные горные цепи средней длины (5–15 тайлов). Изолированные горы удаляются с 50% вероятностью.

**CONTINENTAL — длинные хребты:**
Горные цепи 10–25 тайлов. Пересекают континенты, создавая естественные границы. Низкочастотный elevation noise (freq=0.04) → крупные структуры. 70% изолированных гор удаляется.

**ARCHIPELAGO — одиночные пики:**
Одиночные горы или маленькие группы (1–4 MOUNTAIN-тайла). Высокочастотный noise (freq=0.08). Только 30% изолированных гор удаляется — одиночные пики характерны для островов.

**PANGAEA — горные цепи-стены:**
Длинные непрерывные хребты (15–30 тайлов), разделяющие суперконтинент на «сектора». Очень низкочастотный noise (freq=0.03). 80% изолированных гор удаляется — только цепи.

**WILD — хаос:**
Параметры рандомизированы. Может быть что угодно: от одного горного хребта до россыпи одиночных пиков.

### 6.3 Инварианты (все типы мира)

- Города НЕ размещаются на MOUNTAIN.
- Ресурсы НЕ размещаются на MOUNTAIN.
- Горы непроходимы без Military L2 tech.
- Юнит на горе: visibility +1, attack from mountain +1, attack into mountain -1 (с равнины).
- Канон: World_Generation_Spec §4.2, SOT §Terrain.

---

## 7) Леса (Forests)

### 7.1 Параметры по типам мира

| Параметр | BALANCED | CONTINENTAL | ARCHIPELAGO | PANGAEA | WILD |
|----------|----------|------------|-------------|---------|------|
| Доля от LAND | 25% | 22% | 30% | 23% | 15–35% |
| Moisture noise freq | 0.06 | 0.04 | 0.08 | 0.04 | 0.04–0.10 |
| Cluster style | Средние леса | Большие леса | Рощи | Большие леса | Рандом |
| Avg cluster size | 8–20 | 15–40 | 4–12 | 15–40 | 3–40 |

### 7.2 Стиль лесных формаций

**BALANCED:** леса средних размеров (8–20 тайлов), распределённые равномерно.

**CONTINENTAL:** крупные лесные массивы (15–40 тайлов). Низкочастотный moisture noise → большие однородные зоны. Лесные «полосы» между равнинами.

**ARCHIPELAGO:** мелкие FOREST-кластеры (4–12 тайлов). Высокочастотный noise → фрагментированные леса. Почти каждый остров имеет лесной участок.

**PANGAEA:** крупные леса. Лесные зоны и равнинные зоны чётко разделены (низкий biome randomness).

**WILD:** от одиночных деревьев до гигантских массивов.

### 7.3 Биомное взаимодействие

Леса «конкурируют» с пустынями через moisture_map:
- Высокая влажность → FOREST
- Низкая влажность → DESERT
- Средняя → PLAIN

При высоком biome randomness (WILD, ARCHIPELAGO) лес и пустыня могут граничить напрямую. При низком (CONTINENTAL, PANGAEA) между ними обычно полоса PLAIN.

---

## 8) Распределение ресурсов (Resource Distribution)

> **Scope:** данный раздел описывает только **распределение ресурсных тайлов** по карте (какие тайлы получают `has_resource = true`, `resource_type = MONEY|SCIENCE`). Механики добычи, stock, yield, depletion — канон `Resources.md`. Данный документ их **НЕ модифицирует**.

### 8.1 Параметры по типам мира

| Параметр | BALANCED | CONTINENTAL | ARCHIPELAGO | PANGAEA | WILD |
|----------|----------|------------|-------------|---------|------|
| Density (normal terrain) | 25% | 23% | 28% | 22% | 20–30% |
| Density (DESERT terrain) | 12% | 10% | 15% | 10% | 8–18% |
| MONEY : SCIENCE (tile ratio) | 50:50 | 55:45 | 50:50 | 50:50 | 40–60:60–40 |
| Clustering | Средняя | Сильная | Слабая | Сильная | Рандом |

**Уточнение:** «Density» = доля eligible тайлов данного terrain, на которых размещается ресурс. «MONEY:SCIENCE» = соотношение количества тайлов с `resource_type = MONEY` к `resource_type = SCIENCE`. Все значения yield/stock фиксированы и определяются `Resources.md`, а не world_type.

### 8.1a Сводная таблица ресурсов по типам мира

| Параметр | BALANCED | CONTINENTAL | ARCHIPELAGO | PANGAEA | WILD |
|----------|----------|------------|-------------|---------|------|
| `resource_density` (PLAIN/FOREST) | 0.25 | 0.23 | 0.28 | 0.22 | rng(0.20, 0.30) |
| `resource_density` (DESERT) | 0.12 | 0.10 | 0.15 | 0.10 | rng(0.08, 0.18) |
| `money_tile_share` | 0.50 | 0.55 | 0.50 | 0.50 | rng(0.40, 0.60) |
| `science_tile_share` | 0.50 | 0.45 | 0.50 | 0.50 | 1.0 - money_tile_share |
| `cluster_strength` | medium | strong | weak | strong | rng(weak, strong) |

### 8.2 Правила размещения (все типы мира)

Канон: World_Generation_Spec §5.2.

1. Ресурсы ТОЛЬКО на `terrain_type ∈ {PLAIN, FOREST, DESERT}`.
2. `MOUNTAIN` и `WATER` — без ресурсов.
3. Тайл с городом — без ресурса.
4. DESERT: пониженная плотность (по конфигу world_type).
5. MONEY : SCIENCE — по конфигу world_type.
6. Resource stock = 10 (фиксировано).
7. Resource yield = 2/ход, depleted = 1/ход (фиксировано).

### 8.3 Гарантии стартовых ресурсов (все типы мира)

Канон: World_Generation_Spec §5.3.

Для КАЖДОЙ столицы (включая скрытую):
- ≥ 1 MONEY в территории (Chebyshev ≤ 1 от столицы)
- ≥ 1 SCIENCE в территории
- Если не хватает → принудительно разместить на ближайшем eligible тайле

### 8.4 Кластеризация по типам мира

**CONTINENTAL / PANGAEA (сильная кластеризация):**
Ресурсы формируют «зоны»: region_noise определяет тип ресурса. Это создаёт стратегические hot-spots (денежные vs научные регионы) → мотивирует экспансию в конкретном направлении.

**ARCHIPELAGO (слабая кластеризация):**
Ресурсы распределены равномерно. На каждом острове примерно равное соотношение MONEY/SCIENCE. Цель: каждый остров самодостаточен.

**WILD (рандом):**
Кластеризация определяется rng. Может быть как сильная (ресурсные hot-spots), так и полностью равномерная.

---

## 9) Баланс спавна (Spawn Balance)

### 9.1 Общие гарантии (все типы мира)

Каждая столица должна удовлетворять:

| Требование | Проверка | Источник |
|-----------|---------|----------|
| На LAND | `terrain_base = LAND` | World_Generation_Spec §3.5 |
| Не на MOUNTAIN | `terrain_type ≠ MOUNTAIN` | World_Generation_Spec §3.5 |
| ≥ 4 LAND-тайла в 3×3 территории | Enough eligible terrain around capital | World_Generation_Spec §9.6 |
| ≥ 1 MONEY + ≥ 1 SCIENCE в территории | Resource guarantee | World_Generation_Spec §5.3 |
| Chebyshev ≥ 10 до других столиц | Distance constraint | SOT |
| Chebyshev ≥ 7 до края (China) | Edge constraint | SOT |
| На равнине (предпочтительно) | PLAIN preferred, FOREST/DESERT fallback | World_Generation_Spec §3.5 |

### 9.2 Расширенные гарантии (spawn quality score)

Для обеспечения **справедливого старта** генератор оценивает качество каждого spawn-а.

#### MVP Balanced Fairness Profile (default)

Веса зафиксированы для MVP. Калибровка после плейтеста.

| Компонент | Формула | Вес | Обоснование |
|-----------|---------|-----|-------------|
| PLAIN в 3×3 | `plainTilesIn3x3` | +3 | Best terrain: MoveCost=1, города, ресурсы |
| FOREST в 3×3 | `forestTilesIn3x3` | +2 | Defence +1, ресурсы, но MoveCost=2 |
| DESERT в 3×3 | `desertTilesIn3x3` | +1 | Passable, но бедный по ресурсам |
| MOUNTAIN в 3×3 | `mountainTilesIn3x3` | −2 | Blocked (no Military L2 at start) |
| WATER в 3×3 | `waterTilesIn3x3` | −1 | Impassable for ground units |
| Resources в 3×3 | `resourceTilesIn3x3` | +2 | Economic start |
| Нейтральные города ≤ 5 | `nearbyNeutralCities` (Chebyshev ≤ 5) | +3 | Expansion targets |

```
spawnScore(capital) =
    plainTilesIn3x3   × 3
  + forestTilesIn3x3  × 2
  + desertTilesIn3x3  × 1
  - mountainTilesIn3x3 × 2
  - waterTilesIn3x3   × 1
  + resourceTilesIn3x3 × 2
  + nearbyNeutralCities × 3       // Chebyshev ≤ 5 от столицы
```

> **Профиль:** `BALANCED_MVP`. Все world_types используют одинаковые веса. Если плейтест потребует отдельные профили (напр. ARCHIPELAGO с бонусом за порт) — это будет отдельный OQ.

**Правило:** `max(spawnScore) - min(spawnScore) ≤ 8` (разброс между лучшим и худшим стартом ≤ 8 очков).

Если разброс > 8 → перераспределить стартовые ресурсы (добавить ресурс «бедному» spawn-у, убрать у «богатого»). Города и terrain НЕ перемещаются — только ресурсы.

### 9.3 Модификации по типам мира

**PANGAEA:**
- Генератор приоритизирует размещение столиц по разным «секторам» суперконтинента, разделённым горными хребтами.
- Если суперконтинент не вмещает все 7 столиц с distance ≥ 10: 1–2 столицы размещаются на **сателлитных островах** (близких к суперконтиненту, ≥ 15 LAND-тайлов, не MOUNTAIN).
- Hard constraint ≥ 10 Chebyshev **никогда не ослабляется** — это канонический инвариант.

**ARCHIPELAGO:**
- Столицы размещаются на разных островах/континентах (один на остров).
- Если островов/континентов < 8: допускается 2 столицы на одном крупном острове (distance ≥ 10).
- Каждый остров со столицей должен иметь ≥ 15 LAND-тайлов.

**CONTINENTAL:**
- Столицы распределяются по континентам round-robin (максимальное покрытие).

**WILD:**
- Стандартные правила. Spawn quality score особенно важен (ландшафт непредсказуем).

---

## 10) Сводная таблица типов мира (Summary Table)

| Параметр | BALANCED | CONTINENTAL | ARCHIPELAGO | PANGAEA | WILD |
|----------|----------|------------|-------------|---------|------|
| **Вероятность** | 30% | 20% | 20% | 15% | 15% |
| **Вода %** | 40–55 | 25–40 | 55–70 | 30–40 | 30–65 |
| **Суша %** | 45–60 | 60–75 | 30–45 | 60–70 | 35–70 |
| **Континенты** | 4–6 | 3–4 | 2–3 | **1** (hard) | 2–6 |
| **Острова** | 5–10 | 3–6 | 8–15 | 5–10 | 5–15 |
| **PLAIN %** | 45 | 50 | 40 | 48 | 30–55 |
| **FOREST %** | 25 | 22 | 30 | 23 | 15–35 |
| **MOUNTAIN %** | 15 | 15 | 12 | 16 | 10–25 |
| **DESERT %** | 15 | 13 | 18 | 13 | 8–25 |
| **Рек** | 3–8 | 5–10 | 2–5 | 6–10 | 3–12 |
| **Длина рек** | 5–20 | 8–20 | 3–12 | 10–20 | 3–20 |
| **Resource density** | 25% | 23% | 28% | 22% | 20–30% |
| **Городов** | 50–100 | 60–100 | 50–80 | 70–100 | 50–100 |
| **Стиль игры** | Универсальный | Сухопутный | Морской | Ранний контакт | Хаос |
| **Ключевая стратегия** | Все варианты | Магистраль + армия | Порты + флот | Дипломатия + горы | Адаптация |

---

## 11) Playability & Fairness Invariants

Данные инварианты — **hard constraints**, которые генератор ОБЯЗАН обеспечить для ЛЮБОГО world_type. Нарушение любого инварианта → retry (до max_retries=5), затем generation failure.

### 11.1 Минимум суши

| Инвариант | Значение | Причина |
|-----------|----------|---------|
| Min LAND-тайлов | ≥ 2000 (31.25% от 6400) | Достаточно территории для 50+ городов и 8 столиц |
| Min PLAIN+FOREST+DESERT тайлов | ≥ 1600 | Города не на MOUNTAIN/WATER; нужно ≥ 50 eligible тайлов per city |

### 11.2 Территория столицы

Для КАЖДОЙ столицы (включая скрытую, 8 total):

| Инвариант | Значение | Причина |
|-----------|----------|---------|
| terrain_base | LAND | Столица не в воде |
| terrain_type | ≠ MOUNTAIN | Столица не на горе |
| LAND-тайлов в TerritoryRadius=1 (3×3) | ≥ 4 из 9 | Минимум проходимой территории вокруг |
| PLAIN-тайлов в TerritoryRadius=1 | ≥ 1 | Хотя бы одна равнина для юнита/дороги |
| Ресурсы в TerritoryRadius=1 | ≥ 1 MONEY + ≥ 1 SCIENCE | Экономический старт (World_Generation_Spec §5.3) |
| Расстояние до других столиц | ≥ 10 Chebyshev | Канон SOT — **никогда не ослабляется** |
| Расстояние до края карты (China) | ≥ 7 Chebyshev | Канон SOT |

### 11.3 Connectivity

| Инвариант | Значение | Причина |
|-----------|----------|---------|
| LAND-connectivity | Каждая столица достижима хотя бы через 1 LAND-path (8-connected, без WATER/MOUNTAIN) ИЛИ через bridgeable WATER (≤ 3 тайла) | Ни одна цивилизация не заблокирована полностью |
| Neutral city reachability | Каждая столица имеет ≥ 1 нейтральный город в Chebyshev ≤ 8 | Expansion target for early game |

> **Примечание:** ARCHIPELAGO допускает столицы на отдельных островах, разделённых водой. Connectivity обеспечивается через порты/мосты (gameplay mechanic, не terrain constraint). Инвариант LAND-connectivity применяется мягко: если нет LAND-path, генератор НЕ делает retry, но записывает warning.

### 11.4 City Placement Viability

| Инвариант | Значение | Причина |
|-----------|----------|---------|
| Min города | ≥ 50 | Минимум для 7+ цивилизаций |
| Город terrain | PLAIN, FOREST или DESERT | Города не на MOUNTAIN/WATER |
| City distance | ≥ 2 Chebyshev между любыми городами | Канон Map_Generation.md |
| Город не в TerritoryRadius=1 столицы другой цивилизации | True | Нейтральные города не в стартовой зоне |

### 11.5 Spawn Fairness

| Инвариант | Значение | Причина |
|-----------|----------|---------|
| Spawn score spread | `max(spawnScore) - min(spawnScore) ≤ 8` | Fair start (§9.2) |
| Resource equalization | Если spread > 8 → перераспределить ресурсы (не terrain/cities) | Мягкая коррекция |
| Neutral cities per capital | ≥ 2 нейтральных города в Chebyshev ≤ 6 | Ранняя экспансия для всех |

---

## 12) Интеграция с pipeline генерации

### 12.1 Модифицированный entry point

Тип мира выбирается **до** Шага 1 (landmask) из `World_Generation_Spec.md`:

```
Step 0:   SELECT world_type (rng or player choice)
Step 0.1: LOAD worldConfig = WORLD_CONFIGS[world_type]
Step 1:   GENERATE LANDMASK (using worldConfig.noiseFrequency, worldConfig.threshold, worldConfig.edgeFalloff)
Step 2:   CLASSIFY REGIONS (using worldConfig.minContinentSize, worldConfig.minIslandSize, ...)
Step 3:   ASSIGN TERRAIN (using worldConfig.terrainRatios, worldConfig.thresholdDeltas, ...)
Step 4:   PLACE RIVERS (using worldConfig.riverCount, worldConfig.riverMaxLength, ...)
Step 5:   PLACE CITIES (using worldConfig.cityRange, worldConfig.spawnRules)
Step 6:   PLACE RESOURCES (using worldConfig.resourceDensity, worldConfig.moneyScieceRatio, ...)
Step 7:   INIT TERRITORIES
Step 8:   INIT VISIBILITY
Step 9:   VALIDATE (using worldConfig.continentRange, worldConfig.islandRange + standard hard constraints)
```

### 12.2 WorldConfig structure

```
WorldConfig = {
  worldType: string,
  noiseFrequency: [min, max],
  landThreshold: [min, max],
  edgeFalloffWidth: number,
  continentRange: [min, max],
  minContinentSize: number,
  islandRange: [min, max],
  minIslandSize: number,
  minLakeSize: number,
  terrainRatios: { plain, forest, mountain, desert },
  thresholdDeltas: { mountain, forest, desert },
  biomeRandomness: number,
  riverCount: [min, max],
  riverLength: [min, max],
  mountainNoiseFreq: number,
  mountainIsolateRemoval: number,
  forestNoiseFreq: number,
  resourceDensityNormal: number,
  resourceDensityDesert: number,
  moneyScienceRatio: [money%, science%],
  resourceClustering: 'weak' | 'medium' | 'strong',
  cityRange: [min, max],
  spawnSpecialRules: SpawnRule[],
}
```

### 12.3 Определение world_type (derived, not stored)

`world_type` **не хранится** в MatchState и **не добавляется** в `match.schema.json`.

**Причина:** world_type детерминированно определяется из `match_seed` через weighted CDF (см. §1.2 для полного алгоритма):
```
rng = Mulberry32(match_seed)
roll = (rng.next() >>> 0) % 100
world_type = WORLD_TYPES[ CDF.findIndex(c => roll < c) ]
```

Любой код, которому нужен world_type, вычисляет его заново из seed. Это гарантирует:
- **Replay:** идентичная карта воспроизводится из seed (world_type пересчитывается)
- **UI:** world_type вычисляется на лету для Loading/Briefing screen
- **Нет schema bloat:** `match.schema.json` не модифицируется

**Deterministic generation seed:** world_type_id (index 0–4) передаётся в `attemptSeed(match_seed, world_type_id, attempt_index)` (§3.5.1). Тот же match_seed + тот же world_type → тот же attemptSeed → идентичная карта.

**MVP:** явный выбор world_type в UI отсутствует — всегда Random.

**Post-MVP override:** если реализован — world_type передаётся как **input parameter** к функции генерации (не stored in schema). При override CDF-выбор пропускается, но world_type_id используется тот же (index из enum). Override — это «параметр вызова генератора», а не сохранённое состояние.

---

## 13) Открытые вопросы

| # | Вопрос | Контекст |
|---|--------|---------|
| ~~1~~ | ~~Добавлять ли `world_type` в `match.schema.json`?~~ | **Resolved (v5.2):** Не добавлять. world_type детерминированно определяется из seed (§12.3) |
| ~~2~~ | ~~UI выбора типа мира в New Game Setup?~~ | **Resolved (v5.3):** MVP — только Random. Тип мира показывается на Loading/Briefing Screen (название + tooltip). Явный выбор — post-MVP (§1.2) |
| ~~3~~ | ~~Spawn quality score: финальные веса?~~ | **Resolved (v5.3):** Зафиксирован профиль `BALANCED_MVP` — единый для всех world_types. Веса: PLAIN +3, FOREST +2, DESERT +1, MOUNTAIN −2, WATER −1, Resources +2, NeutralCities +3. Калибровка после плейтеста (§9.2) |
| ~~4~~ | ~~PANGAEA distance relaxation~~ | **Resolved (v5.2):** Hard constraint ≥ 10 сохранён. Вместо ослабления — сателлитные острова (§4.3, §9.3) |
| ~~5~~ | ~~WILD: нижний предел PLAIN (≥ 25%)?~~ | **Resolved (v5.3, refined v5.4):** Hard constraint. Post-validation после terrain assignment: `PLAIN/LAND ≥ 0.25`. Нарушение → retry с `attemptSeed(match_seed, world_type_id, attempt_index)` (до 5), затем fallback на BALANCED config (§3.5) |
| ~~6~~ | ~~Балансировка вероятностей (30/20/20/15/15)?~~ | **Resolved (v5.3):** Зафиксированы для MVP: 30/20/20/15/15. Weighted selection через CDF (§1.2). Калибровка после плейтеста не требует schema-изменений |

---

## Appendix A: Отношение к другим документам

| Документ | Отношение |
|----------|----------|
| `World_Generation_Spec.md` (v5.0) | **Параметризует.** Данный документ не меняет алгоритм — только предоставляет разные наборы параметров для каждого world_type |
| `Map_Generation.md` (v4.34) | **Расширяет.** Добавляет world_type как предшествующий выбор перед генерацией |
| `Map_Design_Spec.md` (v5.1) | **Не конфликтует.** Визуальные правила не зависят от world_type (тот же terrain → тот же визуал) |
| `SOURCE_OF_TRUTH.md` (v4.42) | **Соблюдает все инварианты.** Terrain types, resource types, distances, city rules — неизменны |
| `tile.schema.json` (v4.42) | **Не модифицирует.** Никаких новых полей, типов, значений |

---

## Change Log

| Версия | Дата | Изменения |
|--------|------|-----------|
| v5.1 | 2026-03-04 | Начальная версия. 5 типов мира, terrain distribution, spawn balance, pipeline integration |
| v5.2 | 2026-03-04 | Architect review: (1) PANGAEA ≥10 preserved + satellite islands, (2) world_type derived from seed — no schema change, (3) Resource distribution scope clarified + per-world-type table, (4) NEW §11 Playability & Fairness Invariants, (5) Terrain naming cleaned — no implied new types. OQ #1 + #4 resolved. Sections renumbered: §11→§12, §12→§13 |
| v5.3 | 2026-03-04 | OQ closure: (OQ#2) UI = Random only, reveal on Loading/Briefing, (OQ#3) spawnScore weights = BALANCED_MVP profile locked, (OQ#5) WILD PLAIN ≥ 25% hard constraint + retry + BALANCED fallback §3.5, (OQ#6) probabilities 30/20/20/15/15 locked + weighted CDF §1.2. All 6 OQs now resolved. No schema/mechanics changes |
| v5.6 | 2026-03-05 | Soft/hard clarification: island counts for ALL world types → soft targets (generator doesn't retry on island count mismatch). Continent counts → soft targets EXCEPT PANGAEA continents=1 (hard). Updated §2.5, §4.2 table, §4.3 special rules, §10 summary. Rationale: islands are flavor variability, retry is overkill. No schema/mechanics changes |
| v5.5 | 2026-03-05 | PANGAEA canon: mainland_count=1 (hard), islands=5–10 (hard→soft in v5.6). Updated §2.5, §4.2, §4.3, §10 summary table. Added note: 4–6 continent range applies to BALANCED/CONTINENTAL/etc., not PANGAEA. Island ring is canonical PANGAEA feature. No schema/mechanics changes |
| v5.4 | 2026-03-04 | Deterministic attemptSeed: replaced magic `seed = match_seed + retryCount` with `attemptSeed = Hash32(match_seed, world_type_id, attempt_index)` via FNV-1a (§3.5.1). WILD constraint clarified: post-validation + full regen (not in-place adjustment) (§3.5). Post-MVP override clarified as input parameter (§1.2, §12.3). No schema/mechanics changes |

---

## Related Documents

| Document | Purpose |
|---------|--------|
| docs/03_map/World_Generation_Spec.md | Core algorithm for world generation |
| docs/03_map/Map_Design_Spec.md | Rendering pipeline and tile composition |
| docs/03_map/Tile_Style_Bible.md | Canonical visual style, palette and tile design rules |

