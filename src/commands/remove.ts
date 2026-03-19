import { loadConfig, saveConfig } from "../core/store.js";

export async function removeCommand(name: string): Promise<void> {
  const config = await loadConfig();
  if (!config.projects[name]) throw new Error(`Project '${name}' not found.`);

  delete config.projects[name];
  await saveConfig(config);
  console.log(`🗑️ Removed project '${name}'.`);
}
