import isArray from "lodash/isarray";
import capLng from "./capLng";
import type {
  Coordinates,
  LatLng,
  PotentiallyNestedCoordinates,
  PotentiallyNestedLatLngs,
} from "./types";

const convertLatLngToCoordinates = (
  latlng: LatLng,
  manipulator: (coordinate: number) => number = (input) => input
): Coordinates => [manipulator(latlng.lat), manipulator(capLng(latlng.lng))];

export const convertLatLngsToCoordinates = (
  latLngs: PotentiallyNestedLatLngs,
  manipulator: (coordinate: number) => number = (input) => input
): PotentiallyNestedCoordinates => {
  const result: PotentiallyNestedCoordinates = [];

  for (const item of latLngs) {
    if (isArray(item)) {
      result.push(
        convertLatLngsToCoordinates(
          item,
          manipulator
        ) as PotentiallyNestedCoordinates[0]
      );
    } else {
      result.push(convertLatLngToCoordinates(item, manipulator));
    }
  }

  return result;
};

export default convertLatLngToCoordinates;
