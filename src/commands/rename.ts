import { loadConfig, saveConfig } from "../core/store.js";
import { validateProjectName } from "../core/validation.js";

export async function renameCommand(oldName: string, newName: string): Promise<void> {
  validateProjectName(newName);
  const config = await loadConfig();
  const project = config.projects[oldName];

  if (!project) throw new Error(`Project '${oldName}' not found.`);
  if (config.projects[newName]) throw new Error(`Project '${newName}' already exists.`);

  config.projects[newName] = { ...project, updatedAt: new Date().toISOString() };
  delete config.projects[oldName];
  await saveConfig(config);

  console.log(`✏️ Renamed '${oldName}' -> '${newName}'.`);
}
