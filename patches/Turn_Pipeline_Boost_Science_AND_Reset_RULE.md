## Turn Pipeline — уточнения под Boost Science (v4.15)

В `docs/01_overview/Turn_Pipeline.md`:

1) **PHASE 0 (Start of Turn)**
- Обнулить счётчик: `BoostScienceThisTurn = 0`.

2) **PHASE 1 (Income)**
- Рассчитать `SciencePerTurn` по канону (до бустов).
- Зафиксировать значение `SciencePerTurn_ForBoostCap = SciencePerTurn` для лимита буста в этом ходу.

3) **PHASE 3 (Action Phase)**
- Разрешить действие **Boost Science (1 ОД)**, которое увеличивает Science, но не может превысить лимит:
  `BoostScienceThisTurn ≤ floor(SciencePerTurn_ForBoostCap × 2)`.
