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

const mapFeatures = [
  { name: "Hutchinson High School", region: "hutchinson", isInPhase1: false },
  { name: "City Hall", region: "hutchinson", isInPhase1: false },
  {
    name: "Hutchinson Regional Medical Center",
    region: "hutchinson",
    isInPhase1: false,
  },
  {
    name: "Hutchinson Community College",
    region: "hutchinson",
    isInPhase1: false,
  },
  { name: "Reno Valley Middle School", region: "hutchinson", isInPhase1: true },
  { name: "Western Gateway Building", region: "cork", isInPhase1: false },
  { name: "Cork University Hospital", region: "cork", isInPhase1: false },
] as const;

test.describe("Points of Interest Area Filtering", () => {
  test.setTimeout(120_000);

  test("predefined area filters map features by area_id", async ({ page }) => {
    await logIn(page, organization, user);

    await expect(page.getByTestId("game-map")).toBeVisible({ timeout: 10000 });

    const configureButton = page.getByRole("button", { name: /configure/i });
    await configureButton.click();

    const numberOfQuestionsInput = page.locator("#numberOfQuestionsInput");
    await numberOfQuestionsInput.fill("50");

    const areaCombobox = page.getByLabel("Area", { exact: true });
    await expect(areaCombobox).toBeVisible({ timeout: 10000 });

    await areaCombobox.selectOption({ label: "Phase 1" });

    await page.getByRole("button", { name: /play solo/i }).click();

    const confirmButton = page.getByRole("button", { name: /confirm/i });
    await expect(confirmButton).toBeVisible({ timeout: 30000 });

    await playThroughRound(page, { maxIterations: 55 });

    await page.getByRole("button", { name: /view summary/i }).click();

    const summaryNames = page.locator(".results-list__street-name");
    await expect(summaryNames.first()).toBeVisible({ timeout: 5000 });
    const count = await summaryNames.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const allNames: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await summaryNames.nth(i).textContent();
      if (text) {
        allNames.push(text.trim());
      }
    }

    for (const feature of mapFeatures) {
      const appeared = allNames.includes(feature.name);
      if (feature.isInPhase1) {
        expect(appeared, `"${feature.name}" should appear`).toBe(true);
      } else {
        expect(appeared, `"${feature.name}" should not appear`).toBe(false);
      }
    }
  });

  for (const shape of ["Circle", "Square"] as const) {
    test(`${shape.toLowerCase()} custom area filters map features by ${shape === "Circle" ? "circle" : "bbox"}`, async ({
      page,
    }) => {
      await logIn(page, organization, user);

      await expect(page.getByTestId("game-map")).toBeVisible({
        timeout: 10000,
      });

      const configureButton = page.getByRole("button", {
        name: /configure/i,
      });
      await configureButton.click();

      const numberOfQuestionsInput = page.locator("#numberOfQuestionsInput");
      await numberOfQuestionsInput.fill("50");

      const areaCombobox = page.getByLabel("Area", { exact: true });
      await expect(areaCombobox).toBeVisible({ timeout: 10000 });

      await areaCombobox.selectOption({ label: "Custom" });

      const areaShapeCombobox = page.getByLabel("Area shape");
      await expect(areaShapeCombobox).toBeVisible({ timeout: 10000 });

      await areaShapeCombobox.selectOption({ label: shape });

      const radiusSlider = page.locator("#radiusSlider");
      await expect(radiusSlider).toBeVisible({ timeout: 10000 });
      await radiusSlider.fill("500");

      const mapElement = page.getByTestId("game-map");

      await page.evaluate(() => {
        const mapContainer = document.querySelector('[data-testid="game-map"]');
        const leafletMap = (
          mapContainer as unknown as {
            _leafletMap?: { fire: (type: string, data: unknown) => void };
          }
        )?._leafletMap;
        if (!leafletMap) {
          throw new Error("Leaflet map instance not found on game-map element");
        }
        leafletMap.fire("click", {
          latlng: { lat: 38.068, lng: -97.9145 },
        });
      });

      await expect(mapElement).not.toHaveAttribute("data-is-zooming", {
        timeout: 10000,
      });

      await page.getByRole("button", { name: /play solo/i }).click();

      const confirmButton = page.getByRole("button", { name: /confirm/i });
      await expect(confirmButton).toBeVisible({ timeout: 30000 });

      const streetName = page.locator(".street-name");
      const nextButton = page.getByRole("button", { name: /next/i });
      const startNewRoundButton = page.getByRole("button", {
        name: /start a new round/i,
      });

      const expectedFeatureName = "Hutchinson High School";
      let hasFoundExpectedFeature = false;
      const MAX_ITERATIONS = 50;

      for (let i = 0; i < MAX_ITERATIONS; i++) {
        await expect(streetName).toBeVisible({ timeout: 5000 });
        const questionText = (await streetName.textContent())?.trim();

        if (questionText === expectedFeatureName) {
          hasFoundExpectedFeature = true;
          break;
        }

        await clickMapCenter(mapElement);
        await expect(confirmButton).toBeEnabled({ timeout: 5000 });
        await confirmButton.click();

        await expect(nextButton.or(startNewRoundButton)).toBeVisible({
          timeout: 10000,
        });

        const isRoundComplete = await startNewRoundButton
          .isVisible({ timeout: 100 })
          .catch(() => false);

        if (isRoundComplete) {
          break;
        }

        await nextButton.click();
      }

      expect(
        hasFoundExpectedFeature,
        `"${expectedFeatureName}" should appear during gameplay`,
      ).toBe(true);
    });
  }
});
