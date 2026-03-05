/**
 * Deterministic attempt seed via FNV-1a 32-bit.
 * Canon: docs/03_map/World_Types_and_Terrain_Distribution_Spec.md §3.5.1
 */
const FNV_PRIME = 0x01000193;
const FNV_OFFSET = 0x811c9dc5;

function fnv1aByte(h: number, byte: number): number {
  return Math.imul((h ^ (byte & 0xff)) >>> 0, FNV_PRIME) >>> 0;
}

export function attemptSeed(
  match_seed: number,
  world_type_id: number,
  attempt_index: number
): number {
  let h = FNV_OFFSET;
  const s = match_seed >>> 0;
  h = fnv1aByte(h, s & 0xff);
  h = fnv1aByte(h, (s >> 8) & 0xff);
  h = fnv1aByte(h, (s >> 16) & 0xff);
  h = fnv1aByte(h, (s >> 24) & 0xff);
  h = fnv1aByte(h, world_type_id & 0xff);
  h = fnv1aByte(h, attempt_index & 0xff);
  return h >>> 0;
}
