// AUTO-GENERATED. DO NOT EDIT. Source: schemas/city.schema.json

export interface RedAgeCitySchemaV442 {
  /**
   * Unique identifier for the city.
   */
  city_id: string;
  /**
   * Tile X coordinate (city center).
   */
  x: number;
  /**
   * Tile Y coordinate (city center).
   */
  y: number;
  /**
   * Owner player ID. null = neutral city.
   */
  owner_player_id: string | null;
  /**
   * True if this city is the capital of its civilization.
   */
  is_capital: boolean;
  /**
   * City level (1..5).
   */
  level: number;
  /**
   * Defense level (0..2).
   */
  defense_level: number;
  /**
   * Turns remaining until city is integrated after capture. 0 = integrated.
   */
  integration_turns_left: number;
  /**
   * True if city is under siege.
   */
  sieged?: boolean;
  /**
   * Turns remaining for Cyber Disruption effect. 0 = no disruption.
   */
  disruption_turns_left?: number;
  /**
   * Chebyshev radius of this city's territory. Canon: start/min=1, MaxTerritoryRadius=5.
   */
  territory_radius?: number;
  /**
   * Flat indices of tiles in this city's territory (y*80+x).
   */
  territory_tile_indices: number[];
}

export type CityState = RedAgeCitySchemaV442;
