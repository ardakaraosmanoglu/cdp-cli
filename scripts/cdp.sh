#!/usr/bin/env bash

# cdp Shell Wrapper

# Node.js PWD'yi doğrudan değiştiremediği için bu fonksiyon shell profilinize eklenmelidir.

cdp() {
if [ "$#" -eq 0 ]; then
command cdp list
return
fi

case "$1" in
init|list|remove|rename|doctor|export|import|help|--help|-h|--version|-v)
command cdp "$@"
;;
*)
local target
target="$(command cdp "$@")" || return 1
cd "$target" || return 1
;;
esac
}
