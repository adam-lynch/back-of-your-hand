/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import api from "../api";
import { pickFromIncluded } from "../api/pickFromResponse";
import type {
  Organization,
  User,
  UserOrganization,
} from "../api/resourceObjects";

export default async function fetchUserOrganizationWithAllIncludes(
  id = "me",
): Promise<{
  organization: Organization;
  user: User;
  userOrganization: UserOrganization;
}> {
  const result = await api.fetchResource<UserOrganization>(
    "userOrganization",
    id,
    {
      include: ["organization", "user"],
    },
  );
  const organization = pickFromIncluded<Organization>(
    result,
    ({ type }) => type === "organization",
  );
  const user = pickFromIncluded<User>(result, ({ type }) => type === "user");
  if (!organization || !user) {
    throw new Error("Expected included resources missing");
  }
  return {
    organization,
    user,
    userOrganization: result.data,
  };
}
