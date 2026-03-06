#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# slice_spritesheet.sh — Slice a 9×9 spritesheet into 81 game sprites
#
# Usage:
#   bash scripts/slice_spritesheet.sh <spritesheet.png>              # no grid lines (default)
#   bash scripts/slice_spritesheet.sh <spritesheet.png> --pad 3      # shave 3px per side (legacy red-line grids)
#
# Designed for:
#   - GEMINI_SPRITESHEET_PROMPT_FINAL.md (1728×1728, no grid lines) → default
#   - CHATGPT_FULL_SPRITE_PROMPT.md (1792×1792, no grid lines)      → default
#   - GEMINI_FULL_SPRITE_PROMPT.md (older, 2px red grid lines)       → use --pad 3
#
# Requirements: ImageMagick 7 (`magick`) or ImageMagick 6 (`convert`)
# Output: assets/tiles/ — 81 files, each 96×96 PNG RGBA
# ──────────────────────────────────────────────────────────────────────

set -euo pipefail

GRID_COLS=9
GRID_ROWS=9
OUT_DIR="assets/tiles"
TARGET=96

INPUT="${1:?Usage: bash scripts/slice_spritesheet.sh <spritesheet.png>}"

[[ -f "$INPUT" ]] || { echo "ERROR: File not found: $INPUT" >&2; exit 1; }

# ── Detect ImageMagick ──────────────────────────────────────────────
if command -v magick &>/dev/null; then
  IM="magick"
elif command -v convert &>/dev/null; then
  IM="convert"
else
  echo "ERROR: ImageMagick not found. Install: brew install imagemagick" >&2
  exit 1
fi

# ── Get source dimensions ──────────────────────────────────────────
if [[ "$IM" == "magick" ]]; then
  read -r SRC_W SRC_H <<< "$($IM identify -format '%w %h' "$INPUT")"
else
  read -r SRC_W SRC_H <<< "$(identify -format '%w %h' "$INPUT")"
fi

CELL_W=$((SRC_W / GRID_COLS))
CELL_H=$((SRC_H / GRID_ROWS))

# Padding: pixels to shave from each side after cropping a cell.
# The FINAL Gemini prompt (GEMINI_SPRITESHEET_PROMPT_FINAL.md) uses NO grid
# lines, so PAD=0.  If you use an older spritesheet that has 2px red (#FF0000)
# grid lines between cells, set PAD=3 via --pad flag or edit this default.
PAD=0

# ── Parse optional --pad flag ─────────────────────────────────────
if [[ "${2:-}" == "--pad" ]]; then
  PAD="${3:?--pad requires a value (e.g. --pad 3)}"
fi

echo "══════════════════════════════════════════════════"
echo "  Spritesheet Slicer — Red Age (9×9 → 81 sprites)"
echo "══════════════════════════════════════════════════"
echo "Source:  ${SRC_W}×${SRC_H} px"
if [[ "$PAD" -gt 0 ]]; then
  echo "Cell:   ${CELL_W}×${CELL_H} px (→ shave ${PAD}px → resize ${TARGET}×${TARGET})"
else
  echo "Cell:   ${CELL_W}×${CELL_H} px (→ resize ${TARGET}×${TARGET})"
fi
echo "Output: ${OUT_DIR}/"
echo "──────────────────────────────────────────────────"

# ── Sprite map ──────────────────────────────────────────────────────
# Format: "ROW COL FILENAME MODE"
#   MODE = "fill" (terrain/blend/fog that fills entire cell — no bg removal)
#          "icon" (prop/badge/marker on white bg — remove white → transparent)

SPRITES=(
  # ── Row 0: PLAIN v0-v3, FOREST v0-v3, MOUNTAIN v0 ──
  "0 0 terrain_plain_v0.png fill"
  "0 1 terrain_plain_v1.png fill"
  "0 2 terrain_plain_v2.png fill"
  "0 3 terrain_plain_v3.png fill"
  "0 4 terrain_forest_v0.png fill"
  "0 5 terrain_forest_v1.png fill"
  "0 6 terrain_forest_v2.png fill"
  "0 7 terrain_forest_v3.png fill"
  "0 8 terrain_mountain_v0.png fill"

  # ── Row 1: MOUNTAIN v1-v2, DESERT v0-v2, WATER v0-v1, CITY L1-L2 ──
  "1 0 terrain_mountain_v1.png fill"
  "1 1 terrain_mountain_v2.png fill"
  "1 2 terrain_desert_v0.png fill"
  "1 3 terrain_desert_v1.png fill"
  "1 4 terrain_desert_v2.png fill"
  "1 5 terrain_water_v0.png fill"
  "1 6 terrain_water_v1.png fill"
  "1 7 marker_city_l1.png icon"
  "1 8 marker_city_l2.png icon"

  # ── Row 2: CITY L3-L5, NEUTRAL, CAPITAL, FOG FILL, FOG EDGES ──
  "2 0 marker_city_l3.png icon"
  "2 1 marker_city_l4.png icon"
  "2 2 marker_city_l5.png icon"
  "2 3 marker_city_neutral.png icon"
  "2 4 marker_capital.png icon"
  "2 5 fog_unexplored.png fill"
  "2 6 fog_edge_n.png fill"
  "2 7 fog_edge_s.png fill"
  "2 8 fog_edge_e.png fill"

  # ── Row 3: FOG W, FOG CORNERS, RIVER, ROADS ──
  "3 0 fog_edge_w.png fill"
  "3 1 fog_edge_ne.png fill"
  "3 2 fog_edge_nw.png fill"
  "3 3 fog_edge_se.png fill"
  "3 4 fog_edge_sw.png fill"
  "3 5 overlay_river.png icon"
  "3 6 overlay_road_l1.png icon"
  "3 7 overlay_road_l2.png icon"
  "3 8 overlay_road_l3.png icon"

  # ── Row 4: BRIDGE, BLENDS (8) ──
  "4 0 overlay_bridge.png icon"
  "4 1 blend_plain_forest_h.png fill"
  "4 2 blend_plain_forest_v.png fill"
  "4 3 blend_plain_desert_h.png fill"
  "4 4 blend_plain_desert_v.png fill"
  "4 5 blend_plain_mountain_h.png fill"
  "4 6 blend_plain_mountain_v.png fill"
  "4 7 blend_forest_mountain_h.png fill"
  "4 8 blend_forest_mountain_v.png fill"

  # ── Row 5: BLENDS (4), COAST EDGES (4), COAST CORNER NE ──
  "5 0 blend_desert_mountain_h.png fill"
  "5 1 blend_desert_mountain_v.png fill"
  "5 2 blend_forest_desert_h.png fill"
  "5 3 blend_forest_desert_v.png fill"
  "5 4 coast_edge_n.png icon"
  "5 5 coast_edge_s.png icon"
  "5 6 coast_edge_e.png icon"
  "5 7 coast_edge_w.png icon"
  "5 8 coast_corner_ne.png icon"

  # ── Row 6: COAST CORNERS (3), TREES (4), ROCKS (2) ──
  "6 0 coast_corner_nw.png icon"
  "6 1 coast_corner_se.png icon"
  "6 2 coast_corner_sw.png icon"
  "6 3 prop_tree_0.png icon"
  "6 4 prop_tree_1.png icon"
  "6 5 prop_tree_2.png icon"
  "6 6 prop_tree_3.png icon"
  "6 7 prop_rock_0.png icon"
  "6 8 prop_rock_1.png icon"

  # ── Row 7: ROCK, PEAKS, GRASS, CACTUS ──
  "7 0 prop_rock_2.png icon"
  "7 1 prop_peak_0.png icon"
  "7 2 prop_peak_1.png icon"
  "7 3 prop_grass_0.png icon"
  "7 4 prop_grass_1.png icon"
  "7 5 prop_grass_2.png icon"
  "7 6 prop_cactus_0.png icon"
  "7 7 prop_cactus_1.png icon"
  "7 8 prop_cactus_2.png icon"

  # ── Row 8: DUNES, PORTS, BADGES ──
  "8 0 prop_dune_0.png icon"
  "8 1 prop_dune_1.png icon"
  "8 2 marker_port_l1.png icon"
  "8 3 marker_port_l2.png icon"
  "8 4 marker_port_l3.png icon"
  "8 5 badge_siege.png icon"
  "8 6 badge_disruption.png icon"
  "8 7 badge_integration.png icon"
  "8 8 badge_damaged_road.png icon"
)

# ── Create output dir ──────────────────────────────────────────────
mkdir -p "$OUT_DIR"

# ── Slice ──────────────────────────────────────────────────────────
TOTAL=${#SPRITES[@]}
COUNT=0
ERRORS=0

for entry in "${SPRITES[@]}"; do
  read -r ROW COL FNAME MODE <<< "$entry"

  X=$((COL * CELL_W))
  Y=$((ROW * CELL_H))
  OUT_PATH="${OUT_DIR}/${FNAME}"

  if [[ "$MODE" == "fill" ]]; then
    # Terrain / blend / fog: fills entire cell. No background removal.
    # Crop, optional shave (if PAD>0 for grid-line spritesheets), resize.
    if [[ "$PAD" -gt 0 ]]; then
      $IM "$INPUT" \
        -crop "${CELL_W}x${CELL_H}+${X}+${Y}" +repage \
        -shave "${PAD}x${PAD}" +repage \
        -resize "${TARGET}x${TARGET}!" \
        "$OUT_PATH" 2>/dev/null && STATUS=ok || STATUS=err
    else
      $IM "$INPUT" \
        -crop "${CELL_W}x${CELL_H}+${X}+${Y}" +repage \
        -resize "${TARGET}x${TARGET}!" \
        "$OUT_PATH" 2>/dev/null && STATUS=ok || STATUS=err
    fi
  else
    # Icon / prop / badge / overlay: sprite on white background.
    # Crop, optional shave, resize, then white → transparent.
    if [[ "$PAD" -gt 0 ]]; then
      $IM "$INPUT" \
        -crop "${CELL_W}x${CELL_H}+${X}+${Y}" +repage \
        -shave "${PAD}x${PAD}" +repage \
        -resize "${TARGET}x${TARGET}!" \
        -fuzz 15% -transparent white \
        "$OUT_PATH" 2>/dev/null && STATUS=ok || STATUS=err
    else
      $IM "$INPUT" \
        -crop "${CELL_W}x${CELL_H}+${X}+${Y}" +repage \
        -resize "${TARGET}x${TARGET}!" \
        -fuzz 15% -transparent white \
        "$OUT_PATH" 2>/dev/null && STATUS=ok || STATUS=err
    fi
  fi

  if [[ "$STATUS" == "ok" ]]; then
    COUNT=$((COUNT + 1))
    printf "  [%2d/%d] %-35s (%s) → %s\n" "$COUNT" "$TOTAL" "$FNAME" "$MODE" "$OUT_PATH"
  else
    ERRORS=$((ERRORS + 1))
    echo "  ERROR: R${ROW}C${COL} → $FNAME" >&2
  fi
done

# ── Summary ────────────────────────────────────────────────────────
echo ""
echo "──────────────────────────────────────────────────"
echo "Extracted: ${COUNT}/${TOTAL} sprites → ${OUT_DIR}/"
[[ $ERRORS -gt 0 ]] && echo "Errors:    ${ERRORS}"

# ── Verify ─────────────────────────────────────────────────────────
echo ""
ACTUAL=$(ls -1 "$OUT_DIR"/*.png 2>/dev/null | wc -l | tr -d ' ')
echo "Files in ${OUT_DIR}/: ${ACTUAL}"
echo ""

# Show sample file sizes
echo "Sample sizes:"
for SAMPLE in terrain_plain_v0.png terrain_forest_v0.png fog_unexplored.png prop_tree_0.png badge_siege.png; do
  F="${OUT_DIR}/${SAMPLE}"
  if [[ -f "$F" ]]; then
    if [[ "$IM" == "magick" ]]; then
      SZ=$($IM identify -format '%wx%h' "$F" 2>/dev/null || echo "?")
    else
      SZ=$(identify -format '%wx%h' "$F" 2>/dev/null || echo "?")
    fi
    printf "  %-35s %s\n" "$SAMPLE" "$SZ"
  fi
done

echo ""
echo "Done. Run 'open ${OUT_DIR}' to inspect."
