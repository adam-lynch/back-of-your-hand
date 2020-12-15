import type { LatLng, Overpass } from "./types";

export default ({ lat, lon }: Overpass.LatLng): LatLng => ({ lat, lng: lon });
