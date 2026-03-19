import { loadConfig, saveConfig } from "../core/store.js";
import { success } from "../utils/colors.js";

export async function removeCommand(name: string): Promise<void> {
  const config = await loadConfig();
  if (!config.projects[name]) throw new Error(`Project '${name}' not found.`);

  delete config.projects[name];
  await saveConfig(config);
  success(`Removed project '${name}'`);
}
