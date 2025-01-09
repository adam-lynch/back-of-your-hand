/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import { derived, writable } from "svelte/store";
import type {
  Area,
  Organization,
  User,
  UserOrganization,
} from "../api/resourceObjects";
import ignoreError from "../utilities/ignoreError";

export type AccessDetailsAttributes = {
  access: string;
  accessExpiration: string; // E.g. 2024-08-20T20:35:43.443212Z
};

export const areas = writable<Area[] | null>(null);

export const accessDetailsLocalStorageName = "apiAccessDetails";
const accessDetailsAsString: string | null = localStorage.getItem(
  accessDetailsLocalStorageName,
);
export const accessDetails = writable<AccessDetailsAttributes | null>(
  accessDetailsAsString
    ? ignoreError(() => JSON.parse(accessDetailsAsString))
    : null,
);

export const isOrganizationUrl = writable(
  window.location.hostname.split(".").length === 3,
);
export const isLoggedIn = derived(accessDetails, ($accessDetails) =>
  Boolean($accessDetails),
);

export const user = writable<User | null>(null);
export const userOrganization = writable<UserOrganization | null>(null);
export const hasUserOrganizationLoaded = derived(
  [userOrganization],
  ([$userOrganization]) => $userOrganization !== null,
);
export const userOrganizationIsAdmin = derived(
  [userOrganization],
  ([$userOrganization]) =>
    $userOrganization && $userOrganization.attributes.role === "admin",
);
export const organization = writable<Organization | null>(null);
