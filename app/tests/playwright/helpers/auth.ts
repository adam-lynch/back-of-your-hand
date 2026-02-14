/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import type { Page } from "@playwright/test";

export interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface Organization {
  subdomain: string;
  name: string;
  baseUrl: string;
}

export async function logIn(
  page: Page,
  org: Organization,
  user: TestUser,
): Promise<void> {
  await page.goto(org.baseUrl);
  await page.getByLabel(/email/i).fill(user.email);
  await page.getByLabel(/password/i).fill(user.password);
  await page.getByRole("button", { name: /log in/i }).click();
  await page.waitForURL((url) => !url.pathname.includes("/log-in"));
  await page.waitForLoadState("networkidle");
}

export async function logOut(page: Page): Promise<void> {
  // Check if popover is already open
  const logOutButton = page.getByRole("button", { name: /log out/i });
  const isLogOutVisible = await logOutButton.isVisible().catch(() => false);

  if (!isLogOutVisible) {
    // Use JS click to bypass visibility check on hamburger menu
    await page.evaluate(() => {
      const menuButton = document.querySelector(
        "header button.hamburger-button",
      );
      if (menuButton) {
        (menuButton as HTMLElement).click();
      }
    });
    await logOutButton.waitFor({ state: "visible", timeout: 5000 });
  }

  await logOutButton.click();

  await page.waitForURL(
    (url) =>
      url.pathname.includes("/log") ||
      url.pathname.includes("/accounts/logged-out"),
  );
}
