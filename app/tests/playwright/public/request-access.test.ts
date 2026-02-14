/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { expect, test } from "../mocking/setup";

test("can request organization access", async ({ page }) => {
  await page.goto("/game");

  await page.getByRole("button", { name: /configure/i }).click();
  await page.getByRole("button", { name: /custom shapes/i }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await dialog.locator('input[name="name"]').fill("Test User");
  await dialog.locator('input[name="email"]').fill("test@example.com");
  await dialog
    .locator('input[name="organization"]')
    .fill("Test Fire Department");
  await dialog.locator('select[name="userCount"]').selectOption("2-4");

  await dialog.getByRole("button", { name: /request access/i }).click();

  await expect(page.getByText("Access requested!")).toBeVisible();
});
