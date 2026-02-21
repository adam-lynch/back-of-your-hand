/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { expect, test, type Page } from "../mocking/setup";
import { example1Users, organizations } from "../fixtures/test-users";
import { logIn } from "../helpers/auth";

const organization = organizations.example1;

async function navigateToFirstMapFeature(page: Page) {
  await page.goto(organization.baseUrl + "/settings/points-of-interest");

  const rows = page.locator("tbody tr");
  await expect(rows.first()).toBeVisible({ timeout: 10000 });

  const firstRowName = await rows.first().locator("td").first().textContent();
  if (!firstRowName) {
    throw new Error("Could not get first row name");
  }

  await rows.first().click();
  await expect(page).toHaveURL(/\/settings\/points-of-interest\/.+/);

  await expect(page.getByRole("heading", { name: firstRowName })).toBeVisible();

  const nameInput = page.getByLabel(/name/i);
  await expect(nameInput).toHaveValue(firstRowName);

  return firstRowName;
}

test.describe("Individual Point of Interest Page", () => {
  test("can navigate to page and shows fields populated correctly", async ({
    page,
  }) => {
    await logIn(page, organization, example1Users.admin);

    await navigateToFirstMapFeature(page);

    const latitudeInput = page.getByLabel(/latitude/i);
    const longitudeInput = page.getByLabel(/longitude/i);

    const latValue = await latitudeInput.inputValue();
    const lngValue = await longitudeInput.inputValue();
    expect(latValue).toBeTruthy();
    expect(lngValue).toBeTruthy();
    expect(parseFloat(latValue)).toBeGreaterThanOrEqual(-90);
    expect(parseFloat(latValue)).toBeLessThanOrEqual(90);
    expect(parseFloat(lngValue)).toBeGreaterThanOrEqual(-180);
    expect(parseFloat(lngValue)).toBeLessThanOrEqual(180);
  });

  test("shows delete button and opens confirmation modal", async ({ page }) => {
    await logIn(page, organization, example1Users.admin);

    await navigateToFirstMapFeature(page);

    const deleteButton = page.getByRole("button", { name: /delete/i });
    await expect(deleteButton).toBeVisible();

    await deleteButton.click();

    await expect(page.getByRole("alertdialog")).toBeVisible();
    await expect(page.getByText(/this cannot be undone/i)).toBeVisible();
  });

  test("shows error for non-numeric coordinates", async ({ page }) => {
    await logIn(page, organization, example1Users.admin);

    await navigateToFirstMapFeature(page);

    const latitudeInput = page.getByLabel(/latitude/i);
    await latitudeInput.fill("abc");
    await latitudeInput.blur();

    await expect(page.getByText("Latitude must be a number")).toBeVisible({
      timeout: 5000,
    });

    const longitudeInput = page.getByLabel(/longitude/i);
    await longitudeInput.fill("xyz");
    await longitudeInput.blur();

    await expect(page.getByText("Longitude must be a number")).toBeVisible({
      timeout: 5000,
    });
  });

  test("shows error for out-of-range coordinates", async ({ page }) => {
    await logIn(page, organization, example1Users.admin);

    await navigateToFirstMapFeature(page);

    const latitudeInput = page.getByLabel(/latitude/i);
    await latitudeInput.fill("999");
    await latitudeInput.blur();

    await expect(
      page.getByText("Latitude must be between -90 and 90"),
    ).toBeVisible({ timeout: 5000 });

    const longitudeInput = page.getByLabel(/longitude/i);
    await longitudeInput.fill("999");
    await longitudeInput.blur();

    await expect(
      page.getByText("Longitude must be between -180 and 180"),
    ).toBeVisible({ timeout: 5000 });
  });

  test("shows 404 for nonexistent point of interest", async ({ page }) => {
    await logIn(page, organization, example1Users.admin);

    await page.goto(
      organization.baseUrl + "/settings/points-of-interest/nonexistent-id",
    );

    await expect(page.getByText(/not found/i)).toBeVisible();
  });

  test("standard user cannot access individual page", async ({ page }) => {
    await logIn(page, organization, example1Users.standardUser);

    await page.goto(
      organization.baseUrl + "/settings/points-of-interest/some-map-feature-id",
    );

    await expect(
      page.getByRole("heading", { name: /access denied/i }),
    ).toBeVisible();
    await expect(page.getByText(/you do not have permission/i)).toBeVisible();
  });
});
