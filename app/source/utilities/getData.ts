/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import convertOverpassLatLngtoLatLng from "./convertOverpassLatLngtoLatLng";
import getRandomItem from "./getRandomItem";
import ignoreError from "./ignoreError";
import exclusions from "./exclusions";
import isElementAnEnclosedArea from "./isElementAnEnclosedArea";
import getNamesFromElement from "./getNamesFromElement";
import type { Overpass, Question } from "../library/game/types";
import { Difficulty } from "../library/game/types";
import type { AreaSelection } from "./store";
import api from "../api";
import type { AreaOverpassData, MapFeature } from "../api/resourceObjects";
import capLng from "./capLng";
import { PresetAreaShape } from "../library/game/types";
import getCenterOfFeature from "./getCenterOfFeature";
import convertPositionToLatLng from "./convertPositionToLatLng";
import getBboxOfFeature from "./getBboxOfFeature";
import convertMapFeatureToTarget from "./convertMapFeatureToTarget";
import { reportError } from "./setUpErrorReporting";
import { usMajorStateRoadRegex } from "./elementRegularExpressions";
import { OVERPASS_ENDPOINTS } from "./overpassEndpoints";

type OverpassAttempt = {
  elapsedMs: number;
  errorName?: string;
  status?: number;
  url: string;
};

type PotEntry = {
  name: string;
  overpassElements: Overpass.Element[];
  mapFeatures: MapFeature[];
};

const difficultiesToHighwayCategories: {
  [difficulty: string]: string[];
} = {
  [Difficulty.Tourist]: ["motorway", "primary", "secondary", "trunk"],
};
difficultiesToHighwayCategories[Difficulty.Resident] = [
  ...difficultiesToHighwayCategories[Difficulty.Tourist],
  "cycleway",
  "tertiary",
];
difficultiesToHighwayCategories[Difficulty.TaxiDriver] = [
  ...difficultiesToHighwayCategories[Difficulty.Resident],
  "living_street",
  "pedestrian",
  "residential",
  "service",
  "steps",
  "unclassified",
];

const RETRYABLE_OVERPASS_STATUSES = new Set([408, 429]);

function buildPot(
  overpassElements: Overpass.Element[],
  difficulty: Difficulty,
  mapFeatures: MapFeature[],
): Map<string, PotEntry> {
  const pot = new Map<string, PotEntry>();

  for (const overpassElement of overpassElements) {
    if (isOverpassElementExcluded(overpassElement, difficulty)) {
      continue;
    }
    getOrCreatePotEntry(pot, overpassElement.tags.name).overpassElements.push(
      overpassElement,
    );
  }

  for (const mapFeature of mapFeatures) {
    getOrCreatePotEntry(pot, mapFeature.attributes.name).mapFeatures.push(
      mapFeature,
    );
  }

  return pot;
}

function buildTarget(entry: PotEntry): Question["target"] {
  const overpassTarget =
    entry.overpassElements.length > 0
      ? makeTargetFromOverpassElements(entry.overpassElements)
      : null;
  const mapFeatureTargets = entry.mapFeatures.map(convertMapFeatureToTarget);

  return {
    ...overpassTarget,
    name: overpassTarget?.name ?? entry.name,
    isEnclosedArea:
      overpassTarget?.isEnclosedArea ||
      mapFeatureTargets.some((target) => target.isEnclosedArea),
    points: [
      ...(overpassTarget?.points ?? []),
      ...mapFeatureTargets.flatMap((target) => target.points),
    ],
  };
}

async function fetchMapFeatures(
  areaSelection: AreaSelection,
): Promise<MapFeature[]> {
  const filter: Record<string, string> = {};
  if (areaSelection.areaId) {
    filter.area__id = areaSelection.areaId;
  } else if (areaSelection.presetShape === PresetAreaShape.Circle) {
    const center = convertPositionToLatLng(
      getCenterOfFeature(areaSelection.feature),
    );
    filter.circle = `${center.lat},${capLng(center.lng)},${areaSelection.radius}`;
  } else {
    filter.polygon = JSON.stringify(areaSelection.feature.geometry);
  }

  const response = await api.fetchResourceList<MapFeature>("mapFeature", {
    filter,
  });
  return response.data;
}

function getOrCreatePotEntry(
  pot: Map<string, PotEntry>,
  name: string,
): PotEntry {
  const key = name.toLowerCase();
  let entry = pot.get(key);
  if (!entry) {
    entry = { name, overpassElements: [], mapFeatures: [] };
    pot.set(key, entry);
  }
  return entry;
}

function isOverpassElementExcluded(
  overpassElement: Overpass.Element,
  difficulty: Difficulty,
): boolean {
  const key = overpassElement.tags.name?.toLowerCase();

  if (
    difficulty === Difficulty.MajorStateRoads &&
    !(
      overpassElement.tags?.ref &&
      usMajorStateRoadRegex.test(overpassElement.tags.ref)
    )
  ) {
    return true;
  }

  if (
    exclusions.some((exclusion) => {
      if (
        overpassElement.tags.highway &&
        exclusion.highways &&
        !exclusion.highways.includes(overpassElement.tags.highway)
      ) {
        return false;
      }
      if (exclusion.name instanceof RegExp) {
        return exclusion.name.test(key);
      }
      return exclusion.name === key;
    })
  ) {
    return true;
  }

  if (
    difficulty in difficultiesToHighwayCategories &&
    overpassElement.tags.highway &&
    !difficultiesToHighwayCategories[difficulty].includes(
      overpassElement.tags.highway,
    )
  ) {
    return true;
  }

  if (
    difficulty !== Difficulty.TaxiDriver &&
    overpassElement.tags.access === "private"
  ) {
    return true;
  }

  return false;
}

function isRetryableOverpassStatus(status: number) {
  return (
    RETRYABLE_OVERPASS_STATUSES.has(status) || (status >= 500 && status < 600)
  );
}

/*
  Actually get the data.
  Custom area: try localStorage, fallback to hitting OpenStreetMap's Overpass API.
  Predefined area: get data from backend, fallback to Overpass.
*/
async function loadOverpassData({
  areaSelection,
}: {
  areaSelection: AreaSelection;
}) {
  // It's safe to set this to false in development; e.g. to get the overpass query or response
  const mustGetDataFromBackend = areaSelection.areaId;
  if (mustGetDataFromBackend) {
    try {
      const areaOverpassDataItems =
        await api.fetchResourceList<AreaOverpassData>("areaoverpassdata", {
          filter: {
            area__id: areaSelection.areaId,
          },
          page: {
            size: 1,
          },
        });
      if (!areaOverpassDataItems.data.length) {
        throw new Error("No AreaOverpassDatas");
      }
      return areaOverpassDataItems.data[0].attributes.responseBody;
    } catch (error) {
      console.warn(
        "Failed to get overpass data from backend, falling back to Overpass...",
        {
          error,
        },
      );
      reportError(error);
    }
  }

  const overpassQuery = makeOverpassQuery({ areaSelection });

  const shouldCacheResponseInBrowser = !areaSelection.areaId;
  // If the query changes, the "cache" is automatically skipped
  const localStorageKey = `overpass-response2__${overpassQuery})`;

  if (shouldCacheResponseInBrowser) {
    const responseFromLocalStorage = ignoreError(() =>
      localStorage.getItem(localStorageKey),
    );

    // Prune localStorage
    Object.entries(ignoreError(() => localStorage) || {})
      .map(([key]) => key)
      .filter(
        (key) => key !== localStorageKey && key.startsWith("overpass-response"),
      )
      .forEach((key) => ignoreError(() => localStorage.removeItem(key)));

    if (responseFromLocalStorage) {
      try {
        return JSON.parse(responseFromLocalStorage);
      } catch (e) {
        // Ignore and continue to query API
      }
    }
  }

  let result;
  try {
    result = await fetchOverpassWithFallback(overpassQuery);
  } catch (error) {
    reportError(error);
    throw error;
  }

  if (shouldCacheResponseInBrowser) {
    ignoreError(() =>
      localStorage.setItem(localStorageKey, JSON.stringify(result)),
    );
  }

  return result;
}

function makeOverpassQuery({
  areaSelection,
}: {
  areaSelection: AreaSelection;
}): string {
  // Setting the bounding box is important. It massively speeds up the query
  const bbox = getBboxOfFeature(areaSelection.feature, 4);
  const bboxString = [bbox.south, bbox.west, bbox.north, bbox.east].join(",");

  /*
    A spatial modifier limits a `way` query to X bounds, for example.
    If we are dealing with a multiple polygons, we need multiple spatial modifiers. So if we have N polygons,
    we'd have N copies of each query statement, except each with a different spartial modifier.
  */
  let spatialModifiers: string[] = [];
  if (areaSelection.presetShape === PresetAreaShape.Circle) {
    const centerLatLng = convertPositionToLatLng(
      getCenterOfFeature(areaSelection.feature),
    );
    const aroundValue = `${areaSelection.radius},${centerLatLng.lat},${capLng(
      centerLatLng.lng,
    )}`;
    spatialModifiers.push(`(around:${aroundValue})`);
  } else if (areaSelection.presetShape === PresetAreaShape.MultiPolygon) {
    if (areaSelection.feature.geometry.type !== "MultiPolygon") {
      throw new Error(
        `MultiPolygon areaSelection has geometry type of ${areaSelection.feature.geometry.type}`,
      );
    }

    /*
      A polygon may have an outer ring and (optional) inner rings (to exclude). We use the "stitched
      path" trick to exlude any inner rings. All rings get converted to`lat1 lng1 lat2 lng2..`, but
      we also repeat the first (outer) vertice before and after each inner ring.
      
      Examples:
      - Simple polygon: `lat1 lng1 lat2 lng2...`
      - Polygon with two inner rings:
          ```
          outer-lat1 outer-lng1 outer-lat2 outer-lng2...
          outer-lat1 outer-lng1
          inner1-lat1 inner1-lng1 inner1-lat2 inner1-lng2...
          outer-lat1 outer-lng1
          inner2-lat1 inner2-lng1 inner2-lat2 inner2-lng2...
          outer-lat1 outer-lng1
          ```
          Note: the newlines wouldn't actually exist
    */
    spatialModifiers = areaSelection.feature.geometry.coordinates.map(
      (rings) => {
        let polyModifierValue = "";
        let firstLatLngPair: string | undefined;

        for (let i = 0; i < rings.length; i++) {
          const latLngPairs = rings[i].map(([lng, lat]) => `${lat} ${lng}`);

          firstLatLngPair ??= latLngPairs[0];
          if (i) {
            polyModifierValue += " " + firstLatLngPair + " ";
          }
          polyModifierValue += latLngPairs.join(" ");
        }

        if (rings.length > 1) {
          polyModifierValue += " " + firstLatLngPair;
        }

        return `(poly:"${polyModifierValue}")`;
      },
    );
  } else {
    spatialModifiers.push(`(${bboxString})`);
  }

  const highwayCategories = Object.values(difficultiesToHighwayCategories)
    .map((categories) => categories)
    .flat();
  const highwayRegex = `^(${highwayCategories.join("||")})$`;

  /*
    This queries Overpass using the Overpass query lanaguage. It's basically saying give me all
    streets with a name within N metres around M center point. It also specifies the minimal
    properties we need in the response.
  */
  const overpassQueryLines = [`[out:json][bbox:${bboxString}];`, `(`];

  for (const spatialModifier of spatialModifiers) {
    overpassQueryLines.push(
      `(`,
      `way${spatialModifier}[highway~"${highwayRegex}"][name];`,
      `way${spatialModifier}[historic~"^(castle|fort|monument|ruins|ship|tower)$"][name][wikidata];`,
      `way${spatialModifier}[tourism~"^(aquarium|museum|zoo)$"][name][wikidata];`,
      `);`,
    );
  }

  overpassQueryLines.push(`);`, `out%20tags%20geom;`);

  return overpassQueryLines.join("");
}

function makeTargetFromOverpassElements(
  overpassElements: Overpass.Element[],
): Question["target"] {
  const points = overpassElements.map(({ geometry }) =>
    geometry.map(convertOverpassLatLngtoLatLng),
  );

  let width: number | undefined;
  const widthsThatExist = overpassElements
    .map(({ tags }) => {
      // Parse width; see https://wiki.openstreetmap.org/wiki/Key:width
      const match = tags.width?.match(/^(\d+(\.\d+)?)( ?m)?$/);
      if (match) {
        return parseFloat(match[1]);
      }
    })
    .filter((width): width is number => typeof width === "number");
  if (widthsThatExist.length) {
    // Average
    width = widthsThatExist.reduce((a, b) => a + b, 0) / widthsThatExist.length;
  }

  return {
    ...getNamesFromElement(overpassElements[0]),
    isEnclosedArea: overpassElements.some((overpassElement) =>
      isElementAnEnclosedArea(overpassElement, [
        overpassElement.geometry.map(convertOverpassLatLngtoLatLng),
      ]),
    ),
    points,
    width,
  };
}

function selectRandomEntries(
  pot: Map<string, PotEntry>,
  count: number,
  getRandomNumber: () => number,
): PotEntry[] {
  const results: PotEntry[] = [];
  const keys = [...pot.keys()];

  for (let i = 0; i < count; i++) {
    const key = getRandomItem(keys, getRandomNumber);
    if (!key) {
      break;
    }
    results.push(pot.get(key)!);
    keys.splice(keys.indexOf(key), 1);
  }

  return results;
}

export async function fetchOverpassWithFallback(
  overpassQuery: string,
): Promise<Overpass.Response> {
  const requestBody = `data=${overpassQuery}`;
  const requestHeaders = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const attempts: OverpassAttempt[] = [];
  const totalStartMs = Date.now();
  for (const endpoint of OVERPASS_ENDPOINTS) {
    const attemptStartMs = Date.now();
    try {
      const response = await fetch(endpoint.url, {
        body: requestBody,
        headers: requestHeaders,
        method: "POST",
      });
      const elapsedMs = Date.now() - attemptStartMs;

      if (response.ok) {
        console.debug("Overpass request succeeded", {
          url: endpoint.url,
          elapsedMs,
        });
        try {
          return (await response.json()) as Overpass.Response;
        } catch (error) {
          console.error("Overpass response JSON parse failed", {
            url: endpoint.url,
            error,
          });
          throw new Error(
            `Cannot parse street data from third-party OpenStreetMap data provider (Overpass). [${error}]`,
          );
        }
      }

      const attempt = {
        url: endpoint.url,
        status: response.status,
        elapsedMs,
      };
      attempts.push(attempt);

      if (isRetryableOverpassStatus(response.status)) {
        console.warn("Overpass request failed, trying next endpoint", attempt);
        continue;
      }

      console.error(
        "Overpass request failed with non-retryable status",
        attempt,
      );
      throw new Error(
        `Failed to retrieve street data from third-party OpenStreetMap data provider (Overpass) (${response.status})`,
      );
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.startsWith("Failed to retrieve street data") ||
          error.message.startsWith("Cannot parse street data"))
      ) {
        throw error;
      }

      const attempt = {
        url: endpoint.url,
        errorName: error instanceof Error ? error.name : "UnknownError",
        elapsedMs: Date.now() - attemptStartMs,
      };
      attempts.push(attempt);
      console.warn("Overpass request errored, trying next endpoint", {
        ...attempt,
        error,
      });
    }
  }

  const totalElapsedMs = Date.now() - totalStartMs;
  const lastAttempt = attempts[attempts.length - 1];
  const attemptSummary = attempts
    .map(
      (attempt) =>
        `${attempt.url}=${attempt.status ?? attempt.errorName ?? "error"}`,
    )
    .join(", ");

  const errorMessage = `Failed to retrieve street data. ${
    attempts.length
  } third-party OpenStreetMap data providers have failed (Overpass) (last status: ${
    lastAttempt?.status ?? "unknown"
  }). They could be experiencing a temporary outage, please try again later. Attempts: ${attemptSummary}`;
  const errorWithContext = new Error(errorMessage) as Error & {
    attempts?: OverpassAttempt[];
    totalElapsedMs?: number;
  };
  errorWithContext.attempts = attempts;
  errorWithContext.totalElapsedMs = totalElapsedMs;

  console.error("Overpass fallbacks exhausted", {
    attempts,
    totalElapsedMs,
  });
  throw errorWithContext;
}

export default async function getData({
  areaSelection,
  difficulty,
  getRandomNumber,
  isOrganizationUrl,
  numberOfQuestions,
}: {
  areaSelection: AreaSelection;
  difficulty: Difficulty;
  getRandomNumber: () => number;
  isOrganizationUrl: boolean;
  numberOfQuestions: number;
}): Promise<Question["target"][]> {
  const mapFeaturesPromise = isOrganizationUrl
    ? fetchMapFeatures(areaSelection).catch((error) => {
        console.warn("Failed to fetch map features", { error });
        reportError(error);
        return [] as MapFeature[];
      })
    : Promise.resolve([] as MapFeature[]);

  const [{ elements: overpassElements }, mapFeatures] = await Promise.all([
    loadOverpassData({ areaSelection }) as Promise<Overpass.Response>,
    mapFeaturesPromise,
  ]);

  const pot = buildPot(overpassElements, difficulty, mapFeatures);
  const selected = selectRandomEntries(pot, numberOfQuestions, getRandomNumber);
  return selected.map(buildTarget);
}
