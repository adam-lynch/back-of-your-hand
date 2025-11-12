/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import * as Sentry from "@sentry/browser";
import * as dateFns from "date-fns";
import pick from "lodash/pick";
import { navigate } from "svelte-routing";

import api from "../api";
import * as JSONAPI from "../api/JSONAPI";
import * as store from "./store";
import * as storeActions from "./storeActions";
import eventEmitter from "../utilities/eventEmitter";
import * as svelteStore from "svelte/store";
import { reportError } from "../utilities/setUpErrorReporting";
import getInternalRoutes from "../library/routing/getInternalRoutes";
import getCurrentInternalRoute from "../library/routing/getCurrentInternalRoute";

async function getValidAccessToken(options: {
  shouldRefreshAccessTokenIfExpiring: boolean;
  url: string;
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
  console.debug("Logged in (backend)", logInResponse);

  if (!logInResponse.data.attributes) {
    throw new Error("!logInResponse.data.attributes");
  }
  setAccessDetails(logInResponse.data.attributes);
  console.debug("Logged in (setAccessDetails called)");
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
  console.debug("lack-of-authentication-detected", context);
  setAccessDetails(null);
  storeActions.setUserData(null);
  store.areas.set(null);
  Sentry.setUser(null);

  if (context.cause === "401") {
    const currentInternalRoute = getCurrentInternalRoute();
    if (!currentInternalRoute?.doesNotRequireAuth) {
      navigate(getInternalRoutes().logIn.path, {
        state: {
          didSessionExpire: true,
        },
      });
    }
  }
}

async function onPreApiFetch(fetchArgs: { url: string; options: RequestInit }) {
  if (
    fetchArgs.url.includes("/actions/accept-invite") ||
    fetchArgs.url.includes("/auth/login") ||
    fetchArgs.url.includes("/invites/") ||
    fetchArgs.url.includes("password/reset")
  ) {
    return fetchArgs;
  }

  let accessToken: string | undefined;
  try {
    accessToken = await getValidAccessToken({
      shouldRefreshAccessTokenIfExpiring: !fetchArgs.url.includes(
        "/auth/token/refresh",
      ),
      url: fetchArgs.url,
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

function setAccessDetails(
  potentiallyUnsafeValue: store.AccessDetailsAttributes | null,
) {
  console.debug("authController.setAccessDetails", potentiallyUnsafeValue);

  if (potentiallyUnsafeValue) {
    const safeValue = pick(potentiallyUnsafeValue, [
      "access",
      "accessExpiration",
    ]) as store.AccessDetailsAttributes;
    store.accessDetails.set(safeValue);

    if (safeValue) {
      localStorage.setItem(
        store.accessDetailsLocalStorageName,
        JSON.stringify(safeValue),
      );
      return;
    }
  }
  localStorage.removeItem(store.accessDetailsLocalStorageName);
}

export default {
  init,
  logIn,
  logOut,
  setAccessDetails,
};
