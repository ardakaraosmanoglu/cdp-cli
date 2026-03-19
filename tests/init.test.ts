import { describe, it } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";

const TEST_HOME = path.join(os.tmpdir(), `cdp-test-init-${Date.now()}-${Math.random()}`);

async function cleanup() {
  try {
    await fs.rm(TEST_HOME, { recursive: true });
  } catch {
    // ignore
  }
}

describe("Init Command", () => {
  it("should validate project names", async () => {
    const { validateProjectName } = await import("../dist/core/validation.js");
    
    // Valid names should not throw
    validateProjectName("valid-project");
    validateProjectName("another_project");
    
    // Invalid names should throw
    assert.throws(() => validateProjectName(""), /empty/);
    assert.throws(() => validateProjectName("invalid name"), /letters/);
  });
});
