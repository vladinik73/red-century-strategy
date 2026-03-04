/**
 * Placeholder types aligned with docs (Action_Catalog, match.schema.json).
 * TODO: Replace with generated types from tools/codegen.
 */

export type GameEventType =
  | "MOVE"
  | "ATTACK"
  | "SERIAL_ATTACK"
  | "PRODUCE"
  | "BUILD_ROAD"
  | "UPGRADE_ROAD"
  | "BUILD_PORT"
  | "UPGRADE_PORT"
  | "UPGRADE_CITY"
  | "HEAL"
  | "DISBAND"
  | "CAPTURE_CITY"
  | "CYBER_DISRUPT"
  | "CYBER_DAMAGE_ROAD"
  | "START_HARVEST"
  | "REPAIR_ROAD"
  | "BOOST_SCIENCE"
  | "BOOST_STABILITY"
  | "TECH_UNLOCK"
  | "DECLARE_WAR"
  | "MAKE_PEACE"
  | "FORM_ALLIANCE"
  | "BREAK_ALLIANCE"
  | "REBELLION"
  | "ELIMINATION"
  | "VICTORY_TRIGGER"
  | "VICTORY_COMPLETE"
  | "HIDDEN_CIV_SPAWN";

export interface GameEvent {
  event_type: GameEventType;
  ts?: number;
  payload: Record<string, unknown>;
}

export interface MatchState {
  version: string;
  seed: number;
  turn: number;
  events?: GameEvent[];
}
