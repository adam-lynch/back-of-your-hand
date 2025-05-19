/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import ignoreError from "./ignoreError";

function getFromUrl<T>({
  name,
  parse,
  urlSearchParams,
}: {
  name: string;
  parse: (input: string | void) => T | void;
  urlSearchParams: URLSearchParams;
}): T | void {
  if (urlSearchParams.has(name)) {
    const unparsedValue = ignoreError(() => urlSearchParams.get(name));
    if (unparsedValue !== null) {
      return parse(unparsedValue);
    }
  }
}

function getFromStorage<T>({
  name,
  parse,
}: {
  name: string;
  parse: (input: string | void) => T | void;
}): T | void {
  const unparsedValue = ignoreError(() => localStorage.getItem(name));
  if (unparsedValue !== null) {
    return parse(unparsedValue);
  }
}

export default <T extends number | object | string | null | undefined>({
  defaultValue,
  name,
  parse = (input: string | void) => input as unknown as T,
  postProcess = (input: T) => input,
  urlSearchParams,
}: {
  defaultValue: T;
  name: string;
  parse?: (input: string | void) => T | void;
  postProcess?: (input: T) => T;
  // This can be omitted to skip checking for a query parameter
  urlSearchParams?: URLSearchParams;
}): T => {
  const safeParse: typeof parse = (input) => ignoreError(() => parse(input));
  return postProcess(
    // Did the user provide one in the URL?
    (urlSearchParams &&
      getFromUrl<T>({ name, parse: safeParse, urlSearchParams })) ||
      // Did they play previously?
      getFromStorage<T>({ name, parse: safeParse }) ||
      // Return the default value.
      defaultValue,
  );
};
