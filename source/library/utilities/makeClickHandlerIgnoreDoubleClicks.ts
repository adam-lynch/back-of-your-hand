/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2025 Adam Lynch (https://adamlynch.com)
 */

import { throttle } from "lodash";

export default function makeClickHandlerIgnoreDoubleClicks(
  clickHandler: (event: CustomEvent) => unknown,
) {
  return throttle(clickHandler, 300, { leading: true, trailing: false });
}
