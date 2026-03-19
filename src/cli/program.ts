import { Command } from "commander";
import { initCommand } from "../commands/init.js";
import { listCommand } from "../commands/list.js";
import { resolveCommand } from "../commands/resolve.js";
import { removeCommand } from "../commands/remove.js";
import { renameCommand } from "../commands/rename.js";
import { setupCommand } from "../commands/setup.js";
import { doctorCommand } from "../commands/doctor.js";
import { exportCommand } from "../commands/export.js";
import { importCommand } from "../commands/import.js";

export function createProgram(): Command {
  const program = new Command();
  program.name("cdp").description("Fast project directory switch helper").version("0.1.0");

  program.command("init").argument("[name]").description("Save current directory as a project").action(initCommand);
  program.command("list").description("List all saved projects").action(listCommand);
  program.command("remove").argument("<name>").description("Remove a saved project").action(removeCommand);
  program.command("rename").argument("<oldName>").argument("<newName>").description("Rename a saved project").action(renameCommand);
  
  const setupCmd = program.command("setup").description("Add shell wrapper to ~/.zshrc or ~/.bashrc");
  setupCmd.option("-c, --completion", "Also enable shell tab completion").action(async (options) => {
    await setupCommand({ completion: true });
  });

  program.command("doctor").description("Diagnose config and shell integration").action(doctorCommand);
  program.command("export").description("Export config to stdout as JSON").action(exportCommand);
  program.command("import").argument("[file]").description("Import config from file or stdin").action(importCommand);

  program.arguments("[project]").action(async (project?: string) => {
    if (!project) {
      program.help();
      return;
    }
    await resolveCommand(project);
  });

  return program;
}
