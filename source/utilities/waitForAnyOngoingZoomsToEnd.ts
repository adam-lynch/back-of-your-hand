/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import { get } from "svelte/store";

import { isZooming } from "../library/store";

/*
  This isn't bad but it's not 100% reliable. Just test your use case a good bit
*/
export default async (): Promise<void> => {
  if (!get(isZooming)) {
    return;
  }

  await new Promise<void>((resolve) => {
    const unsubscribe = isZooming.subscribe((value) => {
      if (value) {
        return;
      }
      const onDone = () => {
        if (!unsubscribe) {
          setTimeout(onDone);
          return;
        }
        unsubscribe();
        setTimeout(resolve, 50);
      };
      onDone();
    });
  });
};
