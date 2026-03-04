import { describe, it, expect } from "vitest";
import { startServer } from "../src/index";

describe("server smoke", () => {
  it("startServer is callable", () => {
    expect(() => startServer()).not.toThrow();
  });
});
