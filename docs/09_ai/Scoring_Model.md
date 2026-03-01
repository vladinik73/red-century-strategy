# ИИ — математическая модель (скоры)

> **Примечание**: полная спецификация AI с определениями всех переменных — в `AI_Spec_v1_0.md`. Этот файл сохранён как краткая справка.

## LeaderIndex
LeaderIndex =
0.4 * Military
+ 0.35 * Economy
+ 0.25 * Progress

### Military
Military =
0.6 * (Доля интегрированных городов)
+ 0.4 * (Сила армии)

### Economy
Economy =
0.7 * (Доля суммарных уровней городов)
+ 0.3 * (NetworkBonus%)

### Progress
Progress =
0.5 * (Уровень научной ветки / 5 * 100)
+ 0.3 * (Общий уровень технологий / 15 * 100)
+ 0.2 * (Прогресс тех-таймера)

## ThreatScore
ThreatScore = LeaderIndex + ProximityBonus

## EnemyScore
EnemyScore =
0.45 * ThreatScore
+ 0.25 * ProximityScore
+ 0.20 * OpportunityScore
+ 0.10 * GrievanceScore

## Пороги атаки по сложности
- Easy: 70
- Normal: 55
- Hard: 45
- God: 35 (30 при стратегической цели)

## CityPriority
CityPriority =
30 * CapitalFlag
+ 20 * NetworkNodeValue
+ 20 * VictoryDenialValue
+ 15 * WeakDefenseValue
+ 15 * StrategicPositionValue

## WarScore
WarScore =
0.55 * OpportunityScore
+ 0.25 * max(0, ThreatScore-50)
+ 0.20 * Revenge

## AllyScore
AllyScore =
0.45 * BenefitScore
+ 0.25 * RelationScore
+ 0.30 * AntiLeaderNeed

## BreakScore
BreakScore =
0.5 * BetrayalGain
+ 0.3 * ThreatScore
+ 0.2 * OpportunityElsewhere
