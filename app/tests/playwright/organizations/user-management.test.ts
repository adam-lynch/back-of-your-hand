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

const org = organizations.example1;

test.describe("User Management", () => {
  test("admin can access users settings page", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/settings/users");

    await expect(page.getByRole("heading", { name: /users/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /invite/i })).toBeVisible();
  });

  test("users list shows user data", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/settings/users");

    await expect(page.getByRole("heading", { name: /users/i })).toBeVisible();
    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator(".users__role-cell").first()).toBeVisible();
  });

  test("can click on user to view their profile", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/settings/users");

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 10000 });
    await rows.first().locator("a").first().click();

    await expect(page).toHaveURL(/\/settings\/(profile|users\/)/);
  });

  test("can open invite modal", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/settings/users");

    await page.getByRole("button", { name: /invite/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
  });

  test("standard user cannot access users settings page", async ({ page }) => {
    const user = example1Users.standardUser;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/settings/users");

    await expect(
      page.getByRole("heading", { name: /access denied/i }),
    ).toBeVisible();
    await expect(page.getByText(/you do not have permission/i)).toBeVisible();
  });

  test("shows remove button for users", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/settings/users");

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("button", { name: /remove/i }).first(),
    ).toBeVisible();
  });
});
