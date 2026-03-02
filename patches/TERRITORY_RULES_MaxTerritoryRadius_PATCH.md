### MaxTerritoryRadius (v4.16)

- `MaxTerritoryRadius = 5`
- `TerritoryRadius` города ∈ [1..MaxTerritoryRadius]
- При выборе награды апгрейда **Expand Territory**: `TerritoryRadius = min(TerritoryRadius + 1, MaxTerritoryRadius)`
- Если `TerritoryRadius == MaxTerritoryRadius`, дальнейшее расширение недоступно (UI скрывает/disable опцию).
