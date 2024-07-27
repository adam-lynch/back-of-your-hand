#!/bin/sh
set -e

COMMIT_ID=$(node -e "console.log(require('git-commit-id')())")

echo "Creating Sentry release (COMMIT_ID: $COMMIT_ID)..."

npx @sentry/cli releases new $COMMIT_ID --org back-of-your-hand --project javascript
npx @sentry/cli releases files $COMMIT_ID upload-sourcemaps ./public/build --org back-of-your-hand --project javascript --url-prefix '~/build'
# npx @sentry/cli releases files $COMMIT_ID upload ./ --ignore-file .gitignore --org back-of-your-hand --project javascript

npx @sentry/cli releases set-commits $COMMIT_ID --commit "adam-lynch/back-of-your-hand@$COMMIT_ID" --org back-of-your-hand

npx @sentry/cli releases finalize $COMMIT_ID --org back-of-your-hand
npx @sentry/cli releases deploys $COMMIT_ID new -e production --org back-of-your-hand

echo "Sentry release created!"