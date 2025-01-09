/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import type * as GeoJSON from "geojson";
import * as turf from "@turf/turf";
import roundNumber from "./roundNumber";

export default function getBboxOfFeature(
  feature: GeoJSON.Feature,
  numberOfDecimalPointsToConsider: number = 4,
): {
  east: number;
  north: number;
  south: number;
  turfArray: number[];
  west: number;
} {
  let turfArray = turf.bbox(feature);
  if (numberOfDecimalPointsToConsider !== Infinity) {
    turfArray = turfArray.map((item) =>
      roundNumber(item, numberOfDecimalPointsToConsider),
    );
  }
  const [west, south, east, north] = turfArray;

  return {
    east,
    north,
    south,
    turfArray,
    west,
  };
}
