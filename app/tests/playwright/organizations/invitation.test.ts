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
import { createInviteViaUI } from "../helpers/invites";

const org = organizations.example1;

test.describe("Invitation", () => {
  test("can open invite modal from users page", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/settings/users");

    await page.getByRole("button", { name: /invite/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /invite/i, level: 2 }),
    ).toBeVisible();
  });

  test("invite modal has all required fields", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/settings/users");
    await page.getByRole("button", { name: /invite/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/role/i)).toBeVisible();
    await expect(page.getByLabel(/job title/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /cancel/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /send invite/i }),
    ).toBeVisible();
  });

  test("can cancel invite modal", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/settings/users");
    await page.getByRole("button", { name: /invite/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByRole("button", { name: /cancel/i }).click();

    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("can fill out invite form", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/settings/users");
    await page.getByRole("button", { name: /invite/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByLabel(/email/i).fill("newuser@example.com");
    await page.getByLabel(/first name/i).fill("New");
    await page.getByLabel(/last name/i).fill("User");
    await page.getByLabel(/role/i).selectOption("standard");
    await page.getByLabel(/job title/i).fill("Firefighter");

    await expect(page.getByLabel(/email/i)).toHaveValue("newuser@example.com");
    await expect(page.getByLabel(/first name/i)).toHaveValue("New");
    await expect(page.getByLabel(/last name/i)).toHaveValue("User");
  });

  test("shows validation errors for empty required fields", async ({
    page,
  }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/settings/users");
    await page.getByRole("button", { name: /invite/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();

    const sendButton = page.getByRole("button", { name: /send invite/i });
    await sendButton.click();

    await expect(page.getByText("Email is a required field")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("First name is a required field")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("Last name is a required field")).toBeVisible({
      timeout: 10000,
    });
  });

  test("role selector has admin and standard options", async ({ page }) => {
    const user = example1Users.admin;
    await logIn(page, org, user);

    await page.goto(org.baseUrl + "/settings/users");
    await page.getByRole("button", { name: /invite/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();

    const roleSelect = page.getByLabel(/role/i);
    await expect(roleSelect).toBeVisible();
    await expect(roleSelect.locator("option")).toHaveCount(2);
    await expect(roleSelect).toContainText(/admin/i);
    await expect(roleSelect).toContainText(/standard/i);
  });

  test("submits invite form successfully for standard user", async ({
    page,
  }) => {
    const user = example1Users.admin;
    const inviteEmail = "invite-standard@example.com";

    const invite = await createInviteViaUI(
      page,
      org,
      user,
      inviteEmail,
      "Standard",
      "Test",
      "standard",
    );

    expect(invite.token).toBeTruthy();
    expect(invite.email).toBe(inviteEmail);
  });

  test("submits invite form successfully for admin user", async ({ page }) => {
    const user = example1Users.admin;
    const inviteEmail = "invite-admin@example.com";

    const invite = await createInviteViaUI(
      page,
      org,
      user,
      inviteEmail,
      "Admin",
      "Test",
      "admin",
    );

    expect(invite.token).toBeTruthy();
    expect(invite.email).toBe(inviteEmail);
  });
});
