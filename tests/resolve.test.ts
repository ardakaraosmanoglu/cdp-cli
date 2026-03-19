import { describe, it } from "node:test";
import assert from "node:assert";

describe("Resolve Command", () => {
  it("should have resolveCommand exported", async () => {
    const { resolveCommand } = await import("../dist/commands/resolve.js");
    assert.strictEqual(typeof resolveCommand, "function");
  });
});
