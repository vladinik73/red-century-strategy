# Tech Tree UI (v4.40)

Канон: `docs/05_tech/Tech_Tree.md`, `docs/05_tech/Tech_Progression.md`, `docs/01_overview/Action_Catalog.md`.

---

## 1) Layout

- **3 ветки × 5 уровней:** Military, Economic, Science.
- Варианты отображения:
  - **Вариант A:** Вертикальные колонки (ветка = колонка, уровни 1–5 сверху вниз).
  - **Вариант B:** Горизонтальные ряды (уровень = ряд, ветки слева направо).
- Каждая технология — **карточка** (tech card).

---

## 2) Tech card contents

| Поле | Описание |
|------|----------|
| Name | Название технологии (из Tech_Tree) |
| Level | 1–5 |
| Branch | MILITARY | ECONOMIC | SCIENCE |
| Status | locked | available | unlocked |
| Cost | BaseCost(level) = 10 × level² (Science) |
| Effects preview | Краткое описание эффекта (1–2 строки) |

### 2.1 Status rules

- **locked:** prerequisite не выполнена (предыдущий уровень ветки не изучен) ИЛИ недостаточно Science.
- **available:** prerequisite выполнен, Science >= cost, игрок может нажать «Изучить».
- **unlocked:** технология уже в `players[].tech_unlocked`.

---

## 3) Research / Unlock interaction

- Игрок **явно** выбирает технологию и нажимает «Изучить» (Unlock).
- **Проверки перед unlock:**
  - Предыдущий уровень ветки изучен (L2 требует L1, и т.д.).
  - `player.science >= BaseCost(level)`.
  - Технология ещё не изучена.
- **При нажатии «Изучить»:**
  - Confirm dialog (опционально для L1–L2; рекомендуется для L3+ из-за стоимости): «Изучить [Name] за [Cost] науки?»
  - При Confirm: списать Science, emit `TECH_UNLOCK` payload `{ branch, level }`.
- **Feedback:** toast «Технология [Name] изучена»; обновить карточку на unlocked.

---

## 4) Current progress display

- В HUD или в панели Tech: **Science** (текущий баланс).
- На карточке доступной технологии: «Стоимость: [Cost]» и индикатор «Достаточно» / «Не хватает X».

---

## 5) Tooltip for effects

- Hover на карточку: tooltip с полным описанием эффекта из `docs/05_tech/Tech_Tree.md`.
- Примеры: «Unlock Heavy Infantry», «+1 damage vs cities», «+10% Science», «Tech Victory timer 10 turns».

---

## 6) Victory timer tie-in

- Если изучена Science L5 (Tech Breakthrough): в HUD показывается **Tech Victory timer** (из `match.victory.per_player[].tech_victory_turns_left`).
- В панели Tech: на карточке Science L5 отображать «Таймер победы: X/10» если активен.

---

## 7) Event emission

| UI Action | Event Type | Payload |
|-----------|------------|---------|
| Confirm Unlock | TECH_UNLOCK | { branch: "MILITARY"|"ECONOMIC"|"SCIENCE", level: 1..5 } |

---

## 8) Error handling

| Ошибка | Поведение |
|--------|-----------|
| Недостаточно Science | Кнопка «Изучить» disabled; tooltip «Нужно ещё X науки» |
| Prerequisite не выполнен | Карточка locked; tooltip «Изучите предыдущий уровень» |
| Уже изучена | Карточка unlocked; кнопка скрыта |
| Не свой ход | Панель read-only или закрыта |
