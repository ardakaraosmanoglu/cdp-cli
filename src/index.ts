import { createProgram } from "./cli/program.js";
import { checkForUpdates } from "./utils/update-checker.js";

async function main(): Promise<void> {
  await checkForUpdates();
  
  try {
    await createProgram().parseAsync(process.argv);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

main();
