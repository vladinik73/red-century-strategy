/**
 * Validate world generation invariants.
 * Canon: World_Types §11, Map_Generator_Architecture §6, World_Generation_Spec §3.9
 */
import type { WorldConfig, WorldGenResult } from "./types.js";
import type { WorldTypeId } from "./types.js";
import type { TileState } from "../types/generated/tile.js";

const MAP_SIZE = 6400;
const MIN_LAND = 2000;
const MIN_CAPITAL_DIST = 10;
const MIN_CITIES = 50;
const CHINA_EDGE_DIST = 7;

function tileCoords(i: number): { x: number; y: number } {
  return { x: i % 80, y: Math.floor(i / 80) };
}

function chebyshev(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

function edgeDist(x: number, y: number): number {
  return Math.min(x, y, 79 - x, 79 - y);
}

export interface ValidateWorldOptions {
  /** Pass worldType to enable WILD PLAIN constraint check. */
  worldType?: WorldTypeId;
  /** Pass config to enable continent/island range checks. */
  config?: WorldConfig;
}

export type ValidateWorldResult =
  | { ok: true; warnings: string[] }
  | { ok: false; reasons: string[]; warnings: string[] };

export function validateWorld(
  result: WorldGenResult,
  options?: ValidateWorldOptions
): ValidateWorldResult {
  const reasons: string[] = [];
  const warnings: string[] = [];

  // === HARD CONSTRAINTS (cause retry) ===

  // --- Structural invariants ---
  if (result.tiles_flat.length !== MAP_SIZE) {
    reasons.push(`tiles_flat.length=${result.tiles_flat.length}, expected ${MAP_SIZE}`);
  }

  const landTiles = result.tiles_flat.filter((t) => t.terrain_base === "LAND");
  const landCount = landTiles.length;
  if (landCount < MIN_LAND) {
    reasons.push(`LAND tiles=${landCount}, expected >= ${MIN_LAND}`);
  }

  // --- Capital invariants ---
  const capitals = result.cities.filter((c) => c.is_capital);
  if (capitals.length !== 8) {
    reasons.push(`capitals=${capitals.length}, expected 8`);
  }

  for (let i = 0; i < capitals.length; i++) {
    for (let j = i + 1; j < capitals.length; j++) {
      const a = { x: capitals[i].x, y: capitals[i].y };
      const b = { x: capitals[j].x, y: capitals[j].y };
      if (chebyshev(a, b) < MIN_CAPITAL_DIST) {
        reasons.push(`capital distance ${chebyshev(a, b)} < ${MIN_CAPITAL_DIST}`);
      }
    }
  }

  const chinaIndex = result.cities.findIndex(
    (c) => c.is_capital && c.owner_player_id === "p0"
  );
  if (chinaIndex >= 0) {
    const c = capitals.find((cap) => cap.owner_player_id === "p0");
    if (c && edgeDist(c.x, c.y) < CHINA_EDGE_DIST) {
      reasons.push(`China capital edge distance ${edgeDist(c.x, c.y)} < ${CHINA_EDGE_DIST}`);
    }
  }

  // --- City count ---
  if (result.cities.length < MIN_CITIES) {
    reasons.push(`cities=${result.cities.length}, expected >= ${MIN_CITIES}`);
  }

  // --- Resource guarantees per capital ---
  for (const cap of capitals) {
    const ci = cap.y * 80 + cap.x;
    const territory = cap.territory_tile_indices;
    let moneyCount = 0;
    let scienceCount = 0;
    for (const idx of territory) {
      if (idx === ci) continue;
      const t = result.tiles_flat[idx];
      if (t?.resource_type === "MONEY") moneyCount++;
      if (t?.resource_type === "SCIENCE") scienceCount++;
    }
    if (moneyCount < 1) reasons.push(`capital at (${cap.x},${cap.y}) has < 1 MONEY in territory`);
    if (scienceCount < 1) reasons.push(`capital at (${cap.x},${cap.y}) has < 1 SCIENCE in territory`);
  }

  // --- WILD constraint: PLAIN >= 25% of LAND tiles (Canon: World_Types §3.5) ---
  if (options?.worldType === "WILD" && landCount > 0) {
    const plainCount = landTiles.filter((t) => t.terrain_type === "PLAIN").length;
    const plainRatio = plainCount / landCount;
    if (plainRatio < 0.25) {
      reasons.push(
        `WILD_PLAIN_MIN: PLAIN=${plainCount}/${landCount} (${(plainRatio * 100).toFixed(1)}%) < 25%`
      );
    }
  }

  // === Continent/island: PANGAEA continents=1 HARD; others + PANGAEA islands = soft ===
  if (options?.config) {
    const mc = result.meta.continentCount;
    const mi = result.meta.islandCount;
    const wt = options?.worldType;
    if (wt === "PANGAEA") {
      if (mc !== 1) reasons.push(`PANGAEA continents=${mc}, expected 1`);
      if (mi < 5 || mi > 10) warnings.push(`PANGAEA islands=${mi}, target [5..10]`);
    } else if (wt && wt !== "WILD") {
      const [contMin, contMax] = options.config.continentRange;
      const [islMin, islMax] = options.config.islandRange;
      if (mc < contMin || mc > contMax) warnings.push(`continents=${mc}, target [${contMin}..${contMax}]`);
      if (mi < islMin || mi > islMax) warnings.push(`islands=${mi}, target [${islMin}..${islMax}]`);
    } else {
      const [contMin, contMax] = options.config.continentRange;
      const [islMin, islMax] = options.config.islandRange;
      if (mc < contMin || mc > contMax) warnings.push(`continents=${mc}, target [${contMin}..${contMax}]`);
      if (mi < islMin || mi > islMax) warnings.push(`islands=${mi}, target [${islMin}..${islMax}]`);
    }
  }

  if (reasons.length) return { ok: false, reasons, warnings };
  return { ok: true, warnings };
}
