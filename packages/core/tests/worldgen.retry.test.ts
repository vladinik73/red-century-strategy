import { describe, it, expect } from "vitest";
import { createMatch } from "../src/index.js";

describe("worldgen retry", () => {
  it("createMatch succeeds (retry mechanism works when first attempts may fail)", () => {
    const match = createMatch({ seed: 999 });
    expect(match.cities.length).toBeGreaterThanOrEqual(50);
    expect(match.map.tiles_flat.length).toBe(6400);
  });

  it("createMatch succeeds across a range of seeds", () => {
    for (const seed of [1, 42, 100, 500, 9999, 123456]) {
      const match = createMatch({ seed });
      expect(match.map.tiles_flat.length).toBe(6400);
      expect(match.cities.filter((c) => c.is_capital).length).toBe(8);
    }
  });
});
