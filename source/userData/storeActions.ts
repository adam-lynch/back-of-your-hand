/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import { get } from "svelte/store";
import type {
  Organization,
  User,
  UserOrganization,
} from "../api/resourceObjects";
import convertLatLngToPosition from "../utilities/convertLatLngToPosition";
import reduceLatLngPrecision from "../utilities/reduceLatLngPrecision";
import { areaSelection } from "../utilities/store";
import { PresetAreaShape, type LatLng } from "../library/game/types";
import { organization, user, userOrganization } from "./store";
import createFeatureFromPresetAreaShape from "../utilities/createFeatureFromPresetAreaShape";

export function setUserData(
  data: {
    organization: Organization;
    user: User;
    userOrganization: UserOrganization;
  } | null,
) {
  if (data === null) {
    userOrganization.set(null);
    user.set(null);
    return;
  }

  organization.set(data.organization);
  userOrganization.set(data.userOrganization);
  user.set(data.user);
}

export function updateAreaSelectionCenter(latLng: LatLng) {
  const areaSelectionValue = get(areaSelection);
  if (areaSelectionValue.presetShape === PresetAreaShape.Polygon) {
    throw new Error("Unsupported");
  }
  const adjustedPosition = convertLatLngToPosition(
    reduceLatLngPrecision(latLng),
  );
  areaSelection.update((oldValue) => {
    if (!areaSelectionValue.radius) {
      throw new Error("No area selection radius");
    }
    return {
      ...oldValue,
      feature: createFeatureFromPresetAreaShape(
        areaSelectionValue.presetShape,
        adjustedPosition,
        areaSelectionValue.radius,
      ),
    };
  });
}
