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

// Convert to our type, join with other streets of the same name, etc.
const adjustStreetDetails = (
  targetElement: Overpass.Element,
  allTargetElements: Overpass.Element[]
): Question["target"] => {
  // Group all streets with the same name
  const equivalentTargets = [
    targetElement,
    ...allTargetElements.filter(
      (element) =>
        element.id !== targetElement.id &&
        element.tags.name === targetElement.tags.name
    ),
  ];

  const points = equivalentTargets.map(({ geometry }) =>
    geometry.map(convertOverpassLatLngtoLatLng)
  );

  let width: number;
  const widths = equivalentTargets.map(({ tags }) => {
    // Parse width; see https://wiki.openstreetmap.org/wiki/Key:width
    const match = tags.width?.match(/^(\d+(\.\d+)?)( ?m)?$/);
    if (match) {
      return parseFloat(match[1]);
    }
  });
  if (widths.filter((width) => typeof width === "number").length) {
    // Average
    width = widths.reduce((a, b) => a + b, 0) / widths.length;
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
  difficulty,
  radius,
}: {
  areaBounds: leaflet.LatLngBounds;
  centerLatLng: LatLng;
  difficulty: Difficulty;
  radius: number;
}) => {
  // Setting the bounding box is important. It massively speeds up the query
  const numberOfDecimalPointsToConsider = 4;
  let bboxValue = [
    roundNumber(areaBounds.getNorthWest().lat, numberOfDecimalPointsToConsider),
    roundNumber(
      capLng(areaBounds.getNorthWest().lng),
      numberOfDecimalPointsToConsider
    ),
    roundNumber(areaBounds.getSouthEast().lat, numberOfDecimalPointsToConsider),
    roundNumber(
      capLng(areaBounds.getSouthEast().lng),
      numberOfDecimalPointsToConsider
    ),
  ].join(",");

  const aroundValue = `${radius},${centerLatLng.lat},${capLng(
    centerLatLng.lng
  )}`;

  // We don't want highway=bus_stop, for example
  const highwayValuesAllowed = ["motorway", "primary", "secondary", "trunk"];

  /*
    Kift's Lane in Cork is broken into two ways in OSM; one highway=service and the other highway=cycleway.
    This particular case just be a mistake (I think the cycleway one could safely be deleted). To be safe,
    we exclude [access=private] for highways unless the difficulty is set to the maximum level (where both
    would be returned from the query and joined together). It makes sense that tourists/residents wouldn't
    know of inaccessible ways anyway.
  */
  let highwayQuerySuffix = '[access!="private"]';
  if (difficulty !== Difficulty.Tourist) {
    highwayValuesAllowed.push("cycleway", "tertiary");
    if (difficulty === Difficulty.TaxiDriver) {
      highwayQuerySuffix = "";
      highwayValuesAllowed.push(
        "living_street",
        "pedestrian",
        "residential",
        "service",
        "steps",
        "unclassified"
      );
    }
  }
  const highwayRegex = `^(${highwayValuesAllowed.join("||")})$`;

  /*
    This queries Overpass using the Overpass query lanaguage. It's basically saying give me all
    streets with a name within N metres around M center point. It also specifies the minimal
    properties we need in the response.
  */
  const urlPath = [
    `api/interpreter?data=[out:json][bbox:${bboxValue}];`,
    `(`,
    `way(around:${aroundValue})[highway~"${highwayRegex}"][name]${highwayQuerySuffix};`,
    `way(around:${aroundValue})[historic~"^(castle|fort|monument|ruins|ship|tower)$"][name][wikidata];`,
    `way(around:${aroundValue})[tourism~"^(aquarium|museum|zoo)$"][name][wikidata];`,
    `);`,
    `out%20tags%20geom;`,
  ].join("");

  // If the query changes, the "cache" is automatically skipped
  const localStorageKeyPrefix = `overpass-response--${difficulty}__`;
  const localStorageKey = `${localStorageKeyPrefix}${urlPath})`;
  const responseFromLocalStorage = ignoreError(() =>
    localStorage.getItem(localStorageKey)
  );

  // Prune localStorage
  Object.entries(ignoreError(() => localStorage) || {})
    .map(([key]) => key)
    .filter(
      (key) =>
        (key !== localStorageKey && key.startsWith(localStorageKeyPrefix)) ||
        key.startsWith("overpass-response__") // the old format before difficulty was introduced
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
    localStorage.setItem(localStorageKey, JSON.stringify(result))
  );
  return result;
};

export default async ({
  areaBounds,
  centerLatLng,
  difficulty,
  radius,
  getRandomNumber,
  numberOfStreets,
}: {
  areaBounds: leaflet.LatLngBounds;
  centerLatLng: LatLng;
  difficulty: Difficulty;
  radius: number;
  getRandomNumber: () => number;
  numberOfStreets: number;
}): Promise<Question["target"][]> => {
  // Get the data
  const { elements } = (await load({
    areaBounds,
    centerLatLng,
    difficulty,
    radius,
  })) as Overpass.Response;

  const results = [];
  const namesToExclude = exclusions;

  // Pot for drawing streets from.
  const pot = {};

  // Iterate through all items, filter them based on the exclusion criteria
  // and add them to the pot without duplicates.
  for (let element of elements) {
    const key = element.tags.name?.toLowerCase();

    if (!namesToExclude.includes(key)) {
      pot[key] = element;
    }
  }

  for (let i = 0; i < numberOfStreets; i++) {
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
