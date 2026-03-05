import { describe, it, expect } from "vitest";
import { createMatch } from "../src/index.js";
import { deriveWorldType } from "../src/worldgen/deriveWorldType.js";
import type { WorldTypeId } from "../src/worldgen/types.js";

describe("worldgen world type variation", () => {
  it("configs are alive: different world types produce different land/water ratios", () => {
    // Force two distinct world types and compare
    const continental = createMatch({ seed: 100, worldTypeOverride: "CONTINENTAL" });
    const archipelago = createMatch({ seed: 100, worldTypeOverride: "ARCHIPELAGO" });

    const waterCont = continental.map.tiles_flat.filter(
      (t) => t.terrain_base === "WATER"
    ).length;
    const waterArch = archipelago.map.tiles_flat.filter(
      (t) => t.terrain_base === "WATER"
    ).length;

    // ARCHIPELAGO should have MORE water than CONTINENTAL (higher landThreshold => less land)
    expect(waterArch).toBeGreaterThan(waterCont);
  });

  it("PANGAEA and ARCHIPELAGO produce different land counts for same seed", () => {
    const pangaea = createMatch({ seed: 200, worldTypeOverride: "PANGAEA" });
    const archipelago = createMatch({ seed: 200, worldTypeOverride: "ARCHIPELAGO" });

    const landPang = pangaea.map.tiles_flat.filter(
      (t) => t.terrain_base === "LAND"
    ).length;
    const landArch = archipelago.map.tiles_flat.filter(
      (t) => t.terrain_base === "LAND"
    ).length;

    // Different configs → different land counts
    expect(landPang).not.toBe(landArch);
  });

  it("deriveWorldType distributes across at least 2 types for 20 random seeds", () => {
    const types = new Set<WorldTypeId>();
    for (let seed = 1; seed <= 20; seed++) {
      types.add(deriveWorldType(seed * 1337));
    }
    expect(types.size).toBeGreaterThanOrEqual(2);
  });

  it("worldTypeOverride actually forces the world type (smoke)", () => {
    const wild = createMatch({ seed: 500, worldTypeOverride: "WILD" });
    // WILD has wide land threshold [0.35, 0.65] — just verify it succeeds
    expect(wild.map.tiles_flat.length).toBe(6400);
    expect(wild.cities.filter((c) => c.is_capital).length).toBe(8);
  });

  it("resources are placed (density > 0) across multiple seeds", () => {
    let totalResources = 0;
    for (const seed of [10, 20, 30, 40, 50]) {
      const match = createMatch({ seed });
      const resources = match.map.tiles_flat.filter(
        (t) => t.resource_type === "MONEY" || t.resource_type === "SCIENCE"
      );
      totalResources += resources.length;
    }
    // With ~25% density on ~3000 eligible tiles per map, expect >>16 per map (capital guarantees alone = 16)
    expect(totalResources).toBeGreaterThan(100);
  });

  it("BALANCED: createMatch succeeds for 20 seeds (retry handles bad attempts)", () => {
    for (let s = 0; s < 20; s++) {
      const seed = 1000 + s * 777;
      const match = createMatch({ seed, worldTypeOverride: "BALANCED" });
      expect(match.map.tiles_flat.length).toBe(6400);
      expect(match.cities.filter((c) => c.is_capital).length).toBe(8);
    }
  });

});
