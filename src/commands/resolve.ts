import { loadConfig } from "../core/store.js";

export async function resolveCommand(name: string): Promise<void> {
  const config = await loadConfig();
  const project = config.projects[name];

  if (!project) {
    console.error(`Project '${name}' not found.`);
    process.exit(1);
  }

  process.stdout.write(project.path);
}
