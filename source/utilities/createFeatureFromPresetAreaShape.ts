/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import * as turf from "@turf/turf";
import type * as GeoJSON from "geojson";
import { PresetAreaShape } from "../library/game/types";

export default function createFeatureFromPresetAreaShape(
  presetAreaShape: PresetAreaShape,
  centerPosition: GeoJSON.Position,
  radius: number,
): GeoJSON.Feature<GeoJSON.Polygon> {
  if (presetAreaShape === PresetAreaShape.Circle) {
    return turf.circle(turf.point(centerPosition), radius / 1000);
  }

  if (presetAreaShape === PresetAreaShape.Square) {
    const radiusInDegrees = radius / 111320;
    const squareBbox = [
      centerPosition[0] - radiusInDegrees, // xmin (longitude - radius)
      centerPosition[1] - radiusInDegrees, // ymin (latitude - radius)
      centerPosition[0] + radiusInDegrees, // xmax (longitude + radius)
      centerPosition[1] + radiusInDegrees, // ymax (latitude + radius)
    ];
    return turf.bboxPolygon(squareBbox);
  }

  throw new Error(`Unexpected shape ${presetAreaShape}"`);
}
