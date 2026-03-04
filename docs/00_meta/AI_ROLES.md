# AI_ROLES.md
Red Age Project

Version: v1.0  
Status: ACTIVE  
Location: docs/00_meta/AI_ROLES.md

---

## Purpose

This document defines **responsibilities and boundaries** of AI tools used in the Red Age development workflow.

The project uses three AI systems:

- ChatGPT
- Claude
- Cursor

Each AI has a **strict role** to avoid architecture drift, spec conflicts, or duplicated work.

---

## AI Responsibility Model

| Area | Owner |
|---|---|
| Architecture & technical strategy | ChatGPT |
| Specifications & documentation (canonical) | Claude |
| Implementation (code, refactors, project structure) | Cursor |
| Spec consistency audits | Claude |
| Architecture audits / design reviews | ChatGPT |

---

## ChatGPT Role — Architecture

ChatGPT acts as the **system architect**.

**Responsibilities:**
- Engine architecture (deterministic simulation, event-sourcing)
- Technical stack decisions and rationale
- Multiplayer evolution plan (authoritative server, sync model)
- Replay/observer architecture
- Performance strategy (web-first, AI workers)
- Cross-platform strategy (web → mobile → PC)

**ChatGPT does not:**
- modify repository files directly
- write large production code
- change specs unilaterally

Output format: architectural decisions, diagrams, checklists, constraints.

---

## Claude Role — Specification Authority

Claude acts as the **specification and documentation authority**.

**Responsibilities:**
- Game design & UX specs (docs/)
- Schema maintenance and alignment (schemas/)
- Spec versioning and changelog hygiene
- Patch documentation and integrity reports
- Audits for spec completeness and contradictions

Claude maintains as canonical:
- `docs/`
- `schemas/`
- `docs/00_meta/SOURCE_OF_TRUTH.md`

**Claude does not:**
- introduce new mechanics without product-owner approval
- redesign architecture without ChatGPT/owner alignment
- write production code as a primary responsibility

If ambiguity exists, Claude proposes options and flags decisions needed.

---

## Cursor Role — Implementation Engine

Cursor acts as the **engineering implementation tool**.

**Responsibilities:**
- Write production code
- Create/modify files in code packages
- Implement specs and schemas in code
- Refactor and organize project structure
- Add tests and CI wiring (when we start coding)

Cursor implements primarily:
- `packages/core`
- `packages/ai`
- `packages/web`
- `packages/server` (later)

Cursor must follow:
- `docs/`
- `schemas/`
- `docs/00_meta/SOURCE_OF_TRUTH.md`
- `docs/00_meta/ENGINEERING_GUARDRAILS.md`
- this file: `docs/00_meta/AI_ROLES.md`

**Cursor does not:**
- change specs or architecture as “truth”
- silently invent new mechanics

When code needs a spec change: Cursor reports the gap, then Claude updates docs.

---

## Development Workflow (Mandatory)

All work follows this sequence:

1) **Architecture discussion** (ChatGPT)  
2) **Spec updates** (Claude)  
3) **Implementation** (Cursor)  
4) **Audit & verification** (Claude + ChatGPT)

No skipping steps.

---

## Source of Truth Rules

**Canonical game logic is defined by:**
- `docs/`
- `schemas/`
- `docs/00_meta/SOURCE_OF_TRUTH.md`

If code conflicts with specs: **specs win**.

---

## Architecture Authority Rules

Architecture decisions are defined by:
- Product Owner (human)
- ChatGPT as the architecture tool

If implementation conflicts with architecture: **architecture wins**.

---

## Decision Hierarchy

Product Owner (Human)  
→ Architecture (ChatGPT)  
→ Specifications (Claude)  
→ Implementation (Cursor)

---

## Change Control Policy

Any change must follow:

1) approve architecture direction (if needed)  
2) update specs (docs/schemas)  
3) implement code  
4) run audits (spec integrity + basic invariants)

Direct implementation without spec update is not allowed for core rules.

---

## Observer / AI-Only Test Policy

The system must support these modes from early development:

- Human vs AI (normal PvE)
- AI vs AI (all civs are bots)
- Observer (human watches, no inputs)
- Replay determinism (same events → same final state)

These capabilities must remain compatible with the future multiplayer plan.

---

## Long-term Goal

Architecture must cleanly support:

- Web PvE MVP
- Mobile builds (same web app wrapped)
- PC builds (same web app wrapped)
- Multiplayer (authoritative server)
- Spectator/observer mode
- Replays (event log + snapshots)