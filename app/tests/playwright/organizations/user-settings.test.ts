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

const organization = organizations.example1;

test.describe("User Settings", () => {
  test("can access profile settings page", async ({ page }) => {
    const user = example1Users.standardUser;
    await logIn(page, organization, user);

    await page.goto(organization.baseUrl + "/settings/profile");

    await expect(page.getByRole("heading", { name: /profile/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toHaveValue(user.email, {
      timeout: 10000,
    });
    await expect(page.getByLabel(/first name/i)).toHaveValue(user.firstName);
    await expect(page.getByLabel(/last name/i)).toHaveValue(user.lastName);
  });

  test("can update first name", async ({ page }) => {
    const user = example1Users.standardUser;
    await logIn(page, organization, user);

    await page.goto(organization.baseUrl + "/settings/profile");

    const firstNameInput = page.getByLabel(/first name/i);
    await expect(firstNameInput).toBeVisible();

    const originalFirstName = await firstNameInput.inputValue();
    const newFirstName = "UpdatedTestName";

    try {
      await firstNameInput.fill(newFirstName);

      const updatePromise = page.waitForResponse(
        (response) =>
          response.url().includes("/api/") &&
          response.request().method() === "PATCH",
        { timeout: 10000 },
      );

      await firstNameInput.blur();
      const response = await updatePromise;
      expect(response.status()).toBe(200);

      await page.reload();
      await expect(page.getByLabel(/first name/i)).toHaveValue(newFirstName, {
        timeout: 10000,
      });
    } finally {
      await page.getByLabel(/first name/i).fill(originalFirstName);

      const revertPromise = page.waitForResponse(
        (response) =>
          response.url().includes("/api/") &&
          response.request().method() === "PATCH",
        { timeout: 10000 },
      );

      await page.getByLabel(/first name/i).blur();
      await revertPromise;
    }
  });

  test("shows error when first name update fails", async ({ page }) => {
    const user = example1Users.standardUser;
    await logIn(page, organization, user);

    await page.goto(organization.baseUrl + "/settings/profile");

    const firstNameInput = page.getByLabel(/first name/i);
    await expect(firstNameInput).toBeVisible();

    const newFirstName = "FailTest";

    // Intercept PATCH and return a 500 error
    await page.route("**/api/**", async (route) => {
      if (route.request().method() === "PATCH") {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Failed to update user" }),
        });
      } else {
        await route.continue();
      }
    });

    await firstNameInput.fill(newFirstName);
    await firstNameInput.blur();

    const errorIndicator = page
      .getByText(/error|failed/i)
      .or(page.locator('[role="alert"]'));
    await expect(errorIndicator.first()).toBeVisible({ timeout: 5000 });
  });

  test("shows change password link for current user", async ({ page }) => {
    const user = example1Users.standardUser;
    await logIn(page, organization, user);

    await page.goto(organization.baseUrl + "/settings/profile");

    await expect(
      page.getByRole("link", { name: /change password/i }),
    ).toBeVisible();
  });

  test("can navigate to change password page", async ({ page }) => {
    const user = example1Users.standardUser;
    await logIn(page, organization, user);

    await page.goto(organization.baseUrl + "/settings/profile");

    await page.getByRole("link", { name: /change password/i }).click();

    await expect(page).toHaveURL(/\/change-password/);
    await expect(
      page.getByRole("heading", { name: /change password/i }),
    ).toBeVisible();
  });

  test("delete account button triggers confirmation dialog", async ({
    page,
  }) => {
    const user = example1Users.standardUser;
    await logIn(page, organization, user);

    await page.goto(organization.baseUrl + "/settings/profile");

    const deleteButton = page.getByRole("button", { name: /delete account/i });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    await expect(page.getByRole("alertdialog")).toBeVisible();
  });

  test("standard user cannot access another user's page", async ({ page }) => {
    const user = example1Users.standardUser;
    await logIn(page, organization, user);

    await page.goto(
      organization.baseUrl + "/settings/users/01KHGSYC4DM1SPCS2TW8X3F6VS",
    );

    await expect(page.getByText(/you do not have permission/i)).toBeVisible();
  });
});
