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
import { clickMapCenter, playThroughRound } from "../helpers/map";

const organization = organizations.example1;
const user = example1Users.standardUser;

const mapFeatureNames = [
  "Fire Station Alpha",
  "Police Headquarters",
  "City Library",
  "Central Park",
  "Main Hospital",
];

const emptyOverpassData = {
  data: [
    {
      type: "areaOverpassData",
      id: "mock-overpass",
      attributes: {
        responseBody: { elements: [] },
      },
    },
  ],
  meta: { pagination: { count: 1, page: 1, pages: 1 } },
};

const mapFeatures = {
  data: mapFeatureNames.map((name, index) => ({
    type: "mapFeature",
    id: `mock-map-feature-${index}`,
    attributes: {
      name,
      geom: {
        type: "Point",
        coordinates: [-8.5 + index * 0.005, 51.89 + index * 0.002],
      },
      origin: "user",
      tags: {},
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    relationships: {
      createdBy: { data: null },
    },
  })),
  meta: { pagination: { count: mapFeatureNames.length, page: 1, pages: 1 } },
};

function setUpMapFeatureOnlyRoutes(page: import("@playwright/test").Page) {
  page.route("**/api/areaoverpassdatas*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/vnd.api+json",
      body: JSON.stringify(emptyOverpassData),
    });
  });

  page.route("**/api/mapfeatures?*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/vnd.api+json",
      body: JSON.stringify(mapFeatures),
    });
  });
}

test.describe("Points of Interest Gameplay Integration", () => {
  test("round starts with map features only", async ({ page }) => {
    await logIn(page, organization, user);
    setUpMapFeatureOnlyRoutes(page);

    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: /play solo/i }).click();

    const confirmButton = page.getByRole("button", { name: /confirm/i });
    await expect(confirmButton).toBeVisible({ timeout: 10000 });

    const streetName = page.locator(".street-name");
    await expect(streetName).toBeVisible({ timeout: 5000 });
    const questionText = await streetName.textContent();
    expect(mapFeatureNames).toContain(questionText?.trim());
  });

  test("can complete a round with only map features", async ({ page }) => {
    await logIn(page, organization, user);
    setUpMapFeatureOnlyRoutes(page);

    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: /play solo/i }).click();

    const confirmButton = page.getByRole("button", { name: /confirm/i });
    await expect(confirmButton).toBeVisible({ timeout: 10000 });

    await playThroughRound(page);
  });

  test("map feature names appear in round summary", async ({ page }) => {
    await logIn(page, organization, user);
    setUpMapFeatureOnlyRoutes(page);

    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: /play solo/i }).click();

    const confirmButton = page.getByRole("button", { name: /confirm/i });
    await expect(confirmButton).toBeVisible({ timeout: 10000 });

    await playThroughRound(page);

    await page.getByRole("button", { name: /view summary/i }).click();

    const summaryNames = page.locator(".results-list__street-name");
    await expect(summaryNames.first()).toBeVisible({ timeout: 5000 });
    const count = await summaryNames.count();
    expect(count).toBeGreaterThanOrEqual(1);

    for (let i = 0; i < count; i++) {
      const text = await summaryNames.nth(i).textContent();
      expect(mapFeatureNames).toContain(text?.trim());
    }
  });

  test("point feature renders as circle marker on reveal", async ({ page }) => {
    await logIn(page, organization, user);
    setUpMapFeatureOnlyRoutes(page);

    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: /play solo/i }).click();

    const confirmButton = page.getByRole("button", { name: /confirm/i });
    await expect(confirmButton).toBeVisible({ timeout: 10000 });

    const mapElement = page.getByTestId("game-map");
    await clickMapCenter(mapElement);
    await expect(confirmButton).toBeEnabled({ timeout: 5000 });
    await confirmButton.click();

    const nextButton = page.getByRole("button", { name: /next/i });
    const startNewRoundButton = page.getByRole("button", {
      name: /start a new round/i,
    });
    await expect(nextButton.or(startNewRoundButton)).toBeVisible({
      timeout: 10000,
    });

    const circleMarkers = mapElement.locator(
      'path.leaflet-interactive[fill-opacity]:not([fill-opacity="0"])',
    );
    await expect(circleMarkers).toHaveCount(1, { timeout: 5000 });
  });
});
