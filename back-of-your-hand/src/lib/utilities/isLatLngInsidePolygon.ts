import isPointInPolygon from "point-in-polygon";

import convertLatLngToCoordinates, {
  convertLatLngsToCoordinates,
} from "./convertLatLngToCoordinates";
import type { Coordinates, LatLng, PotentiallyNestedLatLngs } from "./types";

export default (
  latLng: LatLng,
  polygonPoints: PotentiallyNestedLatLngs,
): boolean => {
  let polygonCoordinates = convertLatLngsToCoordinates(polygonPoints);

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
    polygonCoordinates = polygonCoordinates[0] as
      | Coordinates[]
      | Coordinates[][];
  }

  try {
    return isPointInPolygon(
      convertLatLngToCoordinates(latLng),
      polygonCoordinates,
    );
  } catch (e) {
    return false;
  }
};
