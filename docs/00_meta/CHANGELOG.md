# Changelog

## v4.42 — Schema Draft Alignment + Version Title Sync

- **tile.schema.json:** `$schema` aligned from draft-07 to `https://json-schema.org/draft/2020-12/schema`. No structural changes; meta compatibility only.
- **Schema titles:** all 5 schemas (match, player, tile, city, unit) bumped to v4.42.
- **SOT, schemas/README:** version references updated to v4.42.
- No gameplay mechanics, enums, constraints, or data shapes changed. Spec-only hardening.

---

## v4.41 — Spec Hardening (P2 Resolution)

- **Victory type:** Clarified as derived value (not stored in schema). Source: VICTORY_COMPLETE event. Display values: MILITARY | ECONOMIC | TECHNOLOGICAL | ALLIANCE. Updated Endgame_Screens.md, Victory_Rules.md.
- **Tech unlock format:** Standardized `player.tech_unlocked` key format: `{branch}_{level}` (lowercase), e.g. `["military_1", "science_2"]`. Updated Tech_Tree_UI.md, Tech_Progression.md, player.schema.json description.
- **Diplomacy proposal queue:** Defined in Diplomacy_UI.md §10. Max 3 pending, timeout 1 turn cycle, auto-decline. Proposal object spec (proposal_id, from_player_id, to_player_id, type, created_turn). Stored in docs only; `match.diplomacy.proposals[]` optional at implementation.
- SOT: v4.41 header, Spec Hardening sync note.

---

## v4.40 — UI/Visual Spec Pack (Product + World + Visuals Gaps)

- **P0 docs:** Diplomacy_UI, Tech_Tree_UI, Production_UI, Map_Visual_Spec, Design_System, Tutorial_Design, Unit_Visual_Spec, Endgame_Screens.
- **P1 docs:** City_Visual_Spec, Combat_Feedback_UI, Settings_Screen, New_Game_Setup_UI, Notification_System, Keyboard_Shortcuts, Map_Overlays.
- **Diplomacy:** все действия (Declare War, Make Peace, Form Alliance, Break Alliance) требуют подтверждения. Player-initiated: Confirm dialog. AI-initiated: Incoming Proposal (Accept/Reject/Decide later).
- **Layout:** Main_Game_Screen — canonical (HUD + right panel). PvE_Web_Layout — aspirational/future variant.
- **Map visuals:** terrain tokens, roads/ports/bridges, visibility UNEXPLORED/VISIBLE, territory borders, status indicators.
- **Build Bridge:** визуал привязан к BUILD_ROAD is_bridge=true (без отдельного event).
- SOT: v4.40 header, UI/Visual Spec Pack sync note.

---

## v4.34 — P0 Docs (Map Generation Algorithm)

- **Map_Generation.md:** Added section «Generation Algorithm (MVP) (v4.34)» — pseudocode: seed handling (deterministic), landmask (noise threshold + floodfill, 4–6 continents, 5–10 islands), terrain assignment (PLAIN/FOREST/MOUNTAIN/DESERT/WATER), rivers (is_river on WATER), city placement (50–100, min 2 tiles apart, capitals 10+ apart, China 7+ from edge), neutral params (level=1, defense=0, territory_radius=1), validation with seed+1 retry.
- SOT: Map generation canonical path note.

---

## v4.33 — P0 Docs (AI Turn Execution)

- **AI_Spec_v1_0.md:** Added section «AI Turn Execution (MVP) (v4.33)» — step-by-step pseudocode: diplomacy phase, strategic objectives, AP budget allocation, tactical phase (units, has_acted_this_turn, 1 action per unit), end turn. Deterministic tie-break rules for reproducible replays.
- References: Turn_Pipeline, Action_Catalog, Action_Points, event types, AP costs, has_acted_this_turn.
- SOT: AI execution canonical path note.

---

## v4.32 — P0/P2 Prep Pack (Build Bridge + Unit Schema + Version Hygiene)

- **Build Bridge mapping:** BUILD_BRIDGE is NOT a separate event_type. Build Bridge → BUILD_ROAD with `is_bridge: true` in payload. Payload_BUILD_ROAD adds optional `is_bridge` (default false).
- **unit.schema.json:** Rebuilt as valid JSON Schema draft/2020-12. Defines UnitType (unit_type_id, name, domain, range, base_damage, base_max_hp, ap_cost, move; optional sight, is_unique, unlock_tech). P0 blocker removed.
- **Version header alignment:** Action_Catalog, Turn_Pipeline, match/player/tile/city schemas bumped to v4.32.
- SOT, schemas/README updated.

---

## v4.31 — P1 Cleanup Pack (Tile Identity + Specialization Placeholder)

- **tile.schema.json:** Identity refactor — harvest_owner_civ_id, road_owner_civ_id, port_owner_civ_id, territory_owner_civ_id → *_owner_player_id (string|null). Title v4.31.
- **schemas/README.md:** Tile section sync (*_owner_player_id), version v4.31; city/unit sections clarified.
- **REPO_STRUCTURE.md:** Schema versions (player v4.30, match v4.30, tile v4.31, city v4.27, unit); Meta (templates/audits) subsection.
- **Specialization:** City_Levels, City_UI — out of MVP placeholder (no effect in MVP build). SOT sync note.

---

## v4.30 — P1 Diplomacy Canon (authoritative match-level only)

- **player.schema:** Removed diplomacy section (relations, other_player_id, state, cooldown, min_alliance_turns). Player schema no longer stores diplomacy.
- **match.diplomacy:** Sole source of truth for diplomacy state. `relations[]` uses player_id keys (a_player_id, b_player_id).
- Docs/SOT synced: Diplomacy Canon note in Action_Catalog, SOT section, schemas/README.

---

## v4.29 — Identity Canon (player_id ↔ civ_id)

- **EventBase:** `acting_civ_id` (int 0..9) заменён на `acting_player_id` (string).
- **Payloads:** все civ_id заменены на player_id: ELIMINATION, DECLARE_WAR, MAKE_PEACE, FORM_ALLIANCE, BREAK_ALLIANCE, REBELLION (old_owner), CAPTURE_CITY (from/to), VICTORY_TRIGGER, VICTORY_COMPLETE, HIDDEN_CIV_SPAWN.
- **Canon:** player_id (string) — единственный идентификатор в match state и events; civ_id не используется в event layer.
- SOT, Action_Catalog, schemas/README, Turn_Pipeline обновлены.

---

## v4.28 — Cyber Events + Elimination Step (P0 MVP gaps)

- **Event taxonomy:** добавлены CYBER_DISRUPT и CYBER_DAMAGE_ROAD (payloads: unit_id, target_city_id / target_tile_index; additionalProperties: false).
- **Action_Catalog:** Cyber Disrupt и Cyber Damage Road в UNIT ACTIONS; mapping Action → event_type.
- **Turn Pipeline:** явный шаг 4.0 Elimination check — при 0 городов элиминация, эмиссия ELIMINATION, удаление из turn order; выполняется до victory timers и victory check.
- SOT, schemas/README, match.schema обновлены до v4.28.

---

## v4.27 — City Schema Rebuild

- Rebuilt schemas/city.schema.json to match match.schema city object (removed has_port legacy)
- Updated schemas/README.md coverage
- Updated REPO_STRUCTURE.md to include key canonical docs

---

## v4.26 — Phase X (P0 SOT Formula Sync)

- SOT: AP formula includes TechAccelerationBonus (+1 AP if Science L4)
- SOT: Money formula includes LogisticsMultiplier (×1.05 if Economic L4)
- Map_Generation: removed legacy 'движение -1' wording, aligned with MoveCost table
- Schema titles bumped: player.schema v4.26, tile.schema v4.26

---

## v4.25.1 — Event Taxonomy (strict payloads + turn semantics)

- `events[]`: discriminated union (oneOf) с 26 строго типизированными payload-схемами (additionalProperties: false).
- EventBase: добавлены `round_index`, `civ_turn_index`; `turn_index` deprecated.
- `docs/01_overview/Action_Catalog.md`: секция "Event Fields", payload specs выровнены со схемой.
- SOURCE_OF_TRUTH, schemas/README обновлены.

---

## v4.25 — Phase 4.17 (Event Taxonomy + Action Catalog)

- Event taxonomy: `events[]` в match.schema типизированы по `event_type` (enum из 26 типов).
- Обязательные поля события: event_id, turn_index, acting_civ_id, event_type, payload.
- Добавлен `docs/01_overview/Action_Catalog.md` — каталог действий (Unit Actions, Civ Actions, System Events) и соответствие Action → Event Type.
- Payload specs для replay/debug задокументированы в Action_Catalog.

---

## v4.24 — Phase 4.16 (Tech Tree Effects)

- Полностью определены эффекты всех 15 технологий в `docs/05_tech/Tech_Tree.md`.
- Military: L1 Heavy Infantry, L2 Mountain Access, L3 +1 vs cities, L4 Advanced Units + Hypersonic, L5 +1 global damage.
- Economic: L1 Roads, L2 Ports, L3 Road L2, L4 +5% Money, L5 Road L3 / Port L3.
- Science: L1 +1 Science/city, L2/L3 +10%/+20%, L4 +1 AP, L5 Tech Victory.
- Связи с формулами: Money_Model (Logistics), Action_Points (Tech Acceleration), Damage_and_Rules (Siege, Doctrine).
- Hypersonic unlock через Military L4 (Elite Warfare).

---

## v4.23 — Phase 4.15 (Elimination Rules + Neutral Cities)

- Добавлен канон элиминации: `docs/01_overview/Elimination_Rules.md` — условие (0 городов), удаление юнитов, пропуск в turn order, пересчёт побед.
- Нейтральные города: garrison = 0 (канон MVP); старт: level=1, defense_level=0, territory_radius=1.
- Rebellion → neutral: defense_level сбрасывается в 0 (MVP правило простоты).
- Обновлены: City_Capture, Map_Generation, Stability_and_Morale, SOURCE_OF_TRUTH, REPO_STRUCTURE.

---

## v4.22 — Phase 4.14 (Schema Sync)
- Schema sync: unit action flags → `has_acted_this_turn` (replaces `has_moved` + `has_attacked`) in match state.
- Schema: cities include `territory_radius` (1..5) to match Territory rules.
- Schema: player state includes `stability_boost_used_this_turn` (per-turn counter).
- Schema: tile ports use `port_level` (0..3); remove redundant `has_port`.
- Schema: `road_damaged_turns_left` constrained to max 2.

---

## v4.21 — Phase 4.14 (Stability Boost Action)

- `docs/04_economy/Stability_and_Morale.md` — добавлено действие цивилизации **Boost Stability** (тратит деньги + 1 ОД, раз в ход на цивилизацию).
- `docs/04_economy/Action_Points.md` — добавлено в список действий, уточнены ограничения и сброс per-turn флага.
- `docs/01_overview/Turn_Pipeline.md` — PHASE 0: сброс `StabilityBoostUsedThisTurn`; PHASE 3: описание действия Boost Stability.
- `docs/00_meta/SOURCE_OF_TRUTH.md` — добавлена секция `Stability Boost (v4.21)`.

---

## v4.20 — Phase 4.13 (Combat Actions: Counter-attack, Heal, Disband)

- `docs/06_combat/Damage_and_Rules.md` — добавлен канон ответного удара: **только melee (Range=1)**, ranged без ответного удара.
- `docs/10_uiux/Unit_Actions.md` — добавлены действия Heal (+3 HP за 1 ОД) и Disband (refund 50% AP cost), а также правило «1 действие на юнит за ход».
- `docs/01_overview/Turn_Pipeline.md` — уточнён action budget юнита (сброс в PHASE 0, учёт в PHASE 3).
- `docs/00_meta/SOURCE_OF_TRUTH.md` — секция Unit Actions (v4.20).

---

## v4.19 — Phase 4.12 (Numeric P0 closure: movement, roads/ports caps, veterancy)

- Movement: зафиксирована таблица базовой стоимости перемещения по тайлам (PLAIN/FOREST/MOUNTAIN/DESERT/WATER).
- Roads: введён `MaxRoadLevel = 3` и бонус перемещения **+1 Move за уровень дороги** (L1..L3) при старте перемещения с дорожного тайла.
- Ports: введён `MaxPortLevel = 3` (L1..L3).
- Veterancy: порог **3 убийства** → `MaxHP +2` (один tier для MVP).
- Schemas: ограничения уровней дорог/портов синхронизированы с каноном.

---

## v4.18 — Phase 4.11 (MVP UI/UX: Main Game Screen)

- Добавлен канон основного экрана матча (HUD + правая контекстная панель).
- Зафиксированы: выделение активного юнита, формат HP, движение/атака, статусы, победные таймеры в HUD.
- MVP-ограничения: без миникарты, без постоянного event-log (только toast).
- End Turn доступна всегда (можно нажать в любой момент); при AP=0 доступен обзор карты.

---

## v4.17 — Phase 4.10 (MVP Player Journey)
- Добавлен канонический сценарий MVP и цепочка экранов: `docs/01_overview/MVP_Player_Journey.md`.
- Зафиксированы: autosave policy (end of each civ turn), фиксированный порядок ходов (AI first, player last), сложности (Easy/Normal/Hard/God), целевая длительность матча (60–90 ходов), правило End Turn (manual).

---

## v4.16 — Phase 4.9 (P1 constants & edge-cases)

- Territory: зафиксирован `MaxTerritoryRadius = 5`; при достижении капа опция **Expand Territory** скрыта/disabled (выбор невозможен).

---

## v4.15.1 — Phase 4.8.1 (UI sync: City Level Up Reward Choice)

- `docs/10_uiux/City_UI.md` — синхронизирован с каноном v4.13+: «апгрейд уровня города → выбор награды (4 опции)» вместо отдельных кнопок.

---

## v4.15 — Phase 4.8 (Boost Science cap + Capture Infrastructure + Serial vs City choice)

- **Money → Science Boost** (Action Phase):
  - Стоит **1 ОД**.
  - Конверсия: `AddedScience = floor(MoneySpent × 0.5)`.
  - Лимит за ход: `BoostScienceThisTurn ≤ floor(SciencePerTurn × 2)` (SciencePerTurn берётся из PHASE 1 этого хода, до бустов).
- **Capture: инфраструктура**:
  - При захвате города **территория переходит сразу**.
  - Дороги/мосты/порты в территории захваченного города переходят новому владельцу.
  - `DamagedRoad` таймер **не сбрасывается**.
  - До интеграции захваченный город **не даёт** доход/науку/NetworkBonus.
- **Serial Strike vs City**:
  - Если серийный юнит убивает последнего защитника города, игрок выбирает:
    - **Capture Now**: юнит занимает клетку города, город захватывается, цепочка **сразу заканчивается**;
    - **Continue Chain**: юнит занимает клетку города, **захват откладывается** до завершения цепочки (город захватывается только если цепочка завершилась и юнит остался на клетке города).

Канон обновлён в:
- `docs/05_tech/Tech_Progression.md`
- `docs/04_economy/Action_Points.md`
- `docs/01_overview/Turn_Pipeline.md`
- `docs/02_cities/City_Capture.md`
- `docs/06_combat/Veterancy_and_Serial.md`
- `docs/10_uiux/Unit_Interaction.md`

---

## v4.14 — Phase 4.7 (Terrain T1+R1, Infrastructure Costs, Unit Sight)

- Terrain приведён к T1: PLAIN/FOREST/MOUNTAIN/DESERT/WATER; реки = WATER + `is_river=true` (R1).
- Добавлен канон стоимости инфраструктуры: `docs/04_economy/Infrastructure_Costs.md` (дороги/мосты/порт).
- Введён параметр `Sight` для типов юнитов; определён стартовый юнит A2 (StarterScout) с Sight=2.
- Schemas синхронизированы с каноном (terrain enum, unit.sight, city level max=5, diplomacy casing).
---

## v4.13 — Phase 4.6 (Territory & City Vision)

- Добавлена каноническая модель территорий городов: `docs/03_map/Territory_Rules.md`.
- `TerritoryRadius`: старт/минимум = 1, расширение +1 как выбор при апгрейде города.
- Город раскрывает карту на всю свою территорию; при захвате — территория раскрывается и переходит владельцу.
- Синхронизированы `Map_Generation.md`, `City_Levels.md`, `Visibility.md`, `SOURCE_OF_TRUTH.md`.

---

## v4.12.1 — Phase 4.5.1 (Broken Link Fix)

- Исправлена битая ссылка в `docs/06_combat/Siege_Effects.md`:
  `docs/02_cities/City_Defense.md` → `docs/04_economy/City_Defense.md`

---

## v4.12 — Phase 4.5 (Schema: Match State)

- `schemas/match.schema.json` — обновлён до Canonical State Container (полный game state) + `events[]` как replay-log.
- `docs/00_meta/SOURCE_OF_TRUTH.md` — добавлена секция Match State Schema (v4.12).
- `schemas/README.md` и `docs/00_meta/REPO_STRUCTURE.md` — обновлены ссылками на match schema.

---

## v4.11 — Phase 4.4 (Start Conditions + Schema: Player)

- Добавлен канонический документ стартовых условий: `docs/01_overview/Start_Conditions.md`.
- Добавлена схема состояния игрока/цивилизации: `schemas/player.schema.json`.
- Обновлены индексы и Source of Truth под v4.11.

---

## v4.10 — Phase 4.3 (Schema: Tile)

- Добавлен `schemas/tile.schema.json` — каноническая структура тайла карты (terrain/resources/roads/ports/territory/visibility).
- Зафиксирован `MaxCivs = 10` (слоты видимости).

---

## v4.9 — Phase 4.2 (Visibility: Permanent Reveal)

- Введена каноническая модель видимости **2-state**: `UNEXPLORED` / `VISIBLE` (fog-of-war отсутствует).
- Раскрытие карты **перманентное**: открытые тайлы остаются видимыми навсегда (включая после разрыва альянса).
- Добавлено правило: у каждого юнита есть параметр `visibility`; видимость обновляется событийно (spawn/move/capture).
- Горы: `visibility +1` для юнита на горе; модель S2 "гора стоит дороже для обзора" (`cost=2`).
- Альянсы делятся видимостью полностью.

Канон: `docs/03_map/Visibility.md`

---

## v4.8.1 — Phase 4.1 (Victory timing sync)

- Синхронизирован момент проверки победы: **в конце каждого хода**, а не полного раунда.
  - `docs/08_diplomacy/Victory_Rules.md`
  - `docs/00_meta/SOURCE_OF_TRUTH.md`

---

## v4.8 — Phase 4.0 (Turn Pipeline)

- Добавлен канонический документ `docs/01_overview/Turn_Pipeline.md`, фиксирующий порядок фаз хода:
  тик таймеров → бунт → доход → расчёт ОД → действия → победные таймеры → проверка победы.

---

## v4.7 — Phase 3.6 (China Balance: Stability Trigger + Spawn Rule)

- Китай: стабильность от убийств (`+1`) теперь начисляется **только** при убийстве на своей территории или в интегрированном городе.
- Генерация карты: старт Китая не ближе **7 клеток** к краю карты (анти-«угловая черепаха»).
- Устранён эксплойт «stability farming» через агрессивную войну.

---

## v4.6 — Phase 3.5 (South Asia Balance)

- Массовый мобилизационный батальон: HP 8→7, Damage 3→2.
- Удалён бонус +1 к лимиту юнитов в городе.
- Сохранена стоимость 1 ОД для поддержания идентичности «массовой армии».

---

## v4.5.1 — Phase 3.4.1 (Hypersonic: Capital Protection)

- Восстановлено каноническое ограничение: гиперзвуковая ракета не может атаковать столицу цивилизации.

---

## v4.5 — Phase 3.4 (Hypersonic + Naval Counterplay)

- Добавлена контр-игра против флота: наземные дальнобойные юниты (Range ≥ 2) могут атаковать корабли на прибрежных клетках при наличии видимости.
- Гиперзвук теперь требует видимости клетки цели и не может атаковать корабли.
- Гиперзвук игнорирует бонусы местности, но не игнорирует городскую оборону (City Defense Level).
- Устранён сценарий безответной осады при потере порта.

---

## v4.4.1 — Phase 3.3.1 (UI sync: Serial Strike)

- `docs/10_uiux/Unit_Interaction.md` — описание серийного юнита синхронизировано с каноном v4.4 (SerialKillCap, DamageMultiplierPerKill, условия остановки цепочки).

---

## v4.4 — Phase 3.3 (Serial Strike Balance)

- Серийный удар: введён лимит `SerialKillCap = 5` убийств за одну цепочку в ход.
- Деградация урона в цепочке усилена: `DamageMultiplierPerKill = 0.85` (−15% после каждого убийства).
- Устранён эксплойт бесконечной зачистки фронта одним спец‑юнитом.

---

## v4.3 — Phase 3.2 (Alliance Economic Victory Fix)

- Экономическая победа теперь считается **только по CityPower игрока** (без суммирования через альянс).
- Устранён эксплойт: победа через союз с сильнейшим ИИ без реального доминирования.
- Альянсы сохраняют экономические/боевые бонусы, но не считаются "контролем" для условия 75%.

---

## v4.2 — Phase 3.1 (Cyber Rebalance)

- Введён лимит: **1 активный «Сбой»** на цивилизацию
- Применение «Сбоя» теперь требует **1 ОД**
- Дороги больше не уничтожаются — получают статус **DamagedRoad (2 хода)**
- DamagedRoad: не учитывается в `NetworkBonus`, не даёт бонус перемещения, авто-восстанавливается (или чинится за 1 ОД)
- Устранены эксплойты массовой кибер-ротации и мгновенного обрушения магистрали

---

## v4.1 — Phase 2.1 hotfix
Дата: 2026-03-01

### Новые канонические файлы
- `docs/07_units/Cyber_Effects.md` — уточнение «Сбоя»: два параллельных эффекта (CyberPenalty -1 OD + CyberIncomeMultiplier 0.8)

### Обновлённые файлы
- `docs/04_economy/Stability_and_Morale.md` — добавлена таблица MoneyMultiplier (80–100: +5%, 60–79: 0%, 40–59: -5%, 20–39: -10%, 0–19: -20%); MoraleModifier переименован в MoraleMultiplier с таблицей значений
- `docs/06_combat/Damage_and_Rules.md` — формула урона изменена на мультипликативную: `floor((BaseDamage + TerrainBonus - DefenseModifier) × MoraleMultiplier)`; добавлена таблица MoraleMultiplier

### Консистентность
- SOURCE_OF_TRUTH обновлён до v4.1: MoneyMultiplier table, MoraleMultiplier как множитель, кибер-эффекты уточнены
- Устранена неоднозначность MoraleModifier (аддитивный → мультипликативный)
- Устранена недоопределённость MoneyMultiplier (добавлена таблица)
- Кибер-эффекты формализованы в отдельном файле с ссылками из Money_Model.md и Action_Points.md

---

## v4.0 — Phase 2 (Economy & Terrain)
Дата: 2026-03-01

### Новые канонические файлы
- `docs/04_economy/Money_Model.md` — полная формула MoneyPerTurn (базовый доход + добыча + магистраль + союзы + стабильность + осада + кибер)
- `docs/06_combat/Siege_Effects.md` — эффекты осады: -30% экономика/наука, +30% стоимость производства, -1 DefenseModifier
- `docs/07_units/Production_Rules.md` — 1 юнит/ход на интегрированный город, мгновенное появление, очередь глубиной 1

### Обновлённые файлы
- `docs/04_economy/Action_Points.md` — формализована формула ОД: база 5 + города + технологии + модификаторы (стабильность, магистраль, союзы, оккупация, кибер)
- `docs/04_economy/Stability_and_Morale.md` — уточнены штрафы (захват -2, потеря -4, столица -8, разрыв союза -2, оккупация -1/город), бунт при 0 стабильности
- `docs/05_tech/Tech_Progression.md` — SciencePerTurn формула, Research Boost (ConversionRate 0.5), связь с ОД и победой
- `docs/08_diplomacy/Diplomacy_and_Alliances.md` — лимит 2 союза, cooldown 3 хода, кибер = автовойна

### Патчи существующих файлов
- `docs/06_combat/Damage_and_Rules.md` — добавлен DefenseModifier: -1 если город под осадой (ссылка на Siege_Effects.md)
- `docs/06_combat/Siege_Air_Sea.md` — заменена дублирующая формулировка «-30% к производству» на ссылку на Siege_Effects.md
- `docs/02_cities/City_Levels.md` — добавлена секция «Производство юнитов» со ссылкой на Production_Rules.md
- `docs/04_economy/Resources.md` — уточнён тип выхода ресурсных клеток (Money/Science), условия запуска добычи, ссылки на Money_Model.md и Tech_Progression.md

### Консистентность
- SOURCE_OF_TRUTH обновлён до v4.0: добавлены секции Phase 2 (экономика, ОД, осада, стабильность, дипломатия, производство)
- Устранено дублирование определения осады между Siege_Air_Sea.md и Siege_Effects.md
- Формулы OD/Science/Money проверены на согласованность между файлами

---

## v3.0 — Phase 1 (integration)
Дата: 2026-03-01

### Победы
- Военная победа PvE: теперь ≥60% интегрированных городов (ранее: «захват всех столиц»)
- Экономическая победа: формализовано CityPower = сумма уровней; порог 75%; удержание 5 ходов
- Технологическая победа: таймер 10 ходов; сброс при захвате интегрированного города
- Победа альянса: лидер альянса — победитель; если лидер ИИ → игрок проигрывает

### Города
- Добавлена спецификация `docs/02_cities/` (City_Capture.md, City_Levels.md)
- Город = 1 клетка; интеграция = 4 хода (без изменений)
- Уровни городов: max 5, апгрейд за деньги (не ОД), стоимость: 100/200/350/550
- CityPower = сумма уровней интегрированных городов

### Технологии
- Расширена спецификация `Tech_Progression.md`: BaseCost(level) = 10 × level²
- Research Boost: ConversionRate = 0.5 (1 деньга → 0.5 науки, без лимита)
- SciencePerTurn = 5 + CityBonus + TechBonus + NetworkContribution

### AI
- Добавлена консолидированная спецификация `AI_Spec_v1_0.md`
- Определены все переменные скоринга (ProximityBonus, OpportunityScore, GrievanceScore и др.)
- Консолидированы Scoring_Model, Difficulty, Hidden_Civilization в один документ

### Консистентность
- Исправлено противоречие: «Capture all capitals» → ≥60% интегрированных городов
- SOURCE_OF_TRUTH обновлён до v3.0 с инвариантами Phase 1
- Scoring_Model.md: добавлена ссылка на AI_Spec_v1_0.md как полную спецификацию

### Удалённые файлы
- Удалены корневые legacy-файлы (01–07_*.md, RED_AGE_GDD.md, red_age_full_design_document_v_1_0.md)
- Удалена директория `docs/00_meta/legacy/`
- Единственный источник истины: `docs/`

---

## v2.6 (split)
- Разбивка спецификации на md-файлы для Cursor/Claude
- Добавлена web PvE UI/UX спецификация
- Near-future слой юнитов: дроны/гиперзвук/кибер
- Ограничения кибер-атаки на столицу и вокруг неё
- Ограничение гиперзвукового удара: 1/ход, не по столице
- Механика бунта при 0 стабильности: город становится нейтральным (без гарнизона)

Дата: 2026-03-01
