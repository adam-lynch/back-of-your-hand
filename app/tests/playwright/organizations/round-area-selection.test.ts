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
import { clickMapCenter } from "../helpers/map";

const org = organizations.example1;
const user = example1Users.standardUser;

test.describe("Round with Area Selection", () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page, org, user);
  });

  test("game page loads for authenticated user", async ({ page }) => {
    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });
  });

  test("game page has interactive elements", async ({ page }) => {
    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });

    const buttons = page.getByRole("button");
    await expect(buttons.first()).toBeVisible({ timeout: 10000 });

    const buttonsCount = await buttons.count();
    expect(buttonsCount).toBeGreaterThan(0);
  });

  test("game page shows area selector after clicking Configure", async ({
    page,
  }) => {
    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });

    const configureButton = page.getByRole("button", { name: /configure/i });
    await expect(configureButton).toBeVisible({ timeout: 10000 });
    await configureButton.click();

    const areaCombobox = page.getByRole("combobox", { name: /area/i });
    await expect(areaCombobox).toBeVisible({ timeout: 10000 });
  });

  test("area selector has options loaded", async ({ page }) => {
    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });

    const configureButton = page.getByRole("button", { name: /configure/i });
    await configureButton.click();

    const areaCombobox = page.getByRole("combobox", { name: /area/i });
    await expect(areaCombobox).toBeVisible({ timeout: 10000 });

    const options = areaCombobox.locator("option");
    const optionsCount = await options.count();
    expect(optionsCount).toBeGreaterThan(1);
  });

  test("can change area selection", async ({ page }) => {
    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });

    const configureButton = page.getByRole("button", { name: /configure/i });
    await configureButton.click();

    const areaCombobox = page.getByRole("combobox", { name: /area/i });
    await expect(areaCombobox).toBeVisible({ timeout: 10000 });

    const initialValue = await areaCombobox.inputValue();

    const options = await areaCombobox.locator("option").all();
    if (options.length > 1) {
      await areaCombobox.selectOption({ index: 1 });

      const newValue = await areaCombobox.inputValue();
      expect(newValue).not.toBe(initialValue);
    }

    await expect(page.getByTestId("game-map")).toBeVisible();
  });

  test("can select a preset area and start a round", async ({ page }) => {
    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });

    const configureButton = page.getByRole("button", { name: /configure/i });
    await configureButton.click();

    const areaCombobox = page.getByRole("combobox", { name: /area/i });
    await expect(areaCombobox).toBeVisible({ timeout: 10000 });

    const options = await areaCombobox.locator("option").all();
    if (options.length > 1) {
      await areaCombobox.selectOption({ index: 1 });
    }

    await page.getByRole("button", { name: /play solo/i }).click();

    const confirmButton = page.getByRole("button", { name: /confirm/i });
    await expect(confirmButton).toBeVisible({ timeout: 10000 });

    const mapElement = page.getByTestId("game-map");
    await clickMapCenter(mapElement);

    await expect(confirmButton).toBeEnabled({ timeout: 5000 });
    await confirmButton.click();

    const nextButton = page.getByRole("button", { name: /next/i });
    const startNewRoundButton = page.getByRole("button", {
      name: /start a new round/i,
    });

    await expect(nextButton.or(startNewRoundButton)).toBeVisible({
      timeout: 10000,
    });
  });

  test("can select custom area", async ({ page }) => {
    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });

    const configureButton = page.getByRole("button", { name: /configure/i });
    await configureButton.click();

    const areaCombobox = page.getByLabel("Area", { exact: true });
    await expect(areaCombobox).toBeVisible({ timeout: 10000 });

    await areaCombobox.selectOption({ label: "Custom" });

    const areaShapeCombobox = page.getByLabel("Area shape");
    await expect(areaShapeCombobox).toBeVisible({ timeout: 10000 });

    await areaCombobox.selectOption({ index: 0 });

    await expect(page.getByTestId("game-map")).toBeVisible();
  });
});
