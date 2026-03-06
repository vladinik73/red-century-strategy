#!/usr/bin/env python3
"""
Gemini spritesheet slicer — extracts tile assets from a 16×8 grid layout.

Slicer for a specific Gemini-generated spritesheet layout (16 cols × 8 rows).
Crops to top 768px if taller, outputs 96×96 PNG RGBA. Skips nearly-empty (white) cells.

Usage:
  python3 tools/art/tileset_pipeline/slice_gemini_sheet.py
  python3 tools/art/tileset_pipeline/slice_gemini_sheet.py --dry-run
  python3 tools/art/tileset_pipeline/slice_gemini_sheet.py --force
"""
import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow required. pip install Pillow", file=sys.stderr)
    sys.exit(1)

# ── Config ──────────────────────────────────────────────────────────
DEFAULT_INPUT = "tools/art/tileset_pipeline/inbox/gemini_spritesheet.png"
DEFAULT_OUTPUT = "assets/tiles"
GRID_COLS = 16
GRID_ROWS = 8
MAX_HEIGHT = 768
TILE_SIZE = 96
EMPTY_WHITE_THRESHOLD = 0.95  # cell avg luminance > this → skip

# (row, col) → filename
CELL_MAP = {
    # TERRAIN
    (0, 0): "terrain_plain_v0.png",
    (0, 1): "terrain_plain_v1.png",
    (0, 2): "terrain_plain_v2.png",
    (0, 3): "terrain_plain_v3.png",
    (0, 4): "terrain_forest_v0.png",
    (0, 5): "terrain_forest_v1.png",
    (0, 6): "terrain_forest_v2.png",
    (0, 7): "terrain_forest_v3.png",
    (0, 14): "terrain_mountain_v2.png",
    (0, 15): "terrain_mountain_v3.png",
    (1, 0): "terrain_mountain_v0.png",
    (1, 1): "terrain_mountain_v1.png",
    (1, 2): "terrain_desert_v0.png",
    (1, 3): "terrain_desert_v1.png",
    (1, 4): "terrain_desert_v2.png",
    (1, 5): "terrain_desert_v3.png",
    (1, 6): "terrain_water_v0.png",
    (1, 7): "terrain_water_v1.png",
    (1, 8): "terrain_water_v2.png",
    (1, 9): "terrain_water_v3.png",
    # PROPS: trees
    (0, 8): "prop_tree_v0.png",
    (0, 9): "prop_tree_v1.png",
    (0, 10): "prop_tree_v2.png",
    (0, 11): "prop_tree_v3.png",
    (5, 8): "prop_tree_v4.png",
    (5, 9): "prop_tree_v5.png",
    (5, 10): "prop_tree_v6.png",
    (5, 11): "prop_tree_v7.png",
    # PROPS: rocks
    (5, 14): "prop_rock_v0.png",
    (5, 15): "prop_rock_v1.png",
    (6, 3): "prop_rock_v2.png",
    # PROPS: grass
    (6, 6): "prop_grass_v0.png",
    (6, 7): "prop_grass_v1.png",
    (6, 8): "prop_grass_v2.png",
    (6, 9): "prop_grass_v3.png",
    # PROPS: cacti
    (6, 10): "prop_cactus_v0.png",
    (6, 11): "prop_cactus_v1.png",
    (6, 12): "prop_cactus_v2.png",
    (6, 13): "prop_cactus_v3.png",
    # CITY MARKERS
    (1, 10): "marker_city_l1.png",
    (1, 11): "marker_city_l2.png",
    (1, 12): "marker_city_l3.png",
    (1, 13): "marker_city_l4.png",
    (2, 4): "marker_city_neutral.png",
    (2, 5): "marker_city_capital.png",
    # RIVER / ROADS / BRIDGE
    (3, 5): "overlay_river.png",
    (3, 6): "overlay_road_l1.png",
    (3, 7): "overlay_road_l2.png",
    (3, 8): "overlay_road_l3.png",
    (3, 9): "overlay_road_l4.png",
    (4, 0): "overlay_bridge.png",
    # FOG
    (2, 6): "fog_fill.png",
    (2, 7): "fog_edge_n.png",
    (2, 8): "fog_edge_e.png",
    (2, 9): "fog_edge_s.png",
    (2, 10): "fog_edge_w.png",
    (2, 11): "fog_corner_ne.png",
    (2, 12): "fog_corner_nw.png",
    (2, 13): "fog_corner_se.png",
    (2, 14): "fog_corner_sw.png",
    # BADGES
    (7, 11): "badge_swords.png",
    (7, 12): "badge_lightning.png",
    (7, 13): "badge_clock.png",
    (7, 14): "badge_crack.png",
}


def is_nearly_empty(img: Image.Image, threshold: float = EMPTY_WHITE_THRESHOLD) -> bool:
    """True if cell is mostly white/empty."""
    data = list(img.getdata())
    if not data:
        return True
    total = 0
    count = 0
    for p in data:
        if len(p) >= 3:
            r, g, b = p[:3]
            # luminance
            lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
            total += lum
            count += 1
    if count == 0:
        return True
    return (total / count) >= threshold


def main():
    parser = argparse.ArgumentParser(description="Slice Gemini 16×8 spritesheet into tile assets")
    parser.add_argument("-i", "--input", default=DEFAULT_INPUT, help="Input spritesheet path")
    parser.add_argument("-o", "--output", default=DEFAULT_OUTPUT, help="Output directory")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be saved, no writes")
    parser.add_argument("--force", action="store_true", help="Overwrite existing files")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[3]  # tools/art/tileset_pipeline/ → repo
    input_path = repo_root / args.input
    out_dir = repo_root / args.output

    if not input_path.exists():
        print(f"ERROR: Input not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    img = Image.open(input_path).convert("RGBA")
    w, h = img.size
    if h > MAX_HEIGHT:
        img = img.crop((0, 0, w, MAX_HEIGHT))
        h = MAX_HEIGHT

    cell_w = w // GRID_COLS
    cell_h = h // GRID_ROWS

    if args.dry_run:
        print("── DRY RUN ──")
    print(f"Input:  {input_path}")
    print(f"Output: {out_dir}/")
    print(f"Grid:   {GRID_COLS}×{GRID_ROWS}, cell {cell_w}×{cell_h} → {TILE_SIZE}×{TILE_SIZE}")
    print()

    created = 0
    skipped_empty = 0
    skipped_exists = 0

    out_dir.mkdir(parents=True, exist_ok=True)

    for (row, col), fname in sorted(CELL_MAP.items(), key=lambda x: (x[0][0], x[0][1])):
        x = col * cell_w
        y = row * cell_h
        cell = img.crop((x, y, x + cell_w, y + cell_h))
        if cell_w != TILE_SIZE or cell_h != TILE_SIZE:
            cell = cell.resize((TILE_SIZE, TILE_SIZE), Image.Resampling.LANCZOS)
        else:
            cell = cell.copy()

        if is_nearly_empty(cell):
            skipped_empty += 1
            if args.dry_run:
                print(f"  SKIP (empty): R{row}C{col} → {fname}")
            continue

        out_path = out_dir / fname
        if out_path.exists() and not args.force and not args.dry_run:
            skipped_exists += 1
            continue

        if args.dry_run:
            print(f"  SAVE: R{row}C{col} → {fname}")
            created += 1
        else:
            cell.save(out_path, "PNG")
            created += 1

    print()
    print("── Summary ──")
    print(f"  Created:      {created}")
    print(f"  Skipped (empty): {skipped_empty}")
    if not args.dry_run:
        print(f"  Skipped (exists, use --force): {skipped_exists}")
    print()


if __name__ == "__main__":
    main()
