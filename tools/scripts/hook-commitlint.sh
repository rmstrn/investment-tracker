#!/usr/bin/env sh
# commit-msg hook: runs commitlint against the message file.
# Falls back through pnpm → local node_modules → npx. Skips with a warning
# if none are available.

set -e

msg_file="$1"
[ -z "$msg_file" ] && exit 0

if command -v pnpm >/dev/null 2>&1; then
  pnpm exec commitlint --edit "$msg_file"
elif [ -x node_modules/.bin/commitlint ]; then
  node_modules/.bin/commitlint --edit "$msg_file"
elif command -v npx >/dev/null 2>&1; then
  npx --no-install commitlint --edit "$msg_file"
else
  echo "hook-commitlint: no commitlint runner available — skipping"
  exit 0
fi
