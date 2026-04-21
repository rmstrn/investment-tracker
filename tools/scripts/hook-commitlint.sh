#!/usr/bin/env sh
# commit-msg hook: runs commitlint against the message file.
#
# TD-R083 pattern — probe each runner via a safe `--version`
# invocation BEFORE delegating to it, then `exec` the real
# commitlint call so lint failures propagate (no `set -e` to
# swallow them, no `2>/dev/null` masking real lint output).
#
# The old version wrapped everything in `set -e` + a single
# `if command -v pnpm; then pnpm exec commitlint ...; fi` chain,
# which meant `ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL` (pnpm alive,
# commitlint not installed) killed the shell before reaching the
# fallback branches. Fresh CC worktrees without `node_modules/`
# hit this three sessions in a row.

msg_file="$1"
[ -z "$msg_file" ] && exit 0

# Try pnpm exec — works in a monorepo with hoisted deps.
if command -v pnpm >/dev/null 2>&1 \
    && pnpm exec commitlint --version >/dev/null 2>&1; then
    exec pnpm exec commitlint --edit "$msg_file"
fi

# Fallback: local bin from a flat npm install.
if [ -x node_modules/.bin/commitlint ]; then
    exec node_modules/.bin/commitlint --edit "$msg_file"
fi

# Fallback: npx, strictly --no-install so a missing package does
# not trigger a 30-second network fetch mid-commit.
if command -v npx >/dev/null 2>&1 \
    && npx --no-install commitlint --version >/dev/null 2>&1; then
    exec npx --no-install commitlint --edit "$msg_file"
fi

echo "hook-commitlint: no commitlint runner available — skipping"
exit 0
