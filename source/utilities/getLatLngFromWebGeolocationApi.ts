import capLng from "./capLng";
import ignoreError from "./ignoreError";
import type { LatLng } from "./types";

export default async (): Promise<LatLng> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const latLng = {
          lat: coords.latitude,
          lng: capLng(coords.longitude),
        };
        resolve(latLng);
      },
      (e) => {
        ignoreError(() =>
          localStorage.removeItem("lastKnownWebGeolocationPermissionState")
        );
        reject(e);
      },
      {
        enableHighAccuracy: true,
      }
    );
  });
};
