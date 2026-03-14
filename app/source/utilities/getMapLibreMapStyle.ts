/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import * as versatilesStyles from "@versatiles/style";

type Options = Omit<
  NonNullable<Parameters<typeof versatilesStyles.colorful>[0]>,
  "baseUrl"
>;

export default function getMapLibreMapStyle(options?: Options) {
  return versatilesStyles.colorful({
    ...options,
    baseUrl: "https://tiles.versatiles.org/tiles/osm",
  });
}
