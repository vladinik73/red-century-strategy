import { describe, it, expect } from "vitest";
import { hashState } from "../src/index";

describe("determinism", () => {
  it("hashState returns same hash for identical MatchState objects", () => {
    const state1 = { version: "0.0.0", seed: 42, turn: 0, events: [] };
    const state2 = { version: "0.0.0", seed: 42, turn: 0, events: [] };
    expect(hashState(state1)).toBe(hashState(state2));
  });
});
