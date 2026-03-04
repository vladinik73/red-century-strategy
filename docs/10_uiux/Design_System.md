# Design System (v4.40) — Minimal v1

Канон: `docs/00_meta/PROJECT_IDENTITY.md`, `docs/10_uiux/PvE_Web_Layout.md` (светлая тема, минимализм).

---

## 1) Typography scale

| Token | Use | Size (пример) |
|-------|-----|---------------|
| text_xs | Мелкие метки, badges | 10–11px |
| text_sm | Вторичный текст | 12px |
| text_md | Основной текст | 14–16px |
| text_lg | Заголовки панелей | 18px |
| text_xl | Заголовки экранов | 22–24px |

- Шрифт: sans-serif, читаемый (системный или веб-безопасный).
- Line-height: 1.4–1.5 для основного текста.

---

## 2) Spacing scale

| Token | Значение |
|-------|----------|
| space_xs | 4px |
| space_sm | 8px |
| space_md | 16px |
| space_lg | 24px |
| space_xl | 32px |

---

## 3) Component tokens

| Component | Описание |
|-----------|----------|
| button | Высота ~36px, padding horizontal 16px, border-radius 4px |
| panel | Фон светлее карты, border или shadow, padding space_md |
| modal | Overlay + контент по центру, max-width 400px |
| toast | Компактная полоска, 3–5 сек, правый нижний угол |
| tooltip | Маленький popup при hover, delay 300ms |

---

## 4) Iconography

- **Размеры:** 16px (inline), 24px (кнопки), 32px (карточки).
- **Стиль:** outline или filled; единообразие в рамках набора.
- **Naming:** semantic (icon_siege, icon_disruption, icon_integration, icon_damaged_road, icon_money, icon_science, icon_victory_military, icon_victory_economic, icon_victory_tech).

---

## 5) Color system

### 5.1 Neutrals

| Token | Use |
|-------|-----|
| neutral_bg | Фон экрана |
| neutral_surface | Панели, карточки |
| neutral_text | Основной текст |
| neutral_text_secondary | Вторичный текст |
| neutral_border | Границы |

### 5.2 Semantic

| Token | Use |
|-------|-----|
| accent | Основные кнопки, ссылки |
| danger | HP ≤30%, Declare War, ошибки |
| warning | Предупреждения |
| success | Подтверждения, мир, союз |

### 5.3 Faction colors

- Слоты для 7+ цивилизаций: `faction_1` … `faction_7` (и скрытая).
- Используются для territory borders, unit tint, списков.
- Конкретные RGB — в арт-пайплайне; здесь только правила.

---

## 6) Accessibility

- **Контраст:** текст на фоне ≥ 4.5:1 (WCAG AA).
- **Colorblind-safe:** не полагаться только на цвет; дублировать иконками/текстом.
- **Focus:** видимый focus ring для клавиатурной навигации.
