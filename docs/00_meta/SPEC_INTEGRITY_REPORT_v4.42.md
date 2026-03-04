# Spec Integrity Report v4.42

**Date:** 2026-03-04  
**Canon version:** v4.42 (Schema Draft Alignment)

---

## 1. Version Matrix

| Source | Version | $schema |
|--------|---------|---------|
| SOURCE_OF_TRUTH.md | v4.42 | — |
| CHANGELOG.md | v4.42 (top entry) | — |
| match.schema.json | v4.42 | draft/2020-12 |
| player.schema.json | v4.42 | draft/2020-12 |
| tile.schema.json | v4.42 | draft/2020-12 |
| city.schema.json | v4.42 | draft/2020-12 |
| unit.schema.json | v4.42 | draft/2020-12 |

**All schemas now use draft/2020-12.** No structural changes beyond tile $schema + titles.

---

## 2. JSON Parse Check

| Schema | Result |
|--------|--------|
| match.schema.json | PASS |
| player.schema.json | PASS |
| tile.schema.json | PASS |
| city.schema.json | PASS |
| unit.schema.json | PASS |

---

## 3. Invariants Grep

### 3.1 acting_civ_id / from_civ_id / to_civ_id

| Location | Count | Status |
|----------|-------|--------|
| Canonical docs (docs/) | 0 | PASS |
| Canonical schemas (schemas/) | 0 | PASS |
| CHANGELOG (historical) | 2 | Allowed — historical entries only |

### 3.2 owner_civ_id in schemas

| Location | Count | Status |
|----------|-------|--------|
| schemas/ | 0 | PASS |

### 3.3 has_moved / has_attacked as schema fields

| Location | Count | Status |
|----------|-------|--------|
| schemas/ (as field names) | 0 | PASS |
| Description-only mentions | Yes | Allowed |

---

## 4. Event Taxonomy Parity

| Source | Count | Status |
|--------|-------|--------|
| Action_Catalog.md (Action→Event table) | 28 | — |
| match.schema.json (oneOf variants) | 28 | — |
| Match | ✓ | PASS |

**Event types:** MOVE, ATTACK, SERIAL_ATTACK, PRODUCE, BUILD_ROAD, UPGRADE_ROAD, BUILD_PORT, UPGRADE_PORT, UPGRADE_CITY, HEAL, DISBAND, CAPTURE_CITY, CYBER_DISRUPT, CYBER_DAMAGE_ROAD, START_HARVEST, REPAIR_ROAD, BOOST_SCIENCE, BOOST_STABILITY, TECH_UNLOCK, DECLARE_WAR, MAKE_PEACE, FORM_ALLIANCE, BREAK_ALLIANCE, REBELLION, ELIMINATION, VICTORY_TRIGGER, VICTORY_COMPLETE, HIDDEN_CIV_SPAWN.

---

## 5. v4.42 Changes Summary

**No schema structural changes beyond:**

- `tile.schema.json`: `$schema` changed from draft-07 to draft/2020-12 (meta only)
- All 5 schema `title` fields: v4.32 → v4.42

**No gameplay mechanics, enums, constraints, required fields, or data shapes changed.**

---

## Summary

| Check | Result |
|-------|--------|
| Version matrix | PASS |
| JSON parse | PASS |
| Invariants (civ_id, owner_civ_id, has_moved/has_attacked) | PASS |
| Event taxonomy parity | PASS |
| No structural changes beyond tile $schema + titles | PASS |

**SPEC INTEGRITY: PASS**
