/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export async function clickMapCenter(mapElement: Locator): Promise<void> {
  const mapBox = await mapElement.boundingBox();
  if (!mapBox) {
    throw new Error("Map element not found or has no bounding box");
  }
  await mapElement
    .page()
    .mouse.click(mapBox.x + mapBox.width / 2, mapBox.y + mapBox.height / 2);
}

/**
 * Plays through all questions in a round by clicking the map center and
 * confirming each answer until the "start a new round" button appears.
 */
export async function playThroughRound(page: Page): Promise<void> {
  const mapElement = page.getByTestId("game-map");
  const confirmButton = page.getByRole("button", { name: /confirm/i });
  const nextButton = page.getByRole("button", { name: /next/i });
  const startNewRoundButton = page.getByRole("button", {
    name: /start a new round/i,
  });

  await clickMapCenter(mapElement);
  await expect(confirmButton).toBeEnabled({ timeout: 5000 });
  await confirmButton.click();

  const MAX_ITERATIONS = 30;
  let iterationCount = 0;

  while (iterationCount < MAX_ITERATIONS) {
    iterationCount++;

    await expect(nextButton.or(startNewRoundButton)).toBeVisible({
      timeout: 10000,
    });

    const isRoundComplete = await startNewRoundButton
      .isVisible({ timeout: 100 })
      .catch(() => false);

    if (isRoundComplete) {
      break;
    }

    await nextButton.click();

    await clickMapCenter(mapElement);
    await expect(confirmButton).toBeEnabled({ timeout: 5000 });
    await confirmButton.click();
  }

  if (iterationCount >= MAX_ITERATIONS) {
    throw new Error(
      `Round did not complete after ${MAX_ITERATIONS} iterations`,
    );
  }

  await expect(startNewRoundButton).toBeVisible({ timeout: 10000 });
}
