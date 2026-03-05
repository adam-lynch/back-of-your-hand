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

const organization = organizations.example1;
const settingsUrl = organization.baseUrl + "/settings/organization";

function waitForOrgPatch(page: import("@playwright/test").Page) {
  return page.waitForResponse(
    (response) =>
      response.url().includes("/api/organizations/") &&
      response.request().method() === "PATCH",
    { timeout: 10000 },
  );
}

test.describe("Organization Settings", () => {
  test("standard user is denied access", async ({ page }) => {
    await logIn(page, organization, example1Users.standardUser);
    await page.goto(settingsUrl);

    await expect(page.getByText(/you do not have permission/i)).toBeVisible();
  });

  test("changing distance unit saves, persists, and affects gameplay", async ({
    page,
  }) => {
    await logIn(page, organization, example1Users.admin);
    await page.goto(settingsUrl);

    const select = page.getByLabel(/distance unit/i);
    await expect(select).toBeVisible();
    const originalValue = await select.inputValue();

    try {
      const updatePromise = waitForOrgPatch(page);
      await select.selectOption("metric");
      const response = await updatePromise;
      expect(response.status()).toBe(200);

      await page.reload();
      await expect(page.getByLabel(/distance unit/i)).toHaveValue("metric", {
        timeout: 10000,
      });

      await page.goto(organization.baseUrl);
      await expect(page.getByTestId("game-map")).toBeVisible({
        timeout: 10000,
      });
      await page.getByRole("button", { name: /play solo/i }).click();

      const confirmButton = page.getByRole("button", { name: /confirm/i });
      await expect(confirmButton).toBeVisible({ timeout: 10000 });

      const mapElement = page.getByTestId("game-map");
      await clickMapCenter(mapElement);
      await expect(confirmButton).toBeEnabled({ timeout: 5000 });
      await confirmButton.click();

      const distanceText = page.getByText(/^Distance:/);
      await expect(distanceText).toBeVisible({ timeout: 10000 });
      const text = await distanceText.textContent();
      expect(text).toMatch(/metres/);
    } finally {
      await page.goto(settingsUrl);
      const revertPromise = waitForOrgPatch(page);
      await page.getByLabel(/distance unit/i).selectOption(originalValue);
      await revertPromise;
    }
  });

  test.describe("Maximum questions per round", () => {
    test("changing value saves, persists, and affects the slider max", async ({
      page,
    }) => {
      await logIn(page, organization, example1Users.admin);
      await page.goto(settingsUrl);

      const input = page.getByLabel(/maximum questions per round/i);
      await expect(input).toBeVisible();
      const originalValue = await input.inputValue();
      const newLimit = "30";

      try {
        await input.fill(newLimit);
        const updatePromise = waitForOrgPatch(page);
        await input.blur();
        const response = await updatePromise;
        expect(response.status()).toBe(200);

        await page.reload();
        await expect(
          page.getByLabel(/maximum questions per round/i),
        ).toHaveValue(newLimit, { timeout: 10000 });

        await page.goto(organization.baseUrl);
        await expect(page.getByTestId("game-map")).toBeVisible({
          timeout: 10000,
        });

        await page.getByRole("button", { name: /configure/i }).click();

        const slider = page.locator("#numberOfQuestionsInput");
        await expect(slider).toHaveAttribute("max", newLimit, {
          timeout: 5000,
        });
      } finally {
        await page.goto(settingsUrl);
        const revertInput = page.getByLabel(/maximum questions per round/i);
        await revertInput.fill(originalValue);
        const revertPromise = waitForOrgPatch(page);
        await revertInput.blur();
        await revertPromise;
      }
    });

    test("shows validation errors for invalid values", async ({ page }) => {
      await logIn(page, organization, example1Users.admin);
      await page.goto(settingsUrl);

      const input = page.getByLabel(/maximum questions per round/i);
      await expect(input).toBeVisible();

      await input.fill("abc");
      await input.blur();
      await expect(page.getByText("Must be a whole number")).toBeVisible();

      await input.fill("3");
      await input.blur();
      await expect(page.getByText("Must be between 5 and 250")).toBeVisible();

      await input.fill("300");
      await input.blur();
      await expect(page.getByText("Must be between 5 and 250")).toBeVisible();

      await input.fill("");
      await input.blur();
      await expect(
        page.getByText("Maximum questions per round is required"),
      ).toBeVisible();
    });
  });
});
