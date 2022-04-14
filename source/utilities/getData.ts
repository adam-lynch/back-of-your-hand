import convertOverpassLatLngtoLatLng from "./convertOverpassLatLngtoLatLng";
import getRandomItem from "./getRandomItem";
import type { LatLng, Overpass, Question } from "./types";

import ignoreError from "./ignoreError";
import exclusions from "./exclusions";
import capLng from "./capLng";
import getNamesFromElement from "./getNamesFromElement";
import roundNumber from "./roundNumber";

// Convert to our type, join with other streets of the same name, etc.
const adjustStreetDetails = (
  streetElement: Overpass.Element,
  allStreetElements: Overpass.Element[]
): Question["street"] => {
  // Group all streets with the same name
  const equivalentStreets = [
    streetElement,
    ...allStreetElements.filter(
      (element) =>
        element.id !== streetElement.id &&
        element.tags.name === streetElement.tags.name
    ),
  ];

  const points = equivalentStreets.map(({ geometry }) =>
    geometry.map(convertOverpassLatLngtoLatLng)
  );

  let width: number;
  const widths = equivalentStreets.map(({ tags }) => {
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
    ...getNamesFromElement(streetElement),
    points,
    width,
  };
};

// Actually get the data. Try localStorage, fallback to hitting OpenStreetMap's Overpass API
const load = async (areaBounds, centerLatLng: LatLng, radius: number) => {
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

  // We don't want highway=bus_stop, for example
  const highwayValuesAllowed = [
    "cycleway",
    "living_street",
    "motorway",
    "pedestrian",
    "primary",
    "residential",
    "secondary",
    "service",
    "steps",
    "tertiary",
    "trunk",
    "unclassified",
  ];
  const highwayRegex = `^(${highwayValuesAllowed.join("||")})$`;

  /*
    This queries Overpass using the Overpass query lanaguage. It's basically saying give me all
    streets with a name within N metres around M center point. It also specifies the minimal
    properties we need in the response.
  */
  const urlPath = `api/interpreter?data=[out:json][bbox:${bboxValue}];(way(around:${radius},${
    centerLatLng.lat
  },${capLng(
    centerLatLng.lng
  )})[highway~"${highwayRegex}"][name];);out%20tags%20geom;`;

  // If the query changes, the "cache" is automatically skipped
  const localStorageKey = `overpass-response__${urlPath})`;
  const responseFromLocalStorage = ignoreError(() =>
    localStorage.getItem(localStorageKey)
  );

  // Prune localStorage
  Object.entries(localStorage)
    .map(([key]) => key)
    .filter(
      (key) => key !== localStorageKey && key.startsWith("overpass-response__")
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

export default async (
  areaBounds,
  centerLatlng: LatLng,
  radius: number,
  getRandomNumber: () => number,
  numberOfStreets: number
): Promise<Question["street"][]> => {
  // Get the data
  const { elements } = (await load(
    areaBounds,
    centerLatlng,
    radius
  )) as Overpass.Response;

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
