/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { expect, test } from "../mocking/setup";

test("can navigate to diagnostics page", async ({ page }) => {
  await page.goto("/diagnostics");

  await expect(page).toHaveURL(/.*diagnostics/);
  await expect(page.locator("h1")).toContainText(/diagnostics/i);
});

test("can navigate to game page", async ({ page }) => {
  await page.goto("/game");

  await expect(page).toHaveURL(/.*game/);
  await expect(page.getByTestId("game-map")).toBeVisible();
});

test("root path shows game", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("game-map")).toBeVisible();
});
