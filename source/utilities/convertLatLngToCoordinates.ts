/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import isArray from "lodash/isArray";
import capLng from "./capLng";
import type {
  Coordinates,
  LatLng,
  PotentiallyNestedCoordinates,
  PotentiallyNestedLatLngs,
} from "../library/game/types";

const convertLatLngToCoordinates = (latlng: LatLng): Coordinates => [
  latlng.lat,
  capLng(latlng.lng),
];

export const convertLatLngsToCoordinates = (
  latLngs: PotentiallyNestedLatLngs,
): PotentiallyNestedCoordinates => {
  const result: PotentiallyNestedCoordinates = [];

  for (const item of latLngs) {
    if (isArray(item)) {
      result.push(
        convertLatLngsToCoordinates(item) as PotentiallyNestedCoordinates[0],
      );
    } else {
      result.push(convertLatLngToCoordinates(item));
    }
  }

  return result;
};

export default convertLatLngToCoordinates;
