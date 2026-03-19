# CDP CLI - Usage Guide

## Installation

### Prerequisites
- Node.js >= 20

### Setup Steps

1. **Install dependencies and build:**
   ```bash
   npm install
   npm run build
   ```

2. **Link globally:**
   ```bash
   npm link
   ```

3. **Configure shell wrapper:**
   ```bash
   cdp setup
   ```
   
   Then restart your terminal or run:
   ```bash
   source ~/.zshrc  # or ~/.bashrc
   ```

## Commands

### `cdp init [name]`
Save the current directory as a named project.

```bash
# Save with custom name
cd /var/www/ecommerce-api
cdp init api

# Auto-infer name from folder
cd /projects/my-app
cdp init
```

### `cdp list`
Display all saved projects.

```bash
cdp list
# Output:
# api          /var/www/ecommerce-api
# my-app       /projects/my-app
```

### `cdp <project>`
Switch to a saved project directory.

```bash
cdp api
# Changes to: /var/www/ecommerce-api
```

### `cdp remove <name>`
Remove a project from the registry.

```bash
cdp remove old-project
# Output: 🗑️ Removed project 'old-project'.
```

### `cdp rename <oldName> <newName>`
Rename a saved project.

```bash
cdp rename api backend-api
# Output: ✏️ Renamed 'api' -> 'backend-api'.
```

### `cdp setup`
Automatically add the shell wrapper to your shell config (`~/.zshrc` or `~/.bashrc`).

```bash
cdp setup
```

## Manual Shell Setup

If you prefer to set up manually, add this to your `~/.zshrc` or `~/.bashrc`:

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

## Configuration

Projects are stored in `~/.cdp/projects.json`:

```json
{
  "version": 1,
  "projects": {
    "api": {
      "path": "/var/www/ecommerce-api",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## How It Works

Node.js CLI tools run in their own subprocess and cannot directly change the parent shell's working directory. CDP solves this with a two-layer architecture:

1. **CLI Layer**: Stores/retrieves project paths from the config file
2. **Shell Wrapper**: A bash/zsh function that captures the path and executes `cd`
