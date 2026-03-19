# cdp

cdp ("CD Project") saves paths to directories you work with often.
Instead of `cd /long/path/to/your/project`, type `cdp project`.

Explicit naming. No fuzzy matching. No learning period. Just names you choose.

## Why cdp?

Tools like zoxide learn your habits over time. cdp takes a different approach:

- **You name it** — `cdp init api` saves the current directory as "api". No guessing.
- **It just works** — No frequency tracking, no database to maintain, no fuzzy heuristics.
- **Team-ready** — Export and import configs. Share project shortcuts across machines.
- **Minimal** — Single config file, atomic writes, no dependencies beyond Node.

## Quick Start

```sh
cd /path/to/project
cdp init myproject    # saves "myproject" -> /path/to/project

cdp myproject         # prints /path/to/project
cd myproject          # now you're there
```

## Installation

### Prerequisites

- Node.js >= 20
- macOS, Linux, or Windows with WSL

### From source

```sh
git clone https://github.com/your-username/cdp-cli.git
cd cdp-cli
npm install
npm run build
npm link
```

### Shell setup

cdp outputs a path. It needs a shell wrapper to change directories for you.

```sh
cdp setup
source ~/.zshrc    # or source ~/.bashrc
```

For tab completion:

```sh
cdp setup --completion
source ~/.zshrc    # or source ~/.bashrc
```

## Usage

### Save a project

```sh
cd /var/www/api
cdp init api
```

cdp infers the name from the directory if you omit it:

```sh
cdp init          # saves as "api" if directory is /var/www/api
```

### Jump to a project

```sh
cdp api
```

With the shell wrapper, `cd` happens automatically. Without it, cdp prints the path:

```sh
cdp api           # with wrapper: changes directory
                  # without wrapper: outputs /var/www/api
```

### List all projects

```sh
cdp list
```

Output:

```
api       /var/www/api
web       /var/www/web
```

### Remove a project

```sh
cdp remove old-project
```

### Rename a project

```sh
cdp rename api backend-api
```

### Interactive mode

Run `cdp` with no arguments:

```sh
cdp
```

Shows a numbered list of saved projects. Select by number or name.

### Export config

```sh
cdp export > backup.json
```

Pipe to share across machines:

```sh
cdp export | ssh other-machine 'cdp import'
```

### Import config

```sh
cdp import backup.json
```

Or from stdin:

```sh
cat backup.json | cdp import
```

### Diagnose issues

```sh
cdp doctor
```

Checks config file, saved paths, and shell integration.

## Shell Wrapper

The wrapper intercepts `cdp` calls and runs `cd` on the output. Here's what it does:

```sh
cdp() {
  if [ "$#" -eq 0 ]; then
    # Interactive mode
    # ...
  fi

  case "$1" in
    init|list|remove|rename|doctor|export|import|help|--help|-h|--version|-v|setup)
      command cdp "$@"
      ;;
    *)
      cd "$(command cdp "$@")" || return 1
      ;;
  esac
}
```

Add it manually to `~/.zshrc` or `~/.bashrc` if `cdp setup` doesn't work.

## Configuration

Config lives at `~/.cdp/projects.json`.

```json
{
  "version": 1,
  "projects": {
    "api": {
      "path": "/var/www/api",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

Atomic writes prevent corruption if the process is interrupted.

## Troubleshooting

### "cdp isn't changing directories"

The shell wrapper is missing or not loaded.

```sh
grep "cdp()" ~/.zshrc
```

If empty, run `cdp setup` again and `source ~/.zshrc`.

### "Project not found"

```sh
cdp list           # check what exists
cdp doctor         # diagnose config and paths
```

### "Config corrupted"

```sh
cdp export > backup.json    # save what you have
rm ~/.cdp/projects.json     # delete config
cdp init myproject          # recreate
```

### Interactive mode not working

Make sure the shell wrapper includes the interactive selection block. If you added `cdp()` manually, copy the full function from the installation section.

## Commands

| Command | Description |
|---------|-------------|
| `cdp init [name]` | Save current directory |
| `cdp list` | List all saved projects |
| `cdp remove <name>` | Remove a project |
| `cdp rename <old> <new>` | Rename a project |
| `cdp setup [--completion]` | Add shell wrapper |
| `cdp doctor` | Diagnose config and integration |
| `cdp export` | Export config to stdout |
| `cdp import [file]` | Import config from file or stdin |
| `cdp <name>` | Jump to project |

## License

MIT
