# This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
# If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
# 
# Project: Back Of Your Hand (https://backofyourhand.com)
# Repository: https://github.com/adam-lynch/back-of-your-hand
# Copyright © 2024 Adam Lynch (https://adamlynch.com)

#!/bin/sh
set -e

COMMIT_ID=$(node -e "console.log(require('git-commit-id')())")

echo "Creating Sentry release (COMMIT_ID: $COMMIT_ID)..."

npx @sentry/cli releases new $COMMIT_ID --org back-of-your-hand --project javascript
npx @sentry/cli releases files $COMMIT_ID upload-sourcemaps ./dist --org back-of-your-hand --project javascript --url-prefix '~/assets'

npx @sentry/cli releases set-commits $COMMIT_ID --commit "adam-lynch/back-of-your-hand@$COMMIT_ID" --org back-of-your-hand

npx @sentry/cli releases finalize $COMMIT_ID --org back-of-your-hand
npx @sentry/cli releases deploys $COMMIT_ID new -e production --org back-of-your-hand

echo "Sentry release created!"