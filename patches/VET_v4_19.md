## Phase 4.12 (v4.19) — Veterancy numeric closure

### Canon: Veterancy Tier-Up (MVP)

- **Trigger:** when a unit reaches **3 total kills** (`kills_total >= 3`) it becomes **Veteran**.
- **Effect:** `MaxHP += 2` (and current HP increases by +2 as well, capped by new MaxHP).
- **Limit:** only **one** veterancy tier exists in MVP (no further tier-ups).

### Notes
- This is **independent** of Serial Strike counters (`kills_in_chain`, `SerialKillCap`).
- If a unit is created as a veteran (e.g., scenario), it must start with the adjusted MaxHP.

### Where to place
Insert this as a dedicated subsection under `Veterancy` / `Veterancy rules` in:
- `docs/06_combat/Veterancy_and_Serial.md`
