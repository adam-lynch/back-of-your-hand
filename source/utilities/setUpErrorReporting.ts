import * as Sentry from "@sentry/browser";
import ignoreError from "./ignoreError";

export const initializeErrorReporting = () => {
  // @ts-ignore
  if (!isProduction) {
    return;
  }
  ignoreError(() =>
    Sentry.init({
      dsn: "https://5218ea8159eb46fe953d19a4e7530e94@o1226957.ingest.sentry.io/6372553",
      environment: "production",
      // @ts-ignore
      release: COMMIT_ID,
      tracesSampleRate: 0,
    })
  );
};

export const reportError = (error: Error) => {
  // @ts-ignore
  if (!isProduction) {
    return;
  }
  ignoreError(() => Sentry.captureException(error));
};
