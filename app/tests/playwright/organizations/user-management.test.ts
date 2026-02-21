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

test.describe("User Management", () => {
  test("admin can access users settings page", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, organization, user);

    await page.goto(organization.baseUrl + "/settings/users");

    await expect(page.getByRole("heading", { name: /users/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /invite/i })).toBeVisible();
  });

  test("users list shows user data", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, organization, user);

    await page.goto(organization.baseUrl + "/settings/users");

    await expect(page.getByRole("heading", { name: /users/i })).toBeVisible();
    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 10000 });

    await expect(page.getByText("James Wilson")).toBeVisible();
    await expect(page.getByText("Ashley Robinson")).toBeVisible();
    await expect(page.getByText("Betty Martin")).toBeVisible();
  });

  test("can click on user to view their profile", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, organization, user);

    await page.goto(organization.baseUrl + "/settings/users");

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 10000 });

    const firstRowLink = rows.first().locator("a").first();
    const firstRowLinkText = (await firstRowLink.textContent())?.trim();
    const firstRowName = firstRowLinkText
      ?.replace(/\s*\([^)]*\)\s*/g, "")
      .trim();
    await firstRowLink.click();

    await expect(page).toHaveURL(/\/settings\/(profile|users\/)/);
    await expect(
      page.getByRole("heading", { name: firstRowName || "" }),
    ).toBeVisible();

    const firstNameInput = page.getByLabel("First name");
    const lastNameInput = page.getByLabel("Last name");
    await expect(firstNameInput).toBeVisible();
    const firstName = await firstNameInput.inputValue();
    const lastName = await lastNameInput.inputValue();
    expect(`${firstName} ${lastName}`).toBe(firstRowName);
  });

  test("can open invite modal", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, organization, user);

    await page.goto(organization.baseUrl + "/settings/users");

    await page.getByRole("button", { name: /invite/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
  });

  test("standard user cannot access users settings page", async ({ page }) => {
    const user = example1Users.standardUser;
    await logIn(page, organization, user);

    await page.goto(organization.baseUrl + "/settings/users");

    await expect(
      page.getByRole("heading", { name: /access denied/i }),
    ).toBeVisible();
    await expect(page.getByText(/you do not have permission/i)).toBeVisible();
  });

  test("standard user cannot access individual user page", async ({ page }) => {
    const user = example1Users.standardUser;
    await logIn(page, organization, user);

    await page.goto(
      organization.baseUrl + "/settings/users/01KHGSYC4DM1SPCS2TW8X3F6VS",
    );

    await expect(
      page.getByRole("heading", { name: /access denied/i }),
    ).toBeVisible();
    await expect(page.getByText(/you do not have permission/i)).toBeVisible();
  });

  test("admin can change a user's role", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, organization, user);

    await page.goto(organization.baseUrl + "/settings/users");

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 10000 });

    await page.getByRole("link", { name: "Ashley Robinson" }).click();

    const roleSelect = page.getByLabel("Role");
    await expect(roleSelect).toBeVisible({ timeout: 10000 });
    const originalRole = await roleSelect.inputValue();
    const newRole = originalRole === "admin" ? "standard" : "admin";

    try {
      const updatePromise = page.waitForResponse(
        (response) =>
          response.url().includes("/api/") &&
          response.request().method() === "PATCH",
        { timeout: 10000 },
      );

      await roleSelect.selectOption(newRole);
      const response = await updatePromise;
      expect(response.status()).toBe(200);

      await page.reload();
      await expect(page.getByLabel("Role")).toHaveValue(newRole, {
        timeout: 10000,
      });
    } finally {
      const revertPromise = page.waitForResponse(
        (response) =>
          response.url().includes("/api/") &&
          response.request().method() === "PATCH",
        { timeout: 10000 },
      );

      await page.getByLabel("Role").selectOption(originalRole);
      await revertPromise;
    }
  });

  test("shows remove button for users", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, organization, user);

    await page.goto(organization.baseUrl + "/settings/users");

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("button", { name: /remove/i }).first(),
    ).toBeVisible();
  });
});
