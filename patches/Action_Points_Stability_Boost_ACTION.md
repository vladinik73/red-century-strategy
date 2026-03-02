### Boost Stability (v4.21)

**Тип:** действие цивилизации (не действие юнита)  
**Стоимость:** 1 ОД + деньги (50 или 100)  
**Эффект:** `Stability += 2` (за 50 Money) или `Stability += 5` (за 100 Money)

**Ограничения:**
- 1 раз за ход на цивилизацию (`StabilityBoostUsedThisTurn`).
- Требует наличия хотя бы одного интегрированного города у цивилизации.
- Нельзя, если денег недостаточно.

**Связь с Turn Pipeline:**
- PHASE 0: `StabilityBoostUsedThisTurn = false`
- PHASE 3: выполнение действия устанавливает `StabilityBoostUsedThisTurn = true`
