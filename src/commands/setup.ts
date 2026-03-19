import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const SHELL_WRAPPER_CONTENT = `
# CDP (CD Project) - Fast Project Switcher
cdp() {
  if [ "$#" -eq 0 ]; then
    # Interactive mode - show project list for selection
    local projects
    local selected
    projects=($(command cdp list 2>/dev/null | awk '{print $1}'))
    
    if [ \${#projects[@]} -eq 0 ]; then
      echo "No projects saved. Use 'cdp init [name]' to add one."
      return 1
    fi
    
    echo "Select a project:"
    select selected in "\${projects[@]}"; do
      if [ -n "$selected" ]; then
        cd "$(command cdp "$selected")" || return 1
        return 0
      fi
    done
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

const ZSH_COMPLETION_CONTENT = `
# CDP CLI - Zsh Completion
_cdp_projects() {
  local -a projects
  projects=($(cdp list 2>/dev/null | awk '{print $1}'))
  _describe 'projects' projects
}

_cdp() {
  local -a commands
  commands=(
    'init:Save current directory as a project'
    'list:List all saved projects'
    'remove:Remove a saved project'
    'rename:Rename a saved project'
    'setup:Add shell wrapper to shell config'
    'doctor:Diagnose config and integration'
    'export:Export config as JSON'
    'import:Import config from file'
  )

  _arguments -C \\
    '-V[Show version number]' \\
    '--version[Show version number]' \\
    '-h[Show help]' \\
    '--help[Show help]' \\
    '1: :_cdp_commands' \\
    '*::arg: _args'

  case $line[1] in
    init)
      _arguments '1:project name:_files -/'
      ;;
    remove|rename)
      _arguments '1:project:_cdp_projects'
      ;;
    rename)
      _arguments '2:new name:'
      ;;
    import)
      _arguments '1:file:_files'
      ;;
  esac
}

_cdp_commands() {
  _describe 'commands' commands
}

_args() {
  case $line[1] in
    remove|rename)
      _cdp_projects
      ;;
  esac
}

compdef _cdp cdp
`;

const BASH_COMPLETION_CONTENT = `
# CDP CLI - Bash Completion
_cdp() {
  local cur prev words cword
  _init_completion || return

  local projects
  projects=$(cdp list 2>/dev/null | awk '{print $1}' | tr '\\n' ' ')

  case "\${words[1]}" in
    init|remove|rename)
      return
      ;;
    list|doctor|export|setup)
      return
      ;;
    *)
      COMPREPLY=($(compgen -W "\${projects} init list remove rename doctor export import setup --help -h -V --version" -- "$cur"))
      ;;
  esac
}

complete -F _cdp cdp
`;

interface SetupOptions {
  completion?: boolean;
}

export async function setupCommand(options?: SetupOptions): Promise<void> {
  const shell = process.env.SHELL || "";
  let rcFile: string;
  let completionContent: string;
  
  if (shell.includes("zsh")) {
    rcFile = path.join(os.homedir(), ".zshrc");
    completionContent = ZSH_COMPLETION_CONTENT;
  } else if (shell.includes("bash")) {
    rcFile = path.join(os.homedir(), ".bashrc");
    completionContent = BASH_COMPLETION_CONTENT;
  } else {
    if (await fileExists(path.join(os.homedir(), ".zshrc"))) {
      rcFile = path.join(os.homedir(), ".zshrc");
      completionContent = ZSH_COMPLETION_CONTENT;
    } else if (await fileExists(path.join(os.homedir(), ".bashrc"))) {
      rcFile = path.join(os.homedir(), ".bashrc");
      completionContent = BASH_COMPLETION_CONTENT;
    } else {
      throw new Error("Could not detect shell. Please manually add the wrapper to your shell config.");
    }
  }

  const existingContent = await fs.readFile(rcFile, "utf8").catch(() => "");

  // Add shell wrapper if not present
  if (!existingContent.includes("cdp() {")) {
    await fs.appendFile(rcFile, SHELL_WRAPPER_CONTENT + "\n", "utf8");
    console.log(`✅ Added CDP wrapper to ${rcFile}`);
  } else {
    console.log(`ℹ️  CDP wrapper already exists in ${rcFile}`);
  }

  // Add completion if requested
  if (options?.completion && !existingContent.includes("_cdp()") && !existingContent.includes("_cdp_projects")) {
    await fs.appendFile(rcFile, completionContent + "\n", "utf8");
    console.log(`✅ Added shell completion to ${rcFile}`);
  }

  console.log("\nPlease run 'source " + rcFile + "' or restart your terminal.");
  console.log("\nRun 'cdp setup --completion' to also enable tab completion.");
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
