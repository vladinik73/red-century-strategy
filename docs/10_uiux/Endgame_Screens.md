# Endgame Screens (v4.40)

Канон: `docs/01_overview/MVP_Player_Journey.md`, `docs/08_diplomacy/Victory_Rules.md`, `docs/11_replays/Replays_and_Observer.md`.

---

## 1) Victory screen

### 1.1 Content

- **Заголовок:** «Победа!» / «Victory!»
- **Тип победы:** Military | Economic | Tech | Alliance
- **Краткая сводка:** CityPower, ход, ключевые статы (опционально)
- **Кнопки:**
  - **Rematch** — новая игра (тот же seed или новый)
  - **Exit** — возврат на Home

### 1.2 State

- `match.victory.per_player[].won = true` для победителя.
- `match.victory.per_player[].victory_type` (если хранится) или из последнего VICTORY_COMPLETE event.

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
