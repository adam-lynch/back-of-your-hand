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

  parsedUrl.pathname = "/geo-lookup-done";

  if (request.cf.latitude && request.cf.longitude) {
    /*
      It incorrectly resolves to Dublin sporadically.
      So I'd rather it just always go to Cork instead of Dublin. Corcaigh Abú!
    */
    if (
      request.cf.city?.toLowerCase() === "dublin" ||
      (request.cf.latitude.toString().startsWith("53.3") &&
        request.cf.longitude.toString().startsWith("-6.2"))
    ) {
      parsedUrl.searchParams.set("lat", "51.89863");
      parsedUrl.searchParams.set("lng", "-8.47039");
    } else {
      parsedUrl.searchParams.set("lat", request.cf.latitude);
      parsedUrl.searchParams.set("lng", request.cf.longitude);
    }
  }
  console.log(`Redirecting / to ${parsedUrl}...`);
  return Response.redirect(parsedUrl.toString(), 302);
}
