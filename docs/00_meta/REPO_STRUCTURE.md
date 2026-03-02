# Структура для Claude Code

- `CLAUDE.md` — корневые инструкции
- `.claude/` — команды, чек-листы, workflows
- `docs/` — спецификация
- `schemas/` — схемы сущностей
  - `schemas/tile.schema.json` — структура тайла карты (terrain/resources/roads/ports/territory/visibility).
  - `schemas/player.schema.json` — состояние игрока/цивилизации (Player State) (v4.11)

## Навигация по docs/

| Раздел | Путь | Содержание |
|--------|------|------------|
| Meta | `docs/00_meta/` | SOURCE_OF_TRUTH, CHANGELOG, PROJECT_IDENTITY |
| Обзор | `docs/01_overview/` | README — общее описание игры |
| Города | `docs/02_cities/` | City_Capture, City_Levels |
| Мир и фракции | `docs/02_world_and_factions/` | Список цивилизаций |
| Карта | `docs/03_map/` | Map_Generation, Visibility |
| Экономика | `docs/04_economy/` | Action_Points, Resources, Network, City_Defense, Stability_and_Morale |
| Технологии | `docs/05_tech/` | Tech_Tree, Tech_Progression |
| Бой | `docs/06_combat/` | Damage_and_Rules, Siege_Air_Sea, Veterancy_and_Serial |
| Юниты | `docs/07_units/` | Base_Units, Advanced_Units, Unique_Units_By_Faction |
| Дипломатия | `docs/08_diplomacy/` | Victory_Rules, Diplomacy_and_Alliances |
| ИИ | `docs/09_ai/` | AI_Spec_v1_0, Scoring_Model, Difficulty, Hidden_Civilization |
| UI/UX | `docs/10_uiux/` | PvE_Web_Layout, City_UI, Unit_Actions, Unit_Interaction |
| Реплеи | `docs/11_replays/` | Replays_and_Observer |
| Монетизация | `docs/12_monetization/` | Monetization |
