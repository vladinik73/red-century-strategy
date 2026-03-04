# Main Game Screen (MVP) — UI/UX Canon (v4.18)

**v4.40:** Canonical layout для MVP. UI pack: Diplomacy_UI, Tech_Tree_UI, Production_UI, Map_Visual_Spec, Notification_System и др.

Этот документ фиксирует минималистичный MVP-UI для основного экрана матча (web-first).

## 1) Layout

### 1.1 Верхний HUD (фиксированный)
Содержит ключевые показатели текущей цивилизации и матча:

- Money
- Science
- AP (Action Points)
- Stability
- Turn / Round (номер хода, и активная цивилизация)
- Индикатор «Your Turn» (текст)
- Кнопка **End Turn** (доступна всегда)

Примечания:
- End Turn можно нажать **в любой момент**, даже если AP > 0.
- При AP = 0 игрок всё равно может осматривать карту (pan/zoom), выделять юниты/города и читать панели.

### 1.2 Правая контекстная панель (фиксированная)
Одна панель для **юнита** или **города** (по выбору игрока кликом на карте):
- если выбран юнит → отображаются параметры/действия юнита
- если выбран город → отображаются параметры/действия города

## 2) Selecting & Highlighting

### 2.1 Активный юнит
При выборе юнита:
- клетка, на которой стоит юнит, подсвечивается (selection highlight)
- правая панель показывает карточку юнита и доступные действия

Складывания подсветок от нескольких юнитов нет: выбран только один объект.

### 2.2 HP
HP отображается **числом над юнитом** (без HP-bar).
- если HP ≤ 30% от max HP — число выделяется красным (канон из PROJECT_IDENTITY)

## 3) Movement & Attacks (MVP)

### 3.1 Movement preview
При выборе юнита подсвечиваются **только клетки перемещения** (move tiles).

### 3.2 Attacks
Отдельной «attack grid» нет.
Атака выполняется кликом по вражескому юниту/городу, если цель в радиусе атаки и разрешена правилами.

## 4) Status indicators (MVP)

Статусы отображаются **в двух местах** (C):
- иконки на тайле/объекте на карте
- дублирование в правой панели с описанием и таймером

Обязательные статусы MVP:
- Siege (город под осадой)
- Disruption (кибер-сбой)
- Integration (таймер интеграции города)
- DamagedRoad (повреждённая дорога)

## 5) Victory timers (MVP)

Индикаторы победных таймеров (Military / Economic / Tech / Alliance) показываются **в HUD** (B):
- компактная иконка + значение (например, «Eco: 3/5»)
- подробности — по hover/tooltip или в правой панели (опционально)

Момент обновления таймеров — конец хода цивилизации (см. Turn Pipeline).

## 6) Map navigation

- Миникарты нет (MVP).
- Навигация: pan + zoom.

## 7) Event feed

Постоянного «лога событий» нет.
Используются только краткие всплывающие уведомления (toast):
- «City captured»
- «Disruption applied»
- «Tech level reached»
- «Victory timer started / progressed»

## 8) References

- Turn order / screens: `docs/01_overview/MVP_Player_Journey.md`
- Turn phases: `docs/01_overview/Turn_Pipeline.md`
- City Level Up choice: `docs/10_uiux/City_UI.md`
- Core UX invariants: `docs/00_meta/PROJECT_IDENTITY.md`
