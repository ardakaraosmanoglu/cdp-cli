import { loadConfig } from "../core/store.js";
import { getCdpDir, getConfigPath } from "../core/paths.js";
import { fileExists } from "../utils/fs.js";
import { getPlatform } from "../utils/platform.js";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export async function doctorCommand(): Promise<void> {
  const issues: string[] = [];
  const checks: { name: string; status: "ok" | "fail" | "warn"; message: string }[] = [];

  // Check config path
  const configPath = getConfigPath();
  const configDir = getCdpDir();
  checks.push({
    name: "Config directory",
    status: (await fileExists(configDir)) ? "ok" : "warn",
    message: configDir,
  });

  // Check config file
  if (await fileExists(configPath)) {
    checks.push({ name: "Config file", status: "ok", message: configPath });
  } else {
    checks.push({ name: "Config file", status: "warn", message: `${configPath} (not found, will be created)` });
  }

  // Check config parse
  try {
    const config = await loadConfig();
    checks.push({ name: "Config parse", status: "ok", message: `version ${config.version}` });

    // Check saved paths
    const projectEntries = Object.entries(config.projects);
    if (projectEntries.length === 0) {
      checks.push({ name: "Saved projects", status: "warn", message: "0 projects (use 'cdp init' to add)" });
    } else {
      checks.push({ name: "Saved projects", status: "ok", message: `${projectEntries.length} project(s)` });

      // Check each path exists
      for (const [name, project] of projectEntries) {
        const exists = await fileExists(project.path);
        checks.push({
          name: `  - ${name}`,
          status: exists ? "ok" : "fail",
          message: exists ? "exists" : `NOT FOUND: ${project.path}`,
        });
        if (!exists) {
          issues.push(`Project '${name}' points to non-existent path: ${project.path}`);
        }
      }
    }
  } catch (error) {
    checks.push({
      name: "Config parse",
      status: "fail",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    issues.push("Config file is corrupted. Try: cdp export > backup.json, then delete ~/.cdp/projects.json");
  }

  // Check platform
  const platform = getPlatform();
  checks.push({ name: "Platform", status: "ok", message: platform });

  // Check shell integration
  const rcFile = path.join(os.homedir(), platform === "mac" || platform === "linux" ? ".zshrc" : ".bashrc");
  if (await fileExists(rcFile)) {
    const content = await fs.readFile(rcFile, "utf8");
    const hasWrapper = content.includes("cdp() {");
    checks.push({
      name: "Shell wrapper",
      status: hasWrapper ? "ok" : "warn",
      message: hasWrapper ? "installed" : `not found in ${rcFile}`,
    });
    if (!hasWrapper) {
      issues.push(`Shell wrapper not found. Run 'cdp setup' or add the wrapper to ${rcFile}`);
    }
  }

  // Print results
  console.log("\nCDP Doctor - System Check\n");
  console.log("=".repeat(50));

  for (const check of checks) {
    const icon = check.status === "ok" ? "✅" : check.status === "warn" ? "⚠️" : "❌";
    console.log(`${icon} ${check.name.padEnd(20)} ${check.message}`);
  }

  console.log("=".repeat(50));

  if (issues.length > 0) {
    console.log("\nIssues found:");
    for (const issue of issues) {
      console.log(`  - ${issue}`);
    }
    console.log("\n");
  } else {
    console.log("\n🎉 Everything looks good!\n");
  }
}
