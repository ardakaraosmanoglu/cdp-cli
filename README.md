# CDP CLI

> Fast project directory switcher for terminal

CDP (CD Project) is a CLI tool that lets you quickly switch between project directories without typing full paths.

## Features

- Save project paths with custom names
- Quick directory switching with `cdp <name>`
- Auto-infer project name from folder
- Works with bash and zsh
- Atomic file operations for config safety
- Config export/import for team sharing
- Doctor command for troubleshooting

## Requirements

- Node.js >= 20
- macOS, Linux, or Windows with WSL

## Installation

```bash
git clone https://github.com/your-username/cdp-cli.git
cd cdp-cli
npm install
npm run build
npm link
cdp setup
source ~/.zshrc  # or source ~/.bashrc
```

## Shell Integration

CDP needs a shell wrapper to change directories. The `cdp setup` command adds it automatically, or add manually:

### zsh (~/.zshrc)
```bash
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
```

### bash (~/.bashrc)
Same as above, add to `~/.bashrc`.

## Usage

### Save a project
```bash
cd /var/www/ecommerce-api
cdp init api
# Saved 'api' -> /var/www/ecommerce-api
```

### Switch directories
```bash
cdp api
# Now in /var/www/ecommerce-api
```

### List all projects
```bash
cdp list
# api      /var/www/ecommerce-api
# web      /var/www/web
```

### Remove a project
```bash
cdp remove old-project
# Removed 'old-project'.
```

### Rename a project
```bash
cdp rename api backend-api
# Renamed 'api' -> 'backend-api'.
```

### Export config
```bash
cdp export > backup.json
```

### Import config
```bash
cdp import backup.json
# or from stdin:
cat backup.json | cdp import
```

### Diagnose issues
```bash
cdp doctor
```

## Troubleshooting

### "Why isn't CDP changing directories?"

CDP requires the shell wrapper. Make sure you added it to your shell config and ran `source`:

```bash
# Check if wrapper is installed
grep "cdp()" ~/.zshrc

# If not, run setup again
cdp setup
source ~/.zshrc
```

### "Project not found"
```bash
# Check your saved projects
cdp list

# Verify the project exists
cdp doctor
```

### "Config corrupted"
```bash
# Backup and reset
cdp export > backup.json
rm ~/.cdp/projects.json
cdp init my-project
```

## Configuration

Projects are stored in `~/.cdp/projects.json`:
```json
{
  "version": 1,
  "projects": {
    "api": {
      "path": "/var/www/api",
      "createdAt": "2026-03-19T10:00:00.000Z",
      "updatedAt": "2026-03-19T10:00:00.000Z"
    }
  }
}
```

## License

MIT
