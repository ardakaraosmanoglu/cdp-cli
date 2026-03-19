import { describe, it } from "node:test";
import assert from "node:assert";

describe("List Command", () => {
  it("should have listCommand exported", async () => {
    const { listCommand } = await import("../dist/commands/list.js");
    assert.strictEqual(typeof listCommand, "function");
  });
});
