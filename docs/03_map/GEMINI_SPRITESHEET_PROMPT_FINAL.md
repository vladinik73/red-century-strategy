# Gemini Spritesheet Prompt — Red Age (final, v4)

> **Workflow:**
> 1. Copy **DELIVERABLE A** (between `===BEGIN===` and `===END===`) → paste into Gemini
> 2. Download the generated PNG → save as `assets/spritesheet_raw.png`
> 3. Run: `bash scripts/slice_spritesheet.sh assets/spritesheet_raw.png`
> 4. Verify against **DELIVERABLE B** (Slicing Map)
>
> **Canon priority applied:**
> 1. Tile_Style_Bible.md (palette hex — wins over Map_Design_Spec placeholders)
> 2. Map_Design_Spec.md (flat filenames — wins over Tile_Style_Bible folder naming)
> 3. Tile_Asset_List.md (81-sprite inventory, all tiers P0+P1+P2)
> 4. Tile_Asset_Production_Spec.md (export rules, quality checklist)
> 5. Tile_Generation_Prompts.md (per-terrain style keywords)
> 6. Map_Visual_Spec.md (semantic tokens, visibility states)

---

## DELIVERABLE A — Gemini Prompt (copy-paste ready)

===BEGIN===

ABSOLUTE RULES — READ THESE FIRST:

1. ZERO TEXT. The image must contain absolutely NO text, NO labels, NO numbers, NO filenames, NO captions, NO watermarks, NO titles, NO annotations. Not a single letter or digit anywhere.
2. The image is exactly 1728 × 1728 pixels. Square.
3. The image is divided into an invisible 9 × 9 grid of 81 equal cells, each exactly 192 × 192 pixels.
4. There are NO grid lines, NO borders, NO dividers between cells. Cells touch each other with zero gaps.
5. Every sprite is drawn looking STRAIGHT DOWN from above (top-down orthographic bird's-eye view). NOT isometric. NOT perspective. NOT 3D. NOT at an angle. Imagine a camera pointing straight down at a flat game board.

REMEMBER: ZERO TEXT ANYWHERE IN THE IMAGE. NO LABELS. NO WORDS. NO NUMBERS.

ART STYLE — apply to every single cell:
- Flat shading with exactly 3 tones per element: one base color, one shadow, one highlight
- Clean simple vector-like shapes with crisp edges
- Bright saturated colors (not neon, not pastel)
- Consistent lighting from upper-left corner
- Visual style reference: Battle of Polytopia mobile game map tiles
- Trees from above look like round green blobs (you see the crown, not the trunk)
- Mountains from above look like flat triangular peaks with shadow on one side
- Water is flat blue with faint wave lines
- Sand dunes are smooth gentle curves

NEVER DO ANY OF THESE:
- No photorealism, no photographs
- No pixel art, no 8-bit retro
- No watercolor, no oil painting
- No grunge, noise, film grain, heavy textures
- No perspective view, no isometric view, no 3D rendering
- No realistic shadows, no ray tracing, no reflections
- No text, labels, numbers, or watermarks (REPEATING THIS BECAUSE IT IS CRITICAL)

EXACT COLORS TO USE:
- Grass green: base #8BCF5A, shadow #6FAE42, highlight #A6E57A
- Forest dark green: base #2F8F3A, shadow #216A2A, highlight #47B552
- Mountain gray: base #9A9FA5, shadow #6D737A, highlight #D1D6DC
- Desert gold: base #E5C16A, shadow #CFA54F, highlight #F2D995
- Ocean blue: base #3D8FD1, shadow #2B6DA4, highlight #5BAED6
- Beach sand: #F1E0A0
- River blue: #5BAED6
- Fog dark navy: #1A1A2E
- Neutral gray: #808080

TWO TYPES OF CELLS:

Type "FILL" — the sprite fills the entire 192×192 cell edge-to-edge. No white space showing. Used for terrain tiles, fog overlays, and gradient blends.

Type "ICON" — a small sprite is centered in the middle of the cell. The rest of the cell is pure white (#FFFFFF) background. Used for props, markers, badges, roads, coast pieces.

IMPORTANT: Keep every cell exactly the same size. The grid must be perfectly uniform — 9 equal columns, 9 equal rows. Do not make some cells bigger or smaller than others.

REMEMBER: ZERO TEXT. NOT A SINGLE LETTER. NOT A SINGLE NUMBER. ANYWHERE.

Here are all 81 cells. I will describe them row by row, left to right.

ROW 0 — nine FILL cells, all terrain tiles viewed from straight above:
Cell 0,0: Flat green grass (#8BCF5A). Smooth, clean, no objects.
Cell 0,1: Same grass, with 1-2 tiny pebbles near edge.
Cell 0,2: Same grass, subtle warmer tone band.
Cell 0,3: Same grass, faint diagonal shadow stripe.
Cell 0,4: Forest from above — 3 round green blob tree tops (#2F8F3A) in tight cluster. Dark gaps between. Highlight #47B552 on upper-left of each blob.
Cell 0,5: Forest — 4 smaller round green blobs, more spread out.
Cell 0,6: Forest — 2 large blobs + 1 small blob.
Cell 0,7: Forest — 3 blobs, one slightly oval.
Cell 0,8: Mountain from above — single gray triangular peak (#9A9FA5) centered, bright side #D1D6DC upper-left, dark side #6D737A lower-right.

ROW 1 — mixed FILL terrain + ICON cities:
Cell 1,0: FILL. Mountain — two gray peaks, one large and one smaller.
Cell 1,1: FILL. Mountain — single peak, different ridge angle.
Cell 1,2: FILL. Desert — golden (#E5C16A) smooth dune ridge diagonal.
Cell 1,3: FILL. Desert — two gentle parallel dune curves.
Cell 1,4: FILL. Desert — flat sand, subtle wind lines only.
Cell 1,5: FILL. Ocean water — smooth blue (#3D8FD1), faint horizontal wave lines.
Cell 1,6: FILL. Ocean water — same blue, circular ripple arcs instead.
Cell 1,7: ICON. Two tiny beige/tan square rooftops seen from directly above. White background.
Cell 1,8: ICON. Three small square rooftops from above, one slightly larger. White background.

ROW 2 — ICON cities + FILL fog:
Cell 2,0: ICON. Four small rooftops from above, one larger central. White bg.
Cell 2,1: ICON. Five rooftops, two larger structures. White bg.
Cell 2,2: ICON. Six rooftops, one tall prominent structure. White bg.
Cell 2,3: ICON. Same as cell 1,7 but all gray (#808080). White bg.
Cell 2,4: ICON. Tiny golden 3-point crown shape (#E5C16A), very small, centered. White bg.
Cell 2,5: FILL. Entire cell is solid dark navy (#1A1A2E). Completely flat and uniform.
Cell 2,6: FILL. Top half is dark navy (#1A1A2E), smoothly fading to white at bottom.
Cell 2,7: FILL. Bottom half is dark navy, smoothly fading to white at top.
Cell 2,8: FILL. Right half is dark navy, smoothly fading to white at left.

ROW 3 — FILL fog + ICON overlays:
Cell 3,0: FILL. Left half is dark navy (#1A1A2E), fading to white at right.
Cell 3,1: FILL. Dark navy concentrated in top-right corner, radial fade to white.
Cell 3,2: FILL. Dark navy in top-left corner, radial fade to white.
Cell 3,3: FILL. Dark navy in bottom-right corner, radial fade to white.
Cell 3,4: FILL. Dark navy in bottom-left corner, radial fade to white.
Cell 3,5: ICON. A curved blue S-shape stroke (#5BAED6) through center, about 25% cell width. White bg.
Cell 3,6: ICON. Very thin (~2px) light tan vertical line through center. White bg.
Cell 3,7: ICON. Medium (~4px) tan vertical line through center. White bg.
Cell 3,8: ICON. Wide (~6px) dark tan vertical line with thin borders. White bg.

ROW 4 — ICON bridge + FILL gradient blends:
Cell 4,0: ICON. Simple tan road piece crossing a gap with two support struts. White bg.
Cell 4,1: FILL. Left half bright green (#8BCF5A) → right half dark green (#2F8F3A). Smooth horizontal gradient.
Cell 4,2: FILL. Top bright green → bottom dark green. Vertical gradient.
Cell 4,3: FILL. Left bright green (#8BCF5A) → right golden (#E5C16A). Horizontal.
Cell 4,4: FILL. Top green → bottom golden. Vertical.
Cell 4,5: FILL. Left green (#8BCF5A) → right gray (#9A9FA5). Horizontal.
Cell 4,6: FILL. Top green → bottom gray. Vertical.
Cell 4,7: FILL. Left dark green (#2F8F3A) → right gray (#9A9FA5). Horizontal.
Cell 4,8: FILL. Top dark green → bottom gray. Vertical.

ROW 5 — FILL blends + ICON coast pieces:
Cell 5,0: FILL. Left golden (#E5C16A) → right gray (#9A9FA5). Horizontal gradient.
Cell 5,1: FILL. Top golden → bottom gray. Vertical gradient.
Cell 5,2: FILL. Left dark green (#2F8F3A) → right golden (#E5C16A). Horizontal.
Cell 5,3: FILL. Top dark green → bottom golden. Vertical.
Cell 5,4: ICON. Thin warm sand-colored strip (#F1E0A0) along top edge of cell. Rest is white.
Cell 5,5: ICON. Thin sand strip along bottom edge. White bg.
Cell 5,6: ICON. Thin vertical sand strip along right edge. White bg.
Cell 5,7: ICON. Thin vertical sand strip along left edge. White bg.
Cell 5,8: ICON. Small curved sand fill (#F1E0A0) in top-right corner. White bg.

ROW 6 — ICON coast corners + tree props + rock props:
Cell 6,0: ICON. Sand fill in top-left corner of cell. White bg.
Cell 6,1: ICON. Sand fill in bottom-right corner. White bg.
Cell 6,2: ICON. Sand fill in bottom-left corner. White bg.
Cell 6,3: ICON. Single round green blob (#2F8F3A, highlight #47B552), ~50px diameter, centered. Top-down view of tree crown. White bg.
Cell 6,4: ICON. Slightly oval green blob tree crown. White bg.
Cell 6,5: ICON. Smaller round green blob. White bg.
Cell 6,6: ICON. Pointed-round green blob (triangle-blob hybrid). White bg.
Cell 6,7: ICON. Angular gray triangular rock (#9A9FA5, highlight #D1D6DC), ~40px, centered. White bg.
Cell 6,8: ICON. Different gray angular rock shape. White bg.

ROW 7 — ICON props:
Cell 7,0: ICON. Smaller flat gray rock. White bg.
Cell 7,1: ICON. Tall gray triangular peak with white snow tip, ~60px. White bg.
Cell 7,2: ICON. Similar peak, different angle. White bg.
Cell 7,3: ICON. Tiny bright green grass tuft (#8BCF5A), ~15px. Centered. White bg.
Cell 7,4: ICON. Wider grass tuft. White bg.
Cell 7,5: ICON. Thinner grass blades. White bg.
Cell 7,6: ICON. Small dark green saguaro cactus shape from above, ~35px. White bg.
Cell 7,7: ICON. Round barrel cactus from above. White bg.
Cell 7,8: ICON. Flat prickly pear cactus from above. White bg.

ROW 8 — ICON dunes + ports + badges:
Cell 8,0: ICON. Low curved golden sand wave (#E5C16A), ~20px. Centered. White bg.
Cell 8,1: ICON. Different golden dune curve. White bg.
Cell 8,2: ICON. Tiny L-shaped brown wooden pier from above, ~16px. White bg.
Cell 8,3: ICON. Wider brown dock from above, ~20px. White bg.
Cell 8,4: ICON. Brown dock with small crane arm from above, ~24px. White bg.
Cell 8,5: ICON. Tiny red crossed swords symbol, ~16px. White bg.
Cell 8,6: ICON. Tiny yellow lightning bolt symbol, ~16px. White bg.
Cell 8,7: ICON. Tiny blue-gray clock symbol, ~16px. White bg.
Cell 8,8: ICON. Tiny brown cracked line symbol, ~16px. White bg.

FINAL CHECKLIST — the image must satisfy ALL of these:
1. Image is exactly 1728 × 1728 pixels, square
2. Grid is exactly 9 × 9 = 81 cells, all the same size (192 × 192 each)
3. ZERO grid lines, ZERO borders, ZERO dividers between cells
4. ZERO text anywhere — no labels, no filenames, no numbers, no captions, no watermarks
5. FILL cells: sprite fills the entire cell edge-to-edge, no white gaps
6. ICON cells: small sprite centered on pure white background
7. ALL sprites are drawn from straight-above top-down view — NOT isometric, NOT perspective, NOT 3D
8. Colors match the hex palette specified above
9. Style is flat, clean, minimal, Polytopia-like — no photorealism, no pixel art, no noise
10. Lighting is consistently from upper-left across all sprites

===END===

---

## DELIVERABLE B — Slicing Map (81 cells)

Grid: 9 columns (C0–C8) × 9 rows (R0–R8).
Cell size: 192×192 px within 1728×1728 image.
Pixel origin for cell [R,C]: `x = C × 192`, `y = R × 192`.
Post-slice: resize each cell to **96×96 px** PNG RGBA.

Filename convention: **Map_Design_Spec §5.2** flat naming (canonical for rendering pipeline).

### Row 0 — Terrain: PLAIN × 4 + FOREST × 4 + MOUNTAIN × 1

| Col | Filename | Category | Type | Priority |
|-----|----------|----------|------|----------|
| C0 | `terrain_plain_v0.png` | terrain | FILL | P0 |
| C1 | `terrain_plain_v1.png` | terrain | FILL | P0 |
| C2 | `terrain_plain_v2.png` | terrain | FILL | P0 |
| C3 | `terrain_plain_v3.png` | terrain | FILL | P0 |
| C4 | `terrain_forest_v0.png` | terrain | FILL | P0 |
| C5 | `terrain_forest_v1.png` | terrain | FILL | P0 |
| C6 | `terrain_forest_v2.png` | terrain | FILL | P0 |
| C7 | `terrain_forest_v3.png` | terrain | FILL | P0 |
| C8 | `terrain_mountain_v0.png` | terrain | FILL | P0 |

### Row 1 — Terrain: MOUNTAIN × 2 + DESERT × 3 + WATER × 2 + City L1–L2

| Col | Filename | Category | Type | Priority |
|-----|----------|----------|------|----------|
| C0 | `terrain_mountain_v1.png` | terrain | FILL | P0 |
| C1 | `terrain_mountain_v2.png` | terrain | FILL | P0 |
| C2 | `terrain_desert_v0.png` | terrain | FILL | P0 |
| C3 | `terrain_desert_v1.png` | terrain | FILL | P0 |
| C4 | `terrain_desert_v2.png` | terrain | FILL | P0 |
| C5 | `terrain_water_v0.png` | terrain | FILL | P0 |
| C6 | `terrain_water_v1.png` | terrain | FILL | P0 |
| C7 | `marker_city_l1.png` | markers | ICON | P0 |
| C8 | `marker_city_l2.png` | markers | ICON | P0 |

### Row 2 — City L3–L5 + Neutral + Capital + Fog fill + Fog edges N/S/E

| Col | Filename | Category | Type | Priority |
|-----|----------|----------|------|----------|
| C0 | `marker_city_l3.png` | markers | ICON | P0 |
| C1 | `marker_city_l4.png` | markers | ICON | P0 |
| C2 | `marker_city_l5.png` | markers | ICON | P0 |
| C3 | `marker_city_neutral.png` | markers | ICON | P0 |
| C4 | `marker_capital.png` | markers | ICON | P0 |
| C5 | `fog_unexplored.png` | fog | FILL | P0 |
| C6 | `fog_edge_n.png` | fog | FILL | P0 |
| C7 | `fog_edge_s.png` | fog | FILL | P0 |
| C8 | `fog_edge_e.png` | fog | FILL | P0 |

### Row 3 — Fog edge W + Fog corners × 4 + River + Roads × 3

| Col | Filename | Category | Type | Priority |
|-----|----------|----------|------|----------|
| C0 | `fog_edge_w.png` | fog | FILL | P0 |
| C1 | `fog_edge_ne.png` | fog | FILL | P0 |
| C2 | `fog_edge_nw.png` | fog | FILL | P0 |
| C3 | `fog_edge_se.png` | fog | FILL | P0 |
| C4 | `fog_edge_sw.png` | fog | FILL | P0 |
| C5 | `overlay_river.png` | overlays | ICON | P1 |
| C6 | `overlay_road_l1.png` | overlays | ICON | P1 |
| C7 | `overlay_road_l2.png` | overlays | ICON | P1 |
| C8 | `overlay_road_l3.png` | overlays | ICON | P1 |

### Row 4 — Bridge + Blends × 8

| Col | Filename | Category | Type | Priority |
|-----|----------|----------|------|----------|
| C0 | `overlay_bridge.png` | overlays | ICON | P1 |
| C1 | `blend_plain_forest_h.png` | blends | FILL | P2 |
| C2 | `blend_plain_forest_v.png` | blends | FILL | P2 |
| C3 | `blend_plain_desert_h.png` | blends | FILL | P2 |
| C4 | `blend_plain_desert_v.png` | blends | FILL | P2 |
| C5 | `blend_plain_mountain_h.png` | blends | FILL | P2 |
| C6 | `blend_plain_mountain_v.png` | blends | FILL | P2 |
| C7 | `blend_forest_mountain_h.png` | blends | FILL | P2 |
| C8 | `blend_forest_mountain_v.png` | blends | FILL | P2 |

### Row 5 — Blends × 4 + Coast edges × 4 + Coast corner NE

| Col | Filename | Category | Type | Priority |
|-----|----------|----------|------|----------|
| C0 | `blend_desert_mountain_h.png` | blends | FILL | P2 |
| C1 | `blend_desert_mountain_v.png` | blends | FILL | P2 |
| C2 | `blend_forest_desert_h.png` | blends | FILL | P2 |
| C3 | `blend_forest_desert_v.png` | blends | FILL | P2 |
| C4 | `coast_edge_n.png` | coast | ICON | P1 |
| C5 | `coast_edge_s.png` | coast | ICON | P1 |
| C6 | `coast_edge_e.png` | coast | ICON | P1 |
| C7 | `coast_edge_w.png` | coast | ICON | P1 |
| C8 | `coast_corner_ne.png` | coast | ICON | P1 |

### Row 6 — Coast corners × 3 + Tree props × 4 + Rock props × 2

| Col | Filename | Category | Type | Priority |
|-----|----------|----------|------|----------|
| C0 | `coast_corner_nw.png` | coast | ICON | P1 |
| C1 | `coast_corner_se.png` | coast | ICON | P1 |
| C2 | `coast_corner_sw.png` | coast | ICON | P1 |
| C3 | `prop_tree_0.png` | props | ICON | P1 |
| C4 | `prop_tree_1.png` | props | ICON | P1 |
| C5 | `prop_tree_2.png` | props | ICON | P1 |
| C6 | `prop_tree_3.png` | props | ICON | P1 |
| C7 | `prop_rock_0.png` | props | ICON | P1 |
| C8 | `prop_rock_1.png` | props | ICON | P1 |

### Row 7 — Rock × 1 + Peaks × 2 + Grass × 3 + Cactus × 3

| Col | Filename | Category | Type | Priority |
|-----|----------|----------|------|----------|
| C0 | `prop_rock_2.png` | props | ICON | P1 |
| C1 | `prop_peak_0.png` | props | ICON | P1 |
| C2 | `prop_peak_1.png` | props | ICON | P1 |
| C3 | `prop_grass_0.png` | props | ICON | P1 |
| C4 | `prop_grass_1.png` | props | ICON | P1 |
| C5 | `prop_grass_2.png` | props | ICON | P1 |
| C6 | `prop_cactus_0.png` | props | ICON | P1 |
| C7 | `prop_cactus_1.png` | props | ICON | P1 |
| C8 | `prop_cactus_2.png` | props | ICON | P1 |

### Row 8 — Dunes × 2 + Ports × 3 + Badges × 4

| Col | Filename | Category | Type | Priority |
|-----|----------|----------|------|----------|
| C0 | `prop_dune_0.png` | props | ICON | P1 |
| C1 | `prop_dune_1.png` | props | ICON | P1 |
| C2 | `marker_port_l1.png` | markers | ICON | P1 |
| C3 | `marker_port_l2.png` | markers | ICON | P1 |
| C4 | `marker_port_l3.png` | markers | ICON | P1 |
| C5 | `badge_siege.png` | badges | ICON | P2 |
| C6 | `badge_disruption.png` | badges | ICON | P2 |
| C7 | `badge_integration.png` | badges | ICON | P2 |
| C8 | `badge_damaged_road.png` | badges | ICON | P2 |

---

### Summary

| Metric | Value |
|--------|-------|
| Total cells | 81 (9 × 9) |
| FILL cells | 37 (16 terrain + 9 fog + 12 blends) |
| ICON cells | 44 (7 city + 1 capital + 5 overlays + 8 coast + 17 props + 3 ports + 4 badges) |
| P0 sprites | 32 (16 terrain + 7 city markers + 9 fog) |
| P1 sprites | 33 (17 props + 8 coast + 5 overlays + 3 ports) |
| P2 sprites | 16 (12 blends + 4 badges) |
| **Total** | **81** |

### Canon discrepancy resolutions

1. **Palette hex:** Tile_Style_Bible §5 values used (e.g. PLAIN `#8BCF5A`). Map_Design_Spec §3.1 placeholder `#8FBF5A` — NOT used.
2. **Filenames:** Map_Design_Spec §5.2 flat naming (`terrain_plain_v0.png`). Tile_Style_Bible §13 folder naming (`terrain/plain/variant_1.png`) — NOT used.
3. **Fog sprite sizes:** Tile_Asset_List specifies native sizes (96×8, 8×96, 8×8 for edges/corners). In spritesheet, all cells are uniform 192×192. Slicing script outputs 96×96 for all; alpha channels define visible shape.
4. **Coast fragment sizes:** Tile_Asset_List specifies 96×4, 4×96, ~16×16 native sizes. Same resolution as fog — uniform cells in spritesheet, content drawn at correct proportions.
5. **Neutral city color:** Map_Design_Spec §3.3 uses `#9CA3AF` for `faction_neutral`. Tile_Asset_List and previous prompts used `#808080`. Using `#808080` as it's the established convention in the spritesheet pipeline.
