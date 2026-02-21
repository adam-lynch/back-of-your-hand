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

test.describe("Points of Interest Settings", () => {
  test("admin can access settings page", async ({ page }) => {
    await logIn(page, organization, example1Users.admin);

    await page.goto(organization.baseUrl + "/settings/points-of-interest");

    await expect(
      page.getByRole("heading", { name: /points of interest/i }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /add/i })).toBeVisible();
  });

  test("list shows all map features", async ({ page }) => {
    await logIn(page, organization, example1Users.admin);

    await page.goto(organization.baseUrl + "/settings/points-of-interest");

    await expect(
      page.getByRole("heading", { name: /points of interest/i }),
    ).toBeVisible();
    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 10000 });

    await expect(page.getByText("Western Gateway Building")).toBeVisible();
    await expect(page.getByText("Cork University Hospital")).toBeVisible();
    await expect(page.getByText("Hutchinson High School")).toBeVisible();
    await expect(page.getByText("City Hall")).toBeVisible();
    await expect(
      page.getByText("Hutchinson Regional Medical Center"),
    ).toBeVisible();
    await expect(page.getByText("Hutchinson Community College")).toBeVisible();
  });

  test("can open create modal", async ({ page }) => {
    await logIn(page, organization, example1Users.admin);

    await page.goto(organization.baseUrl + "/settings/points-of-interest");

    await page.getByRole("button", { name: /add/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/latitude/i)).toBeVisible();
    await expect(page.getByLabel(/longitude/i)).toBeVisible();
  });

  test("create modal validates required fields", async ({ page }) => {
    await logIn(page, organization, example1Users.admin);

    await page.goto(organization.baseUrl + "/settings/points-of-interest");

    await page.getByRole("button", { name: /add/i }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: /^add$/i }).click();

    const nameField = dialog.locator(".field", {
      has: page.locator('input[name="name"]'),
    });
    const latitudeField = dialog.locator(".field", {
      has: page.locator('input[name="latitude"]'),
    });
    const longitudeField = dialog.locator(".field", {
      has: page.locator('input[name="longitude"]'),
    });

    await expect(nameField.getByText("Name is a required field")).toBeVisible({
      timeout: 5000,
    });
    await expect(
      latitudeField.getByText("Latitude is a required field"),
    ).toBeVisible({ timeout: 5000 });
    await expect(
      longitudeField.getByText("Longitude is a required field"),
    ).toBeVisible({ timeout: 5000 });
  });

  test("create modal validates non-numeric coordinates", async ({ page }) => {
    await logIn(page, organization, example1Users.admin);

    await page.goto(organization.baseUrl + "/settings/points-of-interest");

    await page.getByRole("button", { name: /add/i }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog.getByLabel(/name/i).fill("Test Feature");
    await dialog.getByLabel(/latitude/i).fill("abc");
    await dialog.getByLabel(/longitude/i).fill("xyz");
    await dialog.getByRole("button", { name: /^add$/i }).click();

    const latitudeField = dialog.locator(".field", {
      has: page.locator('input[name="latitude"]'),
    });
    const longitudeField = dialog.locator(".field", {
      has: page.locator('input[name="longitude"]'),
    });

    await expect(
      latitudeField.getByText("Latitude must be a number"),
    ).toBeVisible({ timeout: 5000 });
    await expect(
      longitudeField.getByText("Longitude must be a number"),
    ).toBeVisible({ timeout: 5000 });
  });

  test("create modal validates coordinate range", async ({ page }) => {
    await logIn(page, organization, example1Users.admin);

    await page.goto(organization.baseUrl + "/settings/points-of-interest");

    await page.getByRole("button", { name: /add/i }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog.getByLabel(/name/i).fill("Test Feature");
    await dialog.getByLabel(/latitude/i).fill("999");
    await dialog.getByLabel(/longitude/i).fill("-6.25");
    await dialog.getByRole("button", { name: /^add$/i }).click();

    await expect(
      dialog.getByText("Latitude must be between -90 and 90"),
    ).toBeVisible({ timeout: 5000 });
  });

  test("standard user cannot access settings page", async ({ page }) => {
    await logIn(page, organization, example1Users.standardUser);

    await page.goto(organization.baseUrl + "/settings/points-of-interest");

    await expect(
      page.getByRole("heading", { name: /access denied/i }),
    ).toBeVisible();
    await expect(page.getByText(/you do not have permission/i)).toBeVisible();
  });
});
