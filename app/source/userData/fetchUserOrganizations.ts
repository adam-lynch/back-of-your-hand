/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import api, { type FetchResourceListOptions } from "../api";
import { pickFromIncluded } from "../api/pickFromResponse";
import type { User, UserOrganization } from "../api/resourceObjects";

export default async function fetchUserOrganizations({
  page,
  sort,
}: Pick<FetchResourceListOptions, "page" | "sort">): Promise<
  (Omit<UserOrganization, "relationships"> & {
    relationships: UserOrganization["relationships"] & {
      user: {
        data: User | null;
      };
    };
  })[]
> {
  const result = await api.fetchResourceList<UserOrganization>(
    "userOrganization",
    {
      include: ["user"],
      page,
      sort,
    },
  );

  return result.data.map((userOrganization) => {
    if (!userOrganization.relationships) {
      throw new Error("userOrganization has no relationships");
    }
    const userId = userOrganization.relationships.user.data.id;
    const user = pickFromIncluded<User>(
      result,
      ({ id, type }) => type === "user" && id === userId,
    );
    if (!user) {
      throw new Error("user missing from included");
    }

    return {
      ...userOrganization,
      relationships: {
        ...userOrganization.relationships,
        user: {
          data: user,
        },
      },
    };
  });
}
