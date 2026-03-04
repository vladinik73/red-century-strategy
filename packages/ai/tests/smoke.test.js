import { describe, it, expect } from "vitest";
import { decideTurn } from "../src/index";
describe("ai smoke", () => {
    it("decideTurn returns array", () => {
        const state = { version: "0.0.0", seed: 1, turn: 0 };
        const result = decideTurn(state);
        expect(Array.isArray(result)).toBe(true);
    });
});
//# sourceMappingURL=smoke.test.js.map