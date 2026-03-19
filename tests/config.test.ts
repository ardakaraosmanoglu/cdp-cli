import { describe, it } from "node:test";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";

const TEST_HOME = path.join(os.tmpdir(), `cdp-test-${Date.now()}-${Math.random()}`);
const TEST_CONFIG = path.join(TEST_HOME, ".cdp", "projects.json");

async function setup() {
  await fs.mkdir(path.dirname(TEST_CONFIG), { recursive: true });
}

async function cleanup() {
  try {
    await fs.rm(TEST_HOME, { recursive: true });
  } catch {
    // ignore
  }
}

describe("Config Store", () => {
  it("should handle atomic write", async () => {
    await setup();
    try {
      // Import dynamically to use the test HOME
      const originalHome = process.env.HOME;
      process.env.HOME = TEST_HOME;
      
      const { loadConfig, saveConfig } = await import("../dist/core/store.js");
      
      const config = await loadConfig();
      assert.strictEqual(config.version, 1);
      assert.deepStrictEqual(config.projects, {});
      
      config.projects["test"] = {
        path: "/tmp/test",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveConfig(config);

      const reloaded = await loadConfig();
      assert.ok(reloaded.projects["test"]);
      
      process.env.HOME = originalHome;
    } finally {
      await cleanup();
    }
  });
});
