# SOURCE_OF_TRUTH.md — v4.16 updates — PATCH CONTENT

Внести в `docs/00_meta/SOURCE_OF_TRUTH.md`.

---

## Patch

1) Обнови заголовок версии:
- `v4.15.1` → `v4.16` (название: **Phase 4.9 — Tech Effects + Stability Actions**)

2) Добавь/обнови секции:

### Stability (timing, v4.16)
- Автовосстановление стабильности: `+1` в конце **каждого хода цивилизации** (см. `docs/01_overview/Turn_Pipeline.md`, PHASE 4), максимум `100`.
- Покупка стабильности — действие `Buy Stability`: `1 ОД` + `50→+2` или `100→+5` (см. `docs/04_economy/Action_Points.md`).

### Tech Tree Effects (v4.16)
- Эффекты технологий по веткам/уровням зафиксированы в `docs/05_tech/Tech_Tree.md` (секция `Tech Effects (v4.16)`).
- Research Boost: cap остаётся `floor(SciencePerTurn × 2)` (канон v4.15).

3) Зафиксируй явную константу территорий:
- `MaxTerritoryRadius = 5` (старт 1 + максимум 4 расширения через апгрейды города).
- Ссылка: `docs/03_map/Territory_Rules.md` и `docs/02_cities/City_Levels.md`.
