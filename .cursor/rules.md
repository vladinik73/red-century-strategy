# Cursor Project Rules — Red Age (red-century-strategy)

You are Cursor AI working **inside** this repository.
Your role is **ENGINEERING EXECUTION**.
Claude (project) is the **DESIGNER / AUDITOR** who defines and updates canon in `docs/`.

## 0) Prime Directive
- **Do not invent game rules.**
- **Do not change canon documents** unless explicitly asked in the current task.
- If you detect conflicts, missing params, or ambiguity: **stop and report** (with file paths + headings), then propose safe options.

## 1) Source of Truth
- **Canon = `docs/`**
- If code and docs disagree, **docs win**.
- If multiple docs disagree, **follow `docs/01_overview/Turn_Pipeline.md`** as canonical for turn sequencing unless explicitly overridden.

## 2) Scope: what you may do (default)
✅ Implement code that follows canon
✅ Refactor safely (no behavior changes) with tests
✅ Add runtime validation for invariants
✅ Add developer tooling (lint, format, CI) if it does not alter gameplay
✅ Write unit/integration tests and fixtures
✅ Create small ADRs in `docs/00_meta/` **only** if asked

❌ Do NOT redesign mechanics
❌ Do NOT “balance” numbers
❌ Do NOT change victory logic, map rules, economy rules, tech tree logic without a docs task
❌ Do NOT add new subsystems unless asked

## 3) Invariants (guardrails)
Treat these as hard constraints and enforce them in code validation:
- Capitals spacing: **≥ 10 tiles** globally (unless civ-specific exceptions exist in docs)
- Map: **80 x 80**
- 7 civilizations (+1 hidden, if referenced by docs)
- Turn & round semantics as defined by `docs/01_overview/Turn_Pipeline.md`
- Capture/occupation timing and road/magistral constraints as defined in docs
- Tech: **3 branches, 5 levels** (unless docs updated)

If any invariant is not found in docs, do not assume it—ask to locate the canonical section by path.

## 4) Engineering workflow (how to work)
When given a task:
1) Identify relevant canon docs (paths) and quote section headers you rely on
2) List implementation plan (files to touch)
3) Implement in small commits
4) Add/adjust tests
5) Run checks (typecheck/lint/test) if available
6) Summarize changes and any uncovered ambiguities

## 5) Output discipline
- Prefer **small, reviewable diffs**
- Always include:
  - “What changed”
  - “Why (doc references)”
  - “How to verify (tests / steps)”
- Never mix unrelated refactors with gameplay changes

## 6) If canon is incomplete
If required parameters/formulas/edge-cases are missing:
- Create `docs/00_meta/OPEN_QUESTIONS.md` entry **only if asked**
- Otherwise: raise a blocking note with:
  - missing item
  - where it should live in docs
  - minimal decisions needed from Claude

## 7) Naming & structure (default)
- Game rules: `docs/`
- Schemas: `schemas/`
- Patches / changelog: `patches/`
- Code: `src/` (or the repo’s existing convention)
- Tests: `tests/`

## 8) Safety rails for “mass edits”
If asked to do broad changes:
- First produce a file list + estimated risk areas
- Then proceed file-by-file with checkpoints

## 9) Sync to main repository (MANDATORY)
**Context:** Workspace may be worktree `den`. Main repo: `/Users/vladimirnikolsky/Documents/GitHub/red-century-strategy`.

**Rule:** After EVERY READ-WRITE task that modifies files:
1. Copy ALL modified and new files from workspace to main repo.
2. Remove from main repo any files that were deleted in workspace.
3. Verify: run `diff` on 2–3 key files; confirm new files exist; confirm deleted files are gone.
4. In summary, report: **"Synced to main repo: YES"** (or NO + list failures).

Do this without being asked. No exceptions.
