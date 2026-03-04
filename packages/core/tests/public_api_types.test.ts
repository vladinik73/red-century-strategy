/**
 * Guard test: ensures public API types are exported from @redage/core.
 * Compile-time assertion; runtime is irrelevant.
 */
import { describe, it, expect } from "vitest";
import type {
  MatchState,
  PlayerState,
  TileState,
  CityState,
  UnitType,
  GameEvent,
  GameEventType,
} from "../src/index.js";

describe("public API types", () => {
  it("exports all stable types", () => {
    expect(true).toBe(true);
  });
});

// Compile-time guard: these will fail if types are missing
const _evtType: GameEventType | undefined = undefined;
const _evt: GameEvent | undefined = undefined;
const _m: MatchState | undefined = undefined;
const _p: PlayerState | undefined = undefined;
const _t: TileState | undefined = undefined;
const _c: CityState | undefined = undefined;
const _u: UnitType | undefined = undefined;
