/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import * as svelteStore from "svelte/store";
import { updateAreaSelectionCenter } from "../../userData/storeActions";
import {
  areaSelection,
  didOpenMultiplayerSessionUrl,
  interactionVerb,
  round,
} from "../../utilities/store";
import type { LatLng } from "../game/types";
import trackEvent from "../../utilities/trackEvent";
import convertLatLngToPosition from "../../utilities/convertLatLngToPosition";
import reduceLatLngPrecision from "../../utilities/reduceLatLngPrecision";
import createFeatureFromPresetAreaShape from "../../utilities/createFeatureFromPresetAreaShape";
import * as defaults from "../../utilities/defaults";
import { hasShownPredefinedAreaChangedWarning } from "../game/store";

export default function updateAreaCenterWithWarningIfNecessary(
  latLng: LatLng,
  wasCausedByMapClick: boolean,
) {
  if (svelteStore.get(round)) {
    return;
  }

  const $areaSelection = svelteStore.get(areaSelection);

  const updateCenter = () => {
    if (!$areaSelection.areaId) {
      updateAreaSelectionCenter(latLng);
      return;
    }

    const adjustedPosition = convertLatLngToPosition(
      reduceLatLngPrecision(latLng),
    );
    areaSelection.update((oldValue) => ({
      ...oldValue,
      areaId: null,
      feature: createFeatureFromPresetAreaShape(
        defaults.shape,
        adjustedPosition,
        defaults.radius,
      ),
      presetShape: defaults.shape,
      radius: defaults.radius,
    }));
  };

  // If they came in with a seed and then change the area, warn them
  if (svelteStore.get(didOpenMultiplayerSessionUrl)) {
    if (svelteStore.get(hasShownPredefinedAreaChangedWarning)) {
      updateCenter();
      return;
    }

    trackEvent({
      name: "change-prefined-area-seed_attempted",
      title: "Change predefined area-seed: attempted",
    });

    hasShownPredefinedAreaChangedWarning.set(true);
    if (
      confirm(
        "The link you opened contains a pre-defined area and set of streets. A friend may have given you the URL so you could compete. \n\nChange the area anyway?",
      )
    ) {
      trackEvent({
        name: "change-prefined-area-seed_confirmed",
        title: "Change predefined area-seed: confirmed",
      });
      updateCenter();
      return;
    }

    trackEvent({
      name: "change-prefined-area-seed_cancelled",
      title: "Change predefined area-seed: cancelled",
    });
    return;
  }

  if ($areaSelection.areaId) {
    if (
      wasCausedByMapClick &&
      !svelteStore.get(hasShownPredefinedAreaChangedWarning)
    ) {
      trackEvent({
        name: "change-polygon-area-selection_attempted",
        title: "Change predefined polygon area selection: attempted",
      });
      hasShownPredefinedAreaChangedWarning.set(true);

      if (
        confirm(
          `${svelteStore.get(interactionVerb) === "Tap" ? "Tapping" : "Clicking"} the map creates a custom area on that position. You can change it back to a predefined area in "Configure" (or customize it further). \n\nAre you sure you want to use a custom area?`,
        )
      ) {
        trackEvent({
          name: "change-polygon-area-selection_confirmed",
          title: "Change predefined polygon area selection: confirmed",
        });
        updateCenter();
        return;
      }

      trackEvent({
        name: "change-polygon-area-selection_cancelled",
        title: "Change predefined polygon area selection: cancelled",
      });
      return;
    }

    updateCenter();
  }
}
