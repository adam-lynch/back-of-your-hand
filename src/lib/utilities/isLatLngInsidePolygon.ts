/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import isPointInPolygon from "point-in-polygon";

import convertLatLngToCoordinates, {
  convertLatLngsToCoordinates,
} from "./convertLatLngToCoordinates";
import type { LatLng, PotentiallyNestedLatLngs } from "./types";

export default (
  latLng: LatLng,
  polygonPoints: PotentiallyNestedLatLngs,
): boolean => {
  const polygonCoordinates = convertLatLngsToCoordinates(polygonPoints);
  let safePolygonCoordinates: Parameters<typeof isPointInPolygon>[1];

  /*
    point-in-polygon doesn't like an unnecessary level; e.g:
    [
      [
        [ 1, 1 ], 
        [ 1, 2 ],
        [ 2, 2 ],
        [ 2, 1 ]
      ]
    ]
  */
  if (
    polygonCoordinates.length === 1 &&
    typeof polygonCoordinates[0] !== "number"
  ) {
    safePolygonCoordinates =
      polygonCoordinates[0] as typeof safePolygonCoordinates;
  } else {
    safePolygonCoordinates =
      polygonCoordinates as typeof safePolygonCoordinates;
  }

  try {
    return isPointInPolygon(
      convertLatLngToCoordinates(latLng),
      safePolygonCoordinates,
    );
  } catch (e) {
    return false;
  }
};
