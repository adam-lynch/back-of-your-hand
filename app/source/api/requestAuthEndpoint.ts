/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import api from "./index";

export default async function requestAuthEndpoint<TSuccessfulResponsePayload>(
  path: string,
  options?: Parameters<typeof api.requestApi>[1],
) {
  const fixedPath = path.endsWith("/") ? path : path + "/";
  return api.requestApi<TSuccessfulResponsePayload>(fixedPath, {
    headers: {
      "Content-Type": "application/json",
    },
    urlPrefix: "auth",
    ...options,
  });
}
