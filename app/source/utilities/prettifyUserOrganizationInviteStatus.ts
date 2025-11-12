/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2025 Adam Lynch (https://adamlynch.com)
 */

import * as dateFns from "date-fns";
import type { UserOrganization } from "../api/resourceObjects";

type Result = {
  inviteStatus: UserOrganization["attributes"]["inviteStatus"];
  labelText: string | null;
  statusId: UserOrganization["attributes"]["inviteStatus"] | "expired";
};

export default function prettifyUserOrganizationInviteStatus(
  userOrganization: UserOrganization,
): Result {
  const inviteStatus = userOrganization.attributes.inviteStatus;
  const result: Result = {
    inviteStatus,
    labelText: inviteStatus,
    statusId: inviteStatus,
  };

  if (inviteStatus === "accepted") {
    result.labelText = null;
  } else if (inviteStatus === "invited") {
    // Expired?
    if (
      userOrganization.attributes.inviteIssuedAt &&
      dateFns.isAfter(
        new Date(),
        dateFns.addDays(
          dateFns.parseISO(userOrganization.attributes.inviteIssuedAt),
          userOrganization.attributes.inviteTokenMaxAge,
        ),
      )
    ) {
      result.labelText = "invite expired";
      result.statusId = "expired";
    }
  }

  return result;
}
