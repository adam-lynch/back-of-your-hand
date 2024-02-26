import capLng from "./capLng";
import ignoreError from "./ignoreError";
import type { LatLng } from "./types";

const getAreaCenterFromUrl = (
  urlSearchParams: URLSearchParams,
  regExpToRemove?: RegExp
): LatLng | void => {
  if (urlSearchParams.has("lat") && urlSearchParams.has("lng")) {
    const lat = urlSearchParams.get("lat");
    const lng = urlSearchParams.get("lng");
    if (
      !/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)/.test(lat) ||
      !/[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(lng)
    ) {
      return;
    }

    return ignoreError(() => ({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    }));
  }

  /* Legacy URL pattern... */

  let pathname = window.location.pathname;

  if (regExpToRemove) {
    pathname = pathname.replace(regExpToRemove, "");
  }

  const segments = pathname.split("/").filter(Boolean);
  const unparsedSegment = segments[0];

  if (unparsedSegment) {
    const unparsedValues = unparsedSegment.split(",");
    const unparsedLat = unparsedValues[0];
    const unparsedLng = unparsedValues[1];

    if (unparsedLat && unparsedLng) {
      const unparsedAreaCenter = unparsedLat + "," + unparsedLng;

      // https://news.ycombinator.com/item?id=30734921
      if (unparsedAreaCenter === "51.89863,-8.47039") {
        return;
      }

      if (
        /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(
          unparsedAreaCenter
        )
      ) {
        const areaCenterPieces = unparsedAreaCenter.split(",");

        if (areaCenterPieces.length) {
          return ignoreError(() => ({
            lat: parseFloat(areaCenterPieces[0]),
            lng: parseFloat(areaCenterPieces[1]),
          }));
        }
      }
    }
  }
};

const getAreaCenterFromStorage = (): LatLng | void => {
  const unparsedValue = ignoreError(() => localStorage.getItem("centerLatLng"));
  if (unparsedValue) {
    const parsedValue = ignoreError(() => JSON.parse(unparsedValue));
    if (parsedValue.lat && parsedValue.lng) {
      return parsedValue;
    }
  }
};

export default (urlSearchParams: URLSearchParams) => {
  // Did the user provide one in the URL?
  const result =
    getAreaCenterFromUrl(urlSearchParams, /^(?!\/?geo-lookup-done)/) ||
    // Did they play previously?
    getAreaCenterFromStorage() ||
    // Did the edge handler provide one?
    getAreaCenterFromUrl(urlSearchParams, /^\/?geo-lookup-done/) ||
    ({ lat: 51.89863, lng: -8.47039 } as LatLng);
  result.lng = capLng(result.lng);
  return result;
};
