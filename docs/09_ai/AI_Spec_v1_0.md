# ИИ — Спецификация v1.0

Консолидированный документ AI-подсистемы. Объединяет скоринг, уровни сложности и скрытую цивилизацию.

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
