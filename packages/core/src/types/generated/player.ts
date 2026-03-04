// AUTO-GENERATED. DO NOT EDIT. Source: schemas/player.schema.json

export interface PlayerStateSchemaV442 {
  /**
   * Уникальный идентификатор игрока (например, UUID).
   */
  player_id: string;
  /**
   * ID цивилизации/фракции игрока (см. docs/02_world_and_factions).
   */
  faction_id: string;
  /**
   * Текущий баланс денег.
   */
  money: number;
  /**
   * Текущий баланс науки.
   */
  science: number;
  /**
   * Стабильность 0..100 (влияет на мораль/доход/ОД).
   */
  stability: number;
  /**
   * Очки действий, доступные в текущем ходу (после расчёта AP).
   */
  ap_current: number;
  /**
   * Сколько AP было выдано в начале предыдущего хода (для дебага/реплеев).
   */
  ap_income_last_turn: number;
  /**
   * Список открытых технологий. Формат ключа (v4.41): {branch}_{level} lowercase, напр. military_1, science_2, economic_3. Соответствует TECH_UNLOCK payload (branch MILITARY|ECONOMIC|SCIENCE, level 1..5).
   */
  tech_unlocked: string[];
  victory_timers: {
    economic_hold_turns_left: number;
    tech_victory_turns_left: number;
  };
  /**
   * Per-turn flag: Stability boost (50→+2 or 100→+5) can be used at most once per civ turn. Reset at start of civ turn.
   */
  stability_boost_used_this_turn?: boolean;
  effects: {
    cyber_global_penalty_turns_left: number;
  };
}

export type PlayerState = PlayerStateSchemaV442;
