/**
 * Deterministic PRNG (mulberry32) for reproducible game logic.
 */
export function createSeededRng(seed: number): () => number {
  return function random(): number {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0; // mulberry32
    const t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    return ((t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ (t ^ (t >>> 14))) >>> 0;
  };
}
