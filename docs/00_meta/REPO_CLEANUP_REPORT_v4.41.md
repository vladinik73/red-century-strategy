# Repo Cleanup Report v4.41

**Date:** 2026-03-04  
**Goal:** Safely clean legacy patch artifacts without deleting anything needed.

---

## 1. What Was Deleted

| Path | Reason | Proof |
|------|--------|-------|
| `patches/match.schema.v4.12.json` | Legacy schema snapshot (v4.12). Canonical: `schemas/match.schema.json` (v4.32). | INTEGRATION_NOTE referenced it; canonical replacement in schemas/; no docs use it for implementation. |
| `patches/tile.schema.json` | Duplicate of `schemas/tile.schema.json`. Contained legacy `*_owner_civ_id` fields (replaced by `*_owner_player_id` in v4.31). | Canonical tile schema in schemas/; patches version superseded. |
| `patches/player.schema.json` | Duplicate of `schemas/player.schema.json`. | Canonical player schema in schemas/; patches version superseded. |

**Total deleted:** 3 files

---

## 2. What Was Kept Due to Uncertainty

| Path | Why Uncertain |
|------|---------------|
| `patches/*.md` (123 files) | Patch fragments; some may be referenced by PHASE* workflows. Deletion would break PHASE3_3_README, PHASE4_2_README workflows. Kept and labeled via patches/README.md. |
| `docs/00_meta/GLOBAL_AUDIT_v4_21.md` | Historical audit; documents past mismatches (now fixed). Listed in REPO_STRUCTURE. Kept for audit trail. |
| `docs/00_meta/SOURCE_OF_TRUTH_PATCH_PHASE2_1.md` | Patch note; listed in REPO_STRUCTURE. May contain unapplied edits. Kept. |
| `PATCHES_NEEDED.md` | Referenced by PHASE2_INTEGRATION_README. Kept. |
| `docs/00_meta/PATCH_REPORT_v4.41.md` | Current v4.41 patch report. Kept. |

---

## 3. What Was Moved/Renamed

None.

---

## 4. What Was Labeled as LEGACY

| Path | Action |
|------|--------|
| `patches/README.md` | Created — prominent LEGACY notice; directs to canonical schemas/docs. |
| `patches/INTEGRATION_NOTE.md` | Updated — added LEGACY header; struck reference to deleted match.schema.v4.12.json. |

**Total legacy-labeled:** 2 (1 new file, 1 updated)

---

## 5. Final Repo Canonical Set

### Key docs directories

| Directory | Purpose |
|-----------|---------|
| `docs/00_meta/` | SOURCE_OF_TRUTH, CHANGELOG, REPO_STRUCTURE, SPEC_LOCK_REPORT, REPO_CLEANUP_REPORT |
| `docs/01_overview/` | Action_Catalog, Turn_Pipeline, Start_Conditions, Elimination_Rules, MVP_Player_Journey |
| `docs/02_cities/` | City_Capture, City_Levels |
| `docs/02_world_and_factions/` | Список цивилизаций |
| `docs/03_map/` | Map_Generation, Visibility, Territory_Rules |
| `docs/04_economy/` | Action_Points, Resources, Network, Stability_and_Morale, Infrastructure_Costs, Money_Model |
| `docs/05_tech/` | Tech_Tree, Tech_Progression |
| `docs/06_combat/` | Damage_and_Rules, Siege_Effects, Veterancy_and_Serial |
| `docs/07_units/` | Base_Units, Advanced_Units, Cyber_Effects, Production_Rules |
| `docs/08_diplomacy/` | Victory_Rules, Diplomacy_and_Alliances |
| `docs/09_ai/` | AI_Spec_v1_0, Scoring_Model, Difficulty |
| `docs/10_uiux/` | Main_Game_Screen, Diplomacy_UI, Tech_Tree_UI, Endgame_Screens, etc. |
| `docs/11_replays/` | Replays_and_Observer |
| `docs/12_monetization/` | Monetization |

### Schema files

| File | Purpose |
|------|---------|
| `schemas/match.schema.json` | Match State (Canonical Container + events[]) |
| `schemas/tile.schema.json` | Tile structure |
| `schemas/player.schema.json` | Player State |
| `schemas/city.schema.json` | City object |
| `schemas/unit.schema.json` | UnitType definition |
| `schemas/README.md` | Schema sync notes |

---

## Summary

| Metric | Count |
|--------|-------|
| Deleted | 3 files |
| Legacy-labeled | 2 (1 new README, 1 updated) |
| Kept due to uncertainty | 5+ (patches/*.md, GLOBAL_AUDIT, SOURCE_OF_TRUTH_PATCH, PATCHES_NEEDED, PATCH_REPORT) |

**Next suggested action:** Consider aligning `tile.schema.json` to draft/2020-12 for consistency with other schemas (P2, non-blocking).
