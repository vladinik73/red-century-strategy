# Patch notes for SOURCE_OF_TRUTH (Phase 2.1 hotfix)

Дата: 2026-03-01

Внести следующие уточнения в `docs/00_meta/SOURCE_OF_TRUTH.md`:

1) В секции «Стабильность и мораль (Phase 2)» добавить:
- Стабильность влияет на доход денег по таблице (80–100 +5%, 60–79 0%, 40–59 -5%, 20–39 -10%, 0–19 -20%)
  Канон: `docs/04_economy/Stability_and_Morale.md`

2) В секции «Боёвка» / «MoraleModifier» уточнить, что мораль применяется как **множитель** (MoraleMultiplier), см. `docs/06_combat/Damage_and_Rules.md`.

3) В секции «ОД» / «Кибер» добавить, что «Сбой» может включать два параллельных эффекта:
- CyberPenalty = -1 OD
- CyberIncomeMultiplier = 0.8 (−20% MoneyPerTurn)
  Уточнение: `docs/07_units/Cyber_Effects.md`
