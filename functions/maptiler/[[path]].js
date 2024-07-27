/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

export async function onRequestGet({ request }) {
  const parsedUrl = new URL(request.url);
  const originalPathname = parsedUrl.pathname;

  parsedUrl.host = "api.maptiler.com";
  parsedUrl.pathname = parsedUrl.pathname.replace(`/maptiler`, "");
  parsedUrl.port = 80;
  parsedUrl.protocol = "https:";
  console.log(`Proxying ${originalPathname} to ${parsedUrl}...`);
  return fetch(
    new Request(parsedUrl.toString(), {
      headers: request.headers,
    }),
  );
}
