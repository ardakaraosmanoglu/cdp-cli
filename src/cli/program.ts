import { Command } from "commander";
import { initCommand } from "../commands/init.js";
import { listCommand } from "../commands/list.js";
import { resolveCommand } from "../commands/resolve.js";
import { removeCommand } from "../commands/remove.js";
import { renameCommand } from "../commands/rename.js";
import { setupCommand } from "../commands/setup.js";

export function createProgram(): Command {
  const program = new Command();
  program.name("cdp").description("Fast project directory switch helper").version("0.1.0");

  program.command("init").argument("[name]").action(initCommand);
  program.command("list").action(listCommand);
  program.command("remove").argument("<name>").action(removeCommand);
  program.command("rename").argument("<oldName>").argument("<newName>").action(renameCommand);
  program.command("setup").description("Add shell wrapper to ~/.zshrc or ~/.bashrc").action(setupCommand);

  program.arguments("[project]").action(async (project?: string) => {
    if (!project) {
      program.help();
      return;
    }
    await resolveCommand(project);
  });

  return program;
}
