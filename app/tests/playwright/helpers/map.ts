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

export async function getStreetName(page: Page): Promise<string> {
  const streetNameElement = page.locator(".street-name");
  await expect(streetNameElement).toBeVisible({ timeout: 10000 });
  const text = await streetNameElement.textContent();
  if (!text) {
    throw new Error("Street name element is empty");
  }
  return text.trim();
}

export async function clickMapCenter(mapElement: Locator): Promise<void> {
  await expect(mapElement).not.toHaveAttribute("data-is-zooming", {
    timeout: 10000,
  });
  const mapBox = await mapElement.boundingBox();
  if (!mapBox) {
    throw new Error("Map element not found or has no bounding box");
  }
  await mapElement
    .page()
    .mouse.click(mapBox.x + mapBox.width / 2, mapBox.y + mapBox.height / 2);
}

export async function playThroughRound(
  page: Page,
  {
    shouldCollectStreetNames = false,
    maxIterations = 30,
  }: {
    shouldCollectStreetNames?: boolean;
    maxIterations?: number;
  } = {},
): Promise<string[]> {
  const streetNames: string[] = [];
  const mapElement = page.getByTestId("game-map");
  const confirmButton = page.getByRole("button", { name: /confirm/i });
  const nextButton = page.getByRole("button", { name: /next/i });
  const startNewRoundButton = page.getByRole("button", {
    name: /start a new round/i,
  });

  if (shouldCollectStreetNames) {
    streetNames.push(await getStreetName(page));
  }
  await clickMapCenter(mapElement);
  await expect(confirmButton).toBeEnabled({ timeout: 5000 });
  await confirmButton.click();

  for (let i = 0; i < maxIterations; i++) {
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

    if (shouldCollectStreetNames) {
      streetNames.push(await getStreetName(page));
    }
    await clickMapCenter(mapElement);
    await expect(confirmButton).toBeEnabled({ timeout: 5000 });
    await confirmButton.click();
  }

  await expect(startNewRoundButton).toBeVisible({ timeout: 10000 });

  return streetNames;
}

export async function clickStartNewRound(page: Page): Promise<void> {
  await page.getByRole("button", { name: /start a new round/i }).click();
  await expect(page.getByRole("button", { name: /confirm/i })).toBeVisible({
    timeout: 120000,
  });
}
