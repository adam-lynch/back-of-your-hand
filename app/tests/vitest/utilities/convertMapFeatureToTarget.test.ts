/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2026 Adam Lynch (https://adamlynch.com)
 */

import { describe, expect, it } from "vitest";

import type { MapFeature } from "../../../source/api/resourceObjects";
import convertMapFeatureToTarget from "../../../source/utilities/convertMapFeatureToTarget";

function makeMapFeature(name: string, geom: GeoJSON.Geometry): MapFeature {
  return {
    id: "1",
    type: "mapFeature",
    attributes: { name, geom },
  } as unknown as MapFeature;
}

describe("convertMapFeatureToTarget", () => {
  it("converts a Point geometry", () => {
    const feature = makeMapFeature("Test Street", {
      type: "Point",
      coordinates: [-6.25, 53.35],
    });

    const result = convertMapFeatureToTarget(feature);

    expect(result).toEqual({
      name: "Test Street",
      isEnclosedArea: false,
      points: [[{ lat: 53.35, lng: -6.25 }]],
    });
  });

  it("converts a Polygon geometry", () => {
    const feature = makeMapFeature("Test Park", {
      type: "Polygon",
      coordinates: [
        [
          [-6.25, 53.35],
          [-6.26, 53.36],
          [-6.27, 53.35],
          [-6.25, 53.35],
        ],
      ],
    });

    const result = convertMapFeatureToTarget(feature);

    expect(result).toEqual({
      name: "Test Park",
      isEnclosedArea: true,
      points: [
        [
          { lat: 53.35, lng: -6.25 },
          { lat: 53.36, lng: -6.26 },
          { lat: 53.35, lng: -6.27 },
          { lat: 53.35, lng: -6.25 },
        ],
      ],
    });
  });

  it("converts a MultiPolygon geometry with flattened rings", () => {
    const feature = makeMapFeature("Test Area", {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [0, 1],
            [2, 3],
            [0, 1],
          ],
        ],
        [
          [
            [4, 5],
            [6, 7],
            [4, 5],
          ],
        ],
      ],
    });

    const result = convertMapFeatureToTarget(feature);

    expect(result.isEnclosedArea).toBe(true);
    expect(result.points).toEqual([
      [
        { lat: 1, lng: 0 },
        { lat: 3, lng: 2 },
        { lat: 1, lng: 0 },
      ],
      [
        { lat: 5, lng: 4 },
        { lat: 7, lng: 6 },
        { lat: 5, lng: 4 },
      ],
    ]);
  });

  it("passes through the name directly", () => {
    const feature = makeMapFeature("Main St", {
      type: "Point",
      coordinates: [0, 0],
    });

    expect(convertMapFeatureToTarget(feature).name).toBe("Main St");
  });

  it("throws for unsupported geometry types", () => {
    const feature = makeMapFeature("Bad Feature", {
      type: "GeometryCollection",
      geometries: [],
    });

    expect(() => convertMapFeatureToTarget(feature)).toThrow(
      "Unsupported geometry type: GeometryCollection",
    );
  });
});
