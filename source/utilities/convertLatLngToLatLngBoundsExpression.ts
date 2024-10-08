/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import leaflet from "leaflet";
import turfDestination from "@turf/destination";
// @ts-expect-error no types provided
import createTurfPoint from "turf-point";

import type { LatLng } from "./types";

function movePoint(
  point: GeoJSON.Feature<GeoJSON.Point>,
  distance: number,
  angle: number,
): GeoJSON.Feature<GeoJSON.Point> {
  // @ts-expect-error the type incorrectly says that 4th argument must be a string
  return turfDestination(point, distance, angle, { units: "meters" });
}

export default function convertLatLngToLatLngBoundsExpression(
  center: LatLng,
  extent: number,
): leaflet.LatLngBoundsExpression {
  const centerPoint = createTurfPoint([center.lng, center.lat]);

  const north = movePoint(centerPoint, extent, 0);
  const south = movePoint(centerPoint, extent, 180);
  const east = movePoint(centerPoint, extent, 90);
  const west = movePoint(centerPoint, extent, 270);

  const southWest: leaflet.LatLngTuple = [
    south.geometry.coordinates[1],
    west.geometry.coordinates[0],
  ];
  const northEast: leaflet.LatLngTuple = [
    north.geometry.coordinates[1],
    east.geometry.coordinates[0],
  ];

  return [southWest, northEast];
}
