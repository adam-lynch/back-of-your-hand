/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

export type OverpassEndpoint = {
  id: string;
  url: string;
};

export const OVERPASS_ENDPOINTS: OverpassEndpoint[] = [
  {
    id: "overpass-primary",
    url: "https://www.overpass-api.de/api/interpreter",
  },
  {
    id: "overpass-z",
    url: "https://z.overpass-api.de/api/interpreter",
  },
  {
    id: "overpass-lz4",
    url: "https://lz4.overpass-api.de/api/interpreter",
  },
  {
    id: "private-coffee",
    url: "https://overpass.private.coffee/api/interpreter",
  },
];
