#!/usr/bin/env python3
"""
Debug spritesheet slicer — gridline-based slicing for Gemini sheets with red grid lines.

README — 3 steps:
  1. python3 tools/art/tileset_pipeline/slice_sheet_debug.py --debug --dry-run
     (if grid wrong: add --cols 16 --rows 8 to force equal division)
  2. Open out/debug_grid.png and contact_sheet.png → verify grid aligns
  3. python3 tools/art/tileset_pipeline/slice_sheet_debug.py --debug --force

Input: inbox/gemini_spritesheet.jpeg (or first *.jpeg|*.jpg|*.png in inbox)
Mapping: gemini_mapping.json (R{r}C{c} → basename). Uses real cell intervals from detected lines.
"""
import argparse
import json
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("ERROR: Pillow required. Run: pip install Pillow", file=sys.stderr)
    sys.exit(1)

# ── Red line detection ──────────────────────────────────────────────
RED_R_MIN = 150
RED_G_MAX = 120
RED_B_MAX = 120
LINE_FRAC_THRESHOLD = 0.35

# ── Defaults ─────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parents[2]
DEFAULT_INPUT = REPO_ROOT / "tools/art/tileset_pipeline/inbox/gemini_spritesheet.jpeg"
DEFAULT_OUTPUT = REPO_ROOT / "assets/tiles"
DEFAULT_DEBUG_OUT = SCRIPT_DIR / "out"
MAPPING_FILE = SCRIPT_DIR / "gemini_mapping.json"

# 8 control cells for debug highlight
CONTROL_CELLS = [(0, 0), (0, 5), (0, 15), (3, 0), (3, 7), (5, 10), (7, 0), (7, 15)]


def find_input(path: Path):
    """Resolve input: exact path, or first *.jpeg|*.jpg|*.png in parent dir."""
    if path.exists():
        return path
    parent = path.parent
    if not parent.exists():
        return None
    for ext in ("*.jpeg", "*.jpg", "*.png"):
        for f in sorted(parent.glob(ext)):
            return f
    return None


def load_mapping():
    """Load R0C0 -> basename mapping. null values = skip cell."""
    if not MAPPING_FILE.exists():
        return None
    with open(MAPPING_FILE) as f:
        data = json.load(f)
    return {k: (v if v else None) for k, v in data.items()}


def _is_red(r: int, g: int, b: int) -> bool:
    return r > RED_R_MIN and g < RED_G_MAX and b < RED_B_MAX


def detect_red_lines(img: Image.Image):
    """
    Detect vertical and horizontal red grid lines.
    Returns (v_lines, h_lines) where each is a sorted list of x or y coordinates.
    """
    rgb = img.convert("RGB")
    w, h = rgb.size
    pixels = list(rgb.getdata())

    def col_red_frac(x: int) -> float:
        count = 0
        for y in range(h):
            i = y * w + x
            r, g, b = pixels[i]
            if _is_red(r, g, b):
                count += 1
        return count / h if h else 0

    def row_red_frac(y: int) -> float:
        count = 0
        for x in range(w):
            i = y * w + x
            r, g, b = pixels[i]
            if _is_red(r, g, b):
                count += 1
        return count / w if w else 0

    def find_lines_1d(size: int, frac_fn) -> list:
        is_line = [frac_fn(i) > LINE_FRAC_THRESHOLD for i in range(size)]
        bands = []
        i = 0
        while i < size:
            if is_line[i]:
                start = i
                while i < size and is_line[i]:
                    i += 1
                bands.append((start, i - 1))
            else:
                i += 1
        return [int((a + b) / 2) for a, b in bands]

    v_lines = find_lines_1d(w, col_red_frac)
    h_lines = find_lines_1d(h, row_red_frac)

    if not v_lines or v_lines[0] > 5:
        v_lines = [0] + v_lines
    if not v_lines or v_lines[-1] < w - 5:
        v_lines = v_lines + [w]
    if not h_lines or h_lines[0] > 5:
        h_lines = [0] + h_lines
    if not h_lines or h_lines[-1] < h - 5:
        h_lines = h_lines + [h]

    v_lines = sorted(set(v_lines))
    h_lines = sorted(set(h_lines))
    return v_lines, h_lines


def center_crop_to_square(img: Image.Image) -> Image.Image:
    w, h = img.size
    if w == h:
        return img
    s = min(w, h)
    left = (w - s) // 2
    top = (h - s) // 2
    return img.crop((left, top, left + s, top + s))


def main():
    parser = argparse.ArgumentParser(description="Gridline-based spritesheet slicer")
    parser.add_argument("--input", "-i", type=Path, default=DEFAULT_INPUT, help="Input spritesheet")
    parser.add_argument("--output", "-o", type=Path, default=DEFAULT_OUTPUT, help="Output directory")
    parser.add_argument("--inset", type=int, default=2, help="Trim inside each cell (remove grid lines)")
    parser.add_argument("--tile-size", type=int, default=96, help="Output tile size")
    parser.add_argument("--cols", type=int, default=0, help="Override cols (0=use detected)")
    parser.add_argument("--rows", type=int, default=0, help="Override rows (0=use detected)")
    parser.add_argument("--dry-run", action="store_true", help="No tile writes")
    parser.add_argument("--force", action="store_true", help="Overwrite existing")
    parser.add_argument("--debug", action="store_true", help="Save debug_grid.png and contact_sheet.png")
    args = parser.parse_args()

    input_path = find_input(args.input)
    if not input_path or not input_path.exists():
        print(f"ERROR: Input not found: {args.input}", file=sys.stderr)
        sys.exit(1)

    img = Image.open(input_path).convert("RGBA")
    w, h = img.size

    v_lines, h_lines = detect_red_lines(img)
    n_cols = args.cols or (len(v_lines) - 1)
    n_rows = args.rows or (len(h_lines) - 1)

    # If override: use equal division instead of detected lines
    if args.cols or args.rows:
        v_lines = [int(w * c / n_cols) for c in range(n_cols + 1)]
        h_lines = [int(h * r / n_rows) for r in range(n_rows + 1)]

    inset = args.inset
    tile_size = args.tile_size

    mapping = load_mapping()
    out_dir = Path(args.output)
    out_dir.mkdir(parents=True, exist_ok=True)
    debug_out = Path(DEFAULT_DEBUG_OUT)
    debug_out.mkdir(parents=True, exist_ok=True)

    print(f"Input:  {input_path}")
    print(f"Output: {out_dir}/")
    print(f"Grid:   {n_cols}×{n_rows} (from {len(v_lines)-1} v-lines × {len(h_lines)-1} h-lines)")
    print(f"Inset:  {inset}px, tile-size: {tile_size}")
    print(f"Mapping: {'gemini_mapping.json' if mapping else 'none (r{r}_c{c}.png)'}")
    if args.dry_run:
        print("── DRY RUN ──")
    print()

    tiles = []

    for r in range(n_rows):
        for c in range(n_cols):
            key = f"R{r}C{c}"
            if mapping is not None:
                name = mapping.get(key)
                if name is None:
                    continue
                fname = f"{name}.png"
            else:
                fname = f"r{r}_c{c}.png"

            x1, x2 = v_lines[c], v_lines[c + 1]
            y1, y2 = h_lines[r], h_lines[r + 1]
            cw, ch = x2 - x1, y2 - y1

            if cw < 4 or ch < 4:
                continue

            cell = img.crop((x1, y1, x2, y2))
            if inset > 0 and cw > 2 * inset and ch > 2 * inset:
                cell = cell.crop((inset, inset, cw - inset, ch - inset))

            cell = center_crop_to_square(cell)
            cell = cell.resize((tile_size, tile_size), Image.Resampling.LANCZOS)
            tiles.append((r, c, cell, fname, (x1, y1, x2, y2)))

    # Debug outputs
    if args.debug:
        grid_img = img.copy()
        draw = ImageDraw.Draw(grid_img)
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 14)
        except Exception:
            font = ImageFont.load_default()

        # Draw found lines (green)
        for x in v_lines:
            draw.line([(x, 0), (x, h)], fill="lime", width=2)
        for y in h_lines:
            draw.line([(0, y), (w, y)], fill="lime", width=2)

        # Draw cell labels and control cell borders
        for r, c, _, fname, (x1, y1, x2, y2) in tiles:
            draw.text((x1 + 2, y1 + 2), f"R{r}C{c}", fill="white", font=font)
            if (r, c) in CONTROL_CELLS:
                for i in range(4):
                    draw.rectangle(
                        [x1 + i, y1 + i, x2 - 1 - i, y2 - 1 - i],
                        outline="lime",
                        width=1,
                    )

        grid_path = debug_out / "debug_grid.png"
        grid_img.save(grid_path)
        print(f"Saved: {grid_path}")

        # contact_sheet.png (6×4, first 24 tiles)
        n_show = min(24, len(tiles))
        cols_show, rows_show = 6, 4
        sheet_w = cols_show * tile_size
        sheet_h = rows_show * tile_size + 20 * rows_show
        sheet = Image.new("RGBA", (sheet_w, sheet_h), (40, 40, 40, 255))
        sheet_draw = ImageDraw.Draw(sheet)

        for i in range(n_show):
            r, c, tile, fname, _ = tiles[i]
            col_i, row_i = i % cols_show, i // cols_show
            px, py = col_i * tile_size, row_i * (tile_size + 20)
            sheet.paste(tile, (px, py))
            sheet_draw.text((px, py + tile_size + 2), fname, fill="white", font=font)

        sheet_path = debug_out / "contact_sheet.png"
        sheet.save(sheet_path)
        print(f"Saved: {sheet_path}")

    # Save tiles
    created = 0
    skipped = 0
    for r, c, cell, fname, _ in tiles:
        out_path = out_dir / fname
        if out_path.exists() and not args.force and not args.dry_run:
            skipped += 1
            continue
        if not args.dry_run:
            cell.save(out_path, "PNG")
        created += 1

    print()
    print("── Summary ──")
    print(f"  Created:  {created}")
    print(f"  Skipped (exists): {skipped}")
    if args.debug:
        print(f"  Debug: {debug_out}/debug_grid.png, contact_sheet.png")
    print()


if __name__ == "__main__":
    main()
