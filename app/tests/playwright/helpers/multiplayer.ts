/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { playThroughRound } from "./map";

export async function startMultiplayerAsLeader(page: Page): Promise<string> {
  const multiplayerButton = page.getByRole("button", {
    name: /^multiplayer$/i,
  });
  const urlElement = page.locator(".multiplayer-link-url");

  await expect(async () => {
    await multiplayerButton.click();
    await expect(urlElement).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 15000 });

  const multiplayerUrl = (await urlElement.textContent())!;

  await page.getByRole("button", { name: /^start$/i }).click();
  await expect(page.getByRole("button", { name: /confirm/i })).toBeVisible({
    timeout: 120000,
  });

  return multiplayerUrl;
}

export async function createFriendPage(
  leaderPage: Page,
  multiplayerUrl: string,
): Promise<Page> {
  const overpassCache = await leaderPage.evaluate(() =>
    Object.entries(localStorage)
      .filter(([key]) => key.startsWith("overpass-response"))
      .map(([name, value]) => ({ name, value })),
  );

  const origin = new URL(multiplayerUrl).origin;
  const browser = leaderPage.context().browser()!;
  const friendContext = await browser.newContext({
    ignoreHTTPSErrors: true,
    storageState: {
      cookies: [],
      origins: [{ origin, localStorage: overpassCache }],
    },
  });
  const friendPage = await friendContext.newPage();

  await friendPage.goto(multiplayerUrl);
  await expect(friendPage.getByTestId("game-map")).toBeVisible();

  await friendPage
    .getByRole("button", { name: /play \(multiplayer mode\)/i })
    .click();
  await expect(
    friendPage.getByRole("button", { name: /confirm/i }),
  ).toBeVisible({ timeout: 120000 });

  return friendPage;
}

export async function assertSameStreets(
  leaderPage: Page,
  friendPage: Page,
): Promise<string[]> {
  const [leaderStreets, friendStreets] = await Promise.all([
    playThroughRound(leaderPage, { shouldCollectStreetNames: true }),
    playThroughRound(friendPage, { shouldCollectStreetNames: true }),
  ]);

  expect(leaderStreets).toEqual(friendStreets);
  expect(leaderStreets.length).toBeGreaterThanOrEqual(5);

  return leaderStreets;
}
