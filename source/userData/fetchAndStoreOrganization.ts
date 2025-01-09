/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import * as svelteStore from "svelte/store";
import api from "../api";
import type { Organization } from "../api/resourceObjects";
import { organization } from "./store";
import { ClientRequestError } from "../api/requestApi";

export default async function fetchAndStoreOrganization(): Promise<void> {
  if (svelteStore.get(organization)) {
    return;
  }

  try {
    const body = await api.fetchResource<Organization>("organization", "mine");
    organization.set(body.data);
  } catch (error) {
    if (
      !(error instanceof ClientRequestError && error.response.status === 404)
    ) {
      throw error;
    }
  }
}
