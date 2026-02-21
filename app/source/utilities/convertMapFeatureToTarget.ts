/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import type { MapFeature } from "../api/resourceObjects";
import type { Question, LatLng } from "../library/game/types";
import convertPositionToLatLng from "./convertPositionToLatLng";

function convertCoordinateRing(ring: GeoJSON.Position[]): LatLng[] {
  return ring.map(convertPositionToLatLng);
}

export default function convertMapFeatureToTarget(
  mapFeature: MapFeature,
): Question["target"] {
  const { geom, name } = mapFeature.attributes;

  switch (geom.type) {
    case "Point":
      return {
        name,
        isEnclosedArea: false,
        points: [[convertPositionToLatLng(geom.coordinates)]],
      };

    case "Polygon":
      return {
        name,
        isEnclosedArea: true,
        points: geom.coordinates.map(convertCoordinateRing),
      };

    case "MultiPolygon":
      return {
        name,
        isEnclosedArea: true,
        points: geom.coordinates.flatMap((polygon) =>
          polygon.map(convertCoordinateRing),
        ),
      };

    default:
      throw new Error(
        `Unsupported geometry type: ${(geom as GeoJSON.Geometry).type}`,
      );
  }
}
