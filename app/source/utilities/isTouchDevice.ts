/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

// May not be 100% accurate
export default () => {
  if ("ontouchstart" in window || window.TouchEvent) return true;

  // @ts-expect-error ...
  if (window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }

  const prefixes = ["", "-webkit-", "-moz-", "-o-", "-ms-"];
  const queries = prefixes.map((prefix) => `(${prefix}touch-enabled)`);

  return window.matchMedia(queries.join(",")).matches;
};
