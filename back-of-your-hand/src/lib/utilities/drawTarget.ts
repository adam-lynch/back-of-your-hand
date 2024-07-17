import leaflet from "leaflet";
import getCenter from "@turf/center";
import createFeatureCollection from "turf-featurecollection";
import createPoint from "turf-point";

import convertLatLngToCoordinates from "./convertLatLngToCoordinates";
import getColorFromDistance from "./getColorFromDistance";
import type { Question } from "./types";

export default ({
  color,
  layer,
  question,
  shouldDrawCircle, // The summary doesn't have circles around each street
}: {
  color?: string;
  layer: leaflet.Map | leaflet.LayerGroup<any>;
  question: Question;
  shouldDrawCircle?: boolean;
}) => {
  const colorToUse = color || getColorFromDistance(question.distance.amount);
  let targetLayer: leaflet.Polygon | leaflet.Polyline;

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

  const targetTurfPoints = question.target.points.reduce(
    (result, targetPoints) => [
      ...result,
      ...targetPoints.map((targetPoint) =>
        createPoint(convertLatLngToCoordinates(targetPoint)),
      ),
    ],
    [],
  );

  let circle;
  if (!question.target.isEnclosedArea && shouldDrawCircle) {
    const targetCenterCoordinates = getCenter.default(
      createFeatureCollection(targetTurfPoints),
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
