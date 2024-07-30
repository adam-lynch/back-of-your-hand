/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

import type leaflet from "leaflet";

import convertOverpassLatLngtoLatLng from "./convertOverpassLatLngtoLatLng";
import getRandomItem from "./getRandomItem";
import ignoreError from "./ignoreError";
import exclusions from "./exclusions";
import capLng from "./capLng";
import isElementAnEnclosedArea from "./isElementAnEnclosedArea";
import getNamesFromElement from "./getNamesFromElement";
import roundNumber from "./roundNumber";
import type { LatLng, Overpass, Question } from "./types";
import { Difficulty } from "./types";

const difficultiesToHighwayCategories: { [difficulty: string]: string[] } = {
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

// Actually get the data. Try localStorage, fallback to hitting OpenStreetMap's Overpass API
const load = async ({
  areaBounds,
  centerLatLng,
  radius,
}: {
  areaBounds: leaflet.LatLngBounds;
  centerLatLng: LatLng;
  radius: number;
}) => {
  // Setting the bounding box is important. It massively speeds up the query
  const numberOfDecimalPointsToConsider = 4;
  const bboxValue = [
    roundNumber(areaBounds.getNorthWest().lat, numberOfDecimalPointsToConsider),
    roundNumber(
      capLng(areaBounds.getNorthWest().lng),
      numberOfDecimalPointsToConsider,
    ),
    roundNumber(areaBounds.getSouthEast().lat, numberOfDecimalPointsToConsider),
    roundNumber(
      capLng(areaBounds.getSouthEast().lng),
      numberOfDecimalPointsToConsider,
    ),
  ].join(",");

  const aroundValue = `${radius},${centerLatLng.lat},${capLng(
    centerLatLng.lng,
  )}`;

  const highwayCategories = Object.values(difficultiesToHighwayCategories)
    .map((categories) => categories)
    .flat();
  const highwayRegex = `^(${highwayCategories.join("||")})$`;

  /*
    This queries Overpass using the Overpass query lanaguage. It's basically saying give me all
    streets with a name within N metres around M center point. It also specifies the minimal
    properties we need in the response.
  */
  const urlPath = [
    `api/interpreter?data=[out:json][bbox:${bboxValue}];`,
    `(`,
    `way(around:${aroundValue})[highway~"${highwayRegex}"][name];`,
    `way(around:${aroundValue})[historic~"^(castle|fort|monument|ruins|ship|tower)$"][name][wikidata];`,
    `way(around:${aroundValue})[tourism~"^(aquarium|museum|zoo)$"][name][wikidata];`,
    `);`,
    `out%20tags%20geom;`,
  ].join("");

  // If the query changes, the "cache" is automatically skipped
  const localStorageKey = `overpass-response2__${urlPath})`;
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

  const response = await fetch(`https://www.overpass-api.de/${urlPath}`);
  let result;
  try {
    result = await response.json();
  } catch (e) {
    throw new Error("Cannot parse Overpass API response");
  }
  ignoreError(() =>
    localStorage.setItem(localStorageKey, JSON.stringify(result)),
  );
  return result;
};

export default async ({
  areaBounds,
  centerLatLng,
  difficulty,
  radius,
  getRandomNumber,
  numberOfQuestions,
}: {
  areaBounds: leaflet.LatLngBounds;
  centerLatLng: LatLng;
  difficulty: Difficulty;
  radius: number;
  getRandomNumber: () => number;
  numberOfQuestions: number;
}): Promise<Question["target"][]> => {
  // Get the data
  const { elements } = (await load({
    areaBounds,
    centerLatLng,
    radius,
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
