# Gemini Prompt — Full Sprite Pack for Red Age

> **How to use:** Copy everything below the `---` line and paste into Gemini in browser.
> Gemini may generate images in batches. If it stops, say "continue with the next batch" and it will pick up from where it left off.
> All rules, palette, sizes, and filenames are embedded directly in the prompt — no external references needed.

---

You are a game art asset generator. I need you to create **all 81 sprite assets** for a turn-based strategy game called **Red Age**. The game is visually inspired by **Battle of Polytopia** — clean, bright, readable, stylized strategy map look.

Generate each asset as a **separate image**. Work through all categories below in order. For each sprite, follow the exact filename, size, palette, and style rules specified.

---

## GLOBAL STYLE RULES (apply to EVERY image)

**DO:**
- Top-down view (looking straight down at the map)
- Flat shading with minimal gradient (only base/shadow/highlight triplet)
- Clean vector-like shapes, crisp edges
- Strong silhouettes readable at small sizes
- Saturated but controlled colors (bright, not neon)
- Consistent light from upper-left (highlights upper-left, shadows lower-right)
- Transparent background (conceptually — generate on white, I will remove background later)
- Square composition for tiles

**DO NOT (strict):**
- No photorealism, no photographs
- No pixel art, no 8-bit style
- No watercolor, oil painting, or painted look
- No grunge, noise, film grain, dirty textures
- No complex lighting, ray tracing, reflections, caustics
- No perspective or isometric — strictly top-down
- No text, labels, numbers, watermarks, signatures
- No borders, frames, vignettes
- No multiple tiles in one image — each image is ONE sprite
- No spritesheet or grid layout

---

## CANONICAL PALETTE (use these exact colors)

### Terrain colors (Base / Shadow / Highlight):

| Terrain | Base HEX | Shadow HEX | Highlight HEX |
|---------|----------|------------|---------------|
| PLAIN (grass) | `#8BCF5A` | `#6FAE42` | `#A6E57A` |
| FOREST | `#2F8F3A` | `#216A2A` | `#47B552` |
| MOUNTAIN | `#9A9FA5` | `#6D737A` | `#D1D6DC` |
| DESERT | `#E5C16A` | `#CFA54F` | `#F2D995` |
| WATER (ocean) | `#3D8FD1` | `#2B6DA4` | `#5BAED6` |

### Supplementary colors:

| Element | HEX | Notes |
|---------|-----|-------|
| Beach / shoreline | `#F1E0A0` | Warm sand strip |
| River stroke | `#5BAED6` | Same as water highlight |
| Fog fill | `#1A1A2E` | Dark navy, 85% opacity |
| Road L1 | `#D4C4A0` | Light tan |
| Road L2 | `#B8A47A` | Darker tan |
| Road L3 | `#9C8860` | Dark tan with border |
| Neutral city | `#808080` | Gray |

---

## REFERENCE STYLE

Visual reference: **Battle of Polytopia** map tiles. Think:
- Trees are round blob-shaped canopy tops viewed from above
- Mountains are sharp triangular peaks
- Desert is smooth gentle dune curves
- Water is flat blue with subtle wave lines
- Everything is clean, minimal, game-ready
- No Civ-style micro-details

---

Now generate ALL assets below, one image per entry.

---

## CATEGORY 1: TERRAIN BASES (16 images, each 96x96 px)

Every terrain tile: top-down 2D strategy tile, flat shading, limited palette (only the 3 colors for that terrain), clean outline, no gradients beyond base/shadow/highlight, Polytopia-inspired, transparent background.

### PLAIN tiles (bright green grass, #8BCF5A / #6FAE42 / #A6E57A):

**Image 1 — `terrain_plain_v0.png` (96x96)**
Flat grassland tile viewed from above. Smooth bright green (#8BCF5A) surface. Soft highlight (#A6E57A) upper-left, gentle shadow (#6FAE42) lower-right. Completely clean, no props. Minimal, smooth grass plane.

**Image 2 — `terrain_plain_v1.png` (96x96)**
Same flat grassland. 1-2 tiny scattered pebbles near edges. Center remains clean. Same palette.

**Image 3 — `terrain_plain_v2.png` (96x96)**
Same flat grassland. Subtle grass texture variation — slightly warmer green band running across the tile. Still very clean and flat.

**Image 4 — `terrain_plain_v3.png` (96x96)**
Same flat grassland. Faint diagonal shadow stripe across tile (gentle wind shadow effect). Still clean and flat.

### FOREST tiles (deep green, #2F8F3A / #216A2A / #47B552):

**Image 5 — `terrain_forest_v0.png` (96x96)**
Forest tile viewed from directly above. 3 round blob-shaped tree canopies in a tight cluster, slightly overlapping. Deep green (#2F8F3A) canopy, darker shadows (#216A2A) between canopies, brighter highlights (#47B552) on upper-left of each crown. Ground barely visible as dark gaps. Polytopia-style rounded treetops.

**Image 6 — `terrain_forest_v1.png` (96x96)**
Forest tile from above. 4 smaller round canopies, slightly more spread out. Same color palette. Polytopia tree blobs.

**Image 7 — `terrain_forest_v2.png` (96x96)**
Forest tile from above. 2 large canopies + 1 small canopy tucked between them. Same palette.

**Image 8 — `terrain_forest_v3.png` (96x96)**
Forest tile from above. 3 trees where one crown is slightly elongated (oval instead of round). Same palette.

### MOUNTAIN tiles (gray stone, #9A9FA5 / #6D737A / #D1D6DC):

**Image 9 — `terrain_mountain_v0.png` (96x96)**
Mountain tile from above. Single prominent centered peak. Triangular/angular rock formation. Gray stone (#9A9FA5) base, clear bright highlight (#D1D6DC) on upper-left slope, dark shadow (#6D737A) on lower-right. No realistic rock texture — clean geometric shapes. Strong silhouette.

**Image 10 — `terrain_mountain_v1.png` (96x96)**
Mountain tile from above. Two peaks — main large + secondary smaller peak, offset to the side. Same gray palette, same angular style.

**Image 11 — `terrain_mountain_v2.png` (96x96)**
Mountain tile from above. Single peak with a different ridge angle (rotated ~30 degrees from v0). Same palette.

### DESERT tiles (golden sand, #E5C16A / #CFA54F / #F2D995):

**Image 12 — `terrain_desert_v0.png` (96x96)**
Desert tile from above. Single smooth dune ridge running diagonally. Warm golden sand (#E5C16A), subtle shadow (#CFA54F) on lower-right of dune, bright highlight (#F2D995) on upper-left. Very clean, sparse, low texture noise. No cracks, no rocks.

**Image 13 — `terrain_desert_v1.png` (96x96)**
Desert tile from above. Two gentle parallel dune curves. Same golden palette.

**Image 14 — `terrain_desert_v2.png` (96x96)**
Desert tile from above. Flat sand with very subtle wind lines — minimal elevation variation. Same palette.

### WATER tiles (ocean blue, #3D8FD1 / #2B6DA4 / #5BAED6):

**Image 15 — `terrain_water_v0.png` (96x96)**
Ocean water tile from above. Smooth medium blue (#3D8FD1) surface. Subtle darker depth areas (#2B6DA4). Gentle simple wave highlight lines (#5BAED6) — horizontal, evenly spaced. No reflections, no caustics, no foam. Clean flat water.

**Image 16 — `terrain_water_v1.png` (96x96)**
Ocean water tile from above. Same blue palette but with slight circular ripple pattern (concentric arcs) instead of horizontal lines. Still clean and simple.

---

## CATEGORY 2: PROPS (17 images, various sizes)

Props are small decorative elements placed ON TOP of terrain tiles. Each prop is a separate sprite with transparent background. Polytopia style: simple, stylized shapes.

### Trees — for FOREST terrain (4 images):

**Image 17 — `prop_tree_0.png` (~50px tall)**
Single stylized tree viewed from above. Round blob crown shape. Green canopy (#2F8F3A base, #47B552 highlights). Tiny brown trunk barely visible underneath. Polytopia-style rounded treetop. Transparent background. ~50px height.

**Image 18 — `prop_tree_1.png` (~50px tall)**
Similar tree, slightly different crown shape — more oval. Same green palette.

**Image 19 — `prop_tree_2.png` (~50px tall)**
Slightly smaller, rounder crown. Same palette.

**Image 20 — `prop_tree_3.png` (~50px tall)**
Tree with a slightly pointed crown (gentle triangle-blob hybrid). Same palette.

### Rocks — for MOUNTAIN terrain (3 images):

**Image 21 — `prop_rock_0.png` (~40px tall)**
Single angular rock viewed from above. Triangular stone shape. Gray (#9A9FA5) with highlight (#D1D6DC) on upper-left. Flat shading. ~40px. Transparent background.

**Image 22 — `prop_rock_1.png` (~40px tall)**
Different angular rock, rotated orientation. Same gray palette.

**Image 23 — `prop_rock_2.png` (~40px tall)**
Smaller, flatter rock. Same palette.

### Peaks — for MOUNTAIN terrain (2 images):

**Image 24 — `prop_peak_0.png` (~60px tall)**
Tall stylized mountain peak from above. Tall triangle shape with white/snow tip. Gray body (#9A9FA5). Strong silhouette. ~60px tall. Transparent background.

**Image 25 — `prop_peak_1.png` (~60px tall)**
Similar peak, slightly different angle and proportions. Same palette.

### Grass tufts — for PLAIN terrain (3 images):

**Image 26 — `prop_grass_0.png` (~15px tall)**
Tiny grass tuft. Short green blades (#8BCF5A / #A6E57A). Very small decorative element. ~15px. Flat shading. Transparent background.

**Image 27 — `prop_grass_1.png` (~15px tall)**
Different tuft shape, slightly wider. Same green palette.

**Image 28 — `prop_grass_2.png` (~15px tall)**
Third variant, thinner blades. Same palette.

### Cactus — for DESERT terrain (3 images):

**Image 29 — `prop_cactus_0.png` (~35px tall)**
Single stylized saguaro cactus viewed from above. Dark green arms on golden background concept. ~35px. Flat shading. Clean shape. Transparent background.

**Image 30 — `prop_cactus_1.png` (~35px tall)**
Round barrel cactus shape. Same style.

**Image 31 — `prop_cactus_2.png` (~35px tall)**
Small prickly pear / flat cactus shape. Same style.

### Dunes — for DESERT terrain (2 images):

**Image 32 — `prop_dune_0.png` (~20px tall)**
Small sand dune accent. Low curved sand wave. Golden (#E5C16A) with subtle shadow (#CFA54F). Very subtle, ~20px. Transparent background.

**Image 33 — `prop_dune_1.png` (~20px tall)**
Different dune curve shape. Same golden palette.

---

## CATEGORY 3: COASTLINE FRAGMENTS (8 images)

Beach strips and corner fills for water/land transitions. Beach color: `#F1E0A0` (warm sand).

**Image 34 — `coast_edge_n.png` (96x4 px)**
Thin horizontal beach strip. 96px wide, 4px tall. Sand color (#F1E0A0) fading slightly at edges. North edge of a tile — beach at top.

**Image 35 — `coast_edge_s.png` (96x4 px)**
Same thin horizontal beach strip for south edge.

**Image 36 — `coast_edge_e.png` (4x96 px)**
Thin vertical beach strip. 4px wide, 96px tall. East edge.

**Image 37 — `coast_edge_w.png` (4x96 px)**
Thin vertical beach strip. West edge.

**Image 38 — `coast_corner_ne.png` (~16x16 px)**
Small corner beach fill. Northeast corner. Sand (#F1E0A0), curved inner edge transitioning to transparent.

**Image 39 — `coast_corner_nw.png` (~16x16 px)**
Northwest corner beach fill. Same style.

**Image 40 — `coast_corner_se.png` (~16x16 px)**
Southeast corner beach fill.

**Image 41 — `coast_corner_sw.png` (~16x16 px)**
Southwest corner beach fill.

---

## CATEGORY 4: EDGE BLENDS (12 images, each 96x96 px)

Soft gradient overlays for terrain transitions. Each blend is a 96x96 sprite showing one terrain fading into another. Half the sprite is terrain A color fading into terrain B color. Two variants per pair: horizontal (h) and vertical (v).

**Image 42 — `blend_plain_forest_h.png` (96x96)**
Left half: green (#8BCF5A) fading right into dark green (#2F8F3A). Smooth horizontal crossfade. Flat colors. Transparent background.

**Image 43 — `blend_plain_forest_v.png` (96x96)**
Top: green (#8BCF5A) fading down into dark green (#2F8F3A). Vertical crossfade.

**Image 44 — `blend_plain_desert_h.png` (96x96)**
Green (#8BCF5A) → golden (#E5C16A). Horizontal.

**Image 45 — `blend_plain_desert_v.png` (96x96)**
Green → golden. Vertical.

**Image 46 — `blend_plain_mountain_h.png` (96x96)**
Green (#8BCF5A) → gray (#9A9FA5). Horizontal.

**Image 47 — `blend_plain_mountain_v.png` (96x96)**
Green → gray. Vertical.

**Image 48 — `blend_forest_mountain_h.png` (96x96)**
Dark green (#2F8F3A) → gray (#9A9FA5). Horizontal.

**Image 49 — `blend_forest_mountain_v.png` (96x96)**
Dark green → gray. Vertical.

**Image 50 — `blend_desert_mountain_h.png` (96x96)**
Golden (#E5C16A) → gray (#9A9FA5). Horizontal.

**Image 51 — `blend_desert_mountain_v.png` (96x96)**
Golden → gray. Vertical.

**Image 52 — `blend_forest_desert_h.png` (96x96)**
Dark green (#2F8F3A) → golden (#E5C16A). Horizontal.

**Image 53 — `blend_forest_desert_v.png` (96x96)**
Dark green → golden. Vertical.

---

## CATEGORY 5: OVERLAYS (5 images, each 96x96 px)

### River:

**Image 54 — `overlay_river.png` (96x96)**
River centerline overlay. A smooth curved blue stroke (#5BAED6) running through the center of the tile, approximately 24-34px wide (0.25-0.35 of 96px). Gentle S-curve. Rest of tile is transparent. Clean, simple water line.

### Roads:

**Image 55 — `overlay_road_l1.png` (96x96)**
Thin road overlay. A straight path ~2px wide, light tan (#D4C4A0), running through the center of tile vertically. Rest transparent.

**Image 56 — `overlay_road_l2.png` (96x96)**
Medium road overlay. ~4px wide, darker tan (#B8A47A), center vertical path. Rest transparent.

**Image 57 — `overlay_road_l3.png` (96x96)**
Wide road overlay. ~6px wide, dark tan (#9C8860) with thin darker border lines on each side. Center vertical. Rest transparent.

### Bridge:

**Image 58 — `overlay_bridge.png` (96x96)**
Bridge overlay. Road crossing a water gap — thin tan path with two small support struts underneath (darker). Polytopia style, simple. Rest transparent.

---

## CATEGORY 6: PORT MARKERS (3 images)

Small marker icons for ports on water tiles.

**Image 59 — `marker_port_l1.png` (16x16)**
Tiny pier icon. Simple L-shaped wooden dock. Brown/tan. Viewed from above. 16x16px. Transparent background.

**Image 60 — `marker_port_l2.png` (20x20)**
Medium port. Wider dock structure. 20x20px. Transparent background.

**Image 61 — `marker_port_l3.png` (24x24)**
Large port with a small crane arm. 24x24px. Transparent background.

---

## CATEGORY 7: CITY MARKERS (7 images)

City buildings viewed from above. Polytopia style — simple geometric rooftops. Growing in visual complexity from L1 to L5.

**Image 62 — `marker_city_l1.png` (96x96)**
Level 1 city: 1-2 small simple square rooftops viewed from above. Neutral beige/brown color. Clean geometric shapes, flat shading. Tiny village feel. Center of the 96x96 tile. Rest transparent.

**Image 63 — `marker_city_l2.png` (96x96)**
Level 2 city: 2-3 buildings, slightly larger. One building slightly taller (darker shadow). Modest town. Same style.

**Image 64 — `marker_city_l3.png` (96x96)**
Level 3 city: 3-4 buildings, more varied shapes. One larger central building. Small town feel.

**Image 65 — `marker_city_l4.png` (96x96)**
Level 4 city: 4-5 buildings, denser layout. Two larger structures. Growing city.

**Image 66 — `marker_city_l5.png` (96x96)**
Level 5 city: 5-6 buildings, dense cluster. One prominent tall central structure. Major city feel. Most visually complex, but still clean Polytopia style.

**Image 67 — `marker_capital.png` (16x16)**
Capital badge: tiny golden crown icon. Simple 3-point crown shape, gold (#E5C16A) with bright highlight. 16x16px. Transparent background. Will be placed as badge over city marker.

**Image 68 — `marker_city_neutral.png` (96x96)**
Neutral (unowned) city. Same as L1 city layout but entirely gray (#808080) with lighter gray (#A0A0A0) highlights. Muted, unclaimed feel.

---

## CATEGORY 8: FOG SPRITES (9 images)

Fog-of-war overlay sprites. Dark navy color `#1A1A2E`.

**Image 69 — `fog_unexplored.png` (96x96)**
Solid dark navy fill (#1A1A2E) at 85% opacity. Completely uniform flat rectangle. No texture, no pattern, no noise. Just a flat dark semi-transparent square.

**Image 70 — `fog_edge_n.png` (96x8)**
Horizontal strip 96px wide, 8px tall. Dark navy (#1A1A2E) at top row (85% opacity) fading to fully transparent at bottom row. Clean linear gradient over ~4px, remaining rows fully opaque fog.

**Image 71 — `fog_edge_s.png` (96x8)**
Same strip, inverted: transparent at top, fog color at bottom.

**Image 72 — `fog_edge_e.png` (8x96)**
Vertical strip 8px wide, 96px tall. Fog on right column, transparent on left. Linear gradient.

**Image 73 — `fog_edge_w.png` (8x96)**
Vertical strip. Fog on left column, transparent on right.

**Image 74 — `fog_edge_ne.png` (8x8)**
Tiny corner piece. Fog (#1A1A2E, 85%) at top-right corner fading to transparent at bottom-left. Radial gradient.

**Image 75 — `fog_edge_nw.png` (8x8)**
Corner. Fog at top-left, transparent at bottom-right.

**Image 76 — `fog_edge_se.png` (8x8)**
Corner. Fog at bottom-right, transparent at top-left.

**Image 77 — `fog_edge_sw.png` (8x8)**
Corner. Fog at bottom-left, transparent at top-right.

---

## CATEGORY 9: STATUS BADGES (4 images, each 16x16 px)

Tiny icons placed in the upper-right corner of tiles to show game status effects.

**Image 78 — `badge_siege.png` (16x16)**
Siege status: two small crossed swords icon. Red/dark metal. Clean simple silhouette. 16x16. Transparent background.

**Image 79 — `badge_disruption.png` (16x16)**
Disruption status: small lightning bolt icon. Yellow/electric. Clean shape. 16x16.

**Image 80 — `badge_integration.png` (16x16)**
Integration status: small clock icon (circle with clock hands). Blue/gray. 16x16.

**Image 81 — `badge_damaged_road.png` (16x16)**
Damaged road status: short cracked line icon. Brown/dark. 16x16.

---

## SUMMARY

Total images to generate: **81**

| Category | Count | Size |
|----------|------:|------|
| Terrain bases | 16 | 96x96 each |
| Props | 17 | various (15-60px) |
| Coastline fragments | 8 | edges 96x4 or 4x96, corners ~16x16 |
| Edge blends | 12 | 96x96 each |
| Overlays (river/road/bridge) | 5 | 96x96 each |
| Port markers | 3 | 16x16 to 24x24 |
| City markers | 7 | 96x96 (capital badge 16x16) |
| Fog sprites | 9 | 96x96, edges 96x8/8x96, corners 8x8 |
| Status badges | 4 | 16x16 each |
| **TOTAL** | **81** | |

Please start generating images now, beginning with Category 1 (terrain bases). Generate as many images per response as you can, and I will say "continue" for the next batch.
