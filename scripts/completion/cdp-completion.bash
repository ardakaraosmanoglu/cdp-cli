#!/usr/bin/env bash
# CDP CLI - Bash Completion
# Add to ~/.bashrc: source /path/to/cdp/scripts/completion/cdp-completion.bash

_cdp() {
  local cur prev words cword
  _init_completion || return

  # Get project names from config
  local projects
  projects=$(cdp list 2>/dev/null | awk '{print $1}' | tr '\n' ' ')

  case "${words[1]}" in
    init|remove|rename)
      return
      ;;
    list|doctor|export|setup)
      return
      ;;
    *)
      COMPREPLY=($(compgen -W "${projects} init list remove rename doctor export import setup --help -h -V --version" -- "$cur"))
      ;;
  esac
}

complete -F _cdp cdp
