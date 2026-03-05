# Map Generator Architecture (Option A — Runtime WorldGen in `createMatch()`)

**Project:** Red Age  
**Canonical decision:** **Option A** — карта генерируется **в рантайме** внутри `@redage/core` при создании матча (`createMatch()`), без хранения «картинок» и без внешнего генератора/экспортера на этапе MVP.

Документ фиксирует техническую архитектуру генерации мира (геометрия/тайлы/города/ресурсы), так чтобы:
- PvE Web работает сразу (1 игрок + AI), детерминированно по `match_seed`;
- позже легко добавить мультиплеер (сервер авторитетный, те же события/реплеи);
- тестовый режим «все боты, наблюдатель» воспроизводим;
- визуальная часть (тайлы/цвета/рендер) живёт отдельно и не влияет на детерминизм.

---

## 1) Канон и источники

Эта архитектура **не вводит новых механик** и опирается на существующие документы:

- `docs/03_map/World_Generation_Spec.md` — базовый pipeline генерации.
- `docs/03_map/World_Types_and_Terrain_Distribution_Spec.md` — типы миров, правила распределения террейна, retry/attemptSeed.
- `docs/03_map/Map_Design_Spec.md` — визуальные правила, слои, LOD, размер тайла (**BASE_TILE_SIZE = 96px**), атлас/производительность.
- `docs/03_map/Tile_Style_Bible.md` — художественные правила тайлов (Polytopia‑style).
- `docs/10_uiux/Map_Visual_Spec.md` — семантические токены и отображение (overlays/индикаторы).

---

## 2) Главный принцип: детерминизм «seed → state»

### 2.1 Match seed — единственный источник случайности
- Вход: `match_seed: number` (канон).
- Любая «случайность» в генерации карты должна происходить **только** через seeded RNG (например, `createSeededRng(match_seed)`).

### 2.2 `world_type` НЕ хранится в `MatchState`
**Канон:** `world_type` **не добавляем** в `match.schema.json`.  
Он **детерминированно выводится из `match_seed`** (или задаётся override‑параметром генерации, но override не записывается в state).

Причина: избегаем «разрастания схемы», сохраняя воспроизводимость (seed → тот же world_type).

---

## 3) Retry и `attemptSeed` (hard rule)

Генерация может повторяться (retry), если не выполнены инварианты «играбельности/справедливости».

**MAX_RETRIES = 5** (канон из world types spec).

Для каждой попытки вычисляем **attemptSeed**:

```
attemptSeed = Hash32(match_seed, world_type_id, attempt_index)
```

- `world_type_id` — 0..4 (BALANCED/CONTINENTAL/ARCHIPELAGO/PANGAEA/WILD).
- `attempt_index` — 0..MAX_RETRIES.
- `Hash32` — стабильная 32-bit функция (например, FNV‑1a over bytes).

Важное: retry **НЕ** делает `seed = seed + 1` и не использует «магические смещения» — только `Hash32(...)`. Это защищает детерминизм и воспроизводимость.

---

## 4) Место генерации в движке (Option A)

### 4.1 Где живёт код
- `packages/core/src/worldgen/*` — генерация карты (pure TS, без DOM/Node/fs).
- `packages/core/src/createMatch.ts` — создаёт `MatchState` и вызывает `generateWorld(...)`.

**Никаких зависимостей от Pixi/React.**  
Результат генерации — это **данные** (tiles/cities/resources/spawns), а не рендер.

### 4.2 Интерфейсы (предлагаемые)
```ts
export type WorldTypeId =
  | "BALANCED"
  | "CONTINENTAL"
  | "ARCHIPELAGO"
  | "PANGAEA"
  | "WILD";

export interface WorldGenOverrides {
  /** Optional. If set, forces a world type (still deterministic per attemptSeed). */
  worldType?: WorldTypeId;
}

export interface WorldGenResult {
  tiles_flat: MatchState["map"]["tiles_flat"]; // 6400
  cities: MatchState["cities"];
}

export interface GenerateWorldInput {
  match_seed: number;
  overrides?: WorldGenOverrides;
}

export function deriveWorldType(match_seed: number): WorldTypeId;

export function generateWorld(
  input: GenerateWorldInput
): { result: WorldGenResult; worldTypeUsed: WorldTypeId; attemptIndex: number };
```

> `worldTypeUsed` и `attemptIndex` можно логировать/показывать в dev UI, но **не сохраняем в MatchState**.

---

## 5) Pipeline (высокоуровневый)

Согласован с `World_Generation_Spec.md` и world types spec:

1. **Select world type**
   - `worldType = overrides.worldType ?? deriveWorldType(match_seed)`
2. **For attempt_index in 0..MAX_RETRIES**
   - `attemptSeed = Hash32(match_seed, worldTypeId, attempt_index)`
   - `rng = createSeededRng(attemptSeed)`
   - **Generate landmask** (noise + falloff) + floodfill/connectedness
   - **Assign terrain** (PLAIN/FOREST/MOUNTAIN/DESERT/WATER) по правилам типа мира
   - **Rivers** (как флаг/overlay, не новый terrain)
   - **Cities** (capitals + neutral), соблюдая дистанции/инварианты
   - **Resources** (MONEY/SCIENCE) по правилам плотности/справедливости
   - **Territories / visibility init** (если это часть init state)
   - **Validate invariants**
     - если PASS — вернуть результат
3. Если все попытки FAIL — вернуть последнюю попытку с флагом `softFail` (только для dev) **или** throw (policy решаем отдельно).

---

## 6) Инварианты: что валидируем на выходе

Ссылка: `World_Types_and_Terrain_Distribution_Spec.md` (раздел про playability/fairness).

Минимальный набор (в движке — как отдельная функция `validateWorld(result)`):

- Размер карты 80×80, `tiles_flat.length === 6400`
- Минимум суши / минимум пригодных тайлов под города
- Размещение столиц:
  - Chebyshev distance между столицами ≥ 10
  - В территории столицы есть ≥1 MONEY и ≥1 SCIENCE (если это канон)
- Нейтральные города 50–100 (или заданный диапазон)
- Связность (по правилам ARCHIPELAGO допускаются «bridgeable» варианты)
- Нет «невозможных» территорий (пустых, без тайлов и т.п.)

---

## 7) Визуальная часть: где заканчивается worldgen

WorldGen отдаёт **семантику** тайлов, не «картинку».

Рендер строится по:
- `Map_Design_Spec.md` (слои, LOD, BASE_TILE_SIZE=96px, batching/atlas)
- `Tile_Style_Bible.md` (цвета/силуэты/prop coverage ≤30%)
- `Map_Visual_Spec.md` (overlays: дороги/порты/границы/туман)

### 7.1 Разделение ответственности
- WorldGen **не** выбирает конкретный sprite‑variant (v0..vN) как «арт-решение».
- WorldGen может отдавать детерминированный `visual_variant_seed = Hash32(attemptSeed, tileIndex)`, а выбор спрайта — часть клиента/рендера.

---

## 8) Тестирование и наблюдательский режим

### 8.1 Unit tests (core)
- Детерминизм: одинаковый `match_seed` → одинаковый `hashState(createMatch(...))`
- Ретраи: попытки идут по `attemptSeed` и воспроизводимы.

### 8.2 Observer mode (все боты)
- `createMatch({ match_seed })` создаёт мир
- `@redage/ai` играет за всех игроков
- UI подписывается на state (Play/Pause/Speed/Step)

---

## 9) Под мультиплеер

- Сервер создаёт матч: `createMatch(seed)` → state
- Клиенты получают initial snapshot
- Дальше ходят через action→event (lockstep по event‑log)
- Реплеи воспроизводимы, т.к. карта воспроизводима по seed.

---

## 10) Acceptance criteria

Готово к реализации, если:
- Есть `deriveWorldType()` и `generateWorld()` с retry/attemptSeed
- Есть `validateWorld()` и тесты
- `createMatch()` возвращает валидный `MatchState` (Ajv validation PASS)
- При одинаковом seed state hash совпадает на разных машинах
