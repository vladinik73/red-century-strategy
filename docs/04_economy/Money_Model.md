# Деньги — модель дохода (Phase 2, канон)

Дата обновления: 2026-03-01

## Определения
- MoneyPerTurn — деньги, получаемые цивилизацией в начале своего хода.
- Доход считается только от интегрированных городов (неинтегрированные города доход не дают).

## 1) Базовый доход от городов
Для каждого интегрированного города:

```
CityBaseIncome = city_level
```

## 2) Доход от добычи на клетках
Ресурсные клетки имеют тип добычи. Доход от добычи денег в ход:

```
HarvestIncome = Σ MoneyYield(tile)
```

Правила добычи:
- Добыча запускается один раз на клетке (см. `docs/04_economy/Resources.md`).
- Пока ресурс не исчерпан: клетка даёт 2 ед/ход.
- После исчерпания: клетка даёт 1 ед/ход (низкая продуктивность, бесконечно).

## 3) Бонус магистрали (NetworkBonus)
Применение:
```
NetworkMultiplier = 1 + NetworkBonus% / 100
```

## 4) Бонус союза
```
AllianceMultiplier = 1 + min(10, 5 * ActiveAlliancesCount) / 100
```

## 5) Стабильность
Стабильность даёт `MoneyMultiplier` по таблице из `docs/04_economy/Stability_and_Morale.md`:

```
StabilityMultiplier = 1 + MoneyMultiplier / 100
```

Пример: стабильность 85 → MoneyMultiplier = +5% → StabilityMultiplier = 1.05

## 6) Осада (-30%)
Если город под осадой, его вклад в доход снижается:
- CityBaseIncome ×0.7
- добыча денег на клетках территории этого города ×0.7

## 7) Кибер-дебафф (-20% доход)
Если активен эффект киберподразделения «Сбой» (см. `docs/07_units/Cyber_Effects.md`), применяется:
```
CyberIncomeMultiplier = 0.8
```
на срок эффекта.

## Итоговая формула

```
MoneyPerTurn =
floor(
  (
    Σ CityBaseIncome (с учётом осады)
    + HarvestIncome (с учётом осады по территориям)
  )
  × NetworkMultiplier
  × AllianceMultiplier
  × StabilityMultiplier
  × CyberIncomeMultiplier
)
```

Округление: floor в конце.
