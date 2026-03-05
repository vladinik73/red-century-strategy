/**
 * Runtime world generation pipeline. Canon: World_Generation_Spec, World_Types, Map_Generator_Architecture.
 */
import { createSeededRng } from "../rng/createSeededRng.js";
import type { WorldConfig, WorldGenResult } from "./types.js";
import type { TileState } from "../types/generated/tile.js";
import type { CityState } from "../types/generated/city.js";
import type { PlayerState } from "../types/generated/player.js";
import { getWorldConfig } from "./worldConfigs.js";

const MAP_WIDTH = 80;
const MAP_HEIGHT = 80;
const MAP_SIZE = 6400;
const MIN_LAND = 2000;
const MIN_CAPITAL_DIST = 10;
const MIN_CITY_DIST = 2;
const CHINA_EDGE_DIST = 7;
const RESOURCE_STOCK = 10;
const RESOURCE_YIELD = 2;
const NUM_CAPITALS = 8;
const NUM_CIVS = 8;

const CIV_PLAYER_IDS = [
  "p0", "p1", "p2", "p3", "p4", "p5", "p6", "p7"
];
const CHINA_INDEX = 0;

function tileIndex(x: number, y: number): number {
  return y * MAP_WIDTH + x;
}

function tileCoords(i: number): { x: number; y: number } {
  return { x: i % MAP_WIDTH, y: Math.floor(i / MAP_WIDTH) };
}

function chebyshev(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

function edgeDist(x: number, y: number): number {
  return Math.min(x, y, MAP_WIDTH - 1 - x, MAP_HEIGHT - 1 - y);
}

function neighbors4(x: number, y: number): Array<{ x: number; y: number }> {
  const out: Array<{ x: number; y: number }> = [];
  for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
    const nx = x + dx, ny = y + dy;
    if (nx >= 0 && nx < MAP_WIDTH && ny >= 0 && ny < MAP_HEIGHT)
      out.push({ x: nx, y: ny });
  }
  return out;
}

function neighbors8(x: number, y: number): Array<{ x: number; y: number }> {
  const out: Array<{ x: number; y: number }> = [];
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < MAP_WIDTH && ny >= 0 && ny < MAP_HEIGHT)
        out.push({ x: nx, y: ny });
    }
  return out;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Build a 2D value-noise function seeded by an uint32 RNG.
 * Accepts rng.uint32 (raw integer) for permutation table shuffle.
 */
function createNoise2D(rngU32: () => number): (x: number, y: number) => number {
  const perm: number[] = [];
  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = rngU32() % (i + 1);
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  const grad = (h: number, x: number, y: number) => {
    const g = (perm[h % 256] % 8) * 0.5 - 2;
    return g * (x + y);
  };
  return (x: number, y: number) => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = grad(xi + yi * 256, xf, yf);
    const b = grad(xi + 1 + yi * 256, xf - 1, yf);
    const c = grad(xi + (yi + 1) * 256, xf, yf - 1);
    const d = grad(xi + 1 + (yi + 1) * 256, xf - 1, yf - 1);
    return (1 - u) * (1 - v) * a + u * (1 - v) * b + (1 - u) * v * c + u * v * d;
  };
}

/**
 * fBm (fractional Brownian motion): multi-octave noise, normalized to [0,1].
 * lacunarity ~2.0, gain ~0.5, 5 octaves. Deterministic, fast, pure TS.
 */
function fbm2(
  x: number,
  y: number,
  noise: (x: number, y: number) => number,
  octaves: number = 5,
  lacunarity: number = 2.0,
  gain: number = 0.5
): number {
  let sum = 0;
  let amp = 1;
  let freq = 1;
  let maxVal = 0;
  for (let i = 0; i < octaves; i++) {
    const v = noise(x * freq, y * freq);
    sum += amp * v;
    maxVal += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  const n = sum / maxVal;
  return Math.max(0, Math.min(1, n));
}

function emptyTile(x: number, y: number): TileState {
  return {
    x,
    y,
    terrain_base: "WATER",
    terrain_type: "WATER",
    is_river: false,
    resource_type: null,
    resource_remaining: 0,
    resource_yield_per_turn: 2,
    visibility: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  };
}

export function generateWorld(
  attemptSeed: number,
  config: WorldConfig,
  attemptIndex: number = 0
): WorldGenResult {
  const rng = createSeededRng(attemptSeed);

  // --- Phase 1: Landmask via noise ---
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const [thMin, thMax] = config.landThreshold;
  const threshold = lerp(thMin, thMax, rng());           // float [0,1)
  const [freqMin, freqMax] = config.noiseFrequency;
  const freq = lerp(freqMin, freqMax, rng());             // float [0,1)

  const noise = createNoise2D(rng.uint32);                 // uint32 for permutation
  const elevNoise = createNoise2D(rng.uint32);
  const moistNoise = createNoise2D(rng.uint32);

  const landmask: boolean[] = new Array(MAP_SIZE);
  const normNoise = (a: number, b: number) => Math.max(0, Math.min(1, (noise(a, b) + 1) / 2));
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const n = fbm2(x * freq, y * freq, normNoise);
      const edgeDistVal = edgeDist(x, y);
      const falloff = smoothstep(0, config.edgeFalloffWidth, edgeDistVal);
      const effTh = threshold + (1 - falloff) * 0.15;
      landmask[tileIndex(x, y)] = n > effTh;
    }
  }

  // Majority-neighbors smoothing (1 iteration) on binary LAND/WATER mask.
  // >= 4 of 8 neighbors => land (less aggressive than strict majority 5)
  const smoothIterations = 1;
  for (let iter = 0; iter < smoothIterations; iter++) {
    const next: boolean[] = [...landmask];
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const i = tileIndex(x, y);
        let landNeighbors = 0;
        for (const n of neighbors8(x, y)) {
          if (landmask[tileIndex(n.x, n.y)]) landNeighbors++;
        }
        next[i] = landNeighbors >= 4;
      }
    }
    for (let j = 0; j < MAP_SIZE; j++) landmask[j] = next[j];
  }

  // --- Phase 2: Region detection (flood fill) ---
  const regionId: number[] = new Array(MAP_SIZE).fill(-1);
  let nextRegion = 0;
  const regionSizes: number[] = [];

  function floodLand(sx: number, sy: number, rid: number): number {
    let count = 0;
    const stack: Array<[number, number]> = [[sx, sy]];
    while (stack.length) {
      const [x, y] = stack.pop()!;
      const i = tileIndex(x, y);
      if (regionId[i] >= 0 || !landmask[i]) continue;
      regionId[i] = rid;
      count++;
      for (const n of neighbors4(x, y)) stack.push([n.x, n.y]);
    }
    return count;
  }

  for (let i = 0; i < MAP_SIZE; i++) {
    if (landmask[i] && regionId[i] < 0) {
      const { x, y } = tileCoords(i);
      const size = floodLand(x, y, nextRegion);
      regionSizes.push(size);
      nextRegion++;
    }
  }

  // --- Phase 3: Region selection (continents + islands) ---
  const sortedRegions = regionSizes
    .map((s, i) => ({ size: s, id: i }))
    .sort((a, b) => b.size - a.size);

  const minCont = config.minContinentSize;
  const minIsl = config.minIslandSize;
  const [contMin, contMax] = config.continentRange;
  const [islMin, islMax] = config.islandRange;
  const nCont = Math.min(
    contMax,
    Math.max(contMin, sortedRegions.filter((r) => r.size >= minCont).length)
  );
  const nIsl = Math.min(
    islMax,
    Math.max(islMin, sortedRegions.filter((r) => r.size >= minIsl && r.size < minCont).length)
  );

  const keepRegion = new Set<number>();
  let contCount = 0;
  let islCount = 0;
  for (const r of sortedRegions) {
    if (r.size >= minCont && contCount < nCont) {
      keepRegion.add(r.id);
      contCount++;
    } else if (r.size >= minIsl && r.size < minCont && islCount < nIsl) {
      keepRegion.add(r.id);
      islCount++;
    }
  }

  // Fallback: ensure at least MIN_LAND tiles
  let totalKept = 0;
  for (const rid of keepRegion) totalKept += regionSizes[rid] ?? 0;
  if (totalKept < MIN_LAND) {
    for (const r of sortedRegions) {
      if (keepRegion.has(r.id)) continue;
      keepRegion.add(r.id);
      totalKept += r.size;
      if (totalKept >= MIN_LAND) break;
    }
  }

  // Remove land tiles that aren't in kept regions (skip if fallback was used)
  for (let i = 0; i < MAP_SIZE; i++) {
    if (landmask[i] && !keepRegion.has(regionId[i])) landmask[i] = false;
  }

  let landCount = 0;
  for (let i = 0; i < MAP_SIZE; i++) if (landmask[i]) landCount++;

  // --- Phase 4: Terrain assignment ---
  const tiles: TileState[] = [];
  const elevMap: number[] = new Array(MAP_SIZE);
  const moistMap: number[] = new Array(MAP_SIZE);

  const mTh = 0.78 + config.thresholdDeltas.mountain;
  const fTh = 0.55 + config.thresholdDeltas.forest;
  const dTh = 0.25 + config.thresholdDeltas.desert;
  const ratios = config.terrainRatios;

  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const i = tileIndex(x, y);
      const t = emptyTile(x, y);
      if (landmask[i]) {                                   // FIX: removed edgeDist catch-all
        elevMap[i] = (elevNoise(x * 0.06, y * 0.06) + 1) / 2;
        moistMap[i] = (moistNoise(x * 0.06, y * 0.06) + 1) / 2;
        const e = elevMap[i];
        const m = moistMap[i];
        if (e > mTh) t.terrain_type = "MOUNTAIN";
        else if (m > fTh) t.terrain_type = "FOREST";
        else if (m < dTh) t.terrain_type = "DESERT";
        else t.terrain_type = "PLAIN";
        t.terrain_base = "LAND";
        tiles.push(t);
      } else {
        t.terrain_base = "WATER";
        t.terrain_type = "WATER";
        elevMap[i] = 0;
        moistMap[i] = 0;
        tiles.push(t);
      }
    }
  }

  // --- Phase 5: Rivers ---
  const [riverMin, riverMax] = config.riverCount;
  const nRivers = riverMin + Math.floor(rng() * (riverMax - riverMin + 1)); // float → int
  const [lenMin, lenMax] = config.riverLength;
  const maxLen = lenMax;

  const landIndices = tiles
    .map((_, i) => i)
    .filter((i) => tiles[i].terrain_base === "LAND");
  const highLand = landIndices
    .filter((i) => {
      const { x, y } = tileCoords(i);
      const hasWater = neighbors8(x, y).some(
        (n) => tiles[tileIndex(n.x, n.y)].terrain_base === "WATER"
      );
      return hasWater && elevMap[i] > 0.6;
    })
    .sort((a, b) => elevMap[b] - elevMap[a]);

  for (let r = 0; r < nRivers && r < highLand.length; r++) {
    let curr = highLand[r];
    if (tiles[curr].terrain_base === "WATER") continue;
    let steps = 0;
    const path: number[] = [];
    while (steps < maxLen) {
      const { x, y } = tileCoords(curr);
      if (tiles[curr].terrain_base === "WATER") break;
      path.push(curr);
      let best = -1;
      let bestElev = elevMap[curr];
      for (const n of neighbors8(x, y)) {
        const ni = tileIndex(n.x, n.y);
        if (tiles[ni].terrain_base === "WATER") {
          for (const pi of path) {
            tiles[pi].terrain_base = "WATER";
            tiles[pi].terrain_type = "WATER";
            (tiles[pi] as TileState).is_river = true;
          }
          steps = maxLen;
          break;
        }
        if (elevMap[ni] < bestElev) {
          bestElev = elevMap[ni];
          best = ni;
        }
      }
      if (best < 0) break;
      curr = best;
      steps++;
    }
  }

  // --- Phase 6: City placement ---
  const candidateTiles = tiles
    .map((_, i) => i)
    .filter(
      (i) =>
        tiles[i].terrain_base === "LAND" &&
        tiles[i].terrain_type !== "MOUNTAIN"
    );

  /** Fisher-Yates shuffle using uint32 RNG for uniform index selection. */
  const shuffle = <T>(arr: T[], rU32: () => number): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = rU32() % (i + 1);                          // uint32 modulo
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const shuffled = shuffle(candidateTiles, rng.uint32);
  const capitals: Array<{ x: number; y: number; playerId: string }> = [];

  for (let c = 0; c < NUM_CAPITALS; c++) {
    const playerId = CIV_PLAYER_IDS[c];
    const isChina = c === CHINA_INDEX;
    let placed = false;
    for (const i of shuffled) {
      const { x, y } = tileCoords(i);
      if (isChina && edgeDist(x, y) < CHINA_EDGE_DIST) continue;
      const ok = capitals.every(
        (cap) => chebyshev({ x, y }, cap) >= MIN_CAPITAL_DIST
      );
      if (ok) {
        capitals.push({ x, y, playerId });
        placed = true;
        break;
      }
    }
    if (!placed) {
      // Relaxed fallback: try with reduced distance (MIN_CAPITAL_DIST - 2, min 6)
      const relaxedDist = Math.max(6, MIN_CAPITAL_DIST - 2);
      for (const i of shuffled) {
        const { x, y } = tileCoords(i);
        if (isChina && edgeDist(x, y) < CHINA_EDGE_DIST) continue;
        const ok = capitals.every(
          (cap) => chebyshev({ x, y }, cap) >= relaxedDist
        );
        if (ok) {
          capitals.push({ x, y, playerId });
          break;
        }
      }
    }
  }

  const [cityMin, cityMax] = config.cityRange;
  const totalCities = Math.min(
    cityMax,
    Math.max(cityMin, NUM_CAPITALS + Math.floor(rng() * (cityMax - cityMin + 1))) // float
  );
  let neutralCount = totalCities - NUM_CAPITALS;

  const cities: CityState[] = [];
  const allCityPositions: Array<{ x: number; y: number }> = [];

  for (let c = 0; c < capitals.length; c++) {
    const cap = capitals[c];
    const cityId = `city_cap_${c}`;
    const indices: number[] = [];
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const tx = cap.x + dx;
        const ty = cap.y + dy;
        if (tx >= 0 && tx < MAP_WIDTH && ty >= 0 && ty < MAP_HEIGHT)
          indices.push(tileIndex(tx, ty));
      }
    cities.push({
      city_id: cityId,
      x: cap.x,
      y: cap.y,
      owner_player_id: cap.playerId,
      is_capital: true,
      level: 1,
      defense_level: 0,
      integration_turns_left: 0,
      territory_tile_indices: indices,
    });
    tiles[tileIndex(cap.x, cap.y)].city_id = cityId;
    tiles[tileIndex(cap.x, cap.y)].territory_city_id = cityId;
    tiles[tileIndex(cap.x, cap.y)].territory_owner_player_id = cap.playerId;
    for (const idx of indices) {
      tiles[idx].territory_city_id = cityId;
      tiles[idx].territory_owner_player_id = cap.playerId;
    }
    allCityPositions.push({ x: cap.x, y: cap.y });
  }

  const neutralCandidates = candidateTiles.filter((i) => {
    const { x, y } = tileCoords(i);
    if (tiles[i].city_id) return false;
    return allCityPositions.every(
      (p) => chebyshev({ x, y }, p) >= MIN_CITY_DIST
    );
  });

  const shuffledNeutral = shuffle(neutralCandidates, rng.uint32);
  for (let n = 0; n < neutralCount && n < shuffledNeutral.length; n++) {
    const i = shuffledNeutral[n];
    const { x, y } = tileCoords(i);
    const cityId = `city_neutral_${n}`;
    const indices: number[] = [];
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const tx = x + dx;
        const ty = y + dy;
        if (tx >= 0 && tx < MAP_WIDTH && ty >= 0 && ty < MAP_HEIGHT)
          indices.push(tileIndex(tx, ty));
      }
    cities.push({
      city_id: cityId,
      x,
      y,
      owner_player_id: null,
      is_capital: false,
      level: 1,
      defense_level: 0,
      integration_turns_left: 0,
      territory_tile_indices: indices,
    });
    tiles[i].city_id = cityId;
    tiles[i].territory_city_id = cityId;
    tiles[i].territory_owner_player_id = null;
    for (const idx of indices) {
      tiles[idx].territory_city_id = cityId;
      tiles[idx].territory_owner_player_id = null;
    }
    allCityPositions.push({ x, y });
  }

  // --- Phase 7: Resources ---
  const eligibleResourceTiles = tiles
    .map((_, i) => i)
    .filter(
      (i) =>
        tiles[i].terrain_base === "LAND" &&
        tiles[i].terrain_type !== "MOUNTAIN" &&
        !tiles[i].city_id
    );

  const densityNorm = config.resourceDensityNormal;
  const densityDesert = config.resourceDensityDesert;
  const moneyShare = config.moneyScienceRatio;

  for (const i of eligibleResourceTiles) {
    const t = tiles[i];
    const density =
      t.terrain_type === "DESERT" ? densityDesert : densityNorm;
    if (rng() < density) {                                  // float comparison
      t.resource_type = rng() < moneyShare ? "MONEY" : "SCIENCE"; // float comparison
      t.resource_remaining = RESOURCE_STOCK;
      t.resource_yield_per_turn = RESOURCE_YIELD;
    }
  }

  // Guarantee each capital has >= 1 MONEY + >= 1 SCIENCE in territory
  for (const cap of capitals) {
    const ci = tileIndex(cap.x, cap.y);
    const city = cities.find((c) => c.x === cap.x && c.y === cap.y)!;
    const territory = city.territory_tile_indices;
    let moneyCount = 0;
    let scienceCount = 0;
    for (const idx of territory) {
      if (idx === ci) continue;
      const rt = tiles[idx].resource_type;
      if (rt === "MONEY") moneyCount++;
      if (rt === "SCIENCE") scienceCount++;
    }
    const eligibleInTerritory = territory.filter(
      (idx) =>
        idx !== ci &&
        tiles[idx].terrain_base === "LAND" &&
        tiles[idx].terrain_type !== "MOUNTAIN" &&
        !tiles[idx].resource_type
    );
    if (moneyCount === 0 && eligibleInTerritory.length) {
      const pick = eligibleInTerritory[rng.uint32() % eligibleInTerritory.length]; // uint32
      tiles[pick].resource_type = "MONEY";
      tiles[pick].resource_remaining = RESOURCE_STOCK;
      tiles[pick].resource_yield_per_turn = RESOURCE_YIELD;
      eligibleInTerritory.splice(eligibleInTerritory.indexOf(pick), 1);
    }
    if (scienceCount === 0 && eligibleInTerritory.length) {
      const pick = eligibleInTerritory[rng.uint32() % eligibleInTerritory.length]; // uint32
      tiles[pick].resource_type = "SCIENCE";
      tiles[pick].resource_remaining = RESOURCE_STOCK;
      tiles[pick].resource_yield_per_turn = RESOURCE_YIELD;
    }
  }

  // --- Phase 8: Players + Units ---
  const players: PlayerState[] = CIV_PLAYER_IDS.map((player_id, i) => ({
    player_id,
    faction_id: `faction_${i}`,
    money: 100,
    science: 0,
    stability: 70,
    ap_current: 0,
    ap_income_last_turn: 0,
    tech_unlocked: [],
    victory_timers: {
      economic_hold_turns_left: 5,
      tech_victory_turns_left: 10,
    },
    effects: { cyber_global_penalty_turns_left: 0 },
  }));

  const units: WorldGenResult["units"] = capitals.map((cap, i) => ({
    unit_id: `unit_scout_${i}`,
    unit_type_id: "StarterScout",
    owner_player_id: cap.playerId,
    x: cap.x,
    y: cap.y,
    hp: 20,
    kills_in_chain: 0,
    kill_count_total: 0,
    veterancy_level: 0,
    has_acted_this_turn: false,
  }));

  // --- Phase 9: Visibility ---
  for (let civ = 0; civ < NUM_CIVS; civ++) {
    const cap = capitals[civ];
    if (!cap) continue;
    const ci = tileIndex(cap.x, cap.y);
    const city = cities.find((c) => c.owner_player_id === cap.playerId && c.is_capital)!;
    for (const idx of city.territory_tile_indices) {
      tiles[idx].visibility = [...(tiles[idx].visibility || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])] as TileState["visibility"];
      (tiles[idx].visibility as number[])[civ] = 1;
    }
    for (const n of neighbors8(cap.x, cap.y)) {
      const ni = tileIndex(n.x, n.y);
      if (ni >= 0 && ni < MAP_SIZE) {
        tiles[ni].visibility = [...(tiles[ni].visibility || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])] as TileState["visibility"];
        (tiles[ni].visibility as number[])[civ] = 1;
      }
    }
  }

  return {
    tiles_flat: tiles,
    cities,
    players,
    units,
    meta: {
      continentCount: contCount,
      islandCount: islCount,
      landCount,
      attemptIndex,
    },
  };
}
