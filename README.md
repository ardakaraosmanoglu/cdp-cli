# CDP CLI

> Fast project directory switcher for terminal

CDP (CD Project) is a CLI tool that lets you quickly switch between project directories without typing full paths.

## Features

- Save project paths with custom names
- Quick directory switching with `cdp <name>`
- Auto-infer project name from folder
- Works with bash and zsh
- Atomic file operations for config safety

## Quick Start

```bash
npm install
npm run build
npm link
cdp setup
source ~/.zshrc  # or ~/.bashrc
```

## Usage

### Save a project
```bash
cd /var/www/ecommerce-api
cdp init api
```

### Switch directories
```bash
cdp api
# Now in /var/www/ecommerce-api
```

### List all projects
```bash
cdp list
```

### Remove a project
```bash
cdp remove old-project
```

### Rename a project
```bash
cdp rename api backend-api
```

## Requirements

- Node.js >= 20

## License

MIT
