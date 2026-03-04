/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { describe, expect, it, vi } from "vitest";
import { writable } from "svelte/store";

import prettifyDistance from "../../../source/library/utilities/prettifyDistance";

vi.mock("../../../source/userData/store", () => ({
  isOrganizationUrl: writable(false),
}));

const { isOrganizationUrl } = await import("../../../source/userData/store");

describe("prettifyDistance", () => {
  describe("metric", () => {
    it("shows metres for small distances", () => {
      isOrganizationUrl.set(false);
      expect(prettifyDistance(100)).toBe("100 metres");
    });

    it("shows 1 metre (singular)", () => {
      isOrganizationUrl.set(false);
      expect(prettifyDistance(1)).toBe("1 metre");
    });

    it("switches to kilometres above 750m", () => {
      isOrganizationUrl.set(false);
      expect(prettifyDistance(750)).toBe("750 metres");
      expect(prettifyDistance(751)).toBe("0.8 kilometres");
    });

    it("shows kilometres with one decimal place", () => {
      isOrganizationUrl.set(false);
      expect(prettifyDistance(2500)).toBe("2.5 kilometres");
    });
  });

  describe("imperial", () => {
    it("converts metres to feet", () => {
      isOrganizationUrl.set(true);
      expect(prettifyDistance(100)).toBe("328 feet");
    });

    it("shows 1 foot (singular)", () => {
      isOrganizationUrl.set(true);
      expect(prettifyDistance(1 / 3.28084)).toBe("1 foot");
    });

    it("switches to miles above 3960 feet (75% of a mile)", () => {
      isOrganizationUrl.set(true);
      const justUnderThreshold = 3960 / 3.28084;
      const justOverThreshold = 3961 / 3.28084;
      expect(prettifyDistance(justUnderThreshold)).toBe("3,960 feet");
      expect(prettifyDistance(justOverThreshold)).toMatch(/miles$/);
    });

    it("shows miles with one decimal place", () => {
      isOrganizationUrl.set(true);
      const twoMilesInMetres = (2 * 5280) / 3.28084;
      expect(prettifyDistance(twoMilesInMetres)).toBe("2 miles");
    });
  });
});
