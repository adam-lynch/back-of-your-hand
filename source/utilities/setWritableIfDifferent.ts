/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import isEqual from "lodash/isEqual";
import { get, type Writable } from "svelte/store";

export default function setWritableIfDifferent<T>(
  store: Writable<T>,
  value: T,
  debugName?: string,
) {
  const oldValue = get(store);
  if (debugName) {
    console.debug(`[${debugName}]`, {
      oldValue,
      newValue: value,
      isEqual: isEqual(oldValue, value),
    });
  }
  if (!isEqual(oldValue, value)) {
    store.set(value);
  }
}
