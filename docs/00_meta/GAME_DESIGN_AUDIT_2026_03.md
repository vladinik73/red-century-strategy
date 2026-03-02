# Red Age — Full Game Design Audit (Read-Only)

**Дата:** 2026-03-02  
**Фокус:** Геймдизайн и продуктовая целостность (без tech/build/code)

---

## 1. Executive Summary

1. **Turn Pipeline** — Фазы 0–4 чётко заданы, порядок понятен, per-turn счётчики сбрасываются.
2. **Экономика** — Формулы Money, Science, AP, Stability полные и связаны между собой.
3. **Боёвка** — Формула урона, counter-attack (только melee), Serial Strike, Morale описаны.
4. **Видимость** — 2-state permanent reveal, LOS через горы, event-driven обновление.
5. **Победы** — Военная / Экономическая / Технологическая с приоритетом и таймерами.
6. **Hidden Civilization** — Появляется после хода 20, создаёт mid-game угрозу.
7. **Инфраструктура** — NetworkBonus, MoveBonus, DamagedRoad, порты описаны.
8. **Gap: Дипломатия** — Нет описания, как игрок заключает/разрывает союзы и объявляет войну/мир.
9. **Gap: Harvest** — 1 ОД за запуск добычи, но не указано, кто выполняет действие (юнит/город/игрок).
10. **Gap: Нейтральные города** — «Слабый гарнизон» не определён (числа, типы юнитов).
11. **Gap: Siege** — В Turn_Pipeline упомянут «таймер осады», в Siege_Effects его нет.
12. **Gap: Tech Victory** — Правило «город возвращён в 4 хода интеграции» требует уточнения для реализации.
13. **City Specialization** — TBD, сейчас заглушка.
14. **Snowball** — Есть (города → доход → технологии → юниты), частично компенсируется Hidden Civ.
15. **MVP Player Journey** — Цепочка экранов и flow описаны.

---

## 2. Таблица P0 / P1 / P2

| Приоритет | Блок | Описание | Документ |
|-----------|------|----------|----------|
| **P0** | Дипломатия (игрок) | Как игрок заключает/разрывает союз, объявляет войну/мир | `Diplomacy_and_Alliances.md` |
| **P0** | Harvest action | Кто выполняет «запуск добычи» (юнит/город/глобальное действие) | `Resources.md`, `Action_Points.md` |
| **P0** | Нейтральные города | Определение «слабого гарнизона» (число и тип юнитов) | `City_Capture.md`, `Map_Generation.md` |
| **P1** | Siege timer | Уточнить «таймер осады» в Turn_Pipeline | `Turn_Pipeline.md` |
| **P1** | Tech Victory return | Точное правило «город возвращён в 4 хода интеграции» | `Victory_Rules.md` |
| **P1** | City Defense | Связь Defense Level 1/2 с DefenseModifier (+2/+3) | `Damage_and_Rules.md`, `City_Defense.md` |
| **P2** | City Specialization | Механика специализации городов | `City_Levels.md` |
| **P2** | First contact | Гарантия «первые столкновения до 20 хода» (цель vs жёсткое правило) | `Map_Generation.md` |

---

## 3. Таблица Exploit Risk

| Механика | Риск | Комментарий |
|----------|------|-------------|
| Disband 50% refund | **Medium** | Build → Move → Disband даёт «аренду» юнита. Scout: 2 AP → 1 AP refund = 1 AP за разведку. Похоже на осознанный trade-off, но стоит проверить в игре. |
| Boost Science | **Low** | Лимит floor(SciencePerTurn × 2) ограничивает tech rush. |
| Stability Boost | **Low** | 1 раз за ход, 50/100 денег. При Stability 0 нужны большие вложения. |
| Serial Strike | **Low** | SerialKillCap=5, DamageMultiplier=0.85, Capture Now vs Continue Chain — эксплойты закрыты. |
| Hypersonic | **Low** | 1/ход, нельзя столицу/корабли, нужна видимость. |
| Heal | **Low** | 1 действие юнита, +3 HP, 1 ОД. Нет бесконечного хилла. |
| Roads MoveBonus | **Medium** | До +3 Move при старте с дороги. Сильный бонус, но дороги стоят 1 AP + 25 денег за тайл. |
| Economic Victory (alliance) | **Low** | Города союзников не считаются (v4.3). |
| Tech Victory city return | **Low** | Edge case, но не даёт очевидного эксплойта. |

---

## 4. Таблица Balance Risk

| Механика | Риск | Комментарий |
|----------|------|-------------|
| Snowball | **High** | Больше городов → больше дохода/науки/ОД. Hidden Civ и агрессия ИИ частично компенсируют. |
| Turtle | **Medium** | Возможна, но военная победа 60% и экономическая 75% CityPower делают чистый turtle слабым. |
| Tech rush | **Low** | Boost Science ограничен, BaseCost растёт (L5 = 250). |
| Permanent reveal | **Low** | Работает как задумано, нет fog-of-war. |
| Roads dominance | **Medium** | MoveBonus до +3 заметен. NetworkBonus cap 40% ограничивает. |
| Hypersonic strength | **Medium** | 7 урона, игнорирует terrain, но 1/ход и нельзя столицу. Нужна проверка в игре. |
| Stability Boost | **Low** | 1/ход, 50/100 денег. Не выглядит перегруженным. |
| Disband AP economy | **Low** | 50% refund, 1 действие юнита. Нет очевидного AP-эксплойта. |
| «1 действие на юнит» | **Low** | Move/Attack/Heal/Disband/Special — один выбор. Exploit loops не видны. |

---

## 5. Таблица Missing Systems

| Система | Статус | Что нужно |
|---------|--------|-----------|
| Дипломатия (игрок) | **Отсутствует** | Как предложить/принять/разорвать союз, объявить войну/мир. |
| Harvest actor | **Неясно** | Кто тратит 1 ОД: юнит, город или глобальное действие. |
| Нейтральный гарнизон | **Не описано** | «Слабый гарнизон» — сколько юнитов, какие типы. |
| City Specialization | **TBD** | Заглушка в City_Levels. |
| Siege timer | **Противоречие** | Turn_Pipeline говорит о таймере, Siege_Effects — нет. |
| Tech Victory return | **Неоднозначно** | Точный момент сброса таймера при возврате города. |
| First contact | **Цель, не правило** | «До 20 хода» — рекомендация генерации, не гарантия. |
| AI alliance logic | **Частично** | AI_Spec даёт AllyScore/BreakScore, но нет player-facing flow. |

---

## 6. Часть A — Механическая целостность (детали)

### 1. Turn Pipeline
- Фазы 0–4 чётко заданы, порядок: timers → rebellion → income → AP → actions → victory.
- Per-turn счётчики: BoostScienceThisTurn, StabilityBoostUsedThisTurn, HasActedThisTurn.
- **Проблема:** «SiegeState (таймер если применяется)» — в Siege_Effects таймера нет, осада = враг рядом.

### 2. Экономика
- Money: CityBaseIncome + HarvestIncome, множители (Network, Alliance, Stability, Siege, Cyber).
- Science: BaseScience + CityBonus + TechBonus + NetworkContribution.
- AP: 5 + floor(cities/5) + floor(tech/3) + модификаторы.
- Stability: 0–100, +1/ход, штрафы за захват/потерю городов.
- **Проблема:** Harvest — 1 ОД, но не указан исполнитель (юнит/город/глобальное действие).

### 3. Боёвка
- Damage = floor((Base + TerrainBonus - DefenseModifier) × MoraleMultiplier), min 1.
- Counter-attack только при melee (Range=1) и если защитник выжил.
- Serial: SerialKillCap=5, DamageMultiplierPerKill=0.85.
- **Проблема:** City Defense Level 1 = +2, Level 2 = +3; в Damage_and_Rules указано «+2 в укреплённом городе» — нужна явная связь с уровнями.

### 4. Территории
- TerritoryRadius 1–5, Chebyshev, MaxTerritoryRadius=5.
- Конфликты: разные цивилизации не пересекаются, одна цивилизация — объединение.
- При расширении в чужую территорию — предупреждение, без захвата.

### 5. Видимость
- 2-state (UNEXPLORED/VISIBLE), permanent reveal.
- Обновление: spawn, move, capture.
- Горы: cost=2, юнит на горе +1 visibility.
- Альянсы делят видимость.

### 6. Дипломатия
- Ограничения: max 2 союза, 6 ходов минимум, 3 хода cooldown.
- **Проблема:** Нет описания, как игрок заключает/разрывает союзы и объявляет войну/мир.

### 7. Победы
- Военная: ≥60% городов.
- Экономическая: ≥75% GlobalCityPower, 5 ходов удержания.
- Технологическая: L5 науки, 10 ходов, сброс при захвате интегрированного города.
- **Проблема:** «Город возвращён в 4 хода интеграции — таймер не сбрасывается» — нужно уточнить для реализации.

### 8. Hidden Civilization
- Появляется после хода 20, 1–3 региона, 2–3 города, сразу интегрированы.
- Более агрессивная, пороги атаки −15.

### 9. Neutral Cities
- Часть городов нейтральны, «без гарнизона или со слабым гарнизоном».
- **Проблема:** «Слабый гарнизон» не определён.

### 10. Infrastructure
- NetworkBonus% до 40%, MoveBonus = RoadLevel.
- DamagedRoad 2 хода, восстановление 1 ОД.
- Порты L1–L3, стоимость и ограничения заданы.

---

## 7. Часть B — Баланс и динамика

- **Snowball:** Есть (города → доход → технологии → юниты). Hidden Civ и агрессия ИИ частично сдерживают.
- **Turtle:** Возможна, но военная и экономическая победы делают её слабой стратегией.
- **Tech rush:** Ограничен Boost Science и ростом стоимости технологий.
- **Permanent reveal:** Работает как задумано.
- **Roads:** MoveBonus до +3 силён, но есть стоимость и Network cap.
- **Hypersonic:** Сильный, но 1/ход и ограничения по целям.
- **Stability Boost:** Умеренный, 1/ход.
- **Disband:** 50% refund, trade-off за «аренду» юнита.
- **«1 действие на юнит»:** Ясное ограничение, exploit loops не видны.

---

## 8. Часть C — Продуктовая целостность

- **MVP:** Цепочка экранов (Home → New Game → Loading → Main Game → Victory/Defeat) описана.
- **Player journey:** Понятен (New Game, Continue, Autosave).
- **Мотивация:** Победа через военную/экономическую/технологическую ветку.
- **Mid-game tension:** Hidden Civ, первый контакт ~20 ход.
- **End-game stall:** Таймеры побед (5/10 ходов) задают финал.
- **Catch-up:** Нет явных механик (стабильность/мораль дают частичную компенсацию).
- **Доминирующая стратегия:** Неочевидна; нужна проверка в игре.

---

## 9. Вердикт

| Вопрос | Ответ |
|--------|-------|
| **READY for MVP Design Freeze?** | **NO** — P0-блоки (дипломатия игрока, harvest actor, нейтральный гарнизон) не закрыты. |
| **Можно ли начинать AI-дизайн?** | **YES** — AI_Spec, LeaderIndex, пороги атаки, Hidden Civ заданы. Player-facing дипломатия не блокирует. |
| **Можно ли начинать engine skeleton?** | **YES с оговорками** — Core loop (Turn Pipeline, экономика, бой, видимость, победы) реализуем. Harvest и нейтральные города потребуют временных решений до уточнения. |

---

## 10. Рекомендуемые следующие шаги

1. **P0:** Описать в `Diplomacy_and_Alliances.md` player flow: предложение/принятие/разрыв союза, объявление войны/мира.
2. **P0:** В `Resources.md` и `Action_Points.md` указать, кто выполняет harvest (рекомендация: глобальное действие игрока, без юнита).
3. **P0:** В `City_Capture.md` или `Map_Generation.md` задать нейтральный гарнизон (например: 0 юнитов) — **закрыто v4.23**.
4. **P1:** Уточнить в Turn_Pipeline «таймер осады» или убрать упоминание.
5. **P1:** В Victory_Rules детализировать правило «город возвращён в 4 хода интеграции» для реализации.
