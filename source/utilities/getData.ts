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
    isEnclosedArea: isElementAnEnclosedArea(targetElement, points),
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

  const response = await fetch(`https://www.overpass-api.de/api/interpreter`, {
    body: `data=${overpassQuery}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  let result;
  try {
    result = await response.json();
  } catch (e) {
    throw new Error("Cannot parse Overpass API response");
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

  let spatialModifier = "";
  if (areaSelection.presetShape === PresetAreaShape.Circle) {
    const centerLatLng = convertPositionToLatLng(
      getCenterOfFeature(areaSelection.feature),
    );
    const aroundValue = `${areaSelection.radius},${centerLatLng.lat},${capLng(
      centerLatLng.lng,
    )}`;
    spatialModifier = `(around:${aroundValue})`;
  } else if (areaSelection.presetShape === PresetAreaShape.Polygon) {
    const polyModifierValue = areaSelection.feature.geometry.coordinates[0]
      .map(([lng, lat]) => `${lat} ${lng}`)
      .join(" ");
    spatialModifier = `(poly:"${polyModifierValue}")`;
  } else {
    spatialModifier = `(${bboxString})`;
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
  const overpassQuery = [
    `[out:json][bbox:${bboxString}];`,
    `(`,
    `way${spatialModifier}[highway~"${highwayRegex}"][name];`,
    `way${spatialModifier}[historic~"^(castle|fort|monument|ruins|ship|tower)$"][name][wikidata];`,
    `way${spatialModifier}[tourism~"^(aquarium|museum|zoo)$"][name][wikidata];`,
    `);`,
    `out%20tags%20geom;`,
  ].join("");

  return overpassQuery;
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
      (element.tags.highway &&
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
