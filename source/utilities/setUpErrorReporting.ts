/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import * as Sentry from "@sentry/browser";
import ignoreError from "./ignoreError";

export const initializeErrorReporting = () => {
  if (import.meta.env.DEV) {
    return;
  }
  ignoreError(() =>
    Sentry.init({
      autoSessionTracking: false,
      beforeSend(event) {
        if (event.exception) {
          return event;
        }
        return null;
      },
      dsn: "https://5218ea8159eb46fe953d19a4e7530e94@o1226957.ingest.sentry.io/6372553",
      environment: "production",
      // @ts-expect-error set in vite config
      release: COMMIT_ID,
      tracesSampleRate: 0,
    }),
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reportError = (error: any) => {
  if (import.meta.env.DEV) {
    return;
  }
  ignoreError(() => Sentry.captureException(error));
};
