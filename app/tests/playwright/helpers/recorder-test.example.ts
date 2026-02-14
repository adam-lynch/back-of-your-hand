/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { test } from "../mocking/setup";

/*
 * Example test to demonstrate the recording workflow.
 *
 * Recording is automatic — set PLAYWRIGHT_SHOULD_RECORD_MOCKS=true
 * and run your tests. The fixture in setup.ts handles everything.
 *
 * To test recording:
 * 1. Reset backend: cd ../back-of-your-hand--backend && (rm compose/local/django/__initial_setup_done || echo ".") && docker-compose down -v && docker-compose up --build -d
 * 2. Run: PLAYWRIGHT_BACKEND=local PLAYWRIGHT_SHOULD_RECORD_MOCKS=true playwright test tests/playwright/helpers/recorder-test.example.ts
 * 3. Check generated mocks in tests/playwright/mocking/mocks/helpers/
 * 4. Review with: git diff tests/playwright/mocking/mocks/
 *
 * This file is not included in the regular test runs.
 */

test.skip("example: record API calls", async ({ page }) => {
  await page.goto("/");
});

test.skip("example: record organization API calls", async ({ page }) => {
  await page.goto("https://example1.local-backofyourhand.com:5173");
});
