/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Project: Back Of Your Hand (https://backofyourhand.com)
 * Repository: https://github.com/adam-lynch/back-of-your-hand
 * Copyright © 2025 Adam Lynch (https://adamlynch.com)
 */

import pluralize from "../../utilities/pluralize";
import { isOrganizationUrl } from "../../userData/store";
import { get } from "svelte/store";
import roundNumber from "../../utilities/roundNumber";

const FEET_PER_METRE = 3.28084;
const FEET_PER_MILE = 5280;
const METRES_PER_KILOMETRE = 1000;

type UnitDescription = {
  name: string;
  maximumAmountToShow?: number;
  amountPerLargerUnit?: number;
  numberOfDecimalPlacesToRoundTo?: number;
  pluralizedName?: string;
};

export default function prettifyDistance(distanceInMetres: number): string {
  const unitClass = get(isOrganizationUrl) ? "imperial" : "metric";

  let amount =
    unitClass === "imperial"
      ? distanceInMetres * FEET_PER_METRE
      : distanceInMetres;

  const unitDescriptions: UnitDescription[] =
    unitClass === "metric"
      ? [
          {
            name: "metre",
            maximumAmountToShow: METRES_PER_KILOMETRE * 0.75,
            amountPerLargerUnit: METRES_PER_KILOMETRE,
          },
          {
            name: "kilometre",
            numberOfDecimalPlacesToRoundTo: 1,
          },
        ]
      : [
          {
            name: "foot",
            maximumAmountToShow: FEET_PER_MILE * 0.75,
            amountPerLargerUnit: FEET_PER_MILE,
            pluralizedName: "feet",
          },
          {
            name: "mile",
            numberOfDecimalPlacesToRoundTo: 1,
          },
        ];

  let unitDescriptionToUse = unitDescriptions[0];

  if (
    unitDescriptionToUse.maximumAmountToShow &&
    unitDescriptionToUse.amountPerLargerUnit &&
    amount > unitDescriptionToUse.maximumAmountToShow
  ) {
    amount = amount / unitDescriptionToUse.amountPerLargerUnit;
    unitDescriptionToUse = unitDescriptions[1];
  }

  amount = roundNumber(
    amount,
    unitDescriptionToUse.numberOfDecimalPlacesToRoundTo ?? 0,
  );

  let suffix = unitDescriptionToUse.name;

  if (amount !== 1) {
    suffix =
      unitDescriptionToUse.pluralizedName ||
      pluralize(unitDescriptionToUse.name);
  }

  return `${amount.toLocaleString()} ${suffix}`;
}
