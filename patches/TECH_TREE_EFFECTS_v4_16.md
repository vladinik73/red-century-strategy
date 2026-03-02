# Tech_Tree.md — Tech Effects (v4.16) — PATCH CONTENT

Вставь этот блок в `docs/05_tech/Tech_Tree.md` в конец файла (или в раздел «Эффекты технологий»),
как каноническое описание эффектов по веткам/уровням.  
Важно: **не ломай уже определённые эффекты** (например Science L2/L3, Military L2 для гор).
Если в файле уже есть совпадающая формулировка — оставь существующую, а **добавь только то, чего не хватает**.

---

## Tech Effects (v4.16)

Технологии сгруппированы по 3 веткам. Каждая ветка имеет уровни 1–5.
Эффекты применяются **глобально** для цивилизации сразу после покупки технологии.

### Ветка Наука (Science)

- **Science L1 — Knowledge Foundations**
  - `BaseScience` увеличивается на **+1** (в формуле `SciencePerTurn` это прибавка до любых множителей/бустов).
- **Science L2 — Research Efficiency**
  - `TechMultiplier = 1.10` (канон уже существует: +10% к науке).
- **Science L3 — Advanced Research**
  - `TechMultiplier = 1.20` (канон уже существует: +20% к науке).
- **Science L4 — Applied Science**
  - `Money → Science Boost` становится эффективнее: `ConversionRate = 0.60` (было 0.50).
  - Лимит буста за ход (cap) **не меняется**: `BoostScienceThisTurn ≤ floor(SciencePerTurn × 2)` (см. `Tech_Progression.md` v4.15).
- **Science L5 — Breakthrough**
  - Снижает таймер технологической победы: `TechVictoryHoldTurns = 8` (было 10).
  - Примечание: если таймер уже шёл по старому значению, он продолжает идти, но «hold turns» пересчитывается по новому правилу.

### Ветка Военная (Military)

- **Military L1 — Mobilization**
  - `CityDefense` максимального уровня повышается: `MaxCityDefenseLevel = 3` (было 2).
  - (Если в `City_Defense.md` уже описано иначе — синхронизируй, но итоговый максимум должен быть зафиксирован в одном месте.)
- **Military L2 — Mountain Warfare**
  - Канон: горы доступны (боевой бонус/штраф и требования технологии).
- **Military L3 — Siege Doctrine**
  - Осада сильнее бьёт по экономике осаждённого города:  
    `SiegeCityBonusMultiplier = 0.60` (было 0.70) — применяется к `CityBonus` и `MoneyPerTurn` **только** для осаждённого города.
- **Military L4 — Advanced Units**
  - Открывает продвинутые юниты: `Swarm` и `Cyber Unit` (если в `Advanced_Units.md` эти юниты уже существуют — здесь только фиксируем unlock-гейт).
- **Military L5 — Hypersonic**
  - Открывает `Hypersonic Missile` (канон правил гиперзвука остаётся в `Advanced_Units.md` и `SOURCE_OF_TRUTH.md`).

### Ветка Экономика/Сеть (Economy)

- **Economy L1 — Logistics**
  - `MaxNetworkBonus = 40%` (фиксация инварианта; если в `Network.md` уже есть — здесь просто повторить как часть tech-ветки).
- **Economy L2 — Road Engineering**
  - Стоимость строительства дорог снижается: `RoadMoneyCost × 0.9` и `RoadAPCost × 0.9` (округление вниз по деньгам и по ОД).
- **Economy L3 — Bridge Engineering**
  - Стоимость мостов снижается: `BridgeMoneyCost × 0.9` и `BridgeAPCost × 0.9` (округление вниз).
- **Economy L4 — Port Infrastructure**
  - Разрешает улучшение порта (Port Level 2), если порт построен.
- **Economy L5 — Trade Empire**
  - `MoneyPerTurn` получает глобальный множитель: `GlobalMoneyTechMultiplier = 1.10`.

---

### Примечания по приоритету канона

- Числовые константы стоимости дорог/мостов/портов — канон в `docs/04_economy/Infrastructure_Costs.md`.
- Формулы и лимиты буста — канон в `docs/05_tech/Tech_Progression.md` и в `docs/01_overview/Turn_Pipeline.md`.
- Правила осады — канон в `docs/06_combat/Siege_Effects.md`.
