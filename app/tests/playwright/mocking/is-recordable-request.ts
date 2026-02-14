/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { OVERPASS_ENDPOINTS } from "../../../source/utilities/overpassEndpoints";

const overpassHosts = new Set(
  OVERPASS_ENDPOINTS.map((ep) => new URL(ep.url).hostname),
);

const BACKEND_DOMAIN_RE = /local-backofyourhand--backend\.com$/;

export default function isRecordableRequest(url: string): boolean {
  const { hostname, pathname } = new URL(url);

  // Backend API calls (excludes /__static/ which serves large binary assets)
  if (BACKEND_DOMAIN_RE.test(hostname)) {
    return (
      pathname.startsWith("/api/") ||
      pathname.startsWith("/auth/") ||
      pathname.startsWith("/open/")
    );
  }

  // Overpass API calls
  if (overpassHosts.has(hostname)) {
    return true;
  }

  return false;
}
