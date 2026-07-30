#!/bin/sh

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

BLOCKED=0

for FILE in $STAGED_FILES; do
  if [ ! -f "$FILE" ]; then
    continue
  fi

  CHANGES=$(git diff --cached -- "$FILE" | sed -n '/^+[^+]/p')
  if [ -z "$CHANGES" ]; then
    continue
  fi

  MATCH=$(echo "$CHANGES" | grep -nE \
    -e 'AIza[0-9A-Za-z_-]{35}' \
    -e 'sk-[a-zA-Z0-9]{20,}' \
    -e 'gh[pousr]_[a-zA-Z0-9]{36}' \
    -e 'xox[baprs]-[0-9a-zA-Z-]{10,}' \
    -e '-----BEGIN\s+(RSA|OPENSSH|EC|DSA|PGP)?\s*PRIVATE\s*KEY-----' \
    -e '["'\''](?:AIza|sk-|gh[pousr]_|xox[baprs]-)[0-9a-zA-Z_-]{10,}["'\'']' \
    2>/dev/null)

  if [ -n "$MATCH" ]; then
    printf "${RED}[SECURITY]${NC} Possible secrets detected in ${YELLOW}$FILE${NC}\n"
    echo "$MATCH" | while IFS= read -r LINE; do
      LINE_NUM=$(echo "$LINE" | cut -d: -f1)
      CONTENT=$(echo "$LINE" | cut -d: -f2- | sed 's/\(.\{8\}\).*/\1********/')
      printf "  +:%s: %s\n" "$LINE_NUM" "$CONTENT"
    done
    BLOCKED=1
  fi
done

if [ "$BLOCKED" -eq 1 ]; then
  printf "\n${RED}✖ Commit BLOCKED:${NC} Remove secrets from staged files before committing.\n"
  printf "  To bypass this check: ${YELLOW}git commit --no-verify${NC}\n"
  exit 1
fi

exit 0
