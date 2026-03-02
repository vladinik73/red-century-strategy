# Технологии (v4.24) — полное дерево эффектов

Технологии глобальны и не контрят друг друга напрямую. Три ветки × 5 уровней = 15 технологий.

Канон стоимости: `BaseCost(level) = 10 × level²` (см. `docs/05_tech/Tech_Progression.md`).

---

## Военная ветка

### L1 — Infantry Improvement (Улучшение пехоты)
- **Unlock:** Heavy Infantry (Тяжёлая пехота)
- **Эффект:** Разблокирует производство юнита Heavy Infantry.
- **Когда применяется:** При производстве юнитов в интегрированном городе.
- **Связь:** `docs/07_units/Base_Units.md`

**Heavy Infantry (Тяжёлая пехота):**
- HP 12 / Damage 3 / Range 1 / Move 1 / Cost 3 ОД / Sight 1

---

### L2 — Mountain Access (Доступ к горам)
- **Unlock:** Доступ наземных юнитов к тайлам MOUNTAIN.
- **Эффект:** До исследования наземные юниты **не могут** входить на MOUNTAIN. После исследования — могут (MoveCost=2 сохраняется по `docs/03_map/Map_Generation.md`).
- **Когда применяется:** При перемещении юнитов.
- **Связь:** `docs/03_map/Map_Generation.md`, `docs/07_units/Base_Units.md`

---

### L3 — Siege Tech (Осадные технологии)
- **Bonus:** +1 damage при атаке города.
- **Эффект:** Если цель атаки — юнит в городе или сам город (клетка города), к BaseDamage добавляется +1.
- **Когда применяется:** При расчёте урона атаки по цели в городе.
- **Связь:** `docs/06_combat/Damage_and_Rules.md`

---

### L4 — Elite Warfare (Элитные войска)
- **Unlock:** Advanced Units + Hypersonic.
- **Эффект:** Разблокирует производство продвинутых юнитов (Киберподразделение, Рой дронов, Гиперзвуковая ракета).
- **Когда применяется:** При производстве юнитов.
- **Связь:** `docs/07_units/Advanced_Units.md`

---

### L5 — Military Doctrine (Военная доктрина)
- **Bonus:** +1 global combat damage.
- **Эффект:** +1 к урону всех боевых атак цивилизации. Применяется **до** MoraleMultiplier.
- **Когда применяется:** При расчёте урона любой атаки.
- **Связь:** `docs/06_combat/Damage_and_Rules.md`

---

## Экономическая ветка

### L1 — Roads I (Дороги I)
- **Unlock:** Строительство дорог.
- **Эффект:** Разблокирует возможность строить дороги (Road L1). Без этой технологии дороги строить нельзя.
- **Когда применяется:** В Action Phase при действии «строительство дороги».
- **Связь:** `docs/04_economy/Infrastructure_Costs.md`, `docs/04_economy/Network.md`

---

### L2 — Ports (Порты)
- **Unlock:** Строительство портов.
- **Эффект:** Разблокирует возможность строить порты (Port L1). Без этой технологии порты строить нельзя.
- **Когда применяется:** В Action Phase при действии «строительство порта».
- **Связь:** `docs/04_economy/Infrastructure_Costs.md`, `docs/06_combat/Siege_Air_Sea.md`

---

### L3 — Roads II (Дороги II)
- **Unlock:** Road Level 2.
- **Эффект:** Разблокирует апгрейд дорог до L2 (и строительство новых дорог сразу L2). Без этой технологии максимум Road L1.
- **Когда применяется:** При строительстве/апгрейде дорог.
- **Связь:** `docs/04_economy/Network.md`, `docs/04_economy/Infrastructure_Costs.md`

---

### L4 — Logistics (Магистральная логистика)
- **Bonus:** +5% Money (через MoneyMultiplier).
- **Эффект:** `LogisticsMultiplier = 1.05` — применяется к итоговому доходу денег.
- **Когда применяется:** При расчёте MoneyPerTurn в PHASE 1.
- **Связь:** `docs/04_economy/Money_Model.md`

---

### L5 — Infrastructure Maximum (Инфраструктурный максимум)
- **Unlock:** Road Level 3 + Port Level 3.
- **Эффект:** Разблокирует апгрейд дорог до L3 и портов до L3. Без этой технологии максимум Road L2, Port L2.
- **Когда применяется:** При строительстве/апгрейде дорог и портов.
- **Связь:** `docs/04_economy/Network.md`, `docs/04_economy/Infrastructure_Costs.md`

---

## Научная ветка

### L1 — Research Center (Исследовательский центр)
- **Bonus:** +1 Science per integrated city.
- **Эффект:** К CityBonus добавляется +1 за каждый интегрированный город (в дополнение к `уровень города × 1`).
- **Когда применяется:** При расчёте SciencePerTurn в PHASE 1.
- **Связь:** `docs/05_tech/Tech_Progression.md`

---

### L2 — Science Boost I (+10% Science)
- **Bonus:** +10% Science.
- **Эффект:** TechBonus = +10% к базовому приросту науки.
- **Когда применяется:** При расчёте SciencePerTurn в PHASE 1.
- **Связь:** `docs/05_tech/Tech_Progression.md`

---

### L3 — Science Boost II (+20% Science)
- **Bonus:** +20% Science.
- **Эффект:** TechBonus = +20% к базовому приросту науки (заменяет/дополняет L2 по правилам Tech_Progression).
- **Когда применяется:** При расчёте SciencePerTurn в PHASE 1.
- **Связь:** `docs/05_tech/Tech_Progression.md`

---

### L4 — Tech Acceleration (Ускорение технологий)
- **Bonus:** +1 AP.
- **Эффект:** +1 ОД добавляется в формулу начисления ОД за ход.
- **Когда применяется:** При расчёте AP в PHASE 2 (Action Points formula).
- **Связь:** `docs/04_economy/Action_Points.md`, `docs/05_tech/Tech_Progression.md`

---

### L5 — Tech Breakthrough (Технологический прорыв)
- **Unlock:** Запускает таймер Технологической победы.
- **Эффект:** Запускает 10-ходовой таймер Технологической победы. При достижении порога — победа.
- **Когда применяется:** В PHASE 4 (End of Turn) при проверке побед.
- **Связь:** `docs/08_diplomacy/Victory_Rules.md`, `docs/05_tech/Tech_Progression.md`
