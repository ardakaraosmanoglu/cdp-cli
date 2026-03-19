import { loadConfig, saveConfig } from "../core/store.js";
import type { CdpConfig } from "../domain/project.js";
import fs from "node:fs/promises";

export async function importCommand(filePath?: string): Promise<void> {
  let input: string;

  if (filePath) {
    input = await fs.readFile(filePath, "utf8");
  } else {
    input = await readStdin();
  }

  let imported: unknown;
  try {
    imported = JSON.parse(input);
  } catch {
    throw new Error("Invalid JSON input");
  }

  if (!imported || typeof imported !== "object") {
    throw new Error("Invalid config format");
  }

  const config = imported as CdpConfig;
  if (typeof config.version !== "number" || !config.projects || typeof config.projects !== "object") {
    throw new Error("Invalid config structure. Expected { version: number, projects: {...} }");
  }

  const currentConfig = await loadConfig();

  // Merge projects
  for (const [name, project] of Object.entries(config.projects)) {
    if (currentConfig.projects[name]) {
      console.log(`Skipping '${name}' - already exists`);
    } else {
      currentConfig.projects[name] = project;
      console.log(`Imported '${name}'`);
    }
  }

  await saveConfig(currentConfig);
  console.log("\nImport complete!");
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}
