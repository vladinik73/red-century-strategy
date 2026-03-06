# ChatGPT Prompt — Full Spritesheet for Red Age

> **Workflow:**
> 1. Open ChatGPT Mac client (GPT-4o with image generation)
> 2. Copy everything below the first `---` and send as one message
> 3. Download the generated PNG
> 4. Save as `assets/spritesheet_raw.png`
> 5. Run: `bash scripts/slice_spritesheet.sh assets/spritesheet_raw.png`
>
> The slicing script handles: crop each cell → trim grid lines → resize to 96×96 → remove white bg on icons.

---

Generate exactly one image. The image must be **1792×1792 pixels**, square.

The image contains a **9 columns × 9 rows uniform grid** of game sprite cells. 81 cells total.

## Layout rules (follow precisely):

1. Every cell is the **same size** (1792÷9 ≈ 199×199 px each)
2. Cells are separated by **2px bright red lines (#FF0000)**
3. **ZERO text** in the image — no labels, no titles, no filenames, no numbers, no captions, nothing
4. Each cell has a **white (#FFFFFF) background** with **one sprite centered** in it
5. Sprites that represent full terrain tiles fill their entire cell edge-to-edge
6. Sprites that represent small icons/props are drawn small and centered with white space around them

## Art style (every sprite):

- **Top-down orthographic** view (looking straight down at a game map)
- **Flat shading** — only 3 tones per element: base color, shadow, highlight
- **Battle of Polytopia** visual style: clean, minimal, bright, readable game tiles
- Clean vector-like shapes, crisp silhouettes, saturated but controlled colors
- Consistent lighting from **upper-left** (highlight top-left, shadow bottom-right)
- **Forbidden:** photorealism, pixel art, watercolor, grunge, noise, texture detail, perspective, isometric, 3D

## Color palette (use these exact hex values):

```
PLAIN grass:    base #8BCF5A   shadow #6FAE42   highlight #A6E57A
FOREST:         base #2F8F3A   shadow #216A2A   highlight #47B552
MOUNTAIN:       base #9A9FA5   shadow #6D737A   highlight #D1D6DC
DESERT:         base #E5C16A   shadow #CFA54F   highlight #F2D995
WATER ocean:    base #3D8FD1   shadow #2B6DA4   highlight #5BAED6
Beach sand:     #F1E0A0
River:          #5BAED6
Fog:            #1A1A2E (dark navy)
Neutral city:   #808080 (gray)
```

## Cell contents — 9 rows × 9 columns, left to right, top to bottom:

**Row 0** — terrain base tiles (each fills entire cell):
`[0,0]` bright green flat grass (#8BCF5A), clean, no props
`[0,1]` same grass, 1–2 tiny pebbles near edge
`[0,2]` same grass, subtle warmer green band
`[0,3]` same grass, faint diagonal shadow stripe
`[0,4]` forest: 3 round blob tree canopies from above (#2F8F3A), dark gaps between, highlights #47B552
`[0,5]` forest: 4 smaller round canopies, more spread
`[0,6]` forest: 2 large + 1 small canopy
`[0,7]` forest: 3 canopies, one slightly oval
`[0,8]` mountain: single centered gray triangular peak (#9A9FA5), highlight #D1D6DC upper-left, shadow #6D737A lower-right

**Row 1** — more terrain + first city markers:
`[1,0]` mountain: two peaks (main + smaller offset)
`[1,1]` mountain: single peak, different ridge angle
`[1,2]` desert: golden (#E5C16A) smooth dune ridge diagonal
`[1,3]` desert: two gentle parallel dune curves
`[1,4]` desert: flat sand, subtle wind lines
`[1,5]` water: smooth blue (#3D8FD1) surface, subtle horizontal wave lines (#5BAED6)
`[1,6]` water: same blue, circular ripple arcs
`[1,7]` city L1: 1–2 small square beige rooftops from above, white bg (icon)
`[1,8]` city L2: 2–3 buildings, one taller

**Row 2** — cities, capital badge, fog:
`[2,0]` city L3: 3–4 buildings, one larger central (icon on white)
`[2,1]` city L4: 4–5 buildings, denser
`[2,2]` city L5: 5–6 buildings, one prominent tall structure
`[2,3]` neutral city: same as L1 but entirely gray (#808080)
`[2,4]` capital badge: tiny 3-point gold crown (#E5C16A), small centered icon
`[2,5]` fog fill: solid #1A1A2E dark navy, fills entire cell
`[2,6]` fog edge N: dark navy strip at top, fading to white toward bottom (fills cell)
`[2,7]` fog edge S: dark navy strip at bottom, fading to white toward top
`[2,8]` fog edge E: dark navy strip at right, fading to white toward left

**Row 3** — fog corners, river, roads:
`[3,0]` fog edge W: dark navy at left, fading to white toward right (fills cell)
`[3,1]` fog corner NE: dark #1A1A2E in top-right corner, radial fade to white
`[3,2]` fog corner NW: dark in top-left corner, fade to white
`[3,3]` fog corner SE: dark in bottom-right corner, fade to white
`[3,4]` fog corner SW: dark in bottom-left corner, fade to white
`[3,5]` river: blue (#5BAED6) curved S-stroke through center, ~25% cell width, white bg (icon)
`[3,6]` road L1: thin ~2px light tan vertical line through center, white bg
`[3,7]` road L2: medium ~4px tan vertical line through center
`[3,8]` road L3: wide ~6px dark tan vertical line with border

**Row 4** — bridge + edge blends (terrain transitions, fill entire cell):
`[4,0]` bridge: simple tan road with support struts, white bg (icon)
`[4,1]` blend: left half green #8BCF5A → right half dark green #2F8F3A, smooth horizontal gradient
`[4,2]` blend: top green #8BCF5A → bottom dark green #2F8F3A, vertical gradient
`[4,3]` blend: green #8BCF5A → gold #E5C16A horizontal
`[4,4]` blend: green → gold vertical
`[4,5]` blend: green #8BCF5A → gray #9A9FA5 horizontal
`[4,6]` blend: green → gray vertical
`[4,7]` blend: dark green #2F8F3A → gray #9A9FA5 horizontal
`[4,8]` blend: dark green → gray vertical

**Row 5** — more blends + coastline fragments:
`[5,0]` blend: gold #E5C16A → gray #9A9FA5 horizontal
`[5,1]` blend: gold → gray vertical
`[5,2]` blend: dark green #2F8F3A → gold #E5C16A horizontal
`[5,3]` blend: dark green → gold vertical
`[5,4]` coast edge N: thin sand strip (#F1E0A0) at top of cell, rest white (icon)
`[5,5]` coast edge S: thin sand strip at bottom
`[5,6]` coast edge E: thin vertical sand strip at right
`[5,7]` coast edge W: thin vertical sand strip at left
`[5,8]` coast corner NE: small curved sand fill in top-right corner, rest white (icon)

**Row 6** — coast corners + tree & rock props:
`[6,0]` coast corner NW: sand fill top-left corner (icon)
`[6,1]` coast corner SE: sand fill bottom-right corner
`[6,2]` coast corner SW: sand fill bottom-left corner
`[6,3]` tree prop 0: single round green (#2F8F3A) blob canopy from above, ~50px, centered, white bg
`[6,4]` tree prop 1: slightly oval canopy
`[6,5]` tree prop 2: smaller round canopy
`[6,6]` tree prop 3: gentle pointed canopy
`[6,7]` rock prop 0: angular gray (#9A9FA5) triangular rock, ~40px, centered, white bg
`[6,8]` rock prop 1: different angle gray rock

**Row 7** — more props:
`[7,0]` rock prop 2: smaller flat gray rock (icon)
`[7,1]` peak prop 0: tall gray triangular mountain peak with snow tip, ~60px (icon)
`[7,2]` peak prop 1: similar peak, different angle
`[7,3]` grass prop 0: tiny green (#8BCF5A) grass tuft, ~15px, centered (icon)
`[7,4]` grass prop 1: wider tuft
`[7,5]` grass prop 2: thinner blades
`[7,6]` cactus prop 0: small saguaro cactus, dark green, ~35px (icon)
`[7,7]` cactus prop 1: round barrel cactus
`[7,8]` cactus prop 2: flat prickly pear

**Row 8** — dunes, ports, status badges:
`[8,0]` dune prop 0: low golden (#E5C16A) sand wave, ~20px, centered (icon)
`[8,1]` dune prop 1: different dune curve
`[8,2]` port L1: tiny L-shaped wooden pier, brown, ~16px, centered (icon)
`[8,3]` port L2: wider dock, ~20px
`[8,4]` port L3: dock with small crane, ~24px
`[8,5]` badge siege: tiny red crossed swords, ~16px, centered (icon)
`[8,6]` badge disruption: tiny yellow lightning bolt, ~16px
`[8,7]` badge integration: tiny blue-gray clock icon, ~16px
`[8,8]` badge damaged road: tiny brown cracked line, ~16px

## Final checklist:
- Image size: 1792×1792 px, square
- Grid: exactly 9×9 uniform cells
- Dividers: 2px red #FF0000 lines
- Text: NONE (zero text anywhere)
- Style: flat, top-down, Polytopia-like, clean
- Colors: use the hex palette above
- One sprite per cell, centered
