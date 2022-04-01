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
  const polyline = leaflet
    .polyline(question.street.points, {
      color: colorToUse,
      fillColor: "white",
      fillOpacity: 1,
      weight: Math.max(Math.ceil(question.street.width || 0), 10),
    })
    .addTo(layer);

  const streetPolylineBounds = polyline.getBounds();

  const streetTurfPoints = question.street.points.reduce(
    (result, streetPoints) => [
      ...result,
      ...streetPoints.map((streetPoint) =>
        createPoint(convertLatLngToCoordinates(streetPoint))
      ),
    ],
    []
  );

  let circle;
  if (shouldDrawCircle) {
    const streetPolylineCenterCoordinates = getCenter.default(
      createFeatureCollection(streetTurfPoints)
    ).geometry.coordinates as leaflet.LatLngExpression;

    circle = leaflet
      .circle(streetPolylineCenterCoordinates, {
        color: colorToUse,
        fillOpacity: 0.1,
        opacity: 0.2,
        radius:
          Math.max(
            streetPolylineBounds
              .getNorthWest()
              .distanceTo(streetPolylineBounds.getSouthEast()),
            streetPolylineBounds
              .getNorthEast()
              .distanceTo(streetPolylineBounds.getSouthWest())
          ) * 0.8,
        weight: 1,
      })
      .addTo(layer);
  }

  return { circle, polyline };
};
