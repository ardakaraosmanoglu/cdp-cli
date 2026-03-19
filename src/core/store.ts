import fs from "node:fs/promises";
import { getConfigPath } from "./paths.js";
import { atomicWriteJson, fileExists } from "../utils/fs.js";
import type { CdpConfig } from "../domain/project.js";

function createEmptyConfig(): CdpConfig {
  return { version: 1, projects: {} };
}

export async function loadConfig(): Promise<CdpConfig> {
  const configPath = getConfigPath();
  if (!(await fileExists(configPath))) return createEmptyConfig();

  try {
    const raw = await fs.readFile(configPath, "utf8");
    const parsed = JSON.parse(raw) as CdpConfig;
    if (!parsed.version || !parsed.projects) throw new Error("Invalid config schema.");
    return parsed;
  } catch (error) {
    throw new Error(`Failed to parse config file: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function saveConfig(config: CdpConfig): Promise<void> {
  await atomicWriteJson(getConfigPath(), config);
}
