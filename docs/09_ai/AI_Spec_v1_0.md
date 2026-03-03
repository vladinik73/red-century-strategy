# ИИ — Спецификация v1.0

Консолидированный документ AI-подсистемы. Объединяет скоринг, уровни сложности и скрытую цивилизацию.

---

## AI Turn Execution (MVP) (v4.33)

Канон: `docs/01_overview/Turn_Pipeline.md`, `docs/01_overview/Action_Catalog.md`, `docs/04_economy/Action_Points.md`. Инварианты: **1 действие на юнит** (`has_acted_this_turn`), эмиссия событий в `events[]` по типам из Action_Catalog, AP costs по Infrastructure_Costs.

### Inputs
- `match` — полное состояние партии (match.schema)
- `player_id` — ID цивилизации, чей ход
- `available_AP` — текущие ОД (из match/player)
- `known_enemies` — цивилизации в WAR (из match.diplomacy.relations)
- `goals` — целевые EnemyScore/ThreatScore для атаки (пороги по сложности, см. §4)

### Step-by-step loop (pseudocode)

```
1. DIPLOMACY PHASE
   - For each NEUTRAL civ: compute EnemyScore; if EnemyScore >= AttackThreshold → DECLARE_WAR (emit DECLARE_WAR event)
   - For each WAR civ: compute WarScore; if WarScore < PeaceThreshold → MAKE_PEACE (emit MAKE_PEACE event)
   - For each potential ally: compute AllyScore; if AllyScore >= FormThreshold AND alliances < 2 → FORM_ALLIANCE (emit FORM_ALLIANCE)
   - For each ally: compute BreakScore; if BreakScore >= BreakThreshold AND min_alliance_turns_left == 0 → BREAK_ALLIANCE (emit BREAK_ALLIANCE)
   - Tie-break: stable sort by player_id string

2. STRATEGIC OBJECTIVES
   - Compute ThreatScore for each enemy; identify primary threat
   - Choose objective set: { DEFEND_CAPITAL | CAPTURE_CITY | DISRUPT_ROADS | TECH_PUSH }
   - DEFEND_CAPITAL if capital threatened (enemy units adjacent)
   - CAPTURE_CITY if CityPriority high and EnemyScore >= threshold
   - DISRUPT_ROADS if cyber unit available and enemy network valuable
   - TECH_PUSH if science lead and tech victory viable

3. AP BUDGET ALLOCATION (priority order)
   - emergency_defense: if DEFEND_CAPITAL, produce units in threatened cities (cost: unit ap_cost per produce)
   - economy: if safe, BUILD_ROAD / BUILD_PORT / UPGRADE_ROAD / UPGRADE_PORT (costs per Infrastructure_Costs)
   - boost: if conditions met, BOOST_SCIENCE (1 AP) or BOOST_STABILITY (1 AP + money)
   - Reserve AP for tactical phase (movement free; attacks free; heal 1 AP; cyber 1 AP)
   - Apply difficulty modifier to AP usage (Easy 75%, Normal 92%, Hard 98%, God 100%)

4. TACTICAL PHASE
   - units_to_act = filter(units, owner_player_id == player_id AND has_acted_this_turn == false)
   - Sort units_to_act by stable order (e.g. unit_id lexicographic)
   - For each unit in units_to_act:
     a) If HEAL eligible (hp < max_hp) and AP >= 1 and heal valuable → HEAL (emit HEAL, set has_acted_this_turn = true)
     b) Else if DISBAND valuable (low hp, refund useful) → DISBAND (emit DISBAND)
     c) Else: choose target (enemy unit or city) using EnemyScore/CityPriority; pathfind; MOVE to reach (emit MOVE)
     d) If adjacent to enemy and attack valuable → ATTACK (emit ATTACK); respect 1 action per unit
     e) If cyber unit and DISRUPT_ROADS objective: CYBER_DAMAGE_ROAD (1 AP, emit CYBER_DAMAGE_ROAD) if valuable tile
     f) Else if cyber unit and city target: CYBER_DISRUPT (1 AP, emit CYBER_DISRUPT) if city not capital
     g) Set has_acted_this_turn = true after action
   - Respect max attacks per turn (Easy 3, Normal 5, Hard 7, God 9)

5. END TURN
   - Emit all queued events to match.events[] (EventBase: event_id, round_index, civ_turn_index, acting_player_id, event_type, payload)
   - Ensure invariants: no unit with has_acted_this_turn == false remains with valid action
   - Pass turn to next player_id in turn_order
```

### Deterministic tie-break rules
- Unit action order: sort by `unit_id` string ascending
- Target choice: if multiple equal EnemyScore, choose by `city_id` or `unit_id` ascending
- Diplomacy order: sort civs by `player_id` ascending before evaluating
- Tile choice (road/port): sort by tile index ascending

---

## 1. LeaderIndex

LeaderIndex =
  0.4 × Military
  + 0.35 × Economy
  + 0.25 × Progress

### Military
Military =
  0.6 × (Доля интегрированных городов)
  + 0.4 × (Сила армии)

- **Доля интегрированных городов** = кол-во интегрированных городов цивилизации / общее кол-во городов на карте × 100
- **Сила армии** = Σ HP всех юнитов цивилизации / максимально возможная суммарная HP (нормализовано 0–100)

### Economy
Economy =
  0.7 × (Доля суммарных уровней городов)
  + 0.3 × (NetworkBonus%)

- **Доля суммарных уровней городов** = Σ уровней интегрированных городов цивилизации / Σ уровней всех городов на карте × 100
- **NetworkBonus%** — текущий бонус магистрали цивилизации (0–40, см. Network.md)

### Progress
Progress =
  0.5 × (Уровень научной ветки / 5 × 100)
  + 0.3 × (Общий уровень технологий / 15 × 100)
  + 0.2 × (Прогресс тех-таймера)

- **Уровень научной ветки** — максимальный изученный уровень в Научной ветке (0–5)
- **Общий уровень технологий** — сумма уровней во всех 3 ветках (0–15)
- **Прогресс тех-таймера** — если таймер технологической победы активен: (10 - оставшиеся ходы) / 10 × 100; иначе 0

---

## 2. Определения переменных скоринга

### ProximityBonus (для ThreatScore)
ProximityBonus = max(0, 20 - MinDistanceToMyCity × 2)

- **MinDistanceToMyCity** — расстояние в клетках от ближайшего города оцениваемой цивилизации до ближайшего своего города
- Диапазон: 0–20

### ProximityScore (для EnemyScore)
ProximityScore = max(0, 100 - MinDistanceToBorder × 5)

- **MinDistanceToBorder** — расстояние от границы территории врага до своей территории
- Диапазон: 0–100

### OpportunityScore
OpportunityScore =
  40 × (1 - EnemyArmyStrength / MyArmyStrength)
  + 30 × (UndefendedCities / EnemyTotalCities)
  + 30 × (1 - EnemyStability / 100)

- Учитывает: соотношение армий, долю незащищённых городов, нестабильность врага
- Диапазон: 0–100

### GrievanceScore
GrievanceScore = min(100, Σ событий × вес)

События и веса:
- Война против меня: +30
- Захват моего города: +20
- Кибератака на мой город: +10
- Разрыв союза: +15
- Затухание: -5/ход

### Revenge
Revenge = min(100, GrievanceScore × 1.2)

- Усиленная версия GrievanceScore для контекста войны
- Диапазон: 0–100

### BenefitScore (для AllyScore)
BenefitScore =
  50 × (SharedBorderLength / MaxBorderLength)
  + 30 × (ComplementaryStrength)
  + 20 × (TradeValue)

- **SharedBorderLength** — длина общей границы (нормализовано)
- **ComplementaryStrength** — насколько союзник компенсирует слабости (0–1)
- **TradeValue** — экономическая выгода от сотрудничества (0–1)
- Диапазон: 0–100

### RelationScore (для AllyScore)
RelationScore = BaseRelation + Σ дипломатических модификаторов

- **BaseRelation** = 50 (нейтральный старт)
- Модификаторы: общий враг (+20), торговля (+10), война (-40), кибератака (-20)
- Диапазон: 0–100

### AntiLeaderNeed (для AllyScore)
AntiLeaderNeed = max(0, LeaderIndex_лидера - MyLeaderIndex - 15) × 2

- Активируется когда лидер существенно опережает
- Диапазон: 0–100

### BetrayalGain (для BreakScore)
BetrayalGain =
  40 × (AllyWeakCities / AllyTotalCities)
  + 30 × (AllyResourceValue)
  + 30 × (VictoryProximityGain)

- Оценивает потенциальную выгоду от предательства союзника
- Диапазон: 0–100

### OpportunityElsewhere (для BreakScore)
OpportunityElsewhere = max(OpportunityScore по всем НЕ-союзным целям)

- Лучшая возможность атаки вне текущего союза
- Диапазон: 0–100

---

## 3. Формулы оценки

### ThreatScore
ThreatScore = LeaderIndex + ProximityBonus

### EnemyScore
EnemyScore =
  0.45 × ThreatScore
  + 0.25 × ProximityScore
  + 0.20 × OpportunityScore
  + 0.10 × GrievanceScore

### CityPriority
CityPriority =
  30 × CapitalFlag
  + 20 × NetworkNodeValue
  + 20 × VictoryDenialValue
  + 15 × WeakDefenseValue
  + 15 × StrategicPositionValue

- **CapitalFlag** — 1 если город-столица, иначе 0
- **NetworkNodeValue** — важность города в магистрали (0–1): кол-во маршрутов через город / макс. маршрутов
- **VictoryDenialValue** — насколько захват лишает врага прогресса к победе (0–1)
- **WeakDefenseValue** — (1 - DefenseStrength / MaxDefense) (0–1)
- **StrategicPositionValue** — географическое преимущество: перешеек, порт, центральная позиция (0–1)

### WarScore
WarScore =
  0.55 × OpportunityScore
  + 0.25 × max(0, ThreatScore - 50)
  + 0.20 × Revenge

### AllyScore
AllyScore =
  0.45 × BenefitScore
  + 0.25 × RelationScore
  + 0.30 × AntiLeaderNeed

### BreakScore
BreakScore =
  0.5 × BetrayalGain
  + 0.3 × ThreatScore
  + 0.2 × OpportunityElsewhere

---

## 4. Пороги атаки по сложности

| Сложность | Порог EnemyScore | Примечание |
|-----------|-----------------|------------|
| Easy      | 70              |            |
| Normal    | 55              |            |
| Hard      | 45              |            |
| God       | 35              | 30 при стратегической цели |

---

## 5. Уровни сложности

В партии все боты одного уровня сложности.

### Лёгкий
- Экономика ×0.85, ОД ×0.85, Мораль -10%
- Использует 75% ОД
- Макс 3 атаки/ход
- Приоритет нападения на ИИ выше, чем на игрока

### Средний
- Без модификаторов
- Использует 92% ОД
- Макс 5 атак/ход

### Сложный
- Экономика ×1.10, ОД ×1.10, Мораль +5%
- Использует 98% ОД
- Макс 7 атак/ход

### Бог
- Экономика как Сложный
- Использует 100% ОД
- Макс 9 атак/ход
- Более агрессивные пороги войны (см. таблицу выше)

---

## 6. Скрытая цивилизация (AI-only)

### Правила появления
- Может появиться после **20-го хода**
- Появляется в 1–3 регионах
- Получает 2–3 нейтральных города (сразу интегрированных)
- Повышенная агрессия (пороги атаки на 15 ниже стандартных для текущей сложности)
- Может победить

### Назначение
- Mid/late-game угроза: ломает устоявшиеся фронты
- Наказывает жадный макро-рост без армии
