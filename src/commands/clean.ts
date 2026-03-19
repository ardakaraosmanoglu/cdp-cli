import { loadConfig, saveConfig } from "../core/store.js";
import { fileExists } from "../utils/fs.js";
import { success, error } from "../utils/colors.js";
import readline from "node:readline";

export interface CleanOptions {
  dryRun?: boolean;
  force?: boolean;
}

export async function cleanCommand(options?: CleanOptions): Promise<void> {
  const config = await loadConfig();
  const entries = Object.entries(config.projects);

  if (entries.length === 0) {
    console.log("No projects to clean.");
    return;
  }

  const deadProjects: { name: string; path: string }[] = [];

  for (const [name, project] of entries) {
    const exists = await fileExists(project.path);
    if (!exists) {
      deadProjects.push({ name, path: project.path });
    }
  }

  if (deadProjects.length === 0) {
    console.log("All projects are valid. Nothing to clean.");
    return;
  }

  console.log("\nDead projects found:\n");
  for (const { name, path } of deadProjects) {
    console.log(`  \x1b[31m✗\x1b[0m ${name.padEnd(20)} ${path}`);
  }
  console.log();

  if (options?.dryRun) {
    console.log(`Found ${deadProjects.length} dead project(s). (dry-run)`);
    return;
  }

  if (!options?.force) {
    const answer = await askToProceed(deadProjects.length);
    if (!answer) {
      console.log("Aborted.");
      return;
    }
  }

  for (const { name } of deadProjects) {
    delete config.projects[name];
  }

  await saveConfig(config);
  success(`Removed ${deadProjects.length} dead project(s).`);
}

async function askToProceed(count: number): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve) => {
    rl.question(`Remove ${count} dead project(s)? [Y/n] `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() !== "n");
    });
  });
}
