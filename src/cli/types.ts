import type { Command } from "commander";

export interface CliContext {
  program: Command;
  args: string[];
}

export type CommandHandler = () => Promise<void> | void;
