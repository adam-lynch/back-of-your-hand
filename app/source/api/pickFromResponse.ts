/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import type * as JSONAPI from "./JSONAPI";
import type { AnyResourceObject } from "./resourceObjects";

export function pickFromIncluded<
  TResourceObject extends AnyResourceObject,
  TDocWithData extends JSONAPI.DocWithData<
    AnyResourceObject | AnyResourceObject[]
  > = JSONAPI.DocWithData<AnyResourceObject | AnyResourceObject[]>,
>(
  response: TDocWithData,
  matcher: (resource: NonNullable<TDocWithData["included"]>[0]) => boolean,
): TResourceObject | undefined {
  if (!response.included) {
    return;
  }
  return response.included.find(matcher) as unknown as
    | TResourceObject
    | undefined;
}
