import { describe, it, expect } from "vitest";
import { createMatch } from "../src/index.js";
import { generateWorld } from "../src/worldgen/generateWorld.js";
import { validateWorld } from "../src/worldgen/validateWorld.js";
import { getWorldConfig } from "../src/worldgen/worldConfigs.js";
import { attemptSeed } from "../src/worldgen/attemptSeed.js";

describe("worldgen pangaea shape", () => {
  it("PANGAEA: createMatch succeeds for 10 seeds (continents=1 HARD)", () => {
    for (let s = 0; s < 10; s++) {
      const seed = 5000 + s * 1111;
      const match = createMatch({ seed, worldTypeOverride: "PANGAEA" });
      expect(match.map.tiles_flat.length).toBe(6400);
      expect(match.cities.filter((c) => c.is_capital).length).toBe(8);
    }
  });

  it("PANGAEA: generateWorld produces continents=1 for some attempt (islands optional)", () => {
    const config = getWorldConfig("PANGAEA");
    const worldTypeId = 3;
    let found = false;
    for (let seed = 7000; seed < 7500 && !found; seed += 37) {
      for (let attempt = 0; attempt < 5 && !found; attempt++) {
        const aseed = attemptSeed(seed, worldTypeId, attempt);
        const result = generateWorld(aseed, config, attempt);
        const validation = validateWorld(result, { worldType: "PANGAEA", config });
        if (validation.ok) {
          expect(result.meta.continentCount).toBe(1);
          found = true;
          break;
        }
      }
    }
    expect(found).toBe(true);
  });
});
