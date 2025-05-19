/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import * as svelteStore from "svelte/store";
import get from "lodash/get";
import isObject from "lodash/isObject";
import set from "lodash/set";

export default function enableAutoSaving<TValue, TWritableValue = unknown>({
  fallbackValue,
  getValue,
  onWritableUpdated,
  setValue,
  writable,
  writableSelector,
}: {
  fallbackValue: TValue;
  getValue: () => TValue | undefined;
  onWritableUpdated?: (
    changes: Partial<TWritableValue>,
    updatedWritableValue: TWritableValue,
  ) => void;
  setValue: (newValue: TValue) => void;
  writable: svelteStore.Writable<TWritableValue>;
  writableSelector?: string;
}): {
  onChange: () => void;
  unsubscribe: () => void;
} {
  function onChange() {
    writable.update((draft) => {
      let changes: Partial<TWritableValue> = {};

      const newValue = getValue() || fallbackValue;
      if (writableSelector && isObject(draft)) {
        set(draft, writableSelector, newValue);
        set(changes, writableSelector, newValue);
      } else {
        const newWritableValue = newValue as unknown as TWritableValue;
        draft = newWritableValue;
        changes = newWritableValue;
      }

      onWritableUpdated?.(changes, draft);

      return draft;
    });
  }

  const unsubscribe = writable.subscribe((valueFromStore) => {
    const selectedValue = writableSelector
      ? get(valueFromStore, writableSelector)
      : valueFromStore;
    setValue(selectedValue || fallbackValue);
  });

  return {
    onChange,
    unsubscribe,
  };
}
