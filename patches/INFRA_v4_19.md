## Phase 4.12 (v4.19) — Ports: MaxPortLevel

### Canon constants
- `MaxPortLevel = 3`
- Port levels are **L1..L3** (no levels above 3).

### Where to place
Add a short line in `docs/04_economy/Infrastructure_Costs.md` (port section), e.g.
- "MaxPortLevel = 3 (L1..L3)"

If `docs/06_combat/Siege_Air_Sea.md` references port levels, ensure it does not imply higher than L3.
