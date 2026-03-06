#!/usr/bin/env python3
"""
Gemini spritesheet slicer — autogrid with line|tile|line|tile|line layout.

Slices only every second gap between red lines (tiles, not line gaps).
Layout: |line| tile |line| tile |line|
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

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parents[2]
DEFAULT_INPUT = REPO_ROOT / "tools/art/tileset_pipeline/inbox/gemini_spritesheet.jpeg"
DEFAULT_OUTPUT = REPO_ROOT / "assets/tiles"
DEFAULT_DEBUG_OUT = SCRIPT_DIR / "out"
MAPPING_FILE = SCRIPT_DIR / "gemini_mapping.json"

CONTROL_CELLS = [(0, 0), (0, 5), (0, 15), (3, 0), (3, 7), (5, 10), (7, 0), (7, 15)]


def find_input(path: Path):
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
    if not MAPPING_FILE.exists():
        return None
    with open(MAPPING_FILE) as f:
        data = json.load(f)
    return {k: (v if v else None) for k, v in data.items()}


def _is_red(r: int, g: int, b: int) -> bool:
    return r > RED_R_MIN and g < RED_G_MAX and b < RED_B_MAX


def detect_red_lines(img: Image.Image):
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

    return sorted(set(v_lines)), sorted(set(h_lines))


def is_nearly_empty(img: Image.Image, threshold: float = 0.95) -> bool:
    data = list(img.getdata())
    if not data:
        return True
    total, count = 0, 0
    for p in data:
        if len(p) >= 3:
            r, g, b = p[:3]
            lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
            total += lum
            count += 1
    return (total / count) >= threshold if count else True


def center_crop_to_square(img: Image.Image) -> Image.Image:
    w, h = img.size
    if w == h:
        return img
    s = min(w, h)
    left = (w - s) // 2
    top = (h - s) // 2
    return img.crop((left, top, left + s, top + s))


def main():
    parser = argparse.ArgumentParser(description="Gemini autogrid slicer (line|tile|line layout)")
    parser.add_argument("--input", "-i", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--output", "-o", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--inset", type=int, default=4, help="Trim inside each cell")
    parser.add_argument("--tile-size", type=int, default=96)
    parser.add_argument("--skip-empty", action="store_true", default=True, help="Skip nearly white cells")
    parser.add_argument("--no-skip-empty", action="store_false", dest="skip_empty")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--debug", action="store_true")
    args = parser.parse_args()

    input_path = find_input(args.input)
    if not input_path or not input_path.exists():
        print(f"ERROR: Input not found: {args.input}", file=sys.stderr)
        sys.exit(1)

    img = Image.open(input_path).convert("RGBA")
    w, h = img.size

    xb, yb = detect_red_lines(img)
    inset = args.inset
    tile_size = args.tile_size

    mapping = load_mapping()
    out_dir = Path(args.output)
    out_dir.mkdir(parents=True, exist_ok=True)
    debug_out = Path(DEFAULT_DEBUG_OUT)
    debug_out.mkdir(parents=True, exist_ok=True)

    n_cols = (len(xb) - 2) // 2
    n_rows = (len(yb) - 2) // 2

    print(f"Input:  {input_path}")
    print(f"Output: {out_dir}/")
    print(f"Grid:   {n_cols}×{n_rows} (line|tile|line layout)")
    print(f"Inset:  {inset}px, tile-size: {tile_size}, skip-empty: {args.skip_empty}")
    if args.dry_run:
        print("── DRY RUN ──")
    print()

    tiles = []

    for r in range(1, len(yb) - 1, 2):
        for c in range(1, len(xb) - 1, 2):
            x0, x1 = xb[c], xb[c + 1]
            y0, y1 = yb[r], yb[r + 1]

            r_log = (r - 1) // 2
            c_log = (c - 1) // 2
            key = f"R{r_log}C{c_log}"

            if mapping is not None:
                name = mapping.get(key)
                if name is None:
                    continue
                fname = f"{name}.png"
            else:
                fname = f"r{r_log}_c{c_log}.png"

            cw, ch = x1 - x0, y1 - y0
            if cw < 4 or ch < 4:
                continue

            cell = img.crop((x0, y0, x1, y1))
            if inset > 0 and cw > 2 * inset and ch > 2 * inset:
                cell = cell.crop((inset, inset, cw - inset, ch - inset))

            if args.skip_empty and is_nearly_empty(cell):
                continue

            cell = center_crop_to_square(cell)
            cell = cell.resize((tile_size, tile_size), Image.Resampling.LANCZOS)
            tiles.append((r_log, c_log, cell, fname, (x0, y0, x1, y1)))

    if args.debug:
        grid_img = img.copy()
        draw = ImageDraw.Draw(grid_img)
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 14)
        except Exception:
            font = ImageFont.load_default()

        for x in xb:
            draw.line([(x, 0), (x, h)], fill="lime", width=2)
        for y in yb:
            draw.line([(0, y), (w, y)], fill="lime", width=2)

        for r_log, c_log, _, fname, (x0, y0, x1, y1) in tiles:
            draw.text((x0 + 2, y0 + 2), f"R{r_log}C{c_log}", fill="white", font=font)
            if (r_log, c_log) in CONTROL_CELLS:
                for i in range(4):
                    draw.rectangle(
                        [x0 + i, y0 + i, x1 - 1 - i, y1 - 1 - i],
                        outline="lime",
                        width=1,
                    )

        grid_path = debug_out / "debug_grid.png"
        grid_img.save(grid_path)
        print(f"Saved: {grid_path}")

        n_show = min(24, len(tiles))
        cols_show, rows_show = 6, 4
        sheet_w = cols_show * tile_size
        sheet_h = rows_show * tile_size + 20 * rows_show
        sheet = Image.new("RGBA", (sheet_w, sheet_h), (40, 40, 40, 255))
        sheet_draw = ImageDraw.Draw(sheet)

        for i in range(n_show):
            r_log, c_log, tile, fname, _ = tiles[i]
            col_i, row_i = i % cols_show, i // cols_show
            px, py = col_i * tile_size, row_i * (tile_size + 20)
            sheet.paste(tile, (px, py))
            sheet_draw.text((px, py + tile_size + 2), fname, fill="white", font=font)

        sheet_path = debug_out / "contact_sheet_detected.png"
        sheet.save(sheet_path)
        print(f"Saved: {sheet_path}")

    created = 0
    skipped = 0
    for r_log, c_log, cell, fname, _ in tiles:
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
        print(f"  Debug: {debug_out}/debug_grid.png, contact_sheet_detected.png")
    print()


if __name__ == "__main__":
    main()
