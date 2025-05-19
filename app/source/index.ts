/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import "./library/root.css";
import "./third-party/leaflet.css";
import "./third-party/goatcounter.js";
import { initializeErrorReporting } from "./utilities/setUpErrorReporting.js";

initializeErrorReporting();

import App from "./library/App.svelte";
import FatalErrorDisplay from "./library/FatalErrorDisplay.svelte";

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
    props: {
      error: e,
    },
    target: document.body,
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
