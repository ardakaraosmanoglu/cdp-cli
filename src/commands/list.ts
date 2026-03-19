import { loadConfig } from "../core/store.js";

export async function listCommand(): Promise<void> {
  const config = await loadConfig();
  const entries = Object.entries(config.projects).sort(([a], [b]) => a.localeCompare(b));

  if (entries.length === 0) {
    console.log("No projects saved yet. Use 'cdp init' in a project directory.");
    return;
  }

  const maxNameLen = Math.max(...entries.map(([name]) => name.length), 0);
  for (const [name, project] of entries) {
    const paddedName = name.padEnd(maxNameLen + 2, " ");
    console.log(`${paddedName} ${project.path}`);
  }
}
