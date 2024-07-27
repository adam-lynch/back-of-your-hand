import isArray from "lodash/isArray";
import capLng from "./capLng";
import type {
  Coordinates,
  LatLng,
  PotentiallyNestedCoordinates,
  PotentiallyNestedLatLngs,
} from "./types";

const convertLatLngToCoordinates = (latlng: LatLng): Coordinates => [
  latlng.lat,
  capLng(latlng.lng),
];

export const convertLatLngsToCoordinates = (
  latLngs: PotentiallyNestedLatLngs,
): PotentiallyNestedCoordinates => {
  const result: PotentiallyNestedCoordinates = [];

  for (const item of latLngs) {
    if (isArray(item)) {
      result.push(
        convertLatLngsToCoordinates(item) as PotentiallyNestedCoordinates[0],
      );
    } else {
      result.push(convertLatLngToCoordinates(item));
    }
  }

  return result;
};

export default convertLatLngToCoordinates;
