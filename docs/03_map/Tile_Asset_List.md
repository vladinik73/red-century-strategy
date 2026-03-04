# Tile Asset List
Red Age Strategy
Version: v1.0

**Canonical path:** `docs/03_map/Tile_Asset_List.md`

Канон: [`Tile_Style_Bible.md`](Tile_Style_Bible.md), [`Map_Design_Spec.md`](Map_Design_Spec.md) §5.

---

## 1. Purpose

Complete inventory of **every sprite** required for the MVP map renderer. Each entry specifies filename, size, variant count, and priority tier.

Data source: `Map_Design_Spec.md` §5.1-5.3 (filenames, sizes) + `Tile_Style_Bible.md` (palette, style).

---

## 2. Summary

| # | Category | Sprites | Priority | Notes |
|---|----------|--------:|----------|-------|
| 1 | Terrain bases | 16 | P0 | 5 types x variants (4+4+3+3+2) |
| 2 | Props | 17 | P1 | 6 prop types, per-terrain |
| 3 | Coastline fragments | 8 | P1 | 4 edges + 4 corners |
| 4 | Edge blends | 12 | P2 | 6 transitions x h/v |
| 5 | River overlay | 1 | P1 | Centerline stroke |
| 6 | Road overlays | 4 | P1 | L1-L3 + bridge |
| 7 | Port markers | 3 | P1 | L1-L3 |
| 8 | City markers | 7 | P0 | L1-L5 + capital + neutral |
| 9 | Fog sprites | 9 | P0 | 1 fill + 4 edge + 4 corner |
| 10 | Status badges | 4 | P2 | Siege, disruption, integration, damaged road |
| | **TOTAL** | **81** | | |

---

## 3. Terrain Bases (16 sprites)

All terrain bases: **96x96 px**, PNG RGBA.

| # | Terrain | Filename | Variants | Base hex | Shadow hex | Highlight hex |
|---|---------|----------|:--------:|----------|------------|---------------|
| 1 | PLAIN v0 | `terrain_plain_v0.png` | 4 | `#8BCF5A` | `#6FAE42` | `#A6E57A` |
| 2 | PLAIN v1 | `terrain_plain_v1.png` | | | | |
| 3 | PLAIN v2 | `terrain_plain_v2.png` | | | | |
| 4 | PLAIN v3 | `terrain_plain_v3.png` | | | | |
| 5 | FOREST v0 | `terrain_forest_v0.png` | 4 | `#2F8F3A` | `#216A2A` | `#47B552` |
| 6 | FOREST v1 | `terrain_forest_v1.png` | | | | |
| 7 | FOREST v2 | `terrain_forest_v2.png` | | | | |
| 8 | FOREST v3 | `terrain_forest_v3.png` | | | | |
| 9 | MOUNTAIN v0 | `terrain_mountain_v0.png` | 3 | `#9A9FA5` | `#6D737A` | `#D1D6DC` |
| 10 | MOUNTAIN v1 | `terrain_mountain_v1.png` | | | | |
| 11 | MOUNTAIN v2 | `terrain_mountain_v2.png` | | | | |
| 12 | DESERT v0 | `terrain_desert_v0.png` | 3 | `#E5C16A` | `#CFA54F` | `#F2D995` |
| 13 | DESERT v1 | `terrain_desert_v1.png` | | | | |
| 14 | DESERT v2 | `terrain_desert_v2.png` | | | | |
| 15 | WATER v0 | `terrain_water_v0.png` | 2 | `#3D8FD1` | `#2B6DA4` | `#5BAED6` |
| 16 | WATER v1 | `terrain_water_v1.png` | | | | |

Palette: **Tile_Style_Bible §5** (canonical). Map_Design_Spec §5.1 placeholder values may differ slightly.

---

## 4. Props (17 sprites)

Props are decorative overlays placed on terrain tiles. Max 0-3 per tile, coverage must not exceed 30% tile area.

| # | Prop | Filename | Variants | Size | Terrain |
|---|------|----------|:--------:|------|---------|
| 1 | Tree 0 | `prop_tree_0.png` | 4 | ~50px h | FOREST |
| 2 | Tree 1 | `prop_tree_1.png` | | ~50px h | FOREST |
| 3 | Tree 2 | `prop_tree_2.png` | | ~50px h | FOREST |
| 4 | Tree 3 | `prop_tree_3.png` | | ~50px h | FOREST |
| 5 | Rock 0 | `prop_rock_0.png` | 3 | ~40px h | MOUNTAIN |
| 6 | Rock 1 | `prop_rock_1.png` | | ~40px h | MOUNTAIN |
| 7 | Rock 2 | `prop_rock_2.png` | | ~40px h | MOUNTAIN |
| 8 | Peak 0 | `prop_peak_0.png` | 2 | ~60px h | MOUNTAIN |
| 9 | Peak 1 | `prop_peak_1.png` | | ~60px h | MOUNTAIN |
| 10 | Grass 0 | `prop_grass_0.png` | 3 | ~15px h | PLAIN |
| 11 | Grass 1 | `prop_grass_1.png` | | ~15px h | PLAIN |
| 12 | Grass 2 | `prop_grass_2.png` | | ~15px h | PLAIN |
| 13 | Cactus 0 | `prop_cactus_0.png` | 3 | ~35px h | DESERT |
| 14 | Cactus 1 | `prop_cactus_1.png` | | ~35px h | DESERT |
| 15 | Cactus 2 | `prop_cactus_2.png` | | ~35px h | DESERT |
| 16 | Dune 0 | `prop_dune_0.png` | 2 | ~20px h | DESERT |
| 17 | Dune 1 | `prop_dune_1.png` | | ~20px h | DESERT |

Style: Polytopia-inspired. Round crowns for trees, angular/triangular rocks, smooth dune curves. See Tile_Style_Bible §6 for per-terrain rules.

---

## 5. Coastline Fragments (8 sprites)

Per Map_Design_Spec §7.4: 8-fragment MVP system (no 256-variant).

| # | Fragment | Filename | Size | Description |
|---|----------|----------|------|-------------|
| 1 | Edge N | `coast_edge_n.png` | 96x4 | North edge beach strip |
| 2 | Edge S | `coast_edge_s.png` | 96x4 | South edge beach strip |
| 3 | Edge E | `coast_edge_e.png` | 4x96 | East edge beach strip |
| 4 | Edge W | `coast_edge_w.png` | 4x96 | West edge beach strip |
| 5 | Corner NE | `coast_corner_ne.png` | ~16x16 | Northeast corner fill |
| 6 | Corner NW | `coast_corner_nw.png` | ~16x16 | Northwest corner fill |
| 7 | Corner SE | `coast_corner_se.png` | ~16x16 | Southeast corner fill |
| 8 | Corner SW | `coast_corner_sw.png` | ~16x16 | Southwest corner fill |

Beach color: `#F1E0A0` (Tile_Style_Bible §5).

---

## 6. Edge Blends (12 sprites)

Per Map_Design_Spec §12: 6 transition pairs, each with horizontal and vertical variant.

| # | Transition | Filename (h) | Filename (v) |
|---|-----------|--------------|--------------|
| 1 | PLAIN / FOREST | `blend_plain_forest_h.png` | `blend_plain_forest_v.png` |
| 2 | PLAIN / DESERT | `blend_plain_desert_h.png` | `blend_plain_desert_v.png` |
| 3 | PLAIN / MOUNTAIN | `blend_plain_mountain_h.png` | `blend_plain_mountain_v.png` |
| 4 | FOREST / MOUNTAIN | `blend_forest_mountain_h.png` | `blend_forest_mountain_v.png` |
| 5 | DESERT / MOUNTAIN | `blend_desert_mountain_h.png` | `blend_desert_mountain_v.png` |
| 6 | FOREST / DESERT | `blend_forest_desert_h.png` | `blend_forest_desert_v.png` |

Rendered at LOD-1+ only. Separate sprites above terrain base.

---

## 7. Overlays (5 sprites)

### 7.1 River (1)

| # | Asset | Filename | Description |
|---|-------|----------|-------------|
| 1 | River centerline | `overlay_river.png` | Stroke `#5BAED6`, width 0.25-0.35 x 96px. Render: above terrain, below roads |

### 7.2 Roads (3 + 1 bridge)

| # | Asset | Filename | Description |
|---|-------|----------|-------------|
| 2 | Road L1 | `overlay_road_l1.png` | Thin (2px logical), light tan |
| 3 | Road L2 | `overlay_road_l2.png` | Medium (4px), darker tan |
| 4 | Road L3 | `overlay_road_l3.png` | Wide (6px), with border |
| 5 | Bridge | `overlay_bridge.png` | Road on WATER tile + supports |

Road intersections are procedural (segment-based, bitmasking). Not separate sprites.

---

## 8. Port Markers (3 sprites)

| # | Level | Filename | Size | Description |
|---|-------|----------|------|-------------|
| 1 | Port L1 | `marker_port_l1.png` | 16x16 | Small pier |
| 2 | Port L2 | `marker_port_l2.png` | 20x20 | Medium port |
| 3 | Port L3 | `marker_port_l3.png` | 24x24 | Large port with crane |

Ports only on WATER tiles within city territory.

---

## 9. City Markers (7 sprites)

| # | Asset | Filename | Size | Description |
|---|-------|----------|------|-------------|
| 1 | City L1 | `marker_city_l1.png` | 96x96 | Scale 1.0. Color = faction |
| 2 | City L2 | `marker_city_l2.png` | 96x96 | Scale 1.1 |
| 3 | City L3 | `marker_city_l3.png` | 96x96 | Scale 1.2 |
| 4 | City L4 | `marker_city_l4.png` | 96x96 | Scale 1.3 |
| 5 | City L5 | `marker_city_l5.png` | 96x96 | Scale 1.4 |
| 6 | Capital crown | `marker_capital.png` | 16x16 | Badge over city marker |
| 7 | Neutral city | `marker_city_neutral.png` | 96x96 | Gray variant |

Detailed spec: `docs/10_uiux/City_Visual_Spec.md`.

---

## 10. Fog Sprites (9 sprites)

| # | Asset | Filename | Size | Description |
|---|-------|----------|------|-------------|
| 1 | Fog fill | `fog_unexplored.png` | 96x96 | Fill `#1A1A2E` @ 85% opacity |
| 2 | Fog edge N | `fog_edge_n.png` | 96x8 | Gradient: fog to transparent |
| 3 | Fog edge S | `fog_edge_s.png` | 96x8 | Gradient: fog to transparent |
| 4 | Fog edge E | `fog_edge_e.png` | 8x96 | Gradient: fog to transparent |
| 5 | Fog edge W | `fog_edge_w.png` | 8x96 | Gradient: fog to transparent |
| 6 | Fog corner NE | `fog_edge_ne.png` | 8x8 | Corner transition |
| 7 | Fog corner NW | `fog_edge_nw.png` | 8x8 | Corner transition |
| 8 | Fog corner SE | `fog_edge_se.png` | 8x8 | Corner transition |
| 9 | Fog corner SW | `fog_edge_sw.png` | 8x8 | Corner transition |

Fog edge: 4px gradient (per Map_Design_Spec OQ #4 resolution).

---

## 11. Status Badges (4 sprites)

| # | Badge | Filename | Size | Description |
|---|-------|----------|------|-------------|
| 1 | Siege | `badge_siege.png` | 16x16 | Crossed swords |
| 2 | Disruption | `badge_disruption.png` | 16x16 | Lightning bolt |
| 3 | Integration | `badge_integration.png` | 16x16 | Clock + number overlay |
| 4 | Damaged road | `badge_damaged_road.png` | 16x16 | Cracked line |

Positioned: upper-right corner of tile (fixed position). Per Map_Design_Spec §4.4.

---

## 12. Priority Tiers

| Tier | Assets | Count | Rationale |
|------|--------|------:|-----------|
| **P0 - Block** | Terrain bases, city markers, fog | 32 | Map is unrenderable without these |
| **P1 - Core** | Props, coastlines, river, roads, ports | 30 | Gameplay-visible elements |
| **P2 - Polish** | Edge blends, status badges | 16 | Visual polish, LOD-1+ only |
| | **Total** | **78** | +3 procedural (road intersections, territory borders, grid) |

**P0** must be complete before any playtesting.
**P1** should be complete for MVP.
**P2** can ship with flat-color fallbacks.

---

## 13. Atlas Budget

| Metric | Value |
|--------|-------|
| Total sprites | 81 (+ procedural) |
| Atlas size | 2048x2048 px max |
| Format | PNG-8 with alpha |
| Target file size | < 500 KB |
| Packer | TexturePacker (JSON + PNG) |
| Output | `assets/atlas/map_atlas.json` + `map_atlas.png` |

At 81 sprites with average ~96x96, total pixel area is ~747K px. Atlas capacity = 2048x2048 = 4.19M px. Utilization: ~18% — plenty of room for future assets.

---

## 14. Directory Structure

Per Map_Design_Spec §5.2:

```
assets/
  terrain/       (16 files)
  props/         (17 files)
  coast/         (8 files)
  blends/        (12 files)
  overlays/      (5 files: river + roads + bridge)
  markers/       (10 files: cities + ports)
    badge_*.png  (4 files)
  fog/           (9 files)
  atlas/
    map_atlas.png
    map_atlas.json
```

> Note: fog sprites are listed under `overlays/` in Map_Design_Spec §5.2. Grouping into `fog/` is a suggestion for clarity; either layout is acceptable.

---

## 15. Verification Checklist

| # | Check | Expected | Source |
|---|-------|----------|--------|
| 1 | Total sprite count | 81 | Sum of §3-§11 |
| 2 | Terrain variant count | 16 (4+4+3+3+2) | Map_Design_Spec §11, Tile_Style_Bible §9 |
| 3 | Prop count | 17 (4+3+2+3+3+2) | Map_Design_Spec §5.1 |
| 4 | Coastline fragment count | 8 (4 edge + 4 corner) | Map_Design_Spec §7.4 |
| 5 | Blend count | 12 (6 pairs x h/v) | Map_Design_Spec §12 |
| 6 | Overlay count | 5 (1 river + 3 road + 1 bridge) | Map_Design_Spec §5.1 |
| 7 | Only 5 terrain types used | PLAIN, FOREST, MOUNTAIN, DESERT, WATER | tile.schema.json |
| 8 | Palette hex values match Tile_Style_Bible §5 | PLAIN `#8BCF5A`, FOREST `#2F8F3A`, MOUNTAIN `#9A9FA5`, DESERT `#E5C16A`, WATER `#3D8FD1` | Tile_Style_Bible §5 |
| 9 | Filenames follow Map_Design_Spec §5.2 pattern | `{category}_{element}_{variant}.png` | Map_Design_Spec §5.2 |
| 10 | Atlas budget fits 2048x2048 | ~18% utilization at 81 sprites | Map_Design_Spec §5.3 |
| 11 | All P0 sprites identified | 32 (16 terrain + 7 city + 9 fog) | §12 |
| 12 | No new terrain/resource types introduced | True | Canon constraint |
