# Action Catalog (v4.28) — MVP

Канонический каталог действий игрока и соответствующих event types для replay-log.

Канон: `schemas/match.schema.json` (events[]), `docs/01_overview/Turn_Pipeline.md`.

---

## Event Fields (v4.28)

Каждый event — discriminated union по `event_type`. Общие поля (EventBase):

| Поле | Тип | Описание |
|------|-----|----------|
| `event_id` | string | Уникальный ID события |
| `round_index` | int | Номер раунда (инкремент после хода всех живых цивилизаций) |
| `civ_turn_index` | int | Плоский счётчик хода; то же, что `match.turn.turn_index` |
| `acting_civ_id` | int | ID цивилизации, совершившей действие (0..9) |
| `event_type` | string | Тип события (см. таблицы ниже) |
| `payload` | object | Специфичные данные (см. payload specs) |
| `seq` | int? | Порядок внутри хода цивилизации |
| `turn_index` | int? | Deprecated: использовать `civ_turn_index` |

Payload для каждого event_type строго типизирован в `schemas/match.schema.json` (additionalProperties: false).

---

## 1. UNIT ACTIONS

Требуют **1 действие на юнит** за ход (`has_acted_this_turn`). Канон: `docs/10_uiux/Unit_Actions.md`, `docs/01_overview/Turn_Pipeline.md` (PHASE 3).

| Действие | Условия | Тратит | Event Type |
|----------|---------|--------|------------|
| **Move** | Юнит не действовал, клетка достижима | 0 ОД (перемещение бесплатно) | MOVE |
| **Attack** | Юнит не действовал, враг в радиусе | 0 ОД | ATTACK |
| **Serial Attack** | Серийный юнит, убийство + соседняя цель | 0 ОД (часть одного действия) | SERIAL_ATTACK (на каждое убийство в цепочке) |
| **Heal** | CurrentHP < MaxHP | 1 ОД + действие юнита | HEAL |
| **Disband** | — | 0 ОД, возврат 50% AP cost | DISBAND |
| **Capture** | Юнит на клетке города без гарнизона | Результат атаки/перемещения | CAPTURE_CITY |
| **Cyber Disrupt** | Киберподразделение, город врага (не столица) | 1 ОД | CYBER_DISRUPT |
| **Cyber Damage Road** | Киберподразделение, дорога врага (не у столицы) | 1 ОД | CYBER_DAMAGE_ROAD |

### Payload specs (replay)

- **MOVE:** `{ unit_id, from_tile, to_tile }` — tile = index 0..6399
- **ATTACK:** `{ attacker_unit_id, target_unit_id, damage, target_remaining_hp }` — опционально: `counterattack_damage`, `attacker_destroyed`
- **SERIAL_ATTACK:** `{ attacker_unit_id, chain_index, target_unit_id, damage, target_destroyed }`
- **HEAL:** `{ unit_id, hp_before, hp_after }`
- **DISBAND:** `{ unit_id, ap_refund }`
- **CAPTURE_CITY:** `{ unit_id, city_id }` — опционально: `from_owner_civ_id`, `to_owner_civ_id`, `integration_turns_left`
- **CYBER_DISRUPT:** `{ unit_id, target_city_id }` — опционально: `disruption_turns` (2)
- **CYBER_DAMAGE_ROAD:** `{ unit_id, target_tile_index }` — опционально: `road_damaged_turns` (2)

---

## 2. CIV / PLAYER ACTIONS

Не требуют unit action slot. Выполняются в PHASE 3 (Action Phase).

| Действие | Условия | Тратит | Event Type |
|----------|---------|--------|------------|
| **Produce** | Интегрированный город, 1 юнит/ход/город | AP cost юнита | PRODUCE |
| **Build Road** | Economic L1, тайл в территории | 1 ОД + 25 денег | BUILD_ROAD |
| **Upgrade Road** | Economic L3 (L2), L5 (L3) | 1 ОД + 25 денег | UPGRADE_ROAD |
| **Build Bridge** | Как дорога на 1 WATER тайле | 2 ОД + 50 денег | BUILD_ROAD (road_level=1 на воде) |
| **Build Port** | Economic L2, WATER в территории города | 3 ОД + 200 денег | BUILD_PORT |
| **Upgrade Port** | Economic L5 для L3 | 2 ОД + 150 денег | UPGRADE_PORT |
| **Upgrade City** | City level up за деньги | Деньги (см. City_Levels) | UPGRADE_CITY |
| **Boost Science** | — | 1 ОД + деньги | BOOST_SCIENCE |
| **Boost Stability** | ≥1 интегрированный город, 1 раз/ход | 1 ОД + 50 или 100 денег | BOOST_STABILITY |
| **Start Harvest** | Тайл в территории интегрированного города | 1 ОД | START_HARVEST |
| **Repair Road** | DamagedRoad на тайле | 1 ОД | REPAIR_ROAD |
| **Tech Unlock** | Достаточно Science | Science cost | TECH_UNLOCK |
| **Declare War** | — | — | DECLARE_WAR |
| **Make Peace** | — | — | MAKE_PEACE |
| **Form Alliance** | — | — | FORM_ALLIANCE |
| **Break Alliance** | После 6 ходов, cooldown 3 | — | BREAK_ALLIANCE |

Канон: `docs/04_economy/Infrastructure_Costs.md`, `docs/04_economy/Action_Points.md`, `docs/05_tech/Tech_Progression.md`, `docs/08_diplomacy/Diplomacy_and_Alliances.md`, `docs/02_cities/City_Levels.md`.

### Payload specs (replay)

- **PRODUCE:** `{ city_id, unit_type_id, spawned_unit_id }`
- **BUILD_ROAD:** `{ tile_id, new_road_level }` — tile_id 0..6399
- **UPGRADE_ROAD:** `{ tile_id, new_road_level }` — опционально: `old_road_level`
- **BUILD_PORT:** `{ tile_id, new_port_level }`
- **UPGRADE_PORT:** `{ tile_id, new_port_level }` — опционально: `old_port_level`
- **UPGRADE_CITY:** `{ city_id, new_city_level, chosen_reward }` — reward: DEFENSE|EXPAND_TERRITORY|UNLOCK_PORT|SPECIALIZATION
- **BOOST_SCIENCE:** `{ money_spent, science_gained }` — опционально: `cap_used`
- **BOOST_STABILITY:** `{ money_spent, stability_gained }`
- **START_HARVEST:** `{ tile_id }`
- **REPAIR_ROAD:** `{ tile_id }`
- **TECH_UNLOCK:** `{ branch: "MILITARY"|"ECONOMIC"|"SCIENCE", level: 1..5 }`
- **DECLARE_WAR:** `{ from_civ_id, to_civ_id }`
- **MAKE_PEACE:** `{ from_civ_id, to_civ_id }`
- **FORM_ALLIANCE:** `{ from_civ_id, to_civ_id }`
- **BREAK_ALLIANCE:** `{ from_civ_id, to_civ_id }`

---

## 3. SYSTEM EVENTS

Генерируются системой, не действием игрока.

| Событие | Когда | Event Type |
|---------|-------|------------|
| **Rebellion** | Stability=0, 10% шанс/ход | REBELLION |
| **Elimination** | Цивилизация потеряла все города | ELIMINATION |
| **Victory Trigger** | Условие победы выполнено, таймер запущен | VICTORY_TRIGGER |
| **Victory Complete** | Таймер достиг порога | VICTORY_COMPLETE |
| **Hidden Civ Spawn** | После хода 20 | HIDDEN_CIV_SPAWN |

### Payload specs

- **REBELLION:** `{ city_id }` — опционально: `old_owner_civ_id`
- **ELIMINATION:** `{ civ_id }`
- **VICTORY_TRIGGER:** `{ victory_type, civ_id, turns_to_win }` — victory_type: MILITARY|ECONOMIC|TECH
- **VICTORY_COMPLETE:** `{ victory_type, civ_id }`
- **HIDDEN_CIV_SPAWN:** `{ civ_id, regions_count, cities_count }` — опционально: `city_ids`

---

## 4. Action → Event Type (таблица соответствия)

| Action | Event Type |
|--------|------------|
| Move | MOVE |
| Attack | ATTACK |
| Serial Attack (per kill) | SERIAL_ATTACK |
| Produce | PRODUCE |
| Build Road / Bridge | BUILD_ROAD |
| Upgrade Road | UPGRADE_ROAD |
| Build Port | BUILD_PORT |
| Upgrade Port | UPGRADE_PORT |
| Upgrade City | UPGRADE_CITY |
| Heal | HEAL |
| Disband | DISBAND |
| Capture City | CAPTURE_CITY |
| Cyber Disrupt | CYBER_DISRUPT |
| Cyber Damage Road | CYBER_DAMAGE_ROAD |
| Start Harvest | START_HARVEST |
| Repair Road | REPAIR_ROAD |
| Boost Science | BOOST_SCIENCE |
| Boost Stability | BOOST_STABILITY |
| Tech Unlock | TECH_UNLOCK |
| Declare War | DECLARE_WAR |
| Make Peace | MAKE_PEACE |
| Form Alliance | FORM_ALLIANCE |
| Break Alliance | BREAK_ALLIANCE |
| Rebellion (system) | REBELLION |
| Elimination (system) | ELIMINATION |
| Victory timer started | VICTORY_TRIGGER |
| Victory achieved | VICTORY_COMPLETE |
| Hidden Civ spawn | HIDDEN_CIV_SPAWN |
