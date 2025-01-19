/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import * as dateFns from "date-fns";
import pick from "lodash/pick";

import api from "../api";
import * as JSONAPI from "../api/JSONAPI";
import * as store from "./store";
import * as storeActions from "./storeActions";
import eventEmitter from "../utilities/eventEmitter";
import * as svelteStore from "svelte/store";
import { navigate } from "svelte-routing";
import getInternalRoutes from "../library/routing/getInternalRoutes";
import { reportError } from "../utilities/setUpErrorReporting";

async function getValidAccessToken(options: {
  shouldRefreshAccessTokenIfExpiring: boolean;
}): Promise<store.AccessDetailsAttributes["access"] | undefined> {
  let accessDetails = svelteStore.get(store.accessDetails);
  if (!accessDetails) {
    return;
  }

  if (options.shouldRefreshAccessTokenIfExpiring) {
    // If the token is expired or expiring soon, try to refresh it
    const expirationDate = dateFns.parseISO(accessDetails.accessExpiration);
    const currentTime = new Date();
    const bufferTime = dateFns.addMinutes(currentTime, 1);
    if (dateFns.isBefore(expirationDate, bufferTime)) {
      const refreshTokenResponse = await refreshAccessToken();
      accessDetails = {
        access: refreshTokenResponse.data.access,
        accessExpiration: refreshTokenResponse.data.access_expiration,
      };
      store.accessDetails.set(accessDetails);
    }
  }

  return accessDetails.access;
}

function init() {
  // Add auth to API requests
  eventEmitter.on("pre-api-fetch", onPreApiFetch);

  // E.g. 401 / log out
  eventEmitter.on(
    "lack-of-authentication-detected",
    onLackOfAuthenticationDetected,
  );
}

async function logIn(data: { email: string; password: string }) {
  const logInResponse = await api.requestAuthEndpoint<
    JSONAPI.DocWithData<
      JSONAPI.ResourceObject<
        "LoginView",
        store.AccessDetailsAttributes & {
          refresh: string;
          refreshExpiration: string;
          user: {
            email: string;
            first_name: string;
            last_name: string;
            pk: string;
          };
        }
      >
    >
  >("login", {
    body: data,
    method: "POST",
    getEffectiveClientErrorStatusFromResponse: async (
      response,
      responseBody,
    ) => {
      let status = response.status;

      if (
        status === 400 &&
        responseBody?.errors?.find((error) =>
          error.detail?.includes("Unable to log in with provided credentials"),
        )
      ) {
        status = 401;
      }

      return status;
    },
  });
  console.debug("Logged in", logInResponse);

  if (!logInResponse.data.attributes) {
    throw new Error("!logInResponse.data.attributes");
  }
  setAccessDetails(
    pick(logInResponse.data.attributes, ["access", "accessExpiration"]),
  );
}

async function logOut() {
  try {
    await api.requestAuthEndpoint("logout", {
      method: "POST",
    });
  } catch (e) {
    console.warn(e);
  }
  eventEmitter.emit("lack-of-authentication-detected", { cause: "manual" });
}

async function onLackOfAuthenticationDetected(
  context: Record<string, unknown>,
) {
  const wasLoggedIn = svelteStore.get(store.isLoggedIn);
  console.debug("lack of authentication detected", { ...context, wasLoggedIn });
  setAccessDetails(null);
  storeActions.setUserData(null);

  // Not sure this is necessary anymore. It doesn't *seem* to make a difference
  if (wasLoggedIn) {
    navigate(getInternalRoutes().loggedOut.path, { replace: false });
  }
}

async function onPreApiFetch(fetchArgs: { url: string; options: RequestInit }) {
  if (fetchArgs.url.includes("/auth/login")) {
    return fetchArgs;
  }

  let accessToken: string | undefined;
  try {
    accessToken = await getValidAccessToken({
      shouldRefreshAccessTokenIfExpiring: !fetchArgs.url.includes(
        "/auth/token/refresh",
      ),
    });
  } catch (error) {
    reportError(error);
    eventEmitter.emit("lack-of-authentication-detected", {
      functionWhichErrored: "getValidAccessToken",
    });
  }

  if (accessToken) {
    fetchArgs.options.headers ??= {};
    (fetchArgs.options.headers as Record<string, string>).Authorization =
      `Bearer ${accessToken}`;
  }

  return fetchArgs;
}

async function refreshAccessToken() {
  return api.requestAuthEndpoint<{
    data: Pick<store.AccessDetailsAttributes, "access"> & {
      access_expiration: string; // E.g. 2024-08-20T20:35:43.443212Z
    };
  }>("token/refresh", {
    method: "POST",
  });
}

function setAccessDetails(value: store.AccessDetailsAttributes | null) {
  console.debug("authController.setAccessDetails", value);
  store.accessDetails.set(value);

  if (value) {
    localStorage.setItem(
      store.accessDetailsLocalStorageName,
      JSON.stringify(value),
    );
    return;
  }
  localStorage.removeItem(store.accessDetailsLocalStorageName);
}

export default {
  init,
  logIn,
  logOut,
};
