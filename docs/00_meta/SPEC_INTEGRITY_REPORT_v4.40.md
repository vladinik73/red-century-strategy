# SPEC INTEGRITY REPORT v4.40

**Date:** 2026-03-02  
**Scope:** v4.40 UI/Visual Spec Pack vs core mechanics, schemas, Turn Pipeline, Action Catalog.

---

## 1) Screen Coverage

| Screen (MVP_Player_Journey) | UI Spec | Status |
|-----------------------------|---------|--------|
| Home | — | Implicit (New Game, Continue, Settings) |
| New Game Setup | New_Game_Setup_UI.md | ✓ Full |
| Loading / Briefing | — | Implicit (MVP_Player_Journey) |
| Main Game | Main_Game_Screen.md + pack | ✓ Full |
| Victory / Defeat | Endgame_Screens.md | ✓ Full |
| Settings | Settings_Screen.md | ✓ Full |

**Sub-screens / panels:**
- Diplomacy panel → Diplomacy_UI.md ✓
- Tech panel → Tech_Tree_UI.md ✓
- Production picker → Production_UI.md ✓
- City panel → City_UI.md ✓
- Unit panel → Unit_Actions.md, Unit_Interaction.md ✓

**Layout conflict:** Resolved. Main_Game_Screen = canonical (HUD + right panel). PvE_Web_Layout = aspirational. Diplomacy_UI correctly references "HUD или нижней панели" — canonical layout uses HUD only; no conflict.

**Issues:** None (P0/P1).  
**P2:** Loading/Briefing screen has no dedicated spec; acceptable for MVP (brief text from MVP_Player_Journey).

---

## 2) Event Mapping Matrix

| UI Action | Event Type | Payload | Action_Catalog | Schema | Status |
|-----------|-------------|---------|----------------|--------|--------|
| Confirm Declare War | DECLARE_WAR | from_player_id, to_player_id | ✓ | ✓ | OK |
| Confirm Make Peace | MAKE_PEACE | from_player_id, to_player_id | ✓ | ✓ | OK |
| Confirm Form Alliance | FORM_ALLIANCE | from_player_id, to_player_id | ✓ | ✓ | OK |
| Confirm Break Alliance | BREAK_ALLIANCE | from_player_id, to_player_id | ✓ | ✓ | OK |
| Accept Incoming (diplomacy) | FORM_ALLIANCE / MAKE_PEACE / BREAK_ALLIANCE | from_player_id, to_player_id | ✓ | ✓ | OK |
| Confirm Unlock (Tech) | TECH_UNLOCK | branch, level | ✓ | ✓ | OK |
| Confirm Produce | PRODUCE | city_id, unit_type_id, spawned_unit_id | ✓ | ✓ | OK |
| Move (click) | MOVE | unit_id, from_tile, to_tile | ✓ | ✓ | OK |
| Attack (click) | ATTACK | attacker_unit_id, target_unit_id, damage, target_remaining_hp | ✓ | ✓ | OK |
| Heal | HEAL | unit_id, hp_before, hp_after | ✓ | ✓ | OK |
| Disband | DISBAND | unit_id, ap_refund | ✓ | ✓ | OK |
| Build Road / Bridge | BUILD_ROAD | tile_id, new_road_level, is_bridge? | ✓ | ✓ | OK |
| Build Port | BUILD_PORT | tile_id, new_port_level | ✓ | ✓ | OK |
| Start Harvest | START_HARVEST | tile_id | ✓ | ✓ | OK |
| Repair Road | REPAIR_ROAD | tile_id | ✓ | ✓ | OK |

**Payload naming:** Action_Catalog uses `tile_id` for BUILD_ROAD, START_HARVEST, REPAIR_ROAD. CYBER_DAMAGE_ROAD uses `target_tile_index`. Both denote flat index 0..6399. ✓ Consistent.

**Issues:** None (P0/P1).

---

## 3) Schema Compatibility

| UI Reference | Schema | Field | Exists | Notes |
|--------------|--------|-------|--------|-------|
| Diplomacy_UI | match.diplomacy.relations | a_player_id, b_player_id, state, min_alliance_turns_left, cooldown_turns_left | ✓ | OK |
| Tech_Tree_UI | player | tech_unlocked, science | ✓ | OK |
| Tech_Tree_UI | match.victory.per_player | tech_victory_turns_left | ✓ | OK |
| Production_UI | match.units | unit_type_id, owner_player_id | ✓ | OK |
| Production_UI | match.cities | city_id, integration_turns_left, sieged | ✓ | OK |
| Production_UI | player | ap_current | ✓ | OK |
| Map_Visual_Spec | tile | terrain_type, terrain_base, is_river, road_level, port_level, road_damaged_turns_left, territory_owner_player_id, visibility | ✓ | OK |
| Map_Overlays | tile | resource_type, harvest_started, resource_remaining | ✓ | OK |
| City_Visual_Spec | city | level, is_capital, defense_level, integration_turns_left, sieged, disruption_turns_left, owner_player_id | ✓ | OK |
| Unit_Visual_Spec | match.units | owner_player_id, hp, veterancy_level, has_acted_this_turn, kills_in_chain | ✓ | OK |
| Unit_Visual_Spec | unit.schema (UnitType) | domain | ✓ | OK |
| Endgame_Screens | match.victory.per_player | won, lost, military_city_power, economic_hold_turns_left, tech_victory_turns_left | ✓ | OK |

**P2:** Endgame_Screens references `victory_type` — not in match.victory.per_player. Doc correctly says "если хранится" (if stored). Victory type is derived from VICTORY_COMPLETE event. Acceptable.

**P2:** `tech_unlocked` format (array of strings) — schema says "ключи из Tech_Tree". Exact key format (e.g. "MILITARY_1" vs "Military L1") not specified. Implementation must align Tech_Tree keys with TECH_UNLOCK branch+level.

**Issues:** None (P0/P1). P2 clarifications only.

---

## 4) Turn Pipeline Alignment

| Rule | UI Behavior | Status |
|------|-------------|--------|
| PHASE 3 = Action Phase (player only) | Diplomacy_UI: "Not your turn" → panel closed/disabled | ✓ |
| PHASE 3 actions | Production_UI, Tech_Tree_UI: "Not your turn" → picker/panel closed | ✓ |
| 1 action per unit | Unit_Visual_Spec: has_acted_this_turn dimming | ✓ |
| End Turn only by button | Main_Game_Screen: End Turn always available | ✓ |
| AI turn first, player last | MVP_Player_Journey, Turn_Pipeline | ✓ |

**Incoming Proposal timing:** AI-initiated proposals (Form Alliance, Make Peace, Break Alliance) appear during AI turn. Modal blocks until player responds. Aligns with Turn Pipeline — player response is required before AI turn completes. ✓

**Issues:** None (P0/P1).

---

## 5) Diplomacy Model Consistency

| Mechanic (Diplomacy_and_Alliances) | UI Spec | Status |
|------------------------------------|---------|--------|
| Max 2 alliances | Diplomacy_UI: Form Alliance disabled when "Союзов уже 2" | ✓ |
| Alliance min 6 turns before break | Diplomacy_UI: min_alliance_turns_left, Break disabled if > 0 | ✓ |
| Cooldown 3 after break | Diplomacy_UI: cooldown_turns_left, Form disabled if > 0 | ✓ |
| Cyber on neutral = auto war | Diplomacy_UI §9: no confirm, toast | ✓ |
| State: WAR / NEUTRAL / ALLIANCE | Diplomacy_UI: list view shows state | ✓ |

**match.diplomacy.relations[]** structure: a_player_id, b_player_id, state, min_alliance_turns_left, cooldown_turns_left. All referenced correctly. ✓

**Proposal model:** Player-initiated → Confirm → emit. AI-initiated → Incoming Proposal (Accept/Reject/Decide later) → Accept emits. ✓

**Issues:** None (P0/P1).

---

## 6) Map Rendering Consistency

| Source | Map_Visual_Spec | Map_Overlays | Visibility | Territory_Rules | Status |
|--------|-----------------|--------------|------------|-----------------|--------|
| Terrain types | PLAIN, FOREST, MOUNTAIN, DESERT, WATER | — | — | — | ✓ |
| Visibility | UNEXPLORED, VISIBLE | Overlays hide UNEXPLORED | 2-state, permanent | — | ✓ |
| Territory | territory_owner_player_id, borders | — | — | city borders only | ✓ |
| Roads/ports | road_level 1–3, port_level 1–3 | Network overlay | — | — | ✓ |
| Bridge | BUILD_ROAD is_bridge on WATER | — | — | — | ✓ |
| Status badges | sieged, disruption, integration, damaged road | Integration overlay | — | — | ✓ |

**tile.visibility:** Array of 10 (MaxCivs), values 0 or 1. Map_Visual_Spec uses UNEXPLORED/VISIBLE. Mapping from player to visibility index is implementation detail; spec is consistent. ✓

**Issues:** None (P0/P1).

---

## Summary

| Section | P0 | P1 | P2 |
|---------|----|----|-----|
| 1) Screen coverage | 0 | 0 | 1 (Loading/Briefing no spec) |
| 2) Event mapping | 0 | 0 | 0 |
| 3) Schema compatibility | 0 | 0 | 2 (victory_type, tech_unlocked format) |
| 4) Turn pipeline | 0 | 0 | 0 |
| 5) Diplomacy model | 0 | 0 | 0 |
| 6) Map rendering | 0 | 0 | 0 |

**Total:** 0 P0, 0 P1, 3 P2 (all minor clarifications).

---

# v4.40 SPEC SET IS ENGINE-READY

All critical and major checks pass. P2 items are documentation clarifications only and do not block implementation.
