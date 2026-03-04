# Endgame Screens (v4.40)

**v4.41:** Victory type clarification — derived value, not stored in schema.

Канон: `docs/01_overview/MVP_Player_Journey.md`, `docs/08_diplomacy/Victory_Rules.md`, `docs/11_replays/Replays_and_Observer.md`.

---

## 1) Victory screen

### 1.1 Content

- **Заголовок:** «Победа!» / «Victory!»
- **Тип победы:** MILITARY | ECONOMIC | TECHNOLOGICAL | ALLIANCE (см. §1.2)
- **Краткая сводка:** CityPower, ход, ключевые статы (опционально)
- **Кнопки:**
  - **Rematch** — новая игра (тот же seed или новый)
  - **Exit** — возврат на Home

### 1.2 Victory type (derived value)

`victory_type` **не хранится** в `match.victory.per_player`. Вычисляется из событий победы.

**Источник:** последний `VICTORY_COMPLETE` event (payload: `victory_type`, `player_id`). Схема event использует `MILITARY` | `ECONOMIC` | `TECH`; для отображения: `TECH` → `TECHNOLOGICAL`.

**Допустимые значения (display):**

| Значение | Описание |
|----------|----------|
| MILITARY | Военная победа (≥60% городов) |
| ECONOMIC | Экономическая победа (≥75% CityPower, 5 ходов) |
| TECHNOLOGICAL | Технологическая победа (Science L5, 10 ходов) |
| ALLIANCE | Победа альянса (лидер альянса — победитель) |

При победе альянса: `victory_type = ALLIANCE`; базовое условие (Military/Economic/Tech) — для логики, не для отображения типа.

**State:** `match.victory.per_player[].won = true` для победителя.

---

## 2) Defeat screen

### 2.1 Content

- **Заголовок:** «Поражение» / «Defeat»
- **Причина:** элиминация (0 городов) или победа противника (Alliance leader = AI)
- **Кнопки:**
  - **Spectate** — переключиться на наблюдение за другой цивилизацией (если поддерживается `Replays_and_Observer.md`)
  - **Takeover** — взять управление другой цивилизацией (PvE, нерейтингово) — если поддерживается
  - **Rematch**
  - **Exit**

### 2.2 Placeholder

- Если Spectate/Takeover не в MVP: показать только Rematch и Exit.
- Текст: «Вы можете посмотреть партию или начать заново» (если функционал добавлен позже).
