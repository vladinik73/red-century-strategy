# Combat Feedback UI (v4.40)

Канон: `docs/06_combat/Damage_and_Rules.md`, `docs/01_overview/Action_Catalog.md`. Без новых механик.

---

## 1) Damage popup

- При атаке (ATTACK, SERIAL_ATTACK): над целью показывается **число урона** (всплывающее, 0.5–1 сек).
- Цвет: нейтральный или красный.
- Анимация: появление → fade out.

---

## 2) Counter-attack indicator

- При ответном ударе (melee, Range=1): отдельный popup «Контратака: X» над атакующим.
- Канон: counterattack существует только в melee.

---

## 3) Kill feedback

- При уничтожении юнита: краткий эффект (вспышка, исчезновение) + опционально «Убийство».
- При захвате города: toast «Город захвачен» (см. Notification_System).

---

## 4) Optional breakdown tooltip

- Hover на результат боя (если есть отдельный UI элемент): tooltip с разбивкой:
  - BaseDamage, TerrainBonus, DefenseModifier, TechDamageBonus, MoraleMultiplier.
- Не обязательно для MVP; можно добавить в Readable MVP.
