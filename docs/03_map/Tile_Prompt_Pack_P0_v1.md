# Tile Prompt Pack — P0 Assets (v1)
Red Age Strategy
Version: v1.0

**Canonical path:** `docs/03_map/Tile_Prompt_Pack_P0_v1.md`

**Scope:** Ready-to-run prompts for **P0 assets only** (terrain bases + fog sprites). P1/P2 assets (props, coastlines, blends, roads, ports, badges) are out of scope for this pack.

---

## 0. Canon Links

| Document | What it controls |
|----------|-----------------|
| [`Tile_Style_Bible.md`](Tile_Style_Bible.md) | Visual style rules, palette (canonical HEX), terrain variant counts, forbidden styles |
| [`Map_Design_Spec.md`](Map_Design_Spec.md) | Rendering pipeline, naming convention (§5.2), tile size, LOD rules |
| [`Tile_Asset_List.md`](Tile_Asset_List.md) | Complete sprite inventory with filenames, sizes, priority tiers |
| [`Tile_Asset_Production_Spec.md`](Tile_Asset_Production_Spec.md) | Export format, palette compliance, quality checklist |
| [`Tile_Generation_Prompts.md`](Tile_Generation_Prompts.md) | Full prompt reference (all tiers) + tool-specific params + iteration notes |

> This prompt pack is a **focused subset** of `Tile_Generation_Prompts.md`, containing only P0 terrain + fog prompts with tightened palette/style constraints. If anything conflicts, `Tile_Style_Bible.md` wins.

---

## 1. Global Style Prefix

Prepend this block to **every** terrain prompt:

```
Top-down 2D strategy tile, flat shading, limited palette, clean outline,
no gradients beyond base/shadow/highlight triplet, Polytopia-inspired style,
clean vector-like shapes, soft edge, saturated but controlled colors,
game tile sprite, square composition, transparent background,
no text, no watermarks, centered, consistent top-left light direction
```

---

## 2. Strict Negative Prompt

Append as negative / `--no` / avoid instruction for **every** generation:

```
photorealism, photograph, camera, pixel art, 8-bit, retro pixels,
watercolor, oil painting, painted look, grunge texture, noise,
film grain, dirty, scratched, noisy textures, heavy texture detail,
realistic shadows, ray tracing, complex lighting, reflections, caustics,
perspective view, isometric, 3D render, depth of field,
text, labels, letters, numbers, watermark, signature, logo,
border, frame, vignette, blurry, low quality, artifacts, JPEG,
multiple tiles, tileset sheet, spritesheet, grid
```

---

## 3. Palette Lock

**Canonical source: Tile_Style_Bible §5.**

The generator MUST respect these exact HEX starting points. Minor hue variation within the same color family is allowed; shifting to a different hue is not.

### 3.1 Terrain palette (Base / Shadow / Highlight)

| Terrain | Base | Shadow | Highlight |
|---------|------|--------|-----------|
| PLAIN | `#8BCF5A` | `#6FAE42` | `#A6E57A` |
| FOREST | `#2F8F3A` | `#216A2A` | `#47B552` |
| MOUNTAIN | `#9A9FA5` | `#6D737A` | `#D1D6DC` |
| DESERT | `#E5C16A` | `#CFA54F` | `#F2D995` |
| WATER | `#3D8FD1` | `#2B6DA4` | `#5BAED6` |

### 3.2 Fog palette

| Element | HEX | Alpha |
|---------|-----|-------|
| Fog fill | `#1A1A2E` | 85% (216/255) |

### 3.3 Palette tolerance rule

After generation, run a post-processing palette check:
- Dominant hue must match terrain family (green for PLAIN/FOREST, gray for MOUNTAIN, gold for DESERT, blue for WATER, dark navy for FOG).
- If > 10% of opaque pixels fall outside the Base/Shadow/Highlight triplet family (hue shift > 15 degrees), the sprite fails QA and must be color-corrected.

> **Note:** Map_Design_Spec §5.1 uses slightly different placeholder hex values (e.g. PLAIN `#8FBF5A`). Those are implementation placeholders. **Tile_Style_Bible §5 is canonical** for art production.

---

## 4. Export Constraints

Per `Tile_Asset_Production_Spec.md` §2 and `Map_Design_Spec.md` §2.1:

| Constraint | Value |
|------------|-------|
| Size (terrain) | **96 x 96 px** |
| Size (fog fill) | **96 x 96 px** |
| Size (fog edges) | **96 x 8 px** (N/S) or **8 x 96 px** (E/W) |
| Size (fog corners) | **8 x 8 px** |
| Format | PNG, 32-bit RGBA |
| Background | **Transparent** (alpha = 0) |
| Light direction | **Consistent top-left** (upper-left highlight, lower-right shadow) for all terrain sprites |
| Edges | **Crisp** — no feathered anti-aliasing bleeding into transparent area; 1px transparent border |
| Readability | Must be recognizable at **0.30x zoom** (LOD-1 test: ~29x29 px effective) |

---

## 5. Naming Convention

**Canonical source: Map_Design_Spec §5.2.**

Pattern: `{category}_{element}_{variant}.png` (lowercase, snake_case, zero-based variants).

### 5.1 P0 terrain filenames (16 sprites)

| # | Filename | Terrain | Variant |
|---|----------|---------|---------|
| 1 | `terrain_plain_v0.png` | PLAIN | v0 |
| 2 | `terrain_plain_v1.png` | PLAIN | v1 |
| 3 | `terrain_plain_v2.png` | PLAIN | v2 |
| 4 | `terrain_plain_v3.png` | PLAIN | v3 |
| 5 | `terrain_forest_v0.png` | FOREST | v0 |
| 6 | `terrain_forest_v1.png` | FOREST | v1 |
| 7 | `terrain_forest_v2.png` | FOREST | v2 |
| 8 | `terrain_forest_v3.png` | FOREST | v3 |
| 9 | `terrain_mountain_v0.png` | MOUNTAIN | v0 |
| 10 | `terrain_mountain_v1.png` | MOUNTAIN | v1 |
| 11 | `terrain_mountain_v2.png` | MOUNTAIN | v2 |
| 12 | `terrain_desert_v0.png` | DESERT | v0 |
| 13 | `terrain_desert_v1.png` | DESERT | v1 |
| 14 | `terrain_desert_v2.png` | DESERT | v2 |
| 15 | `terrain_water_v0.png` | WATER | v0 |
| 16 | `terrain_water_v1.png` | WATER | v1 |

### 5.2 P0 fog filenames (9 sprites)

| # | Filename | Size | Description |
|---|----------|------|-------------|
| 1 | `fog_unexplored.png` | 96x96 | Full-tile fog fill |
| 2 | `fog_edge_n.png` | 96x8 | North edge gradient |
| 3 | `fog_edge_s.png` | 96x8 | South edge gradient |
| 4 | `fog_edge_e.png` | 8x96 | East edge gradient |
| 5 | `fog_edge_w.png` | 8x96 | West edge gradient |
| 6 | `fog_edge_ne.png` | 8x8 | NE corner transition |
| 7 | `fog_edge_nw.png` | 8x8 | NW corner transition |
| 8 | `fog_edge_se.png` | 8x8 | SE corner transition |
| 9 | `fog_edge_sw.png` | 8x8 | SW corner transition |

**Total P0 sprites in this pack: 25** (16 terrain + 9 fog).

> City markers (7 sprites, also P0) are excluded from this prompt pack because they require faction-color parameterization and a separate visual spec (`docs/10_uiux/City_Visual_Spec.md`).

---

## 6. Terrain Base Prompts

### How to use

1. Copy **Global Style Prefix** (§1)
2. Append **terrain-specific prompt** below
3. Add **Negative Prompt** (§2) as negative/avoid
4. Generate at 512x512+ then post-process to 96x96

---

### 6.1 PLAIN (4 variants)

**Base prompt:**

```
Flat grassland game tile, smooth green surface, top-down view,
bright spring green fill (#8BCF5A), soft lighter highlights (#A6E57A)
on upper-left, gentle darker shadows (#6FAE42) on lower-right,
minimal detail, very clean, subtle grass surface,
no complex patterns, single flat ground plane
```

**Per-variant instructions:**

| Variant | Filename | Instruction |
|---------|----------|-------------|
| v0 | `terrain_plain_v0.png` | Completely clean, no micro-props. Smooth flat green. Baseline reference tile |
| v1 | `terrain_plain_v1.png` | 1-2 tiny scattered pebbles near edges. Center remains clean |
| v2 | `terrain_plain_v2.png` | Subtle grass texture variation — slightly warmer green band across tile |
| v3 | `terrain_plain_v3.png` | Faint diagonal shadow stripe across tile (wind effect). Still flat and clean |

---

### 6.2 FOREST (4 variants)

**Base prompt:**

```
Forest game tile viewed from directly above, clustered stylized trees,
round blob-shaped tree canopies, Polytopia-style treetops,
deep green canopy (#2F8F3A), darker inter-canopy shadows (#216A2A),
brighter leaf highlights on top-left of each crown (#47B552),
ground barely visible between canopies as dark gaps,
2-4 tree crowns per tile, flat shading, no realistic bark or leaf detail
```

**Per-variant instructions:**

| Variant | Filename | Instruction |
|---------|----------|-------------|
| v0 | `terrain_forest_v0.png` | 3 round-crown trees in tight cluster, slightly overlapping canopies |
| v1 | `terrain_forest_v1.png` | 4 trees, slightly more spread, smaller crowns |
| v2 | `terrain_forest_v2.png` | 2 large canopies + 1 small canopy tucked between them |
| v3 | `terrain_forest_v3.png` | 3 trees where one crown is slightly elongated (oval instead of round) |

---

### 6.3 MOUNTAIN (3 variants)

**Base prompt:**

```
Mountain game tile viewed from directly above, sharp stylized peak,
triangular rock formation, gray stone (#9A9FA5),
clear bright highlight (#D1D6DC) on upper-left slope,
dark shadow (#6D737A) on lower-right slope,
no realistic rock texture, clean geometric triangular shapes,
strong silhouette that reads clearly at small size,
peak visible as angular shape against flat surrounding
```

**Per-variant instructions:**

| Variant | Filename | Instruction |
|---------|----------|-------------|
| v0 | `terrain_mountain_v0.png` | Single prominent centered peak, symmetric triangle |
| v1 | `terrain_mountain_v1.png` | Two peaks — main large + secondary smaller, offset |
| v2 | `terrain_mountain_v2.png` | Single peak with different ridge angle (rotated ~30 degrees) |

---

### 6.4 DESERT (3 variants)

**Base prompt:**

```
Desert game tile viewed from directly above, smooth sand surface,
gentle curved dune shapes, warm golden sand (#E5C16A),
subtle darker shadow curves (#CFA54F) on lower-right edges,
bright sand highlights (#F2D995) on upper-left,
very low texture noise, clean and sparse, open feeling,
no complex patterns, no cracks, no scattered rocks
```

**Per-variant instructions:**

| Variant | Filename | Instruction |
|---------|----------|-------------|
| v0 | `terrain_desert_v0.png` | Single smooth dune ridge running diagonally |
| v1 | `terrain_desert_v1.png` | Two gentle parallel dune curves |
| v2 | `terrain_desert_v2.png` | Flat sand with subtle wind lines — minimal elevation |

---

### 6.5 WATER (2 variants)

**Base prompt:**

```
Ocean water game tile viewed from directly above, smooth blue surface,
medium blue fill (#3D8FD1), subtle darker depth areas (#2B6DA4),
gentle simple wave highlights (#5BAED6) as thin curved lines,
no reflections, no complex caustics, no foam, no white caps,
clean flat water, calm sea, no fish or objects
```

**Per-variant instructions:**

| Variant | Filename | Instruction |
|---------|----------|-------------|
| v0 | `terrain_water_v0.png` | Subtle horizontal wave hint lines, evenly spaced |
| v1 | `terrain_water_v1.png` | Slight circular ripple pattern, concentric arcs |

---

## 7. Fog Prompts

Fog sprites overlay terrain to represent UNEXPLORED tiles. They are **not terrain** — they are UI overlay sprites with specific alpha requirements.

### 7.1 Fog fill

**Filename:** `fog_unexplored.png`
**Size:** 96 x 96 px

```
Solid dark navy game overlay tile, uniform fill color #1A1A2E,
flat opaque fill at 85% opacity (alpha ~217),
no texture, no noise, no gradient, no pattern,
completely uniform, square tile, transparent edges: none
```

**Notes:**
- This is essentially a flat rectangle with `rgba(26, 26, 46, 0.85)`.
- Can be produced programmatically rather than AI-generated.
- Must tile seamlessly (no edge artifacts).

---

### 7.2 Fog edges (4 sprites)

Fog edges create a soft gradient transition between a fog-covered tile and an adjacent visible tile.

**Shared prompt base:**

```
Game UI overlay sprite, dark navy (#1A1A2E) gradient fading to fully transparent,
smooth linear gradient, no texture, no noise, clean transition,
used as fog-of-war edge in strategy game
```

| Filename | Size | Gradient direction | Prompt addition |
|----------|------|--------------------|-----------------|
| `fog_edge_n.png` | 96 x 8 | Top (opaque) to bottom (transparent) | "Horizontal strip 96px wide, 8px tall. Fog color at top row, fully transparent at bottom row" |
| `fog_edge_s.png` | 96 x 8 | Bottom (opaque) to top (transparent) | "Horizontal strip 96px wide, 8px tall. Fog color at bottom row, fully transparent at top row" |
| `fog_edge_e.png` | 8 x 96 | Right (opaque) to left (transparent) | "Vertical strip 8px wide, 96px tall. Fog color at right column, fully transparent at left column" |
| `fog_edge_w.png` | 8 x 96 | Left (opaque) to right (transparent) | "Vertical strip 8px wide, 96px tall. Fog color at left column, fully transparent at right column" |

**Alpha profile:** Linear gradient over 4px (per Map_Design_Spec OQ #4), remaining 4px fully opaque at fog alpha (85%).

**Recommendation:** Fog edges are better produced **programmatically** (canvas gradient or ImageMagick) than via AI generation. The output is a simple linear gradient — AI adds no value and may introduce unwanted artifacts.

---

### 7.3 Fog corners (4 sprites)

Corner sprites fill the diagonal transition where two fog edges meet.

| Filename | Size | Description |
|----------|------|-------------|
| `fog_edge_ne.png` | 8 x 8 | Radial gradient: opaque at top-right corner, transparent at bottom-left |
| `fog_edge_nw.png` | 8 x 8 | Radial gradient: opaque at top-left corner, transparent at bottom-right |
| `fog_edge_se.png` | 8 x 8 | Radial gradient: opaque at bottom-right corner, transparent at top-left |
| `fog_edge_sw.png` | 8 x 8 | Radial gradient: opaque at bottom-left corner, transparent at top-right |

**Alpha profile:** Radial from opaque corner (85% alpha at `#1A1A2E`) to transparent opposite corner, over ~6px diagonal distance.

**Recommendation:** Produce programmatically. 8x8 gradient corners are trivial to generate with canvas or ImageMagick.

---

### 7.4 Fog layering rules

Fog sprites are rendered at the **top of the render stack** (layer 14 per Map_Design_Spec §4.1):

```
Layering (bottom to top):
  ...
  ⑫ Territory border
  ⑬ UI overlays (selection, move range)
  ⑭ FOG ← fog_unexplored + edges/corners here
```

- `fog_unexplored.png` covers the entire tile.
- `fog_edge_*` sprites are placed along the border between a fog tile and a visible tile.
- `fog_edge_ne/nw/se/sw` corners are placed at corner junctions.
- All fog sprites use alpha blending (premultiplied alpha recommended).
- Fog must fully obscure terrain, props, units, and cities underneath.

---

## 8. Post-Processing Checklist

After generation, **every** sprite must pass these steps:

| # | Step | Action | Pass criteria | Tool |
|---|------|--------|--------------|------|
| 1 | **Background removal** | Remove any non-transparent background | Alpha = 0 everywhere outside the tile content | rembg / manual |
| 2 | **Crop & center** | Trim content, center on 96x96 canvas (terrain) or target size (fog) | Pixel-perfect dimensions, content centered | ImageMagick `convert -gravity center -extent 96x96` |
| 3 | **Palette correction** | Adjust hues to match Tile_Style_Bible §5 canonical HEX | Dominant hue within 15 degrees of target; base color pixel-sampled matches within `#10` per channel | GIMP curves / Photoshop Hue/Saturation |
| 4 | **Alpha cleanup** | Ensure no stray semi-transparent pixels outside content area | 1px transparent border on all edges of terrain sprites | Manual / script |
| 5 | **Edge bleed check** | Verify no opaque pixels touch the sprite boundary | All 4 edge rows/columns have alpha = 0 (for terrain) | Script: check edge pixels |
| 6 | **Readability test at 0.25x** | Downscale to 24x24 and confirm terrain type is recognizable | Each terrain visually distinct from others at thumbnail size | Side-by-side comparison |
| 7 | **Variant consistency** | Place all variants of same terrain in a row, confirm same "family" | Color family matches, silhouette language consistent | Grid layout |
| 8 | **Variant distinction** | Confirm variants are visibly different from each other | No two variants are pixel-identical or near-identical | Side-by-side diff |
| 9 | **Tiling test** | Place a 3x3 grid of same-terrain tiles; check for visible seam patterns | No obvious seam lines or jarring edges at tile boundaries | Tile preview tool |
| 10 | **Full QA checklist** | Run Tile_Asset_Production_Spec.md §9 checklist (15 items) | All 15 checks pass | Manual |

---

## 9. Quick Reference: P0 Sprite Summary

### Terrain (16 sprites)

| Terrain | Variants | Filenames | Base HEX | Shadow | Highlight |
|---------|:--------:|-----------|----------|--------|-----------|
| PLAIN | 4 | `terrain_plain_v0..v3.png` | `#8BCF5A` | `#6FAE42` | `#A6E57A` |
| FOREST | 4 | `terrain_forest_v0..v3.png` | `#2F8F3A` | `#216A2A` | `#47B552` |
| MOUNTAIN | 3 | `terrain_mountain_v0..v2.png` | `#9A9FA5` | `#6D737A` | `#D1D6DC` |
| DESERT | 3 | `terrain_desert_v0..v2.png` | `#E5C16A` | `#CFA54F` | `#F2D995` |
| WATER | 2 | `terrain_water_v0..v1.png` | `#3D8FD1` | `#2B6DA4` | `#5BAED6` |

### Fog (9 sprites)

| Asset | Filename | Size | Color | Alpha |
|-------|----------|------|-------|-------|
| Fill | `fog_unexplored.png` | 96x96 | `#1A1A2E` | 85% |
| Edge N | `fog_edge_n.png` | 96x8 | `#1A1A2E` | gradient |
| Edge S | `fog_edge_s.png` | 96x8 | `#1A1A2E` | gradient |
| Edge E | `fog_edge_e.png` | 8x96 | `#1A1A2E` | gradient |
| Edge W | `fog_edge_w.png` | 8x96 | `#1A1A2E` | gradient |
| Corner NE | `fog_edge_ne.png` | 8x8 | `#1A1A2E` | radial |
| Corner NW | `fog_edge_nw.png` | 8x8 | `#1A1A2E` | radial |
| Corner SE | `fog_edge_se.png` | 8x8 | `#1A1A2E` | radial |
| Corner SW | `fog_edge_sw.png` | 8x8 | `#1A1A2E` | radial |

**Total: 25 P0 sprites** (terrain + fog).

---

## 10. Generation Order (Recommended)

1. **PLAIN v0** first — simplest tile, establishes the baseline green and shading direction
2. **WATER v0** — establishes contrast against land; validates blue palette
3. **DESERT v0** — warm palette, similar complexity to PLAIN
4. **MOUNTAIN v0** — requires strong silhouette; validates gray palette and angular shapes
5. **FOREST v0** — most complex (tree clusters); do last among terrain
6. Remaining variants (v1, v2, v3) for each terrain in same order
7. **Fog** sprites last (or produce programmatically)

---

## 11. Related Documents

| Document | Relationship |
|----------|-------------|
| [`Tile_Style_Bible.md`](Tile_Style_Bible.md) | Visual style authority — palette, shapes, forbidden styles |
| [`Tile_Asset_List.md`](Tile_Asset_List.md) | Complete P0-P2 inventory this pack draws from |
| [`Tile_Asset_Production_Spec.md`](Tile_Asset_Production_Spec.md) | Export format, quality checklist |
| [`Tile_Generation_Prompts.md`](Tile_Generation_Prompts.md) | Full prompt reference for all priority tiers |
| [`Map_Design_Spec.md`](Map_Design_Spec.md) | Rendering pipeline, naming, LOD rules |
