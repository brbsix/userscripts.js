#!/bin/bash
#
# Generate userscript metadata file

set -eo pipefail
shopt -s extglob

if (( $# == 0 )); then
    readarray -t files < <(git ls-tree --name-only master ./*.user.js)
else
    files=("$@")
fi

for file in "${files[@]}"; do
    awk '$0 == "// ==UserScript==",$0 == "// ==/UserScript=="' "$file" > "${file%%?(.user).js}.meta.js"
done
