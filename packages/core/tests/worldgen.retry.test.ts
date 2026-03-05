import { describe, it, expect } from "vitest";
import { createMatch } from "../src/index.js";

describe("worldgen retry", () => {
  it("createMatch succeeds (retry mechanism works when first attempts may fail)", () => {
    const match = createMatch({ seed: 999 });
    expect(match.cities.length).toBeGreaterThanOrEqual(50);
    expect(match.map.tiles_flat.length).toBe(6400);
  });
});
