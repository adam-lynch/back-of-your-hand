/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import { isEqual } from "lodash";
import { type Readable } from "svelte/store";

export default function subscribeIfNotDeepEqual<T>(
  store: Readable<T>,
  callback: Parameters<typeof store.subscribe>[0],
  debugName?: string,
) {
  let oldValue: T;

  store.subscribe((newValue) => {
    if (!isEqual(oldValue, newValue)) {
      if (debugName) {
        console.debug(`[${debugName}] changed`, oldValue, newValue);
      }
      callback(newValue);
      oldValue = newValue;
    } else if (debugName) {
      console.debug(`[${debugName}] NOT changed`, oldValue, newValue);
    }
  });
}
