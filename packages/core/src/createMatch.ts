/**
 * Create MatchState with runtime world generation. Canon: Map_Generator_Architecture Option A.
 */
import type { MatchState } from "./types/generated/match.js";
import { validateMatchState } from "./validation/validateMatchState.js";
import { deriveWorldType } from "./worldgen/deriveWorldType.js";
import { generateWorld } from "./worldgen/generateWorld.js";
import { validateWorld } from "./worldgen/validateWorld.js";
import { attemptSeed } from "./worldgen/attemptSeed.js";
import { getWorldConfig } from "./worldgen/worldConfigs.js";
import type { WorldTypeId } from "./worldgen/types.js";

const MAX_RETRIES = 5;

function deterministicMatchId(seed: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let h = (seed >>> 0) * 0x9e3779b9;
  let id = "";
  for (let i = 0; i < 16; i++) {
    h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
    h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
    id += chars[((h >>> 0) % chars.length + chars.length) % chars.length];
  }
  return id;
}

export interface CreateMatchInput {
  seed: number;
  worldTypeOverride?: WorldTypeId;
}

export function createMatch(input: CreateMatchInput): MatchState {
  const { seed, worldTypeOverride } = input;
  const worldType = worldTypeOverride ?? deriveWorldType(seed);
  const worldTypeId = ["BALANCED", "CONTINENTAL", "ARCHIPELAGO", "PANGAEA", "WILD"].indexOf(worldType);
  const config = getWorldConfig(worldType);

  let lastResult: Awaited<ReturnType<typeof generateWorld>> | null = null;
  let lastReasons: string[] = [];

  for (let attemptIndex = 0; attemptIndex < MAX_RETRIES; attemptIndex++) {
    const aseed = attemptSeed(seed, worldTypeId, attemptIndex);
    const result = generateWorld(aseed, config, attemptIndex);
    lastResult = result;

    const validation = validateWorld(result);
    if (validation.ok) {
      return buildMatchState(seed, result, deterministicMatchId(seed));
    }
    lastReasons = validation.reasons;
  }

  throw new Error(
    `World generation failed after ${MAX_RETRIES} attempts. Last reasons: ${lastReasons.join("; ")}`
  );
}

function buildMatchState(
  seed: number,
  gen: Awaited<ReturnType<typeof generateWorld>>,
  matchId: string
): MatchState {
  const turnOrder = [...gen.players.map((p) => p.player_id)].reverse();
  const humanId = gen.players[0].player_id;
  const aiFirst = turnOrder.filter((id) => id !== humanId);
  const turnOrderPlayerIds = [...aiFirst, humanId] as unknown as [string, string, ...string[]];

  const state: MatchState = {
    meta: {
      match_id: matchId,
      mode: "PvE",
      seed,
      created_at_utc: "2026-01-01T00:00:00.000Z",
    },
    turn: {
      turn_index: 0,
      round_index: 0,
      active_player_id: turnOrderPlayerIds[0],
      turn_order_player_ids: turnOrderPlayerIds,
      alive_player_ids: gen.players.map((p) => p.player_id),
      ended_player_ids: [],
    },
    players: gen.players as MatchState["players"],
    map: {
      width: 80,
      height: 80,
      tiles_flat: gen.tiles_flat as MatchState["map"]["tiles_flat"],
    },
    cities: gen.cities,
    units: gen.units as MatchState["units"],
    diplomacy: { relations: [] },
    victory: {
      global_city_power: 0,
      per_player: gen.players.map((p) => ({
        player_id: p.player_id,
        military_city_power: 0,
        economic_hold_turns_left: 5,
        tech_victory_turns_left: 10,
        won: false,
        lost: false,
      })),
    },
    events: [],
  };

  const ajvResult = validateMatchState(state);
  if (!ajvResult.ok) {
    throw new Error(`MatchState validation failed: ${ajvResult.errors.join("; ")}`);
  }

  return state;
}
