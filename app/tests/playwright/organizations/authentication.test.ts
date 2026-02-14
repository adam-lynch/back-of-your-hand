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

const org = organizations.example1;

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(org.baseUrl);
  });

  test("redirects to login when not authenticated", async ({ page }) => {
    await expect(page).toHaveURL(/\/log-in/);
  });

  test("can log in as admin", async ({ page }) => {
    const user = example1Users.admin;

    await page.getByLabel(/email/i).fill(user.email);
    await page.getByLabel(/password/i).fill(user.password);
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page).not.toHaveURL(/\/log-in/);
    await expect(page.getByText(user.firstName)).toBeVisible();
  });

  test("can log in as standard user", async ({ page }) => {
    const user = example1Users.standardUser;

    await page.getByLabel(/email/i).fill(user.email);
    await page.getByLabel(/password/i).fill(user.password);
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page).not.toHaveURL(/\/log-in/);
    await expect(page.getByText(user.firstName)).toBeVisible();
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.getByLabel(/email/i).fill("invalid@example.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page.getByText(/credentials/i)).toBeVisible();
    await expect(page).toHaveURL(/\/log-in/);
  });

  test("can log out", async ({ page }) => {
    const user = example1Users.admin;

    await page.getByLabel(/email/i).fill(user.email);
    await page.getByLabel(/password/i).fill(user.password);
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page).not.toHaveURL(/\/log-in/);

    await page.waitForLoadState("networkidle");

    const profileButton = page.getByRole("button", {
      name: new RegExp(user.firstName, "i"),
    });
    await profileButton.waitFor({ state: "visible" });
    await profileButton.click();

    // Wait for dropdown popover to appear and stabilize
    await page
      .locator(".navigation-list-item")
      .first()
      .waitFor({ state: "visible", timeout: 5000 });

    const logoutButton = page.getByRole("button", { name: /log out/i });
    await logoutButton.waitFor({ state: "visible", timeout: 5000 });
    await logoutButton.click();

    await expect(page).toHaveURL(/\/log-in|\/logged-out/);
  });
});
