import { loadConfig, saveConfig } from "../core/store.js";
import { validateProjectName } from "../core/validation.js";
import { success } from "../utils/colors.js";
import path from "node:path";

export async function initCommand(name?: string): Promise<void> {
  const cwd = process.cwd();
  const inferredName = name ?? path.basename(cwd);

  if (!inferredName) throw new Error("Could not infer project name from directory.");
  validateProjectName(inferredName);

  const config = await loadConfig();
  const now = new Date().toISOString();
  const isUpdate = !!config.projects[inferredName];

  config.projects[inferredName] = {
    path: cwd,
    createdAt: config.projects[inferredName]?.createdAt ?? now,
    updatedAt: now
  };

  await saveConfig(config);
  success(`${isUpdate ? 'Updated' : 'Saved'} '${inferredName}' -> ${cwd}`);
}
