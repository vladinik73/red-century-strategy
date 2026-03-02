#### 0.X Reset per-turn counters (добавление, v4.21)
- `StabilityBoostUsedThisTurn = false`

#### 3.X Civil Actions (добавление, v4.21)
- **Boost Stability** (раз в ход на цивилизацию):
  - cost: `1 AP` + деньги (`50` или `100`)
  - effect: `+2` или `+5` Stability
  - requires: ≥1 интегрированный город у цивилизации
  - sets: `StabilityBoostUsedThisTurn = true`
