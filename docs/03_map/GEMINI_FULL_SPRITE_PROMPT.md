# Gemini Prompt — Full Spritesheet for Red Age

> **Workflow:**
> 1. Copy everything below the first `---` and paste into Gemini
> 2. Download the generated PNG
> 3. Place at `assets/spritesheet_raw.png`
> 4. Run: `bash scripts/slice_spritesheet.sh assets/spritesheet_raw.png`
>
> **If Gemini ignores the grid:** try splitting into 3 batches (rows 0-2, 3-5, 6-8).
> Use the batch prompts in §BATCHES at the bottom.

---

Create one image. The image is a strict uniform grid: exactly 9 columns and 9 rows. Total 81 cells. No exceptions.

CRITICAL LAYOUT RULES:
- The image is a PERFECT 9×9 grid of equal-sized square cells
- Every cell is EXACTLY the same size
- Cells are separated by 2px bright red (#FF0000) lines (so I can find the grid programmatically)
- There is NO text anywhere in the image — no labels, no titles, no captions, no filenames, no numbers
- There are NO section headers or category names
- Each cell has a plain white background with one small game sprite centered in it
- The image should be as large as possible (at least 1800×1800 pixels)

Style for all sprites: top-down view, flat shading, Polytopia game style, clean simple shapes, no photorealism, no pixel art, no watercolor, no noise.

Here is what goes in each cell, reading left to right, top to bottom:

Row 0: four green grass tiles (#8BCF5A), four dark-green forest tiles with round blob treetops (#2F8F3A), one gray mountain peak tile (#9A9FA5)

Row 1: two more gray mountain peak tiles (different shapes), three golden desert sand tiles (#E5C16A), two blue ocean water tiles (#3D8FD1), two small city buildings from above (beige rooftops)

Row 2: three more city building clusters (growing from 3 to 5 buildings), one gray city (neutral), one tiny gold crown icon, one solid dark navy square (#1A1A2E), three dark navy gradient edges (fading to white from top/bottom/right)

Row 3: one dark navy gradient edge (fading from left), four dark navy corner gradients (each corner has fog in one corner fading out), one blue curved river line on white, three tan vertical road lines on white (thin/medium/thick)

Row 4: one bridge icon on white, twelve color gradient squares — each shows one color smoothly blending into another color: green↔dark-green, green↔gold, green↔gray, dark-green↔gray, gold↔gray, dark-green↔gold (two per pair: horizontal and vertical blend direction)

Wait, that's 13 items for row 4. Let me recount. Bridge (1) + 8 blend gradients = 9. Correct:

Row 4: one bridge on white, green-to-dark-green horizontal blend, green-to-dark-green vertical blend, green-to-gold horizontal, green-to-gold vertical, green-to-gray horizontal, green-to-gray vertical, dark-green-to-gray horizontal, dark-green-to-gray vertical

Row 5: gold-to-gray horizontal blend, gold-to-gray vertical blend, dark-green-to-gold horizontal, dark-green-to-gold vertical, four thin sand-colored (#F1E0A0) beach strips (top/bottom/right/left edges of cell), one sand-colored corner fill (top-right)

Row 6: three more sand corner fills (top-left, bottom-right, bottom-left), four individual round green tree icons (~50px centered in cell), two angular gray rock icons (~40px centered)

Row 7: one more gray rock, two tall gray triangular peak icons (~60px), three tiny green grass tufts (~15px centered), three small cactus icons (~35px centered in cell)

Row 8: two small golden sand dune accents (~20px), three small dock/pier icons (growing from tiny to small with crane), four tiny 16px status icons centered in cell: red crossed swords, yellow lightning bolt, blue-gray clock, brown cracked line

REMEMBER: No text anywhere. Perfect 9×9 grid. Red grid lines. White cell backgrounds. One sprite per cell.

---

## BATCH PROMPTS (if Gemini can't do 81 at once)

### Batch A — Rows 0-2 (terrain + cities + fog) — 27 cells

Create one image: a strict 9×3 grid of equal square cells, separated by 2px red (#FF0000) lines. No text, no labels. White cell background, one game sprite per cell. Style: top-down, flat shading, Polytopia game style.

Row 0 (9 cells): 4 green grass tiles (#8BCF5A with shadow #6FAE42 and highlight #A6E57A, each variant slightly different — clean/pebbles/texture/shadow), 4 dark-green forest tiles (#2F8F3A with round blob tree canopies, 3-4 trees per tile), 1 gray mountain peak tile (#9A9FA5 triangular peak).

Row 1 (9 cells): 2 gray mountain peaks (different shapes), 3 golden desert tiles (#E5C16A smooth dunes), 2 blue water tiles (#3D8FD1 calm waves), 2 small beige city rooftop clusters from above (1-2 buildings, 2-3 buildings).

Row 2 (9 cells): 3 city rooftop clusters (3-5 buildings, growing), 1 gray neutral city, 1 tiny gold crown badge, 1 solid dark navy (#1A1A2E) square, 3 dark navy fog edges (gradient: fog fading to white — from top, from bottom, from right).

### Batch B — Rows 3-5 (fog corners + overlays + blends + coast) — 27 cells

Create one image: a strict 9×3 grid of equal square cells, separated by 2px red (#FF0000) lines. No text, no labels. White cell background. Style: top-down, flat shading, game asset.

Row 0 (9 cells): 1 dark navy fog edge from left, 4 dark navy (#1A1A2E) corner gradients (fog in NE/NW/SE/SW corner fading to white), 1 blue (#5BAED6) curved river stroke on white, 3 vertical tan road lines of increasing width on white.

Row 1 (9 cells): 1 simple bridge icon, then 8 color-blend gradient squares: green(#8BCF5A)→dark-green(#2F8F3A) H, same V, green→gold(#E5C16A) H, same V, green→gray(#9A9FA5) H, same V, dark-green→gray H, dark-green→gray V.

Row 2 (9 cells): gold→gray H, gold→gray V, dark-green→gold H, dark-green→gold V, then 4 thin warm-sand (#F1E0A0) beach edge strips (at top/bottom/right/left of cell), 1 sand corner fill at top-right.

### Batch C — Rows 6-8 (coast corners + props + ports + badges) — 27 cells

Create one image: a strict 9×3 grid of equal square cells, separated by 2px red (#FF0000) lines. No text, no labels. White cell background. Style: top-down, flat shading, Polytopia game asset.

Row 0 (9 cells): 3 warm-sand (#F1E0A0) corner fills (top-left, bottom-right, bottom-left), 4 individual round green (#2F8F3A/#47B552) tree crown icons centered (~50px), 2 angular gray (#9A9FA5/#D1D6DC) rock icons (~40px).

Row 1 (9 cells): 1 gray rock, 2 tall gray triangular mountain peaks (~60px), 3 tiny bright green (#8BCF5A) grass tufts (~15px), 3 small cactus icons (~35px) on white.

Row 2 (9 cells): 2 small golden (#E5C16A) sand dune accents (~20px), 3 dock/pier icons from above (small→medium→with crane, brown/tan), 4 tiny icons (16px each, centered): red crossed swords, yellow lightning bolt, blue-gray clock, brown cracked line.
