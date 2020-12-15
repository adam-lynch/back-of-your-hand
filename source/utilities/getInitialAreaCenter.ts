import ignoreError from "./ignoreError";
import type { LatLng } from "./types";

const getAreaCenterFromUrl = (): LatLng | void => {
  const [unparsedAreaCenter] = window.location.pathname
    .split("/")
    .filter(Boolean);
  if (
    unparsedAreaCenter &&
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

export default () =>
  getAreaCenterFromUrl() ||
  getAreaCenterFromStorage() ||
  ({ lat: 51.89863, lng: -8.47039 } as LatLng);
