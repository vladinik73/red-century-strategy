import { describe, it, expect } from "vitest";
import { createMatch } from "../src/index.js";
import { generateWorld } from "../src/worldgen/generateWorld.js";
import { validateWorld } from "../src/worldgen/validateWorld.js";
import { getWorldConfig } from "../src/worldgen/worldConfigs.js";
import { attemptSeed } from "../src/worldgen/attemptSeed.js";

describe("worldgen pangaea optional islands", () => {
  it("PANGAEA: 20 seeds — no fail, continents==1, log island stats", () => {
    const config = getWorldConfig("PANGAEA");
    const worldTypeId = 3;
    const islandCounts: number[] = [];
    let zeroCount = 0;
    let nonZeroCount = 0;

    for (let s = 0; s < 20; s++) {
      const seed = 8000 + s * 333;
      let ok = false;
      for (let attempt = 0; attempt < 5 && !ok; attempt++) {
        const aseed = attemptSeed(seed, worldTypeId, attempt);
        const result = generateWorld(aseed, config, attempt);
        const validation = validateWorld(result, { worldType: "PANGAEA", config });
        if (validation.ok) {
          expect(result.meta.continentCount).toBe(1);
          islandCounts.push(result.meta.islandCount);
          if (result.meta.islandCount === 0) zeroCount++;
          else nonZeroCount++;
          ok = true;
        }
      }
      expect(ok).toBe(true);
    }

    expect(islandCounts.length).toBe(20);
    // Info: islands optional (soft target). zeroCount, nonZeroCount logged above if needed
  });

  it("PANGAEA: createMatch succeeds for 20 seeds (islands optional)", () => {
    for (let s = 0; s < 20; s++) {
      const seed = 9000 + s * 444;
      const match = createMatch({ seed, worldTypeOverride: "PANGAEA" });
      expect(match.map.tiles_flat.length).toBe(6400);
      expect(match.cities.filter((c) => c.is_capital).length).toBe(8);
    }
  });
});
