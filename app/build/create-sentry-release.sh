# This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
# If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
# 
# Project: Back Of Your Hand (https://backofyourhand.com)
# Repository: https://github.com/adam-lynch/back-of-your-hand
# Copyright © 2024 Adam Lynch (https://adamlynch.com)

#!/bin/sh
set -e

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/../.." && pwd)
APP_DIR="$REPO_ROOT/app"
DIST_DIR="$REPO_ROOT/dist"
SENTRY_CLI_VERSION="${SENTRY_CLI_VERSION:-2}"
SENTRY_CLI="npx @sentry/cli@${SENTRY_CLI_VERSION}"

if [ ! -d "$DIST_DIR" ]; then
  echo "Dist directory not found: $DIST_DIR" >&2
  exit 1
fi

COMMIT_ID=$(node -e "console.log(require('$APP_DIR/node_modules/git-commit-id')({ cwd: '$REPO_ROOT' }))")

echo "Creating Sentry release (COMMIT_ID: $COMMIT_ID)..."

$SENTRY_CLI releases new $COMMIT_ID --org back-of-your-hand --project javascript
$SENTRY_CLI releases files $COMMIT_ID upload-sourcemaps "$DIST_DIR" --org back-of-your-hand --project javascript --url-prefix '~/assets'

$SENTRY_CLI releases set-commits $COMMIT_ID --commit "adam-lynch/back-of-your-hand@$COMMIT_ID" --org back-of-your-hand

$SENTRY_CLI releases finalize $COMMIT_ID --org back-of-your-hand
$SENTRY_CLI releases deploys $COMMIT_ID new -e production --org back-of-your-hand

echo "Sentry release created!"
