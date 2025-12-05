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
import type { AreaOverpassData } from "../api/resourceObjects";
import capLng from "./capLng";
import { PresetAreaShape } from "../library/game/types";
import getCenterOfFeature from "./getCenterOfFeature";
import convertPositionToLatLng from "./convertPositionToLatLng";
import getBboxOfFeature from "./getBboxOfFeature";
import { reportError } from "./setUpErrorReporting";
import { usMajorStateRoadRegex } from "./elementRegularExpressions";

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

// Convert to our type, join with other streets of the same name, etc.
const adjustStreetDetails = (
  targetElement: Overpass.Element,
  allTargetElements: Overpass.Element[],
): Question["target"] => {
  // Group all streets with the same name
  const equivalentTargets = [
    targetElement,
    ...allTargetElements.filter(
      (element) =>
        element.id !== targetElement.id &&
        element.tags.name === targetElement.tags.name,
    ),
  ];

  const points = equivalentTargets.map(({ geometry }) =>
    geometry.map(convertOverpassLatLngtoLatLng),
  );

  let width: number | undefined;
  const widths = equivalentTargets.map(({ tags }) => {
    // Parse width; see https://wiki.openstreetmap.org/wiki/Key:width
    const match = tags.width?.match(/^(\d+(\.\d+)?)( ?m)?$/);
    if (match) {
      return parseFloat(match[1]);
    }
  });
  const widthsThatExist = widths.filter((width) => typeof width === "number");
  if (widthsThatExist.length) {
    // Average
    width = widthsThatExist.reduce((a, b) => a + b, 0) / widthsThatExist.length;
  }

  return {
    ...getNamesFromElement(targetElement),
    isEnclosedArea: equivalentTargets.some((element) =>
      isElementAnEnclosedArea(element, [
        element.geometry.map(convertOverpassLatLngtoLatLng),
      ]),
    ),
    points,
    width,
  };
};

/*
  Actually get the data.
  Custom area: try localStorage, fallback to hitting OpenStreetMap's Overpass API.
  Predefined area: get data from backend, fallback to Overpass.
*/
const load = async ({ areaSelection }: { areaSelection: AreaSelection }) => {
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

  const performFetch = () => {
    return fetch(`https://www.overpass-api.de/api/interpreter`, {
      body: `data=${overpassQuery}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });
  };

  let response = await performFetch();

  if (!response.ok) {
    if (response.status >= 500 && response.status < 600) {
      // Retry if it makes sense
      if (response.status === 504) {
        response = await performFetch();
        // Still failed?
        if (!response.ok) {
          throw new Error(
            `Failed to retrieve street data. Third-party OpenStreetMap data provider (Overpass) has timed out (${response.status}). We have tried twice. They could be experiencing a temporary outage, please try again later`,
          );
        }
      } else {
        throw new Error(
          `Failed to retrieve street data. Third-party OpenStreetMap data provider (Overpass) has errored (${response.status}). They could be experiencing a temporary outage, please try again later`,
        );
      }
    } else {
      throw new Error(
        `Failed to retrieve street data from third-party OpenStreetMap data provider (Overpass) (${response.status})`,
      );
    }
  }

  let result;
  try {
    result = await response.json();
  } catch (e) {
    throw new Error(
      "Cannot parse street data from third-party OpenStreetMap data provider (Overpass)",
    );
  }

  if (shouldCacheResponseInBrowser) {
    ignoreError(() =>
      localStorage.setItem(localStorageKey, JSON.stringify(result)),
    );
  }

  return result;
};

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

export default async ({
  areaSelection,
  difficulty,
  getRandomNumber,
  numberOfQuestions,
}: {
  areaSelection: AreaSelection;
  difficulty: Difficulty;
  getRandomNumber: () => number;
  numberOfQuestions: number;
}): Promise<Question["target"][]> => {
  // Get the data
  const { elements } = (await load({
    areaSelection,
  })) as Overpass.Response;

  const results = [];

  // Pot for drawing streets from.
  const pot: { [key: string]: Overpass.Element } = {};

  // Iterate through all items, filter them based on the exclusion criteria
  // and add them to the pot without duplicates.
  for (const element of elements) {
    const key = element.tags.name?.toLowerCase();

    if (
      (difficulty === Difficulty.MajorStateRoads &&
        !(element.tags?.ref && usMajorStateRoadRegex.test(element.tags.ref))) ||
      exclusions.some((exclusion) => {
        if (
          element.tags.highway &&
          exclusion.highways &&
          !exclusion.highways.includes(element.tags.highway)
        ) {
          return false;
        }
        if (exclusion.name instanceof RegExp) {
          return exclusion.name.test(key);
        }
        return exclusion.name === key;
      }) ||
      (difficulty in difficultiesToHighwayCategories &&
        element.tags.highway &&
        !difficultiesToHighwayCategories[difficulty].includes(
          element.tags.highway,
        )) ||
      (difficulty !== Difficulty.TaxiDriver &&
        element.tags.access === "private")
    ) {
      continue;
    }

    pot[key] = element;
  }

  for (let i = 0; i < numberOfQuestions; i++) {
    // Pick a random street from the pot.
    const key = getRandomItem(Object.keys(pot), getRandomNumber);

    /*
      This will happen if there are less than the desired amount of (uniquely named) streets in the area.
      It's the caller's responsibility to handle this case.
    */
    if (!key) {
      break;
    }

    // Add the street to the results.
    results.push(pot[key]);

    // Remove the street from the pot.
    delete pot[key];
  }

  // Convert to our type, join with other streets of the same name, etc.
  return results.map((result) => adjustStreetDetails(result, elements));
};
