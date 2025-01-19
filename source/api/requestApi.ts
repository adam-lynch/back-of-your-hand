/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import urlJoin from "url-join";

import eventEmitter from "../utilities/eventEmitter";
import type { MaybePromise } from "../utilities/utilityTypes";
import * as JSONAPI from "./JSONAPI";
import getCookie from "../utilities/getCookie";

const hostPieces = window.location.host.split(".");
const baseUrl =
  `https://${hostPieces[0]}--backend.` +
  (import.meta.env.DEV
    ? "local-backofyourhand--backend.com:8000"
    : hostPieces.slice(1).join("."));

export class ClientRequestError extends Error {
  name = "ClientRequestError";
  response: Response;
  responseBody?: JSONAPI.DocWithErrors | undefined;

  constructor(
    message: string,
    response: Response,
    responseBody: JSONAPI.DocWithErrors | undefined,
  ) {
    super(message);
    this.response = response;
    this.responseBody = responseBody;
  }
}

export class ServerResponseError extends Error {
  name = "ServerResponseError";
  response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.response = response;
  }
}

export default async function requestApi<TSuccessfulResponsePayload>(
  relativeUrl: string,
  options: Omit<RequestInit, "body" | "headers"> & {
    body?: object;
    getEffectiveClientErrorStatusFromResponse?: (
      response: Response,
      responseBody: JSONAPI.DocWithErrors | undefined,
    ) => MaybePromise<number>;
    headers?: Record<string, string>;
    isNotJSONAPI?: boolean;
    urlSearchParams?: URLSearchParams;
    urlPrefix?: string;
  },
) {
  const { body, urlPrefix, urlSearchParams, ..._fetchOptions } = options;

  let url = urlJoin(baseUrl, urlPrefix ?? "api", relativeUrl);
  if (urlSearchParams) {
    url += `?${urlSearchParams.toString()}`;
  }

  const fetchOptions: RequestInit = { ..._fetchOptions };
  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const defaultHeaders: HeadersInit = {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  };
  const csrfToken = getCookie("csrftoken");
  if (csrfToken) {
    defaultHeaders["X-CSRFToken"] = csrfToken;
  }
  fetchOptions.headers = Object.assign(
    {},
    defaultHeaders,
    fetchOptions.headers,
  );

  fetchOptions.credentials = "include";
  fetchOptions.mode = "cors";

  if (fetchOptions.method?.toUpperCase() !== fetchOptions.method) {
    throw new Error("Method must be uppercase");
  }

  const args = { url, options: fetchOptions };
  const emitResponses = (await eventEmitter.emitAsync(
    "pre-api-fetch",
    args,
  )) as (typeof args | undefined)[];
  const modifiedArgs = emitResponses.find(Boolean);
  if (!modifiedArgs) {
    throw new Error("pre-api-fetch failed");
  }

  const response = await fetch(modifiedArgs.url, modifiedArgs.options);

  if (response.status >= 500) {
    throw new ServerResponseError(`Status ${response.status}`, response);
  } else if (response.status < 200 || response.status >= 400) {
    let responseBody: JSONAPI.DocWithErrors | undefined;
    try {
      responseBody = await response.json();
    } catch (e) {
      // Ignore
    }

    const effectiveStatus = options.getEffectiveClientErrorStatusFromResponse
      ? await options.getEffectiveClientErrorStatusFromResponse(
          response,
          responseBody,
        )
      : response.status;

    if (effectiveStatus === 401) {
      eventEmitter.emit("lack-of-authentication-detected", {
        cause: "401",
        response,
      });
    }

    throw new ClientRequestError(
      `Status ${response.status}`,
      response,
      responseBody,
    );
  }

  if (response.status === 204) {
    return undefined as unknown as TSuccessfulResponsePayload;
  }
  return response.json() as unknown as TSuccessfulResponsePayload;
}
