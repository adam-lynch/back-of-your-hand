/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import delay from "./delay";

function getStatusUrl(interpreterUrl: string): string {
  return interpreterUrl.replace(/\/interpreter$/, "/status");
}

function parseSecondsUntilSlot(statusText: string): number | null {
  const match = statusText.match(/Slot available after: .+, in (\d+) seconds/);
  if (match) {
    return parseInt(match[1], 10);
  }
  if (/\d+ slots available now/.test(statusText)) {
    return null;
  }
  return null;
}

// Helps us stay within rate limits during tests for example
export default async function waitForOverpassSlot(
  interpreterUrl: string,
): Promise<void> {
  if (!import.meta.env.DEV || typeof window === "undefined") {
    return;
  }

  const statusUrl = getStatusUrl(interpreterUrl);

  for (let checks = 0; checks < 10; checks++) {
    try {
      const response = await fetch(statusUrl);
      const text = await response.text();
      const waitSeconds = parseSecondsUntilSlot(text);

      if (waitSeconds === null) {
        return;
      }

      const waitMs = (waitSeconds + 1) * 1000;
      console.debug(
        `Overpass rate-limited, waiting ${waitSeconds + 1}s (${statusUrl})`,
      );
      await delay(waitMs);
    } catch {
      return;
    }
  }
}
