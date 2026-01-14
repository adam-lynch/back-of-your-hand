/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import { describe, expect, it } from "vitest";

import capNumber from "../../source/utilities/capNumber";

describe("capNumber", () => {
  it("caps values within the provided range", () => {
    expect(capNumber(10, -180, 180)).toBe(10);
    expect(capNumber(181, -180, 180)).toBe(-179);
    expect(capNumber(-181, -180, 180)).toBe(179);
  });
});
