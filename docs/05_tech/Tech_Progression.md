# Исследования и наука

## Общие правила
- Прогресс технологий идёт только через **Науку** (Science).
- Науку можно ускорять за **деньги** (Boost Science, с лимитом за ход — см. v4.15 ниже).
- Три ветки × 5 уровней = 15 технологий максимум.

## Стоимость изучения технологии

BaseCost(level) = 10 × level²

Итого:
| Уровень | BaseCost |
|---------|----------|
| 1       | 10       |
| 2       | 40       |
| 3       | 90       |
| 4       | 160      |
| 5       | 250      |

> Стоимость может корректироваться по результатам балансировки.

## Money → Science Boost (v4.15)

### Назначение
Позволяет конвертировать деньги в науку в Action Phase, но с жёстким лимитом за ход, чтобы избежать tech-rush.

### Правило (канон)
- Действие: **Boost Science**
- Стоимость: **1 ОД**
- Игрок выбирает `MoneySpent` (целое, ≥ 1), доступное по балансу денег.
- Начисляемая наука:
  - `AddedScience = floor(MoneySpent × 0.5)`
- В течение одного хода цивилизации действует лимит:
  - `BoostScienceThisTurn ≤ floor(SciencePerTurn × 2)`
  - `SciencePerTurn` берётся из **PHASE 1** текущего хода, **до** применения бустов.
- Действие можно повторять несколько раз за ход, пока не исчерпан лимит и есть деньги/ОД.

### UX (минимум)
- В UI отображать: `Boost used: X / Cap` в текущем ходу.
- Для действий стоимостью ≥ 3 ОД действует confirm (см. PROJECT_IDENTITY). Для Boost Science confirm не требуется (1 ОД), но можно показать soft-warning при попытке потратить >50% текущих денег.

## Прирост науки

SciencePerTurn = BaseScience
  + CityBonus
  + TechBonus
  + NetworkContribution

- **BaseScience** = 5
- **CityBonus** = Σ (уровень интегрированного города × 1) + ResearchCenterBonus
  - **ResearchCenterBonus** = +1 за каждый интегрированный город, если изучена Science L1 (Research Center)
- **TechBonus** = бонусы от научных технологий (Science L2: +10%, Science L3: +20%)
- **NetworkContribution** = floor(NetworkBonus% × 0.1)

### Осада
- Если город под осадой, его вклад в CityBonus снижается на 30% (×0.7). См. `docs/06_combat/Siege_Effects.md`.

## Связь с ОД (v4.24)
- floor(Количество изученных технологий / 3) добавляется к ОД за ход
- **Science L4 (Tech Acceleration):** дополнительно +1 ОД в формулу AP (см. `docs/04_economy/Action_Points.md`)

## Связь с боёвкой (v4.24)
- **Military L3 (Siege Tech):** +1 damage при атаке города (только когда цель — в городе)
- **Military L5 (Military Doctrine):** +1 global combat damage (применяется до MoraleMultiplier)
- См. `docs/06_combat/Damage_and_Rules.md`

## Связь с победой
- Изучение Science L5 (Tech Breakthrough) запускает таймер Технологической победы (10 ходов).

## Tech key format (v4.41)

`player.tech_unlocked` — массив строк. Формат ключа: `{branch}_{level}` (lowercase).

- Branch: `military` | `economic` | `science` (TECH_UNLOCK payload: MILITARY, ECONOMIC, SCIENCE).
- Пример: `["military_1", "science_2"]`.
- При emit TECH_UNLOCK `{ branch: "MILITARY", level: 1 }` → добавить в массив `"military_1"`.
