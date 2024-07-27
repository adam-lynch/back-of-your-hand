/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

// Return a value between min and max
export default (input: number, min: number, max: number): number => {
  let result = input;
  const rangeDifference = max - min;
  while (result < min) {
    result += rangeDifference;
  }
  while (result > max) {
    result -= rangeDifference;
  }
  return result;
};
