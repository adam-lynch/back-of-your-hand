/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { expect, test } from "../mocking/setup";
import { clickStartNewRound, playThroughRound } from "../helpers/map";
import {
  assertSameStreets,
  createFriendPage,
  startMultiplayerAsLeader,
} from "../helpers/multiplayer";

test("leader and friend see the same streets across multiple rounds", async ({
  page,
}) => {
  test.setTimeout(300_000);
  await page.goto("/");
  await expect(page.getByTestId("game-map")).toBeVisible();

  const multiplayerUrl = await startMultiplayerAsLeader(page);
  const friendPage = await createFriendPage(page, multiplayerUrl);

  try {
    const allRoundStreets: string[][] = [];

    for (let round = 0; round < 3; round++) {
      const streets = await assertSameStreets(page, friendPage);
      allRoundStreets.push(streets);

      if (round < 2) {
        await Promise.all([
          clickStartNewRound(page),
          clickStartNewRound(friendPage),
        ]);
      }
    }

    for (let i = 0; i < allRoundStreets.length; i++) {
      for (let j = i + 1; j < allRoundStreets.length; j++) {
        expect(allRoundStreets[i]).not.toEqual(allRoundStreets[j]);
      }
    }
  } finally {
    await friendPage.context().close();
  }
});

test("leader and friend see the same streets with custom settings", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.goto("/");
  await expect(page.getByTestId("game-map")).toBeVisible();

  const configureButton = page.getByRole("button", { name: /configure/i });
  const settingsPanel = page.locator(".settings");
  await expect(async () => {
    await configureButton.click();
    await expect(settingsPanel).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 10000 });
  await page.locator('input[value="tourist"]').check();

  const multiplayerUrl = await startMultiplayerAsLeader(page);
  const friendPage = await createFriendPage(page, multiplayerUrl);

  try {
    await assertSameStreets(page, friendPage);
  } finally {
    await friendPage.context().close();
  }
});

test("streets stay in sync after solo round then multiplayer", async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.goto("/");
  await expect(page.getByTestId("game-map")).toBeVisible();

  await page.getByRole("button", { name: /play solo/i }).click();
  await expect(page.getByRole("button", { name: /confirm/i })).toBeVisible({
    timeout: 120000,
  });
  await playThroughRound(page);

  await page.getByRole("button", { name: /^reset$/i }).click();
  await expect(
    page.getByRole("button", { name: /^multiplayer$/i }),
  ).toBeVisible();

  const multiplayerUrl = await startMultiplayerAsLeader(page);
  const friendPage = await createFriendPage(page, multiplayerUrl);

  try {
    await assertSameStreets(page, friendPage);
  } finally {
    await friendPage.context().close();
  }
});

test("multiplayer session can be reset with new settings and re-shared", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.goto("/");
  await expect(page.getByTestId("game-map")).toBeVisible();

  const firstUrl = await startMultiplayerAsLeader(page);
  const firstFriendPage = await createFriendPage(page, firstUrl);

  let firstRoundStreets: string[];
  try {
    firstRoundStreets = await assertSameStreets(page, firstFriendPage);
  } finally {
    await firstFriendPage.context().close();
  }

  await page.getByRole("button", { name: /^reset$/i }).click();
  await expect(page.getByRole("button", { name: /configure/i })).toBeVisible();
  const configureButton = page.getByRole("button", { name: /configure/i });
  const settingsPanel = page.locator(".settings");
  await expect(async () => {
    await configureButton.click();
    await expect(settingsPanel).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 10000 });
  await page.locator('input[value="tourist"]').check();

  const secondUrl = await startMultiplayerAsLeader(page);
  expect(secondUrl).not.toEqual(firstUrl);

  const secondFriendPage = await createFriendPage(page, secondUrl);

  try {
    const secondRoundStreets = await assertSameStreets(page, secondFriendPage);
    expect(secondRoundStreets).not.toEqual(firstRoundStreets);
  } finally {
    await secondFriendPage.context().close();
  }
});
