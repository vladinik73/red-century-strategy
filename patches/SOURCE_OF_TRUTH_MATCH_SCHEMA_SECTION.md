## Match State Schema (v4.12)
- Каноническая структура состояния партии описана в: `schemas/match.schema.json`.
- Формат: **Canonical State Container** + `events[]` как replay-log.
- Карта хранится как `tiles_flat` длиной `80×80 = 6400`, индекс: `i = y*80 + x`.
- Состояние хранит только **живые** юниты (история боёв — через `events[]`).

См. также:
- `schemas/tile.schema.json` (v4.10)
- `schemas/player.schema.json` (v4.11)
