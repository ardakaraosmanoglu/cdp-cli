import { describe, it } from "node:test";
import assert from "node:assert";

describe("Clean Command", () => {
  it("should have cleanCommand exported", async () => {
    const { cleanCommand } = await import("../dist/commands/clean.js");
    assert.strictEqual(typeof cleanCommand, "function");
  });
});
