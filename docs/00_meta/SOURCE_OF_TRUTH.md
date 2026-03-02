# Source of Truth (v4.25.1 — Event Taxonomy + Action Catalog)

Этот файл фиксирует ключевые «инварианты» — правила, которые считаются источником истины.
Если в других разделах возникают расхождения — править нужно **здесь**, а затем синхронизировать остальные разделы.

## Базовые инварианты
- PvE web-first, сессия 1–3 часа
- 7 цивилизаций + 1 скрытая (AI-only)
- Нет границ стран: есть только границы городов (территория города)
- Города предгенерируются: нельзя строить новые города
- Город = 1 клетка на карте
- Интеграция захваченного города: 4 хода
- Только интегрированные города дают: (а) бонусы, (б) участие в победе, (в) участие в магистрали
- Магистраль: учитывается только сеть, связанная со столицей (одна активная сеть)
- ОД тратятся на: производство юнитов, дороги, порты, активацию технологий (перемещение — бесплатно)
- Боёвка: 1 юнит на клетке, HP, мгновенное перемещение, атака кликом по врагу
- Серийный удар: продолжение атак только если цель погибла и атакующий занял её клетку; `SerialKillCap = 5`; `DamageMultiplierPerKill = 0.85`
- UI/UX: минимализм; подсветка только клеток хода; HP как цифра (красная при ≤30% max)

## Constants (v4.10)
- `MaxCivs = 10` (слоты видимости/наблюдения; включает скрытые/случайно появляющиеся цивилизации).

## Schemas (v4.10)
- Добавлен `schemas/tile.schema.json` как каноническая структура тайла (карта/ресурсы/дороги/порты/territory/visibility).

## Start Conditions (v4.11)
- Стартовые ресурсы игрока: Money=100, Science=0, Stability=70.
- Стартовая столица: City Level=1, интегрирована сразу, Defense Level=0 по умолчанию.
- Стартовый юнит: 1× Starter Scout (A2).
- Старт: видна территория стартовой столицы + видимость стартового юнита (см. Visibility v4.9).
- Канон: `docs/01_overview/Start_Conditions.md`.

## Schemas (v4.11)
- Добавлена схема состояния игрока: `schemas/player.schema.json` (Player State).

## Match State Schema (v4.12)
- Каноническая структура состояния партии описана в: `schemas/match.schema.json`.
- Формат: **Canonical State Container** + `events[]` как replay-log.
- Карта хранится как `tiles_flat` длиной `80×80 = 6400`, индекс: `i = y*80 + x`.
- Состояние хранит только **живые** юниты (история боёв — через `events[]`).

См. также:
- `schemas/tile.schema.json` (v4.10)
- `schemas/player.schema.json` (v4.11)

## Schemas — sync notes (v4.22)
- Match Unit per-turn action flag: `has_acted_this_turn: boolean` is canonical schema field.
  - It **replaces** legacy `has_moved` + `has_attacked`.
  - This matches gameplay canon: **1 action per unit per turn** (move/attack/heal/disband/etc).
- Player per-turn counter: `stability_boost_used_this_turn: boolean` (reset at start of civ turn).
- City territory: `territory_radius` is stored in match city object (1..5). Canon cap: `MaxTerritoryRadius = 5`.
- Tile ports: use `port_level: 0..3`. Do **not** keep a separate `has_port` boolean.
- Tile damaged road timer: `road_damaged_turns_left: 0..2`.

## Events (Replay Log) — Event Taxonomy (v4.25.1)

- `events[]` — discriminated union по `event_type` (oneOf с 26 вариантами).
- Обязательные поля (EventBase): `event_id`, `round_index`, `civ_turn_index`, `acting_civ_id`, `event_type`, `payload`.
- Опционально: `seq` (порядок внутри хода). `turn_index` — deprecated, использовать `civ_turn_index`.
- Payload строго типизирован для каждого event_type (additionalProperties: false).
- Канон: `schemas/match.schema.json`, `docs/01_overview/Action_Catalog.md`.
- Event types: MOVE, ATTACK, SERIAL_ATTACK, PRODUCE, BUILD_ROAD, UPGRADE_ROAD, BUILD_PORT, UPGRADE_PORT, UPGRADE_CITY, HEAL, DISBAND, CAPTURE_CITY, START_HARVEST, REPAIR_ROAD, BOOST_SCIENCE, BOOST_STABILITY, TECH_UNLOCK, DECLARE_WAR, MAKE_PEACE, FORM_ALLIANCE, BREAK_ALLIANCE, REBELLION, ELIMINATION, VICTORY_TRIGGER, VICTORY_COMPLETE, HIDDEN_CIV_SPAWN.

## Tech Tree Effects (v4.24)

Все 15 технологий имеют определённые эффекты. Канон: `docs/05_tech/Tech_Tree.md`.

Ключевые связи:
- Military L1: Unlock Heavy Infantry | L2: Mountain Access | L3: +1 damage vs cities | L4: Unlock Advanced Units + Hypersonic | L5: +1 global damage
- Economic L1: Unlock Roads | L2: Unlock Ports | L3: Road L2 | L4: +5% Money | L5: Road L3, Port L3
- Science L1: +1 Science/city | L2: +10% Science | L3: +20% Science | L4: +1 AP | L5: Tech Victory timer

Связи с формулами: `docs/04_economy/Money_Model.md` (Economic L4), `docs/04_economy/Action_Points.md` (Science L4), `docs/06_combat/Damage_and_Rules.md` (Military L3, L5).

## Elimination + Neutral Cities (v4.23)

- **Elimination:** цивилизация элиминирована при 0 городов; юниты удаляются; пропуск в turn order; victory пересчёт по активным цивилизациям.
- **Neutral cities:** garrison = 0; start: level=1, defense_level=0, territory_radius=1.
- **Rebellion → neutral:** defense_level сбрасывается в 0.

Канон:
- `docs/01_overview/Elimination_Rules.md`
- `docs/02_cities/City_Capture.md`
- `docs/03_map/Map_Generation.md`
- `docs/04_economy/Stability_and_Morale.md`

## Turn Pipeline

Канонический порядок фаз хода описан в:
- `docs/01_overview/Turn_Pipeline.md`

Инварианты:
- Таймеры (интеграция/сбой/повреждённые дороги) тикают **до** начисления дохода.
- Бунт проверяется **до** начисления дохода.
- Доход начисляется **до** расчёта ОД.
- Победа проверяется **в конце каждого хода** (не раунда).

## MVP Player Journey (v4.17)
- Цепочка экранов (MVP): Home → New Game Setup → Loading/Briefing → Main Game → Victory/Defeat.
- Continue: **автосейв в конце хода каждой цивилизации**, Continue загружает последний autosave.
- Turn order (канон): порядок фиксированный; **ИИ ходят первыми, игрок ходит последним**.
- AI difficulties (MVP): `Easy / Normal / Hard / God` (на MVP допускаются числовые модификаторы).
- Target match length: **60–90 ходов**.
- End Turn: ход игрока завершается **только кнопкой End Turn** (auto-end не используется).
- Канон: `docs/01_overview/MVP_Player_Journey.md`

## Main Game Screen (MVP UI/UX) (v4.18)
- Layout: верхний HUD + правая контекстная панель (юнит/город).
- Active unit: подсветка клетки + карточка в правой панели.
- HP: число над юнитом (без HP-bar); ≤30% — красным.
- Move: подсвечиваются только клетки перемещения.
- Attack: по клику на врага (без отдельной attack grid).
- Status indicators: иконки на карте + дублирование в правой панели (Siege/Disruption/Integration/DamagedRoad).
- Victory timers: показываются в HUD (компактно).
- Minimap: отсутствует в MVP; навигация pan+zoom.
- Event feed: только toast-уведомления, без постоянного лога.
- End Turn: кнопка доступна всегда; можно нажать в любой момент; при AP=0 игрок может осматривать карту.
- Канон: `docs/10_uiux/Main_Game_Screen.md`

## Territory (v4.13)
- У каждого города есть `TerritoryRadius`.
- `TerritoryRadius` начальный и минимальный = **1**.
- Расширение территории делается выбором при апгрейде города: `TerritoryRadius += 1`.
- Территория города = квадрат `(2R+1)×(2R+1)` вокруг тайла города (обрезается границами карты).
- Территории разных цивилизаций не пересекаются; одной цивилизации — объединяются.
- При захвате города территория города полностью переходит новому владельцу.
- Канон: `docs/03_map/Territory_Rules.md`.

## Visibility (v4.9 + v4.13)
- Модель видимости: **2-state** — `UNEXPLORED` / `VISIBLE` (fog-of-war отсутствует).
- `VISIBLE` — **перманентное раскрытие**: тайл остаётся видимым навсегда и не "закрывается" даже после ухода юнитов или разрыва альянса.
- У каждого юнита есть параметр `visibility`.
- Видимость обновляется **событийно**:
  - при появлении юнита (spawn)
  - после каждого перемещения юнита (move)
  - при захвате города (capture reveal)
- Город раскрывает карту на всю свою территорию (минимум радиус 1).
- При расширении территории новые тайлы становятся VISIBLE.
- Горы (S2):
  - юнит на горе: `visibility +1`
  - стоимость обзора: обычная клетка `cost=1`, гора `cost=2`
- Альянс делится видимостью полностью; раскрытие сохраняется навсегда.
- LOS/проверка "цель видима": означает, что тайл цели `VISIBLE` для атакующего (или союзника).
- Канон: `docs/03_map/Visibility.md`

## Победы (Phase 1)
- Проверка побед и инкремент победных таймеров выполняются **в конце каждого хода цивилизации** (End of Turn), а не в конце полного раунда. См.: `docs/01_overview/Turn_Pipeline.md`, `docs/08_diplomacy/Victory_Rules.md`
- Приоритет при одновременном выполнении: **Военная > Экономическая > Технологическая**
- **Военная победа (PvE)**: контроль ≥60% интегрированных городов
- **Экономическая победа**: `PlayerCityPower >= 75% GlobalCityPower` (только интегрированные города игрока; города союзников **не** учитываются); удержание 5 ходов; таймер сбрасывается при падении ниже порога
- **Технологическая победа**: изучение 5 уровня научной ветки → таймер 10 ходов; захват интегрированного города сбрасывает таймер
- **Победа альянса**: лидер альянса считается победителем; если лидер — ИИ, игрок проигрывает

## Города (Phase 1)
- Максимальный уровень города: 5
- Апгрейд уровня стоит деньги (не ОД)
- CityPower = сумма уровней интегрированных городов
- Лимит юнитов в городе = уровень города
- Авиация в городе = floor(уровень / 2)
- Лимит кораблей = уровень города (при наличии порта)

## Производство юнитов (Phase 2)
- Каждый интегрированный город может произвести не более 1 юнита за ход
- Мгновенное появление на клетке города (если свободна); очередь глубиной 1
- В неинтегрированном городе производство запрещено
- Подробности: `docs/07_units/Production_Rules.md`

## Экономика — деньги (Phase 2)
- MoneyPerTurn = floor((Σ CityBaseIncome + HarvestIncome) × NetworkMultiplier × AllianceMultiplier × StabilityMultiplier × CyberIncomeMultiplier)
- CityBaseIncome = city_level (только интегрированные города)
- HarvestIncome = Σ MoneyYield(tile) от денежных ресурсных клеток
- Ресурсная клетка: 2 ед./ход (запас 10), после исчерпания 1 ед./ход (бесконечно)
- Запуск добычи: 1 ОД (однократно), клетка на территории интегрированного города
- Подробности: `docs/04_economy/Money_Model.md`, `docs/04_economy/Resources.md`

## Money → Science Boost (v4.15)
- Действие в PHASE 3 (Action Phase): **Boost Science**
  - Стоит: **1 ОД**
  - Формула: `AddedScience = floor(MoneySpent × 0.5)`
  - Лимит за ход: `BoostScienceThisTurn ≤ floor(SciencePerTurn × 2)`
    (SciencePerTurn берётся из PHASE 1 текущего хода, до бустов)
  - Можно выполнять несколько раз за ход, пока не исчерпан лимит и есть деньги/ОД.

## Технологии (Phase 1)
- 3 ветки × 5 уровней = 15 технологий максимум
- BaseCost(level) = 10 × level²
- SciencePerTurn = 5 + CityBonus + TechBonus + NetworkContribution

## ОД — формула (Phase 2 + 2.1)
- OD = 5 + floor(Σ уровней интегрированных городов / 5) + floor(Количество технологий / 3) + StabilityModifier + NetworkModifier + AllianceModifier - OccupationPenalty - CyberPenalty
- Подробности: `docs/04_economy/Action_Points.md`

## Cyber Rules (v4.2)
- 1 активный «Сбой» на цивилизацию
- Применение «Сбоя» требует 1 ОД
- Эффект «Сбоя» (2 хода):
  - -20% доход поражённого города
  - -1 ОД глобально
- Дороги не уничтожаются: получают статус `DamagedRoad` на 2 хода
  - `DamagedRoad` не учитывается в `NetworkBonus` и не даёт бонус перемещения
  - авто-восстановление через 2 хода или восстановление владельцем за 1 ОД
- Подробности: `docs/07_units/Cyber_Effects.md`, `docs/07_units/Advanced_Units.md`, `docs/04_economy/Network.md`

## Serial Strike (v4.4 + v4.15)
- Серийный удар: цепочка возможна только если цель погибает и атакующий занимает её клетку.
- `SerialKillCap = 5` — максимум 5 убийств в одной цепочке за ход.
- `DamageMultiplierPerKill = 0.85` — после каждого убийства в цепочке урон следующей атаки умножается на 0.85 (-15%).

## Serial Strike vs City (v4.15)
- Если серийный юнит убивает последнего защитника города:
  - Игрок выбирает: **Capture Now** (цепочка заканчивается) или **Continue Chain** (захват откладывается).
  - Захват происходит в момент, когда цепочка завершилась и юнит остался на клетке города.

## Capture Infrastructure (v4.15)
- При захвате города:
  - Территория захваченного города переходит новому владельцу **сразу**.
  - Дороги/мосты/порты в территории захваченного города переходят новому владельцу.
  - `DamagedRoad` таймеры **сохраняются** (не сбрасываются).
  - До интеграции захваченный город **не даёт** Money/Science/NetworkBonus.

## Naval & Hypersonic Rules (v4.5)
- Наземные юниты ближнего боя не атакуют корабли.
- Наземные юниты дальнего боя (Range ≥ 2) могут атаковать корабли на прибрежных клетках (корабль примыкает к суше) при наличии видимости.
- Гиперзвук:
  - 1 запуск/ход/цивилизацию
  - требует видимости клетки цели
  - не может атаковать корабли
  - не может атаковать столицу цивилизации
  - игнорирует бонусы местности, но не игнорирует City Defense Level в городе

## Осада (Phase 2)
- Осада = вражеский юнит соседствует с городом
- Экономика: -30% к MoneyPerTurn и ScienceGain города
- Производство: стоимость юнита ×1.3 (ceil)
- Оборона: -1 к DefenseModifier города
- Подробности: `docs/06_combat/Siege_Effects.md`

## Стабильность и мораль (Phase 2 + 2.1)
- Диапазон: 0–100, старт: 70, авто-восстановление +1/ход
- Мораль привязана к стабильности (≥70 → мораль 100)
- Стабильность влияет на доход денег: MoneyMultiplier (80–100: +5%, 60–79: 0%, 40–59: -5%, 20–39: -10%, 0–19: -20%)
- Мораль влияет на урон: MoraleMultiplier — **множитель** (80–100: 1.10, 40–79: 1.00, 20–39: 0.90, 0–19: 0.80)
- Бунт при 0 стабильности: 10% шанс/ход, город → нейтральный
- Канон: `docs/04_economy/Stability_and_Morale.md`, `docs/06_combat/Damage_and_Rules.md`

## Stability Boost (v4.21)

- Действие цивилизации **Boost Stability**: в PHASE 3 можно потратить **1 ОД** и деньги:
  - `50 Money → +2 Stability`
  - `100 Money → +5 Stability`
- Ограничение: **1 раз за ход на цивилизацию** (`StabilityBoostUsedThisTurn`), сброс в PHASE 0.
- Требование: у цивилизации есть **хотя бы один интегрированный город**.
- `Stability` ограничивается диапазоном **0–100**.
- Канон: `docs/04_economy/Stability_and_Morale.md`, `docs/04_economy/Action_Points.md`, `docs/01_overview/Turn_Pipeline.md`.

## Дипломатия (Phase 2)
- Не более 2 союзов одновременно
- Союз нельзя разорвать раньше 6 ходов; cooldown после разрыва 3 хода
- Кибератака на нейтральную цивилизацию = автообъявление войны
- Подробности: `docs/08_diplomacy/Diplomacy_and_Alliances.md`

## South Asia Balance (v4.6)
- Массовый мобилизационный батальон: 7 HP / 2 Damage / 1 Range / 2 Move / 1 ОД
- Бонус +1 к лимиту юнитов в городе удалён.

## China Balance (v4.7)
- Нефритовый автономный страж: +1 стабильность за убийство **только** на своей территории или в интегрированном городе.
- Генерация карты: старт Китая не ближе 7 клеток к краю карты.

## Terrain (T1+R1)
- `terrain_type` (T1): PLAIN / FOREST / MOUNTAIN / DESERT / WATER.
- River (R1): `is_river = true` на `WATER` тайле; gameplay-отличий от воды нет.

## Infrastructure Costs (v4.14)
Канон: `docs/04_economy/Infrastructure_Costs.md`
- Road L1: `1 ОД + 25 денег` за тайл.
- Road upgrade (per level): `1 ОД + 25 денег` за тайл.
- Bridge (1 WATER тайл): ×2 от дороги → `2 ОД + 50 денег`.
- Port L1: `3 ОД + 200 денег` (фикс).
- Port upgrade per level: `2 ОД + 150 денег` (фикс).

## Unit Sight (v4.14)
- У каждого типа юнита есть параметр `Sight` (видимость).
- StarterScout (A2) Sight = 2.
Канон: таблицы юнитов в `docs/07_units/*`.

## Unit Actions (v4.20)

- **1 действие на юнит за ход цивилизации** (Move / Attack / Heal / Disband / Special).
- **Heal:** 1 ОД, +3 HP, не выше MaxHP, тратит действие юнита.
- **Disband:** тратит действие юнита, удаляет юнит, возвращает `floor(APCost × 0.5)` ОД в текущий пул.
- **Counter-attack:** существует **только в melee (Range=1)** и только если защитник выжил; для ranged (Range≥2) ответного удара нет.
- Канон: `docs/10_uiux/Unit_Actions.md`, `docs/06_combat/Damage_and_Rules.md`, `docs/01_overview/Turn_Pipeline.md`.

## Numeric P0 Constants (v4.19)

### Roads & Ports
- `MaxRoadLevel = 3` (L1..L3).
- Road movement bonus: `MoveBonus = RoadLevel` (+1/+2/+3), применяется **только если** юнит начинает перемещение на тайле с неповреждённой дорогой.
- `MaxPortLevel = 3` (L1..L3).
- Канон: `docs/04_economy/Network.md`, `docs/04_economy/Infrastructure_Costs.md`

### Movement Costs
- MoveCost по террейну: PLAIN=1, FOREST=2, MOUNTAIN=2, DESERT=1, WATER=1 (только морские юниты).
- Река = `WATER + is_river=true` (строка WATER).
- Канон: `docs/03_map/Map_Generation.md`

### Veterancy
- Tier-up при **3 убийствах за жизнь** → `MaxHP += 2` (один уровень ветеранства в MVP).
- Канон: `docs/06_combat/Veterancy_and_Serial.md`

## Territory — MaxTerritoryRadius (v4.16)

- `MaxTerritoryRadius = 5`
- Территория города расширяется только через награду апгрейда **Expand Territory (+1 TerritoryRadius)**.
- `TerritoryRadius` не может превышать `MaxTerritoryRadius`.
- UI: если `TerritoryRadius == MaxTerritoryRadius`, опция **Expand Territory** скрыта/disabled (выбор невозможен).
- Канон: `docs/03_map/Territory_Rules.md`

## UI/UX (City Level Up Choice) — sync note (v4.15.1)
- UI апгрейда города использует модель «**Level Up → Reward Choice (4 options)**».
- Старые отдельные UI-кнопки «Специализация» / «Защита» не являются каноном: они реализуются через выбор награды при апгрейде.
- Канон UI: `docs/10_uiux/City_UI.md`.

## AI (Phase 1)
- Все переменные скоринга определены в `docs/09_ai/AI_Spec_v1_0.md`
- LeaderIndex = 0.4 × Military + 0.35 × Economy + 0.25 × Progress
- Пороги атаки: Easy 70, Normal 55, Hard 45, God 35 (30 при стратегической цели)
