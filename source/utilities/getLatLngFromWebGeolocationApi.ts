import capLng from "./capLng";
import type { LatLng } from "./types";

export default async (): Promise<LatLng> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const latLng = {
          lat: coords.latitude,
          lng: capLng(coords.longitude),
        };
        // TODO: set in localStorage
        resolve(latLng);
      },
      reject,
      {
        enableHighAccuracy: true,
      }
    );
  });
};
