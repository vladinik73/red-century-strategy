# Cursor command — Tile pipeline scaffolding + checks

Ты работаешь в репозитории Red Age. Задача: подготовить production-пайплайн для ассетов карты
(terrain/props/fog/overlays/coast/blends/markers) **без генерации самих изображений**.

Сделай:

1) Директории:
- `assets/tiles/`
- `assets/atlas/`
- `tools/art/tileset_pipeline/inbox/{terrain,props,fog,overlays,coast,blends,markers}/`
- `tools/art/tileset_pipeline/scripts/`

2) Скрипт `tools/art/tileset_pipeline/scripts/prepare_tiles.py`:
- вход: папка с PNG
- выход: папка `assets/tiles/`
- приводит PNG к 96×96 RGBA (crop по непрозрачному bbox с padding, затем resize)
- сохраняет прозрачность
- опционально (флаг): palette snap к canonical hex из `Tile_Style_Bible` (по ближайшему цвету)
- пишет лог (processed/skipped)

3) Скрипт `tools/art/tileset_pipeline/scripts/check_tileset.py`:
- проверяет наличие всех файлов из `docs/03_map/Tile_Asset_List.md` в `assets/tiles/`
- проверяет размер 96×96 и наличие alpha
- выводит FAIL список отсутствующих/неверных файлов

4) Root `package.json` scripts:
- `tiles:prepare`
- `tiles:check`

5) Создай шаблон `docs/00_meta/QA_TILESET_v1.md` (15 пунктов из `Tile_Asset_Production_Spec.md`).

6) Обнови `docs/00_meta/CHANGELOG.md` (новая запись: tileset pipeline scaffolding).

7) Self-check: `pnpm -r typecheck`, `pnpm -r test`, `pnpm -r build` — PASS.

Важно:
- Не менять схемы/механику.
- Если `rg` нет, используй `grep`.
