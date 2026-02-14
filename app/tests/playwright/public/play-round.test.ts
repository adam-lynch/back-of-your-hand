/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { expect, test } from "../mocking/setup";

test("can play a complete round without authentication", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("game-map")).toBeVisible();

  await page.getByRole("button", { name: /play solo/i }).click();

  const mapElement = page.getByTestId("game-map");
  const confirmButton = page.getByRole("button", { name: /confirm/i });
  await expect(confirmButton).toBeVisible({ timeout: 10000 });

  const mapBox = await mapElement.boundingBox();
  if (mapBox) {
    await page.mouse.click(
      mapBox.x + mapBox.width / 2,
      mapBox.y + mapBox.height / 2,
    );
  }

  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();

  const nextButton = page.getByRole("button", { name: /next/i });
  const startNewRoundButton = page.getByRole("button", {
    name: /start a new round/i,
  });

  await expect(nextButton.or(startNewRoundButton)).toBeVisible({
    timeout: 10000,
  });

  while (await nextButton.isVisible()) {
    await nextButton.click();

    await expect(confirmButton).toBeVisible({ timeout: 10000 });

    const currentMapBox = await mapElement.boundingBox();
    if (currentMapBox) {
      await page.mouse.click(
        currentMapBox.x + currentMapBox.width / 2,
        currentMapBox.y + currentMapBox.height / 2,
      );
    }

    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();

    await expect(nextButton.or(startNewRoundButton)).toBeVisible({
      timeout: 10000,
    });
  }

  await expect(startNewRoundButton).toBeVisible();
});
