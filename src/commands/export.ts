import { loadConfig } from "../core/store.js";

export async function exportCommand(): Promise<void> {
  const config = await loadConfig();
  console.log(JSON.stringify(config, null, 2));
}
