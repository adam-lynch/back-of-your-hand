/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { defineConfig, devices } from "@playwright/test";

const backend = process.env.PLAYWRIGHT_BACKEND || "mock";
const shouldRecordMocks = process.env.PLAYWRIGHT_SHOULD_RECORD_MOCKS === "true";
const isLocalBackend = backend === "local";
const isProduction = backend === "production";

export default defineConfig({
  globalSetup: "./tests/playwright/global-setup.ts",
  outputDir: "./tests/playwright/test-results",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  retries: shouldRecordMocks ? 0 : 1,
  testDir: "./tests/playwright",
  testMatch: isProduction ? "public/**/*.test.ts" : undefined,
  timeout: 30_000,
  use: {
    baseURL: isProduction
      ? "https://backofyourhand.com"
      : "https://local-backofyourhand.com:5173",
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  webServer: isProduction
    ? undefined
    : {
        command: "npm run dev -- --host",
        url: "https://local-backofyourhand.com:5173",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        ignoreHTTPSErrors: true,
      },

  workers: isLocalBackend ? 1 : "100%",
});
