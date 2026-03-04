# Tech Stack Proposal — Red Age

**Дата:** 2026-03-04  
**Цель:** обоснованный технический стек для PvE web → mobile/PC, с поддержкой observer-режима и будущего multiplayer.

---

## 1. Требования (из спецификации)

| Требование | Источник |
|------------|----------|
| PvE web-first, сессия 1–3 часа | SOT, PROJECT_IDENTITY |
| Детерминированная логика (replay, multiplayer) | match.schema events[], Turn_Pipeline |
| 1 игрок + AI для остальных цивилизаций | MVP_Player_Journey |
| Позже: каждая цивилизация — игрок | Multiplayer |
| Тесты: все цивилизации — боты, наблюдатель смотрит | Observer mode |
| Web → Mobile → PC | Roadmap |

---

## 2. Архитектурные принципы

### 2.1 Разделение Core / Client / Server

```
┌─────────────────────────────────────────────────────────────────┐
│  CORE (TypeScript, pure, deterministic)                          │
│  - Match state (match.schema.json)                               │
│  - Turn pipeline, event emission                                 │
│  - Command validation: (state, command) → events[]               │
│  - No UI, no I/O, no random (seed passed in)                     │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Web Client   │    │ Mobile       │    │ Game Server  │
│ (React+Canvas)│   │ (RN/Flutter) │    │ (multiplayer)│
└──────────────┘    └──────────────┘    └──────────────┘
```

**Почему:** Core можно переиспользовать на web, mobile, сервере. Детерминизм гарантирует одинаковый результат при одинаковых командах и seed.

### 2.2 Режимы игры

| Режим | Кто ходит | Кто наблюдает |
|-------|-----------|---------------|
| PvE | 1 human, остальные AI | — |
| Observer (тесты) | Все AI | 1 observer (UI только отображает) |
| Multiplayer (позже) | N humans | M observers (опционально) |

**Observer:** клиент получает поток событий (или полный state после каждого хода), рендерит карту, не отправляет команд. Идеально для тестов «все боты».

---

## 3. Рекомендуемый стек

### 3.1 Core Engine

| Компонент | Технология | Обоснование |
|-----------|------------|-------------|
| Язык | **TypeScript** | Строгая типизация, JSON Schema валидация, один язык для core + web + Node |
| Валидация | **Ajv** (JSON Schema) | match/player/tile/city/unit schemas уже есть |
| Детерминизм | Pure functions, явный RNG(seed) | Нет `Math.random()` без seed; все события воспроизводимы |
| Структура | `packages/core` (monorepo) | Изолированный модуль, тестируемый без UI |

### 3.2 AI

| Компонент | Технология | Обоснование |
|-----------|------------|-------------|
| Логика | TypeScript, `docs/09_ai/AI_Spec_v1_0.md` | Детерминированный AI; один и тот же seed → один и тот же ход |
| Запуск | Client-side (PvE) или Server-side (multiplayer) | PvE: AI в браузере; multiplayer: сервер для anti-cheat |

### 3.3 Web Client (MVP)

| Компонент | Технология | Обоснование |
|-----------|------------|-------------|
| Framework | **React 18+** | Компонентный UI, богатая экосистема |
| Build | **Vite** | Быстрая сборка, HMR |
| Карта | **Canvas API** или **PixiJS** | 80×80 тайлов, 2D; Canvas достаточно для MVP, Pixi — если нужны эффекты |
| State | **Zustand** или **Jotai** | Лёгкий state; match state + UI state |
| Стили | **CSS Modules** или **Tailwind** | Минимализм по PROJECT_IDENTITY |

### 3.4 Backend (для multiplayer позже)

| Компонент | Технология | Обоснование |
|-----------|------------|-------------|
| Runtime | **Node.js** или **Bun** | Тот же TypeScript, shared core |
| API | **WebSocket** (или Socket.io) | Real-time: команды игроков, рассылка событий |
| Auth | **Supabase** или **Firebase** | Готовые auth + optional DB для матчмейкинга |
| Persistence | **SQLite** (dev) → **Postgres** (prod) | Сохранение матчей, replay |

### 3.5 Mobile (Phase 2)

| Вариант | Плюсы | Минусы |
|---------|-------|--------|
| **React Native** | Переиспользование React-компонентов, core как есть | Производительность Canvas/WebView |
| **Capacitor** | Web-клиент в WebView, минимум изменений | WebView ограничения |
| **Flutter** | Нативная производительность | Переписать UI, core через FFI или REST |

**Рекомендация:** **Capacitor** для быстрого выхода; при необходимости производительности — React Native с shared core.

### 3.6 PC (Phase 2)

| Вариант | Плюсы | Минусы |
|---------|-------|--------|
| **Tauri** | Лёгкий, Rust + WebView, малый размер | Нужен Rust toolchain |
| **Electron** | Зрелость, тот же web-клиент | Тяжёлый (~150MB+) |

**Рекомендация:** **Tauri** — меньше размер, лучше производительность.

---

## 4. Структура монорепо

```
red-century-strategy/
├── packages/
│   ├── core/           # Game engine (pure TS)
│   │   ├── src/
│   │   │   ├── state/
│   │   │   ├── pipeline/
│   │   │   ├── commands/
│   │   │   ├── ai/
│   │   │   └── validation/
│   │   └── package.json
│   ├── web/            # React web client
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── map/
│   │   │   ├── store/
│   │   │   └── screens/
│   │   └── package.json
│   └── server/         # (Phase 2) Game server
│       └── ...
├── schemas/            # JSON Schema (канон)
├── docs/
└── package.json        # Workspace root
```

---

## 5. Режим Observer (тесты)

**Реализация:**

1. **Game loop:** для каждой цивилизации в turn order вызывается AI, который возвращает команду.
2. **Core:** `applyCommand(state, command)` → `{ newState, events }`.
3. **Observer client:** получает `newState` (или `events`), рендерит карту, **не отправляет команд**.
4. **Варианты запуска:**
   - **Headless:** Node.js скрипт, гоняет матч до конца, пишет replay на диск.
   - **UI Observer:** web-клиент в режиме «только просмотр» — подписан на state updates, кнопки действий disabled.

**Конфиг:** `observerMode: true` → все civs управляются AI, UI в read-only.

---

## 6. Переход к Multiplayer

| Аспект | Решение |
|--------|---------|
| Authoritative server | Сервер хранит match state, валидирует команды через core |
| Команды | Клиент отправляет `{ commandType, payload }`; сервер применяет, рассылает events |
| Синхронизация | Lockstep: все клиенты получают одни и те же events в одном порядке |
| Reconnect | Клиент запрашивает текущий state + события с последнего известного; воспроизводит локально |
| Observer в multiplayer | Сервер рассылает events и observers; observer-клиенты только слушают |

---

## 7. Итоговая рекомендация

| Фаза | Стек |
|------|-----|
| **MVP (PvE Web)** | TypeScript, React, Vite, Canvas/PixiJS, core в packages/core |
| **Observer** | Флаг `observerMode`; AI для всех civs; UI read-only |
| **Mobile** | Capacitor (web wrap) или React Native |
| **PC** | Tauri |
| **Multiplayer** | Node.js/Bun + WebSocket, shared core, authoritative server |

**Критично:** Core должен быть чистым, детерминированным, без побочных эффектов. Тогда observer, replay и multiplayer строятся поверх одной и той же логики.
