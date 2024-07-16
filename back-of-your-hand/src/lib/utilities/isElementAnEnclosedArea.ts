import type { LatLng, Overpass } from "./types";

export default (element: Overpass.Element, points: LatLng[][]) => {
  if (element.tags.area == "yes") {
    return true;
  }

  const flattenedPoints = points.flat(2);
  const lastIndex = points.length - 1;

  return (
    flattenedPoints[0].lat === flattenedPoints[lastIndex].lat &&
    flattenedPoints[0].lng === flattenedPoints[lastIndex].lng
  );
};
