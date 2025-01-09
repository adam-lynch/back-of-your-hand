/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import urlJoin from "url-join";
import type * as JSONAPI from "./JSONAPI";
import type {
  AnyResourceObject,
  OmitTimestampedResourceAttributes,
} from "./resourceObjects";
import sortBy from "lodash/sortBy";
import pluralize from "../utilities/pluralize";
import requestAuthEndpoint from "./requestAuthEndpoint";
import requestApi from "./requestApi";

type FetchResourceOptions = {
  include?: string[];
};

export type FetchResourceListOptions = FetchResourceOptions & {
  filter?: Record<string, boolean | null | number | string>;
  include?: string[];
  page?:
    | {
        limit?: number;
        offset?: number;
      }
    | {
        number?: number;
        size?: number;
      };
  sort?: SortOption;
};

type QueryParameterEntry = [string, boolean | null | number | string];

export type SortBy = {
  direction: "ascending" | "descending";
  name: string;
};
type SortOption = (SortBy | SortBy["name"])[];

function makeResourceQueryParameterEntries(
  options: FetchResourceOptions,
): QueryParameterEntry[] {
  const results: QueryParameterEntry[] = [];
  if (options.include) {
    results.push(["include", options.include.sort().join(",")]);
  }
  return results;
}

function makeResourceListQueryParameterEntries(
  options: FetchResourceListOptions,
): QueryParameterEntry[] {
  const results: QueryParameterEntry[] = [];

  for (const [key, value] of sortBy(
    Object.entries(options.filter ?? {}),
    ([key]) => key,
  )) {
    results.push([`filter[${key}]`, value]);
  }

  for (const [key, value] of sortBy(
    Object.entries(options.page ?? {}),
    ([key]) => key,
  )) {
    results.push([`page[${key}]`, value]);
  }

  if (options.sort) {
    const sortQueryParameterValue = options.sort
      .map((item) => {
        const sortBy: SortBy =
          typeof item === "object"
            ? item
            : {
                direction: "ascending",
                name: item,
              };

        return `${sortBy.direction === "descending" ? "-" : ""}${sortBy.name}`;
      })
      .join(",");
    results.push(["sort", sortQueryParameterValue]);
  }

  return results;
}

function makeResourceBaseUrl(resourceType: AnyResourceObject["type"]): string {
  return pluralize(resourceType).toLowerCase();
}

async function deleteResource<
  TResourceObject extends AnyResourceObject = never,
>(resourceType: TResourceObject["type"], id: TResourceObject["id"]) {
  return requestApi<undefined>(urlJoin(makeResourceBaseUrl(resourceType), id), {
    method: "DELETE",
  });
}

async function fetchResource<TResourceObject extends AnyResourceObject = never>(
  resourceType: TResourceObject["type"],
  id: TResourceObject["id"],
  options?: FetchResourceOptions,
) {
  let urlSearchParams: URLSearchParams | undefined;
  if (options) {
    urlSearchParams = new URLSearchParams();
    const sortedQueryParameterEntries = sortBy(
      [...makeResourceQueryParameterEntries(options)],
      (entry) => entry[0],
    );
    for (const entry of sortedQueryParameterEntries) {
      if (entry[1] !== null) {
        urlSearchParams.append(entry[0], entry[1].toString());
      }
    }
  }

  return requestApi<JSONAPI.DocWithData<TResourceObject>>(
    urlJoin(makeResourceBaseUrl(resourceType), id),
    {
      method: "GET",
      urlSearchParams,
    },
  );
}

async function fetchResourceList<TResourceObject extends AnyResourceObject>(
  resourceType: TResourceObject["type"],
  options?: FetchResourceListOptions,
) {
  let urlSearchParams: URLSearchParams | undefined;
  if (options) {
    urlSearchParams = new URLSearchParams();
    for (const entry of [
      ...makeResourceQueryParameterEntries(options),
      ...makeResourceListQueryParameterEntries(options),
    ]) {
      if (entry[1] !== null) {
        urlSearchParams.append(entry[0], entry[1].toString());
      }
    }
  }

  return requestApi<JSONAPI.DocWithData<TResourceObject[]>>(
    makeResourceBaseUrl(resourceType),
    {
      method: "GET",
      urlSearchParams,
    },
  );
}

async function patchResource<TResourceObject extends AnyResourceObject = never>(
  partialResource: Omit<TResourceObject, "attributes" | "relationships"> & {
    attributes?: Partial<TResourceObject["attributes"]>;
    relationships?: Partial<TResourceObject["relationships"]>;
  },
  options?: FetchResourceOptions,
) {
  let urlSearchParams: URLSearchParams | undefined;
  if (options) {
    urlSearchParams = new URLSearchParams();
    const sortedQueryParameterEntries = sortBy(
      [...makeResourceQueryParameterEntries(options)],
      (entry) => entry[0],
    );
    for (const entry of sortedQueryParameterEntries) {
      if (entry[1] !== null) {
        urlSearchParams.append(entry[0], entry[1].toString());
      }
    }
  }

  return requestApi<JSONAPI.DocWithData<TResourceObject>>(
    urlJoin(makeResourceBaseUrl(partialResource.type), partialResource.id),
    {
      body: {
        data: partialResource,
      },
      method: "PATCH",
      urlSearchParams,
    },
  );
}

async function postResource<
  TResourceObject extends AnyResourceObject = AnyResourceObject,
>(
  resource: Omit<OmitTimestampedResourceAttributes<TResourceObject>, "id">,
  options?: FetchResourceOptions,
) {
  let urlSearchParams: URLSearchParams | undefined;
  if (options) {
    urlSearchParams = new URLSearchParams();
    for (const entry of [
      ...makeResourceQueryParameterEntries(options),
      ...makeResourceListQueryParameterEntries(options),
    ]) {
      if (entry[1] !== null) {
        urlSearchParams.append(entry[0], entry[1].toString());
      }
    }
  }

  return requestApi<JSONAPI.DocWithData<TResourceObject>>(
    makeResourceBaseUrl(resource.type),
    {
      body: {
        data: resource,
      },
      method: "POST",
      urlSearchParams,
    },
  );
}

export default {
  deleteResource,
  fetchResource,
  fetchResourceList,
  patchResource,
  postResource,
  requestApi,
  requestAuthEndpoint,
};
