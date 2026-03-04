// AUTO-GENERATED. DO NOT EDIT. Source: schemas/tile.schema.json

export interface RedAgeTileSchemaV442 {
  /**
   * Tile X coordinate (0..width-1).
   */
  x: number;
  /**
   * Tile Y coordinate (0..height-1).
   */
  y: number;
  /**
   * Base terrain class. WATER tiles may host bridge-roads (road_level>0).
   */
  terrain_base: "LAND" | "WATER";
  /**
   * Visual/logic terrain type (T1). WATER covers all water tiles including rivers.
   */
  terrain_type: "PLAIN" | "FOREST" | "MOUNTAIN" | "DESERT" | "WATER";
  /**
   * River flag (R1). A river tile is WATER + is_river=true. No gameplay difference from regular water; used for generation/visuals.
   */
  is_river?: boolean;
  /**
   * Resource contained in this tile (if any).
   */
  resource_type?: "MONEY" | "SCIENCE" | null;
  /**
   * Remaining resource stock on this tile.
   */
  resource_remaining?: number;
  /**
   * Per-turn extraction amount once harvesting has started.
   */
  resource_yield_per_turn?: number;
  /**
   * Whether harvesting has been started on this tile.
   */
  harvest_started?: boolean;
  /**
   * Player id that started harvesting (if started).
   */
  harvest_owner_player_id?: string | null;
  /**
   * After resource_remaining reaches 0, tile may switch to low productivity state.
   */
  depleted_low_productivity?: boolean;
  /**
   * 0 = no road. 1..3 indicates road level (MaxRoadLevel=3). If terrain_base=WATER and road_level>0, this is a bridge-road.
   */
  road_level?: number;
  /**
   * Owner player id of the road on this tile, if any.
   */
  road_owner_player_id?: string | null;
  /**
   * DamagedRoad timer. 0 means not damaged.
   */
  road_damaged_turns_left?: number;
  /**
   * Port level (0 = no port, 1..3 = L1..L3; MaxPortLevel=3). port_level >= 1 means port exists.
   */
  port_level?: number;
  /**
   * Owner player id of the port on this tile, if any.
   */
  port_owner_player_id?: string | null;
  /**
   * If this tile is the city center, city_id references the City entity.
   */
  city_id?: string | null;
  /**
   * City whose territory includes this tile (borders are city borders).
   */
  territory_city_id?: string | null;
  /**
   * Player id that controls the territory of this tile (usually derived from territory_city_id).
   */
  territory_owner_player_id?: string | null;
  /**
   * Per-civ visibility state (v4.9 2-state): 0=UNEXPLORED, 1=VISIBLE (permanent). Length = MaxCivs (=10).
   *
   * @minItems 10
   * @maxItems 10
   */
  visibility: [0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1, 0 | 1];
}

export type TileState = RedAgeTileSchemaV442;
