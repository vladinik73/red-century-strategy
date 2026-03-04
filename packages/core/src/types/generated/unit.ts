// AUTO-GENERATED. DO NOT EDIT. Source: schemas/unit.schema.json

/**
 * Schema for unit type definitions (UnitType). NOT match units state — see match.schema units[].
 */
export interface RedAgeUnitTypeSchemaV442 {
  /**
   * Unique identifier for this unit type (matches match.schema unit_type_id).
   */
  unit_type_id: string;
  /**
   * Display name of the unit type.
   */
  name: string;
  /**
   * Movement domain: ground, naval, or air.
   */
  domain: "GROUND" | "NAVAL" | "AIR";
  /**
   * Attack range (1 = melee, 2+ = ranged).
   */
  range: number;
  /**
   * Base damage dealt per attack.
   */
  base_damage: number;
  /**
   * Maximum HP for units of this type.
   */
  base_max_hp: number;
  /**
   * Action points cost to produce this unit.
   */
  ap_cost: number;
  /**
   * Base move points per turn.
   */
  move: number;
  /**
   * Visibility range. Optional; defaults by range if omitted.
   */
  sight?: number;
  /**
   * If true, faction-unique unit (one per faction).
   */
  is_unique?: boolean;
  /**
   * Tech branch+level required to unlock (e.g. MILITARY_L4), or null if base.
   */
  unlock_tech?: string | null;
}

export type UnitType = RedAgeUnitTypeSchemaV442;
