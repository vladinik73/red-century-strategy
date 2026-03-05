# Claude command — Prompt Pack v1.0 (tile assets)

Ты — арт-директор проекта Red Age. Подготовь PROMPT PACK (v1.0) для генерации ассетов карты
в стиле Polytopia-inspired, строго по канону.

Каноничные документы:
- docs/03_map/Tile_Style_Bible.md
- docs/03_map/Map_Design_Spec.md
- docs/03_map/Tile_Asset_List.md
- docs/03_map/Tile_Asset_Production_Spec.md
- docs/03_map/Tile_Generation_Prompts.md

Сделай:

1) Создай файл `docs/03_map/Tile_Prompt_Pack_v1.md`:
- Global style prefix (короткий)
- Negative prompt (короткий)
- Prompts по категориям и **по именам файлов** из `Tile_Asset_List.md`:
  terrain (16), fog (9), overlays (5), coast (8), blends (12),
  markers (ports 3, cities 7), props (17)
- Правила вариативности v0..vN (микродетали, без потери читаемости)
- Workflow (10 шагов) и Quality quick-check

2) Добавь ссылки на `Tile_Prompt_Pack_v1.md`:
- в `Tile_Style_Bible.md` (Related Documents)
- в `Map_Design_Spec.md` (Appendix/Related docs)
- обнови `docs/00_meta/CHANGELOG.md`

В конце дай отчёт: какие 3–5 принципов заложены в промпты для terrain, fog, coast/blends, overlays, props/markers.
