/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import leaflet from "leaflet";
import convertLatLngToLayerPoint from "./convertLatLngToLayerPoint.ts.js";
import isLatLngInsidePolygon from "./isLatLngInsidePolygon.js";

import type { LatLng } from "../library/game/types.js";

export default async (
  map: leaflet.Map,
  latLng: LatLng,
  polyLinePoints: LatLng[][],
): Promise<
  | { distance: number; latLng: leaflet.LatLng }
  | { distance: 0; latLng?: leaflet.LatLng }
> => {
  if (isLatLngInsidePolygon(latLng, polyLinePoints)) {
    return { distance: 0 };
  }

  const point = await convertLatLngToLayerPoint(latLng, map);
  const flattenedPolyLinePoints = polyLinePoints.flat(1);

  let nearestPoint: leaflet.Point | undefined;
  let nearestPointDistance: number | undefined;

  for (let i = 1; i < flattenedPolyLinePoints.length; i++) {
    const [previousPolyLinePoint, currentPolyLinePoint] = await Promise.all([
      convertLatLngToLayerPoint(flattenedPolyLinePoints[i - 1], map),
      convertLatLngToLayerPoint(flattenedPolyLinePoints[i], map),
    ]);

    const nearestPointOnSegment = leaflet.LineUtil.closestPointOnSegment(
      point,
      previousPolyLinePoint,
      currentPolyLinePoint,
    );

    const distanceFromPoint = map
      .layerPointToLatLng(nearestPointOnSegment)
      .distanceTo(latLng);
    if (
      !nearestPoint ||
      typeof nearestPointDistance === "undefined" ||
      distanceFromPoint < nearestPointDistance
    ) {
      nearestPoint = nearestPointOnSegment;
      nearestPointDistance = distanceFromPoint;
    }
  }

  if (!nearestPoint || !nearestPointDistance) {
    throw new Error("No nearest point found");
  }

  if (typeof nearestPointDistance !== "number") {
    throw new Error(
      `distance is not a number (${typeof nearestPointDistance})`,
    );
  }

  return {
    distance: nearestPointDistance / 1000,
    latLng: map.layerPointToLatLng(nearestPoint),
  };
};
