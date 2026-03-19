import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const SHELL_WRAPPER_CONTENT = `
# CDP (CD Project) - Fast Project Switcher
cdp() {
  if [ "$#" -eq 0 ]; then
    command cdp list
    return
  fi

  case "$1" in
  init|list|remove|rename|doctor|export|import|help|--help|-h|--version|-v|setup)
    command cdp "$@"
    ;;
  *)
    local target
    target="$(command cdp "$@")" || return 1
    cd "$target" || return 1
    ;;
  esac
}
`;

export async function setupCommand(): Promise<void> {
  const shell = process.env.SHELL || "";
  let rcFile: string;
  
  if (shell.includes("zsh")) {
    rcFile = path.join(os.homedir(), ".zshrc");
  } else if (shell.includes("bash")) {
    rcFile = path.join(os.homedir(), ".bashrc");
  } else {
    // Try to detect
    if (await fileExists(path.join(os.homedir(), ".zshrc"))) {
      rcFile = path.join(os.homedir(), ".zshrc");
    } else if (await fileExists(path.join(os.homedir(), ".bashrc"))) {
      rcFile = path.join(os.homedir(), ".bashrc");
    } else {
      throw new Error("Could not detect shell. Please manually add the wrapper to your shell config.");
    }
  }

  try {
    const existingContent = await fs.readFile(rcFile, "utf8");
    if (existingContent.includes("cdp() {")) {
      console.log("CDP wrapper already exists in", rcFile);
      return;
    }
  } catch {
    // File doesn't exist, will create new
  }

  await fs.appendFile(rcFile, SHELL_WRAPPER_CONTENT + "\n", "utf8");
  console.log(`✅ Added CDP wrapper to ${rcFile}`);
  console.log("Please run 'source " + rcFile + "' or restart your terminal.");
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
