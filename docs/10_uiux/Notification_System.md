# Notification System (v4.40)

Канон: `docs/10_uiux/Main_Game_Screen.md` (toast-уведомления).

---

## 1) Toast queue rules

- **Очередь:** FIFO. Новые toast добавляются в конец.
- **Max queue:** 5 (при переполнении — удалить самый старый).
- **Duration:** 3–5 сек по умолчанию.
- **Dismissal:** клик по toast или таймаут — скрыть.
- **Stacking:** не более 3 видимых одновременно; остальные в очереди.

---

## 2) Priority

- **High:** Incoming Proposal (дипломатия), Defeat, Victory.
- **Normal:** City captured, Tech unlocked, Victory timer started.
- **Low:** Disruption applied, Road damaged, прочие.

- High прерывает показ текущего toast или показывается поверх.

---

## 3) AI turn summary toast

- В конце хода AI: опционально краткий toast «Ход [CivName] завершён».
- Не блокирует; можно отключить в Settings.

---

## 4) Event → Toast mapping (примеры)

| Event / Situation | Toast text |
|-------------------|------------|
| CAPTURE_CITY | «Город [CityName] захвачен» |
| CYBER_DISRUPT | «Сбой применён к [CityName]» |
| TECH_UNLOCK | «Технология [TechName] изучена» |
| VICTORY_TRIGGER | «Таймер победы запущен» |
| DECLARE_WAR (incoming) | «[CivName] объявила войну» |
| FORM_ALLIANCE | «Союз с [CivName]» |
