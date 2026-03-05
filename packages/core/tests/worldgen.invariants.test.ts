import { describe, it, expect } from "vitest";
import { createMatch } from "../src/index.js";
import { validateWorld } from "../src/worldgen/validateWorld.js";

describe("worldgen invariants", () => {
  it("createMatch({seed:456}) produces valid world: 8 capitals, distance >= 10, tiles=6400", () => {
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

    // validateWorld without options (backward-compatible)
    const result = {
      tiles_flat: match.map.tiles_flat,
      cities: match.cities,
      players: match.players,
      units: match.units,
      meta: { continentCount: 4, islandCount: 5, landCount: 3000, attemptIndex: 0 },
    };
    const validation = validateWorld(result);
    expect(validation.ok).toBe(true);
  });

  it("each capital has >= 1 MONEY and >= 1 SCIENCE in territory", () => {
    const match = createMatch({ seed: 789 });
    const capitals = match.cities.filter((c) => c.is_capital);
    for (const cap of capitals) {
      const ci = cap.y * 80 + cap.x;
      let money = 0;
      let science = 0;
      for (const idx of cap.territory_tile_indices) {
        if (idx === ci) continue;
        const t = match.map.tiles_flat[idx];
        if (t?.resource_type === "MONEY") money++;
        if (t?.resource_type === "SCIENCE") science++;
      }
      expect(money).toBeGreaterThanOrEqual(1);
      expect(science).toBeGreaterThanOrEqual(1);
    }
  });

  it("China capital (p0) is >= 7 tiles from edge", () => {
    const match = createMatch({ seed: 321 });
    const china = match.cities.find((c) => c.is_capital && c.owner_player_id === "p0")!;
    const ed = Math.min(china.x, china.y, 79 - china.x, 79 - china.y);
    expect(ed).toBeGreaterThanOrEqual(7);
  });

  it("has >= 50 total cities", () => {
    const match = createMatch({ seed: 654 });
    expect(match.cities.length).toBeGreaterThanOrEqual(50);
  });
});
