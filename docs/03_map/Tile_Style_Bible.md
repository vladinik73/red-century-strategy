# Tile Style Bible
Red Age Strategy  
Version: v1.0 (Map visuals)

**Canonical path:** `docs/03_map/Tile_Style_Bible.md`

---

## 1. Purpose

This document defines the **visual style rules for map tiles and terrain objects** in *Red Age*.

It ensures that:

- all terrain tiles follow a **consistent visual language**
- the map remains **readable for strategy gameplay**
- artists produce assets compatible with **`docs/03_map/Map_Design_Spec.md`**
- visuals align with **Polytopia-inspired** references provided by the owner

This document is **binding** for all terrain art assets used in MVP and beyond.

---

## 2. Visual Style Principles

Primary direction: **Polytopia-like readability + clean stylization**.

**Do:**
- clear silhouettes
- flat shading + soft gradient
- limited texture noise
- saturated but controlled palette
- consistent prop language (same “shape grammar” everywhere)

**Don’t:**
- photorealism
- pixel-art
- watercolor
- heavy procedural noise / grunge textures
- Civ-style micro-details that reduce readability at zoom-out

---

## 3. Tile Geometry

### Canonical tile size
From `Map_Design_Spec.md`:

- `BASE_TILE_SIZE = 96 px`

### Safe zones (composition)
- **Center** (unit placement): keep the center visually clean.
- **Mid ring** (props): small props only.
- **Outer ring** (edges/roads/rivers): reserve for overlays and blends.

Props must not overlap:
- unit footprint zone
- road centerline zone
- river stroke zone
- city/capital marker anchor

---

## 4. Canonical Terrain Types

Terrain set is **fixed** (no new mechanics introduced here):

- `PLAIN`
- `FOREST`
- `MOUNTAIN`
- `DESERT`
- `WATER`

Rivers are **overlay flags**, not a terrain type.

---

## 5. Palette (Polytopia-inspired)

These are **canonical starting hex values**. We can tune later, but the *relative* relationships should remain.

> Note: territory tinting and fog overlays are defined in `Map_Design_Spec.md`. This Bible only defines terrain baselines.

### Plains
- Base: `#8BCF5A`
- Shadow: `#6FAE42`
- Highlight: `#A6E57A`

### Forest
- Base: `#2F8F3A`
- Shadow: `#216A2A`
- Highlight: `#47B552`

### Mountain
- Base: `#9A9FA5`
- Shadow: `#6D737A`
- Highlight: `#D1D6DC`

### Desert
- Base: `#E5C16A`
- Shadow: `#CFA54F`
- Highlight: `#F2D995`

### Water
- Base: `#3D8FD1`
- Shadow: `#2B6DA4`
- Highlight: `#5BAED6`

### Beach / shoreline strip (overlay)
- Beach: `#F1E0A0`

---

## 6. Terrain Tile Style Rules

### 6.1 Plain (PLAIN)
**Role:** neutral movement, most common land.

**Look:**
- smooth grass surface
- subtle gradient (no texture noise)
- occasional micro-props (rocks/bushes)

**Props:**
- 0–2 micro-props
- keep center clean

**Variants:** 4

---

### 6.2 Forest (FOREST)
**Role:** defensive / cover cue.

**Look:**
- clustered stylized trees
- strong silhouette at zoom-out
- tree canopy shape language: rounded triangles / blobs (Polytopia-like)

**Props:**
- tree clusters (2–4 per cluster)
- avoid single “lonely” trees unless that is a defined variant

**Variants:** 4

---

### 6.3 Mountain (MOUNTAIN)
**Role:** blocking / strong strategic boundary cue.

**Look:**
- sharp stylized peaks
- clear light highlight + dark shadow shape
- no “realistic” rock textures

**Variants:** 3

**Silhouette rule:** must remain instantly recognizable at low zoom (≥0.3 zoom).

---

### 6.4 Desert (DESERT)
**Role:** sparse, warm, open.

**Look:**
- smooth dunes
- gentle curved shapes
- very low texture noise

**Props:**
- cactus / dry rocks (small)
- avoid clutter

**Variants:** 3

---

### 6.5 Water (WATER)
**Role:** ocean/sea.

**Look:**
- smooth surface
- gentle wave highlights (simple)
- no reflections, no complex caustics

**Variants:** 2

---

## 7. Rivers (overlay)

Rivers are rendered as **overlay strokes**.

- Stroke width: `0.25–0.35 × BASE_TILE_SIZE`
- Color baseline: `#5BAED6`
- Render order: above terrain, below roads

Rivers must:
- curve smoothly
- remain readable under fog
- not “eat” the whole tile (no full-tile rivers)

---

## 8. Coastlines (MVP)

Coastlines use **8 fragments** (MVP) per `Map_Design_Spec.md`:

- simple per-edge shapes
- beach strip approx **4 px**
- no 256-variant coastline system in MVP

Goal: readable shoreline without overwhelming asset complexity.

---

## 9. Terrain Variants (anti-repetition)

Variant counts (MVP):

| Terrain | Variants |
|---|---:|
| Plain | 4 |
| Forest | 4 |
| Mountain | 3 |
| Desert | 3 |
| Water | 2 |

Deterministic selection:

- `variant = hash(seed + tileIndex) % variantCount`

Variants may change:
- prop placement
- small shape details
- minor highlights/shadows

Variants must **not** change:
- terrain recognition
- gameplay readability
- unit/city anchor geometry

---

## 10. Prop Density & Coverage

Hard rules:

- Total prop coverage per tile: **≤ 30%** tile area
- Max props per tile: **0–3**
- Props must not obscure:
  - unit marker
  - city/capital marker
  - roads/bridges/ports
  - resources

---

## 11. Edge Blending Overlays

Supported transition overlays (MVP):

- `plain ↔ forest`
- `plain ↔ desert`
- `forest ↔ mountain`
- `water ↔ land`
- `desert ↔ plain`

Overlays are separate sprites, rendered above terrain base.

Goal: soften borders without sacrificing clarity.

---

## 12. Performance Constraints (visual)

Map:
- 80×80 tiles (6400)

Targets:
- 60 FPS on mid mobile
- single atlas batching
- keep draw calls **≤ 16**

Guidelines:
- avoid per-tile unique textures
- prefer atlas + deterministic variants
- chunk rendering (e.g., 16×16)
- viewport culling

---

## 13. Asset Naming Convention

Terrain base:

- `terrain/<type>/variant_<n>.png`

Examples:
- `terrain/plain/variant_1.png`
- `terrain/forest/variant_3.png`
- `terrain/mountain/variant_2.png`
- `terrain/desert/variant_1.png`
- `terrain/water/variant_2.png`

Blends:
- `terrain/blends/plain_forest_1.png`
- `terrain/blends/water_land_2.png`

Props:
- `props/trees_01.png`
- `props/rock_02.png`
- `props/cactus_01.png`

---

## 14. Forbidden Styles

Not allowed:
- photorealism
- pixel-art
- watercolor / painted maps
- heavy grunge / noise
- high-frequency texture detail

Required:
- clean, readable, stylized strategy map look

---

## 15. Acceptance Criteria

This Bible is satisfied if:

- each terrain is recognizable instantly at zoom-out
- props do not obscure gameplay markers
- rivers/roads/coastlines remain readable
- variants reduce repetition without changing recognition
- performance targets remain achievable
- the output feels Polytopia-inspired in readability and color harmony

---

## 16. Related Documents

| Document | Relationship |
|----------|-------------|
| [`Tile_Asset_List.md`](Tile_Asset_List.md) | Complete sprite inventory derived from this Bible |
| [`Tile_Asset_Production_Spec.md`](Tile_Asset_Production_Spec.md) | Export rules + quality checklist based on this Bible |
| [`Tile_Generation_Prompts.md`](Tile_Generation_Prompts.md) | AI generation prompts encoding this Bible's style |
| [`Tile_Prompt_Pack_P0_v1.md`](Tile_Prompt_Pack_P0_v1.md) | Ready-to-run P0 prompt pack (terrain bases + fog only) with palette lock and QA rules |
| [`Map_Design_Spec.md`](Map_Design_Spec.md) | Rendering pipeline + atlas packing rules |
| [`Map_Visual_Spec.md`](../10_uiux/Map_Visual_Spec.md) | Semantic tokens + placeholder assignments |

> **Naming canon note:** This Bible's §13 uses folder-based naming (`terrain/<type>/variant_<n>.png`) for artist organization. The **canonical naming convention for the rendering pipeline** is flat naming from `Map_Design_Spec.md` §5.2 (`terrain_plain_v0.png`). When in doubt, follow Map_Design_Spec.
