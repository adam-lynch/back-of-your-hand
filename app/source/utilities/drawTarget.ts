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
  shouldDrawSurroundingCircle, // The summary doesn't have circles around each street
}: {
  color?: string;
  layer: leaflet.Map | leaflet.LayerGroup<unknown>;
  question: Question;
  shouldDrawSurroundingCircle?: boolean;
}) => {
  if (!question.distance) {
    throw new Error("question.distance does not exist");
  }
  const colorToUse = color || getColorFromDistance(question.distance.amount);
  let targetLayer:
    | leaflet.CircleMarker
    | leaflet.Polygon
    | ReturnType<typeof leaflet.polyline>;

  /*
    Separate single-point entries (point-of-interest map features) from
    multi-point entries (street segments) so each renders appropriately.
    A merged target (same-named street + point of interest) contains both.
  */
  const singlePoints: leaflet.LatLngExpression[] = [];
  const polylineSegments: typeof question.target.points = [];
  for (const pointGroup of question.target.points) {
    if (pointGroup.length === 1) {
      singlePoints.push([pointGroup[0].lat, pointGroup[0].lng]);
    } else {
      polylineSegments.push(pointGroup);
    }
  }

  const circleMarkerStyle: leaflet.CircleMarkerOptions = {
    color: colorToUse,
    fillColor: colorToUse,
    fillOpacity: 1,
    radius: 5,
    weight: 3,
  };

  const isSinglePoint =
    !question.target.isEnclosedArea &&
    polylineSegments.length === 0 &&
    singlePoints.length === 1;

  if (question.target.isEnclosedArea) {
    targetLayer = leaflet.polygon(question.target.points, {
      color: colorToUse,
      fillColor: colorToUse,
      fillOpacity: 0.1,
      opacity: 1,
      weight: 3,
    });
  } else if (isSinglePoint) {
    targetLayer = leaflet.circleMarker(singlePoints[0], circleMarkerStyle);
  } else {
    targetLayer = leaflet.polyline(polylineSegments, {
      color: colorToUse,
      fillColor: "white",
      fillOpacity: 1,
      weight: Math.max(Math.ceil(question.target.width || 0), 10),
    });
  }

  if (!isSinglePoint) {
    for (const point of singlePoints) {
      leaflet.circleMarker(point, circleMarkerStyle).addTo(layer);
    }
  }

  targetLayer.addTo(layer);

  const targetBounds =
    "getBounds" in targetLayer
      ? targetLayer.getBounds()
      : leaflet.latLngBounds([
          targetLayer.getLatLng(),
          targetLayer.getLatLng(),
        ]);

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

  let scoringCircle;
  if (
    !question.target.isEnclosedArea &&
    !isSinglePoint &&
    shouldDrawSurroundingCircle
  ) {
    const targetCenterCoordinates = turf.center(
      turf.featureCollection(targetTurfPoints),
    ).geometry.coordinates as leaflet.LatLngExpression;

    scoringCircle = leaflet
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

  return { scoringCircle, targetLayer };
};
