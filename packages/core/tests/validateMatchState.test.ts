/**
 * Tests for validateMatchState (Ajv-based schema validation).
 */
import { describe, it, expect } from "vitest";
import { validateMatchState } from "../src/validation/validateMatchState.js";

function minimalTile(index: number) {
  const x = index % 80;
  const y = Math.floor(index / 80);
  return {
    x,
    y,
    terrain_base: "LAND",
    terrain_type: "PLAIN",
    visibility: Array(10).fill(0),
  };
}

function minimalValidState() {
  const tiles = Array.from({ length: 6400 }, (_, i) => minimalTile(i));
  return {
    meta: {
      match_id: "AbCdEfGh12345678",
      mode: "PvE",
      seed: 42,
      created_at_utc: "2026-03-04T12:00:00Z",
    },
    turn: {
      turn_index: 0,
      round_index: 0,
      active_player_id: "p1",
      turn_order_player_ids: ["p1", "p2"],
    },
    players: [
      {
        player_id: "p1",
        faction_id: "f1",
        money: 100,
        science: 0,
        stability: 80,
        ap_current: 5,
        ap_income_last_turn: 5,
        tech_unlocked: [],
        victory_timers: { economic_hold_turns_left: 0, tech_victory_turns_left: 0 },
        effects: { cyber_global_penalty_turns_left: 0 },
      },
      {
        player_id: "p2",
        faction_id: "f2",
        money: 100,
        science: 0,
        stability: 80,
        ap_current: 5,
        ap_income_last_turn: 5,
        tech_unlocked: [],
        victory_timers: { economic_hold_turns_left: 0, tech_victory_turns_left: 0 },
        effects: { cyber_global_penalty_turns_left: 0 },
      },
    ],
    map: { width: 80, height: 80, tiles_flat: tiles },
    cities: [],
    units: [],
    diplomacy: {
      relations: [
        { a_player_id: "p1", b_player_id: "p2", state: "NEUTRAL", min_alliance_turns_left: 0, cooldown_turns_left: 0 },
      ],
    },
    victory: {
      global_city_power: 0,
      per_player: [
        { player_id: "p1", military_city_power: 0, economic_hold_turns_left: 0, tech_victory_turns_left: 0, won: false, lost: false },
        { player_id: "p2", military_city_power: 0, economic_hold_turns_left: 0, tech_victory_turns_left: 0, won: false, lost: false },
      ],
    },
    events: [],
  };
}

describe("validateMatchState", () => {
  it("returns ok:true for valid minimal MatchState", () => {
    const result = validateMatchState(minimalValidState());
    expect(result.ok).toBe(true);
  });

  it("returns ok:false for invalid tiles_flat length (10 instead of 6400)", () => {
    const state = minimalValidState();
    (state as { map: { tiles_flat: unknown[] } }).map.tiles_flat = Array(10).fill(minimalTile(0));
    const result = validateMatchState(state);
    expect(result.ok).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
  });

  it("returns ok:false when required field players is missing", () => {
    const state = minimalValidState();
    delete (state as Record<string, unknown>).players;
    const result = validateMatchState(state);
    expect(result.ok).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it("returns ok:false for invalid event_type in events", () => {
    const state = minimalValidState();
    (state as { events: unknown[] }).events = [
      {
        event_id: "e1",
        round_index: 0,
        civ_turn_index: 0,
        acting_player_id: "p1",
        event_type: "BAD_EVENT",
        payload: {},
      },
    ];
    const result = validateMatchState(state);
    expect(result.ok).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it("returns ok:false for null", () => {
    const result = validateMatchState(null);
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(["state must be an object"]);
  });

  it("returns ok:false for non-object", () => {
    const result = validateMatchState("not an object");
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual(["state must be an object"]);
  });
});
