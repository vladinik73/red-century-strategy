/**
 * Deterministic hash of match state via stable stringify + FNV-1a.
 * Pure JS, works in Node and browser.
 */
import { stableStringify } from "./stableStringify.js";

function fnv1a(str: string): string {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

export function hashState(state: unknown): string {
  const str = stableStringify(state);
  return fnv1a(str);
}
