/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import { get } from "svelte/store";
import api, { type FetchResourceListOptions } from "../api";
import type { Area } from "../api/resourceObjects";
import { areas } from "./store";
import createFeatureFromArea from "../utilities/createFeatureFromArea";
import { PresetAreaShape } from "../library/game/types";
import {
  areaSelection,
  didOpenMultiplayerSessionUrl,
  lastAreaSelectionAreaId,
  initialUrlSearchParams,
  hasEverPlayedARoundOnThisDevice,
} from "../utilities/store";

export default async function fetchAreas({
  sort,
}: Pick<FetchResourceListOptions, "sort">): Promise<Area[]> {
  const valueFromStore = get(areas);
  if (valueFromStore !== null) {
    return valueFromStore;
  }

  const result = await api.fetchResourceList<Area>("area", {
    page: {
      size: 500,
    },
    sort,
  });

  areas.set(result.data);

  if (result.data.length) {
    const didOpenMultiplayerSessionUrlValue = get(didOpenMultiplayerSessionUrl);
    let areaIdToLookFor: Area["id"] | null;
    if (didOpenMultiplayerSessionUrlValue) {
      areaIdToLookFor = initialUrlSearchParams.get("areaIdForMultiplayer");
    } else {
      areaIdToLookFor = get(lastAreaSelectionAreaId);
    }

    const area =
      (areaIdToLookFor &&
        result.data.find(({ id }) => id === areaIdToLookFor)) ||
      (!didOpenMultiplayerSessionUrlValue &&
        !hasEverPlayedARoundOnThisDevice &&
        // TODO: get default area from API instead of assuming first?
        result.data[0]);
    if (area) {
      const feature = createFeatureFromArea(area);
      areaSelection.set({
        areaId: area.id,
        feature,
        presetShape: PresetAreaShape.MultiPolygon,
        radius: null,
      });
    }
  }

  return result.data;
}
