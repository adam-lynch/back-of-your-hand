/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import type { InternalRoute } from "./getInternalRoutes";

type Context = {
  isOrganizationUrl: boolean;
  userOrganizationIsAdmin: boolean | null;
};

export default function validateInternalRouteRequirementsToExist<
  T extends Pick<InternalRoute, "requirementsToExist">,
>(item: T, { isOrganizationUrl, userOrganizationIsAdmin }: Context): boolean {
  if (!item.requirementsToExist?.length) {
    return true;
  }

  if (
    item.requirementsToExist.includes("not-organization-plan") &&
    isOrganizationUrl
  ) {
    return false;
  }

  if (
    item.requirementsToExist.includes("organization-plan") &&
    !isOrganizationUrl
  ) {
    return false;
  }

  if (
    item.requirementsToExist.includes("userorganization-is-admin") &&
    !userOrganizationIsAdmin
  ) {
    return false;
  }

  return true;
}
