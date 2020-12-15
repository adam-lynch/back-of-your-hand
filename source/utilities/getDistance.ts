import getDistance from "@turf/distance";
import convertLatLngToCoordinates from "./convertLatLngToCoordinates";
import type { LatLng } from "./types";

export default (latLngA: LatLng, latLngB: LatLng): number =>
  getDistance.default(
    convertLatLngToCoordinates(latLngA),
    convertLatLngToCoordinates(latLngB)
  );
