/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { expect, test } from "../mocking/setup";
import {
  example1Users,
  example2Users,
  organizations,
} from "../fixtures/test-users";
import {
  createAcceptedInvite,
  createInviteViaUI,
  deleteUserOrganizationByEmail,
} from "../helpers/invites";

const org = organizations.example1;
const admin = example1Users.admin;
const org2 = organizations.example2;
const example2Admin = example2Users.admin;

test.describe("Invite Acceptance", () => {
  test("can access invite acceptance page with valid token", async ({
    page,
  }) => {
    const invite = await createInviteViaUI(
      page,
      org,
      admin,
      "invite-valid-token@example.com",
    );

    await page.context().clearCookies();

    await page.goto(
      org.baseUrl + `/accounts/accept-invite?token=${invite.token}`,
    );

    await expect(page).toHaveURL(/\/accounts\/accept-invite/);
    await expect(page.getByText(/invite does not exist/i)).not.toBeVisible();
  });

  test("page displays organization name from token", async ({ page }) => {
    const invite = await createInviteViaUI(
      page,
      org,
      admin,
      "invite-org-name@example.com",
    );

    await page.goto(
      org.baseUrl + `/accounts/accept-invite?token=${invite.token}`,
    );

    await expect(page.getByText(new RegExp(org.name, "i"))).toBeVisible();
  });

  test.describe("Password validation", () => {
    test("shows error when passwords don't match", async ({ page }) => {
      const invite = await createInviteViaUI(
        page,
        org,
        admin,
        "invite-password-mismatch@example.com",
      );

      await page.goto(
        org.baseUrl + `/accounts/accept-invite?token=${invite.token}`,
      );

      await page.waitForLoadState("networkidle");

      await page.locator('input[name="password1"]').fill("TestPassword123!");
      await page
        .locator('input[name="password2"]')
        .fill("DifferentPassword123!");

      await page.getByRole("button", { name: /create account/i }).click();

      await expect(page.getByText(/passwords must match/i)).toBeVisible();
    });

    test("shows error for weak/invalid password", async ({ page }) => {
      const invite = await createInviteViaUI(
        page,
        org,
        admin,
        "invite-weak-password@example.com",
      );

      await page.goto(
        org.baseUrl + `/accounts/accept-invite?token=${invite.token}`,
      );

      await page.waitForLoadState("networkidle");

      await page.locator('input[name="password1"]').fill("weak");
      await page.locator('input[name="password2"]').fill("weak");

      await page.getByRole("button", { name: /create account/i }).click();

      await expect(
        page.getByText(/password.*too short|password.*at least/i),
      ).toBeVisible();
    });

    test("shows error when password field is empty", async ({ page }) => {
      const invite = await createInviteViaUI(
        page,
        org,
        admin,
        "invite-empty-password@example.com",
      );

      await page.goto(
        org.baseUrl + `/accounts/accept-invite?token=${invite.token}`,
      );

      await page.waitForLoadState("networkidle");

      await page.getByRole("button", { name: /create account/i }).click();

      await expect(
        page.getByText(/password.*at least.*characters/i),
      ).toBeVisible();
    });
  });

  test.describe("Token validation", () => {
    test("shows error for invalid/malformed token", async ({ page }) => {
      const invalidToken = "invalid-malformed-token-12345";

      await page.goto(
        org.baseUrl + `/accounts/accept-invite?token=${invalidToken}`,
      );

      await expect(
        page.getByText(/invite does not exist|invalid.*invite/i),
      ).toBeVisible();
    });

    test("shows error when invite doesn't exist", async ({ page }) => {
      const nonExistentToken = "does-not-exist-token-999999";

      await page.goto(
        org.baseUrl + `/accounts/accept-invite?token=${nonExistentToken}`,
      );

      await expect(
        page.getByText(
          /no such invite exists|invite does not exist|not found|revoked/i,
        ),
      ).toBeVisible();
    });
  });

  test.describe("Acceptance scenarios", () => {
    test("new user (no existing account): Sets password, accepts invite, logs in automatically", async ({
      page,
    }) => {
      const inviteEmail = "invite-new-user@example.com";
      const invite = await createInviteViaUI(
        page,
        org,
        admin,
        inviteEmail,
        "NewUser",
        "Test",
      );
      const password = "NewUserPassword123!";

      await page.goto(
        org.baseUrl + `/accounts/accept-invite?token=${invite.token}`,
      );

      await page.waitForLoadState("networkidle");

      await page.locator('input[name="password1"]').fill(password);
      await page.locator('input[name="password2"]').fill(password);

      // Accept terms of service if checkbox exists
      const termsCheckbox = page.getByRole("checkbox", {
        name: /terms of service|agree/i,
      });
      if (await termsCheckbox.isVisible().catch(() => false)) {
        await termsCheckbox.check();
      }

      await page.getByRole("button", { name: /create account/i }).click();

      await expect(page).toHaveURL(/\/game/, { timeout: 10000 });
      await expect(page.getByTestId("game-map")).toBeVisible();
    });

    test("existing user in another org: Associates with this org, logs in, can switch between orgs", async ({
      page,
    }) => {
      const invite = await createInviteViaUI(
        page,
        org,
        admin,
        example2Admin.email,
        example2Admin.firstName,
        example2Admin.lastName,
      );

      await page.goto(
        org.baseUrl + `/accounts/accept-invite?token=${invite.token}`,
      );

      await page.waitForLoadState("networkidle");

      // Existing user — no password fields needed
      await expect(page.locator('input[name="password1"]')).not.toBeVisible();

      await page.getByRole("button", { name: /accept invite/i }).click();

      await expect(page).toHaveURL(/\/game/, { timeout: 10000 });
      await expect(page).toHaveURL(new RegExp(org.subdomain));
      await expect(page.getByTestId("game-map")).toBeVisible();

      // Verify can access example2 by logging in there
      await page.goto(org2.baseUrl);
      await page.waitForLoadState("networkidle");

      // Different subdomain = separate session, so we land on login
      await expect(page).toHaveURL(/\/log-in/, { timeout: 10000 });

      await page.getByLabel(/email/i).fill(example2Admin.email);
      await page.getByLabel(/password/i).fill(example2Admin.password);
      await page.getByRole("button", { name: /log in/i }).click();

      await expect(page).toHaveURL(/\/game/, { timeout: 10000 });
      await expect(page).toHaveURL(new RegExp(org2.subdomain));
      await expect(page.getByTestId("game-map")).toBeVisible({
        timeout: 10000,
      });
    });

    test("already-accepted invite: Shows appropriate message (not an error)", async ({
      page,
    }) => {
      const invite = await createAcceptedInvite(
        page,
        org,
        admin,
        "invite-already-accepted@example.com",
      );

      await page.goto(
        org.baseUrl + `/accounts/accept-invite?token=${invite.token}`,
      );

      await expect(
        page.getByText(/already.*accepted|already.*used/i),
      ).toBeVisible();

      await expect(page.getByRole("link", { name: /login/i })).toBeVisible();
    });
  });

  test.describe("Error handling", () => {
    test("shows error when UserOrganization was deleted", async ({ page }) => {
      const inviteEmail = "invite-deleted@example.com";

      const invite = await createInviteViaUI(
        page,
        org,
        admin,
        inviteEmail,
        "Deleted",
        "Test",
      );

      await deleteUserOrganizationByEmail(page, org, admin, inviteEmail);

      await page.goto(
        org.baseUrl + `/accounts/accept-invite?token=${invite.token}`,
      );

      // Backend returns same error for deleted UserOrganizations
      await expect(
        page.getByText(/invite does not exist|not found|revoked/i),
      ).toBeVisible();
    });

    test("handles network errors gracefully", async ({ page }) => {
      const token = "test-token-placeholder";

      await page.route("**/invites/**", async (route) => {
        await route.abort("failed");
      });

      await page.goto(org.baseUrl + `/accounts/accept-invite?token=${token}`);

      await expect(
        page.getByText(/error|try again|network/i).first(),
      ).toBeVisible();
    });
  });
});
