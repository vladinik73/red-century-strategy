# Phase 5A Bootstrap

**Дата:** 2026-03-04  
**Цель:** monorepo skeleton для разработки Red Age.

---

## Tech Stack

| Компонент | Технология |
|-----------|------------|
| Package manager | pnpm 9.15 |
| Monorepo | Turborepo |
| Core engine | TypeScript (strict), Ajv |
| Web client | React 19, Vite, PixiJS v8, Zustand |
| AI | TypeScript, shared core |
| Server (future) | Node.js, WebSocket |
| Mobile (future) | Capacitor |
| PC (future) | Tauri |
| Testing | Vitest |
| E2E (future) | Playwright |

---

## Goals & DoD (Phase 5A)

**Goals:**
- pnpm + turborepo monorepo
- packages: core, ai, web, server
- tools/codegen (stub)
- Minimal CI-ready structure
- No gameplay implementation yet

**DoD:**
- [x] pnpm install succeeds
- [x] pnpm -r typecheck passes
- [x] pnpm -r test passes
- [x] pnpm -r build passes
- [x] pnpm run codegen exits 0
- [x] Web app shows "Red Age — Phase 5A Bootstrap" + hash + grid

---

## Folder Structure

```
red-century-strategy/
├── packages/
│   ├── core/       # Game engine (pure TS, deterministic)
│   ├── ai/         # AI decisions (depends on core)
│   ├── web/        # React + Vite + PixiJS client
│   └── server/     # Placeholder for multiplayer
├── tools/
│   └── codegen/    # Schema-to-TypeScript (stub)
├── schemas/        # JSON Schema (canon)
├── docs/           # Spec
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
└── package.json
```
