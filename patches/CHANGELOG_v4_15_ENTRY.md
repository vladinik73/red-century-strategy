## v4.15 — Phase 4.8 (Boost Science cap + Capture Infrastructure + Serial vs City choice)

- **Money → Science Boost** (Action Phase):
  - Стоит **1 ОД**.
  - Конверсия: `AddedScience = floor(MoneySpent × 0.5)`.
  - Лимит за ход: `BoostScienceThisTurn ≤ floor(SciencePerTurn × 2)` (SciencePerTurn берётся из PHASE 1 этого хода, до бустов).
- **Capture: инфраструктура**:
  - При захвате города **территория переходит сразу**.
  - Дороги/мосты/порты в территории захваченного города переходят новому владельцу.
  - `DamagedRoad` таймер **не сбрасывается**.
  - До интеграции захваченный город **не даёт** доход/науку/NetworkBonus.
- **Serial Strike vs City**:
  - Если серийный юнит убивает последнего защитника города, игрок выбирает:
    - **Capture Now**: юнит занимает клетку города, город захватывается, цепочка **сразу заканчивается**;
    - **Continue Chain**: юнит занимает клетку города, **захват откладывается** до завершения цепочки (город захватывается только если цепочка завершилась и юнит остался на клетке города).

Канон обновлён в:
- `docs/05_tech/Tech_Progression.md`
- `docs/04_economy/Action_Points.md`
- `docs/01_overview/Turn_Pipeline.md`
- `docs/02_cities/City_Capture.md`
- `docs/06_combat/Veterancy_and_Serial.md`
- `docs/10_uiux/Unit_Interaction.md`
