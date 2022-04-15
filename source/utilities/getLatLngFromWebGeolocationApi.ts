import capLng from "./capLng";
import ignoreError from "./ignoreError";
import type { LatLng } from "./types";

export default async (): Promise<LatLng> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (result) => {
        const latLng = {
          lat: result.coords.latitude,
          lng: capLng(result.coords.longitude),
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
