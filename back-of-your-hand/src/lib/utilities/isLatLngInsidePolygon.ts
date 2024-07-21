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
