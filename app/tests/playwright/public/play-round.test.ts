/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { expect, test } from "../mocking/setup";
import { playThroughRound } from "../helpers/map";

test("can play a complete round without authentication", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/");

  await expect(page.getByTestId("game-map")).toBeVisible();

  await page.getByRole("button", { name: /play solo/i }).click();

  await expect(page.getByRole("button", { name: /confirm/i })).toBeVisible({
    timeout: 10000,
  });

  await playThroughRound(page);
});
