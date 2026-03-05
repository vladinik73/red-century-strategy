/**
 * World generation types. Canon: docs/13_engine/Map_Generator_Architecture.md,
 * docs/03_map/World_Types_and_Terrain_Distribution_Spec.md
 */

import type { TileState } from "../types/generated/tile.js";
import type { CityState } from "../types/generated/city.js";
import type { PlayerState } from "../types/generated/player.js";

export type WorldTypeId =
  | "BALANCED"
  | "CONTINENTAL"
  | "ARCHIPELAGO"
  | "PANGAEA"
  | "WILD";

export const WORLD_TYPE_IDS: WorldTypeId[] = [
  "BALANCED",
  "CONTINENTAL",
  "ARCHIPELAGO",
  "PANGAEA",
  "WILD",
];

/** CDF for weighted selection: [30, 50, 70, 85, 100] */
export const WORLD_TYPE_CDF = [30, 50, 70, 85, 100];

export interface WorldConfig {
  worldType: WorldTypeId;
  landThreshold: [number, number];
  noiseFrequency: [number, number];
  edgeFalloffWidth: number;
  continentRange: [number, number];
  minContinentSize: number;
  islandRange: [number, number];
  minIslandSize: number;
  minLakeSize: number;
  terrainRatios: { plain: number; forest: number; mountain: number; desert: number };
  thresholdDeltas: { mountain: number; forest: number; desert: number };
  riverCount: [number, number];
  riverLength: [number, number];
  resourceDensityNormal: number;
  resourceDensityDesert: number;
  moneyScienceRatio: number;
  cityRange: [number, number];
}

export interface WorldGenResult {
  tiles_flat: TileState[];
  cities: CityState[];
  players: PlayerState[];
  units: Array<{
    unit_id: string;
    unit_type_id: string;
    owner_player_id: string;
    x: number;
    y: number;
    hp: number;
    kills_in_chain: number;
    kill_count_total: number;
    veterancy_level: number;
    has_acted_this_turn: boolean;
  }>;
  meta: {
    continentCount: number;
    islandCount: number;
    landCount: number;
    attemptIndex: number;
  };
}
