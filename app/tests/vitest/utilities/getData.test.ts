/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../../source/api", () => ({
  default: {
    fetchResourceList: vi.fn(),
  },
}));

import api from "../../../source/api";
import getData, {
  fetchOverpassWithFallback,
} from "../../../source/utilities/getData";
import {
  Difficulty,
  PresetAreaShape,
} from "../../../source/library/game/types";
import type { AreaSelection } from "../../../source/utilities/store";
import { OVERPASS_ENDPOINTS } from "../../../source/utilities/overpassEndpoints";
import type * as GeoJSON from "geojson";

const makeResponse = (status: number, body?: unknown) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }) as Response;

describe("fetchOverpassWithFallback", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("falls back to the next endpoint on retryable failures", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock
      .mockResolvedValueOnce(makeResponse(504))
      .mockResolvedValueOnce(makeResponse(504))
      .mockResolvedValueOnce(makeResponse(200, { elements: [] }));

    const result = await fetchOverpassWithFallback("query");

    expect(result).toEqual({ elements: [] });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(OVERPASS_ENDPOINTS[0].url);
    expect(fetchMock.mock.calls[1]?.[0]).toBe(OVERPASS_ENDPOINTS[1].url);
    expect(fetchMock.mock.calls[2]?.[0]).toBe(OVERPASS_ENDPOINTS[2].url);
  });

  it("does not retry on non-retryable status codes", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce(makeResponse(400));

    await expect(fetchOverpassWithFallback("query")).rejects.toThrow(
      "Failed to retrieve street data from third-party OpenStreetMap data provider (Overpass) (400)",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(OVERPASS_ENDPOINTS[0].url);
  });

  it("retries on other retryable status codes", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock
      .mockResolvedValueOnce(makeResponse(429))
      .mockResolvedValueOnce(makeResponse(200, { elements: [] }));

    const result = await fetchOverpassWithFallback("query");

    expect(result).toEqual({ elements: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(OVERPASS_ENDPOINTS[0].url);
    expect(fetchMock.mock.calls[1]?.[0]).toBe(OVERPASS_ENDPOINTS[1].url);
  });

  it("stops on a different non-retryable 4xx response", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce(makeResponse(403));

    await expect(fetchOverpassWithFallback("query")).rejects.toThrow(
      "Failed to retrieve street data from third-party OpenStreetMap data provider (Overpass) (403)",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(OVERPASS_ENDPOINTS[0].url);
  });

  it("continues after a network error and succeeds", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock
      .mockRejectedValueOnce(new TypeError("NetworkError"))
      .mockResolvedValueOnce(makeResponse(200, { elements: [] }));

    const result = await fetchOverpassWithFallback("query");

    expect(result).toEqual({ elements: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(OVERPASS_ENDPOINTS[0].url);
    expect(fetchMock.mock.calls[1]?.[0]).toBe(OVERPASS_ENDPOINTS[1].url);
  });

  it("throws when a successful response cannot be parsed", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("Unexpected token");
      },
    } as unknown as Response);

    await expect(fetchOverpassWithFallback("query")).rejects.toThrow(
      "Cannot parse street data from third-party OpenStreetMap data provider (Overpass).",
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(OVERPASS_ENDPOINTS[0].url);
  });

  it("reports failure after all endpoints fail", async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    for (let i = 0; i < OVERPASS_ENDPOINTS.length; i += 1) {
      fetchMock.mockResolvedValueOnce(makeResponse(504));
    }

    try {
      await fetchOverpassWithFallback("query");
      throw new Error("Expected fetchOverpassWithFallback to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      if (error instanceof Error) {
        expect(error.message).toContain(
          `Failed to retrieve street data. ${OVERPASS_ENDPOINTS.length} third-party OpenStreetMap data providers have failed (Overpass)`,
        );
        expect(error.message).toContain(
          `Attempts: ${OVERPASS_ENDPOINTS[0].url}=504`,
        );
      }
    }
    expect(fetchMock).toHaveBeenCalledTimes(OVERPASS_ENDPOINTS.length);
  });
});

describe("getData (default export)", () => {
  const originalFetch = globalThis.fetch;
  const originalLocalStorage = globalThis.localStorage;

  const areaSelectionFeature: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-8.5, 51.9],
          [-8.5, 51.8],
          [-8.4, 51.8],
          [-8.4, 51.9],
          [-8.5, 51.9],
        ],
      ],
    },
    properties: {},
  };

  const areaSelection: AreaSelection = {
    areaId: null,
    feature: areaSelectionFeature,
    presetShape: PresetAreaShape.Circle,
    radius: 5000,
  };

  const overpassResponse = {
    elements: [
      {
        id: 1,
        type: "way",
        tags: { name: "Main Street", highway: "secondary" },
        geometry: [
          { lat: 51.89, lon: -8.5 },
          { lat: 51.89, lon: -8.49 },
        ],
      },
      {
        id: 2,
        type: "way",
        tags: { name: "Oak Avenue", highway: "residential" },
        geometry: [
          { lat: 51.88, lon: -8.5 },
          { lat: 51.88, lon: -8.49 },
        ],
      },
    ],
  };

  const mapFeatureResponse = {
    data: [
      {
        id: "map-feature-1",
        type: "mapFeature" as const,
        attributes: {
          createdAt: "2024-01-01T00:00:00Z",
          deletedAt: null,
          lastUpdatedAt: "2024-01-01T00:00:00Z",
          name: "Main Street",
          geom: { type: "Point" as const, coordinates: [-8.5, 51.89] },
          origin: "user" as const,
          tags: {},
        },
      },
      {
        id: "map-feature-2",
        type: "mapFeature" as const,
        attributes: {
          createdAt: "2024-01-01T00:00:00Z",
          deletedAt: null,
          lastUpdatedAt: "2024-01-01T00:00:00Z",
          name: "Station 4",
          geom: { type: "Point" as const, coordinates: [-8.51, 51.88] },
          origin: "user" as const,
          tags: {},
        },
      },
    ],
  };

  beforeEach(() => {
    globalThis.fetch = vi.fn();
    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
      configurable: true,
    });
    vi.spyOn(console, "debug").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    Object.defineProperty(globalThis, "localStorage", {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it("merges entries when a map feature shares a name with an Overpass street", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      makeResponse(200, overpassResponse),
    );
    vi.mocked(api.fetchResourceList).mockResolvedValueOnce(mapFeatureResponse);

    let callCount = 0;
    const getRandomNumber = () => {
      const values = [0.0, 0.5];
      return values[callCount++];
    };

    const results = await getData({
      areaSelection,
      difficulty: Difficulty.Resident,
      getRandomNumber,
      isOrganizationUrl: true,
      numberOfQuestions: 5,
    });

    /*
      "Main Street" appears in both Overpass and map feature data — merges.
      "Station 4" is map-feature-only.
      "Oak Avenue" is Overpass-only but not selected (getRandomNumber runs out).
    */
    expect(results).toEqual([
      {
        name: "Main Street",
        isEnclosedArea: false,
        points: [
          [
            { lat: 51.89, lng: -8.5 },
            { lat: 51.89, lng: -8.49 },
          ],
          [{ lat: 51.89, lng: -8.5 }],
        ],
      },
      {
        name: "Station 4",
        isEnclosedArea: false,
        points: [[{ lat: 51.88, lng: -8.51 }]],
      },
    ]);
  });

  it("merges multiple map features with the same name", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      makeResponse(200, { elements: [] }),
    );

    const duplicateMapFeatureResponse = {
      data: [
        {
          type: "mapFeature" as const,
          id: "map-feature-1",
          attributes: {
            createdAt: "2024-01-01T00:00:00Z",
            deletedAt: null,
            lastUpdatedAt: "2024-01-01T00:00:00Z",
            name: "Fire Station 1",
            geom: { type: "Point" as const, coordinates: [-8.5, 51.89] },
            origin: "user" as const,
            tags: {},
          },
        },
        {
          type: "mapFeature" as const,
          id: "map-feature-2",
          attributes: {
            createdAt: "2024-01-01T00:00:00Z",
            deletedAt: null,
            lastUpdatedAt: "2024-01-01T00:00:00Z",
            name: "Fire Station 1",
            geom: { type: "Point" as const, coordinates: [-8.51, 51.891] },
            origin: "user" as const,
            tags: {},
          },
        },
        {
          type: "mapFeature" as const,
          id: "map-feature-3",
          attributes: {
            createdAt: "2024-01-01T00:00:00Z",
            deletedAt: null,
            lastUpdatedAt: "2024-01-01T00:00:00Z",
            name: "City Park",
            geom: { type: "Point" as const, coordinates: [-8.52, 51.88] },
            origin: "user" as const,
            tags: {},
          },
        },
      ],
    };
    vi.mocked(api.fetchResourceList).mockResolvedValueOnce(
      duplicateMapFeatureResponse,
    );

    let callCount = 0;
    const getRandomNumber = () => {
      const values = [0.0, 0.5];
      return values[callCount++];
    };

    const results = await getData({
      areaSelection,
      difficulty: Difficulty.Resident,
      getRandomNumber,
      isOrganizationUrl: true,
      numberOfQuestions: 5,
    });

    expect(results).toEqual([
      {
        name: "Fire Station 1",
        isEnclosedArea: false,
        points: [[{ lat: 51.89, lng: -8.5 }], [{ lat: 51.891, lng: -8.51 }]],
      },
      {
        name: "City Park",
        isEnclosedArea: false,
        points: [[{ lat: 51.88, lng: -8.52 }]],
      },
    ]);
  });

  it("merges Overpass elements with the same name", async () => {
    const multiSegmentResponse = {
      elements: [
        {
          id: 1,
          geometry: [
            { lat: 51.89, lon: -8.5 },
            { lat: 51.89, lon: -8.49 },
          ],
          tags: { name: "Oak Street", highway: "secondary" },
        },
        {
          id: 2,
          geometry: [
            { lat: 51.89, lon: -8.49 },
            { lat: 51.89, lon: -8.48 },
          ],
          tags: { name: "Oak Street", highway: "secondary" },
        },
        {
          id: 3,
          geometry: [
            { lat: 51.88, lon: -8.5 },
            { lat: 51.88, lon: -8.49 },
          ],
          tags: { name: "Elm Road", highway: "residential" },
        },
      ],
    };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      makeResponse(200, multiSegmentResponse),
    );
    vi.mocked(api.fetchResourceList).mockResolvedValueOnce({ data: [] });

    let callCount = 0;
    const getRandomNumber = () => {
      const values = [0.0];
      return values[callCount++];
    };

    const results = await getData({
      areaSelection,
      difficulty: Difficulty.Resident,
      getRandomNumber,
      isOrganizationUrl: true,
      numberOfQuestions: 5,
    });

    // Only "Oak Street" selected — "Elm Road" not picked (getRandomNumber runs out)
    expect(results).toEqual([
      {
        name: "Oak Street",
        isEnclosedArea: false,
        points: [
          [
            { lat: 51.89, lng: -8.5 },
            { lat: 51.89, lng: -8.49 },
          ],
          [
            { lat: 51.89, lng: -8.49 },
            { lat: 51.89, lng: -8.48 },
          ],
        ],
      },
    ]);
  });

  it("does not exclude map features that match exclusion rules", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      makeResponse(200, { elements: [] }),
    );
    vi.mocked(api.fetchResourceList).mockResolvedValueOnce({
      data: [
        {
          id: "map-feature-excluded-name",
          type: "mapFeature" as const,
          attributes: {
            createdAt: "2024-01-01T00:00:00Z",
            deletedAt: null,
            lastUpdatedAt: "2024-01-01T00:00:00Z",
            name: "Alley",
            geom: { type: "Point" as const, coordinates: [-8.5, 51.89] },
            origin: "user" as const,
            tags: {},
          },
        },
      ],
    });

    const results = await getData({
      areaSelection,
      difficulty: Difficulty.Resident,
      getRandomNumber: () => 0,
      isOrganizationUrl: true,
      numberOfQuestions: 5,
    });

    expect(results).toEqual([
      {
        name: "Alley",
        isEnclosedArea: false,
        points: [[{ lat: 51.89, lng: -8.5 }]],
      },
    ]);
  });

  it("excludes Overpass elements that match exclusion rules", async () => {
    const responseWithExcluded = {
      elements: [
        {
          id: 1,
          geometry: [
            { lat: 51.89, lon: -8.5 },
            { lat: 51.89, lon: -8.49 },
          ],
          tags: { name: "Alley", highway: "service" },
        },
        {
          id: 2,
          geometry: [
            { lat: 51.88, lon: -8.5 },
            { lat: 51.88, lon: -8.49 },
          ],
          tags: { name: "Main Street", highway: "secondary" },
        },
      ],
    };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      makeResponse(200, responseWithExcluded),
    );

    const results = await getData({
      areaSelection,
      difficulty: Difficulty.Resident,
      getRandomNumber: () => 0,
      isOrganizationUrl: false,
      numberOfQuestions: 5,
    });

    expect(results).toEqual([
      {
        name: "Main Street",
        isEnclosedArea: false,
        points: [
          [
            { lat: 51.88, lng: -8.5 },
            { lat: 51.88, lng: -8.49 },
          ],
        ],
      },
    ]);
  });

  it("parses and averages width from Overpass elements", async () => {
    const response = {
      elements: [
        {
          id: 1,
          geometry: [
            { lat: 51.89, lon: -8.5 },
            { lat: 51.89, lon: -8.49 },
          ],
          tags: { name: "Wide Road", highway: "secondary", width: "10" },
        },
        {
          id: 2,
          geometry: [
            { lat: 51.89, lon: -8.49 },
            { lat: 51.89, lon: -8.48 },
          ],
          tags: { name: "Wide Road", highway: "secondary", width: "6 m" },
        },
        {
          id: 3,
          geometry: [
            { lat: 51.89, lon: -8.48 },
            { lat: 51.89, lon: -8.47 },
          ],
          tags: { name: "Wide Road", highway: "secondary", width: "5'6\"" },
        },
      ],
    };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      makeResponse(200, response),
    );

    const results = await getData({
      areaSelection,
      difficulty: Difficulty.Resident,
      getRandomNumber: () => 0,
      isOrganizationUrl: false,
      numberOfQuestions: 5,
    });

    // "10" and "6 m" are parseable (avg 8), "5'6\"" is not
    expect(results).toEqual([
      {
        name: "Wide Road",
        isEnclosedArea: false,
        width: 8,
        points: [
          [
            { lat: 51.89, lng: -8.5 },
            { lat: 51.89, lng: -8.49 },
          ],
          [
            { lat: 51.89, lng: -8.49 },
            { lat: 51.89, lng: -8.48 },
          ],
          [
            { lat: 51.89, lng: -8.48 },
            { lat: 51.89, lng: -8.47 },
          ],
        ],
      },
    ]);
  });

  it("does not pick the same entry twice", async () => {
    const singleEntryResponse = {
      elements: [
        {
          id: 1,
          geometry: [
            { lat: 51.89, lon: -8.5 },
            { lat: 51.89, lon: -8.49 },
          ],
          tags: { name: "Only Street", highway: "secondary" },
        },
      ],
    };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      makeResponse(200, singleEntryResponse),
    );

    const results = await getData({
      areaSelection,
      difficulty: Difficulty.Resident,
      getRandomNumber: () => 0,
      isOrganizationUrl: false,
      numberOfQuestions: 3,
    });

    expect(results).toEqual([
      {
        name: "Only Street",
        isEnclosedArea: false,
        points: [
          [
            { lat: 51.89, lng: -8.5 },
            { lat: 51.89, lng: -8.49 },
          ],
        ],
      },
    ]);
  });

  it("does not merge entries with different names", async () => {
    const uniqueNamesResponse = {
      elements: [
        {
          id: 1,
          geometry: [
            { lat: 51.89, lon: -8.5 },
            { lat: 51.89, lon: -8.49 },
          ],
          tags: { name: "First Street", highway: "secondary" },
        },
        {
          id: 2,
          geometry: [
            { lat: 51.89, lon: -8.48 },
            { lat: 51.89, lon: -8.47 },
          ],
          tags: { name: "Second Street", highway: "secondary" },
        },
      ],
    };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      makeResponse(200, uniqueNamesResponse),
    );

    const uniquePoiResponse = {
      data: [
        {
          type: "mapFeature" as const,
          id: "map-feature-1",
          attributes: {
            createdAt: "2024-01-01T00:00:00Z",
            deletedAt: null,
            lastUpdatedAt: "2024-01-01T00:00:00Z",
            name: "Fire Station",
            geom: { type: "Point" as const, coordinates: [-8.5, 51.89] },
            origin: "user" as const,
            tags: {},
          },
        },
      ],
    };
    vi.mocked(api.fetchResourceList).mockResolvedValueOnce(uniquePoiResponse);

    let callCount = 0;
    const getRandomNumber = () => {
      const values = [0.0, 0.33, 0.66];
      return values[callCount++];
    };

    const results = await getData({
      areaSelection,
      difficulty: Difficulty.Resident,
      getRandomNumber,
      isOrganizationUrl: true,
      numberOfQuestions: 5,
    });

    expect(results).toEqual([
      {
        name: "First Street",
        isEnclosedArea: false,
        points: [
          [
            { lat: 51.89, lng: -8.5 },
            { lat: 51.89, lng: -8.49 },
          ],
        ],
      },
      {
        name: "Second Street",
        isEnclosedArea: false,
        points: [
          [
            { lat: 51.89, lng: -8.48 },
            { lat: 51.89, lng: -8.47 },
          ],
        ],
      },
      {
        name: "Fire Station",
        isEnclosedArea: false,
        points: [[{ lat: 51.89, lng: -8.5 }]],
      },
    ]);
  });
});
