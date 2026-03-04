# World Generation Specification (v5.0)

Полная спецификация генерации мира для реализации в `@redage/core`.
Все правила согласованы с каноном: `SOURCE_OF_TRUTH.md` (v4.42), `tile.schema.json`, `Map_Generation.md`, `Resources.md`, `Territory_Rules.md`, `Visibility.md`.

> **Принцип:** один seed → один мир. Генерация полностью детерминирована через seeded PRNG (Mulberry32). Тот же seed всегда даёт идентичную карту, города, ресурсы и стартовые позиции.

---

## 1) Тайловая система (Tile System)

### 1.1 Двухуровневая классификация местности

Каждый тайл имеет два поля:

| Поле | Тип | Значения | Назначение |
|------|-----|----------|-----------|
| `terrain_base` | enum | `LAND`, `WATER` | Физический класс: суша или вода. Определяет проходимость для наземных/морских юнитов |
| `terrain_type` | enum | `PLAIN`, `FOREST`, `MOUNTAIN`, `DESERT`, `WATER` | Логический тип (T1). Определяет MoveCost, боевые бонусы, визуальный рендер |

**Связь:**
- `terrain_base = LAND` → `terrain_type ∈ {PLAIN, FOREST, MOUNTAIN, DESERT}`
- `terrain_base = WATER` → `terrain_type = WATER`

> **Канон:** ровно 5 типов местности (T1). Других типов (холмы, побережье, океан и т.д.) НЕ существует в текущей версии. Канон: SOT §Terrain (T1+R1).

### 1.2 Свойства типов местности

| terrain_type | MoveCost | Боевой бонус | Видимость | Ресурсы | Города |
|--------------|----------|-------------|-----------|---------|--------|
| PLAIN | 1 | — | cost=1 | MONEY / SCIENCE | Да |
| FOREST | 2 | DefenseModifier +1 | cost=1 | MONEY / SCIENCE | Да |
| MOUNTAIN | 2 | AttackFrom +1, AttackTo -1 (только с равнины) | cost=2, unit on mountain +1 sight | Нет ресурсов | Нет (города не размещаются) |
| DESERT | 1 | — | cost=1 | MONEY / SCIENCE (пониженная плотность) | Да |
| WATER | 1 (морские юниты) | — | cost=1 | Нет | Нет |

### 1.3 Река (River)

- **Река НЕ является отдельным типом местности.**
- Река = водный тайл (`terrain_base = WATER`, `terrain_type = WATER`) с флагом `is_river = true`.
- Геймплейных отличий от обычной воды **нет** (R1). Только визуальное различие.
- Канон: SOT §Terrain (T1+R1).

### 1.4 Полная структура тайла (tile.schema.json)

Каждый тайл содержит 20 свойств (канон: `schemas/tile.schema.json` v4.42):

```
x, y                         — координаты [0..79]
terrain_base                 — LAND | WATER
terrain_type                 — PLAIN | FOREST | MOUNTAIN | DESERT | WATER
is_river                     — boolean (default: false)
resource_type                — MONEY | SCIENCE | null
resource_remaining           — integer ≥ 0 (default: 0)
resource_yield_per_turn      — integer ≥ 0 (default: 2)
harvest_started              — boolean (default: false)
harvest_owner_player_id      — string | null
depleted_low_productivity    — boolean (default: false)
road_level                   — 0..3 (default: 0)
road_owner_player_id         — string | null
road_damaged_turns_left      — 0..2 (default: 0)
port_level                   — 0..3 (default: 0)
port_owner_player_id         — string | null
city_id                      — string | null
territory_city_id            — string | null
territory_owner_player_id    — string | null
visibility                   — integer[10], каждый ∈ {0, 1}
```

При генерации устанавливаются: `x`, `y`, `terrain_base`, `terrain_type`, `is_river`, `resource_type`, `resource_remaining`, `resource_yield_per_turn`, `city_id`, `territory_city_id`, `territory_owner_player_id`, `visibility`. Остальные поля — defaults.

---

## 2) Структура карты (Map Structure)

### 2.1 Размер и индексация

- **Размер:** 80 × 80 = **6400 тайлов** (фиксировано для MVP/PvE).
- **Хранение:** плоский массив `tiles_flat[6400]`.
- **Индексация:** `index = y * 80 + x` (row-major).
- **Координаты:** `x ∈ [0..79]`, `y ∈ [0..79]`.
- **Соседство:** 8-connected (включая диагонали). Используется Chebyshev distance: `dist(a, b) = max(|a.x - b.x|, |a.y - b.y|)`.

### 2.2 Требования к топологии

| Параметр | Значение | Тип ограничения |
|----------|----------|-----------------|
| Континенты | 4–6 | hard (retry при нарушении) |
| Острова | 5–10 | hard (retry при нарушении) |
| Города | 50–100 | hard |
| Доля суши | ~40–60% | soft (контролируется threshold) |
| Столицы | 8 (7 цивилизаций + 1 скрытая) | hard |
| Дистанция между столицами | ≥ 10 (Chebyshev) | hard |
| Дистанция между городами | ≥ 2 (Chebyshev) | hard |
| Старт Китая до края карты | ≥ 7 (Chebyshev) | hard |

### 2.3 Определения

- **Континент:** связный регион LAND-тайлов с площадью ≥ `MIN_CONTINENT_SIZE` тайлов. Связность 4-connected (без диагоналей) для определения сухопутных массивов.
- **Остров:** связный регион LAND-тайлов, НЕ являющийся континентом и с площадью ≥ `MIN_ISLAND_SIZE` тайлов.
- **Шум (noise artifacts):** связные регионы LAND площадью < `MIN_ISLAND_SIZE`. Удаляются (конвертируются в WATER).
- Аналогично: изолированные WATER-регионы внутри суши площадью < `MIN_LAKE_SIZE` — конвертируются в LAND (заполняются).

### 2.4 Константы генерации

```typescript
const MAP_WIDTH = 80;
const MAP_HEIGHT = 80;
const MAP_SIZE = MAP_WIDTH * MAP_HEIGHT; // 6400

const MIN_CONTINENTS = 4;
const MAX_CONTINENTS = 6;
const MIN_ISLANDS = 5;
const MAX_ISLANDS = 10;

const MIN_CONTINENT_SIZE = 200;  // тайлов (≈3% карты)
const MIN_ISLAND_SIZE = 8;       // тайлов
const MIN_LAKE_SIZE = 6;         // внутренние водоёмы меньше — заполняются

const MIN_CITIES = 50;
const MAX_CITIES = 100;
const MIN_CAPITAL_DISTANCE = 10; // Chebyshev
const MIN_CITY_DISTANCE = 2;     // Chebyshev
const CHINA_EDGE_DISTANCE = 7;   // Chebyshev до края карты

const MAX_RETRIES = 5;           // попыток генерации

// Terrain ratios (целевые, мягкие)
const TERRAIN_RATIO_PLAIN = 0.45;
const TERRAIN_RATIO_FOREST = 0.25;
const TERRAIN_RATIO_MOUNTAIN = 0.15;
const TERRAIN_RATIO_DESERT = 0.15;

// Resources
const RESOURCE_DENSITY_NORMAL = 0.25;  // 25% LAND-тайлов содержат ресурс (кроме MOUNTAIN)
const RESOURCE_DENSITY_DESERT = 0.12;  // пустыня — пониженная плотность
const RESOURCE_STOCK = 10;             // начальный запас
const RESOURCE_YIELD = 2;              // ед./ход до истощения
```

---

## 3) Алгоритм генерации (Generation Algorithm)

### 3.0 Entry point

```typescript
function generateWorld(matchSeed: number, civs: CivConfig[]): WorldGenResult {
  let seed = matchSeed;
  for (let retry = 0; retry <= MAX_RETRIES; retry++) {
    const rng = createSeededRng(seed);
    const result = attemptGeneration(rng, civs);
    if (result.valid) return result;
    seed = seed + 1; // retry с инкрементом seed
  }
  // Если все попытки неудачны — вернуть последний результат с предупреждением
  return lastResult;
}
```

### 3.1 Шаг 1: Генерация маски суши (Landmask)

**Цель:** создать двумерную маску `LAND`/`WATER` с нужным соотношением суши и воды.

**Алгоритм: Simplex noise (2D)**

```
1. threshold = rngFloat(0.35, 0.55)  // контролирует долю суши
2. frequency = rngFloat(0.04, 0.08)  // масштаб шума (крупнее → крупнее континенты)
3. octaves = 4                        // уровни детализации
4. persistence = 0.5                  // затухание амплитуды

5. Для каждого (x, y):
   noise_value = fractalNoise2D(x * frequency, y * frequency, octaves, persistence, seed)
   // noise_value ∈ [-1, 1] → нормализуем в [0, 1]
   normalized = (noise_value + 1) / 2
   if normalized > threshold → terrain_base = LAND
   else → terrain_base = WATER
```

**Краевой эффект (edge falloff):**
Чтобы карта имела «океанические» края, применяется distance-based falloff:

```
edgeDist = min(x, y, MAP_WIDTH-1-x, MAP_HEIGHT-1-y)
falloff = smoothstep(0, 8, edgeDist)  // 0..1, 0 на краю, 1 на расстоянии 8+
effectiveThreshold = threshold + (1 - falloff) * 0.3
```

Это повышает порог на краях, создавая водные границы карты.

### 3.2 Шаг 2: Классификация регионов (Floodfill)

**Цель:** идентифицировать связные регионы суши и воды.

```
1. Пометить все LAND-тайлы как unvisited
2. Floodfill (4-connected) для каждого непомеченного LAND-тайла:
   - Назначить region_id
   - Считать area (количество тайлов)
3. Отсортировать регионы по площади (desc)
4. Классификация:
   - regions[0..N-1] с area ≥ MIN_CONTINENT_SIZE → "continent" (N = rng(MIN_CONTINENTS, MAX_CONTINENTS))
   - Следующие регионы с area ≥ MIN_ISLAND_SIZE → "island" (до MAX_ISLANDS)
   - Регионы с area < MIN_ISLAND_SIZE → удалить (terrain_base = WATER)
5. Аналогично: floodfill WATER-тайлов внутри суши. Если замкнутый WATER-регион < MIN_LAKE_SIZE → заполнить (terrain_base = LAND)
```

**Валидация топологии:**
```
continentCount = количество регионов-континентов
islandCount = количество регионов-островов

if continentCount < MIN_CONTINENTS || continentCount > MAX_CONTINENTS → FAIL
if islandCount < MIN_ISLANDS || islandCount > MAX_ISLANDS → FAIL
```

### 3.3 Шаг 3: Назначение типов местности (Terrain Assignment)

**Цель:** каждому LAND-тайлу назначить `terrain_type` из `{PLAIN, FOREST, MOUNTAIN, DESERT}`.

**Алгоритм: вторичный noise + биомные зоны**

```
1. Генерируем 2 карты шума (другой seed/offset):
   - moisture_map[x][y]  — «влажность» (определяет FOREST vs DESERT)
   - elevation_map[x][y] — «высота» (определяет MOUNTAIN)

2. Для каждого LAND-тайла (x, y):
   elevation = elevation_map[x][y]  // нормализованный [0, 1]
   moisture  = moisture_map[x][y]   // нормализованный [0, 1]

   if elevation > MOUNTAIN_THRESHOLD:     // ≈ 0.78
     terrain_type = MOUNTAIN
   else if moisture > FOREST_THRESHOLD:   // ≈ 0.55
     terrain_type = FOREST
   else if moisture < DESERT_THRESHOLD:   // ≈ 0.25
     terrain_type = DESERT
   else:
     terrain_type = PLAIN

3. Для WATER-тайлов:
   terrain_type = WATER (автоматически)
```

**Пороги настраиваются через rng для вариативности:**
```
MOUNTAIN_THRESHOLD = 0.78 + rngFloat(-0.04, 0.04)
FOREST_THRESHOLD   = 0.55 + rngFloat(-0.05, 0.05)
DESERT_THRESHOLD   = 0.25 + rngFloat(-0.05, 0.05)
```

**Постобработка — целевые пропорции:**

После назначения проверяем пропорции на LAND-тайлах. Если какой-то тип значительно отклоняется от целевого (>5% абсолютных), выполняем коррекцию:

```
1. Считаем: actualRatio[type] = count[type] / totalLandTiles
2. Если отклонение > 5%:
   - Перебираем тайлы на границе между «переизбыточным» и «недостаточным» типами
   - Конвертируем пограничные тайлы (с noise-значением ближайшим к порогу)
   - Итерируем до acceptable deviation ≤ 5%
```

### 3.4 Шаг 4: Размещение рек (River Placement)

Реки — чисто визуальный элемент (R1). Геймплей-эффект = обычный WATER.

```
1. riverCount = rng(3, 8)
2. Для каждой реки:
   a. Найти "речной исток": LAND-тайл с высоким elevation, примыкающий к WATER или рядом с MOUNTAIN
   b. Трассировка пути:
      - current = исток
      - Направление: к ближайшему WATER/к нижнему elevation
      - На каждом шаге: выбрать соседний тайл с наименьшим elevation
      - Если текущий тайл = LAND → конвертировать в WATER + is_river=true
      - Если достигнут WATER-тайл (море/озеро) → завершить
      - Максимальная длина реки: 20 тайлов (предотвращение бесконечных циклов)
   c. Если река не достигла воды за 20 шагов → отбросить (не создавать)
3. Все новые WATER-тайлы, созданные рекой: terrain_base=WATER, terrain_type=WATER, is_river=true
```

**Важно:** река НЕ разрезает континент. Floodfill-классификация регионов выполняется ДО рек. Реки могут лишь сузить сухопутный «перешеек», но не разделить континент на два.

### 3.5 Шаг 5: Размещение городов (City Placement)

**Порядок:** сначала столицы (8 штук), затем нейтральные города.

#### 3.5.1 Столицы (8 штук: 7 цивилизаций + 1 скрытая)

```
1. candidate_tiles = LAND-тайлы с terrain_type ∈ {PLAIN, FOREST, DESERT}
   (MOUNTAIN и WATER исключены)
2. Перемешать candidates с rng
3. Для каждой цивилизации (i = 0..7):
   a. Выбрать первый candidate, удовлетворяющий:
      - Chebyshev distance ≥ MIN_CAPITAL_DISTANCE (10) до каждой уже размещённой столицы
      - Для Китая (civ_index определяется конфигурацией):
        Chebyshev distance ≥ CHINA_EDGE_DISTANCE (7) до любого края карты:
        min(x, y, 79-x, 79-y) ≥ 7
   b. Если подходящий candidate не найден → FAIL (retry с новым seed)
4. Записать: capital.x, capital.y, capital.owner_player_id = civs[i].player_id
```

#### 3.5.2 Распределение по континентам

Стратегия: генератор стремится разместить столицы на **разных континентах** для обеспечения раннего контакта до ~20 хода.

```
1. continents отсортированы по площади (desc)
2. Первые N столиц размещаются на N крупнейших континентах (по 1 на континент)
3. Оставшиеся столицы — на крупнейших оставшихся континентах или островах
4. Если континентов < 8: допускается 2 столицы на одном континенте (с distConstraint ≥ 10)
```

#### 3.5.3 Нейтральные города (оставшиеся 42–92 города)

```
1. totalCities = rng(MIN_CITIES, MAX_CITIES)  // [50..100]
2. neutralCount = totalCities - 8  // (столицы уже размещены)
3. candidate_tiles = LAND-тайлы, terrain_type ∈ {PLAIN, FOREST, DESERT}, без города
4. Перемешать с rng
5. Для каждого нейтрального города:
   a. Выбрать candidate с Chebyshev distance ≥ MIN_CITY_DISTANCE (2) до любого существующего города
   b. Если не найден → прекратить (города закончатся; если < MIN_CITIES → FAIL)
6. Параметры нейтрального города (канон v4.23):
   - owner_player_id = null
   - is_capital = false
   - level = 1
   - defense_level = 0
   - territory_radius = 1
   - integration_turns_left = 0 (нейтральный, не в процессе интеграции)
   - territory_tile_indices = computed (квадрат 3×3 вокруг центра)
```

### 3.6 Шаг 6: Размещение ресурсов (Resource Placement)

Ресурсы размещаются на LAND-тайлах (кроме MOUNTAIN). Два типа: `MONEY` и `SCIENCE`.

```
1. eligible_tiles = LAND-тайлы с terrain_type ∈ {PLAIN, FOREST, DESERT}, city_id = null
   (тайлы с городами НЕ содержат ресурсов)
2. Для каждого eligible tile:
   density = (terrain_type == DESERT) ? RESOURCE_DENSITY_DESERT : RESOURCE_DENSITY_NORMAL
   if rngFloat(0, 1) < density:
     resource_type = (rngFloat(0, 1) < 0.5) ? MONEY : SCIENCE  // ~50/50 split
     resource_remaining = RESOURCE_STOCK  // 10
     resource_yield_per_turn = RESOURCE_YIELD  // 2
```

**Гарантия стартовых ресурсов:**

Каждая столица должна иметь ≥ 2 ресурсных тайла в пределах `territory_radius = 1` (квадрат 3×3).

```
Для каждой столицы:
  territory = тайлы в Chebyshev distance ≤ 1 от столицы
  resourceCount = count(tile in territory where resource_type != null && tile != capital)
  while resourceCount < 2:
    pick random non-resource eligible tile in territory
    assign resource_type = (need MONEY more?) MONEY : SCIENCE
    resource_remaining = RESOURCE_STOCK
    resourceCount++
```

### 3.7 Шаг 7: Инициализация территорий

Территории вычисляются для всех городов (столиц + нейтральных):

```
Для каждого города:
  radius = territory_radius (1 для всех при генерации)
  territory_tile_indices = []
  for dy in [-radius..+radius]:
    for dx in [-radius..+radius]:
      tx = city.x + dx
      ty = city.y + dy
      if tx in [0..79] && ty in [0..79]:
        index = ty * 80 + tx
        territory_tile_indices.push(index)
        tiles_flat[index].territory_city_id = city.city_id
        tiles_flat[index].territory_owner_player_id = city.owner_player_id
```

**Конфликт территорий при генерации:**

Канонические правила (Territory_Rules.md):
- Территории городов **разных цивилизаций** не пересекаются.
- Территории городов **одной цивилизации** могут пересекаться; тайл принадлежит городу с более высоким level; при равенстве level — городу с меньшим `city_id`.

При генерации (все города level=1):
- **Столица vs нейтральный город** (разные «владельцы»: player vs null): территории не должны пересекаться. Это гарантируется ограничением MIN_CITY_DISTANCE ≥ 2 при territory_radius = 1 (территории 3×3 двух городов на расстоянии Chebyshev ≥ 2 пересекаются максимум по 1 ряду тайлов). Если пересечение всё же возникает: тайл остаётся за городом, который был обработан первым (порядок обхода: столицы по player_id, затем нейтральные по city_id).
- **Нейтральный vs нейтральный** (оба owner=null, формально «одна цивилизация» — нейтралы): тайл принадлежит городу с меньшим `city_id` (оба level=1 → fallback to city_id по канону).

### 3.8 Шаг 8: Инициализация видимости

Массив `visibility[10]` на каждом тайле. При генерации:

```
1. По умолчанию: все тайлы → visibility = [0,0,0,0,0,0,0,0,0,0]  // UNEXPLORED для всех 10 слотов

2. Для каждой цивилизации i (0..7):
   a. Территория столицы → visibility[i] = 1 (VISIBLE)
   b. Стартовый юнит (StarterScout A2, Sight=2) на тайле столицы:
      - Все тайлы в области видимости юнита → visibility[i] = 1
      - Область: все тайлы, достижимые из позиции юнита с суммарной стоимостью обзора ≤ Sight(2)
      - Стоимость обзора: обычный тайл = 1, MOUNTAIN = 2
      - (Юнит на горе получает +1 sight, но столица не на горе → sight = 2)

3. Слоты 8–9 остаются [0] при генерации.
   Зарезервированы для динамически появляющихся цивилизаций (MaxCivs=10, SOT v4.10).
```

### 3.9 Шаг 9: Валидация (Validation)

Все ограничения проверяются после полной генерации:

```
HARD CONSTRAINTS (при нарушении → retry):
1. continentCount ∈ [4, 6]
2. islandCount ∈ [5, 10]
3. cityCount ∈ [50, 100]
4. Все 8 столиц размещены
5. Chebyshev distance между любыми двумя столицами ≥ 10
6. Chebyshev distance между любыми двумя городами ≥ 2
7. China capital: min(x, y, 79-x, 79-y) ≥ 7
8. Каждая столица на LAND-тайле с terrain_type ≠ MOUNTAIN
9. Каждая столица имеет ≥ 2 ресурсных тайла в территории

SOFT CONSTRAINTS (предупреждение, но не retry):
- Доля суши ∈ [35%, 65%]
- Пропорции террейнов: отклонение ≤ 5% от целевых
- Каждый континент содержит ≥ 1 столицу (желательно)
```

---

## 4) Горы и реки — детализация

### 4.1 Горные кластеры

Горы не размещаются случайно — они формируют **хребты** (cluster-based):

```
1. elevation_map генерируется fractal noise с параметрами:
   - frequency = 0.06 (крупные структуры)
   - octaves = 3
   - persistence = 0.4

2. Пороговая фильтрация: только тайлы с elevation > MOUNTAIN_THRESHOLD → MOUNTAIN

3. Постобработка: изолированные MOUNTAIN-тайлы (без MOUNTAIN-соседей):
   - 50% шанс (rng) конвертировать в PLAIN (сглаживание одиночных гор)
```

Это создаёт горные цепи / хребты, а не случайные одиночные горы.

### 4.2 Горы — геймплей-взаимодействие при генерации

- Города **не размещаются** на MOUNTAIN (исключены из candidates).
- Ресурсы **не размещаются** на MOUNTAIN.
- Горы могут создавать естественные «стены» между регионами (стратегический элемент).
- Вход на горы требует Military L2 tech — на старте горы непроходимы.

### 4.3 Реки — визуальная логика

Реки генерируются от «высокого» к «низкому» (по elevation_map):

```
1. riverStart: LAND-тайл с elevation в top 20% и Chebyshev distance ≤ 3 от MOUNTAIN
2. Трассировка: greedy descent по elevation к ближайшему WATER
3. При трассировке: если путь «заходит в тупик» (все соседи выше):
   - Добавить случайное смещение (rng) на 1 шаг
   - Если 3 тупика подряд → прервать реку
4. Ширина реки: всегда 1 тайл (для MVP)
```

---

## 5) Ресурсная модель (Resources)

### 5.1 Типы ресурсов

> **Канон:** ровно 2 типа ресурсов на тайлах: `MONEY` и `SCIENCE`. Других ресурсов (руда, нефть, еда, энергия и т.д.) НЕ существует. Канон: `Resources.md`, `tile.schema.json`.

| resource_type | Назначение | Начальный запас | Yield (active) | Yield (depleted) |
|--------------|-----------|----------------|----------------|-----------------|
| MONEY | Доход денег | 10 | 2/ход | 1/ход (∞) |
| SCIENCE | Прирост науки | 10 | 2/ход | 1/ход (∞) |

### 5.2 Размещение ресурсов при генерации

**Правила:**
1. Ресурсы размещаются ТОЛЬКО на `terrain_type ∈ {PLAIN, FOREST, DESERT}`.
2. `MOUNTAIN` и `WATER` — без ресурсов.
3. Тайл с городом (`city_id ≠ null`) — без ресурса.
4. Пустыня (`DESERT`) имеет пониженную плотность ресурсов (~12% vs ~25%).
5. Соотношение MONEY : SCIENCE ≈ 50:50 (±5%, rng).

**Кластеризация ресурсов (optional refinement):**

Для стратегической глубины ресурсы могут быть слегка кластеризованы:

```
1. Генерируем resource_noise[x][y] (ещё один слой simplex)
2. Тайлы с resource_noise > resource_threshold получают ресурс
3. Тип ресурса определяется позицией:
   - resource_type_noise[x][y] > 0.5 → MONEY, иначе SCIENCE
```

Это создаёт «зоны» преимущественно денежных или научных ресурсов, добавляя стратегический выбор при экспансии.

### 5.3 Гарантии стартовых ресурсов

Каждая столица должна иметь доступ к ресурсам для жизнеспособного старта:

```
Для каждой столицы:
  territory3x3 = тайлы в Chebyshev dist ≤ 1 от столицы (территория radius=1)
  moneyTiles = count(tile in territory3x3 where resource_type == MONEY)
  scienceTiles = count(tile in territory3x3 where resource_type == SCIENCE)

  // Гарантия: минимум 1 MONEY + 1 SCIENCE в стартовой территории
  if moneyTiles == 0:
    convert nearest non-resource eligible tile → MONEY, stock=10
  if scienceTiles == 0:
    convert nearest non-resource eligible tile → SCIENCE, stock=10
```

---

## 6) Размещение цивилизаций (Civilization Spawn)

### 6.1 Конфигурация цивилизаций

7 основных + 1 скрытая (AI-only). Канон: SOT §Базовые инварианты.

| Слот | Тип | Управление |
|------|-----|-----------|
| 0 | Игрок | human |
| 1–6 | AI-цивилизации | AI |
| 7 | Скрытая цивилизация | AI-only (hidden until spawn event) |

### 6.2 Порядок размещения столиц

```
1. Определить допустимые тайлы для столиц (LAND, не MOUNTAIN)
2. Размещать в порядке: игрок → AI цивилизации → скрытая

3. Приоритеты размещения:
   a. Максимально распределить по разным континентам
   b. Chebyshev ≥ 10 между столицами
   c. China: ≥ 7 от края
   d. Предпочтение PLAIN-тайлов (FOREST и DESERT допустимы)

4. Алгоритм:
   - Отсортировать континенты по площади (desc)
   - Для каждой цивилизации: выбрать континент round-robin
   - На выбранном континенте: найти PLAIN-тайл, удовлетворяющий distance constraints
   - Fallback: FOREST → DESERT (по приоритету)
```

### 6.3 Стартовые юниты

Канон: `Start_Conditions.md` (v4.11)

```
Для каждой цивилизации (0..7):
  spawn StarterScout (A2) на тайле столицы:
    - unit_type = "StarterScout"
    - hp = MaxHP (по таблице юнитов)
    - x = capital.x, y = capital.y
    - has_acted_this_turn = false
    - sight = 2
```

### 6.4 Стартовая экономика

```
Для каждого игрока:
  money = 100
  science = 0
  stability = 70
  tech_unlocked = []  // нет технологий
  stability_boost_used_this_turn = false
```

### 6.5 Скрытая цивилизация

- Слот 7 (index 7). При генерации: столица размещается, но `visibility` для слота 7 не раскрывается другим.
- Активация: через событие `HIDDEN_CIV_SPAWN` позже в партии.
- При генерации мира: столица скрытой цивилизации размещается по тем же правилам, но:
  - Не должна быть видна из стартовых территорий других цивилизаций.
  - Предпочтительно на отдельном континенте/острове.

---

## 7) Визуальный размер тайла (Tile Rendering)

### 7.1 Размер тайла в пикселях

Базовый размер тайла определяется масштабом (zoom level):

```
BASE_TILE_SIZE = 64px  // при zoom = 1.0

Zoom range: 0.25 .. 4.0
Tile pixel size = BASE_TILE_SIZE * zoom

При zoom = 1.0: 64×64 px на тайл
Viewport при 1280×800: ~20×12 тайлов видимых
Full map: 80×64 = 5120px × 80×64 = 5120px
```

### 7.2 Уровни детализации (LOD)

| Zoom | Tile px | Показывается |
|------|---------|-------------|
| 0.25–0.5 | 16–32 | Только terrain color + territory borders. Без иконок |
| 0.5–1.0 | 32–64 | Terrain + cities + units (simplified). Resource icons |
| 1.0–2.0 | 64–128 | Full detail: terrain, roads, ports, units, HP, resource icons, status |
| 2.0–4.0 | 128–256 | Maximum detail: текстуры с деталями, анимации |

### 7.3 Форма тайла

- **Квадратные тайлы** (square grid). Не гексагональные.
- Причина: Chebyshev distance = max(|dx|,|dy|) натуральна для квадратной сетки.
- 8-connected соседство (включая диагонали).

### 7.4 Визуальные токены (из Map_Visual_Spec.md)

| terrain_type | Token | Цвет-placeholder |
|-------------|-------|-------------------|
| PLAIN | terrain_plain | Светло-зелёный / бежевый |
| FOREST | terrain_forest | Тёмно-зелёный |
| MOUNTAIN | terrain_mountain | Серый / коричневый |
| DESERT | terrain_desert | Жёлтый / песочный |
| WATER | terrain_water | Синий / голубой |
| WATER+river | terrain_river | Светлый синий (отличимый от моря) |

### 7.5 PixiJS-рендеринг карты (архитектурная заметка)

```
Карта рендерится PixiJS (WebGL):
- TilemapContainer: sprite batch для terrain (1 draw call per terrain_type)
- OverlayContainer: дороги, порты, границы территорий
- EntityContainer: юниты, города
- FogContainer: затемнение UNEXPLORED тайлов
- UIContainer: selection highlight, move range, HP labels

Pan: drag / touch drag
Zoom: scroll wheel / pinch
Camera: free pan в пределах 0..5120, 0..5120 (при zoom=1)
```

---

## 8) Структура данных в движке (Engine Data Structure)

### 8.1 WorldGenResult

```typescript
interface WorldGenResult {
  valid: boolean;
  seed: number;
  retryCount: number;
  warnings: string[];

  tiles_flat: TileState[];     // length = 6400
  cities: CityState[];         // length = 50..100
  players: PlayerState[];      // length = 8
  units: UnitState[];          // length = 8 (стартовые юниты, по 1 на цивилизацию)

  meta: {
    continentCount: number;
    islandCount: number;
    landRatio: number;          // доля суши (0..1)
    terrainRatios: Record<TerrainType, number>;
    resourceCount: { MONEY: number; SCIENCE: number };
  };
}
```

### 8.2 Инициализация MatchState из WorldGenResult

```typescript
function initMatchState(gen: WorldGenResult, config: MatchConfig): MatchState {
  return {
    version: "0.0.1",
    seed: gen.seed,
    match_id: generateMatchId(),
    map_width: MAP_WIDTH,
    map_height: MAP_HEIGHT,
    tiles_flat: gen.tiles_flat,
    players: gen.players,
    cities: gen.cities,
    units: gen.units,
    diplomacy: { relations: [] },
    events: [],
    current_round: 0,
    current_player_index: 0,
    victory: null,
    turn_order: config.turnOrder,  // AI first, human last
  };
}
```

### 8.3 Детерминизм: noise-функция

Simplex noise должен быть **детерминированным** (pure function от seed + координат). Рекомендуемая реализация:

```typescript
// Вариант 1: open-simplex-noise (npm) с передачей seed
// Вариант 2: собственная реализация simplex-2d на основе seeded permutation table

function createNoiseGenerator(seed: number): (x: number, y: number) => number {
  // Инициализация permutation table из seed (через createSeededRng)
  const rng = createSeededRng(seed);
  const perm = generatePermutationTable(rng); // 256 элементов, shuffled

  return function noise2D(x: number, y: number): number {
    // Simplex noise implementation using perm table
    // Returns value in [-1, 1]
  };
}
```

**Критически важно:** noise реализация НЕ должна зависеть от `Math.random()`. Только от переданного seed.

### 8.4 Вспомогательные функции

```typescript
// Координаты ↔ индекс
function tileIndex(x: number, y: number): number { return y * MAP_WIDTH + x; }
function tileCoords(index: number): { x: number; y: number } {
  return { x: index % MAP_WIDTH, y: Math.floor(index / MAP_WIDTH) };
}

// Chebyshev distance
function chebyshev(a: {x:number, y:number}, b: {x:number, y:number}): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

// Edge distance (min distance to any map edge)
function edgeDistance(x: number, y: number): number {
  return Math.min(x, y, MAP_WIDTH - 1 - x, MAP_HEIGHT - 1 - y);
}

// 8-connected neighbors
function neighbors8(x: number, y: number): Array<{x: number, y: number}> {
  const result = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < MAP_WIDTH && ny >= 0 && ny < MAP_HEIGHT) {
        result.push({ x: nx, y: ny });
      }
    }
  }
  return result;
}

// 4-connected neighbors (for floodfill)
function neighbors4(x: number, y: number): Array<{x: number, y: number}> {
  const result = [];
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    const nx = x + dx, ny = y + dy;
    if (nx >= 0 && nx < MAP_WIDTH && ny >= 0 && ny < MAP_HEIGHT) {
      result.push({ x: nx, y: ny });
    }
  }
  return result;
}

// Smoothstep
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
```

---

## 9) Крайние случаи и отказоустойчивость (Edge Cases)

### 9.1 Retry-механизм

```
Если валидация (Шаг 9) не проходит:
  seed += 1
  retry_count += 1
  if retry_count > MAX_RETRIES (5):
    Использовать последний результат + log warning
    (Лучше карта с мелкими нарушениями soft constraints, чем crash)
```

### 9.2 Тупики размещения столиц

Если невозможно разместить все 8 столиц с distConstraint ≥ 10:
- **Причина:** слишком маленькие/фрагментированные континенты.
- **Решение:** FAIL → retry с другим seed (seed + 1).
- Если после MAX_RETRIES всё ещё не удаётся: ослабить distConstraint до 8 (log warning).

### 9.3 Недостаточно мест для городов

Если после столиц не удаётся разместить `MIN_CITIES - 8 = 42` нейтральных города:
- **Причина:** слишком мало суши или слишком много гор.
- **Решение:** retry с другим seed.
- **Fallback:** ослабить MIN_CITY_DISTANCE до 1 (DESERT уже входит в стандартный candidate list наряду с PLAIN и FOREST).

### 9.4 Река разрезает сушу

Реки конвертируют LAND → WATER. Это может:
- Уменьшить площадь континента (ОК, если он остаётся ≥ MIN_CONTINENT_SIZE).
- Изолировать маленький кусок суши (< MIN_ISLAND_SIZE → конвертировать в WATER).
- Разделить континент на два → один из них может стать < MIN_CONTINENT_SIZE → retry.

**Защита:** после размещения рек перепроверить floodfill. Если топология нарушена → откатить реки этого retry и попробовать заново (с другим набором рек, тот же seed).

### 9.5 Город на тайле, конвертированном рекой

Реки размещаются ПОСЛЕ городов? Нет: **порядок = Landmask → Terrain → Rivers → Cities → Resources**.

Таким образом, при размещении городов реки уже есть, и города не могут быть на WATER-тайлах.

### 9.6 Пустая территория (без eligible tiles)

Если территория столицы (3×3) состоит из WATER/MOUNTAIN и нет места для ресурсов:
- **Причина:** столица размещена на узком перешейке.
- **Решение:** при размещении столиц дополнительно проверять, что в 3×3 территории есть ≥ 4 LAND-тайла (не MOUNTAIN).

### 9.7 Скрытая цивилизация — нет места

Если невозможно разместить 8-ю столицу (скрытая) с distConstraint ≥ 10:
- **Ослабление:** distConstraint для скрытой = 8 (минимум).
- Если и 8 невозможно → retry.

### 9.8 Determinism: floating-point

Все noise-вычисления используют стандартный IEEE 754 double. Порядок операций должен быть фиксированным (без перестановок). TypeScript на V8 гарантирует детерминизм на одной платформе.

**Cross-platform determinism** (web vs mobile vs server): гарантируется если:
- Тот же JS-движок (V8 в Chrome, Node.js, Capacitor WebView).
- Тот же код (одна кодовая база `@redage/core`).
- Simplex noise — чистая функция (нет side effects).

### 9.9 Seed = 0

Специальное значение: `seed = 0` допускается. `createSeededRng(0)` работает корректно (Mulberry32 не вырождается при seed=0).

---

## 10) Сводка (Summary)

### Pipeline генерации

```
                 ┌───────────────────────────────────────────┐
                 │          generateWorld(seed, civs)         │
                 └────────────────────┬──────────────────────┘
                                      │
                 ┌────────────────────▼──────────────────────┐
                 │ 1. Landmask (Simplex Noise + Edge Falloff)│
                 │    → terrain_base: LAND / WATER            │
                 └────────────────────┬──────────────────────┘
                                      │
                 ┌────────────────────▼──────────────────────┐
                 │ 2. Region Classification (Floodfill)       │
                 │    → continents, islands, noise cleanup     │
                 └────────────────────┬──────────────────────┘
                                      │
                 ┌────────────────────▼──────────────────────┐
                 │ 3. Terrain Assignment (Secondary Noise)    │
                 │    → PLAIN / FOREST / MOUNTAIN / DESERT    │
                 └────────────────────┬──────────────────────┘
                                      │
                 ┌────────────────────▼──────────────────────┐
                 │ 4. River Placement                         │
                 │    → LAND→WATER conversion, is_river=true  │
                 └────────────────────┬──────────────────────┘
                                      │
                 ┌────────────────────▼──────────────────────┐
                 │ 5. City Placement                          │
                 │    → 8 capitals + 42–92 neutral cities     │
                 └────────────────────┬──────────────────────┘
                                      │
                 ┌────────────────────▼──────────────────────┐
                 │ 6. Resource Placement                      │
                 │    → MONEY / SCIENCE on eligible tiles      │
                 └────────────────────┬──────────────────────┘
                                      │
                 ┌────────────────────▼──────────────────────┐
                 │ 7. Territory Init                           │
                 │    → territory_city_id, territory_owner     │
                 └────────────────────┬──────────────────────┘
                                      │
                 ┌────────────────────▼──────────────────────┐
                 │ 8. Visibility Init                          │
                 │    → capital territory + scout sight         │
                 └────────────────────┬──────────────────────┘
                                      │
                 ┌────────────────────▼──────────────────────┐
                 │ 9. Validation                               │
                 │    → hard/soft constraint checks             │
                 │    → PASS or retry (seed+1, max 5)          │
                 └─────────────────────────────────────────────┘
```

### Ключевые инварианты

| Инвариант | Значение |
|-----------|----------|
| Карта | 80×80 = 6400, index = y*80+x |
| Terrain | 5 типов: PLAIN, FOREST, MOUNTAIN, DESERT, WATER |
| Ресурсы | 2 типа: MONEY, SCIENCE. Запас=10, yield=2/ход, depleted=1/ход |
| Река | WATER + is_river=true. Без геймплей-отличий |
| Города | 50–100 (8 столиц + neutral). Не на MOUNTAIN/WATER |
| Столицы | ≥ 10 Chebyshev друг от друга |
| Города | ≥ 2 Chebyshev друг от друга |
| Китай | ≥ 7 от края карты |
| Территория | Radius=1 при генерации. Квадрат (2R+1)² |
| Видимость | 2-state: UNEXPLORED / VISIBLE. Permanent reveal |
| Детерминизм | Тот же seed → та же карта (Mulberry32 PRNG) |

### Зависимости от canon

| Документ | Что используется |
|----------|-----------------|
| `SOURCE_OF_TRUTH.md` | Все инварианты, константы |
| `tile.schema.json` | Структура тайла (21 поле) |
| `city.schema.json` | Структура города |
| `Map_Generation.md` | Базовый алгоритм (расширен здесь) |
| `Resources.md` | MONEY/SCIENCE, запас 10, yield 2/1 |
| `Territory_Rules.md` | Chebyshev, radius=1, конфликты |
| `Visibility.md` | 2-state, sight cost, mountain +1 |
| `Start_Conditions.md` | Money=100, Science=0, Stability=70, StarterScout |
| `Map_Visual_Spec.md` | Terrain tokens, LOD, rendering |
| `Damage_and_Rules.md` | Terrain combat bonuses (FOREST +1 def, MOUNTAIN +1 atk/-1 def) |
| `Network.md` | Мосты (1 WATER between LAND) |

---

## Appendix A: Пример seed trace

Для тестирования детерминизма:

```
Seed: 42
Expected:
  landRatio ≈ 0.47
  continents = 5
  islands = 7
  cities = 73
  terrain_ratios ≈ { PLAIN: 0.44, FOREST: 0.26, MOUNTAIN: 0.14, DESERT: 0.16 }
  resources = { MONEY: 187, SCIENCE: 192 }
```

> Точные значения будут зафиксированы после первой реализации и записаны в snapshot-тест.

## Appendix B: Отношение к существующему Map_Generation.md

Этот документ (`World_Generation_Spec.md`) **расширяет и детализирует** существующий `Map_Generation.md`. Отношение:

- `Map_Generation.md` — высокоуровневый псевдокод + канонические правила (размеры, ограничения, нейтральные города).
- `World_Generation_Spec.md` — полная реализуемая спецификация: конкретные алгоритмы, константы, edge cases, data structures.

При конфликте — `Map_Generation.md` приоритетнее (он ближе к SOT). Этот документ не вводит новых геймплей-правил — только формализует реализацию.
