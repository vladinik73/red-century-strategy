import { describe, it, expect } from "vitest";
import { createMatch } from "../src/index.js";
import { validateWorld } from "../src/worldgen/validateWorld.js";
import type { WorldGenResult } from "../src/worldgen/types.js";
import type { TileState } from "../src/types/generated/tile.js";

/**
 * Helper: build a minimal WorldGenResult for validateWorld unit-tests.
 */
function makeFakeResult(overrides: {
  landCount?: number;
  plainRatio?: number;
  cityCount?: number;
  capitalCount?: number;
  continentCount?: number;
  islandCount?: number;
}): WorldGenResult {
  const {
    landCount = 3000,
    plainRatio = 0.45,
    cityCount = 60,
    capitalCount = 8,
    continentCount = 4,
    islandCount = 5,
  } = overrides;

  const tiles: TileState[] = [];
  const waterCount = 6400 - landCount;
  let plainLeft = Math.floor(landCount * plainRatio);
  let otherLeft = landCount - plainLeft;

  for (let y = 0; y < 80; y++) {
    for (let x = 0; x < 80; x++) {
      const idx = y * 80 + x;
      if (idx < waterCount) {
        tiles.push({
          x, y,
          terrain_base: "WATER",
          terrain_type: "WATER",
          visibility: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        });
      } else if (plainLeft > 0) {
        plainLeft--;
        tiles.push({
          x, y,
          terrain_base: "LAND",
          terrain_type: "PLAIN",
          resource_type: null,
          visibility: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        });
      } else {
        otherLeft--;
        tiles.push({
          x, y,
          terrain_base: "LAND",
          terrain_type: "FOREST",
          resource_type: null,
          visibility: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        });
      }
    }
  }

  // Place capitals on LAND tiles (after waterCount offset)
  const cities = [];
  const capitalPositions: Array<{ x: number; y: number }> = [];
  for (let c = 0; c < capitalCount; c++) {
    const baseIdx = waterCount + c * 12; // spread them out
    const t = tiles[baseIdx];
    if (!t) continue;
    const cx = t.x;
    const cy = t.y;
    capitalPositions.push({ x: cx, y: cy });

    const territory: number[] = [];
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const nx = cx + dx, ny = cy + dy;
        if (nx >= 0 && nx < 80 && ny >= 0 && ny < 80)
          territory.push(ny * 80 + nx);
      }

    // Ensure MONEY + SCIENCE in territory
    for (const ti of territory) {
      if (ti !== baseIdx && tiles[ti] && tiles[ti].terrain_base === "LAND") {
        if (!tiles[ti].resource_type) {
          tiles[ti].resource_type = "MONEY";
          break;
        }
      }
    }
    for (const ti of territory) {
      if (ti !== baseIdx && tiles[ti] && tiles[ti].terrain_base === "LAND") {
        if (!tiles[ti].resource_type) {
          tiles[ti].resource_type = "SCIENCE";
          break;
        }
      }
    }

    cities.push({
      city_id: `city_cap_${c}`,
      x: cx,
      y: cy,
      owner_player_id: `p${c}`,
      is_capital: true,
      level: 1,
      defense_level: 0,
      integration_turns_left: 0,
      territory_tile_indices: territory,
    });
    tiles[baseIdx].city_id = `city_cap_${c}`;
  }

  // Add neutral cities to meet MIN_CITIES
  for (let n = 0; n < cityCount - capitalCount; n++) {
    const baseIdx = waterCount + capitalCount * 12 + n * 4;
    const t = tiles[baseIdx];
    if (!t) break;
    cities.push({
      city_id: `city_neutral_${n}`,
      x: t.x,
      y: t.y,
      owner_player_id: null,
      is_capital: false,
      level: 1,
      defense_level: 0,
      integration_turns_left: 0,
      territory_tile_indices: [baseIdx],
    });
  }

  return {
    tiles_flat: tiles,
    cities,
    players: Array.from({ length: 8 }, (_, i) => ({
      player_id: `p${i}`,
      faction_id: `faction_${i}`,
      money: 100,
      science: 0,
      stability: 70,
      ap_current: 0,
      ap_income_last_turn: 0,
      tech_unlocked: [],
      victory_timers: { economic_hold_turns_left: 5, tech_victory_turns_left: 10 },
      effects: { cyber_global_penalty_turns_left: 0 },
    })),
    units: [],
    meta: { continentCount, islandCount, landCount, attemptIndex: 0 },
  };
}

describe("WILD PLAIN constraint", () => {
  it("validateWorld rejects WILD with PLAIN < 25% of LAND", () => {
    const result = makeFakeResult({ plainRatio: 0.20 }); // 20% PLAIN — violates
    const validation = validateWorld(result, { worldType: "WILD" });
    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.reasons.some((r) => r.includes("WILD_PLAIN_MIN"))).toBe(true);
    }
  });

  it("validateWorld accepts WILD with PLAIN >= 25% of LAND", () => {
    const result = makeFakeResult({ plainRatio: 0.30 }); // 30% PLAIN — ok
    const validation = validateWorld(result, { worldType: "WILD" });
    // May have other issues (capital distance etc), but should NOT have WILD_PLAIN_MIN
    if (!validation.ok) {
      expect(validation.reasons.some((r) => r.includes("WILD_PLAIN_MIN"))).toBe(false);
    }
  });

  it("WILD PLAIN check is skipped for non-WILD types", () => {
    const result = makeFakeResult({ plainRatio: 0.10 }); // 10% PLAIN — would fail WILD
    const validation = validateWorld(result, { worldType: "BALANCED" });
    // Should NOT have WILD_PLAIN_MIN reason
    if (!validation.ok) {
      expect(validation.reasons.some((r) => r.includes("WILD_PLAIN_MIN"))).toBe(false);
    }
  });

  it("WILD PLAIN check is skipped when no options provided", () => {
    const result = makeFakeResult({ plainRatio: 0.10 });
    const validation = validateWorld(result);
    if (!validation.ok) {
      expect(validation.reasons.some((r) => r.includes("WILD_PLAIN_MIN"))).toBe(false);
    }
  });

  it("createMatch with WILD override produces PLAIN >= 25%", () => {
    // Test 3 seeds with forced WILD
    for (const seed of [111, 222, 333]) {
      const match = createMatch({ seed, worldTypeOverride: "WILD" });
      const land = match.map.tiles_flat.filter((t) => t.terrain_base === "LAND");
      const plain = land.filter((t) => t.terrain_type === "PLAIN");
      const ratio = plain.length / land.length;
      expect(ratio).toBeGreaterThanOrEqual(0.25);
    }
  });
});

describe("continent/island count validation (soft warnings)", () => {
  it("validateWorld warns on out-of-range continent count", () => {
    const result = makeFakeResult({ continentCount: 1 });
    const config = {
      worldType: "BALANCED" as const,
      landThreshold: [0.25, 0.45] as [number, number],
      noiseFrequency: [0.04, 0.08] as [number, number],
      edgeFalloffWidth: 8,
      continentRange: [4, 6] as [number, number],
      minContinentSize: 200,
      islandRange: [5, 10] as [number, number],
      minIslandSize: 8,
      minLakeSize: 6,
      terrainRatios: { plain: 0.45, forest: 0.25, mountain: 0.15, desert: 0.15 },
      thresholdDeltas: { mountain: 0, forest: 0, desert: 0 },
      riverCount: [3, 8] as [number, number],
      riverLength: [5, 20] as [number, number],
      resourceDensityNormal: 0.25,
      resourceDensityDesert: 0.12,
      moneyScienceRatio: 0.5,
      cityRange: [50, 100] as [number, number],
    };
    const validation = validateWorld(result, { config });
    // Continent/island counts are SOFT warnings (don't cause retry)
    expect(validation.warnings.some((w) => w.includes("continents="))).toBe(true);
  });

  it("validateWorld warns on out-of-range island count", () => {
    const result = makeFakeResult({ islandCount: 0 });
    const config = {
      worldType: "BALANCED" as const,
      landThreshold: [0.25, 0.45] as [number, number],
      noiseFrequency: [0.04, 0.08] as [number, number],
      edgeFalloffWidth: 8,
      continentRange: [4, 6] as [number, number],
      minContinentSize: 200,
      islandRange: [5, 10] as [number, number],
      minIslandSize: 8,
      minLakeSize: 6,
      terrainRatios: { plain: 0.45, forest: 0.25, mountain: 0.15, desert: 0.15 },
      thresholdDeltas: { mountain: 0, forest: 0, desert: 0 },
      riverCount: [3, 8] as [number, number],
      riverLength: [5, 20] as [number, number],
      resourceDensityNormal: 0.25,
      resourceDensityDesert: 0.12,
      moneyScienceRatio: 0.5,
      cityRange: [50, 100] as [number, number],
    };
    const validation = validateWorld(result, { config });
    // Continent/island counts are SOFT warnings (don't cause retry)
    expect(validation.warnings.some((w) => w.includes("islands="))).toBe(true);
  });
});
