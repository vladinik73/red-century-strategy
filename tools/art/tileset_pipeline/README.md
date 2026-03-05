# Tileset production pipeline (v1.0)

Назначение: привести AI-генерации к каноничному формату ассетов (96×96 PNG RGBA),
собрать атлас и выдать QA отчёт.

## Inputs
Сырые генерации (PNG) кладём в:
- `tools/art/tileset_pipeline/inbox/terrain/`
- `tools/art/tileset_pipeline/inbox/props/`
- `tools/art/tileset_pipeline/inbox/fog/`
- `tools/art/tileset_pipeline/inbox/overlays/`
- `tools/art/tileset_pipeline/inbox/coast/`
- `tools/art/tileset_pipeline/inbox/blends/`
- `tools/art/tileset_pipeline/inbox/markers/`

## Outputs
- Нормализованные ассеты: `assets/tiles/`
- Атлас: `assets/atlas/map_atlas.(png|json)`
- QA отчёт: `docs/00_meta/QA_TILESET_v1.md`

## Steps
1) Claude готовит/уточняет промпты под список из `Tile_Asset_List.md`.
2) ChatGPT/Gemini генерят картинки (по 3–6 вариантов на ассет).
3) Cursor прогоняет нормализацию (96×96, RGBA, alpha) и палитру.
4) Собираем атлас (TexturePacker/аналог).
5) Визуальная проверка в web-клиенте.

## Canon rules
См. `docs/03_map/Tile_Asset_Production_Spec.md` и `docs/03_map/Tile_Style_Bible.md`.
