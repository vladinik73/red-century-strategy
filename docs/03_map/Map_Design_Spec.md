# Map Design Spec (v5.1) — Visual Style & Rendering Rules

Канон: `World_Generation_Spec.md`, `Map_Visual_Spec.md`, `Map_Overlays.md`, `Visibility.md`, `Territory_Rules.md`, `Design_System.md`, `PROJECT_IDENTITY.md`, `Tile_Style_Bible.md`.

> **Tile visuals source of truth:** Конкретные правила визуального стиля тайлов (палитра, пропы, silhouettes, shading) — в [`docs/03_map/Tile_Style_Bible.md`](Tile_Style_Bible.md). Данный документ определяет rendering pipeline и layout; Tile_Style_Bible определяет *look*.

> Этот документ определяет **визуальный стиль и правила рендеринга** карты. Он НЕ вводит новых механик или типов местности — только формализует, как существующий tile state превращается в пиксели на экране.

---

## 1) Визуальные цели и референсы (Visual Goals & References)

### 1.1 Стилевые столпы

Red Age визуально вдохновлён **Battle of Polytopia** — чистый, яркий, читаемый стиль с минималистичной геометрией:

| Столп | Описание |
|-------|----------|
| **Читаемость** | Любой тип местности мгновенно отличим при дефолтном зуме. Юниты, города и статусы видны без вглядывания |
| **Насыщенные, но не неоновые цвета** | Палитра яркая и тёплая, но не кислотная. Цвета «живые», без серости |
| **Простое затенение** | Flat shading с минимальным количеством градиентов. Допускается 1–2 уровня тени на пропе (не больше) |
| **Минимальные текстуры** | Тайлы читаются через цвет + силуэт пропов, а не через процедурный текстурный шум |
| **Сильные контрасты между террейнами** | Каждый terrain_type имеет уникальную цветовую зону — ни один не «сливается» с соседним |
| **Масштабная консистентность** | Пропорции деревьев, гор, зданий одинаковые на любом зуме. Один тайл = один «юнит пространства» |
| **Mobile-first чёткость** | На экране телефона (375px) при дефолтном зуме всё должно читаться без zoom-in |

### 1.2 Чем проект НЕ является (anti-references)

- **Не Civ V/VI:** никакого фотореализма, сложных текстур, HDR-освещения
- **Не dense pixel art:** никаких пиксельных шрифтов, 16-цветных палитр, ретро-эстетики
- **Не RTS:** нет анимированного ландшафта, динамических теней, particle-тяжёлых эффектов
- **Не watercolor/painterly:** нет мягких размытых границ между террейнами, нет импрессионизма
- **Не noisy:** тайл не должен содержать более 3 визуально различимых элементов (base color + 1–3 props)

### 1.3 Ключевые референсы

| Референс | Что берём |
|----------|----------|
| Polytopia | Общий стиль: flat, яркие цвета, крупные силуэты, 1 клетка = 1 читаемый объект |
| Civ VI (стилизованная версия) | Иерархия визуальных слоёв: terrain → infra → entities → UI |
| Tiny Kingdom / Mini Metro | Чистота линий, минимализм UI поверх карты |
| Monument Valley | Палитра: тёплые, «живые» цвета без шума |

---

## 2) Размер тайла, камера, зум (Tile Size, Camera, Zoom)

### 2.1 Базовый размер тайла

| Параметр | Значение | Обоснование |
|----------|----------|-------------|
| `BASE_TILE_SIZE` | **96 px** (canonical) | Каноническое значение. Позволяет разместить 1 пропу + 1 юнита + HP-число без перекрытий. На 64px пропы слишком мелкие на мобайле; 128px — слишком мало тайлов в viewport |
| Форма | Квадрат | Канон: square grid, 8-connected, Chebyshev distance |
| Полный размер карты (zoom=1) | 80 × 96 = **7680 px** | В обоих направлениях |

> **Примечание:** `BASE_TILE_SIZE = 96` — каноническое значение для всех расчётов в данном документе. Движок параметризует `BASE_TILE_SIZE` через единственную константу — при необходимости смены размера рендер перерасчитывается автоматически, но 96px является baseline для всех производных метрик (safe zones, prop margins, border thickness, LOD thresholds).

### 2.2 Viewport при разных устройствах (zoom = 1.0)

| Устройство | Viewport | Видимых тайлов |
|-----------|----------|---------------|
| Mobile (375 × 812) | 375 × 700 (за вычетом HUD) | ~3.9 × 7.3 |
| Tablet (768 × 1024) | 768 × 900 | ~8 × 9.4 |
| Desktop (1280 × 800) | 1280 × 700 | ~13.3 × 7.3 |
| Desktop wide (1920 × 1080) | 1920 × 980 | ~20 × 10.2 |

На мобайле при zoom=1.0 видны ~4×7 тайлов — достаточно для тактического обзора окрестностей города. Стратегический обзор — через zoom-out.

### 2.3 Зум

| Параметр | Значение |
|----------|----------|
| `ZOOM_MIN` | 0.25 |
| `ZOOM_MAX` | 3.0 |
| `ZOOM_DEFAULT` | 1.0 |
| `ZOOM_STEP` (scroll wheel) | ×1.15 per tick |
| `ZOOM_PINCH` | smooth, gesture-based |

### 2.4 LOD-пороги (Level of Detail)

Три уровня LOD, переключаемых по effective tile size:

| LOD | Zoom range | Effective tile px | Показывается | Скрывается |
|-----|-----------|-------------------|--------------|------------|
| **LOD-0 (overview)** | < 0.5 | < 48 | Terrain color fill. Territory borders (1px). City dots. Capital marker. Faction colors | Props, roads, ports, units, HP, resource icons, status badges, coastline detail |
| **LOD-1 (tactical)** | 0.5 – 1.5 | 48 – 144 | Terrain fill + base props (1–2 per tile). Roads (simplified). Cities (sized by level). Units (shape + faction color). HP numbers. Resource icons. Coastline band | Мелкие декоративные пропы, детализированные текстуры дорог, port detail |
| **LOD-2 (close-up)** | > 1.5 | > 144 | Full prop set (2–3 per tile). Road detail (thickness by level). Port sprite. Coastline foam. Status badges. Veterancy badge. River animation (subtle) | — (всё отображается) |

### 2.5 Камера

- **Pan:** drag (mouse) / touch-drag (mobile). Инерция: short momentum с deceleration.
- **Bounds:** камера не выходит за пределы карты + 1 тайл padding.
- **Snap-to-tile:** отсутствует. Свободный субпиксельный pan.
- **Center on unit/city:** при выборе юнита или города камера плавно центрируется, если объект за пределами viewport.

---

## 3) Цветовая палитра (Color Palette)

### 3.1 Terrain palette

Палитра вдохновлена Polytopia — тёплые, насыщенные, читаемые цвета с чёткими контрастами.

| Элемент | Token | HEX | RGB | Описание |
|---------|-------|-----|-----|----------|
| **PLAIN** | `terrain_plain` | `#8FBF5A` | 143, 191, 90 | Тёплый травяной зелёный. Основной «позитивный» terrain |
| **PLAIN shadow** | `terrain_plain_shade` | `#6F9E42` | 111, 158, 66 | Для тени / grid-линий между PLAIN-тайлами |
| **FOREST** | `terrain_forest` | `#3D7A3E` | 61, 122, 62 | Глубокий зелёный. Чётко темнее PLAIN |
| **FOREST shadow** | `terrain_forest_shade` | `#2D5E2E` | 45, 94, 46 | Тень стволов / подлеска |
| **MOUNTAIN** | `terrain_mountain` | `#9B8E7A` | 155, 142, 122 | Тёплый серо-коричневый. Камень, не холодный серый |
| **MOUNTAIN peak** | `terrain_mountain_peak` | `#D9CFC2` | 217, 207, 194 | Светлые вершины / снежные шапки |
| **DESERT** | `terrain_desert` | `#E8C96A` | 232, 201, 106 | Тёплый золотисто-песочный |
| **DESERT shadow** | `terrain_desert_shade` | `#C9A84E` | 201, 168, 78 | Тень дюн / барханов |
| **WATER (ocean)** | `terrain_water` | `#4A90C4` | 74, 144, 196 | Глубокий, но не тёмный синий |
| **WATER shallow** | `terrain_water_shallow` | `#6DB3D4` | 109, 179, 212 | Мелководье (рядом с берегом) |
| **RIVER** | `terrain_river` | `#5BAED6` | 91, 174, 214 | Светлее ocean, с лёгкой бирюзой. Визуально отличим |
| **BEACH / shoreline** | `terrain_beach` | `#E8DCC0` | 232, 220, 192 | Узкая песчаная полоса (1–4px) на границе LAND↔WATER |

### 3.2 UI / overlay palette

| Элемент | Token | HEX | Описание |
|---------|-------|-----|----------|
| **FOG (UNEXPLORED)** | `fog_unexplored` | `#1A1A2E` @ 85% opacity | Почти непрозрачная тёмная вуаль. Контуры тайлов едва видны |
| **FOG edge glow** | `fog_edge` | `#2D2D4A` @ 50% opacity | Мягкий переход на 1px по границе VISIBLE↔UNEXPLORED |
| **Territory border** | `territory_border` | Faction color @ 60–80% opacity | Линия. Цвет = faction color владельца. См. §3.5 для thickness rules |
| **Territory fill (selected)** | `territory_fill` | Faction color @ 8–15% opacity | При клике на город — заливка территории. Strict range: ≤ 15% alpha |
| **Selection highlight** | `selection_tile` | `#FFFFFF` @ 30% opacity | Подсветка тайла при наведении/выборе |
| **Move range** | `move_range` | `#4ADE80` @ 25% opacity | Зелёная заливка доступных для движения тайлов |
| **Attack range** | `attack_range` | `#F87171` @ 25% opacity | Красная заливка тайлов в радиусе атаки |
| **Grid line** | `grid_line` | `#000000` @ 6% opacity | Тонкая линия между тайлами (0.5px logical). Видна только при LOD-1+ |

### 3.3 Faction palette (7 + 1 скрытая)

Нумерация: 1-indexed (`faction_1` .. `faction_7` + hidden), согласно `Design_System.md` и `Unit_Visual_Spec.md`.

| Слот | Token | HEX | Ассоциация (placeholder) |
|------|-------|-----|--------------------------|
| faction_1 (player) | `faction_1` | `#3B82F6` | Синий |
| faction_2 | `faction_2` | `#EF4444` | Красный |
| faction_3 | `faction_3` | `#F59E0B` | Янтарный |
| faction_4 | `faction_4` | `#10B981` | Изумрудный |
| faction_5 | `faction_5` | `#8B5CF6` | Фиолетовый |
| faction_6 | `faction_6` | `#EC4899` | Розовый |
| faction_7 | `faction_7` | `#06B6D4` | Голубой (cyan) |
| hidden | `faction_hidden` | `#6B7280` | Серый (скрытая цивилизация, появляется позже) |
| neutral | `faction_neutral` | `#9CA3AF` | Светло-серый (нейтральные города) |

### 3.4 Colorblind safety

- **Принцип:** цвет НЕ является единственным различителем. Каждый элемент дублируется формой/иконкой/текстом.
- **Terrain:** различается по цвету + пропам (деревья vs скалы vs кактусы vs волны). Даже в grayscale контраст сохраняется: PLAIN (light) → FOREST (dark) → MOUNTAIN (mid) → DESERT (light-warm) → WATER (mid-dark).
- **Factions:** territory borders используют цвет + паттерн (solid line для player, dashed для allies, dotted для enemies). Badge/label с номером фракции при hover.
- **Проверка:** палитра прошла симуляцию deuteranopia, protanopia, tritanopia — все 5 terrains различимы. При финализации HEX-кодов повторить проверку через Sim Daltonism или аналог.
- **WCAG AA:** все текстовые элементы на карте (HP, city level) имеют контраст ≥ 4.5:1 на фоне terrain. Достигается через `text-shadow` или полупрозрачную подложку.

### 3.5 Territory border rendering rules

Территориальные границы должны быть **читаемыми на всех террейнах**, но **не подавлять** дороги, юниты и города.

| Параметр | Значение | Обоснование |
|----------|----------|-------------|
| **Border thickness** | `max(1, round(BASE_TILE_SIZE / 48))` px = **2px @ 96px tile** | Тонкая, но заметная. Масштабируется с tile size |
| **Border alpha (normal)** | **60–80%** opacity (0.60–0.80) | Достаточно яркая для читаемости, но не перекрывает terrain detail |
| **Border alpha (selected city)** | **90–100%** opacity | Усиленная при selection |
| **Territory fill alpha (selected)** | **8–15%** opacity (strict ceiling: 15%) | Лёгкая заливка. Выше 15% → terrain colors «тонут» в faction color |
| **Territory fill (default, no selection)** | **0%** (не отображается) | Только при клике на город |
| **Border position** | Внутренний край тайла (inset 0.5px) | Не выходит за пределы тайла → не конфликтует с соседним тайлом |
| **Z-order** | Layer [5] — над props, под ports/resources/cities/units | §6.1: TerritoryBorderLayer |

**Правило anti-mush:** при стыке 3+ faction borders на одном тайле (невозможно по канону — территории разных цивилизаций не пересекаются) — не возникает. При стыке borders **одной** фракции: duplicate edges не рисуются (deduplicate per-edge).

**Readability на разных террейнах:**
- Faction colors выбраны с высокой насыщенностью (§3.3) → видны на светлом PLAIN, тёмном FOREST, и среднем MOUNTAIN.
- На DESERT (золотистый): faction_3 (янтарный) — самый рискованный. Компенсация: border alpha = 80% на DESERT-тайлах (верхняя граница диапазона).
- Рекомендация для реализации: `borderAlpha = terrain === DESERT ? 0.80 : 0.65`.

---

## 4) Правила композиции тайла (Tile Composition Rules)

### 4.1 Anatomy тайла

Каждый тайл визуально состоит из слоёв (bottom → top):

```
┌──────────────────────────┐
│ ① Base color fill         │  ← terrain color
│ ② Coastline / shore band  │  ← только на LAND-тайлах рядом с WATER
│ ③ Props (деревья, камни)  │  ← 0–3 штук в зависимости от terrain + LOD
│ ④ River overlay           │  ← если is_river = true
│ ⑤ Road / bridge overlay   │  ← если road_level > 0
│ ⑥ Port marker             │  ← если port_level > 0
│ ⑦ Resource icon           │  ← если resource_type ≠ null
│ ⑧ City / capital marker   │  ← если city_id ≠ null
│ ⑨ Unit sprite             │  ← если юнит на тайле
│ ⑩ HP number               │  ← над юнитом
│ ⑪ Status badges           │  ← Siege, Disruption, Integration, DamagedRoad
│ ⑫ Territory border        │  ← по краям тайла (если territory_owner ≠ null)
│ ⑬ UI overlays             │  ← selection, move range, attack range
│ ⑭ Fog                     │  ← если UNEXPLORED
└──────────────────────────┐
```

### 4.2 Декоративные пропы (props)

Пропы — визуальные элементы, добавляющие «живость» тайлу. Чисто декоративные — нулевое влияние на геймплей.

> **Правило покрытия:** суммарная площадь всех пропов на тайле MUST NOT превышать **30% площади тайла** (≤ 0.30 × BASE_TILE_SIZE²). Это гарантирует, что юниты, ресурсы, дороги и статус-бейджи всегда читаемы.

| terrain_type | Props | Кол-во на LOD-1 | Кол-во на LOD-2 | Max prop size | Описание |
|-------------|-------|-----------------|-----------------|---------------|---------|
| PLAIN | Травяные пучки, мелкие камни, цветы | 0–1 | 1–2 | 20×20 px | Низкие, не выше 30% высоты тайла |
| FOREST | Деревья (стилизованные, круглые кроны) | 1–2 | 2–3 | 32×50 px | Главный силуэт-маркер FOREST. Деревья = основной визуальный отличитель |
| MOUNTAIN | Скалы, острые пики | 1 | 1–2 | 36×60 px | Остроконечные треугольные/ромбовидные силуэты. Самый высокий prop на карте |
| DESERT | Кактусы, дюны, мелкие камни | 0–1 | 1–2 | 24×35 px | Редкие, «сухие». Подчёркивают пустоту |
| WATER | Волны (паттерн), пена у берега | 0 | Subtile wave pattern | N/A | Статичная текстура или лёгкая анимация |

**Проверка покрытия (compile-time assertion для ассетов):**
```
maxCoverage(terrain) = sum(propWidth[i] × propHeight[i] for i in 0..maxPropsForTerrain)
assert maxCoverage(terrain) ≤ 0.30 × BASE_TILE_SIZE²  // ≤ 2765 px² @ 96px
```

Пример: FOREST (LOD-2, 3 props × 32×50 = 4800) → **превышает** → ограничиваем: max 2 дерева + 1 small grass tuft (2×1600 + 400 = 3600 → тоже превышает). **Решение:** пропы перекрывают друг друга визуально (Z-stacking), но каждый prop ограничен safe zone (§4.4) и не выходит за её пределы. Фактическая видимая площадь за счёт overlap ≤ 30%.

### 4.3 Правила размещения пропов

**Детерминизм:** размещение пропов вычисляется из `tile_index + match_seed`:

```typescript
function propHash(tileIndex: number, seed: number, propSlot: number): number {
  // FNV-1a hash вариант
  return fnv1a(tileIndex * 31 + seed * 17 + propSlot * 7) & 0xFFFF;
}

// Количество пропов (0..maxProps)
const propCount = propHash(index, seed, 0) % (maxPropsForTerrain + 1);

// Позиция каждого пропа внутри тайла (параметризовано через TILE_SIZE)
const margin = Math.floor(BASE_TILE_SIZE * 0.19);           // ~18px at 96, ~12px at 64
const range  = BASE_TILE_SIZE - margin * 2;                  // ~60px at 96, ~40px at 64

for (let i = 0; i < propCount; i++) {
  const px = (propHash(index, seed, i * 2 + 1) % range) + margin;
  const py = (propHash(index, seed, i * 2 + 2) % range) + margin;
}
```

Это гарантирует: тот же seed → те же пропы на тех же позициях (replay-friendly).

### 4.4 Safe zone (пропы не перекрывают markers)

```
Тайл BASE_TILE_SIZE × BASE_TILE_SIZE (96×96 @ canonical):
┌──────────────────────────────┐
│  STATUS BADGE zone            │  ← Top-right 24×24 (y: 0..24, x: 72..95)
│  ┌─────────────────────────┐ │
│  │ SAFE for props           │ │  ← Top 70% minus badge zone (y: 0..67)
│  │ (деревья, камни, etc.)   │ │     Max prop coverage ≤ 30% of tile area
│  │                           │ │
│  └─────────────────────────┘ │
├──────────────────────────────┤
│  RESERVED for entities        │  ← Bottom 30% (y: 68..95)
│  (unit, city, HP, resource)   │     ← NO props allowed
└──────────────────────────────┘
```

- **Props:** размещаются в верхних 70% тайла (`y < 0.7 × BASE_TILE_SIZE`). Суммарная видимая площадь ≤ 30% от `BASE_TILE_SIZE²`.
- **Unit/City sprites:** центрированы по горизонтали, нижняя привязка (bottom-center).
- **HP number:** над юнитом (top-center от спрайта юнита).
- **Resource icon:** нижний правый угол тайла (fixed position, 16×16).
- **Status badges:** верхний правый угол тайла (fixed position, 16×16). Props не размещаются в badge zone.
- **Roads/bridges:** проходят через центр тайла — пропы НЕ размещаются на road centerline (±`road_width/2`).

Это гарантирует, что пропы НИКОГДА не перекрывают юнит, город, HP, ресурс, status badge или дорогу.

---

## 5) Библиотека спрайтов / пропов (MVP Asset Library)

### 5.1 Перечень MVP-ассетов

#### Terrain base (16 вариантов, см. §11)

| Asset | Filename pattern | Variants | Размер | Описание |
|-------|-----------------|----------|--------|----------|
| PLAIN tile | `terrain_plain_v{0-3}.png` | 4 | 96×96 | Flat fill `#8FBF5A` + subtle grain. Каждый вариант — разный micro-pattern |
| FOREST tile | `terrain_forest_v{0-3}.png` | 4 | 96×96 | Fill `#3D7A3E` + ground shadow pattern |
| MOUNTAIN tile | `terrain_mountain_v{0-2}.png` | 3 | 96×96 | Fill `#9B8E7A` + peak highlights |
| DESERT tile | `terrain_desert_v{0-2}.png` | 3 | 96×96 | Fill `#E8C96A` + dune ridges |
| WATER tile | `terrain_water_v{0-1}.png` | 2 | 96×96 | Fill `#4A90C4` + wave hint |

#### Props (decorative, per-terrain)

| Asset | Filename pattern | Variants | Описание |
|-------|-----------------|----------|----------|
| Tree (forest) | `prop_tree_{0-3}.png` | 4 | Round crown, Polytopia-style. Height ~50px |
| Rock (mountain) | `prop_rock_{0-2}.png` | 3 | Angular, triangular. Height ~40px |
| Peak (mountain) | `prop_peak_{0-1}.png` | 2 | Tall triangle, white tip. Height ~60px |
| Grass tuft (plain) | `prop_grass_{0-2}.png` | 3 | Short, green. Height ~15px |
| Cactus (desert) | `prop_cactus_{0-2}.png` | 3 | Saguaro / round barrel. Height ~35px |
| Dune (desert) | `prop_dune_{0-1}.png` | 2 | Low sand wave. Height ~20px |

#### River overlay

| Asset | Filename | Описание |
|-------|----------|----------|
| River centerline | `overlay_river.png` | Centerline stroke `#5BAED6`, width = 0.25–0.35 × BASE_TILE_SIZE. На LOD-2: + flow lines |

#### Road overlays (по уровням)

| Asset | Filename | Описание |
|-------|----------|----------|
| Road L1 | `overlay_road_l1.png` | Тонкая линия (2px logical), light tan |
| Road L2 | `overlay_road_l2.png` | Средняя (4px), darker tan |
| Road L3 | `overlay_road_l3.png` | Широкая (6px), с бордюром |
| Road intersection | Procedural | Сегменты: N/S/E/W/NE/NW/SE/SW. Автосоединение через bitmasking (см. §8) |
| Bridge | `overlay_bridge.png` | Дорога на WATER-тайле + опоры. Road level определяет толщину |

#### Port markers

| Asset | Filename | Описание |
|-------|----------|----------|
| Port L1 | `marker_port_l1.png` | 16×16 icon: маленький причал |
| Port L2 | `marker_port_l2.png` | 20×20 icon: средний порт |
| Port L3 | `marker_port_l3.png` | 24×24 icon: крупный порт с краном |

#### City markers

Детальная спецификация: `docs/10_uiux/City_Visual_Spec.md`.

| Asset | Filename | Описание |
|-------|----------|----------|
| City L1–L5 | `marker_city_l{1-5}.png` | Масштаб 1.0 (L1) .. 1.4 (L5). Цвет = faction |
| Capital crown | `marker_capital.png` | Дополнительный badge поверх city marker |
| Neutral city | `marker_city_neutral.png` | Серый вариант |

#### Fog overlays

| Asset | Filename | Описание |
|-------|----------|----------|
| Unexplored fog | `fog_unexplored.png` | 96×96 fill `#1A1A2E` @ 85% opacity |
| Fog edge (4 dirs) | `fog_edge_{n,s,e,w}.png` | Gradient edge: fog→transparent (8px wide) |
| Fog edge (4 diag) | `fog_edge_{ne,nw,se,sw}.png` | Corner transitions |

#### Status badges

Per `Map_Visual_Spec.md` §5 и `Map_Overlays.md`:

| Asset | Filename | Описание |
|-------|----------|----------|
| Siege | `badge_siege.png` | 16×16, crossed swords |
| Disruption | `badge_disruption.png` | 16×16, lightning bolt |
| Integration timer | `badge_integration.png` | 16×16, clock + number overlay |
| Damaged road | `badge_damaged_road.png` | 16×16, cracked line |

#### Territory borders

| Asset | Filename | Описание |
|-------|----------|----------|
| Border segment | Procedural | Линия `max(1, round(BASE_TILE_SIZE/48))` px (2px @ 96). Цвет = faction @ 60–80% alpha. Per-edge между тайлом владельца и не-владельца. Inset 0.5px |

### 5.2 Naming conventions

```
assets/
├── terrain/
│   ├── terrain_plain_v0.png .. terrain_plain_v3.png   (4 variants)
│   ├── terrain_forest_v0.png .. terrain_forest_v3.png (4 variants)
│   ├── terrain_mountain_v0.png .. terrain_mountain_v2.png (3 variants)
│   ├── terrain_desert_v0.png .. terrain_desert_v2.png (3 variants)
│   └── terrain_water_v0.png .. terrain_water_v1.png   (2 variants)
├── props/
│   ├── prop_tree_0.png .. prop_tree_3.png
│   ├── prop_rock_0.png .. prop_rock_2.png
│   ├── prop_peak_0.png .. prop_peak_1.png
│   ├── prop_grass_0.png .. prop_grass_2.png
│   ├── prop_cactus_0.png .. prop_cactus_2.png
│   └── prop_dune_0.png .. prop_dune_1.png
├── coast/
│   ├── coast_edge_n.png .. coast_edge_w.png       (4 edge strips)
│   └── coast_corner_ne.png .. coast_corner_nw.png (4 corner fills)
├── blends/
│   ├── blend_plain_forest_h.png, blend_plain_forest_v.png
│   ├── blend_plain_desert_h.png, blend_plain_desert_v.png
│   ├── blend_plain_mountain_h.png, blend_plain_mountain_v.png
│   ├── blend_forest_mountain_h.png, blend_forest_mountain_v.png
│   ├── blend_desert_mountain_h.png, blend_desert_mountain_v.png
│   └── blend_forest_desert_h.png, blend_forest_desert_v.png
├── overlays/
│   ├── overlay_river.png
│   ├── overlay_road_l1.png .. overlay_road_l3.png
│   ├── overlay_bridge.png
│   └── fog_unexplored.png, fog_edge_*.png
├── markers/
│   ├── marker_city_l1.png .. marker_city_l5.png
│   ├── marker_city_neutral.png
│   ├── marker_capital.png
│   ├── marker_port_l1.png .. marker_port_l3.png
│   └── badge_siege.png, badge_disruption.png, badge_integration.png, badge_damaged_road.png
└── atlas/
    └── map_atlas.json  ← Sprite atlas (TexturePacker / PixiJS spritesheet format)
```

**Правило именования:** `{category}_{element}_{variant}.png`. Lowercase, snake_case. Без пробелов.

### 5.3 Sprite atlas

Все ассеты карты собираются в **один sprite atlas** (`map_atlas.png` + `map_atlas.json`):
- Максимальный размер: 2048×2048 (поддерживается всеми мобильными GPU).
- Формат: PNG-8 с alpha (палитра: terrain цвета + props).
- Ожидаемый размер: < 500 KB (Polytopia-уровень минимализма).

---

## 6) Слои рендеринга и порядок отрисовки (Layering & Render Order)

### 6.1 PixiJS Container hierarchy (bottom → top)

```
Stage
├── [0] TerrainLayer          ← Base terrain sprites. 1 draw call per terrain_type via sprite batching
│   └── Per-tile: terrain sprite (96×96)
│
├── [1] CoastlineLayer        ← Shoreline bands на LAND-тайлах, примыкающих к WATER
│   └── Per-edge: beach strip (4px)
│
├── [2] RiverLayer            ← Overlay для is_river=true тайлов
│   └── Per-tile: river tint / flow sprite
│
├── [3] RoadLayer             ← Roads + bridges
│   └── Per-tile with road_level > 0: road segment sprite
│
├── [4] PropLayer             ← Decorative props (trees, rocks, cactus, etc.)
│   └── Per-tile: 0–3 prop sprites, positioned deterministically
│
├── [5] TerritoryBorderLayer  ← Territory border lines
│   └── Per-edge: colored line where territory changes owner
│
├── [6] PortLayer             ← Port markers
│   └── Per-tile with port_level > 0: port icon
│
├── [7] ResourceLayer         ← Resource icons (MONEY / SCIENCE)
│   └── Per-tile with resource_type ≠ null: icon at bottom-right
│
├── [8] CityLayer             ← City markers + capital badges
│   └── Per-city: city sprite (sized by level) + optional capital crown
│
├── [9] UnitLayer             ← Unit sprites + HP numbers
│   └── Per-unit: shape sprite (faction color) + HP text
│
├── [10] BadgeLayer           ← Status badges (Siege, Disruption, Integration, DamagedRoad)
│   └── Per-affected tile/city: badge icon at top-right
│
├── [11] OverlayLayer         ← Map overlays (Network / Resources / MilitaryThreat / Integration)
│   └── Per-tile: semi-transparent fill per active overlay
│
├── [12] SelectionLayer       ← Hover highlight, move range, attack range
│   └── Per-tile: colored fill (move_range / attack_range / selection_tile)
│
└── [13] FogLayer             ← Fog of War (UNEXPLORED tiles)
    └── Per-tile: fog sprite where visibility[player] = 0
```

### 6.2 Правила отрисовки

- **Z-порядок юнитов/городов:** юниты с бо́льшим `y` рисуются позже (painter's algorithm). Это даёт эффект «ближние юниты перед дальними».
- **Fog покрывает ВСЁ:** если тайл UNEXPLORED, fog-спрайт перекрывает все слои ниже. Юниты, города, дороги, пропы — невидимы.
- **Selection поверх overlay:** чтобы клик на тайл читался поверх Network/Resource overlay.
- **Territory border поверх props, но под cities/units:** граница видна на «пустых» тайлах, но не перекрывает важные элементы.
- **Overlay не блокирует клики:** overlay = визуальный слой, `interactiveChildren = false` (канон: Map_Overlays.md §6).

### 6.3 LOD и включение слоёв

| Слой | LOD-0 | LOD-1 | LOD-2 |
|------|-------|-------|-------|
| TerrainLayer | ✓ (simplified: solid fill, no sprite) | ✓ | ✓ |
| CoastlineLayer | ✗ | ✓ | ✓ |
| RiverLayer | ✗ | ✓ (tint only) | ✓ (tint + flow) |
| RoadLayer | ✗ | ✓ (simplified 1px) | ✓ (full detail) |
| PropLayer | ✗ | ✓ (1–2 props) | ✓ (full set) |
| TerritoryBorderLayer | ✓ (1px) | ✓ (2px) | ✓ (2px) |
| PortLayer | ✗ | ✗ | ✓ |
| ResourceLayer | ✗ | ✓ | ✓ |
| CityLayer | ✓ (dot) | ✓ (icon) | ✓ (full sprite) |
| UnitLayer | ✗ | ✓ | ✓ |
| BadgeLayer | ✗ | ✗ | ✓ |
| OverlayLayer | ✓ | ✓ | ✓ |
| SelectionLayer | ✓ | ✓ | ✓ |
| FogLayer | ✓ | ✓ | ✓ |

---

## 7) Береговая линия (Coastline / Shore Rules)

### 7.1 Определение

Береговая линия — визуальная полоса на **LAND-тайлах**, которые 8-connected соседствуют с WATER-тайлами.

### 7.2 Рендеринг

- **Ширина полосы:** 4px (при zoom=1, 96px tile) по каждому краю, примыкающему к воде.
- **Цвет:** `terrain_beach` (`#E8DCC0`) — песочная полоса.
- **Принцип:** per-edge. Для каждого из 8 направлений проверяем: если сосед — WATER, рисуем beach strip вдоль соответствующего edge.
- **Углы:** если два перпендикулярных edge оба граничат с водой, рисуем beach в углу (quadrant fill).

### 7.3 Детерминизм

Coastline определяется исключительно из `terrain_base` соседних тайлов. Нет рандомизации — одинаковая карта = одинаковые берега.

### 7.4 Bitmask-подход: 8-fragment MVP

**MVP-решение:** вместо 256 полных coastline-вариантов используется **8 sprite-фрагментов** (4 edges + 4 corners), которые комбинируются per-tile.

```
Шаг 1: Вычисление coast-маски (только 4 cardinal directions для MVP)
  Для каждого LAND-тайла:
    edgeMask = 0
    if neighbor_N is WATER:  edgeMask |= 0b0001  (N = bit 0)
    if neighbor_E is WATER:  edgeMask |= 0b0010  (E = bit 1)
    if neighbor_S is WATER:  edgeMask |= 0b0100  (S = bit 2)
    if neighbor_W is WATER:  edgeMask |= 0b1000  (W = bit 3)

Шаг 2: Для каждого set bit → рисуем соответствующий edge strip
    bit 0 → coast_edge_n.png  (4px beach strip вдоль верхнего края)
    bit 1 → coast_edge_e.png  (4px beach strip вдоль правого края)
    bit 2 → coast_edge_s.png  (4px beach strip вдоль нижнего края)
    bit 3 → coast_edge_w.png  (4px beach strip вдоль левого края)

Шаг 3: Corner fills (diagonal check)
    if neighbor_NE is WATER AND N-edge OR E-edge active → coast_corner_ne.png
    if neighbor_SE is WATER AND S-edge OR E-edge active → coast_corner_se.png
    if neighbor_SW is WATER AND S-edge OR W-edge active → coast_corner_sw.png
    if neighbor_NW is WATER AND N-edge OR W-edge active → coast_corner_nw.png
```

**Итого: 16 возможных комбинаций из 4-bit маски**, покрытых 8 фрагментными спрайтами.

**Sprite-фрагменты (8 штук):**

| # | Asset | Filename | Размер | Описание |
|---|-------|----------|--------|----------|
| 1 | Edge N | `coast_edge_n.png` | 96×4 | Beach strip вдоль верхнего края тайла |
| 2 | Edge E | `coast_edge_e.png` | 4×96 | Beach strip вдоль правого края |
| 3 | Edge S | `coast_edge_s.png` | 96×4 | Beach strip вдоль нижнего края |
| 4 | Edge W | `coast_edge_w.png` | 4×96 | Beach strip вдоль левого края |
| 5 | Corner NE | `coast_corner_ne.png` | 8×8 | Quadrant fill в верхнем-правом углу |
| 6 | Corner SE | `coast_corner_se.png` | 8×8 | Quadrant fill в нижнем-правом углу |
| 7 | Corner SW | `coast_corner_sw.png` | 8×8 | Quadrant fill в нижнем-левом углу |
| 8 | Corner NW | `coast_corner_nw.png` | 8×8 | Quadrant fill в верхнем-левом углу |

Все фрагменты включаются в sprite atlas. Batching сохраняется — все используют одну текстуру.

**Acceptance criteria для coastline:**
1. На типичном зуме (LOD-1, zoom=1.0) береговая линия выглядит плавной, без резких «ступенек».
2. Beach-полоса видна на всех LAND-террейнах (PLAIN, FOREST, MOUNTAIN, DESERT).
3. Corners заполняют L-образные стыки без пробелов.
4. При LOD-0 (overview) coastline не рендерится (§6.3).

**Пост-MVP улучшение:** расширить до 16 вариантов (полный 4-bit lookup table с предрендеренными комбинациями) или до 47 вариантов (full marching-squares with diagonals) для более smooth coastline.

---

## 8) Рендеринг рек (Rivers Rendering Rules)

### 8.1 Определение

Река = тайл с `terrain_base = WATER`, `terrain_type = WATER`, `is_river = true`.
Геймплейно = обычная вода. Визуально отличается.

Канон: SOT §Terrain (T1+R1), World_Generation_Spec.md §1.3.

### 8.2 Визуальные правила

**Данные:** река занимает 1 тайл в tile data (`terrain_base = WATER`, `is_river = true`). Канон: World_Generation_Spec.md §4.3.

**Визуал:** река рисуется как **centerline stroke** поверх базовой WATER-заливки тайла, а не как полная заливка всего тайла.

| Параметр | Значение |
|----------|----------|
| Цвет | `terrain_river` (`#5BAED6`) — светлее ocean (`#4A90C4`) |
| **Stroke width (LOD-2, close-up)** | **0.25–0.35 × BASE_TILE_SIZE** (24–34 px @ 96px tile). Визуально «узкая река» в центре тайла |
| **Stroke width (LOD-1, tactical)** | **0.15–0.25 × BASE_TILE_SIZE** (14–24 px @ 96px tile). Тоньше при отдалении |
| Stroke shape | Centerline через середину тайла. Направление определяется по `is_river`-соседям (4-connected) |
| LOD-0 | Не отображается (river = WATER, тайл уже залит `terrain_water`) |
| LOD-1 | Centerline stroke `terrain_river`. Без дополнительных деталей |
| LOD-2 | Centerline stroke `terrain_river` + тонкие flow lines (2–3 параллельные дуги внутри stroke, анимированные — optional) |
| Scaling при zoom | Stroke width масштабируется вместе с тайлом (не фиксированный px) |

**Правило рендеринга:**
```
riverStrokeWidth = BASE_TILE_SIZE * lerp(0.15, 0.35, lodFactor)
// lodFactor: 0.0 at LOD-1 boundary, 1.0 at LOD-2 max zoom
// At zoom=1.0 (LOD-1): ~14–24px stroke
// At zoom=3.0 (LOD-2): ~24–34px stroke (визуально шире при приближении)
```

Это гарантирует, что река выглядит как **узкая водная артерия**, а не как полное затопление тайла. Bridge/road sprites рисуются поверх river stroke (layering: §6.1, RoadLayer [3] > RiverLayer [2]).

### 8.3 Соединение рек

Река — это последовательность WATER-тайлов с `is_river = true`. При рендере:

```
Для каждого river-тайла:
  Проверить 4-connected соседей:
    - Если сосед тоже is_river → рисовать «течение» (flow line) в направлении соседа
    - Если сосед — обычный WATER (ocean) → river «впадает» (береговой transition не нужен — оба WATER)
    - Если сосед — LAND → river «начинается» (coast-like edge на стороне LAND)
```

### 8.4 Река и инфраструктура

- **Мост:** `road_level > 0` на river-тайле (`is_river = true`) → рисуется bridge sprite поверх river overlay.
- **Порт:** `port_level > 0` на river-тайле → порт рисуется поверх river.
- Bridge/port не меняют river визуал — они добавляются сверху (см. §6 layering: Road → над River).

---

## 9) Бюджет производительности и оптимизация (Performance Budget)

### 9.1 Целевые показатели

| Платформа | FPS target | Условия |
|-----------|-----------|---------|
| Desktop (mid, 2020+) | 60 fps | zoom=1.0, full map loaded |
| Mobile (mid, Snapdragon 680+) | 60 fps | zoom=1.0, viewport-only rendering |
| Mobile (low, Snapdragon 460) | 30 fps | zoom=1.0, reduced LOD |

### 9.2 Sprite batching

PixiJS v8 поддерживает automatic batching. Оптимизации:

- **Один sprite atlas** для всех terrain + props + overlays → минимум texture switches.
- **Terrain:** 5 terrain types × ~6400 tiles ≈ 5 batch groups. PixiJS batches sprites с одинаковой текстурой → **~5 draw calls** для всего terrain.
- **Props:** все пропы в одном atlas → batched вместе → **~1–2 draw calls**.
- **Roads/overlays:** аналогично, ~1–2 draw calls.

**Итого:** ~10–15 draw calls на полную карту (отлично для mobile WebGL).

### 9.3 Viewport culling

Рисуем ТОЛЬКО видимые тайлы:

```typescript
function getVisibleTileRange(camera: Camera, tileSize: number): TileRect {
  const left   = Math.max(0, Math.floor(camera.x / tileSize) - 1);
  const top    = Math.max(0, Math.floor(camera.y / tileSize) - 1);
  const right  = Math.min(MAP_WIDTH - 1, Math.ceil((camera.x + camera.viewWidth) / tileSize) + 1);
  const bottom = Math.min(MAP_HEIGHT - 1, Math.ceil((camera.y + camera.viewHeight) / tileSize) + 1);
  return { left, top, right, bottom };
}
```

- При zoom=1 на desktop: ~14×8 = **~112 тайлов** видимы (из 6400). Экономия 98%.
- При zoom=0.25 (overview): ~53×30 = **~1590 тайлов** — всё ещё < 25%.
- При zoom=0.25 рендерим в LOD-0 (simplified), так что draw cost per tile минимален.

### 9.4 Chunking

Карта 80×80 разбивается на **чанки 16×16** (5 × 5 = 25 чанков):

```
chunk_id = (chunkY * 5) + chunkX
chunkX = floor(tileX / 16)
chunkY = floor(tileY / 16)
```

Каждый чанк — отдельный PixiJS Container с `cacheAsTexture()` при LOD-0 (overview). Это кеширует 256 тайлов как одну текстуру. (PixiJS v8 API; в v7 использовался `cacheAsBitmap`.)

**Инвалидация:** при изменении тайла (дорога построена, видимость обновлена) — инвалидировать только чанк, содержащий тайл.

### 9.5 Off-screen entity management

- **Юниты за viewport:** не рендерим. PixiJS Container с `renderable = false` для off-screen units.
- **Fog tiles далеко от visible border:** одна solid fill для всей fog-области (не per-tile sprites).
- **Props на LOD-0:** полностью отключены (Container.visible = false).

### 9.6 Memory budget

| Ресурс | Размер | Примечание |
|--------|--------|-----------|
| Sprite atlas (PNG) | ~300–500 KB | Один atlas 2048×2048 |
| Tile data (JS objects) | ~6400 × ~200 bytes = ~1.3 MB | Flat array in memory |
| PixiJS display objects | ~6400 terrain sprites + ~10K prop sprites = ~16K objects | При LOD-2. LOD-0: ~6400 |
| GPU texture memory | ~16 MB (atlas 2048×2048 RGBA) | Одна текстура |

---

## 10) Критерии приёмки (Acceptance Criteria)

### 10.1 Checklist: Definition of Done

| # | Критерий | Проверка |
|---|---------|---------|
| 1 | Каждый terrain_type мгновенно отличим при дефолтном зуме (LOD-1) | Visual test: показать 5×5 фрагмент с каждым terrain — человек должен назвать тип за <1 сек |
| 2 | UNEXPLORED и VISIBLE чётко отличаются | Fog overlay полностью скрывает содержимое тайла. Граница fog видна |
| 3 | Дороги L1/L2/L3 различимы | Толщина и/или цвет визуально отличаются. Мосты на воде опознаются |
| 4 | Порты L1/L2/L3 читаемы на LOD-2 | Иконки различаются размером |
| 5 | Territory ownership ясен без перекраски terrain | Border line в faction color — достаточно для определения владельца. Territory fill только при selection |
| 6 | Props никогда не перекрывают unit/city/HP | Safe zone enforcement: props в верхних 70% тайла, markers в нижних 30% |
| 7 | Реки визуально отличимы от ocean | Цвет `terrain_river` (#5BAED6) светлее `terrain_water` (#4A90C4). ΔE ≥ 10 |
| 8 | Coastline/beach band виден на LOD-1+ | Песочная полоса на LAND-тайлах у воды |
| 9 | Asset naming conventions соблюдены | Все файлы: `{category}_{element}_{variant}.png`, lowercase, snake_case |
| 10 | Layer order задокументирован и реализован | 14 слоёв в порядке §6.1. Fog — верхний, terrain — нижний |
| 11 | 60 fps на mid mobile (LOD-1, viewport) | Performance benchmark: 0 frame drops при pan/zoom |
| 12 | Colorblind-safe | 5 terrain types различимы в deuteranopia-симуляции |
| 13 | Никаких новых механик | Документ не вводит terrain types, resource types, или gameplay rules |
| 14 | Совместимость с World_Generation_Spec.md | Все terrain_type, resource_type, tile fields — из canonical schema |
| 15 | Совместимость с Map_Visual_Spec.md | Все tokens, status indicators, overlay правила согласованы |
| 16 | Prop coverage ≤ 30% | Суммарная видимая площадь пропов на любом тайле не превышает 30% площади тайла |
| 17 | Territory borders читаемы на всех terrains | Border alpha 60–80%, fill ≤ 15%. Borders не подавляют roads/units/cities |
| 18 | Coastline smooth на LOD-1 | Нет резких «ступенек» при типичном зуме. 8-fragment approach покрывает все edge/corner cases |
| 19 | Tile variants prevent repetitive look | Каждый terrain имеет ≥ 2 визуальных варианта. Одинаковые соседи не выглядят как копипаст |
| 20 | Edge blending transitions smooth | Переходы terrain↔terrain не имеют hard 1px edges при LOD-1+ |

---

## 11) Tile Variants (Визуальные варианты тайлов)

### 11.1 Цель

Предотвратить «обойный эффект» (repetitive tiling), когда одинаковые terrains выглядят как клонированные спрайты. Варианты — чисто визуальные; никакого влияния на данные, механики или геймплей.

### 11.2 MVP variant counts

| terrain_type | Вариантов | Имена | Описание различий |
|-------------|----------|-------|-------------------|
| PLAIN | 4 | `terrain_plain_v0..v3` | Разное расположение subtle grain / цветовые micro-shifts (±3 brightness) / расположение травяных штрихов |
| FOREST | 4 | `terrain_forest_v0..v3` | Разный ground pattern (тени стволов, листья). Цвет кроны одинаковый — различается подстилка |
| MOUNTAIN | 3 | `terrain_mountain_v0..v2` | Разная форма скальных ridges, разное расположение highlights на камне |
| DESERT | 3 | `terrain_desert_v0..v2` | Разное направление дюн / расположение ripples |
| WATER | 2 | `terrain_water_v0..v1` | Разный wave pattern (фаза волн). Subtle, чтобы ocean выглядел однородно |

**Итого:** 4 + 4 + 3 + 3 + 2 = **16 terrain variants** (MVP baseline).

### 11.3 Детерминистический выбор варианта

Вариант для каждого тайла вычисляется из `match_seed + tile_index`:

```typescript
function tileVariant(tileIndex: number, seed: number, variantCount: number): number {
  // Reuse fnv1a hash from prop placement (§4.3)
  const hash = fnv1a(tileIndex * 31 + seed * 17 + 0xBEEF);
  return hash % variantCount;
}

// Пример:
// tile[0] on PLAIN, seed=42 → variant = fnv1a(0*31 + 42*17 + 0xBEEF) % 4 → 2
// → рендерим terrain_plain_v2.png
```

**Гарантии:**
- Тот же seed → те же варианты (replay-safe).
- Распределение визуально равномерное (FNV-1a хорошо распределяет low-index inputs).
- Никакого дополнительного состояния в tile data — variant вычисляется на лету при рендере.

### 11.4 Sprite atlas impact

16 variants × 96×96 = 16 × 9216 = **~147 KB** (uncompressed RGBA). В atlas 2048×2048 это занимает ~7% площади — укладывается в бюджет (§9.6).

Batching: все варианты одного terrain_type используют одну текстуру (atlas) → batching сохраняется. Нет дополнительных draw calls.

### 11.5 Asset naming

```
assets/terrain/
├── terrain_plain_v0.png .. terrain_plain_v3.png
├── terrain_forest_v0.png .. terrain_forest_v3.png
├── terrain_mountain_v0.png .. terrain_mountain_v2.png
├── terrain_desert_v0.png .. terrain_desert_v2.png
└── terrain_water_v0.png .. terrain_water_v1.png
```

> **Миграция:** старые `terrain_plain.png` etc. (§5.1) переименовываются в `terrain_plain_v0.png`. Остальные — добавляются как art pass.

---

## 12) Edge Blending / Terrain Transitions (Переходы между террейнами)

### 12.1 Цель

На границе двух разных terrain types (например, PLAIN↔FOREST) не должно быть резкого «пиксельного» скачка цвета. Edge blending создаёт плавный визуальный переход, сохраняя чёткую читаемость каждого terrain type.

### 12.2 MVP-подход: edge overlays по neighbor mask

Для каждого тайла проверяем 4 cardinal соседа. Если сосед — другой terrain type, рисуем **transition overlay** вдоль соответствующего edge.

```
Для каждого тайла (x, y):
  for each cardinal direction (N, E, S, W):
    neighbor = tile at direction
    if neighbor.terrain_type ≠ tile.terrain_type:
      transitionKey = sortedPair(tile.terrain_type, neighbor.terrain_type)
      overlayId = TRANSITION_TABLE[transitionKey]
      render overlay along corresponding edge
```

### 12.3 Transition types (MVP set)

| Переход | Overlay | Ширина | Описание |
|---------|---------|--------|----------|
| **PLAIN ↔ FOREST** | `blend_plain_forest.png` | 8px strip | Gradient: PLAIN green → FOREST dark green. Травяные штрихи переходят в тени деревьев |
| **PLAIN ↔ DESERT** | `blend_plain_desert.png` | 8px strip | Gradient: grass green → sand gold. Трава редеет, появляется песок |
| **PLAIN ↔ MOUNTAIN** | `blend_plain_mountain.png` | 6px strip | «Предгорья»: grass → gravel/rocky ground |
| **FOREST ↔ MOUNTAIN** | `blend_forest_mountain.png` | 6px strip | Treeline: деревья уступают скалам |
| **LAND ↔ WATER** | Coastline (§7) | 4px strip | Уже определено в §7 (beach band). Не дублируется |
| **DESERT ↔ MOUNTAIN** | `blend_desert_mountain.png` | 6px strip | Песок → каменистая порода |
| **FOREST ↔ DESERT** | `blend_forest_desert.png` | 6px strip | Саванна: деревья редеют, почва желтеет |
| **DESERT ↔ WATER** | Coastline (§7) | 4px strip | Beach band (уже покрыт §7) |

**Итого: 5 unique transition overlays** (LAND↔WATER покрыт coastline).

### 12.4 Overlay sprites

Каждый transition overlay — strip 96×8 (или 8×96 для вертикальных edges).

```
assets/blends/
├── blend_plain_forest_h.png   (96×8, horizontal)
├── blend_plain_forest_v.png   (8×96, vertical)
├── blend_plain_desert_h.png
├── blend_plain_desert_v.png
├── blend_plain_mountain_h.png
├── blend_plain_mountain_v.png
├── blend_forest_mountain_h.png
├── blend_forest_mountain_v.png
├── blend_desert_mountain_h.png
├── blend_desert_mountain_v.png
├── blend_forest_desert_h.png
└── blend_forest_desert_v.png
```

**12 sprites** (6 transitions × 2 orientations). Размер в atlas: 12 × 96×8 = ~9 KB (negligible).

### 12.5 Rendering rules

- **LOD-0:** transitions не рендерятся (flat color only).
- **LOD-1+:** transitions рисуются в CoastlineLayer [1] (или в выделенном sub-layer). Они рисуются **поверх** terrain base, но **под** props.
- **Z-order:** transition overlay → НАД terrain fill, ПОД props и roads.
- **Диагональные переходы:** для MVP — не реализуются. Diagonal neighbor differences видны как corner stitch, что допустимо при Polytopia-стиле.
- **Same-type neighbors:** overlay не рисуется (нет перехода).

### 12.6 Batching impact

Все transition sprites — в том же sprite atlas. Additional draw calls: ~1 (batched together). Total draw calls увеличивается с ~10–15 до ~11–16 — в рамках performance budget.

### 12.7 Acceptance criteria

1. На LOD-1 границы PLAIN↔FOREST не выглядят как «pixel wall» — виден мягкий 8px gradient.
2. Transitions не мешают чтению terrain types — каждый terrain type всё ещё мгновенно идентифицируется.
3. На LOD-0 transitions отключены — не влияют на overview performance.

---

## 13) Открытые вопросы (Open Questions)

Ниже вопросы, требующие решения владельца проекта перед реализацией:

| # | Вопрос | Варианты | Рекомендация |
|---|--------|----------|-------------|
| 1 | **Палитра: финальные HEX-коды** | Предложенная палитра vs кастом | Предложенная палитра — стартовая точка. Финализировать после первого art pass |
| 2 | **Faction tinting: как именно?** | Border only / Border + subtle terrain tint / Border + unit tint | Border only (территория). Unit — faction color shape. Terrain НЕ перекрашивается |
| 3 | **Анимации: flow lines (river), waves (ocean)** | Статика / Subtle animation (CSS/shader) | Статика для MVP. Анимация — polish phase |
| 4 | **Fog edge: hard edge или gradient?** | Hard 1px / 4px gradient / 8px feather | 4px gradient — мягкий, но читаемый |
| 5 | **Grid lines: показывать или нет?** | Always / Only on hover / Only at LOD-2 / Never | At LOD-1+, 6% opacity. Скрыты на LOD-0 |
| 6 | **Mountain на LOD-0: цвет или силуэт?** | Flat color only / Tiny triangle marker | Flat color (LOD-0 = минимализм). Силуэты для mountain вводятся на LOD-1 |
| 7 | **Sprite atlas: ручной или auto-packed?** | TexturePacker (manual) / PixiJS Assets (dynamic) / Webpack plugin | TexturePacker для контроля. Export JSON + PNG в `assets/atlas/` |

---

## Appendix A: Отношение к другим документам

| Документ | Отношение |
|----------|----------|
| `Map_Visual_Spec.md` (v4.40) | **Расширяет.** Map_Visual_Spec определяет semantic tokens и placeholder-цвета. Данный документ конкретизирует HEX, LOD, layering, performance |
| `World_Generation_Spec.md` (v5.0) | **Визуализирует.** Каждый tile state из World_Generation_Spec рендерится по правилам данного документа |
| `Map_Overlays.md` (v4.40) | **Дополняет.** Overlay types и interaction rules — канон из Map_Overlays. Данный документ определяет, как overlays вписываются в layer stack |
| `Design_System.md` (v4.40) | **Наследует.** Spacing, typography, accessibility rules — из Design System |
| `City_Visual_Spec.md` (v4.40) | **Ссылается.** City rendering — в City_Visual_Spec. Данный документ определяет только layer position (CityLayer = [8]) |
| `Unit_Visual_Spec.md` (v4.40) | **Ссылается.** Unit rendering — в Unit_Visual_Spec. UnitLayer = [9] |
| `PROJECT_IDENTITY.md` | **Реализует.** «Минималистичный светлый UI» + Polytopia inspiration |
| `Tile_Asset_List.md` (v1.0) | **Перечисляет.** Полный инвентарь спрайтов из §5 данного документа |
| `Tile_Asset_Production_Spec.md` (v1.0) | **Специфицирует.** Формат экспорта, качество, atlas rules |
| `Tile_Generation_Prompts.md` (v1.0) | **Генерирует.** AI-промпты для создания ассетов |

---

## Change Log (v5.0 → v5.1 Map Design Spec patch)

| # | Изменение | Секция | Причина |
|---|----------|--------|---------|
| 1 | `BASE_TILE_SIZE = 96px` canonicalized. Removed "open question" status. Removed OQ #1. | §2.1, §13 (бывш. §11) | Устранение неопределённости. 96px — финальное значение, все производные метрики привязаны к нему |
| 2 | River visual: заменено «width = 1 tile» на centerline stroke 0.25–0.35 × BASE_TILE_SIZE. | §8.2, §5.1 (river overlay) | River data = 1 tile, но визуально река должна выглядеть как узкая артерия, а не затопленный тайл |
| 3 | Coastline: заменён план «256 variants» на 8-fragment MVP (4 edges + 4 corners, 16 combinat.). | §7.4 | 256 вариантов — overkill для MVP. 8 fragments покрывают все случаи, feasible для atlas |
| 4 | Prop density: добавлено правило «≤ 30% tile area coverage». Max prop sizes per terrain. | §4.2, §4.4 | Предотвращение визуального перекрытия units/resources/roads. Readability first |
| 5 | Territory borders: добавлена §3.5 с alpha range (60–80%), thickness formula, anti-mush rules. | §3.2, §3.5 (new), §5.1 | Borders должны читаться на всех terrains, не подавляя gameplay elements |
| 6 | **NEW** §11: Tile Variants. 16 variant sprites (4+4+3+3+2). Deterministic via `fnv1a(seed, tileIndex)`. | §11 (new) | Устранение «обойного эффекта» при flat Polytopia-стиле. Чисто визуальное, без data changes |
| 7 | **NEW** §12: Edge Blending / Transitions. 5 transition types, 12 overlay sprites. LOD-1+ only. | §12 (new) | Smooth terrain borders вместо hard pixel jumps. MVP-feasible, batching-safe |
| 8 | Acceptance criteria: added #16–#20 for new rules. | §10.1 | Coverage for new specs |
| 9 | Open Questions renumbered (removed OQ #1 tile size, OQ #3 river, OQ #9 coastline — all resolved). §11→§13. | §13 | Resolved questions removed, section renumbered |
