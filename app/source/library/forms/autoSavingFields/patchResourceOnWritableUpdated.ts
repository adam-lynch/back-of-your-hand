/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import { pick } from "lodash";
import api from "../../../api";
import type { AnyResourceObject } from "../../../api/resourceObjects";

export default async function patchResourceOnWritableUpdated<
  TResourceObject extends AnyResourceObject,
>(changes: Partial<TResourceObject>, updatedValue: TResourceObject) {
  const partialResource = {
    ...pick(updatedValue, ["id", "type"]),
    ...changes,
  } as Omit<TResourceObject, "attributes" | "relationships"> & {
    attributes?: Partial<TResourceObject["attributes"]>;
    relationships?: Partial<unknown>;
  };
  await api.patchResource<TResourceObject>(partialResource);
}
