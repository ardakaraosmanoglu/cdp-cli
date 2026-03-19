import { colors } from "../utils/colors.js";

const commands = [
  { name: "cdp init [name]", desc: "Save current directory as a project" },
  { name: "cdp list", desc: "List all saved projects" },
  { name: "cdp remove <name>", desc: "Remove a saved project" },
  { name: "cdp rename <oldName> <newName>", desc: "Rename a saved project" },
  { name: "cdp setup", desc: "Add shell wrapper to ~/.zshrc or ~/.bashrc" },
  { name: "cdp setup --completion", desc: "Also enable shell tab completion" },
  { name: "cdp clean", desc: "Remove dead projects (that no longer exist on disk)" },
  { name: "cdp clean --dry-run", desc: "List dead projects without removing" },
  { name: "cdp clean --force", desc: "Remove without confirmation" },
  { name: "cdp doctor", desc: "Diagnose config and shell integration" },
  { name: "cdp export", desc: "Export config to stdout as JSON" },
  { name: "cdp import [file]", desc: "Import config from file or stdin" },
  { name: "cdp <project>", desc: "Switch to a saved project (cd into it)" },
  { name: "cdp version", desc: "Show version and check for updates" },
  { name: "cdp help", desc: "Show all commands and how to use them" },
];

export async function helpCommand(): Promise<void> {
  console.log(`\n${colors.bold("cdp")} - Fast project directory switch helper\n`);
  console.log(`${colors.bold("Usage:")}\n  cdp <command> [options]\n`);
  console.log(`${colors.bold("Commands:")}\n`);

  const maxLen = Math.max(...commands.map(c => c.name.length));
  for (const cmd of commands) {
    const paddedName = cmd.name.padEnd(maxLen + 4, " ");
    console.log(`  ${colors.info(paddedName)}${cmd.desc}`);
  }

  console.log(`\n${colors.dim("Run 'cdp <command> --help' for more information on a command.")}`);
  console.log(`${colors.dim("Update: npm install -g cdproject@latest")}\n`);
}
