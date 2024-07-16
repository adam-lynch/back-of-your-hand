import "./utilities/goatcounter.js";
import { initializeErrorReporting } from "./utilities/setUpErrorReporting.js";

initializeErrorReporting();

import App from "./App.svelte";
import FatalErrorDisplay from "./FatalErrorDisplay.svelte";

let app;

const onUnhandledError = (e) => {
  // @ts-ignore
  if (!isProduction) {
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

export default app;
