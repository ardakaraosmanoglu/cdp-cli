import { describe, it } from "node:test";
import assert from "node:assert";
import { validateProjectName } from "../dist/core/validation.js";

describe("validateProjectName", () => {
  it("should accept valid names", () => {
    validateProjectName("my-project");
    validateProjectName("my_project");
    validateProjectName("my.project");
    validateProjectName("my-project_123");
  });

  it("should reject empty names", () => {
    assert.throws(() => validateProjectName(""), /empty/);
    assert.throws(() => validateProjectName("   "), /empty/);
  });

  it("should reject names with invalid characters", () => {
    assert.throws(() => validateProjectName("my project"), /letters, numbers/);
    assert.throws(() => validateProjectName("my/project"), /letters, numbers/);
    assert.throws(() => validateProjectName("my@project"), /letters, numbers/);
  });
});
