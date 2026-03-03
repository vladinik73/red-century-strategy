# Структура для Claude Code

- `CLAUDE.md` — корневые инструкции
- `.claude/` — команды, чек-листы, workflows
- `docs/` — спецификация
- `schemas/` — схемы сущностей
  - `schemas/tile.schema.json` — структура тайла карты (v4.31; terrain/resources/roads/ports/territory/visibility; *_owner_player_id)
  - `schemas/player.schema.json` — состояние игрока/цивилизации (Player State) (v4.30)
  - `schemas/match.schema.json` — состояние партии (Match State, Canonical Container + replay-log) (v4.30)
  - `schemas/city.schema.json` — объект города (v4.27)
  - `schemas/unit.schema.json` — схема типа юнита

## Навигация по docs/

| Раздел | Путь | Содержание |
|--------|------|------------|
| Meta | `docs/00_meta/` | SOURCE_OF_TRUTH, CHANGELOG, PROJECT_IDENTITY |
| Meta (templates/audits) | `docs/00_meta/` | CURSOR_WORKFLOW, CURSOR_TASK_TEMPLATE, ENGINEERING_GUARDRAILS, CONSISTENCY_REPORT_TEMPLATE, GAME_DESIGN_AUDIT_2026_03, GLOBAL_AUDIT_v4_21, SOURCE_OF_TRUTH_PATCH_PHASE2_1, CLAUDE_CODE_USER_GUIDE |
| Обзор | `docs/01_overview/` | README, Action_Catalog, Elimination_Rules, MVP_Player_Journey, Turn_Pipeline, Start_Conditions |
| Города | `docs/02_cities/` | City_Capture, City_Levels |
| Мир и фракции | `docs/02_world_and_factions/` | Список цивилизаций |
| Карта | `docs/03_map/` | Map_Generation, Visibility, Territory_Rules |
| Экономика | `docs/04_economy/` | Action_Points, Resources, Network, City_Defense, Stability_and_Morale, Infrastructure_Costs, Money_Model |
| Технологии | `docs/05_tech/` | Tech_Tree, Tech_Progression |
| Бой | `docs/06_combat/` | Damage_and_Rules, Siege_Air_Sea, Siege_Effects, Veterancy_and_Serial |
| Юниты | `docs/07_units/` | Base_Units, Advanced_Units, Unique_Units_By_Faction, Cyber_Effects, Production_Rules |
| Дипломатия | `docs/08_diplomacy/` | Victory_Rules, Diplomacy_and_Alliances |
| ИИ | `docs/09_ai/` | AI_Spec_v1_0, Scoring_Model, Difficulty, Hidden_Civilization |
| UI/UX | `docs/10_uiux/` | City_UI, PvE_Web_Layout, Unit_Actions, Unit_Interaction, Main_Game_Screen — интерфейс и UX-правила MVP |
| Реплеи | `docs/11_replays/` | Replays_and_Observer |
| Монетизация | `docs/12_monetization/` | Monetization |
