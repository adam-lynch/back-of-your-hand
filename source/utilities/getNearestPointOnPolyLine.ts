import getDistance from "@turf/distance";
import createLineString from "turf-linestring";
import getNearestPointOnLine from "@turf/nearest-point-on-line";
import createPoint from "turf-point";
import convertCoordinatesToLatLng from "./convertCoordinatesToLatLng";
import convertLatLngToCoordinates from "./convertLatLngToCoordinates";
import type { LatLng } from "./types";

export default (latLng: LatLng, polyLinePoints: LatLng[][]): LatLng => {
  const firstItem = polyLinePoints
    .map((innerPolyLinePoints) => {
      const line = createLineString(
        innerPolyLinePoints.map(convertLatLngToCoordinates),
        {}
      );

      const point = createPoint(convertLatLngToCoordinates(latLng));
      const nearestPoint = getNearestPointOnLine.default(line, point);

      return {
        distanceFromPoint: getDistance.default(nearestPoint, point),
        nearestPoint,
      };
    })
    .sort((a, b) => a.distanceFromPoint - b.distanceFromPoint)
    .find(Boolean);

  return convertCoordinatesToLatLng(
    firstItem && firstItem.nearestPoint.geometry.coordinates
  );
};
