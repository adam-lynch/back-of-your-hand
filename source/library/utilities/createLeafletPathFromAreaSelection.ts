/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import * as leaflet from "leaflet";
import type { AreaSelection } from "../../utilities/store";
import { PresetAreaShape } from "../game/types";
import getCenterOfFeature from "../../utilities/getCenterOfFeature";
import convertPositionToLatLng from "../../utilities/convertPositionToLatLng";
import convertLatLngToLatLngBoundsExpression from "../../utilities/convertLatLngToLatLngBoundsExpression";

export default function createLeafletPathFromAreaSelection(
  areaSelection: AreaSelection,
  pathOptions: leaflet.PathOptions = {},
): leaflet.Path {
  if (areaSelection.presetShape === PresetAreaShape.Circle) {
    if (areaSelection.radius === null) {
      throw new Error("Circle AreaSelection has no radius");
    }
    return leaflet.circle(
      convertPositionToLatLng(getCenterOfFeature(areaSelection.feature)),
      {
        ...pathOptions,
        radius: areaSelection.radius,
      },
    );
  }

  if (areaSelection.presetShape === PresetAreaShape.Square) {
    if (areaSelection.radius === null) {
      throw new Error("Square AreaSelection has no radius");
    }
    return leaflet.rectangle(
      convertLatLngToLatLngBoundsExpression(
        convertPositionToLatLng(getCenterOfFeature(areaSelection.feature)),
        areaSelection.radius,
      ),
      pathOptions,
    );
  }

  if (areaSelection.feature.geometry.type !== "Polygon") {
    throw new Error(
      `AreaSelection has unexpected geometry type "${areaSelection.feature.geometry.type}"`,
    );
  }
  return leaflet.polygon(
    areaSelection.feature.geometry.coordinates.map((positions) =>
      positions.map(convertPositionToLatLng),
    ),
    pathOptions,
  );
}
