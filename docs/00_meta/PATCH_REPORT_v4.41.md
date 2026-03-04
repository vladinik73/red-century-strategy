# PATCH REPORT v4.41 — Spec Hardening

**Date:** 2026-03-02  
**Goal:** Resolve all P2 issues from SPEC_INTEGRITY_REPORT_v4.40.

---

## 1) Victory Type Clarification ✓

| File | Change |
|------|--------|
| `docs/10_uiux/Endgame_Screens.md` | §1.2: victory_type defined as derived value; source = VICTORY_COMPLETE event; display values MILITARY \| ECONOMIC \| TECHNOLOGICAL \| ALLIANCE |
| `docs/08_diplomacy/Victory_Rules.md` | New section "Victory type (v4.41)": derived from events, not stored; event values vs display values; ALLIANCE for alliance leader wins |

**Result:** victory_type is explicitly derived, not stored in match schema. TECH → TECHNOLOGICAL for display.

---

## 2) Tech Unlock Data Model ✓

| File | Change |
|------|--------|
| `docs/10_uiux/Tech_Tree_UI.md` | §2.2: Tech key format `{branch}_{level}` (lowercase); example `["military_1", "science_2"]` |
| `docs/05_tech/Tech_Progression.md` | New section "Tech key format (v4.41)": format, mapping from TECH_UNLOCK payload |
| `schemas/player.schema.json` | Updated `tech_unlocked` description with format and example (no structural change) |
| `docs/00_meta/SOURCE_OF_TRUTH.md` | Spec Hardening note: tech key format canonical |

**Result:** Standardized format. TECH_UNLOCK `{ branch: "MILITARY", level: 1 }` → add `"military_1"` to array.

---

## 3) Diplomacy Proposal Queue ✓

| File | Change |
|------|--------|
| `docs/10_uiux/Diplomacy_UI.md` | New §10: Proposal queue rules (max 3, timeout 1 turn cycle, auto-decline); proposal object spec; UI flow. Linked from §5.3 Decide later |

**Proposal object (docs only):**
```json
{
  "proposal_id": "string",
  "from_player_id": "string",
  "to_player_id": "string",
  "type": "peace" | "alliance",
  "created_turn": "integer"
}
```

**Result:** Queue spec documented. `match.diplomacy.proposals[]` optional at implementation; not added to schema.

---

## 4) Documentation Version ✓

| File | Change |
|------|--------|
| `docs/00_meta/SOURCE_OF_TRUTH.md` | Header → v4.41; Spec Hardening sync note |
| `docs/00_meta/CHANGELOG.md` | v4.41 entry added |

---

## 5) Final Self-Check

| Check | Result |
|-------|--------|
| No schema drift | **PASS** — match.schema.json unchanged; player.schema.json only description updated (structure unchanged) |
| Proposal queue fields only in docs | **PASS** — grep schemas/ for "proposals": 0 hits |
| No new mechanics | **PASS** — victory_type = derived (existing); tech_unlocked = format clarification (existing); proposal queue = UX spec for existing Decide later flow |

---

## Modified Files Summary

| File | Action |
|------|--------|
| docs/10_uiux/Endgame_Screens.md | Modified |
| docs/08_diplomacy/Victory_Rules.md | Modified |
| docs/10_uiux/Tech_Tree_UI.md | Modified |
| docs/05_tech/Tech_Progression.md | Modified |
| schemas/player.schema.json | Modified (description only) |
| docs/10_uiux/Diplomacy_UI.md | Modified |
| docs/00_meta/SOURCE_OF_TRUTH.md | Modified |
| docs/00_meta/CHANGELOG.md | Modified |
| docs/00_meta/PATCH_REPORT_v4.41.md | Created |

---

## P2 Resolution Status

| P2 Issue (from SPEC_INTEGRITY_REPORT_v4.40) | Resolution |
|---------------------------------------------|------------|
| victory_type not in schema, doc vague | Clarified as derived; source and display values documented |
| tech_unlocked format unspecified | Standardized `{branch}_{level}` lowercase |
| (Proposal queue — implied by Decide later) | Full spec in Diplomacy_UI §10 |

**All P2 issues resolved.**
