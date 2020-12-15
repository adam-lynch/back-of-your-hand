import type { Coordinates, LatLng } from "./types";

export default (latlng: LatLng): Coordinates => [latlng.lat, latlng.lng];
