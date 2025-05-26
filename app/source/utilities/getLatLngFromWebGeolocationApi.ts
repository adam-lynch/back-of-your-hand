/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import capLng from "./capLng";
import ignoreError from "./ignoreError";
import type { LatLng } from "../library/game/types";

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
          localStorage.removeItem("lastKnownWebGeolocationPermissionState"),
        );
        reject(e);
      },
      {
        enableHighAccuracy: true,
      },
    );
  });
};
