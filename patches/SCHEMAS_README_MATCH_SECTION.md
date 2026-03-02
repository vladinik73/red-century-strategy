## match.schema.json (v4.12)

Canonical State Container для состояния партии (полный game state) + `events[]` как replay-log.

Ключевые решения:
- Карта: `tiles_flat` длиной 6400, индекс `i = y*80 + x`
- Отдельные массивы `cities[]` и `units[]`
- Дипломатия: список отношений `relations[]` (state/timers)
- Победа: отдельный раздел `victory`
- Только живые юниты (история — в `events[]`)
