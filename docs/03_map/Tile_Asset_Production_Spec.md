# Tile Asset Production Spec
Red Age Strategy
Version: v1.0

**Canonical path:** `docs/03_map/Tile_Asset_Production_Spec.md`

Канон: [`Tile_Style_Bible.md`](Tile_Style_Bible.md), [`Map_Design_Spec.md`](Map_Design_Spec.md) §5, [`Tile_Asset_List.md`](Tile_Asset_List.md).

---

## 1. Purpose

Technical requirements for producing, exporting, and validating tile art assets. This document specifies format, size, naming, palette compliance, and quality checks that every sprite must pass before it enters the atlas.

Intended audience: artists (human or AI pipeline operators).

---

## 2. Export Format

| Parameter | Value | Notes |
|-----------|-------|-------|
| Format | PNG | RGBA for individual sprites |
| Color depth | 32-bit (8 per channel) | Final atlas is PNG-8+alpha |
| Base size | **96x96 px** | `BASE_TILE_SIZE` from Map_Design_Spec §2.1 |
| Retina (@2x) | 192x192 px | Optional, post-MVP |
| Background | Transparent | No solid bg on individual sprites |
| Compression | Maximum (lossless) | pngquant/optipng for atlas step |

**Props, badges, ports:** export at their native size (see Tile_Asset_List.md for per-asset dimensions). Do NOT upscale to 96x96.

---

## 3. Palette Reference

**Canonical source:** Tile_Style_Bible §5.

All terrain art must stay within these hue families. Exact hex values are starting points; artists may vary within the same hue/saturation range.

### 3.1 Terrain palette

| Terrain | Base | Shadow | Highlight |
|---------|------|--------|-----------|
| PLAIN | `#8BCF5A` | `#6FAE42` | `#A6E57A` |
| FOREST | `#2F8F3A` | `#216A2A` | `#47B552` |
| MOUNTAIN | `#9A9FA5` | `#6D737A` | `#D1D6DC` |
| DESERT | `#E5C16A` | `#CFA54F` | `#F2D995` |
| WATER | `#3D8FD1` | `#2B6DA4` | `#5BAED6` |

### 3.2 Supplementary colors

| Element | Hex | Usage |
|---------|-----|-------|
| Beach / shoreline | `#F1E0A0` | Coastline overlay strip |
| River stroke | `#5BAED6` | Same as WATER highlight |
| Fog fill | `#1A1A2E` | @ 85% opacity |

> **Discrepancy note:** Map_Design_Spec §5.1 uses slightly different placeholder hex values (e.g. PLAIN `#8FBF5A` instead of `#8BCF5A`). Those are implementation placeholders. **Tile_Style_Bible §5 is the canonical palette** for art production.

---

## 4. Naming Convention

**Canonical source:** Map_Design_Spec §5.2.

### 4.1 Pattern

```
{category}_{element}_{variant}.png
```

- Lowercase, snake_case
- No spaces, no uppercase
- Variant index: zero-based integer (`v0`, `v1`, ...) for terrain; plain integer (`0`, `1`, ...) for props

### 4.2 Examples

| Category | Example |
|----------|---------|
| Terrain | `terrain_plain_v0.png`, `terrain_forest_v3.png` |
| Prop | `prop_tree_0.png`, `prop_cactus_2.png` |
| Coast | `coast_edge_n.png`, `coast_corner_se.png` |
| Blend | `blend_plain_forest_h.png`, `blend_desert_mountain_v.png` |
| Overlay | `overlay_river.png`, `overlay_road_l2.png` |
| Marker | `marker_city_l3.png`, `marker_port_l1.png` |
| Badge | `badge_siege.png`, `badge_integration.png` |
| Fog | `fog_unexplored.png`, `fog_edge_n.png` |

> **Discrepancy note:** Tile_Style_Bible §13 uses a different convention (`terrain/<type>/variant_<n>.png`). For the rendering pipeline, **Map_Design_Spec §5.2 flat naming** is canonical. The Tile_Style_Bible convention is for artist folder organization only.

---

## 5. Prop Constraints

From Tile_Style_Bible §3 (safe zones) and §10 (density):

| Rule | Value |
|------|-------|
| Max props per tile | 0-3 |
| Max coverage | 30% of tile area |
| Center zone | Keep clean (unit placement) |
| Road centerline | No props within road_width/2 |
| Badge zone | Upper-right corner reserved (16x16) |
| Resource icon zone | Lower-right corner reserved (16x16) |
| River stroke zone | No props on river path |
| City/capital anchor | No props at city marker center |

Props must NOT obscure: units, cities, HP numbers, resource icons, roads, status badges.

---

## 6. Variant Rules

From Tile_Style_Bible §9:

**Variants MAY change:**
- Prop placement within tile
- Small shape details (slightly different rock angle, tree crown shape)
- Minor highlight/shadow shifts

**Variants MUST NOT change:**
- Terrain recognition (each type must be instantly identifiable)
- Gameplay readability
- Unit/city anchor geometry
- Base color family (stay within palette hue range)

Variant selection at runtime: `fnv1a(tileIndex * 31 + seed * 17 + 0xBEEF) % variantCount` (Map_Design_Spec §11).

---

## 7. Atlas Packing Rules

From Map_Design_Spec §5.3:

| Parameter | Value |
|-----------|-------|
| Atlas max size | 2048x2048 px |
| Format | PNG-8 with alpha channel |
| Target file size | < 500 KB |
| Packer tool | TexturePacker |
| Output format | JSON hash + PNG (`map_atlas.json` + `map_atlas.png`) |
| Padding | 1px between sprites (bleed prevention) |
| Trim | Enabled (remove transparent edges) |
| Rotation | Disabled (simplifies UV math) |

All 81 MVP sprites fit in a single atlas (~18% utilization). No multi-atlas needed for MVP.

---

## 8. LOD Considerations

From Map_Design_Spec §9:

| LOD | Zoom range | What renders | Asset implication |
|-----|-----------|-------------|-------------------|
| LOD-0 | 0.15-0.29 | Flat color fill only | No sprite needed; runtime fills rect with base hex |
| LOD-1 | 0.30-0.69 | Terrain sprite + silhouettes + props | All P0+P1 sprites used |
| LOD-2 | 0.70-2.00 | Full detail + blends + badges | All sprites used |

**Implication for artists:**
- Terrain base sprites must be recognizable at LOD-1 scale (30% of native).
- Mountain silhouette must remain clear at ~29px effective size.
- Props below ~10px effective size are hidden by renderer (no need to optimize for sub-10px).

---

## 9. Quality Checklist

Every sprite must pass ALL checks before entering the atlas:

| # | Check | Pass criteria |
|---|-------|--------------|
| 1 | **Size** | Matches spec dimensions (96x96 for terrain, etc.) |
| 2 | **Format** | PNG, 32-bit RGBA, transparent background |
| 3 | **Naming** | Matches Map_Design_Spec §5.2 convention exactly |
| 4 | **Palette** | Colors within Tile_Style_Bible §5 hue family |
| 5 | **No text** | Zero text, labels, or watermarks in sprite |
| 6 | **No artifacts** | No JPEG artifacts, no aliased edges against transparent bg |
| 7 | **Center clean** | Center of terrain tile is visually uncluttered (for unit placement) |
| 8 | **Silhouette test** | Recognizable at 30% scale (simulate LOD-1) |
| 9 | **Tiling** | Terrain bases tile seamlessly with adjacent tiles of same type |
| 10 | **Prop coverage** | Props occupy <= 30% of tile area |
| 11 | **Style** | Polytopia-inspired: flat shading, clean shapes, no photorealism |
| 12 | **No noise** | No heavy procedural noise, grunge, or high-frequency textures |
| 13 | **Variant distinction** | Variants are visibly different from each other |
| 14 | **Variant consistency** | Variants of same type are still recognizable as that type |
| 15 | **Edge bleed** | No opaque pixels on sprite edge (1px transparent border) |

---

## 10. Forbidden Styles

From Tile_Style_Bible §14:

- Photorealism
- Pixel-art
- Watercolor / painted maps
- Heavy grunge / noise
- High-frequency texture detail
- Civ-style micro-details that reduce readability at zoom-out

**Required:** clean, readable, stylized strategy map look. Polytopia-inspired.

---

## 11. Acceptance Criteria

An art deliverable is accepted when:

1. All sprites in `Tile_Asset_List.md` (priority P0 at minimum) are delivered
2. Every sprite passes the Quality Checklist (§9)
3. Atlas packs successfully (TexturePacker, 2048x2048, < 500 KB)
4. Each terrain type is recognizable at LOD-1 zoom in under 0.5 seconds
5. Props do not obscure any gameplay marker (visual spot-check)
6. Rivers, roads, and coastlines remain readable at LOD-1 zoom
7. Variants reduce visual repetition without hurting recognition
8. The overall map feel is Polytopia-inspired in readability and color harmony
