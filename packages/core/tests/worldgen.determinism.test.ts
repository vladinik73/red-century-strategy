import { describe, it, expect } from "vitest";
import { createMatch, hashState } from "../src/index.js";

describe("worldgen determinism", () => {
  it("createMatch({seed:123}) twice produces same hashState", () => {
    const m1 = createMatch({ seed: 123 });
    const m2 = createMatch({ seed: 123 });
    expect(hashState(m1)).toBe(hashState(m2));
  });

  it("different seeds produce different worlds", () => {
    const m1 = createMatch({ seed: 100 });
    const m2 = createMatch({ seed: 200 });
    expect(hashState(m1)).not.toBe(hashState(m2));
  });

  it("seed=0 works without degeneration (Mulberry32 safe)", () => {
    const m = createMatch({ seed: 0 });
    expect(m.map.tiles_flat.length).toBe(6400);
    expect(m.cities.filter((c) => c.is_capital).length).toBe(8);
  });

  it("hashState is stable across 5 calls with same seed", () => {
    const hashes = Array.from({ length: 5 }, () =>
      hashState(createMatch({ seed: 42 }))
    );
    expect(new Set(hashes).size).toBe(1);
  });
});
