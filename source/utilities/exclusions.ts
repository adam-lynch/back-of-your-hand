/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

const initialExclusions: {
  highways?: string[]; // default: all
  name: string | RegExp; // must be lowercase
}[] = [
  { name: "alley" },
  { name: "buses and taxis" },
  { name: "drive thru" },
  { name: "escalator" },
  { name: "treppe tiefgarage" }, // Stairs to the underground parking garage
  { name: "tunnel entrance street" },
  { name: "zugang steig" }, // entranceway / access climb
  {
    highways: ["service"],
    name: /^[0-9]+$/,
  },
  {
    highways: ["service"],
    name: /not in use/,
  },
];

const EXCLUSIONS_KEY = "street_exclusions";

const saveExclusionsToLocalStorage = (exclusions: typeof initialExclusions) => {
  localStorage.setItem(EXCLUSIONS_KEY, JSON.stringify(exclusions));
};

const getExclusionsFromLocalStorage = (): typeof initialExclusions => {
  const storedExclusions = localStorage.getItem(EXCLUSIONS_KEY);
  return storedExclusions ? JSON.parse(storedExclusions) : initialExclusions;
};

const addExclusion = (exclusion: { highways?: string[]; name: string }) => {
  const exclusions = getExclusionsFromLocalStorage();

  // Check for duplicate exclusions
  const isDuplicate = exclusions.some(
    (existingExclusion) =>
      existingExclusion.name.toString() === exclusion.name.toString() &&
      (existingExclusion.highways || []).sort().join(",") ===
        (exclusion.highways || []).sort().join(","),
  );

  if (!isDuplicate) {
    exclusions.push(exclusion);
    saveExclusionsToLocalStorage(exclusions);
  }
};

const removeExclusion = (index: number) => {
  const exclusions = getExclusionsFromLocalStorage();
  if (index >= 0 && index < exclusions.length) {
    exclusions.splice(index, 1);
    saveExclusionsToLocalStorage(exclusions);
  }
};

export {
  initialExclusions,
  getExclusionsFromLocalStorage,
  addExclusion,
  removeExclusion,
};

export default getExclusionsFromLocalStorage;
