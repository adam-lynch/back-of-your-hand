import leaflet from "leaflet";
import convertLatLngToLayerPoint from "./convertLatLngToLayerPoint.ts";
import isLatLngInsidePolygon from "./isLatLngInsidePolygon";

import type { LatLng } from "./types";

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

  let nearestPoint: leaflet.Point;
  let nearestPointDistance: number;

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
    if (!nearestPoint || distanceFromPoint < nearestPointDistance) {
      nearestPoint = nearestPointOnSegment;
      nearestPointDistance = distanceFromPoint;
    }
  }

  if (!nearestPointDistance) {
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
