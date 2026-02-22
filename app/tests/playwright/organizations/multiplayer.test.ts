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
import {
  assertSameStreets,
  startMultiplayerAsLeader,
} from "../helpers/multiplayer";

const org = organizations.example1;

test("leader and colleague see the same streets with a predefined area", async ({
  page,
  applyMocksToPage,
}) => {
  test.setTimeout(180_000);
  await logIn(page, org, example1Users.standardUser);
  await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });

  const configureButton = page.getByRole("button", { name: /configure/i });
  const settingsPanel = page.locator(".settings");
  await expect(async () => {
    await configureButton.click();
    await expect(settingsPanel).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 10000 });

  const areaCombobox = page.getByRole("combobox", { name: /area/i });
  await expect(areaCombobox).toBeVisible({ timeout: 10000 });

  const options = await areaCombobox.locator("option").all();
  expect(options.length).toBeGreaterThan(1);
  await areaCombobox.selectOption({ index: 1 });

  const multiplayerUrl = await startMultiplayerAsLeader(page);

  const overpassCache = await page.evaluate(() =>
    Object.entries(localStorage)
      .filter(([key]) => key.startsWith("overpass-response"))
      .map(([name, value]) => ({ name, value })),
  );

  const origin = new URL(multiplayerUrl).origin;
  const browser = page.context().browser()!;
  const friendContext = await browser.newContext({
    ignoreHTTPSErrors: true,
    storageState: {
      cookies: [],
      origins: [{ origin, localStorage: overpassCache }],
    },
  });
  const friendPage = await friendContext.newPage();
  await applyMocksToPage(friendPage);

  await logIn(friendPage, org, example1Users.admin);
  await friendPage.goto(multiplayerUrl);
  await expect(friendPage.getByTestId("game-map")).toBeVisible({
    timeout: 30000,
  });

  await friendPage
    .getByRole("button", { name: /play \(multiplayer mode\)/i })
    .click();
  await expect(
    friendPage.getByRole("button", { name: /confirm/i }),
  ).toBeVisible({ timeout: 120000 });

  try {
    await assertSameStreets(page, friendPage);
  } finally {
    await friendContext.close();
  }
});
