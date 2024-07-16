import type leaflet from "leaflet";

import type { LatLng } from "./types";
import waitForAnyOngoingZoomsToEnd from "./waitForAnyOngoingZoomsToEnd";

export default async (
  latLng: LatLng,
  map: leaflet.Map
): Promise<ReturnType<typeof map.latLngToLayerPoint>> => {
  await waitForAnyOngoingZoomsToEnd(); // latLngToLayerPoint will error otherwise
  return map.latLngToLayerPoint(latLng);
};
