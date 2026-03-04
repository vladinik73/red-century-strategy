import { describe, it, expect } from "vitest";
import { hashState } from "@redage/core";

describe("web smoke", () => {
  it("core hashState works in test env", () => {
    const state = { version: "0.0.0", seed: 1, turn: 0 };
    expect(typeof hashState(state)).toBe("string");
  });
});
