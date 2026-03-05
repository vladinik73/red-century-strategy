#!/usr/bin/env python3
"""Prepare raw tile PNGs into canonical 96x96 PNG RGBA assets (scaffolding script).

Usage:
  python prepare_tiles.py --in <folder> --out <folder> [--size 96] [--pad 6] [--snap-palette]
"""
import argparse
from pathlib import Path
from PIL import Image

# Example palette (replace from Tile_Style_Bible if you enable snapping)
CANON_PALETTE = [
    (0x8B, 0xCF, 0x5A),  # PLAIN
    (0x2F, 0x8F, 0x3A),  # FOREST
    (0x7A, 0x7F, 0x86),  # MOUNTAIN
    (0xE5, 0xC1, 0x6A),  # DESERT
    (0x3A, 0x8F, 0xC9),  # WATER
]

def nearest_color(rgb):
    r, g, b = rgb
    best = CANON_PALETTE[0]
    best_d = 10**18
    for pr, pg, pb in CANON_PALETTE:
        d = (r-pr)*(r-pr) + (g-pg)*(g-pg) + (b-pb)*(b-pb)
        if d < best_d:
            best_d = d
            best = (pr, pg, pb)
    return best

def crop_to_alpha(img: Image.Image, pad: int) -> Image.Image:
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    if bbox is None:
        return img
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(img.width, x1 + pad)
    y1 = min(img.height, y1 + pad)
    return img.crop((x0, y0, x1, y1))

def palette_snap(img: Image.Image) -> Image.Image:
    px = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            nr, ng, nb = nearest_color((r, g, b))
            px[x, y] = (nr, ng, nb, a)
    return img

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", required=True)
    ap.add_argument("--out", dest="out", required=True)
    ap.add_argument("--size", type=int, default=96)
    ap.add_argument("--pad", type=int, default=6)
    ap.add_argument("--snap-palette", action="store_true")
    args = ap.parse_args()

    inp = Path(args.inp)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    processed = 0
    skipped = 0

    for p in sorted(inp.glob("*.png")):
        try:
            img = Image.open(p).convert("RGBA")
            img = crop_to_alpha(img, args.pad)
            img = img.resize((args.size, args.size), Image.Resampling.LANCZOS)
            if args.snap_palette:
                img = palette_snap(img)
            img.save(out / p.name, format="PNG")
            processed += 1
        except Exception:
            skipped += 1

    print(f"processed={processed} skipped={skipped} out={out}")

if __name__ == "__main__":
    main()
