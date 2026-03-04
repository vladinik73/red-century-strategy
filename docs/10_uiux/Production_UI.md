# Production UI (v4.40)

Канон: `docs/07_units/Production_Rules.md`, `docs/07_units/Base_Units.md`, `docs/07_units/Advanced_Units.md`, `docs/07_units/Unique_Units_By_Faction.md`, `docs/02_cities/City_Levels.md`, `docs/01_overview/Action_Catalog.md`.

---

## 1) Entry point

- В **панели города** (правая контекстная панель при выборе города): кнопка **«Произвести юнит»**.
- Открывает **Unit Picker** (модал или выпадающий список).

---

## 2) Unit Picker

### 2.1 Filters

- **Domain:** GROUND | NAVAL | AIR (опционально; по умолчанию показать все доступные).
- **Sort:** по cost (ОД), по domain, по имени.

### 2.2 Unit card contents

| Поле | Источник |
|------|----------|
| Name | unit_type_id / display name |
| ap_cost | Стоимость в ОД |
| HP / Damage / Range / Move | base_max_hp, base_damage, range, move |
| Unlock requirement | unlock_tech (например «Military L1») или «Базовый» |
| Unique marker | is_unique = true → иконка «Уникальный» |

### 2.3 Availability rules (показывать в UI)

| Правило | Отображение |
|---------|-------------|
| Город не интегрирован | Picker disabled; tooltip «Город должен быть интегрирован» |
| Город уже произвёл юнит в этом ходу | Picker disabled; tooltip «1 юнит за ход на город» |
| Клетка города занята | Юнит «в очереди»; tooltip «Юнит появится в начале следующего хода» |
| Tech не изучена | Юнит locked; tooltip «Требуется [unlock_tech]» |
| Недостаточно ОД | Юнит disabled; tooltip «Нужно X ОД» |
| Осада (sieged) | ap_cost × 1.3 (ceil); показать «Стоимость при осаде: X ОД» |
| Лимит авиации/кораблей | См. City_Levels: авиация = floor(level/2), корабли = level при порте |

---

## 3) Confirm dialog

- При выборе юнита: **Confirm** «Произвести [UnitName] за [ap_cost] ОД в [CityName]?»
- Кнопки: **Confirm** | **Cancel**.
- При Confirm: emit `PRODUCE` payload `{ city_id, unit_type_id, spawned_unit_id }`.
- `spawned_unit_id` генерируется системой (уникальный string).

---

## 4) Error handling

| Ошибка | Поведение |
|--------|-----------|
| Город не интегрирован | Блокировать открытие picker |
| Уже произведён юнит | Блокировать |
| Недостаточно ОД | Disable карточку юнита |
| Tech lock | Показать locked, tooltip |
| Не свой ход | Picker закрыт |

---

## 5) Event emission

| UI Action | Event Type | Payload |
|-----------|------------|---------|
| Confirm Produce | PRODUCE | { city_id, unit_type_id, spawned_unit_id } |
