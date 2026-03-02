# Global Audit — Red Age v4.21

**Дата:** 2026-03-02
**Режим:** Read-only (без изменений файлов)
**Охват:** все docs/ (41 .md), все schemas/ (4 JSON + README), patches/

---

## PART A — Полный аудит по 10 измерениям

### Executive Summary

Канон Red Age после v4.21 покрывает **~75%** MVP-спецификации. Базовый core loop (ход → доход → действия → победа) полностью описан и консистентен. Основные пробелы: **эффекты технологий** (Tech Tree — только названия), **правила элиминации**, **event taxonomy**, **schema sync** с v4.20/v4.21 изменениями.

**Verdict: NOT YET "Ready for MVP-spec"** — нужно закрыть ~5 P0-блоков до начала разработки core engine.

---

### P0 / P1 / P2 таблица

| # | Severity | Dimension | Issue | Files |
|---|----------|-----------|-------|-------|
| 1 | **P0** | Schema sync | `match.schema.json` unit: `has_moved` + `has_attacked` (два boolean), но канон v4.20 → единый `HasActedThisTurn` | `schemas/match.schema.json` L236-279 vs `docs/10_uiux/Unit_Actions.md` |
| 2 | **P0** | Schema gap | Нет `HasActedThisTurn` ни в одной схеме | schemas/* |
| 3 | **P0** | Schema gap | Нет `StabilityBoostUsedThisTurn` ни в одной схеме | schemas/* |
| 4 | **P0** | Schema gap | Нет `territory_radius` в city object (`match.schema.json`) | `schemas/match.schema.json` cities |
| 5 | **P0** | Completeness | Tech_Tree.md — 15 технологий **без эффектов** (только названия) | `docs/05_tech/Tech_Tree.md` |
| 6 | **P0** | Logic gap | Правила элиминации отсутствуют (потеря всех городов = ?) | нигде не определено |
| 7 | **P0** | Ambiguity | Нейтральные города: "без гарнизона **или** со слабым гарнизоном" — не определено | `docs/02_cities/City_Capture.md` L33 |
| 8 | **P0** | Schema gap | `events[]` в match.schema: нет event type taxonomy (`t` = произвольная строка) | `schemas/match.schema.json` L394-422 |
| 9 | **P0** | Consistency | Tile schema: `has_port` (boolean) **и** `port_level` (0..3) — redundant; нужно одно | `schemas/tile.schema.json` |
| 10 | **P1** | Legacy text | Map_Generation: "движение -1" для FOREST/MOUNTAIN **рядом** с таблицей MoveCost (FOREST=2, MOUNTAIN=2) | `docs/03_map/Map_Generation.md` L27-28 vs L32-46 |
| 11 | **P1** | Schema lag | match.schema title "v4.12", канон уже v4.21 — 9 версий без обновления схемы | `schemas/match.schema.json` L3 |
| 12 | **P1** | Schema gap | unit.schema.json (v4.0) — минимальный, не включает `sight`, `veterancy_kills_threshold`, `serial_strike` | `schemas/unit.schema.json` |
| 13 | **P1** | Completeness | Specialization — TBD (2 места) | `City_Levels.md` L56, `City_UI.md` L53 |
| 14 | **P1** | Ambiguity | "1 действие на юнит" vs "после перемещения может атаковать" — move+attack = 1 действие? | `Unit_Actions.md` vs `Unit_Interaction.md` L9 |
| 15 | **P1** | Logic gap | Alliance leader не определён (кто "лидер" для победы альянса?) | `Victory_Rules.md` L37 |
| 16 | **P1** | Logic gap | Capital relocation — что если столица захвачена навсегда? Перенос? | нигде |
| 17 | **P1** | AI undefined | `ComplementaryStrength`, `TradeValue` — формулы не раскрыты (AI scoring) | `AI_Spec_v1_0.md` L83-89 |
| 18 | **P1** | Balance | Disband refund = `floor(APCost * 0.5)` в ОД — добавляется в текущий пул. Produce (2 ОД) + disband (refund 1 ОД) = net -1 ОД; но для дорогих юнитов (6 ОД → refund 3 ОД) это значимая конвертация денег в ОД | `Unit_Actions.md` |
| 19 | **P1** | Logic gap | Production: нет различия ground/naval/air slot (один город = 1 юнит/ход любого типа?) | `Production_Rules.md` |
| 20 | **P2** | Completeness | Morale reduction от South Asia Breakthrough Wave (-5 morale): глобально или per-unit? | `Unique_Units_By_Faction.md` |
| 21 | **P2** | Schema | tile.schema `road_damaged_turns_left` — нет `maximum: 2` constraint | `schemas/tile.schema.json` |
| 22 | **P2** | Completeness | Bridge placement: "между сушей 1 клетка воды" — только строго 1? Диагонали? | `Map_Generation.md` L59-61 |
| 23 | **P2** | UX gap | Observer/Replay: описание минимально, нет UI wireframes | `docs/11_replays/` |
| 24 | **P2** | Logic | Rebellion: город → нейтральный; уровень сохраняется — а Defense Level? | `Stability_and_Morale.md` L59-63 |

---

### Consistency Matrix — Top-20 констант

| Constant | Value | SOT | Docs | Schema | Status |
|----------|-------|-----|------|--------|--------|
| IntegrationTurns | 4 | Y | City_Capture Y | match.schema max=4 Y | OK |
| MaxCityLevel | 5 | Y | City_Levels Y | match.schema max=5 Y | OK |
| MaxDefenseLevel | 2 | - | City_Defense Y | match.schema max=2 Y | OK |
| MaxStability | 100 | Y | Stability Y | player.schema? | NOT IN SCHEMA |
| StabilityStart | 70 | Y | Start_Cond Y, Stability Y | - | OK (docs) |
| SerialKillCap | 5 | Y | Veterancy Y | match.schema max=5 Y | OK |
| DamageMultPerKill | 0.85 | Y | Veterancy Y | - | OK |
| MapSize | 80x80 | Y | MapGen Y | match.schema Y | OK |
| MaxCivs | 10 | Y | - | tile visibility[10] Y | OK |
| EconVictory% | 75% | Y | Victory Y | - | OK |
| EconHoldTurns | 5 | - | Victory Y | match.schema max=5 Y | OK |
| TechHoldTurns | 10 | Y | Victory Y | match.schema max=10 Y | OK |
| MilitaryVictory% | 60% | Y | Victory Y | - | OK |
| MaxRoadLevel | 3 | Y | Network Y | tile.schema max=3 Y | OK |
| MaxPortLevel | 3 | Y | Infra_Costs Y | tile.schema max=3 Y | OK |
| MaxTerritoryRadius | 5 | Y | Territory Y | NOT IN SCHEMA | **MISMATCH** |
| MinAllianceDuration | 6 | Y | Diplomacy Y | match.schema max=6 Y | OK |
| AllianceCooldown | 3 | Y | Diplomacy Y | match.schema max=3 Y | OK |
| HasActedThisTurn | bool | - | Unit_Actions Y, Pipeline Y | has_moved+has_attacked | **MISMATCH** |
| VeterancyThreshold | 3 kills | Y | Veterancy Y | - | OK (docs-only) |

**Итого:** 2 из 20 констант имеют schema mismatch.

---

### Regression search

| Pattern | Hits | Verdict |
|---------|------|---------|
| `TBD / TODO` | 2 (Specialization) | P1 — осознанный placeholder |
| `has_moved / has_attacked` (schemas) | 4 (match.schema + patches copy) | **P0** — нужно заменить на `has_acted` |
| `HasActedThisTurn` (schemas) | 0 | **P0** — нет в схемах |
| `StabilityBoostUsedThisTurn` (schemas) | 0 | **P0** — нет в схемах |
| `territory_radius` (schemas) | 0 | **P0** — нет в city object |
| `элиминац / eliminat / defeat` | 2 (только "Victory/Defeat" UI label) | **P0** — нет правил элиминации |
| `движение -1` | 2 (Map_Generation L27-28) | **P1** — legacy, конфликт с MoveCost table |
| `event.*type` (schemas) | 0 | **P0** — нет event taxonomy |

---

### Exploit-потенциал

| # | Exploit | Risk | Mitigation |
|---|---------|------|------------|
| 1 | **Disband AP loop**: произвести юнит за 2 ОД → disband → получить `floor(2*0.5)=1` ОД. Нет бесконечного лупа (net -1 ОД), но high-cost юнит → disband даёт значимый возврат (6 ОД юнит → 3 ОД refund). Можно "конвертировать" деньги в ОД через produce+disband | Low-Med | Cap disband refund per turn? |
| 2 | **Boost Science spam**: лимит `floor(SciencePerTurn * 2)` работает, но при высоком доходе + 1 ОД cost → можно вкачать 80+ науки/ход при ~40 SciencePerTurn | By design | Seems intentional |
| 3 | **Serial Strike + City Capture delay**: "Continue Chain" при убийстве последнего гарнизона → можно вычистить 5 юнитов вокруг города, а потом захватить | By design | Intentional risk/reward |
| 4 | **Stability boost at 99**: платить 50 за +2 → cap 100 → waste 1 point | Negligible | Cosmetic |
| 5 | **Alliance visibility permanent**: заключить союз → получить всю карту → разорвать → visibility stays | By design | Explicit design decision |

---

### "Ready for MVP-spec?" — вердикт

| Критерий | Status | Comment |
|----------|--------|---------|
| Core loop полный | YES | Turn Pipeline → Income → AP → Actions → Victory |
| Формулы детерминированные | YES | Все формулы floor(), min/max, без RNG (кроме rebellion 10%) |
| Все юниты со статами | YES | 9 base + A2 + 3 advanced + 14 unique = 27 юнитов |
| Tech effects defined | **NO** | 15 названий, 0 эффектов |
| Schema sync | **NO** | 4 P0 schema gaps |
| Elimination rules | **NO** | Не определены |
| Event taxonomy | **NO** | events[] = произвольный объект |
| AI execution flow | PARTIAL | Scoring OK, но нет pseudo-code хода ИИ |
| UI flows complete | PARTIAL | Main Game OK, но нет Elimination/Defeat screen flow |
| Balance pass | PARTIAL | Формулы есть, но без симуляции/playtesting |

**Вердикт: 5/10 блоков green → закрыть 5 P0 блоков до перехода к реализации.**

---

## PART B — Untouched Systems: Скелеты для 10 больших блоков

### B1. Tech Tree Effects

**Статус:** Полностью отсутствует (только 15 названий)

**Скелет:**

```
# Military Branch
L1 Infantry Improvement    → ? (+HP? +Damage? unlock unit type?)
L2 Mountain Access         → unlock MOUNTAIN movement for ground units
L3 Siege Techs             → ? (unlock Hypersonic? siege damage bonus?)
L4 Elite Troops            → ? (unlock Advanced Units? veterancy boost?)
L5 Military Doctrine       → ? (victory-related? global combat bonus?)

# Economic Branch
L1 Roads I                 → unlock road building
L2 Ports                   → unlock port building
L3 Roads II                → unlock road upgrade to L2? or auto +1 road level?
L4 Logistics               → +NetworkBonus%? +AP?
L5 Infrastructure Maximum  → unlock road L3? port L3?

# Science Branch
L1 Research Center         → +base science?
L2 +10% Science            → TechBonus = SciencePerTurn * 0.10
L3 +20% Science            → TechBonus = SciencePerTurn * 0.20
L4 Tech Acceleration       → ? (-% tech cost? +conversion rate?)
L5 Tech Breakthrough       → triggers 10-turn tech victory timer
```

**Что нужно:** конкретный эффект для каждой из 15 технологий (числа + unlock-правила).

---

### B2. AI Execution (turn logic)

**Статус:** Scoring/thresholds есть, но нет алгоритма хода ИИ

**Скелет:**

```
AI_Turn(player):
  1. Evaluate all enemies   → compute EnemyScore[], WarScore[]
  2. Evaluate allies        → compute AllyScore[], BreakScore[]
  3. Decide diplomacy:
     - If BreakScore > threshold → break alliance
     - If AllyScore > threshold  → propose alliance
     - If EnemyScore > threshold → declare war (if not at war)
  4. Prioritize cities to attack → CityPriority[]
  5. Allocate AP:
     - Produce units (which cities? which unit types?)
     - Build infrastructure (roads/ports — where?)
     - Boost Science / Boost Stability (when?)
  6. Move & attack:
     - Select units by priority
     - Execute movement toward priority targets
     - Attack if in range
  7. Heal damaged units (HP < threshold?)
  8. End turn
```

**Что нужно:** pseudo-code или state machine для каждого шага; unit selection/targeting logic; infrastructure placement heuristic.

---

### B3. Observer/Replay System

**Статус:** Минимальное описание в `docs/11_replays/`

**Скелет:**

```
# Replay System
- Match saved as events[] log (already in match.schema)
- Event types needed: MOVE, ATTACK, PRODUCE, BUILD, TECH, DIPLOMACY,
  VICTORY_CHECK, CAPTURE, DISBAND, HEAL, BOOST_SCIENCE, BOOST_STABILITY
- Replay playback: reconstruct state from events
- POV selection: choose civ → filter visibility

# Observer Mode
- Available: post-match only? or live for eliminated players?
- Visibility: full map or per-civ POV?
- Controls: play/pause, speed, step forward/back
```

**Что нужно:** event type taxonomy, replay engine spec, UI wireframes.

---

### B4. Hidden Civilization (detailed)

**Статус:** Базовые правила есть, нет деталей

**Скелет:**

```
# Spawn Logic
- Trigger: turn >= 20 + random delay 0..5?
- Region selection: how many (1-3)? criteria?
- City selection: which neutrals? proximity rules?
- Starting units: how many? what types?
- Starting tech: any?
- Starting money/science: how much?

# Behavior
- Uses same AI_Spec scoring but with -15 threshold offset
- Does it form alliances?
- Does it participate in all victory types?
- Can player discover hidden civ before spawn?
```

**Что нужно:** конкретные spawn-параметры, стартовые ресурсы, ограничения дипломатии.

---

### B5. Neutral Cities (detailed)

**Статус:** Ключевые правила не определены

**Скелет:**

```
# Initial State
- Garrison: NONE / WEAK? → need concrete answer
  - If WEAK: unit type? HP? count?
- Level: 1? random 1-3?
- Defense Level: 0? 1?
- Territory: TerritoryRadius = 1 (confirmed)

# Behavior
- Passive (no actions, no income)
- Visibility: neutral tiles are UNEXPLORED for all players at start?
- Can neutral cities upgrade? (NO — no owner)

# Capture
- Same rules as any city (unit on city tile → 4 turns integration)
- If garrison: must defeat garrison first
```

**Что нужно:** конкретные garrison rules + starting level + defense level.

---

### B6. Elimination Rules

**Статус:** Полностью отсутствует

**Скелет:**

```
# Elimination Condition
- When: player loses ALL cities (including capital)?
- OR: loses ALL cities AND all units?
- Is there a grace period?

# Effects
- Units of eliminated civ: destroyed immediately? persist?
- Cities of eliminated civ: become neutral? stay with captor?
- Alliance with eliminated civ: auto-break?
- Diplomacy relations: removed?
- Turn order: skip eliminated civ
- Victory recalculation: GlobalCityPower changes

# UI
- Defeat screen for human player
- Notification for AI elimination
```

**Что нужно:** точное условие элиминации + обработка всех связей.

---

### B7. Production Slots & Types

**Статус:** Базовое правило "1 юнит/город/ход", но нет типизации

**Скелет:**

```
# Slot Rules
- 1 production slot per integrated city per turn (confirmed)
- Same slot for ground/naval/air?
  - OR: separate ground slot + naval slot (port)?
  - OR: aircraft don't use production slot (based from city)?

# Naval Production
- Requires port (confirmed)
- Ship appears on port tile? or city tile?
- If port is not adjacent to city?

# Air Production
- Aircraft base in city (confirmed)
- Count limit = floor(city_level / 2)
- Produced in same slot as ground? or separate?

# Unit Limits
- Ground: city_level units per city
- Naval: city_level ships per city (with port)
- Air: floor(city_level / 2) per city
- Are these concurrent limits or production limits?
```

**Что нужно:** разрешение production slot для naval/air, spawn location для кораблей.

---

### B8. Diplomacy State Machine

**Статус:** Правила есть, но нет явной FSM

**Скелет:**

```
# States per pair (A, B):
NEUTRAL → WAR      (declaration or cyber attack)
NEUTRAL → ALLIANCE (mutual agreement)
WAR → NEUTRAL      (peace? how?)
WAR → ALLIANCE     (forbidden while at war?)
ALLIANCE → NEUTRAL (breakup after 6 turns, +3 cooldown)
ALLIANCE → WAR     (break + immediate war?)

# Missing rules:
- How does WAR → NEUTRAL work? (peace treaty? conditions?)
- Can a civ at war propose peace?
- Is there a WAR cooldown before peace?
- AI peace-making logic?
- War declaration notification/UI?
```

**Что нужно:** полная state machine с transition rules, peace conditions.

---

### B9. UI Flow (full journey)

**Статус:** MVP_Player_Journey описывает high-level, детали частичны

**Скелет:**

```
# Screen Flow
Home → New Game Setup → Loading/Briefing → Main Game → Victory/Defeat

# Missing screens/flows:
- Defeat screen (elimination)
- Mid-game save/load (beyond autosave)
- Settings/options screen
- Tech tree browser (full-screen?)
- Diplomacy panel (propose/break alliance)
- Combat result popup (damage numbers, counter-attack)
- City capture notification
- Hidden civ reveal notification
- Alliance proposal incoming UI
- End-game statistics/summary
```

**Что нужно:** wireframes или flow descriptions для каждого отсутствующего экрана.

---

### B10. Action Catalog (complete)

**Статус:** Действия разбросаны по 5+ файлам

**Скелет единого каталога:**

```
# UNIT ACTIONS (requires unit action slot)
| Action     | AP Cost | Target        | Effect                            |
|------------|---------|---------------|-----------------------------------|
| Move       | 0       | destination   | Relocate unit                     |
| Attack     | 0       | enemy unit    | Deal damage, counter-attack       |
| Heal       | 1       | self          | +3 HP                             |
| Disband    | 0       | self          | Remove, refund floor(APCost*0.5)  |
| Serial     | 0       | chain         | Continue attack chain             |
| Capture    | 0       | city tile     | Start 4-turn integration          |

# CIV ACTIONS (no unit action slot needed)
| Action          | AP Cost | Money Cost | Effect                       |
|-----------------|---------|------------|------------------------------|
| Produce Unit    | varies  | 0          | Spawn unit at city           |
| Build Road      | 1       | 25         | Place road L1                |
| Upgrade Road    | 1       | 25/level   | Road level +1                |
| Build Bridge    | 2       | 50         | Road on 1-tile water         |
| Build Port      | 3       | 200        | Port L1 at coast tile        |
| Upgrade Port    | 2       | 150        | Port level +1                |
| Upgrade City    | 0       | varies     | City level +1 + reward       |
| Activate Tech   | ?       | 0          | Research tech (cost unclear)  |
| Boost Science   | 1       | varies     | Money -> Science * 0.5       |
| Boost Stability | 1       | 50 or 100  | +2 or +5 Stability           |
| Start Harvest   | 1       | 0          | Begin resource extraction    |
| Repair Road     | 1       | 0          | Fix DamagedRoad              |
| Cyber Disrupt   | 1+unit  | 0          | Apply Disruption to target   |
| Cyber Road Dmg  | unit    | 0          | Damage 1 road tile           |
| Hypersonic      | unit    | 0          | 7 damage to target           |
```

**Что нужно:** единый канонический файл с полным каталогом, AP costs для tech activation.

---

## PART C — Self-check: Top-10 + Next 5 Patch Plan

### Top-10 отсутствующих MVP-спецификаций

| # | Block | Impact | Effort |
|---|-------|--------|--------|
| 1 | **Tech Tree Effects** (15 технологий * эффект) | Critical — без эффектов нельзя тестировать баланс | Medium |
| 2 | **Elimination Rules** | Critical — нет правила выбытия из игры | Small |
| 3 | **Event Taxonomy** | Critical — без неё нет replay, нет AI debug | Medium |
| 4 | **Neutral City Garrison** | High — влияет на раннюю игру | Small |
| 5 | **Diplomacy FSM** (мирный договор / WAR→NEUTRAL) | High — нет способа закончить войну | Small |
| 6 | **AI Execution Pseudo-code** | High — scoring есть, но нет алгоритма хода | Large |
| 7 | **Production Slot Types** (ground/naval/air) | Medium — влияет на naval/air gameplay | Small |
| 8 | **Capital Relocation** | Medium — edge case при потере столицы | Small |
| 9 | **Action Catalog** (единый файл) | Medium — сейчас разбросано по 5+ файлам | Medium |
| 10 | **Hidden Civ Spawn Details** | Medium — нет стартовых ресурсов/юнитов | Small |

---

### Top-10 высокорисковых неоднозначностей

| # | Ambiguity | Risk | Resolution |
|---|-----------|------|------------|
| 1 | **Move + Attack = 1 action or 2?** | Все gameplay зависит от ответа | Уточнить: "action" = полный ход юнита (move → optional attack → done) |
| 2 | **Neutral city garrison** | Влияет на early game tempo | Решить: всегда без гарнизона / всегда L1 militia / random |
| 3 | **Alliance leader** | Определяет winner при alliance victory | Решить: highest LeaderIndex? or first to trigger? |
| 4 | **Tech activation AP cost** | AP_COST = ? для активации технологии | Определить конкретное число (1? 2?) |
| 5 | **WAR → NEUTRAL transition** | Как заключить мир? | Определить: peace proposal? unilateral? conditions? |
| 6 | **Ship spawn location** | Порт != город tile; где появляется корабль? | Определить: city tile / port tile / choice |
| 7 | **Capital loss → network break** | Вся сеть привязана к столице; если потеряна → 0% NetworkBonus? | Подтвердить или добавить relocation |
| 8 | **Rebellion → neutral: Defense Level** | Город бунтует → нейтральный; Defense Level сохраняется? | Определить: reset to 0 / keep current |
| 9 | **Veterancy + MaxHP cap** | MaxHP += 2 при tier-up; есть ли абсолютный cap? | Определить: single tier → cap = BaseHP + 2 (implicit) |
| 10 | **Forest defense +1 vs MoveCost 2** | Forest дает +1 defense но стоит 2 move — balanced? | Balance check (probably fine, but confirm) |

---

### Next 5 Patch Plan

| Patch | Version | Scope | Content | Files |
|-------|---------|-------|---------|-------|
| **1** | v4.22 | **Schema Sync P0** | (a) Replace `has_moved`+`has_attacked` → `has_acted_this_turn: boolean` в match.schema; (b) Добавить `territory_radius` в city object; (c) Добавить `stability_boost_used_this_turn` в player state; (d) Remove `has_port` из tile.schema (redundant с `port_level`); (e) Добавить `road_damaged_turns_left` max=2; (f) Bump schema title to v4.22 | `schemas/match.schema.json`, `schemas/tile.schema.json`, `schemas/player.schema.json` |
| **2** | v4.23 | **Elimination + Neutral Cities** | (a) Определить elimination condition (all cities lost? + all units?); (b) Определить neutral city garrison (none / weak militia); (c) Neutral city starting defense level + starting city level; (d) Rebellion → neutral: что с Defense Level; (e) Capital relocation rule (or confirm: no relocation) | `docs/02_cities/City_Capture.md`, `docs/03_map/Map_Generation.md`, `docs/04_economy/Stability_and_Morale.md`, `docs/01_overview/Turn_Pipeline.md`, SOT, CHANGELOG |
| **3** | v4.24 | **Tech Tree Effects** | Для каждой из 15 технологий: конкретный эффект (unlock / bonus / modifier) с числами. Связать с unit unlocks, infrastructure unlocks, victory prerequisites | `docs/05_tech/Tech_Tree.md`, `docs/05_tech/Tech_Progression.md`, SOT, CHANGELOG |
| **4** | v4.25 | **Event Taxonomy + Action Catalog** | (a) Определить enum event types для events[] (MOVE, ATTACK, PRODUCE, BUILD_ROAD, BUILD_PORT, TECH_UNLOCK, DIPLOMACY_CHANGE, CITY_CAPTURE, HEAL, DISBAND, BOOST_SCIENCE, BOOST_STABILITY, REBELLION, ELIMINATION, VICTORY); (b) Payload schema для каждого типа; (c) Unified Action Catalog doc | `schemas/match.schema.json`, new `docs/01_overview/Action_Catalog.md`, SOT, CHANGELOG |
| **5** | v4.26 | **Diplomacy FSM + Move-Attack clarification** | (a) Полная state machine: NEUTRAL-WAR-ALLIANCE с transition rules; (b) Peace treaty conditions; (c) Clarify "1 action" = full turn (move + optional attack); (d) Alliance leader = highest LeaderIndex at time of victory check; (e) Cleanup legacy "движение -1" text from Map_Generation | `docs/08_diplomacy/Diplomacy_and_Alliances.md`, `docs/10_uiux/Unit_Actions.md`, `docs/03_map/Map_Generation.md`, SOT, CHANGELOG |

---

### Порядок приоритетов после Patch 5

После v4.26 остаются (по убыванию приоритета):

1. **AI Execution pseudo-code** (v4.27) — turn-by-turn algorithm
2. **Production Slot Types** (v4.28) — ground/naval/air resolution
3. **Hidden Civ Spawn Details** (v4.29) — starting resources, units, timing
4. **Specialization System** (v4.30) — city specialization effects
5. **Unit Schema Upgrade** (v4.31) — expand `unit.schema.json` to full v4.21 canon
6. **Observer/Replay UI** (v4.32) — event playback, POV selection
7. **Balance Simulation** — numerical sweep, win-rate targets, tempo curves
