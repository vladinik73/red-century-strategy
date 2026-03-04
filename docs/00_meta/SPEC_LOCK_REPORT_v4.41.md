# Spec Lock Report v4.41

**Date:** 2026-03-04  
**Canon version:** v4.41 (Spec Hardening)

---

## 1. Version Matrix

| Source | Version | Header/Entry |
|--------|---------|--------------|
| SOURCE_OF_TRUTH.md | v4.41 | Header: "Source of Truth (v4.41 — Spec Hardening)" |
| CHANGELOG.md | v4.41 | Top entry: "v4.41 — Spec Hardening (P2 Resolution)" |
| Action_Catalog.md | v4.32 | Header: "Action Catalog (v4.32) — MVP" |
| Turn_Pipeline.md | v4.32 | Header: "Turn Pipeline (Canonical) — v4.32" |
| match.schema.json | v4.32 | title: "Match State (v4.32)" |
| player.schema.json | v4.32 | title: "player.state.schema (v4.32)" |
| tile.schema.json | v4.32 | title: "Red Age Tile Schema (v4.32)" |
| city.schema.json | v4.32 | title: "Red Age City Schema (v4.32)" |
| unit.schema.json | v4.32 | title: "Red Age Unit Type Schema (v4.32)" |

**Note:** Key docs (Action_Catalog, Turn_Pipeline) and schemas are at v4.32; SOT and CHANGELOG at v4.41. No drift for implementation.

---

## 2. Schema Validity Checks

| Schema | Valid JSON | $schema | Parse |
|--------|------------|---------|-------|
| match.schema.json | ✓ | draft/2020-12 | ✓ |
| player.schema.json | ✓ | draft/2020-12 | ✓ |
| tile.schema.json | ✓ | draft-07 | ✓ |
| city.schema.json | ✓ | draft/2020-12 | ✓ |
| unit.schema.json | ✓ | draft/2020-12 | ✓ |

**Note:** `tile.schema.json` uses `http://json-schema.org/draft-07/schema#`; others use `https://json-schema.org/draft/2020-12/schema`. Consider aligning tile to 2020-12 for consistency (non-blocking).

---

## 3. Invariants Grep Table

### 3.1 acting_civ_id / from_civ_id / to_civ_id

| Location | Count | Status |
|----------|-------|--------|
| Canonical docs (docs/) | 0 | ✓ |
| Canonical schemas (schemas/) | 0 | ✓ |
| CHANGELOG (historical) | 2 | Allowed — v4.29 entry describes replacement of acting_civ_id → acting_player_id |
| patches/ | 0 (in schemas); 4 in tile.schema.json (owner_civ_id variants) | patches/tile.schema.json deleted; SCHEMAS_README_TILE_SECTION.md has legacy civ_id refs |

**Result:** Canonical docs and schemas use `player_id` only. ✓

### 3.2 owner_civ_id

| Location | Count | Status |
|----------|-------|--------|
| schemas/ | 0 | ✓ |
| docs/ (canonical) | 0 | ✓ |
| patches/ | 4 (deleted tile.schema.json) | N/A |

**Result:** 0 in schemas. ✓

### 3.3 has_moved / has_attacked (as schema fields)

| Location | Count | Status |
|----------|-------|--------|
| schemas/match.schema.json | 0 (fields) | ✓ — uses `has_acted_this_turn` |
| schemas/README.md | 0 (fields) | ✓ — description-only: "Replaces legacy has_moved + has_attacked" |
| docs/00_meta/SOURCE_OF_TRUTH.md | 0 (fields) | ✓ — description-only |
| patches/ | 0 (match.schema.v4.12.json deleted) | N/A |
| docs/00_meta/GLOBAL_AUDIT_v4_21.md | 4 | Historical audit; documents mismatch that was fixed in v4.22 |

**Description-only mentions (allowed):** match.schema.json L285, schemas/README.md, SOURCE_OF_TRUTH.md, GLOBAL_AUDIT_v4_21.md, CHANGELOG.md.

**Result:** No has_moved/has_attacked as active schema fields. ✓

### 3.4 "движение -1"

| Location | Count | Status |
|----------|-------|--------|
| docs/03_map/Map_Generation.md | 0 | ✓ — removed in v4.26 |
| docs/ (active/canonical) | 0 | ✓ |
| docs/00_meta/GLOBAL_AUDIT_v4_21.md | 2 | Historical audit; documents legacy that was fixed |
| docs/00_meta/CHANGELOG.md | 1 | Historical: "removed legacy 'движение -1' wording" |

**Result:** 0 in active/canonical docs. ✓

---

## 4. Event Taxonomy Parity

### 4.1 Action_Catalog.md — Action → Event table

**Event types (28):** MOVE, ATTACK, SERIAL_ATTACK, PRODUCE, BUILD_ROAD, UPGRADE_ROAD, BUILD_PORT, UPGRADE_PORT, UPGRADE_CITY, HEAL, DISBAND, CAPTURE_CITY, CYBER_DISRUPT, CYBER_DAMAGE_ROAD, START_HARVEST, REPAIR_ROAD, BOOST_SCIENCE, BOOST_STABILITY, TECH_UNLOCK, DECLARE_WAR, MAKE_PEACE, FORM_ALLIANCE, BREAK_ALLIANCE, REBELLION, ELIMINATION, VICTORY_TRIGGER, VICTORY_COMPLETE, HIDDEN_CIV_SPAWN.

### 4.2 match.schema.json — oneOf variants

**Count:** 28

**Event_type consts:** MOVE, ATTACK, SERIAL_ATTACK, HEAL, DISBAND, CAPTURE_CITY, PRODUCE, BUILD_ROAD, UPGRADE_ROAD, BUILD_PORT, UPGRADE_PORT, UPGRADE_CITY, BOOST_SCIENCE, BOOST_STABILITY, START_HARVEST, REPAIR_ROAD, CYBER_DISRUPT, CYBER_DAMAGE_ROAD, TECH_UNLOCK, DECLARE_WAR, MAKE_PEACE, FORM_ALLIANCE, BREAK_ALLIANCE, REBELLION, ELIMINATION, VICTORY_TRIGGER, VICTORY_COMPLETE, HIDDEN_CIV_SPAWN.

### 4.3 Parity

| Check | Result |
|-------|--------|
| Count match | ✓ 28 = 28 |
| All event_type consts in both | ✓ |
| Mismatch | None |

---

## 5. v4.41 Closures Verification

### 5.1 Victory type derived from VICTORY_COMPLETE

| Doc | Status |
|-----|--------|
| Endgame_Screens.md §1.2 | ✓ — victory_type defined as derived; source = VICTORY_COMPLETE; display MILITARY \| ECONOMIC \| TECHNOLOGICAL \| ALLIANCE |
| Victory_Rules.md §Victory type (v4.41) | ✓ — derived from events; event values vs display values; ALLIANCE for alliance leader |
| SOT v4.41 | ✓ — "Victory type: производное значение из VICTORY_COMPLETE event" |

### 5.2 tech_unlocked key format

| Doc | Status |
|-----|--------|
| Tech_Tree_UI.md §2.2 | ✓ — format `{branch}_{level}` (lowercase) |
| Tech_Progression.md §Tech key format (v4.41) | ✓ — format, mapping from TECH_UNLOCK payload |
| player.schema.json | ✓ — tech_unlocked description updated (v4.41) |

### 5.3 Diplomacy proposal queue

| Doc | Status |
|-----|--------|
| Diplomacy_UI.md §10 | ✓ — Proposal queue rules (max 3, timeout 1 turn cycle, auto-decline); proposal object spec; UI flow |
| SOT v4.41 | ✓ — "docs-only extension; not in schemas unless implemented later" |
| match.schema.json | ✓ — no proposals[] (optional at implementation) |

---

## 6. Risk Notes

| Item | Severity | Note |
|------|----------|------|
| tile.schema.json draft-07 | P2 | Inconsistent with other schemas (2020-12). Consider alignment. |
| GLOBAL_AUDIT_v4_21 | Info | Historical; some findings fixed (has_moved, движение -1). Keep for audit trail. |
| VICTORY_COMPLETE payload | Info | Schema enum: MILITARY \| ECONOMIC \| TECH. ALLIANCE is display-only (alliance leader win); not in event payload. Documented in Victory_Rules, Endgame_Screens. |

**P2-only clarifications:** None remaining. v4.41 Spec Hardening resolved P2 items (victory_type, tech_unlocked format, proposal queue).

---

## Summary

| Check | Result |
|-------|--------|
| Version matrix | PASS |
| Schema validity | PASS |
| Invariants (civ_id, has_moved, движение -1) | PASS |
| Event taxonomy parity | PASS |
| v4.41 closures | PASS |

**SPEC LOCK: PASS**
