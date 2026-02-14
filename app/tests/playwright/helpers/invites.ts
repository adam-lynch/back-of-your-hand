/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import type { Page } from "@playwright/test";
import type { Organization, TestUser } from "./auth";
import { logIn, logOut } from "./auth";

interface InviteData {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Get backend URL from org base URL.
 * Transforms https://example1.local-backofyourhand.com:5173
 * to https://example1--backend.local-backofyourhand--backend.com:8000
 */
function getBackendUrl(orgBaseUrl: string): string {
  return orgBaseUrl
    .replace(/https:\/\/([^.]+)\./, "https://$1--backend.")
    .replace(/\.com:5173/, "--backend.com:8000");
}

/**
 * Creates a new invite via the UI (true E2E approach) and returns the invite token.
 */
export async function createInviteViaUI(
  page: Page,
  org: Organization,
  adminUser: TestUser,
  inviteEmail: string,
  inviteFirstName: string = "Test",
  inviteLastName: string = "Invitee",
  role: "admin" | "standard" = "standard",
): Promise<InviteData> {
  await logIn(page, org, adminUser);

  await page.goto(`${org.baseUrl}/settings/users`, {
    waitUntil: "domcontentloaded",
  });

  await page.getByRole("button", { name: /invite/i }).click();
  await page.getByRole("dialog").waitFor({ state: "visible" });

  // Intercept the invite POST to confirm it succeeds
  const backendUrl = getBackendUrl(org.baseUrl);
  const responsePromise = page.waitForResponse(
    (response) =>
      response
        .url()
        .includes(`${backendUrl}/api/userorganizations/actions/invite`) &&
      response.request().method() === "POST" &&
      response.status() === 201,
  );

  await page.getByLabel(/email/i).fill(inviteEmail);
  await page.getByLabel(/first name/i).fill(inviteFirstName);
  await page.getByLabel(/last name/i).fill(inviteLastName);
  await page.getByLabel(/role/i).selectOption(role);
  await page.getByRole("button", { name: /send invite/i }).click();

  await responsePromise;

  // Modal closing indicates success
  await page.waitForSelector('[role="dialog"]', {
    state: "hidden",
    timeout: 10000,
  });

  const token = await getInviteTokenFromEmail(page, backendUrl, inviteEmail);

  // Log out so tests can visit the invite page as an unauthenticated user
  await logOut(page);

  return {
    token,
    email: inviteEmail,
    firstName: inviteFirstName,
    lastName: inviteLastName,
  };
}

/**
 * Retrieves the invite token from the most recent email sent to the specified address.
 * Uses page.evaluate(fetch) so the request goes through page.route() and can be
 * recorded/mocked by the mock system.
 */
async function getInviteTokenFromEmail(
  page: Page,
  backendUrl: string,
  recipientEmail: string,
): Promise<string> {
  const maxAttempts = 20;
  const delayMs = 500;
  const url = `${backendUrl}/api/__test__/latest-invite-token?email=${encodeURIComponent(recipientEmail)}`;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const result = await page.evaluate(async (fetchUrl: string) => {
      const response = await fetch(fetchUrl);
      if (response.status === 404) return { found: false } as { found: false };
      if (!response.ok) return { error: response.status } as { error: number };
      const data = await response.json();
      return { found: true, token: data.token } as {
        found: true;
        token: string;
      };
    }, url);

    if ("error" in result) {
      throw new Error(`Failed to get invite token: ${result.error}`);
    }

    if (result.found) {
      return result.token;
    }
  }

  throw new Error(
    `No invite token found for ${recipientEmail} after ${(maxAttempts * delayMs) / 1000} seconds`,
  );
}

/**
 * Creates and immediately accepts an invite to simulate an already-accepted invite.
 */
export async function createAcceptedInvite(
  page: Page,
  org: Organization,
  adminUser: TestUser,
  inviteEmail: string,
): Promise<InviteData> {
  const inviteData = await createInviteViaUI(page, org, adminUser, inviteEmail);

  await page.goto(
    org.baseUrl + `/accounts/accept-invite?token=${inviteData.token}`,
  );
  await page.waitForLoadState("networkidle");

  const password = "AcceptedPassword123!";
  await page.locator('input[name="password1"]').fill(password);
  await page.locator('input[name="password2"]').fill(password);

  // Accept terms of service if checkbox exists
  const termsCheckbox = page.getByRole("checkbox", {
    name: /terms of service|agree/i,
  });
  if (await termsCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
    await termsCheckbox.check();
  }

  await page.getByRole("button", { name: /create account/i }).click();
  await page.waitForURL(/\/game/, { timeout: 10000 });

  // Log out so tests can navigate to invite pages as unauthenticated users
  await logOut(page);

  return inviteData;
}

/**
 * Deletes a UserOrganization by email via the settings page.
 * Best-effort cleanup: silently fails if the user doesn't exist.
 */
export async function deleteUserOrganizationByEmail(
  page: Page,
  org: Organization,
  adminUser: TestUser,
  userEmail: string,
): Promise<void> {
  try {
    await logIn(page, org, adminUser);
    await page.goto(`${org.baseUrl}/settings/users`);
    await page.waitForLoadState("networkidle", { timeout: 10000 });
    await page.waitForSelector("tbody tr", { timeout: 10000 });

    // Wait for client-side rendering to complete
    await page.waitForTimeout(2000);

    // Scroll to load more users (infinite scroll) until target is found
    let attempts = 0;
    const maxAttempts = 3;
    let userRow = page.locator(`tbody tr:has-text("${userEmail}")`);

    while (attempts < maxAttempts && (await userRow.count()) === 0) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      userRow = page.locator(`tbody tr:has-text("${userEmail}")`);
      attempts++;
    }

    let count = await userRow.count();

    if (count === 0) {
      console.warn(
        `deleteUserOrganizationByEmail: User ${userEmail} not found in table after scrolling`,
      );
      await logOut(page);
      return;
    }

    // Delete all matching users (handles duplicates from previous failed runs)
    console.log(
      `deleteUserOrganizationByEmail: Found ${count} user(s) with email ${userEmail}, deleting all`,
    );

    while (count > 0) {
      const firstRow = userRow.first();
      const deleteButton = firstRow.getByRole("button", { name: /remove/i });

      await deleteButton.click({ timeout: 5000 });

      // bits-ui AlertDialog uses role="alertdialog"
      await page.waitForSelector('[role="alertdialog"]', { timeout: 5000 });

      const confirmButton = page
        .getByRole("alertdialog")
        .getByRole("button", { name: /confirm/i });
      await confirmButton.click({ timeout: 3000 });

      await firstRow.waitFor({ state: "detached", timeout: 10000 });

      count = await userRow.count();
      console.log(`deleteUserOrganizationByEmail: ${count} user(s) remaining`);
    }

    await logOut(page);
  } catch (error) {
    // Best effort cleanup — don't fail the test
    console.warn(`Failed to delete UserOrganization for ${userEmail}:`, error);

    try {
      await logOut(page);
    } catch {
      // Ignore logout errors during cleanup
    }
  }
}
