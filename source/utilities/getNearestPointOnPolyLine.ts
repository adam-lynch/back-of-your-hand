import leaflet from "leaflet";
import type { LatLng } from "./types";

export default (
  map: leaflet.Map,
  latLng: LatLng,
  polyLinePoints: LatLng[][]
): { distance: number; point: leaflet.Point } => {
  const point = map.latLngToLayerPoint(latLng);
  const flattenedPolyLinePoints = polyLinePoints.flat(1);

  let nearestPoint: leaflet.Point;
  let nearestPointDistance: number;

  for (let i = 1; i < flattenedPolyLinePoints.length; i++) {
    const previousPolyLinePoint = map.latLngToLayerPoint(
      flattenedPolyLinePoints[i - 1]
    );
    const currentPolyLinePoint = map.latLngToLayerPoint(
      flattenedPolyLinePoints[i]
    );

    const nearestPointOnSegment = leaflet.LineUtil.closestPointOnSegment(
      point,
      previousPolyLinePoint,
      currentPolyLinePoint
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
      `distance is not a number (${typeof nearestPointDistance})`
    );
  }

  return {
    distance: nearestPointDistance / 1000,
    point: nearestPoint,
  };
};
