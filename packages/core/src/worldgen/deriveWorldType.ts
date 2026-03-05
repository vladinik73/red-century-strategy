/**
 * Derive world type from match_seed via weighted CDF.
 * Canon: docs/03_map/World_Types_and_Terrain_Distribution_Spec.md §1.2
 */
import { createSeededRng } from "../rng/createSeededRng.js";
import type { WorldTypeId } from "./types.js";
import { WORLD_TYPE_IDS, WORLD_TYPE_CDF } from "./types.js";

export function deriveWorldType(match_seed: number): WorldTypeId {
  const rng = createSeededRng(match_seed);
  const roll = (rng() >>> 0) % 100;
  const idx = WORLD_TYPE_CDF.findIndex((c) => roll < c);
  const i = idx >= 0 ? idx : WORLD_TYPE_IDS.length - 1;
  return WORLD_TYPE_IDS[i] ?? "BALANCED";
}
