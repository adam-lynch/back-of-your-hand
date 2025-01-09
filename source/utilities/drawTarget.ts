/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import * as turf from "@turf/turf";
import leaflet from "leaflet";
import type * as GeoJSON from "geojson";

import convertLatLngToCoordinates from "./convertLatLngToCoordinates";
import getColorFromDistance from "./getColorFromDistance";
import type { Question } from "../library/game/types";

export default ({
  color,
  layer,
  question,
  shouldDrawCircle, // The summary doesn't have circles around each street
}: {
  color?: string;
  layer: leaflet.Map | leaflet.LayerGroup<unknown>;
  question: Question;
  shouldDrawCircle?: boolean;
}) => {
  if (!question.distance) {
    throw new Error("question.distance does not exist");
  }
  const colorToUse = color || getColorFromDistance(question.distance.amount);
  let targetLayer: leaflet.Polygon | ReturnType<typeof leaflet.polyline>;

  if (question.target.isEnclosedArea) {
    targetLayer = leaflet.polygon(question.target.points, {
      color: colorToUse,
      fillColor: colorToUse,
      fillOpacity: 0.1,
      opacity: 1,
      weight: 3,
    });
  } else {
    targetLayer = leaflet.polyline(question.target.points, {
      color: colorToUse,
      fillColor: "white",
      fillOpacity: 1,
      weight: Math.max(Math.ceil(question.target.width || 0), 10),
    });
  }

  targetLayer.addTo(layer);

  const targetBounds = targetLayer.getBounds();

  const targetTurfPoints = question.target.points.reduce<
    GeoJSON.Feature<GeoJSON.Point>[]
  >(
    (result, targetPoints) => [
      ...result,
      ...targetPoints.map((targetPoint) =>
        turf.point(convertLatLngToCoordinates(targetPoint)),
      ),
    ],
    [],
  );

  let circle;
  if (!question.target.isEnclosedArea && shouldDrawCircle) {
    const targetCenterCoordinates = turf.center(
      turf.featureCollection(targetTurfPoints),
    ).geometry.coordinates as leaflet.LatLngExpression;

    circle = leaflet
      .circle(targetCenterCoordinates, {
        color: colorToUse,
        fillOpacity: 0.1,
        opacity: 0.2,
        radius:
          Math.max(
            targetBounds.getNorthWest().distanceTo(targetBounds.getSouthEast()),
            targetBounds.getNorthEast().distanceTo(targetBounds.getSouthWest()),
          ) * 0.8,
        weight: 1,
      })
      .addTo(layer);
  }

  return { circle, targetLayer };
};
