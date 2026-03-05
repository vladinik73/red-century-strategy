# Tile AI Pipeline (v1.0)

Цель: быстро получить **первый полный tileset** (≈ 80–90 PNG) в стиле Polytopia-inspired, строго по нашим каноничным документам:
- `docs/03_map/Tile_Style_Bible.md` (стиль + палитра)
- `docs/03_map/Map_Design_Spec.md` (рендер-пайплайн и слои)
- `docs/03_map/Tile_Asset_List.md` (полный инвентарь ассетов)
- `docs/03_map/Tile_Asset_Production_Spec.md` (экспорт/QA)
- `docs/03_map/Tile_Generation_Prompts.md` (базовые промпты)

## Роли (кто делает что)

**Claude (арт-директор/спекарь)**
- генерирует/уточняет промпты под каждую категорию ассетов (terrain, props, fog, coast, blends, overlays)
- проверяет консистентность с `Tile_Style_Bible` и `Map_Design_Spec` (палитра, размеры, ограничения по prop coverage)

**ChatGPT или Gemini (генератор картинок)**
- генерирует изображения по промптам (квадрат, без текста/логотипов)
- делает 3–6 вариантов на каждый ассет (variants v0..vN)

**Cursor (производство/пайплайн)**
- нормализация: 96×96, RGBA, transparent background, выравнивание по safe zones
- палитра: приближение к canonical hex (без «грязи»)
- сборка атласа (TexturePacker / аналог) + проверка веса/батчинга
- QA-отчёт (coverage/контраст/читабельность)

## Output (что должно получиться)

1) Дерево файлов (каноничные имена — как в `Map_Design_Spec`):
- `assets/tiles/terrain_*.png` (варианты v0..)
- `assets/tiles/prop_*.png`
- `assets/tiles/coast_*.png`
- `assets/tiles/blend_*.png`
- `assets/tiles/overlay_*.png` (roads/river/bridge)
- `assets/tiles/marker_*.png` (city/port)
- `assets/tiles/fog_*.png`

2) Атлас:
- `assets/atlas/map_atlas.png`
- `assets/atlas/map_atlas.json`
- Budget: цель **< 500KB** (MVP), 2048×2048 (при необходимости 2 атласа по категориям)

3) QA-отчёт:
- `docs/00_meta/QA_TILESET_v1.md`

## Порядок работ (MVP)

### Phase A — Terrain bases (P0)
- PLAIN v0..v3 (4)
- FOREST v0..v3 (4)
- MOUNTAIN v0..v2 (3)
- DESERT v0..v2 (3)
- WATER v0..v1 (2)

### Phase B — Fog (P0)
- fog_fill (1)
- fog_edge_n/e/s/w (4)
- fog_corner_ne/nw/se/sw (4)

### Phase C — Roads / Rivers / Coast MVP (P1)
- road_l1/l2/l3 + bridge (4)
- river (1)
- coast fragments (8)

### Phase D — Props (P1)
- 0–3 props per tile, **coverage ≤ 30%**, соблюдать safe zones

### Phase E — Blends + Markers (P2)
- edge blends (12)
- ports (3)
- city markers (7)
- status badges (4)

## Контроль качества (коротко)

Правила из `Tile_Asset_Production_Spec.md`:
- 96×96 (или 192×192 @2x), RGBA, прозрачный фон
- читаемость на zoom 0.25–3.0
- никаких новых «типов террейна»
- без текста/водяных знаков/перспективы/фотореализма
- variants отличаются микродеталями, а не формой/силуэтом

## Интеграция в рендер

`@redage/web` берёт:
- `tile.terrain_type` → `terrain_{type}_v{n}.png`
- `variant` = детерминированно от `(tileIndex, match_seed, layerId)` через FNV-1a
- overlays (coast/blend/river/road) → отдельные слои (как в `Map_Design_Spec`)

## Done criteria (MVP)
- P0: terrain + fog готовы → карта уже «красивая» и читаемая
- P1: дороги/реки/берег + базовые props → «живая» карта
- P2: blends/markers/badges → полное соответствие Map_Design_Spec
