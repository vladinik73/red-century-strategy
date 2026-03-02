## Unit Actions (v4.20)

- **1 действие на юнит за ход цивилизации** (Move / Attack / Heal / Disband / Special).
- **Heal:** 1 ОД, +3 HP, не выше MaxHP, тратит действие юнита.
- **Disband:** тратит действие юнита, удаляет юнит, возвращает `floor(APCost × 0.5)` ОД в текущий пул.
- **Counter-attack:** существует **только в melee (Range=1)** и только если защитник выжил; для ranged (Range≥2) ответного удара нет.
- Канон: `docs/10_uiux/Unit_Actions.md`, `docs/06_combat/Damage_and_Rules.md`, `docs/01_overview/Turn_Pipeline.md`.
