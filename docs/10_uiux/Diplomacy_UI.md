# Diplomacy UI (v4.40)

Канон: `docs/08_diplomacy/Diplomacy_and_Alliances.md`, `docs/01_overview/Action_Catalog.md`, `schemas/match.schema.json` (match.diplomacy.relations[]).

**Identity:** все payload используют `player_id` (string). `civ_id` не используется.

---

## 1) Entry point

- **Кнопка/вкладка «Дипломатия»** в HUD или нижней панели (см. canonical layout в `Main_Game_Screen.md`).
- Открывает панель «Дипломатия» (модал или боковая панель).

---

## 2) List view

- Список всех других цивилизаций (из `match.turn.turn_order_player_ids` или `match.players`, исключая текущего игрока).
- Для каждой цивилизации:
  - Название (faction_id / display name)
  - **Текущее состояние:** NEUTRAL | WAR | ALLIANCE
  - **Таймеры:**
    - `min_alliance_turns_left` — ходов до возможности разрыва союза (0 = можно разорвать)
    - `cooldown_turns_left` — ходов cooldown после разрыва (0 = можно снова предложить союз)
- Скрытая цивилизация: показывать только после появления (HIDDEN_CIV_SPAWN).

---

## 3) Actions per state

| State   | Доступные действия (кнопки) | Условия |
|---------|----------------------------|---------|
| NEUTRAL | Declare War                | Всегда (если не элиминирована) |
| NEUTRAL | Form Alliance              | Союзов < 2, cooldown_turns_left == 0 |
| WAR     | Make Peace                 | Всегда (механика не требует cooldown для мира) |
| ALLIANCE| Break Alliance             | min_alliance_turns_left == 0 |

---

## 4) Confirmation dialogs (player-initiated)

Все действия игрока требуют **явного подтверждения** перед эмиссией события.

### 4.1 Declare War

- **Кнопка:** «Объявить войну»
- **Confirm dialog:**
  - Заголовок: «Объявить войну [CivName]?»
  - Текст: «Отношения перейдут в состояние войны. Союзники могут вступить в конфликт.»
  - Кнопки: **Confirm** | **Cancel**
- **При Confirm:** emit `DECLARE_WAR` payload `{ from_player_id, to_player_id }` (from = текущий игрок, to = выбранная цивилизация).

### 4.2 Make Peace

- **Кнопка:** «Заключить мир»
- **Confirm dialog:**
  - Заголовок: «Заключить мир с [CivName]?»
  - Текст: «Отношения перейдут в нейтральное состояние.»
  - Кнопки: **Confirm** | **Cancel**
- **При Confirm:** emit `MAKE_PEACE` payload `{ from_player_id, to_player_id }`.

### 4.3 Form Alliance

- **Кнопка:** «Предложить союз»
- **Confirm dialog:**
  - Заголовок: «Предложить союз [CivName]?»
  - Текст: «Союз нельзя разорвать 6 ходов. Максимум 2 союза.»
  - Кнопки: **Confirm** | **Cancel**
- **При Confirm:** emit `FORM_ALLIANCE` payload `{ from_player_id, to_player_id }`.
- *Примечание:* механика MVP — предложение принимается сразу (AI auto-accept). В будущем — Incoming Proposal для AI.

### 4.4 Break Alliance

- **Кнопка:** «Разорвать союз»
- **Confirm dialog:**
  - Заголовок: «Разорвать союз с [CivName]?»
  - Текст: «Cooldown 3 хода до нового предложения союза.»
  - Кнопки: **Confirm** | **Cancel**
- **При Confirm:** emit `BREAK_ALLIANCE` payload `{ from_player_id, to_player_id }`.

---

## 5) Incoming Proposal dialog (AI-initiated)

Когда **ИИ** инициирует действие, требующее согласия игрока:

- **Триггер:** AI решает Form Alliance / Make Peace / Break Alliance с игроком.
- **Диалог:** «Входящее предложение»
  - Заголовок: «[CivName] предлагает [союз / мир / разорвать союз]»
  - Краткое описание последствий
  - Кнопки: **Accept** | **Reject** | **Decide later** (опционально)

### 5.1 Accept

- Emit соответствующий event (FORM_ALLIANCE / MAKE_PEACE / BREAK_ALLIANCE) с `from_player_id` = AI, `to_player_id` = player.

### 5.2 Reject

- Не эмитить событие. AI пропускает это действие в текущем ходу.

### 5.3 Decide later (опционально)

- Предложение помещается в **proposal queue** (см. §10).
- Показывается снова при открытии панели Дипломатия или как reminder.

### 5.4 Timeout

- Если игрок не ответил до конца своего хода: считать **Reject** (не эмитить).
- Proposal queue: неотвеченные предложения истекают через 1 полный цикл ходов (см. §10).

### 5.5 Расположение

- Модал поверх карты, центр экрана. Блокирует взаимодействие с картой до ответа.

---

## 6) UI Action → Event mapping

| UI Action        | Event Type    | Payload fields                          |
|------------------|---------------|-----------------------------------------|
| Confirm Declare War | DECLARE_WAR | from_player_id, to_player_id             |
| Confirm Make Peace | MAKE_PEACE | from_player_id, to_player_id             |
| Confirm Form Alliance | FORM_ALLIANCE | from_player_id, to_player_id         |
| Confirm Break Alliance | BREAK_ALLIANCE | from_player_id, to_player_id       |
| Accept Incoming (Alliance/Peace/Break) | FORM_ALLIANCE / MAKE_PEACE / BREAK_ALLIANCE | from_player_id (AI), to_player_id (player) |

---

## 7) Error states

| Состояние | Поведение UI |
|-----------|--------------|
| Not your turn | Панель закрыта или все кнопки disabled; tooltip «Дождитесь своего хода» |
| Insufficient conditions | Кнопка disabled; tooltip причина (например «Союзов уже 2», «Cooldown 3 хода») |
| Cooldown | Form Alliance disabled; показать `cooldown_turns_left` |
| min_alliance_turns_left > 0 | Break Alliance disabled; показать оставшиеся ходы |
| Target eliminated | Скрыть цивилизацию из списка |

---

## 8) Toast / Notification hooks

- После успешного действия: toast «Война объявлена [CivName]» / «Мир заключён с [CivName]» / «Союз с [CivName]» / «Союз с [CivName] разорван».
- См. `docs/10_uiux/Notification_System.md`.

---

## 9) War via Cyber

- Кибератака на нейтральную цивилизацию = авто DECLARE_WAR (система). Confirm не требуется (действие уже совершено при применении Cyber Disrupt).
- Toast: «Кибератака на нейтральную цивилизацию — война объявлена автоматически».

---

## 10) Proposal queue (v4.41)

**Спецификация для UI/engine.** Поле `match.diplomacy.proposals[]` — опционально в схеме; при реализации хранить очередь ожидающих ответа предложений.

### 10.1 Rules

- **Max pending:** 3 предложения в очереди на игрока (to_player_id).
- **Timeout:** 1 полный цикл ходов (все цивилизации сделали ход). Неотвеченное предложение → auto-decline (не эмитить).
- **Unanswered = Reject:** по истечении таймаута предложение удаляется из очереди, событие не эмитируется.

### 10.2 Proposal object (spec)

```json
{
  "proposal_id": "string",
  "from_player_id": "string",
  "to_player_id": "string",
  "type": "peace" | "alliance",
  "created_turn": "integer"
}
```

- `type`: `peace` (MAKE_PEACE) или `alliance` (FORM_ALLIANCE). Break Alliance не ставится в очередь — actor подтверждает сразу.
- `created_turn`: `match.turn.turn_index` на момент создания.

### 10.3 UI flow

- При «Decide later»: добавить в `proposals[]`, снять блокировку хода AI.
- При открытии панели Дипломатия: показать pending proposals для текущего игрока.
- При истечении таймаута: удалить из очереди, toast «Предложение [CivName] истекло» (опционально).
