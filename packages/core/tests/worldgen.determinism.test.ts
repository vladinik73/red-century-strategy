import { describe, it, expect } from "vitest";
import { createMatch, hashState } from "../src/index.js";

describe("worldgen determinism", () => {
  it("createMatch({seed:123}) twice produces same hashState", () => {
    const m1 = createMatch({ seed: 123 });
    const m2 = createMatch({ seed: 123 });
    expect(hashState(m1)).toBe(hashState(m2));
  });
});
