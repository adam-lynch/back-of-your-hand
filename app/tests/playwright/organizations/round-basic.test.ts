/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { expect, test } from "../mocking/setup";
import { example1Users, organizations } from "../fixtures/test-users";
import { logIn } from "../helpers/auth";
import { playThroughRound } from "../helpers/map";

const org = organizations.example1;
const user = example1Users.standardUser;

test.describe("Round Basic Flow", () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page, org, user);
  });

  test("game page loads with map", async ({ page }) => {
    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });
  });

  test("game page shows context panel", async ({ page }) => {
    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });

    const contextPanel = page.locator("#context-panel, [class*='context']");
    await expect(contextPanel.first()).toBeVisible({ timeout: 10000 });
  });

  test("can start a solo game", async ({ page }) => {
    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });

    const playSoloButton = page.getByRole("button", { name: /play solo/i });
    await expect(playSoloButton).toBeVisible({ timeout: 10000 });

    await playSoloButton.click();

    const confirmButton = page.getByRole("button", { name: /confirm/i });
    await expect(confirmButton).toBeVisible({ timeout: 10000 });
  });

  test("can start and complete a round", async ({ page }) => {
    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: /play solo/i }).click();

    const confirmButton = page.getByRole("button", { name: /confirm/i });
    await expect(confirmButton).toBeVisible({ timeout: 10000 });

    await playThroughRound(page);
  });

  test("can start a new round after completing one", async ({ page }) => {
    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: /play solo/i }).click();

    const confirmButton = page.getByRole("button", { name: /confirm/i });
    await expect(confirmButton).toBeVisible({ timeout: 10000 });

    await playThroughRound(page);

    await page.getByRole("button", { name: /start a new round/i }).click();

    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });
    await expect(confirmButton).toBeVisible({ timeout: 10000 });
  });
});
