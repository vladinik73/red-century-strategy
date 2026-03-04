# City Visual Spec (v4.40)

Канон: `docs/02_cities/City_Levels.md`, `docs/10_uiux/City_UI.md`, `schemas/city.schema.json`.

---

## 1) Level progression (L1–L5)

- **Визуал размера:** уровень города влияет на размер иконки/маркера на карте.
- L1: минимальный; L5: максимальный.
- Placeholder: масштаб 1.0 (L1) … 1.4 (L5) или иконки разного размера.

---

## 2) Capital marker

- `is_capital = true` → отличительный маркер (корона, звезда, или больший контур).
- Столица всегда узнаваема на карте.

---

## 3) Defense level

- `defense_level` 0–2: визуальный cue (щит, стены) рядом с городом или в панели.
- На карте: опционально маленькая иконка щита при defense_level > 0.

---

## 4) Port marker

- Если в территории города есть тайл с `port_level > 0` → иконка порта на городе или на соответствующем тайле.
- См. `docs/10_uiux/Map_Visual_Spec.md` для портов на тайлах.

---

## 5) Integration ring / progress

- `integration_turns_left > 0` → кольцо или прогресс-бар вокруг города.
- Отображение: «3/4» или заполнение по ходам.
- После интеграции: кольцо скрыто.

---

## 6) Siege / Disruption badges

- **Siege** (`sieged = true`): иконка осады на клетке города.
- **Disruption** (`disruption_turns_left > 0`): иконка сбоя.
- Оба могут отображаться одновременно.

---

## 7) Neutral style

- `owner_player_id = null` → нейтральный город.
- Визуал: серый/нейтральный цвет, без faction tint.
- Отличие от городов игрока и врагов.
