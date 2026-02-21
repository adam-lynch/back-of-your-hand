/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import { describe, expect, it } from "vitest";

import getRandomNumberGenerator from "../../../source/utilities/getRandomNumberGenerator";

describe("getRandomNumberGenerator", () => {
  it("produces the same sequence for the same seed", () => {
    const generatorA = getRandomNumberGenerator("TESTSEED");
    const generatorB = getRandomNumberGenerator("TESTSEED");

    const sequenceA = Array.from({ length: 10 }, () => generatorA());
    const sequenceB = Array.from({ length: 10 }, () => generatorB());

    expect(sequenceA).toEqual(sequenceB);
  });

  it("a consumed generator produces different values than a fresh one with the same seed", () => {
    const consumed = getRandomNumberGenerator("TESTSEED");
    for (let i = 0; i < 5; i++) {
      consumed();
    }

    const fresh = getRandomNumberGenerator("TESTSEED");

    expect(consumed()).not.toEqual(fresh());
  });
});
