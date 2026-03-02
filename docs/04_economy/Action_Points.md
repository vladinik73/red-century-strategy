# Очки Действия (ОД)

ОД — глобальный ресурс хода. Перемещение юнитов ОД не требует.

## На что тратятся ОД
- Производство юнитов
- Строительство дорог / мостов
- Строительство портов
- Активация технологий
- **Boost Science** — 1 ОД
  Конвертирует деньги в науку по правилу `docs/05_tech/Tech_Progression.md` (v4.15).
  Лимит за ход: `floor(SciencePerTurn × 2)`.
- **Boost Stability** — 1 ОД + деньги (50 или 100) (v4.21)
  Эффект: `Stability += 2` (за 50 Money) или `Stability += 5` (за 100 Money).
  Тип: действие цивилизации (не действие юнита).
  Ограничения: 1 раз за ход на цивилизацию (`StabilityBoostUsedThisTurn`); требует ≥1 интегрированного города.
  Связь с Turn Pipeline: PHASE 0 → сброс `StabilityBoostUsedThisTurn = false`; PHASE 3 → выполнение.

## Формула начисления ОД (за ход)
OD = 5 (база)
+ floor(Σ уровней интегрированных городов / 5)
+ floor(Количество технологий / 3)
+ StabilityModifier
+ NetworkModifier
+ AllianceModifier
- OccupationPenalty
- CyberPenalty

### Модификаторы
StabilityModifier:
- 80–100: +1
- 20–39: -1
- 0–19: -2

NetworkModifier = floor(NetworkBonus% / 10)

AllianceModifier = +1 (если активен союз)

OccupationPenalty = -1 за каждые 2 неинтегрированных города

CyberPenalty = -1 (если активен «Сбой» от киберподразделения, см. `docs/07_units/Cyber_Effects.md`)

## Неотыгранные ОД
- В асинхронном режиме (позже) неотыгранные ОД переносятся.
- В PvE: остаётся как внутренняя механика (можно включить перенос по решению продукта).
