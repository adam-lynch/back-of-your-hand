import "./root.css";
import "./lib/third-party/leaflet.css";
import "./lib/third-party/goatcounter.js";
import { initializeErrorReporting } from "./lib/utilities/setUpErrorReporting.js";

initializeErrorReporting();

import App from "./lib/App.svelte";
import FatalErrorDisplay from "./lib/FatalErrorDisplay.svelte";

let app: App | FatalErrorDisplay;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onUnhandledError = (e: any) => {
  if (import.meta.env.DEV) {
    console.error("Unhandled error");
    console.error(e);
  }

  if (app) {
    app.$set({ unhandledError: (e && (e.error || e.reason)) || e });
    return;
  }

  app = new FatalErrorDisplay({
    target: document.body,
    props: {
      error: e,
    },
  });
};

window.addEventListener("error", onUnhandledError);
const originalUnhandledRejection = window.onunhandledrejection;
window.onunhandledrejection = (e) => {
  onUnhandledError(e);
  if (originalUnhandledRejection) {
    originalUnhandledRejection.call(window, e);
  }
};

// Hide "add to homescreen" prompt (it covers UI and is confusing)
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
});

try {
  app = new App({
    target: document.body,
  });
} catch (e) {
  onUnhandledError(e);
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default app;
