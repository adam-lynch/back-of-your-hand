/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import type { LatLng, Overpass } from "./types";

export default (element: Overpass.Element, points: LatLng[][]) => {
  if (element.tags.area == "yes") {
    return true;
  }

  const flattenedPoints = points.flat(2);
  const lastIndex = points.length - 1;

  return (
    flattenedPoints[0].lat === flattenedPoints[lastIndex].lat &&
    flattenedPoints[0].lng === flattenedPoints[lastIndex].lng
  );
};
