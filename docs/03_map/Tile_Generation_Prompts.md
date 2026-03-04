# Tile Generation Prompts
Red Age Strategy
Version: v1.0

**Canonical path:** `docs/03_map/Tile_Generation_Prompts.md`

Канон: [`Tile_Style_Bible.md`](Tile_Style_Bible.md), [`Tile_Asset_Production_Spec.md`](Tile_Asset_Production_Spec.md), [`Tile_Asset_List.md`](Tile_Asset_List.md).

---

## 1. Purpose

Ready-to-use prompts for **AI image generation** (Midjourney, DALL-E, Stable Diffusion) to produce tile sprites for the Red Age map. Each prompt encodes the visual style from `Tile_Style_Bible.md` into generation parameters.

### Workflow

1. Copy the **global style prefix** (§2) + **terrain/prop prompt** (§4-§6)
2. Add the **negative prompt** (§3) as negative/avoid terms
3. Generate at 512x512 or higher
4. Post-process: crop, resize to 96x96, color-correct to palette, validate (§7)
5. Run through Quality Checklist (`Tile_Asset_Production_Spec.md` §9)

---

## 2. Global Style Prefix

Prepend this to ALL prompts:

```
Top-down view, game tile sprite, Polytopia-inspired style, flat shading,
clean vector shapes, soft gradient, limited texture noise, saturated colors,
strategy game asset, square tile, transparent background, no text,
no watermarks, centered composition
```

### Midjourney-specific suffix

```
--ar 1:1 --style raw --s 250 --no text watermark signature
```

### DALL-E-specific instruction

```
Style: flat-shaded vector game art similar to Battle of Polytopia.
Output: square PNG with transparent background. No text.
```

---

## 3. Negative Prompt

Include as negative prompt / `--no` parameter:

```
photorealism, photograph, pixel art, 8-bit, retro pixels, watercolor,
painted, oil painting, grunge texture, noise, film grain, dirty,
realistic shadows, ray tracing, complex lighting, reflections, caustics,
perspective view, isometric, 3D render, text, labels, watermark,
signature, border, frame, vignette, blurry, low quality
```

---

## 4. Terrain Base Prompts

### 4.1 PLAIN (4 variants)

```
Flat grassland tile, smooth green surface, subtle grass gradient,
bright spring green (#8BCF5A), soft lighter highlights (#A6E57A),
gentle darker shadows (#6FAE42), minimal detail, very clean,
0-2 tiny pebbles or grass tufts for variation
```

Variant instructions:
- v0: completely clean, minimal props
- v1: 1-2 tiny scattered pebbles
- v2: subtle grass texture variation
- v3: slight color warmth shift

### 4.2 FOREST (4 variants)

```
Forest tile viewed from above, clustered stylized trees,
round/blob tree canopy shapes, Polytopia-style treetops,
deep green (#2F8F3A) canopy, darker shadows (#216A2A),
brighter leaf highlights (#47B552), 2-4 trees per cluster,
ground barely visible between canopies
```

Variant instructions:
- v0: 3 round-crown trees, tight cluster
- v1: 4 trees, slightly spread
- v2: 2 large canopies + 1 small
- v3: 3 trees with one slightly different shape

### 4.3 MOUNTAIN (3 variants)

```
Mountain tile viewed from above, sharp stylized peak,
triangular rock formation, gray stone (#9A9FA5),
clear light highlight (#D1D6DC) on left slope,
dark shadow (#6D737A) on right slope,
no realistic rock texture, clean geometric shapes,
strong silhouette readable at small size
```

Variant instructions:
- v0: single prominent peak, centered
- v1: two peaks, main + secondary
- v2: single peak with different ridge angle

### 4.4 DESERT (3 variants)

```
Desert tile viewed from above, smooth sand dunes,
gentle curved shapes, warm golden sand (#E5C16A),
subtle shadow curves (#CFA54F), bright sand highlights (#F2D995),
very low texture noise, clean and sparse,
no complex patterns
```

Variant instructions:
- v0: single smooth dune ridge
- v1: two gentle dune curves
- v2: flat sand with subtle wind lines

### 4.5 WATER (2 variants)

```
Ocean water tile viewed from above, smooth blue surface,
medium blue (#3D8FD1), subtle darker depth (#2B6DA4),
gentle simple wave highlights (#5BAED6),
no reflections, no complex caustics, no foam detail,
clean flat water surface
```

Variant instructions:
- v0: subtle horizontal wave hints
- v1: slight circular ripple pattern

---

## 5. Prop Prompts

### 5.1 Trees (FOREST props, 4 variants)

```
Single stylized tree viewed from above, round crown blob shape,
Polytopia-style game tree, green canopy (#2F8F3A / #47B552),
small brown trunk barely visible, height ~50px in 96px tile,
flat shading, clean silhouette, transparent background
```

### 5.2 Rocks (MOUNTAIN props, 3 variants)

```
Single angular rock viewed from above, triangular stone shape,
gray (#9A9FA5) with highlight (#D1D6DC), flat shading,
height ~40px in 96px tile, clean geometric shape,
transparent background, game asset
```

### 5.3 Peaks (MOUNTAIN props, 2 variants)

```
Tall stylized mountain peak viewed from above, tall triangle shape,
white/snow tip, gray body (#9A9FA5), height ~60px in 96px tile,
flat shading, strong silhouette, transparent background
```

### 5.4 Grass tufts (PLAIN props, 3 variants)

```
Small grass tuft viewed from above, short green blades,
bright green (#8BCF5A / #A6E57A), height ~15px,
very small decorative element, flat shading,
transparent background
```

### 5.5 Cactus (DESERT props, 3 variants)

```
Single stylized cactus viewed from above, saguaro or round barrel shape,
dark green on golden sand, height ~35px in 96px tile,
flat shading, clean shape, transparent background
```

### 5.6 Dunes (DESERT props, 2 variants)

```
Small sand dune accent viewed from above, low curved sand wave,
golden (#E5C16A) with subtle shadow (#CFA54F),
height ~20px, very subtle, transparent background
```

---

## 6. Coastline and Blend Prompts

### 6.1 Beach edge strip

```
Thin beach strip, narrow sand border (#F1E0A0),
transition between green land and blue water,
~4px wide, straight edge, flat colors,
transparent background, seamless tileable
```

### 6.2 Terrain blend (example: plain-to-forest)

```
Terrain transition overlay, soft gradient blend,
left half: bright green grass (#8BCF5A) fading into
right half: dark forest green (#2F8F3A),
smooth crossfade, no hard edge, flat shading,
transparent background, 96px wide
```

Repeat pattern for all 6 blend pairs (see Tile_Asset_List.md §6), substituting appropriate colors.

---

## 7. Post-Processing Pipeline

After AI generation, every sprite must go through:

| Step | Action | Tool suggestion |
|------|--------|----------------|
| 1 | **Background removal** | Remove any non-transparent background | rembg / manual |
| 2 | **Crop & resize** | Trim to content, resize to target (96x96 for terrain) | ImageMagick |
| 3 | **Color correction** | Adjust hues to match Tile_Style_Bible §5 palette | GIMP / Photoshop curves |
| 4 | **Edge cleanup** | Ensure 1px transparent border, no aliased edges | Manual |
| 5 | **Center check** | Verify center zone is clear (terrain) or asset is centered (props) | Visual inspection |
| 6 | **Silhouette test** | Downscale to 30% and confirm recognizability | Visual inspection |
| 7 | **Side-by-side** | Place all variants together and confirm visual consistency | Grid layout |
| 8 | **Tiling test** | Place 3x3 grid of terrain tiles to check seamless edges | Tile preview tool |
| 9 | **Quality checklist** | Run full checklist from Tile_Asset_Production_Spec.md §9 | Manual |

---

## 8. Prompt Parameters by Tool

### 8.1 Midjourney

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `--ar` | 1:1 | Square output |
| `--style` | raw | Less Midjourney stylization, more prompt-faithful |
| `--s` | 200-300 | Medium stylization |
| `--no` | (see §3) | Negative terms |
| `--q` | 1 | Standard quality |
| `--v` | 6.1 or latest | Latest model |

### 8.2 Stable Diffusion

| Parameter | Value |
|-----------|-------|
| Resolution | 512x512 (upscale after) |
| Sampler | DPM++ 2M Karras |
| Steps | 30-50 |
| CFG scale | 7-9 |
| Negative prompt | See §3 |

### 8.3 DALL-E 3

| Parameter | Value |
|-----------|-------|
| Size | 1024x1024 (downscale after) |
| Quality | HD |
| Style | Natural |

---

## 9. Iteration Notes

### Common issues and fixes

| Problem | Solution |
|---------|----------|
| Too much texture detail | Increase "flat shading" / "minimal texture" emphasis. Add "very clean, simple" |
| Perspective instead of top-down | Emphasize "top-down view", "orthographic", "viewed from directly above" |
| Text/watermarks appearing | Strengthen negative prompt: "absolutely no text, no letters, no numbers" |
| Colors too dark/muted | Specify exact hex values, add "bright", "saturated", "vibrant" |
| Too realistic | Increase "stylized", "vector art", "game asset" terms. Strengthen negative "photorealism" |
| Props too large | Specify exact pixel dimensions relative to tile size |
| Not Polytopia enough | Add "Battle of Polytopia style", "low-poly game art", "clean geometric shapes" |

### Recommended generation order

1. Generate PLAIN first (simplest, establishes baseline)
2. WATER second (establishes contrast)
3. FOREST (most complex due to tree clusters)
4. DESERT (similar to PLAIN but warm palette)
5. MOUNTAIN (requires strong silhouette testing)
6. Props after all terrain bases are approved
7. Coastline and blends last (depend on terrain colors being finalized)
