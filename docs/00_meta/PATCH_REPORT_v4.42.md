# PATCH REPORT v4.42 — Schema Draft Alignment + Version Title Sync

**Date:** 2026-03-04  
**Goal:** Align tile schema to draft/2020-12; sync schema titles to v4.42; no behavioral changes.

---

## 1) Modified Files

| File | Change |
|------|--------|
| `schemas/tile.schema.json` | `$schema`: draft-07 → draft/2020-12; `title`: v4.32 → v4.42 |
| `schemas/match.schema.json` | `title`: v4.32 → v4.42 |
| `schemas/player.schema.json` | `title`: v4.32 → v4.42 |
| `schemas/city.schema.json` | `title`: v4.32 → v4.42 |
| `schemas/unit.schema.json` | `title`: v4.32 → v4.42 |
| `docs/00_meta/SOURCE_OF_TRUTH.md` | Header v4.41 → v4.42; added Schema Draft Alignment note |
| `docs/00_meta/CHANGELOG.md` | Added v4.42 entry |
| `schemas/README.md` | Version refs v4.32 → v4.42; tile draft note |
| `docs/00_meta/REPO_STRUCTURE.md` | Schema versions v4.42; added v4.42 reports to Meta |

---

## 2) Key Diffs

### tile.schema.json

```diff
- "$schema": "http://json-schema.org/draft-07/schema#",
+ "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/tile.schema.json",
- "title": "Red Age Tile Schema (v4.32)",
+ "title": "Red Age Tile Schema (v4.42)",
```

### Other schemas (title only)

```diff
- "title": "Match State (v4.32)"
+ "title": "Match State (v4.42)"
```

(Same pattern for player, city, unit.)

### SOURCE_OF_TRUTH.md

```diff
- # Source of Truth (v4.41 — Spec Hardening)
+ # Source of Truth (v4.42 — Schema Draft Alignment)
```

+ New section: "### Schema Draft Alignment (v4.42)"

### CHANGELOG.md

+ New top entry: "## v4.42 — Schema Draft Alignment + Version Title Sync"

---

## 3) Self-Check Table

| Check | Result |
|-------|--------|
| No gameplay mechanics changed | PASS |
| No enums/constraints/required fields changed | PASS |
| tile.schema.json: only $schema + title changed | PASS |
| All schemas: only title changed (except tile) | PASS |
| JSON parse valid for all 5 schemas | PASS |
| Invariants (civ_id, owner_civ_id, has_moved/has_attacked) | PASS |
| Event taxonomy parity (28 = 28) | PASS |
| patches/ remains LEGACY-labeled | PASS |
| No new duplicates created | PASS |

---

## 4) New Reports Created

- `docs/00_meta/SPEC_INTEGRITY_REPORT_v4.42.md`
- `docs/00_meta/REPO_CLEANUP_REPORT_v4.42.md`
- `docs/00_meta/PATCH_REPORT_v4.42.md` (this file)

---

**All checks PASS. v4.42 patch complete.**
