import { create } from "zustand";
import { hashState } from "@redage/core";
import type { MatchState } from "@redage/core";

function minimalTile(index: number) {
  const x = index % 80;
  const y = Math.floor(index / 80);
  return {
    x,
    y,
    terrain_base: "LAND" as const,
    terrain_type: "PLAIN" as const,
    visibility: Array(10).fill(0) as number[],
  };
}

const tiles = Array.from({ length: 6400 }, (_, i) => minimalTile(i));

const initialState: MatchState = {
  meta: {
    match_id: "AbCdEfGh12345678",
    mode: "PvE",
    seed: 12345,
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
  map: { width: 80, height: 80, tiles_flat: tiles as MatchState["map"]["tiles_flat"] },
  cities: [],
  units: [],
  diplomacy: {
    relations: [
      {
        a_player_id: "p1",
        b_player_id: "p2",
        state: "NEUTRAL",
        min_alliance_turns_left: 0,
        cooldown_turns_left: 0,
      },
    ],
  },
  victory: {
    global_city_power: 0,
    per_player: [
      {
        player_id: "p1",
        military_city_power: 0,
        economic_hold_turns_left: 0,
        tech_victory_turns_left: 0,
        won: false,
        lost: false,
      },
      {
        player_id: "p2",
        military_city_power: 0,
        economic_hold_turns_left: 0,
        tech_victory_turns_left: 0,
        won: false,
        lost: false,
      },
    ],
  },
  events: [],
};

export const useGameStore = create<{
  state: MatchState;
  hash: string;
}>((set) => ({
  state: initialState,
  hash: hashState(initialState),
}));
