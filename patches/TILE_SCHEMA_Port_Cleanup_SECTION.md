### Patch: Port representation — keep `port_level`, remove `has_port` (v4.22)

In `schemas/tile.schema.json`:
1) If both exist, remove the redundant boolean:
- `has_port` (delete)

2) Keep canonical:
- `port_level` (integer 0..3)

Rule:
- `port_level == 0` means no port.
- `port_level >= 1` means port exists at that tile.
