#!/usr/bin/env python3
"""Check that required tiles exist and match basic properties (96x96 RGBA)."""
import argparse
from pathlib import Path
from PIL import Image

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--assets", required=True)
    ap.add_argument("--list", required=True)
    ap.add_argument("--size", type=int, default=96)
    args = ap.parse_args()

    assets = Path(args.assets)
    req = []
    for line in Path(args.list).read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        req.append(s)

    missing = []
    bad = []

    for name in req:
        p = assets / name
        if not p.exists():
            missing.append(name)
            continue
        try:
            img = Image.open(p)
            if img.size != (args.size, args.size):
                bad.append(f"{name}: size={img.size}")
            if img.mode not in ("RGBA", "LA"):
                bad.append(f"{name}: mode={img.mode}")
        except Exception as e:
            bad.append(f"{name}: error={e}")

    if missing:
        print("MISSING:")
        for m in missing:
            print(" -", m)
    if bad:
        print("BAD:")
        for b in bad:
            print(" -", b)

    if missing or bad:
        raise SystemExit(1)

    print("OK")

if __name__ == "__main__":
    main()
