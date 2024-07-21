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
      // TODO
      release: COMMIT_ID,
      tracesSampleRate: 0,
    })
  );
};

export const reportError = (error: Error) => {
  if (import.meta.env.DEV) {
    return;
  }
  ignoreError(() => Sentry.captureException(error));
};
