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
import getTestDate from "../helpers/dates";
import { playThroughRound } from "../helpers/map";

const org = organizations.example1;

test.describe("Reports", () => {
  test("admin can access reports page", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/reports");

    await expect(page.getByRole("heading", { name: /reports/i })).toBeVisible();
    await expect(page.getByLabel(/user/i)).toBeVisible();
    await expect(page.getByLabel(/area/i)).toBeVisible();
    await expect(page.locator("#date-filter")).toBeVisible();
  });

  test("reports page shows round data", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/reports");

    await expect(page.getByRole("heading", { name: /reports/i })).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: /date/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: /user/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: /area/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: /score/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: /question amount/i }),
    ).toBeVisible();

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 10000 });
  });

  test("can filter reports by user", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/reports");

    await expect(page.getByRole("heading", { name: /reports/i })).toBeVisible();

    const userFilter = page.getByLabel(/user/i);
    await expect(userFilter).toBeVisible();

    const selectedOption = await userFilter
      .locator("option")
      .nth(1)
      .textContent();
    await userFilter.selectOption({ index: 1 });

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 10000 });

    const rowCount = await rows.count();
    if (rowCount > 0) {
      const userCells = page.locator("tbody tr td:nth-child(2)");
      const firstCellText = await userCells.first().textContent();

      expect(firstCellText?.trim()).toBe(selectedOption?.trim());

      for (let i = 0; i < Math.min(rowCount, 5); i++) {
        const cellText = await userCells.nth(i).textContent();
        expect(cellText?.trim()).toBe(selectedOption?.trim());
      }
    }
  });

  test("can filter reports by area", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/reports");

    await expect(page.getByRole("heading", { name: /reports/i })).toBeVisible();

    const areaFilter = page.getByLabel(/area/i);
    await expect(areaFilter).toBeVisible();

    const selectedOption = await areaFilter
      .locator("option")
      .nth(1)
      .textContent();
    await areaFilter.selectOption({ index: 1 });

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 10000 });

    const rowCount = await rows.count();
    if (rowCount > 0) {
      const areaCells = page.locator("tbody tr td:nth-child(3)");
      const firstCellText = await areaCells.first().textContent();

      expect(firstCellText?.trim()).toBe(selectedOption?.trim());

      for (let i = 0; i < Math.min(rowCount, 5); i++) {
        const cellText = await areaCells.nth(i).textContent();
        expect(cellText?.trim()).toBe(selectedOption?.trim());
      }
    }
  });

  test("can filter reports by date range", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/reports");

    await expect(page.getByRole("heading", { name: /reports/i })).toBeVisible();

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 10000 });
    const initialRowCount = await rows.count();

    const dateFilter = page.locator("#date-filter");
    await expect(dateFilter).toBeVisible();
    // "Last month" is a completed time period that will have seed data
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/") &&
        response.request().method() === "GET",
      { timeout: 10000 },
    );
    await dateFilter.selectOption({ label: "Last month" });
    await responsePromise;

    const filteredRowCount = await rows.count();

    expect(filteredRowCount).toBeGreaterThanOrEqual(0);
    expect(filteredRowCount).toBeLessThanOrEqual(initialRowCount);
  });

  test("completed round appears in reports with correct data", async ({
    page,
  }, testInfo) => {
    test.setTimeout(60_000);
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/game");
    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });

    const configureButton = page.getByRole("button", { name: /configure/i });
    await configureButton.click();

    const areaCombobox = page.getByRole("combobox", { name: /area/i });
    await expect(areaCombobox).toBeVisible({ timeout: 10000 });

    const selectedAreaName = await areaCombobox
      .locator("option")
      .nth(1)
      .textContent();
    await areaCombobox.selectOption({ index: 1 });

    await page.getByRole("button", { name: /play solo/i }).click();

    const confirmButton = page.getByRole("button", { name: /confirm/i });
    await expect(confirmButton).toBeVisible({ timeout: 10000 });

    await playThroughRound(page);

    await page.goto(org.baseUrl + "/reports");
    await expect(page.getByRole("heading", { name: /reports/i })).toBeVisible();

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 10000 });

    const firstRowCells = rows.first().locator("td");
    const userCell = await firstRowCells.nth(1).textContent();
    const areaCell = await firstRowCells.nth(2).textContent();
    const dateCell = await firstRowCells.nth(0).textContent();

    expect(userCell?.trim()).toContain(user.firstName);
    expect(areaCell?.trim()).toBe(selectedAreaName?.trim());

    const testDate = await getTestDate(testInfo);
    const expectedDateStr = testDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    expect(dateCell).toContain(expectedDateStr);
  });

  test("standard user cannot access reports page", async ({ page }) => {
    const user = example1Users.standardUser;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/reports");

    await expect(
      page.getByRole("heading", { name: /access denied/i }),
    ).toBeVisible();
    await expect(page.getByText(/you do not have permission/i)).toBeVisible();
  });
});
