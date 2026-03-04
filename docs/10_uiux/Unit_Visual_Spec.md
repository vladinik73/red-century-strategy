# Unit Visual Spec (v4.40)

Канон: `docs/10_uiux/Main_Game_Screen.md`, `docs/10_uiux/Unit_Interaction.md`, `schemas/match.schema.json` (units[]), `schemas/unit.schema.json`.

---

## 1) Domain shape language

| Domain | Визуальный cue |
|--------|----------------|
| GROUND | Квадрат/пехота-силуэт |
| NAVAL | Треугольник/корабль-силуэт |
| AIR | Круг/самолёт-силуэт |

- Placeholder: геометрические формы + цвет домена.

---

## 2) Faction tint

- Юнит окрашивается в **faction color** владельца (`owner_player_id` → faction_1 … faction_7).
- Враг: контрастный оттенок; союзник: тот же или близкий цвет.

---

## 3) Veterancy badge

- `veterancy_level > 0` → маленький значок (звезда/шеврон) рядом с юнитом.
- Один уровень ветеранства в MVP (3 убийства → +2 MaxHP).

---

## 4) HP placement

- **Число над юнитом** (без HP-bar).
- **HP ≤ 30% max:** число **красным** (token `danger`).
- Канон: `docs/00_meta/PROJECT_IDENTITY.md`, `Main_Game_Screen.md`.

---

## 5) «Acted this turn» dimming

- `has_acted_this_turn = true` → юнит визуально приглушён (opacity 0.7 или серый tint).
- Показывает, что юнит больше не может действовать в этот ход.

---

## 6) Selection highlight

- Выбранный юнит: контур/подсветка клетки (selection token).
- Только один юнит выбран одновременно.

---

## 7) Serial strike indicator

- Во время цепочки серийного удара: badge «Chain: X/5» или счётчик убийств в цепочке.
- `kills_in_chain` отображается при активной цепочке.

---

## 8) Cyber-capable unit marker

- Киберподразделение: иконка «Сбой» или «Cyber» на/рядом с юнитом.
- Слот для других способностей (generic «abilities» icon) при расширении.
