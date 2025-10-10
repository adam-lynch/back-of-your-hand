/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import type { User, UserOrganization } from "../api/resourceObjects";

export default function prettifyUserOrganizationName(
  userOrganization:
    | UserOrganization
    | (UserOrganization & {
        relationships: unknown;
      }),
  user?: User | null,
): string {
  const customTitlePieces = [];
  if (userOrganization.attributes.inviteStatus !== "accepted") {
    customTitlePieces.push(
      userOrganization.attributes.inviteUserFirstName,
      userOrganization.attributes.inviteUserLastName,
    );
  } else if (user) {
    customTitlePieces.push(user.attributes.firstName, user.attributes.lastName);
  } else {
    // TODO
  }
  return customTitlePieces.join(" ");
}
