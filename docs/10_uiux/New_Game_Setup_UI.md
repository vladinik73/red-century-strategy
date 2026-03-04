# New Game Setup UI (v4.40)

Канон: `docs/01_overview/MVP_Player_Journey.md`, `docs/02_world_and_factions/README.md`.

---

## 1) Screen structure

- Экран **New Game Setup** перед Loading/Briefing.
- Поля: выбор цивилизации, сложность, опции матча.

---

## 2) Civ picker

- **Список 7 цивилизаций** (Hidden Civilization недоступна игроку).
- Для каждой: placeholder названия (faction_id), краткое описание (если есть в `Faction_Descriptions`).
- Выбор одной цивилизации (radio или карточки).

---

## 3) Difficulty

- **Presets:** Easy | Normal | Hard | God.
- Краткое описание каждой сложности (модификаторы, агрессия AI).
- Канон: `docs/09_ai/Difficulty.md`.

---

## 4) Hidden civ toggle

- **ON/OFF** — скрытая цивилизация появится после 20 хода (или не появится).

---

## 5) Seed input

- **Auto** (по умолчанию): система генерирует seed.
- **Custom:** опциональное поле для ввода seed (integer). Для воспроизводимости матчей.

---

## 6) Start button

- **Start Game** — валидация (цивилизация выбрана) → переход на Loading/Briefing.
- Disabled, если цивилизация не выбрана.
