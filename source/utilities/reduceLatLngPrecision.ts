import roundNumber from "./roundNumber";
import type { LatLng } from "./types";

export default ({ lat, lng }: LatLng): LatLng => ({
  lat: roundNumber(lat, 5),
  lng: roundNumber(lng, 5),
});
