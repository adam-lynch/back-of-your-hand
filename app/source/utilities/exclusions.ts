/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2024 Adam Lynch (https://adamlynch.com)
 */

const exclusions: {
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

export default exclusions;
