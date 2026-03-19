#!/usr/bin/env zsh
# CDP CLI - Zsh Completion
# Add to ~/.zshrc: source /path/to/cdp/scripts/completion/cdp-completion.zsh

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

  _arguments -C \
    '-V[Show version number]' \
    '--version[Show version number]' \
    '-h[Show help]' \
    '--help[Show help]' \
    '1: :_cdp_commands' \
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
