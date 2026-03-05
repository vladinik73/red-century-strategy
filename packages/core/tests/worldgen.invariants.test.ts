import { describe, it, expect } from "vitest";
import { createMatch } from "../src/index.js";
import { validateWorld } from "../src/worldgen/validateWorld.js";

describe("worldgen invariants", () => {
  it("createMatch({seed:456}) produces valid world: 7 capitals, distance >= 10, tiles=6400", () => {
    const match = createMatch({ seed: 456 });
    const capitals = match.cities.filter((c) => c.is_capital);
    expect(capitals.length).toBe(8);
    expect(match.map.tiles_flat.length).toBe(6400);

    for (let i = 0; i < capitals.length; i++) {
      for (let j = i + 1; j < capitals.length; j++) {
        const dx = Math.abs(capitals[i].x - capitals[j].x);
        const dy = Math.abs(capitals[i].y - capitals[j].y);
        expect(Math.max(dx, dy)).toBeGreaterThanOrEqual(10);
      }
    }

    const result = {
      tiles_flat: match.map.tiles_flat,
      cities: match.cities,
      players: match.players,
      units: match.units,
      meta: { continentCount: 0, islandCount: 0, landCount: 0, attemptIndex: 0 },
    };
    const validation = validateWorld(result);
    expect(validation.ok).toBe(true);
  });
});
