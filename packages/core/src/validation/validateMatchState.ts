/**
 * Validate match state against JSON Schema.
 * TODO: Load schemas from ../../schemas at runtime; for now stub returns ok.
 */
import type { MatchState } from "../types.js";

export function validateMatchState(state: unknown): { ok: boolean; errors?: string[] } {
  // Stub: minimal shape check until schema loading is wired
  if (state === null || typeof state !== "object") {
    return { ok: false, errors: ["state must be an object"] };
  }
  const s = state as Record<string, unknown>;
  if (typeof s.seed !== "number" || typeof s.turn !== "number") {
    return { ok: false, errors: ["state must have seed and turn as numbers"] };
  }
  return { ok: true };
}
